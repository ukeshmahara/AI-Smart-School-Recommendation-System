import AdminSidebar from "./_components/AdminSidebar";
import AdminTopBar from "./_components/AdminTopBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-white">
            <AdminSidebar />
            <div className="flex flex-1 flex-col">
                <AdminTopBar />
                <main className="flex-1 overflow-y-auto bg-slate-100">{children}</main>
            </div>
        </div>
    );
}