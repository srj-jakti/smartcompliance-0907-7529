import { useEffect, useState } from "react";
import { Key, Plus, Trash2, Eye, EyeOff, Check, X, Globe } from "lucide-react";
import { toast } from "sonner";

export default function AdminAIKeys() {
  const [keys, setKeys] = useState<any[]>([]);
  const [firms, setFirms] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firmId: "", aiKey: "", baseUrl: "https://api.openai.com/v1", model: "gpt-4o" });
  const [show, setShow] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  const load = () => Promise.all([
    fetch("/api/admin/ai-keys").then(r => r.json()),
    fetch("/api/admin/firms").then(r => r.json()),
  ]).then(([k, f]) => {
    setKeys(Array.isArray(k) ? k : []);
    setFirms(Array.isArray(f) ? f : []);
  });

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.firmId || !form.aiKey) { toast.error("Firm and API key required"); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/ai-keys/${form.firmId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { toast.success("AI key saved"); setShowForm(false); setForm({ firmId: "", aiKey: "", baseUrl: "https://api.openai.com/v1", model: "gpt-4o" }); load(); }
      else toast.error("Failed to save");
    } finally { setSaving(false); }
  };

  const deleteKey = async (firmId: string) => {
    if (!confirm("Remove AI key for this firm?")) return;
    await fetch(`/api/admin/ai-keys/${firmId}`, { method: "DELETE" });
    toast.success("Removed"); load();
  };

  const maskedKey = (key: string) => key.slice(0, 8) + "•".repeat(Math.max(0, key.length - 12)) + key.slice(-4);

  const models = ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo", "claude-3-5-sonnet-latest", "gemini-pro"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Keys</h1>
          <p className="text-slate-400 text-sm">Per-firm AI API key overrides</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Key
        </button>
      </div>

      {/* Global key info */}
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Globe className="w-5 h-5 text-indigo-400" />
          <h3 className="text-white font-semibold">Global Platform Key</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">Applied to all firms without override</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-slate-500 text-xs mb-1">Base URL</p>
            <p className="text-slate-300 text-sm font-mono">api.runable.com/api/gateway/v1</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1">API Key</p>
            <p className="text-slate-300 text-sm font-mono">••••••••••••</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1">Model</p>
            <p className="text-slate-300 text-sm font-mono">gpt-4o</p>
          </div>
        </div>
        <p className="text-slate-600 text-xs mt-3">Set via AI_GATEWAY_API_KEY and AI_GATEWAY_BASE_URL environment variables</p>
      </div>

      {/* Per-firm keys */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
          <Key className="w-4 h-4 text-slate-400" />
          <h3 className="text-white font-medium">Firm-Level Overrides</h3>
          <span className="text-slate-500 text-sm">({keys.length})</span>
        </div>
        <div className="divide-y divide-slate-800/50">
          {keys.length === 0 && (
            <div className="text-center py-12 text-slate-600">
              <Key className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No per-firm overrides. All firms use the global key.</p>
            </div>
          )}
          {keys.map(k => (
            <div key={k.id} className="p-5 hover:bg-slate-800/20 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-white font-medium">{k.firm?.name || k.firmId}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${k.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                      {k.isActive ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">API Key</p>
                      <div className="flex items-center gap-2">
                        <p className="text-slate-300 text-sm font-mono">
                          {show[k.id] ? k.aiKey : maskedKey(k.aiKey)}
                        </p>
                        <button onClick={() => setShow(p => ({ ...p, [k.id]: !p[k.id] }))} className="text-slate-500 hover:text-slate-300">
                          {show[k.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Model</p>
                      <p className="text-slate-300 text-sm font-mono">{k.model || "gpt-4o"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Base URL</p>
                      <p className="text-slate-400 text-xs truncate">{k.baseUrl || "openai.com"}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => deleteKey(k.firmId)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">Add AI Key Override</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-slate-300 text-xs font-medium mb-1 block">Firm</label>
                <select value={form.firmId} onChange={e => setForm(p => ({ ...p, firmId: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select firm...</option>
                  {firms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-300 text-xs font-medium mb-1 block">API Key</label>
                <input type="text" value={form.aiKey} onChange={e => setForm(p => ({ ...p, aiKey: e.target.value }))}
                  placeholder="sk-..." className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-600" />
              </div>
              <div>
                <label className="text-slate-300 text-xs font-medium mb-1 block">Model</label>
                <select value={form.model} onChange={e => setForm(p => ({ ...p, model: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-300 text-xs font-medium mb-1 block">Base URL</label>
                <input value={form.baseUrl} onChange={e => setForm(p => ({ ...p, baseUrl: e.target.value }))}
                  placeholder="https://api.openai.com/v1"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-600" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:bg-slate-800">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> {saving ? "Saving..." : "Save Key"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
