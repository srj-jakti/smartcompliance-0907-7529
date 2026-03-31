import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, CheckSquare, Users, Clock, MessageSquare, BarChart3, LogOut, Menu, X, Bell, Zap } from "lucide-react";
import { getUser, logout } from "@/lib/auth";
import Chat from "@/components/shared/chat";

const navItems = [
  { path: "/employee", icon: LayoutDashboard, label: "My Dashboard" },
  { path: "/employee/tasks", icon: CheckSquare, label: "My Tasks" },
  { path: "/employee/clients", icon: Users, label: "My Clients" },
  { path: "/employee/attendance", icon: Clock, label: "Attendance" },
  { path: "/employee/chat", icon: MessageSquare, label: "Messages" },
  { path: "/employee/reports", icon: BarChart3, label: "My Reports" },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = getUser();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} flex-shrink-0 transition-all duration-300 flex flex-col`}
        style={{ background: "linear-gradient(180deg, #3b0764 0%, #581c87 100%)" }}>
        <div className="h-16 flex items-center px-4 border-b border-purple-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-400 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-purple-900" />
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-white font-bold text-sm">Smart Compliance Tracker</p>
                <p className="text-purple-300 text-xs">Employee Portal</p>
              </div>
            )}
          </div>
        </div>

        <nav className="py-4 flex-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg cursor-pointer transition-all mb-0.5
                  ${isActive ? "bg-purple-600/40 border-l-2 border-purple-300 text-white" : "text-purple-200 hover:bg-white/10 hover:text-white"}`}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {sidebarOpen && (
          <div className="p-4 border-t border-purple-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0) || "E"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                <p className="text-purple-300 text-xs capitalize">{user?.empRole} • {user?.specialization?.toUpperCase()}</p>
              </div>
              <button onClick={logout}><LogOut className="w-4 h-4 text-purple-300 hover:text-white cursor-pointer" /></button>
            </div>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <p className="text-sm font-semibold text-gray-800">{user?.firmName}</p>
              <p className="text-xs text-gray-400">Employee: {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0)}
            </div>
            <button onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 border border-red-200 rounded-lg font-medium transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      {location !== "/employee/chat" && <Chat floating={true} />}
      </div>
    </div>
  );
}
