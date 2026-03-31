import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, FileText, FolderOpen, Calendar, MessageSquare,
  CreditCard, HelpCircle, LogOut, Menu, X, Bell, Zap, ChevronRight, User
} from "lucide-react";
import { getUser, logout } from "@/lib/auth";
import Chat from "@/components/shared/chat";

const navItems = [
  { path: "/client", icon: LayoutDashboard, label: "Overview" },
  { path: "/client/tasks", icon: FileText, label: "My Filings" },
  { path: "/client/documents", icon: FolderOpen, label: "Documents" },
  { path: "/client/compliance", icon: Calendar, label: "Due Dates" },
  { path: "/client/invoices", icon: CreditCard, label: "Invoices" },
  { path: "/client/chat", icon: MessageSquare, label: "Messages" },
  { path: "/client/support", icon: HelpCircle, label: "Support" },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = getUser();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-16"} flex-shrink-0 transition-all duration-300 flex flex-col`}
        style={{ background: "linear-gradient(180deg, #064e3b 0%, #065f46 100%)" }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-green-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-400 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-green-900" />
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-white font-bold text-sm leading-tight">Smart Compliance Tracker</p>
                <p className="text-green-300 text-xs">Client Portal</p>
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
                    ? "bg-green-600/40 border-l-2 border-green-300 text-white"
                    : "text-green-200 hover:bg-white/10 hover:text-white"
                  }`}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        {sidebarOpen && (
          <div className="p-4 border-t border-green-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user?.name?.charAt(0) || "C"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.name || "Client"}</p>
                <p className="text-green-300 text-xs truncate">{user?.pan || user?.email}</p>
              </div>
              <button onClick={logout} title="Logout">
                <LogOut className="w-4 h-4 text-green-300 hover:text-white cursor-pointer" />
              </button>
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
            <div>
              <p className="text-sm font-semibold text-gray-800">Client Portal</p>
              <p className="text-xs text-gray-400">Welcome, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0) || "C"}
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
      {location !== "/client/chat" && <Chat floating={true} />}
    </div>
  );
}
