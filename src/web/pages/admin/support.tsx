import { useEffect, useState } from "react";
import { MessageSquare, Send, X, Clock, CheckCircle, AlertCircle, ArrowLeft, Filter } from "lucide-react";
import { toast } from "sonner";
import { getAdmin } from "@/lib/admin-auth";

const priorityColor: Record<string, string> = {
  urgent: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};
const statusColor: Record<string, string> = {
  open: "bg-amber-500/20 text-amber-400",
  in_progress: "bg-blue-500/20 text-blue-400",
  resolved: "bg-emerald-500/20 text-emerald-400",
  closed: "bg-slate-500/20 text-slate-400",
};

export default function AdminSupport() {
  const admin = getAdmin();
  const [tickets, setTickets] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState("all");

  const loadTickets = () => fetch("/api/admin/tickets").then(r => r.json()).then(d => setTickets(Array.isArray(d) ? d : []));

  const loadReplies = (id: string) => fetch(`/api/admin/tickets/${id}/replies`).then(r => r.json()).then(d => setReplies(Array.isArray(d) ? d : []));

  useEffect(() => { loadTickets(); }, []);

  const openTicket = (t: any) => { setSelected(t); loadReplies(t.id); };

  const sendReply = async () => {
    if (!reply.trim() || !selected) return;
    setSending(true);
    try {
      await fetch(`/api/admin/tickets/${selected.id}/reply`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: admin?.id || "admin", authorName: admin?.name || "Admin", authorRole: "admin", message: reply.trim() }),
      });
      setReply("");
      loadReplies(selected.id);
      loadTickets();
      toast.success("Reply sent");
    } finally { setSending(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/tickets/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (selected?.id === id) setSelected((p: any) => ({ ...p, status }));
    loadTickets();
    toast.success("Status updated");
  };

  const filtered = filter === "all" ? tickets : tickets.filter(t => t.status === filter);

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to tickets
        </button>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col" style={{ height: "600px" }}>
            <div className="p-4 border-b border-slate-800">
              <h2 className="text-white font-semibold">{selected.subject}</h2>
              <p className="text-slate-400 text-sm">{selected.userName} · {selected.firmName}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Original message */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-xs font-bold flex-shrink-0">
                  {selected.userName?.charAt(0)}
                </div>
                <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                  <p className="text-slate-200 text-sm">{selected.message}</p>
                  <p className="text-slate-500 text-xs mt-1.5">{selected.userName} · {selected.userRole}</p>
                </div>
              </div>
              {/* Replies */}
              {replies.map(r => (
                <div key={r.id} className={`flex gap-3 ${r.authorRole === "admin" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${r.authorRole === "admin" ? "bg-indigo-600" : "bg-slate-700"}`}>
                    {r.authorName?.charAt(0)}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 max-w-[80%] ${r.authorRole === "admin" ? "bg-indigo-600 rounded-tr-sm" : "bg-slate-800 rounded-tl-sm"}`}>
                    <p className={`text-sm ${r.authorRole === "admin" ? "text-white" : "text-slate-200"}`}>{r.message}</p>
                    <p className={`text-xs mt-1.5 ${r.authorRole === "admin" ? "text-indigo-200" : "text-slate-500"}`}>
                      {r.authorName} · {r.authorRole}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-800 flex gap-3">
              <input value={reply} onChange={e => setReply(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendReply()}
                placeholder="Type your reply..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500" />
              <button onClick={sendReply} disabled={sending || !reply.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60 flex items-center gap-2 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Ticket details */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4">Ticket Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-500 text-xs mb-1">Status</p>
                  <select value={selected.status} onChange={e => updateStatus(selected.id, e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    {["open","in_progress","resolved","closed"].map(s => <option key={s} value={s}>{s.replace("_"," ")}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-1">Priority</p>
                  <span className={`text-xs px-2 py-1 rounded border ${priorityColor[selected.priority]}`}>{selected.priority}</span>
                </div>
                <div><p className="text-slate-500 text-xs mb-1">Submitted by</p><p className="text-slate-300 text-sm">{selected.userName}</p></div>
                <div><p className="text-slate-500 text-xs mb-1">Firm</p><p className="text-slate-300 text-sm">{selected.firmName}</p></div>
                <div><p className="text-slate-500 text-xs mb-1">Role</p><p className="text-slate-300 text-sm capitalize">{selected.userRole}</p></div>
                <div><p className="text-slate-500 text-xs mb-1">Created</p><p className="text-slate-300 text-sm">{selected.createdAt ? new Date(typeof selected.createdAt === "number" ? selected.createdAt * 1000 : selected.createdAt).toLocaleString("en-IN") : "—"}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Support Tickets</h1>
          <p className="text-slate-400 text-sm">{tickets.filter(t => t.status === "open").length} open · {tickets.length} total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5">
        {[
          { id: "all", label: "All" },
          { id: "open", label: "Open" },
          { id: "in_progress", label: "In Progress" },
          { id: "resolved", label: "Resolved" },
          { id: "closed", label: "Closed" },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f.id ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
            {f.label} {f.id !== "all" && `(${tickets.filter(t => t.status === f.id).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl text-center py-12 text-slate-600">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No tickets in this category</p>
          </div>
        )}
        {filtered.map(t => (
          <div key={t.id} onClick={() => openTicket(t)}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-indigo-500/50 cursor-pointer transition-all group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium group-hover:text-indigo-300 transition-colors">{t.subject}</p>
                  <p className="text-slate-500 text-sm mt-0.5 truncate">{t.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-500">{t.userName}</span>
                    <span className="text-slate-700">·</span>
                    <span className="text-xs text-slate-500">{t.firmName}</span>
                    <span className="text-slate-700">·</span>
                    <span className="text-xs text-slate-500 capitalize">{t.userRole}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[t.status]}`}>{t.status?.replace("_"," ")}</span>
                <span className={`text-xs px-2 py-0.5 rounded border ${priorityColor[t.priority]}`}>{t.priority}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
