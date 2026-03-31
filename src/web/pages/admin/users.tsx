import { useEffect, useState } from "react";
import { Search, Users, Building2, UserCheck } from "lucide-react";

const roleColor: Record<string, string> = {
  ca: "bg-blue-500/20 text-blue-400",
  employee: "bg-purple-500/20 text-purple-400",
  client: "bg-emerald-500/20 text-emerald-400",
};

export default function AdminUsers() {
  const [data, setData] = useState<any>({ firms: [], employees: [], clients: [] });
  const [tab, setTab] = useState<"ca" | "employees" | "clients">("ca");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/users").then(r => r.json()).then(d => setData(d || { firms: [], employees: [], clients: [] }));
  }, []);

  const firms = (data.firms || []).filter((f: any) =>
    f.name?.toLowerCase().includes(search.toLowerCase()) || f.email?.toLowerCase().includes(search.toLowerCase())
  );
  const employees = (data.employees || []).filter((e: any) =>
    e.name?.toLowerCase().includes(search.toLowerCase()) || e.email?.toLowerCase().includes(search.toLowerCase())
  );
  const clients = (data.clients || []).filter((c: any) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { id: "ca", label: "CA Owners", count: data.firms?.length || 0, icon: Building2 },
    { id: "employees", label: "Employees", count: data.employees?.length || 0, icon: UserCheck },
    { id: "clients", label: "Clients", count: data.clients?.length || 0, icon: Users },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">All Users</h1>
        <p className="text-slate-400 text-sm">{(data.firms?.length || 0) + (data.employees?.length || 0) + (data.clients?.length || 0)} total across all firms</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
              <Icon className="w-4 h-4" /> {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? "bg-white/20" : "bg-slate-700"}`}>{t.count}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email..."
          className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-4 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">Firm</th>
                <th className="text-left px-4 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">Role / Type</th>
                <th className="text-left px-4 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {tab === "ca" && (
                firms.length === 0
                  ? <tr><td colSpan={5} className="text-center py-12 text-slate-600">No CA firms</td></tr>
                  : firms.map((f: any) => (
                    <tr key={f.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xs font-bold">{f.ownerName?.charAt(0)}</div>
                          <p className="text-white text-sm font-medium">{f.ownerName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300 text-sm">{f.email}</td>
                      <td className="px-4 py-3 text-slate-400 text-sm">{f.name}</td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${roleColor.ca}`}>CA Owner</span></td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Active</span></td>
                    </tr>
                  ))
              )}
              {tab === "employees" && (
                employees.length === 0
                  ? <tr><td colSpan={5} className="text-center py-12 text-slate-600">No employees</td></tr>
                  : employees.map((e: any) => (
                    <tr key={e.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-xs font-bold">{e.name?.charAt(0)}</div>
                          <p className="text-white text-sm font-medium">{e.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300 text-sm">{e.email}</td>
                      <td className="px-4 py-3 text-slate-400 text-sm">{e.firmId}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${roleColor.employee}`}>Employee</span>
                          {e.role && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 capitalize">{e.role}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${e.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                          {e.status || "active"}
                        </span>
                      </td>
                    </tr>
                  ))
              )}
              {tab === "clients" && (
                clients.length === 0
                  ? <tr><td colSpan={5} className="text-center py-12 text-slate-600">No clients</td></tr>
                  : clients.map((c: any) => (
                    <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-xs font-bold">{c.name?.charAt(0)}</div>
                          <p className="text-white text-sm font-medium">{c.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300 text-sm">{c.email || "—"}</td>
                      <td className="px-4 py-3 text-slate-400 text-sm">{c.firmId}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${roleColor.client}`}>Client</span>
                          {c.clientType && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 capitalize">{c.clientType}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                          {c.status || "active"}
                        </span>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
