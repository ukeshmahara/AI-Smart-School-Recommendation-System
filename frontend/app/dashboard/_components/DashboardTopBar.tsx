import NotificationBell from "./NotificationBell";
import ProfileDropdown from "./ProfileDropdown";
import TopBarSearch from "./TopBarSearch";

export default function DashboardTopBar() {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-slate-100 px-6 py-3">
            <TopBarSearch />
            <div className="flex items-center gap-3">
                <NotificationBell />
                <ProfileDropdown showPolicyLinks />
            </div>
        </div>
    );
}