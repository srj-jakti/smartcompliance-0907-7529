import { useEffect, useState } from "react";
import { Megaphone, Plus, Trash2, X, Check, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";

const roleColor: Record<string, string> = {
  all: "bg-indigo-500/20 text-indigo-400",
  ca: "bg-blue-500/20 text-blue-400",
  employee: "bg-purple-500/20 text-purple-400",
  client: "bg-emerald-500/20 text-emerald-400",
};

export default function AdminAnnouncements() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", targetRole: "all" });
  const [saving, setSaving] = useState(false);

  const load = () => fetch("/api/admin/announcements").then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.title || !form.message) { toast.error("Title and message required"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, isActive: true }),
      });
      if (res.ok) { toast.success("Announcement published"); setShowForm(false); setForm({ title: "", message: "", targetRole: "all" }); load(); }
      else toast.error("Failed");
    } finally { setSaving(false); }
  };

  const toggle = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/announcements/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    toast.success("Deleted"); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Announcements</h1>
          <p className="text-slate-400 text-sm">Broadcast messages to all users</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {["all","ca","employee","client"].map(r => (
          <div key={r} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className={`text-xs px-2 py-0.5 rounded-full ${roleColor[r]}`}>{r === "all" ? "All Users" : r.charAt(0).toUpperCase() + r.slice(1)}</span>
            <p className="text-2xl font-bold text-white mt-3">{items.filter(i => i.targetRole === r && i.isActive).length}</p>
            <p className="text-slate-500 text-xs mt-1">Active</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {items.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl text-center py-12 text-slate-600">
            <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No announcements yet</p>
          </div>
        )}
        {items.map(item => (
          <div key={item.id} className={`bg-slate-900 border rounded-xl p-5 transition-all ${item.isActive ? "border-slate-700" : "border-slate-800 opacity-50"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${roleColor[item.targetRole || "all"]}`}>
                    → {item.targetRole === "all" ? "Everyone" : item.targetRole + "s"}
                  </span>
                  {!item.isActive && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-500">Inactive</span>}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{item.message}</p>
                <p className="text-slate-600 text-xs mt-2">
                  {item.createdAt ? new Date(typeof item.createdAt === "number" ? item.createdAt * 1000 : item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => toggle(item.id, item.isActive)} className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">
                  {item.isActive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button onClick={() => del(item.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">New Announcement</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-xs font-medium mb-1 block">Title</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. New Feature: PDF Invoice Generation"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-600" />
              </div>
              <div>
                <label className="text-slate-300 text-xs font-medium mb-1 block">Message</label>
                <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  rows={4} placeholder="Write your announcement..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-600 resize-none" />
              </div>
              <div>
                <label className="text-slate-300 text-xs font-medium mb-1 block">Audience</label>
                <select value={form.targetRole} onChange={e => setForm(p => ({ ...p, targetRole: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="all">Everyone (CA + Employees + Clients)</option>
                  <option value="ca">CA / Firm Owners only</option>
                  <option value="employee">Employees only</option>
                  <option value="client">Clients only</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:bg-slate-800">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2">
                <Megaphone className="w-4 h-4" /> {saving ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
