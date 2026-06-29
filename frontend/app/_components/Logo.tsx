import Image from "next/image";

export default function Logo() {
    return (
        <div className="flex items-center gap-3">
            <Image
                src="/logo.png"
                alt="SikhshaSathi logo"
                width={256}
                height={200}
                className="h-11 w-auto"
                priority
            />
            <div>
                <p className="text-lg font-bold leading-none tracking-tight">
                    <span className="text-gray-900">Sikhsha</span>
                    <span className="text-blue-700">Sathi</span>
                </p>
                <p className="mt-1 text-sm text-gray-500">Find the best school for a bright future</p>
            </div>
        </div>
    );
}
