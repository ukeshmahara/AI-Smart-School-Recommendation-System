import { z } from "zod";
import { SchoolMongoRepository } from "../repositories/school.repository";
import { RecommendationPreferences, RecommendationResultSchema } from "../types/recommendation.type";
import { geminiClient, GEMINI_MODEL } from "../configs/gemini";
import { HttpException } from "../exceptions/http-exception";

const schoolRepository = new SchoolMongoRepository();
const CANDIDATE_LIMIT = 20;
const MAX_RETRIES = 1;

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export class RecommendationService {
    async getRecommendations(preferences: RecommendationPreferences) {
        // Step 1: fetch real candidate schools from the database using hard constraints
        const candidates = await schoolRepository.findAll(
            1,
            CANDIDATE_LIMIT,
            preferences.location || "",
            "",
            preferences.stream,
            preferences.minFee,
            preferences.maxFee,
            "fees_asc"
        );

        if (candidates.length === 0) {
            return { recommendations: [], usedAi: false };
        }

        try {
            const aiResult = await this.getAiRankedRecommendationsWithRetry(candidates, preferences);
            return { recommendations: aiResult, usedAi: true };
        } catch (error) {
            console.error("Gemini recommendation failed after retries, falling back to plain filter:", error);
            // Fallback: just return the filtered candidates without AI reasoning
            const fallback = candidates.slice(0, 5).map((school) => ({
                schoolId: String(school._id),
                matchScore: 70,
                reasoning: "Matches your stream and budget preferences.",
                school,
            }));
            return { recommendations: fallback, usedAi: false };
        }
    }

    private async getAiRankedRecommendationsWithRetry(candidates: any[], preferences: RecommendationPreferences) {
        let lastError: any;
        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                return await this.getAiRankedRecommendations(candidates, preferences);
            } catch (error: any) {
                lastError = error;
                const isRetryable = error?.status === 503 || error?.status === 429;
                if (!isRetryable || attempt === MAX_RETRIES) {
                    throw error;
                }
                const delayMs = 500 * Math.pow(2, attempt); // 500ms
                console.warn(`Gemini call failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}), retrying in ${delayMs}ms...`);
                await sleep(delayMs);
            }
        }
        throw lastError;
    }

    private async getAiRankedRecommendations(candidates: any[], preferences: RecommendationPreferences) {
        const candidateSummaries = candidates.map((s) => ({
            id: String(s._id),
            name: s.name,
            location: s.location,
            category: s.category,
            streamsOffered: s.streamsOffered,
            fees: s.fees,
            facilities: s.facilities || [],
            description: s.description || "",
        }));

        const prompt = `You are a school recommendation assistant for high school students in Nepal.
A student has the following preferences:
- Preferred stream: ${preferences.stream}
- Budget: Rs ${preferences.minFee} to Rs ${preferences.maxFee} per year
- Preferred location: ${preferences.location || "no strong preference"}
- Additional notes: ${preferences.notes || "none"}

Here is a list of real schools currently available (only recommend from this list, do not invent any school):
${JSON.stringify(candidateSummaries, null, 2)}

Select the best 3 to 5 schools for this student from the list above, ranked by how well they fit.
For each one, give a matchScore from 0 to 100 and a short 1-2 sentence reasoning explaining why it fits.
Only use the exact "id" values given above for schoolId.`;

        const response = await geminiClient.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        recommendations: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    schoolId: { type: "STRING" },
                                    matchScore: { type: "NUMBER" },
                                    reasoning: { type: "STRING" },
                                },
                                required: ["schoolId", "matchScore", "reasoning"],
                            },
                        },
                    },
                    required: ["recommendations"],
                },
            },
        });

        const parsed = RecommendationResultSchema.safeParse(JSON.parse(response.text || "{}"));
        if (!parsed.success) {
            throw new HttpException(500, "Failed to parse AI recommendation response");
        }

        // Safety check: only keep recommendations that reference a real candidate school
        const candidateIds = new Set(candidates.map((s) => String(s._id)));
        const validRecommendations = parsed.data.recommendations.filter((r) => candidateIds.has(r.schoolId));

        return validRecommendations.map((rec) => {
            const school = candidates.find((s) => String(s._id) === rec.schoolId);
            return { ...rec, school };
        });
    }
}