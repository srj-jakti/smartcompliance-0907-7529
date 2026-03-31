import { useState, useEffect } from "react";
import { Save, Shield, Users, Plus, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { getAdmin } from "@/lib/admin-auth";

export default function AdminSettings() {
  const admin = getAdmin();
  const [admins, setAdmins] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "support" });
  const [saving, setSaving] = useState(false);

  const load = () => fetch("/api/admin/admins").then(r => r.json()).then(d => setAdmins(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.name || !form.email || !form.password) { toast.error("All fields required"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { toast.success("Admin created"); setShowForm(false); setForm({ name: "", email: "", password: "", role: "support" }); load(); }
      else toast.error("Failed to create");
    } finally { setSaving(false); }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/admins/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    load(); toast.success("Updated");
  };

  const plans = [
    { id: "free", label: "Free", price: "₹0", seats: 5, features: ["5 clients", "2 employees", "Basic tasks"] },
    { id: "starter", label: "Starter", price: "₹999/mo", seats: 10, features: ["25 clients", "5 employees", "All features", "AI Assistant"] },
    { id: "pro", label: "Pro", price: "₹2,499/mo", seats: 30, features: ["Unlimited clients", "15 employees", "Priority support", "Custom AI key"] },
    { id: "enterprise", label: "Enterprise", price: "₹5,999/mo", seats: 100, features: ["Everything in Pro", "Unlimited employees", "Dedicated support", "SLA guarantee"] },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
        <p className="text-slate-400 text-sm">Manage admin accounts and plan configuration</p>
      </div>

      {/* Plan Tiers (display only) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-400" /> Subscription Plans
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map(p => (
            <div key={p.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-white font-semibold text-sm">{p.label}</p>
              <p className="text-indigo-400 font-bold text-lg mt-1">{p.price}</p>
              <p className="text-slate-500 text-xs mt-1">Up to {p.seats} seats</p>
              <ul className="mt-3 space-y-1">
                {p.features.map(f => (
                  <li key={f} className="text-slate-400 text-xs flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-slate-600 text-xs mt-4">* Change firm plans in Subscriptions tab. Pricing shown is indicative.</p>
      </div>

      {/* Admin Users */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" /> Admin Accounts
          </h2>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Admin
          </button>
        </div>
        <div className="divide-y divide-slate-800/50">
          {admins.map(a => (
            <div key={a.id} className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400 text-sm font-bold">
                  {a.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{a.name} {a.id === admin?.id && <span className="text-xs text-indigo-400">(you)</span>}</p>
                  <p className="text-slate-500 text-xs">{a.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${a.role === "superadmin" ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-700 text-slate-400"}`}>
                  {a.role}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${a.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                  {a.isActive ? "Active" : "Disabled"}
                </span>
                {a.id !== admin?.id && (
                  <button onClick={() => toggleActive(a.id, a.isActive)} className="text-xs px-3 py-1 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                    {a.isActive ? "Disable" : "Enable"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Admin Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">Add Admin Account</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {[
                { key: "name", label: "Full Name", placeholder: "John Doe" },
                { key: "email", label: "Email", placeholder: "john@smartcompliance.in", type: "email" },
                { key: "password", label: "Password", placeholder: "••••••••", type: "password" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-slate-300 text-xs font-medium mb-1 block">{f.label}</label>
                  <input type={f.type || "text"} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-600" />
                </div>
              ))}
              <div>
                <label className="text-slate-300 text-xs font-medium mb-1 block">Role</label>
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="support">Support Agent</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:bg-slate-800">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-60">
                {saving ? "Creating..." : "Create Admin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
