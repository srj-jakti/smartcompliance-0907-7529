import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Plus, Search, Edit, Trash2, X, Phone, Mail, MapPin, CreditCard, Building2, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";

interface Client {
  id: string; name: string; email?: string; phone: string;
  pan?: string; gstin?: string; clientType: string; city?: string; state?: string;
  status: string; assignedTo?: string;
}

const defaultForm = { name: "", email: "", phone: "", pan: "", gstin: "", clientType: "individual", city: "", state: "Maharashtra", status: "active", notes: "" };
const states = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"];

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...defaultForm });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [, navigate] = useLocation();
  const firmId = getUser()?.firmId || "";
  const load = () => fetch(`/api/clients?firmId=${firmId}${search ? `&search=${search}` : ""}`).then(r => r.json()).then(setClients);
  useEffect(() => { load(); }, [search]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const url = editId ? `/api/clients/${editId}` : "/api/clients";
      const method = editId ? "PUT" : "POST";
      await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, firmId }) });
      toast.success(editId ? "Client updated!" : "Client added!");
      setShowModal(false); setForm({ ...defaultForm }); setEditId(null); load();
    } catch { toast.error("Failed to save"); } finally { setLoading(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this client?")) return;
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
    toast.success("Client deleted"); load();
  };

  const edit = (c: Client) => {
    setForm({ name: c.name, email: c.email||"", phone: c.phone, pan: c.pan||"", gstin: c.gstin||"", clientType: c.clientType, city: c.city||"", state: c.state||"Maharashtra", status: c.status, notes: "" });
    setEditId(c.id); setShowModal(true);
  };

  const typeColor: Record<string, string> = {
    individual: "bg-blue-100 text-blue-700", company: "bg-purple-100 text-purple-700",
    firm: "bg-orange-100 text-orange-700", trust: "bg-green-100 text-green-700"
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 text-sm">{clients.length} total clients</p>
        </div>
        <button onClick={() => { setForm({...defaultForm}); setEditId(null); setShowModal(true); }} className="btn-blue flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>

      <div className="relative mb-5">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, phone, PAN..."
          className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
      </div>

      <div className="grid gap-4">
        {clients.length === 0 && <div className="text-center py-12 text-gray-400">No clients found. Add your first client!</div>}
        {clients.map(c => (
          <Card key={c.id} className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                    {c.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{c.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${typeColor[c.clientType]||"bg-gray-100 text-gray-600"}`}>
                        {c.clientType}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${c.status==="active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      {c.phone && <span className="flex items-center gap-1 text-xs text-gray-500"><Phone className="w-3 h-3" />{c.phone}</span>}
                      {c.email && <span className="flex items-center gap-1 text-xs text-gray-500"><Mail className="w-3 h-3" />{c.email}</span>}
                      {c.city && <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin className="w-3 h-3" />{c.city}, {c.state}</span>}
                      {c.pan && <span className="flex items-center gap-1 text-xs text-gray-500"><CreditCard className="w-3 h-3" />PAN: {c.pan}</span>}
                      {c.gstin && <span className="flex items-center gap-1 text-xs text-gray-500"><Building2 className="w-3 h-3" />GSTIN: {c.gstin}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => navigate(`/dashboard/clients/${c.id}`)} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100">
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                  <button onClick={() => edit(c)} className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button onClick={() => del(c.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">{editId ? "Edit Client" : "Add New Client"}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Phone *</label>
                  <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">PAN</label>
                  <input value={form.pan} onChange={e => setForm({...form, pan: e.target.value.toUpperCase()})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="ABCDE1234F" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">GSTIN</label>
                  <input value={form.gstin} onChange={e => setForm({...form, gstin: e.target.value.toUpperCase()})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Client Type</label>
                  <select value={form.clientType} onChange={e => setForm({...form, clientType: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="individual">Individual</option>
                    <option value="company">Company</option>
                    <option value="firm">Partnership Firm</option>
                    <option value="trust">Trust</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
                  <input value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">State</label>
                  <select value={form.state} onChange={e => setForm({...form, state: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 btn-blue rounded-lg py-2.5 text-sm font-medium">
                  {loading ? "Saving..." : editId ? "Update Client" : "Add Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
