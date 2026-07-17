import DashboardSidebar from "./_components/DashboardSidebar";
import DashboardTopBar from "./_components/DashboardTopBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-white">
            <DashboardSidebar />
            <div className="flex flex-1 flex-col">
                <DashboardTopBar />
                <main className="flex-1 overflow-y-auto bg-slate-100">{children}</main>
            </div>
        </div>
    );
}