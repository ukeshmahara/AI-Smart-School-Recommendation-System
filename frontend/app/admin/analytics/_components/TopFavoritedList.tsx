import { Heart, School as SchoolIcon } from "lucide-react";

interface Props {
    data: { schoolId: string; name: string; favoriteCount: number }[];
}

export default function TopFavoritedList({ data }: Props) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold text-gray-900">Most Favorited Schools</h2>
            {data.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">No favorites yet</p>
            ) : (
                <div className="space-y-3">
                    {data.map((item, index) => (
                        <div key={item.schoolId} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
                                    {index + 1}
                                </span>
                                <span className="flex items-center gap-1.5 text-sm text-gray-700">
                                    <SchoolIcon className="h-3.5 w-3.5 text-gray-400" />
                                    {item.name}
                                </span>
                            </div>
                            <span className="flex items-center gap-1 text-xs font-semibold text-red-500">
                                <Heart className="h-3.5 w-3.5 fill-red-500" />
                                {item.favoriteCount}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}