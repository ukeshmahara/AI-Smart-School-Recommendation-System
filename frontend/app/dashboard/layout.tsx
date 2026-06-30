import Navbar from "./_components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-indigo-50">
            <Navbar />
            {children}
        </div>
    );
}