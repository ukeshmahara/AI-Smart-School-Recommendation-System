"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import ContactSchoolModal from "./ContactSchoolModal";

interface Props {
    schoolId: string;
    schoolName: string;
    studentName: string;
}

export default function ContactSchoolButton({ schoolId, schoolName, studentName }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
                <MessageSquare className="h-4 w-4" />
                Contact school
            </button>

            {isOpen && (
                <ContactSchoolModal
                    schoolId={schoolId}
                    schoolName={schoolName}
                    studentName={studentName}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}