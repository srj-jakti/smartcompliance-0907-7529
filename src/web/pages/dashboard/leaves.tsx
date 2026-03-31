import { useEffect, useState } from "react";
import { Plus, X, CheckCircle, XCircle, Clock, Calendar, Table } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";

interface Leave { id: string; employeeId: string; employeeName: string; leaveType: string; fromDate: string; toDate: string; days: number; reason?: string; status: string; createdAt?: string; }
interface Employee { id: string; name: string; }

const defaultForm = { employeeId: "", leaveType: "casual", fromDate: "", toDate: "", days: "1", reason: "" };
const leaveColors: Record<string, string> = { casual: "bg-blue-100 text-blue-700", sick: "bg-red-100 text-red-700", earned: "bg-green-100 text-green-700", half_day: "bg-yellow-100 text-yellow-700" };
const statusColor: Record<string, string> = { pending: "status-pending", approved: "status-completed", rejected: "status-overdue" };

export default function Leaves() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...defaultForm });
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const user = getUser();

  const load = () => fetch(`/api/leaves?firmId=${user?.firmId || ""}`).then(r => r.json()).then(setLeaves);

  useEffect(() => {
    load();
    fetch(`/api/employees?firmId=${user?.firmId || ""}`).then(r => r.json()).then(setEmployees);
  }, []);

  const calcDays = (from: string, to: string) => {
    if (!from || !to) return 1;
    const d1 = new Date(from), d2 = new Date(to);
    return Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / 86400000) + 1);
  };

  const empName = (id: string) => employees.find(e => e.id === id)?.name || id;

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const days = form.leaveType === "half_day" ? 0.5 : calcDays(form.fromDate, form.toDate);
      const empN = empName(form.employeeId) || form.employeeId;
      await fetch("/api/leaves", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, days, employeeName: empN, firmId: user?.firmId || "" })
      });
      toast.success("Leave request submitted!"); setShowModal(false); setForm({ ...defaultForm }); load();
    } catch { toast.error("Failed"); } finally { setLoading(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/leaves/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, reviewedBy: user?.name }) });
    toast.success(status === "approved" ? "Leave approved!" : "Leave rejected"); load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this leave request?")) return;
    await fetch(`/api/leaves/${id}`, { method: "DELETE" });
    toast.success("Deleted"); load();
  };

  const exportLeaves = () => {
    const rows = [
      ["Employee", "Leave Type", "From", "To", "Days", "Reason", "Status"],
      ...leaves.map(l => [l.employeeName, l.leaveType, l.fromDate, l.toDate, l.days, l.reason || "", l.status])
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `leaves_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    toast.success("Exported!");
  };

  const filtered = leaves.filter(l => filterStatus === "all" || l.status === filterStatus);
  const pending = leaves.filter(l => l.status === "pending").length;
  const approved = leaves.filter(l => l.status === "approved").length;
  const totalDays = leaves.filter(l => l.status === "approved").reduce((s, l) => s + l.days, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-500 text-sm">{leaves.length} requests · {pending} pending approval</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportLeaves} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">
            <Table className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setShowModal(true)} className="btn-blue flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" /> New Request
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{pending}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-600 mb-1">Approved</p>
          <p className="text-2xl font-bold text-green-700">{approved}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600 mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-700">{leaves.filter(l => l.status === "rejected").length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-600 mb-1">Days Approved</p>
          <p className="text-2xl font-bold text-blue-700">{totalDays}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-5 w-fit">
        {["all", "pending", "approved", "rejected"].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filterStatus === s ? "bg-white shadow text-blue-700" : "text-gray-500 hover:text-gray-700"}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No leave requests found.</div>}
        {filtered.map(l => (
          <Card key={l.id} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold text-gray-900">{l.employeeName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${leaveColors[l.leaveType] || "bg-gray-100 text-gray-600"}`}>
                      {l.leaveType.replace("_", " ").toUpperCase()}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[l.status] || ""}`}>{l.status}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {l.fromDate} → {l.toDate}</span>
                    <span className="font-medium text-blue-600">{l.days} day{l.days !== 1 ? "s" : ""}</span>
                  </div>
                  {l.reason && <p className="text-xs text-gray-400 mt-1">Reason: {l.reason}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {l.status === "pending" && (
                    <>
                      <button onClick={() => updateStatus(l.id, "approved")} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100">
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button onClick={() => updateStatus(l.id, "rejected")} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  )}
                  <button onClick={() => del(l.id)} className="p-1.5 hover:bg-red-50 rounded text-red-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">New Leave Request</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Employee *</label>
                <select required value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select employee</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Leave Type *</label>
                <select value={form.leaveType} onChange={e => setForm({ ...form, leaveType: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="earned">Earned Leave</option>
                  <option value="half_day">Half Day</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">From Date *</label>
                  <input required type="date" value={form.fromDate}
                    onChange={e => { const v = e.target.value; setForm(f => ({ ...f, fromDate: v, days: String(calcDays(v, f.toDate)) })); }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">To Date *</label>
                  <input required type="date" value={form.toDate}
                    onChange={e => { const v = e.target.value; setForm(f => ({ ...f, toDate: v, days: String(calcDays(f.fromDate, v)) })); }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              {form.fromDate && form.toDate && (
                <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700 font-medium">
                  Total: {form.leaveType === "half_day" ? "0.5" : calcDays(form.fromDate, form.toDate)} day(s)
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Reason</label>
                <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 btn-blue rounded-lg py-2.5 text-sm font-medium">
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
