import { handleGetFavorites } from "@/lib/actions/favorite-action";
import SchoolGrid from "../schools/_components/SchoolGrid";

export default async function FavoritesPage() {
    const result = await handleGetFavorites();
    const favoritedIds = new Set(result.data.map((s: any) => s._id));

    return (
        <main className="mx-auto max-w-6xl px-6 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">My Favorites</h1>
            <SchoolGrid schools={result.data} favoritedIds={favoritedIds} />
        </main>
    );
}