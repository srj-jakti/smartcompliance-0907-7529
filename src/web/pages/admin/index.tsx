import { useEffect, useState } from "react";
import { Building2, Users, CreditCard, MessageSquare, TrendingUp, IndianRupee, Activity, AlertCircle } from "lucide-react";

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [firms, setFirms] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then(r => r.json()),
      fetch("/api/admin/tickets?status=open").then(r => r.json()),
      fetch("/api/admin/firms").then(r => r.json()),
    ]).then(([s, t, f]) => {
      setStats(s);
      setTickets(Array.isArray(t) ? t.slice(0, 5) : []);
      setFirms(Array.isArray(f) ? f.slice(0, 5) : []);
    });
  }, []);

  const kpis = stats ? [
    { label: "Total Firms", value: stats.totalFirms, sub: `${stats.activeSubs} on paid plans`, icon: Building2, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { label: "Total Users", value: stats.totalClients + stats.totalEmployees, sub: `${stats.totalClients} clients · ${stats.totalEmployees} employees`, icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { label: "Platform MRR", value: `₹${(stats.mrr || 0).toLocaleString("en-IN")}`, sub: "Monthly recurring revenue", icon: IndianRupee, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Open Tickets", value: stats.openTickets, sub: "Need attention", icon: MessageSquare, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  ] : [];

  const priorityColor: Record<string, string> = {
    urgent: "bg-red-500/20 text-red-400 border-red-500/30",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };

  const planColor: Record<string, string> = {
    free: "bg-slate-500/20 text-slate-400",
    starter: "bg-blue-500/20 text-blue-400",
    pro: "bg-indigo-500/20 text-indigo-400",
    enterprise: "bg-purple-500/20 text-purple-400",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
        <p className="text-slate-400 text-sm mt-0.5">SmartCompliance admin dashboard</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className={`bg-slate-900 border ${k.border} rounded-2xl p-5`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`${k.bg} p-2.5 rounded-xl`}>
                  <Icon className={`w-5 h-5 ${k.color}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${k.color}`}>{k.value ?? "—"}</p>
              <p className="text-slate-400 text-xs mt-1">{k.label}</p>
              <p className="text-slate-600 text-xs mt-0.5">{k.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Firms */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" /> Recent Firms
            </h2>
            <span className="text-slate-500 text-xs">{stats?.totalFirms || 0} total</span>
          </div>
          <div className="space-y-3">
            {firms.length === 0 && <p className="text-slate-600 text-sm text-center py-4">No firms yet</p>}
            {firms.map(f => (
              <div key={f.id} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 text-xs font-bold">
                    {f.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{f.name}</p>
                    <p className="text-slate-500 text-xs">{f.email}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${planColor[f.subscription?.plan || "free"]}`}>
                  {f.subscription?.plan || "free"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Open Tickets */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" /> Open Tickets
            </h2>
            <span className="text-slate-500 text-xs">{stats?.openTickets || 0} open</span>
          </div>
          <div className="space-y-3">
            {tickets.length === 0 && <p className="text-slate-600 text-sm text-center py-4">No open tickets</p>}
            {tickets.map(t => (
              <div key={t.id} className="flex items-start justify-between py-2 border-b border-slate-800 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{t.subject}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{t.userName} · {t.firmName}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded border ml-3 flex-shrink-0 ${priorityColor[t.priority]}`}>
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        {stats && (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Platform Stats
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Tasks", value: stats.totalTasks },
                { label: "Total Clients", value: stats.totalClients },
                { label: "Total Employees", value: stats.totalEmployees },
                { label: "Total Revenue", value: `₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}` },
              ].map((s, i) => (
                <div key={i} className="bg-slate-800 rounded-xl p-4">
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-slate-400 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
