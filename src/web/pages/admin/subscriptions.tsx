import { useEffect, useState } from "react";
import { CreditCard, TrendingUp, IndianRupee } from "lucide-react";
import { toast } from "sonner";

const plans = [
  { id: "free", label: "Free", price: 0, seats: 5, color: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
  { id: "starter", label: "Starter", price: 999, seats: 10, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { id: "pro", label: "Pro", price: 2499, seats: 30, color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
  { id: "enterprise", label: "Enterprise", price: 5999, seats: 100, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
];

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState<any[]>([]);

  const load = () => fetch("/api/admin/subscriptions").then(r => r.json()).then(d => setSubs(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);

  const update = async (firmId: string, field: string, value: any) => {
    const sub = subs.find(s => s.firmId === firmId) || {};
    await fetch(`/api/admin/subscriptions/${firmId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...sub, [field]: value }),
    });
    toast.success("Updated");
    load();
  };

  const mrr = subs.filter(s => s.status === "active" && s.billingCycle === "monthly").reduce((t, s) => t + (s.amount || 0), 0);
  const arr = subs.filter(s => s.status === "active" && s.billingCycle === "yearly").reduce((t, s) => t + (s.amount || 0), 0);
  const paidSubs = subs.filter(s => s.plan !== "free" && s.status === "active").length;

  const statusColor: Record<string, string> = {
    active: "bg-emerald-500/20 text-emerald-400",
    suspended: "bg-red-500/20 text-red-400",
    cancelled: "bg-slate-500/20 text-slate-400",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
        <p className="text-slate-400 text-sm">{subs.length} total firms</p>
      </div>

      {/* MRR cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "MRR", value: `₹${mrr.toLocaleString("en-IN")}`, sub: "Monthly recurring", icon: IndianRupee, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
          { label: "Paid Subscriptions", value: paidSubs, sub: `of ${subs.length} total`, icon: CreditCard, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
          { label: "ARR (Yearly)", value: `₹${arr.toLocaleString("en-IN")}`, sub: "Annual contracts", icon: TrendingUp, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className={`bg-slate-900 border rounded-2xl p-5 ${k.bg}`}>
              <div className="flex items-center gap-3 mb-3">
                <Icon className={`w-5 h-5 ${k.color}`} />
                <span className="text-slate-400 text-sm">{k.label}</span>
              </div>
              <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
              <p className="text-slate-600 text-xs mt-1">{k.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Plan breakdown */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {plans.map(p => {
          const count = subs.filter(s => s.plan === p.id).length;
          return (
            <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${p.color}`}>{p.label}</span>
              <p className="text-2xl font-bold text-white mt-3">{count}</p>
              <p className="text-slate-500 text-xs mt-1">₹{p.price.toLocaleString("en-IN")}/mo</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                {["Firm", "Plan", "Status", "Seats", "Amount (₹/mo)", "Billing", "Renews At"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subs.length === 0 && <tr><td colSpan={7} className="text-center py-12 text-slate-600">No subscriptions</td></tr>}
              {subs.map(s => (
                <tr key={s.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-white text-sm font-medium">{s.firm?.name || s.firmId}</p>
                    <p className="text-slate-500 text-xs">{s.firm?.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <select value={s.plan} onChange={e => update(s.firmId, "plan", e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      {plans.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select value={s.status} onChange={e => update(s.firmId, "status", e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      {["active","suspended","cancelled"].map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-sm">{s.seats || 5}</td>
                  <td className="px-4 py-3">
                    <input type="number" value={s.amount || 0} onBlur={e => update(s.firmId, "amount", parseFloat(e.target.value))}
                      onChange={e => setSubs(prev => prev.map(sub => sub.firmId === s.firmId ? { ...sub, amount: e.target.value } : sub))}
                      className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-2 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </td>
                  <td className="px-4 py-3">
                    <select value={s.billingCycle || "monthly"} onChange={e => update(s.firmId, "billingCycle", e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-sm">
                    {s.renewsAt ? new Date(s.renewsAt).toLocaleDateString("en-IN") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
