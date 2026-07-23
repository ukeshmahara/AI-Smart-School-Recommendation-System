import Link from "next/link";
import { School as SchoolIcon, MapPin } from "lucide-react";
import { categoryLabel, streamLabel } from "./constants";
import FavoriteButton from "./FavoriteButton";
import CompareCheckbox from "./CompareCheckbox";
import { getImageUrl } from "@/lib/image-url";

interface School {
    _id: string;
    name: string;
    location: string;
    category: string;
    streamsOffered: string[];
    fees: number;
    image?: string;
}

interface Props {
    schools: School[];
    favoritedIds?: Set<string>;
}

export default function SchoolGrid({ schools, favoritedIds = new Set() }: Props) {
    if (schools.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white py-16 text-center">
                <SchoolIcon className="h-8 w-8 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">No schools found</p>
                <p className="text-xs text-gray-400">Try a different search or filter.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {schools.map((school) => (
                <div key={school._id} className="relative rounded-xl border border-gray-100 bg-white p-4">
                    <Link href={`/dashboard/schools/${school._id}`} className="block transition-colors">
                        <div className="absolute right-6 top-6 z-10">
                            <FavoriteButton
                                schoolId={school._id}
                                initialFavorited={favoritedIds.has(school._id)}
                                size="sm"
                            />
                        </div>
                        <div className="mb-3 h-32 w-full overflow-hidden rounded-lg bg-gray-100">
                            {school.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={getImageUrl(school.image)}
                                    alt={school.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-gray-300">
                                    <SchoolIcon className="h-8 w-8" />
                                </div>
                            )}
                        </div>
                        <p className="pr-8 font-semibold text-gray-900">{school.name}</p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" /> {school.location}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                {categoryLabel(school.category)}
                            </span>
                            {school.streamsOffered.map((s) => (
                                <span
                                    key={s}
                                    className="rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700"
                                >
                                    {streamLabel(s)}
                                </span>
                            ))}
                        </div>
                        <p className="mt-3 text-sm font-semibold text-gray-900">
                            Rs {school.fees.toLocaleString()} <span className="font-normal text-gray-400">/ year</span>
                        </p>
                    </Link>
                    <div className="mt-3">
                        <CompareCheckbox schoolId={school._id} />
                    </div>
                </div>
            ))}
        </div>
    );
}