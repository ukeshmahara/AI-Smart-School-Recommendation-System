import Link from "next/link";
import { ArrowLeft, School as SchoolIcon } from "lucide-react";
import { handleGetSchoolById } from "@/lib/actions/school-action";
import { categoryLabel, streamLabel } from "../schools/_components/constants";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

interface PageProps {
    searchParams: Promise<{ ids?: string }>;
}

export default async function ComparePage({ searchParams }: PageProps) {
    const params = await searchParams;
    const ids = (params.ids || "").split(",").filter(Boolean);

    if (ids.length < 2) {
        return (
            <main className="mx-auto max-w-3xl px-6 py-16 text-center">
                <SchoolIcon className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-3 text-sm font-medium text-gray-500">Select at least 2 schools to compare</p>
                <Link href="/dashboard/schools" className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline">
                    Back to browse schools
                </Link>
            </main>
        );
    }

    const results = await Promise.all(ids.map((id) => handleGetSchoolById(id)));
    const schools = results.filter((r) => r.success && r.data).map((r) => r.data as any);

    if (schools.length < 2) {
        return (
            <main className="mx-auto max-w-3xl px-6 py-16 text-center">
                <SchoolIcon className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-3 text-sm font-medium text-gray-500">Couldn&apos;t load enough schools to compare</p>
                <Link href="/dashboard/schools" className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline">
                    Back to browse schools
                </Link>
            </main>
        );
    }

    const rows = [
        { label: "Location", render: (s: any) => s.location },
        { label: "Category", render: (s: any) => categoryLabel(s.category) },
        {
            label: "Streams Offered",
            render: (s: any) => s.streamsOffered?.map((st: string) => streamLabel(st)).join(", ") || "-",
        },
        { label: "Annual Fees", render: (s: any) => `Rs ${s.fees.toLocaleString()}` },
        {
            label: "Facilities",
            render: (s: any) => (s.facilities && s.facilities.length > 0 ? s.facilities.join(", ") : "-"),
        },
        { label: "Phone", render: (s: any) => s.contactPhone || "-" },
        { label: "Email", render: (s: any) => s.contactEmail || "-" },
    ];

    return (
        <main className="mx-auto max-w-6xl px-6 py-8">
            <Link
                href="/dashboard/schools"
                className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline"
            >
                <ArrowLeft className="h-4 w-4" /> Back to schools
            </Link>

            <h1 className="mb-6 text-2xl font-bold text-gray-900">Compare Schools</h1>

            <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
                <table className="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr>
                            <th className="w-40 border-b border-gray-100 p-4"></th>
                            {schools.map((school) => (
                                <th key={school._id} className="min-w-[200px] border-b border-l border-gray-100 p-4">
                                    <div className="mb-2 h-24 w-full overflow-hidden rounded-lg bg-gray-100">
                                        {school.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={`${API_BASE_URL}${school.image}`}
                                                alt={school.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-gray-300">
                                                <SchoolIcon className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-semibold text-gray-900">{school.name}</p>
                                    <Link
                                        href={`/dashboard/schools/${school._id}`}
                                        className="mt-1 inline-block text-xs font-medium text-blue-700 hover:underline"
                                    >
                                        View details
                                    </Link>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.label}>
                                <td className="border-b border-gray-50 p-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    {row.label}
                                </td>
                                {schools.map((school) => (
                                    <td key={school._id} className="border-b border-l border-gray-50 p-4 text-sm text-gray-700">
                                        {row.render(school)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}