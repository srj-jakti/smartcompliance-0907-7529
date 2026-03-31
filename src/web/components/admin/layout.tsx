import { useLocation } from "wouter";
import { Shield, LayoutDashboard, Building2, Users, CreditCard, Key, MessageSquare, Megaphone, Settings, LogOut, ChevronRight } from "lucide-react";
import { getAdmin, logoutAdmin } from "@/lib/admin-auth";

const nav = [
  { path: "/admin", icon: LayoutDashboard, label: "Overview" },
  { path: "/admin/firms", icon: Building2, label: "Firms" },
  { path: "/admin/users", icon: Users, label: "Users" },
  { path: "/admin/subscriptions", icon: CreditCard, label: "Subscriptions" },
  { path: "/admin/ai-keys", icon: Key, label: "AI Keys" },
  { path: "/admin/support", icon: MessageSquare, label: "Support Tickets" },
  { path: "/admin/announcements", icon: Megaphone, label: "Announcements" },
  { path: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const admin = getAdmin();

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">Admin Panel</p>
              <p className="text-slate-500 text-xs mt-0.5">Smart Compliance Tracker</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {nav.map(item => {
            const Icon = item.icon;
            const active = location === item.path || (item.path !== "/admin" && location.startsWith(item.path));
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {active && <ChevronRight className="w-3 h-3 opacity-60" />}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
            <div className="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {admin?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{admin?.name}</p>
              <p className="text-slate-500 text-xs capitalize">{admin?.role}</p>
            </div>
            <button onClick={logoutAdmin} className="text-slate-500 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-slate-950">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
