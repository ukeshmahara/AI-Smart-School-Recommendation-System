import Image from "next/image";
import Logo from "@/app/_components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-indigo-50">
            <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col bg-white lg:flex-row">
                <div className="hidden border-r border-gray-100 px-16 py-12 lg:flex lg:w-1/2 lg:flex-col">
                    <Logo />
                    <div className="flex flex-1 items-center justify-center py-10">
                        <Image
                            src="/education.png"
                            alt="Two students reading a book together"
                            width={1536}
                            height={1024}
                            className="h-auto w-full max-w-sm"
                            priority
                        />
                    </div>
                </div>

                <div className="flex justify-center px-6 pt-10 lg:hidden">
                    <Logo />
                </div>

                <div className="flex flex-1 items-center justify-center px-6 py-10 lg:py-12">
                    <div className="w-full max-w-md">{children}</div>
                </div>
            </div>
        </div>
    );
}