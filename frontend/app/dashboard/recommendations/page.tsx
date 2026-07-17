import PreferenceForm from "./_components/PreferenceForm";

export default function RecommendationsPage() {
    return (
        <main className="mx-auto max-w-2xl px-6 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">AI School Recommendation</h1>
            <PreferenceForm />
        </main>
    );
}