import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Edit2, X, Building2, Check } from "lucide-react";
import { toast } from "sonner";

const planColor: Record<string, string> = {
  free: "bg-slate-500/20 text-slate-400",
  starter: "bg-blue-500/20 text-blue-400",
  pro: "bg-indigo-500/20 text-indigo-400",
  enterprise: "bg-purple-500/20 text-purple-400",
};
const statusColor: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400",
  suspended: "bg-red-500/20 text-red-400",
  cancelled: "bg-slate-500/20 text-slate-400",
};

export default function AdminFirms() {
  const [firms, setFirms] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", ownerName: "", email: "", phone: "", gstin: "", city: "" });
  const [saving, setSaving] = useState(false);

  const load = () => fetch("/api/admin/firms").then(r => r.json()).then(d => setFirms(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);

  const filtered = firms.filter(f =>
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.email?.toLowerCase().includes(search.toLowerCase()) ||
    f.ownerName?.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setEditing(null); setForm({ name: "", ownerName: "", email: "", phone: "", gstin: "", city: "" }); setShowForm(true); };
  const openEdit = (f: any) => { setEditing(f); setForm({ name: f.name, ownerName: f.ownerName, email: f.email, phone: f.phone || "", gstin: f.gstin || "", city: f.city || "" }); setShowForm(true); };

  const save = async () => {
    if (!form.name || !form.email) { toast.error("Name and email required"); return; }
    setSaving(true);
    try {
      const url = editing ? `/api/admin/firms/${editing.id}` : "/api/admin/firms";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { toast.success(editing ? "Firm updated" : "Firm created"); setShowForm(false); load(); }
      else toast.error("Failed to save");
    } finally { setSaving(false); }
  };

  const deleteFirm = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/firms/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Firm deleted"); load(); } else toast.error("Delete failed");
  };

  const updateSub = async (firmId: string, plan: string) => {
    await fetch(`/api/admin/subscriptions/${firmId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, status: "active" }),
    });
    toast.success("Plan updated"); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">CA Firms</h1>
          <p className="text-slate-400 text-sm">{firms.length} registered firms</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Firm
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, owner..."
          className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500" />
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                {["Firm", "Owner", "Contact", "Plan", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-slate-600">No firms found</td></tr>
              )}
              {filtered.map(f => (
                <tr key={f.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 text-xs font-bold flex-shrink-0">
                        {f.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{f.name}</p>
                        <p className="text-slate-500 text-xs">{f.city || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-sm">{f.ownerName}</td>
                  <td className="px-4 py-3">
                    <p className="text-slate-300 text-sm">{f.email}</p>
                    <p className="text-slate-500 text-xs">{f.phone || "—"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={f.subscription?.plan || "free"}
                      onChange={e => updateSub(f.id, e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {["free","starter","pro","enterprise"].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[f.subscription?.status || "active"]}`}>
                      {f.subscription?.status || "active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(f)} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteFirm(f.id, f.name)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">{editing ? "Edit Firm" : "Add New Firm"}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {[
                { key: "name", label: "Firm Name", placeholder: "Sharma & Associates" },
                { key: "ownerName", label: "Owner Name", placeholder: "CA Rajesh Sharma" },
                { key: "email", label: "Email", placeholder: "ca@firm.com", type: "email" },
                { key: "phone", label: "Phone", placeholder: "9876543210" },
                { key: "gstin", label: "GSTIN", placeholder: "27XXXXX..." },
                { key: "city", label: "City", placeholder: "Mumbai" },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-slate-300 text-xs font-medium mb-1 block">{field.label}</label>
                  <input
                    type={field.type || "text"}
                    value={(form as any)[field.key]}
                    onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-600"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:bg-slate-800">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? "Saving..." : <><Check className="w-4 h-4" /> {editing ? "Update" : "Create"}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
