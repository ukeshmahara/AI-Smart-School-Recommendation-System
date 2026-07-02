import Image from "next/image";
import Logo from "@/app/_components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="min-h-screen flex items-center justify-center p-6"
            style={{
                backgroundImage: "url('/background.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Floating card */}
            <div className="w-full max-w-5xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white">

                {/* Left panel */}
                <div
                    className="hidden lg:flex lg:w-[45%] flex-col p-10 relative overflow-hidden"
                    style={{ backgroundColor: "#EEF3FB" }}
                >
                    {/* Dot grid top-left */}
                    <div className="absolute top-16 left-12">
                        <DotGrid />
                    </div>

                    {/* Dot grid bottom-right */}
                    <div className="absolute bottom-16 right-10">
                        <DotGrid />
                    </div>

                    {/* Small circles */}
                    <div className="absolute top-24 right-20 h-4 w-4 rounded-full border-2 border-blue-200 opacity-70" />
                    <div className="absolute top-48 left-8 h-3 w-3 rounded-full border-2 border-blue-200 opacity-50" />
                    <div className="absolute bottom-48 right-12 h-3 w-3 rounded-full border-2 border-blue-200 opacity-60" />
                    <div className="absolute bottom-28 left-16 h-2 w-2 rounded-full bg-blue-200 opacity-50" />

                    {/* Graduation cap icon - top left area */}
                    <div className="absolute top-32 left-6 opacity-20">
                        <GraduationCapIcon />
                    </div>

                    {/* Book icon - bottom left */}
                    <div className="absolute bottom-20 left-8 opacity-15">
                        <BookIcon />
                    </div>

                    {/* Leaf left */}
                    <div className="absolute bottom-36 left-4 opacity-20">
                        <LeafIcon />
                    </div>

                    {/* Leaf right */}
                    <div className="absolute bottom-28 right-8 opacity-20 scale-x-[-1]">
                        <LeafIcon />
                    </div>

                    {/* Book icon bottom right */}
                    <div className="absolute bottom-10 right-16 opacity-15">
                        <BookIcon />
                    </div>

                    <Logo />

                    <div className="flex flex-1 items-center justify-center py-8 relative z-10">
                        <Image
                            src="/education.png"
                            alt="Two students reading a book together"
                            width={1536}
                            height={1024}
                            className="h-auto w-full max-w-xs"
                            priority
                        />
                    </div>
                </div>

                {/* Right panel — form */}
                <div className="flex flex-1 flex-col bg-white">
                    {/* Mobile logo */}
                    <div className="flex justify-center px-6 pt-8 lg:hidden">
                        <Logo />
                    </div>

                    <div className="flex flex-1 items-center justify-center px-8 py-10 lg:px-12">
                        <div className="w-full max-w-md">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DotGrid() {
    return (
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden="true">
            {[0, 1, 2, 3].map((row) =>
                [0, 1, 2, 3].map((col) => (
                    <circle
                        key={`${row}-${col}`}
                        cx={col * 16 + 6}
                        cy={row * 16 + 6}
                        r="2.5"
                        fill="#93B4DC"
                        opacity="0.5"
                    />
                ))
            )}
        </svg>
    );
}

function GraduationCapIcon() {
    return (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="#3B82F6" strokeWidth="2" aria-hidden="true">
            <polygon points="32,8 60,22 32,36 4,22" />
            <path d="M16 28v14c0 5 7 10 16 10s16-5 16-10V28" />
            <line x1="60" y1="22" x2="60" y2="38" />
            <circle cx="60" cy="40" r="2" fill="#3B82F6" />
        </svg>
    );
}

function BookIcon() {
    return (
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" stroke="#3B82F6" strokeWidth="2" aria-hidden="true">
            <path d="M6 8h17c3 0 3 3 3 3v30s0-3-3-3H6V8z" />
            <path d="M46 8H29c-3 0-3 3-3 3v30s0-3 3-3h17V8z" />
            <line x1="26" y1="11" x2="26" y2="41" />
        </svg>
    );
}

function LeafIcon() {
    return (
        <svg width="40" height="56" viewBox="0 0 40 56" fill="none" stroke="#3B82F6" strokeWidth="2" aria-hidden="true">
            <path d="M20 52 C20 52 4 40 4 24 C4 12 12 4 20 4 C28 4 36 12 36 24 C36 40 20 52 20 52Z" />
            <line x1="20" y1="52" x2="20" y2="16" />
            <path d="M20 32 C14 26 10 20 12 14" />
            <path d="M20 40 C26 34 30 28 28 22" />
        </svg>
    );
}