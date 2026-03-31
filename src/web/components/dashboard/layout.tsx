import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Users, CheckSquare, Calendar, FileText, FolderOpen,
  Shield, Clock, Bot, BarChart3, Settings, Menu, X, Bell, Search,
  LogOut, ChevronRight, Zap, MessageSquare
} from "lucide-react";
import { logout, getUser } from "@/lib/auth";
import Chat from "@/components/shared/chat";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/dashboard/clients", icon: Users, label: "Clients" },
  { path: "/dashboard/tasks", icon: CheckSquare, label: "Tasks" },
  { path: "/dashboard/team", icon: Users, label: "Team", badge: "Staff" },
  { path: "/dashboard/compliance", icon: Calendar, label: "Compliance" },
  { path: "/dashboard/invoices", icon: FileText, label: "Invoices" },
  { path: "/dashboard/chat", icon: MessageSquare, label: "Messages" },
  { path: "/dashboard/documents", icon: FolderOpen, label: "Documents" },
  { path: "/dashboard/dsc", icon: Shield, label: "DSC" },
  { path: "/dashboard/attendance", icon: Clock, label: "Attendance" },
  { path: "/dashboard/leaves", icon: Calendar, label: "Leave Mgmt" },
  { path: "/dashboard/ai", icon: Bot, label: "AI Assistant", badge: "AI" },
  { path: "/dashboard/reports", icon: BarChart3, label: "Reports" },
  { path: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [location] = useLocation();
  const caUser = getUser();
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (!caUser?.firmId) return;
    fetch(`/api/notifications?firmId=${caUser.firmId}&userId=ca_${caUser.firmId}`)
      .then(r => r.json())
      .then((data: any[]) => setNotifCount(data.filter((n: any) => !n.isRead).length));
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} flex-shrink-0 transition-all duration-300`}
        style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e3a8a 100%)" }}>
        
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-blue-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-white font-bold text-sm leading-tight">SmartCompliance</p>
                <p className="text-blue-300 text-xs">CA Practice Suite</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="py-4 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg cursor-pointer transition-all mb-0.5
                  ${isActive 
                    ? "bg-blue-600/30 border-l-2 border-blue-400 text-white" 
                    : "text-blue-200 hover:bg-white/10 hover:text-white"
                  }`}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <div className="flex items-center justify-between flex-1">
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">{item.badge}</span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        {sidebarOpen && (
          <div className="p-4 border-t border-blue-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                CA
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{caUser?.name || "CA Admin"}</p>
                <p className="text-blue-300 text-xs truncate">{caUser?.firmName || caUser?.email}</p>
              </div>
              <LogOut className="w-4 h-4 text-blue-300 hover:text-white cursor-pointer" onClick={logout} />
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input placeholder="Search clients, tasks..." 
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-blue-600 hover:underline hidden md:block">← Home</Link>
            <Link href="/dashboard/chat">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg" title="Messages">
                <Bell className="w-5 h-5 text-gray-600" />
                {notifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                    {notifCount > 9 ? "9+" : notifCount}
                  </span>
                )}
              </button>
            </Link>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {caUser?.name?.charAt(0) || "C"}
            </div>
            <button onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 border border-red-200 rounded-lg font-medium transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      {/* Floating Chat — hidden on /dashboard/chat page itself */}
      {location !== "/dashboard/chat" && <Chat floating={true} />}
    </div>
  );
}
