import ProfileDropdown from "../../dashboard/_components/ProfileDropdown";

export default function AdminTopBar() {
    return (
        <div className="flex items-center justify-between border-b border-gray-200 bg-slate-100 px-6 py-3">
            <span className="text-sm font-semibold text-gray-500">Admin Dashboard</span>
            <ProfileDropdown showPolicyLinks={false} />
        </div>
    );
}