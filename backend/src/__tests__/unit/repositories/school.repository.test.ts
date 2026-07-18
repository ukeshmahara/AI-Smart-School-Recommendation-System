import { SchoolMongoRepository } from "../../../repositories/school.repository";
import { SchoolModel } from "../../../models/school.model";

describe("Unit: SchoolMongoRepository", () => {
    const schoolRepository = new SchoolMongoRepository();

    beforeAll(async () => {
        await SchoolModel.deleteMany({});

        await SchoolModel.create([
            {
                name: "Trinity International College",
                location: "Kathmandu",
                category: "private",
                streamsOffered: ["science", "management"],
                fees: 220000,
            },
            {
                name: "Mid Valley",
                location: "Kathmandu",
                category: "private",
                streamsOffered: ["science"],
                fees: 30000, // should count as budget-friendly
            },
            {
                name: "Bal Mandir School",
                location: "Lalitpur",
                category: "public",
                streamsOffered: ["humanities"],
                fees: 45000, // should count as budget-friendly
            },
        ]);
    });

    test("should create a school", async () => {
        const school = await schoolRepository.create({
            name: "Test Postman School",
            location: "Kathmandu",
            category: "private",
            streamsOffered: ["science"],
            fees: 55000,
        } as any);

        expect(school).toBeDefined();
        expect(school).toHaveProperty("_id");
        expect(school.name).toBe("Test Postman School");
    });

    test("should filter schools by category", async () => {
        const results = await schoolRepository.findAll(1, 10, "", "public", "");
        expect(results.length).toBeGreaterThan(0);
        results.forEach((school) => {
            expect(school.category).toBe("public");
        });
    });

    test("should filter schools by stream", async () => {
        const results = await schoolRepository.findAll(1, 10, "", "", "science");
        expect(results.length).toBeGreaterThan(0);
        results.forEach((school) => {
            expect(school.streamsOffered).toContain("science");
        });
    });

    test("should treat budget_friendly as a derived filter based on fees, not a stored field", async () => {
        const results = await schoolRepository.findAll(1, 10, "", "budget_friendly", "");
        expect(results.length).toBeGreaterThan(0);
        results.forEach((school) => {
            expect(school.fees).toBeLessThanOrEqual(50000);
            expect(school.category).not.toBe("budget_friendly"); // it's never actually stored as this
        });
    });

    test("should count schools by category including derived budget_friendly count", async () => {
        const counts = await schoolRepository.countByCategory();
        expect(counts.private).toBeGreaterThanOrEqual(2);
        expect(counts.public).toBeGreaterThanOrEqual(1);
        expect(counts.budget_friendly).toBeGreaterThanOrEqual(2); // Mid Valley + Bal Mandir School
    });
});