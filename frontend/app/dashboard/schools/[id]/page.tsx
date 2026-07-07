import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Mail, Globe, School as SchoolIcon } from "lucide-react";
import { handleGetSchoolById } from "@/lib/actions/school-action";
import { categoryLabel, streamLabel } from "../_components/constants";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function SchoolDetailPage({ params }: PageProps) {
    const { id } = await params;
    const result = await handleGetSchoolById(id);

    if (!result.success || !result.data) {
        return (
            <main className="mx-auto max-w-3xl px-6 py-16 text-center">
                <SchoolIcon className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-3 text-sm font-medium text-gray-500">School not found</p>
                <Link href="/dashboard/schools" className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline">
                    Back to browse schools
                </Link>
            </main>
        );
    }

    const school = result.data;

    return (
        <main className="mx-auto max-w-4xl px-6 py-8">
            <Link
                href="/dashboard/schools"
                className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to schools
            </Link>

            <div className="mb-6 h-56 w-full overflow-hidden rounded-2xl bg-gray-100">
                {school.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={`${API_BASE_URL}${school.image}`}
                        alt={school.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-300">
                        <SchoolIcon className="h-12 w-12" />
                    </div>
                )}
            </div>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{school.name}</h1>
                    <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" /> {school.location}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {categoryLabel(school.category)}
                        </span>
                        {school.streamsOffered?.map((s: string) => (
                            <span key={s} className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                                {streamLabel(s)}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="text-left sm:text-right">
                    <p className="text-xs text-gray-400">Annual fees</p>
                    <p className="text-xl font-bold text-gray-900">Rs {school.fees.toLocaleString()}</p>
                </div>
            </div>

            <div className="mt-6 rounded-xl border border-gray-100 bg-white p-5">
                <h2 className="mb-2 text-sm font-bold text-gray-900">About the school</h2>
                <p className="text-sm leading-relaxed text-gray-600">
                    {school.description || "No description has been added for this school yet."}
                </p>
            </div>

            {school.facilities && school.facilities.length > 0 && (
                <div className="mt-4 rounded-xl border border-gray-100 bg-white p-5">
                    <h2 className="mb-3 text-sm font-bold text-gray-900">Facilities</h2>
                    <div className="flex flex-wrap gap-2">
                        {school.facilities.map((f: string) => (
                            <span key={f} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                {f}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {(school.contactPhone || school.contactEmail || school.contactWebsite) && (
                <div className="mt-4 rounded-xl border border-gray-100 bg-white p-5">
                    <h2 className="mb-3 text-sm font-bold text-gray-900">Contact</h2>
                    <div className="flex flex-col gap-2 text-sm text-gray-600">
                        {school.contactPhone && (
                            <span className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-blue-700" /> {school.contactPhone}
                            </span>
                        )}
                        {school.contactEmail && (
                            <span className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-blue-700" /> {school.contactEmail}
                            </span>
                        )}
                        {school.contactWebsite && (
                            <span className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-blue-700" /> {school.contactWebsite}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}