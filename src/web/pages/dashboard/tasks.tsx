import { useEffect, useState } from "react";
import { Plus, X, Filter, CheckCircle, Clock, AlertTriangle, Circle, ChevronDown, ChevronRight, Timer, Trash2, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";

interface Task { id: string; title: string; category: string; status: string; priority: string; clientId?: string; assignedEmployeeId?: string; dueDate?: string; billingAmount?: number; description?: string; notes?: string; recurring?: string; }
interface Client { id: string; name: string; }
interface Employee { id: string; name: string; }
interface SubTask { id: string; taskId: string; title: string; status: string; }
interface TimeLog { id: string; taskId: string; employeeId: string; employeeName: string; hours: number; description?: string; logDate: string; }

const defaultForm = { title: "", description: "", category: "gst", status: "pending", priority: "medium", clientId: "", assignedEmployeeId: "", billingAmount: "", dueDate: "", recurring: "none", notes: "" };
const statusIcon: Record<string, any> = {
  completed: <CheckCircle className="w-4 h-4 text-green-500" />,
  pending: <Circle className="w-4 h-4 text-gray-400" />,
  in_progress: <Clock className="w-4 h-4 text-blue-500" />,
  overdue: <AlertTriangle className="w-4 h-4 text-red-500" />,
  review: <Clock className="w-4 h-4 text-purple-500" />
};
const priorityColor: Record<string, string> = { low: "bg-gray-100 text-gray-600", medium: "bg-blue-100 text-blue-700", high: "bg-orange-100 text-orange-700", urgent: "bg-red-100 text-red-700" };
const categoryColor: Record<string, string> = { gst: "bg-green-100 text-green-700", itr: "bg-blue-100 text-blue-700", tds: "bg-yellow-100 text-yellow-700", audit: "bg-purple-100 text-purple-700", roc: "bg-orange-100 text-orange-700", general: "bg-gray-100 text-gray-700" };
const statusColor: Record<string, string> = { completed: "status-completed", pending: "status-pending", in_progress: "status-in_progress", overdue: "status-overdue", review: "status-review" };

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...defaultForm });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [subTasks, setSubTasks] = useState<Record<string, SubTask[]>>({});
  const [timeLogs, setTimeLogs] = useState<Record<string, TimeLog[]>>({});
  const [newSubTask, setNewSubTask] = useState<Record<string, string>>({});
  const [showTimeModal, setShowTimeModal] = useState<string | null>(null);
  const [timeForm, setTimeForm] = useState({ hours: "", description: "", logDate: new Date().toISOString().slice(0, 10) });
  const user = getUser();

  const load = () => fetch(`/api/tasks?firmId=${user?.firmId || ""}`).then(r => r.json()).then(setTasks);

  useEffect(() => {
    load();
    fetch(`/api/clients?firmId=${user?.firmId || ""}`).then(r => r.json()).then(setClients);
    fetch(`/api/employees?firmId=${user?.firmId || ""}`).then(r => r.json()).then(setEmployees);
  }, []);

  const loadSubTasks = async (taskId: string) => {
    const [subs, logs] = await Promise.all([
      fetch(`/api/tasks/${taskId}/subtasks`).then(r => r.json()),
      fetch(`/api/time-logs?firmId=${user?.firmId || ""}&taskId=${taskId}`).then(r => r.json()),
    ]);
    setSubTasks(prev => ({ ...prev, [taskId]: subs }));
    setTimeLogs(prev => ({ ...prev, [taskId]: logs }));
  };

  const toggleExpand = async (taskId: string) => {
    if (expandedTask === taskId) { setExpandedTask(null); return; }
    setExpandedTask(taskId);
    if (!subTasks[taskId]) await loadSubTasks(taskId);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const payload = { ...form, billingAmount: form.billingAmount ? parseFloat(form.billingAmount) : null, dueDate: form.dueDate ? new Date(form.dueDate) : null };
      const url = editId ? `/api/tasks/${editId}` : "/api/tasks";
      await fetch(url, { method: editId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, firmId: user?.firmId || "" }) });
      toast.success(editId ? "Task updated!" : "Task created!"); setShowModal(false); setForm({ ...defaultForm }); setEditId(null); load();
    } catch { toast.error("Failed to save"); } finally { setLoading(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/tasks/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    toast.success("Task deleted"); load();
  };

  const addSubTask = async (taskId: string) => {
    const title = newSubTask[taskId]?.trim();
    if (!title) return;
    await fetch(`/api/tasks/${taskId}/subtasks`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title }) });
    setNewSubTask(prev => ({ ...prev, [taskId]: "" }));
    await loadSubTasks(taskId);
  };

  const toggleSubTask = async (sub: SubTask) => {
    const newStatus = sub.status === "completed" ? "pending" : "completed";
    await fetch(`/api/subtasks/${sub.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
    await loadSubTasks(sub.taskId);
  };

  const deleteSubTask = async (sub: SubTask) => {
    await fetch(`/api/subtasks/${sub.id}`, { method: "DELETE" });
    await loadSubTasks(sub.taskId);
  };

  const logTime = async (taskId: string) => {
    if (!timeForm.hours || parseFloat(timeForm.hours) <= 0) { toast.error("Enter valid hours"); return; }
    await fetch("/api/time-logs", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firmId: user?.firmId, taskId, employeeId: user?.id, employeeName: user?.name, hours: parseFloat(timeForm.hours), description: timeForm.description, logDate: timeForm.logDate })
    });
    toast.success("Time logged!"); setShowTimeModal(null); setTimeForm({ hours: "", description: "", logDate: new Date().toISOString().slice(0, 10) });
    await loadSubTasks(taskId);
  };

  const deleteTimeLog = async (logId: string, taskId: string) => {
    await fetch(`/api/time-logs/${logId}`, { method: "DELETE" });
    await loadSubTasks(taskId);
  };

  const filtered = tasks.filter(t => (filterStatus === "all" || t.status === filterStatus) && (filterCat === "all" || t.category === filterCat));
  const clientName = (id?: string) => clients.find(c => c.id === id)?.name || "-";
  const empName = (id?: string) => employees.find(e => e.id === id)?.name || "-";

  // Excel export
  const exportTasks = () => {
    const rows = [
      ["Title", "Category", "Status", "Priority", "Client", "Assigned To", "Due Date", "Billing Amount", "Notes"],
      ...tasks.map(t => [t.title, t.category, t.status, t.priority, clientName(t.clientId), empName(t.assignedEmployeeId), t.dueDate ? new Date(t.dueDate).toLocaleDateString("en-IN") : "", t.billingAmount || "", t.notes || ""])
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `tasks_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    toast.success("Tasks exported!");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500 text-sm">{filtered.length} tasks shown</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportTasks} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">
            📊 Export
          </button>
          <button onClick={() => { setForm({ ...defaultForm }); setEditId(null); setShowModal(true); }} className="btn-blue flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {["all", "pending", "in_progress", "review", "completed", "overdue"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filterStatus === s ? "bg-white shadow text-blue-700" : "text-gray-500 hover:text-gray-700"}`}>
              {s === "all" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
          <option value="all">All Categories</option>
          {["gst", "itr", "tds", "audit", "roc", "general"].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        {[
          { label: "Total", count: tasks.length, color: "border-gray-200" },
          { label: "Pending", count: tasks.filter(t => t.status === "pending").length, color: "border-yellow-300" },
          { label: "In Progress", count: tasks.filter(t => t.status === "in_progress").length, color: "border-blue-300" },
          { label: "Overdue", count: tasks.filter(t => t.status === "overdue").length, color: "border-red-300" },
          { label: "Done", count: tasks.filter(t => t.status === "completed").length, color: "border-green-300" },
        ].map((s, i) => (
          <div key={i} className={`bg-white rounded-xl p-3 border-l-4 ${s.color} shadow-sm text-center`}>
            <p className="text-xl font-bold text-gray-900">{s.count}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No tasks found.</div>}
        {filtered.map(t => {
          const subs = subTasks[t.id] || [];
          const logs = timeLogs[t.id] || [];
          const totalHours = logs.reduce((s, l) => s + l.hours, 0);
          const completedSubs = subs.filter(s => s.status === "completed").length;
          const isExpanded = expandedTask === t.id;

          return (
            <Card key={t.id} className="border-0 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-0">
                {/* Main row */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button onClick={() => updateStatus(t.id, t.status === "completed" ? "pending" : "completed")} className="mt-0.5">
                        {statusIcon[t.status] || <Circle className="w-4 h-4 text-gray-400" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium ${t.status === "completed" ? "line-through text-gray-400" : "text-gray-900"}`}>{t.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          <span className={`text-xs px-2 py-0.5 rounded font-medium ${categoryColor[t.category] || "bg-gray-100 text-gray-600"}`}>{t.category?.toUpperCase()}</span>
                          <span className={`text-xs px-2 py-0.5 rounded font-medium ${priorityColor[t.priority] || ""}`}>{t.priority}</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[t.status] || ""}`}>{t.status?.replace("_", " ")}</span>
                          {t.clientId && <span className="text-xs text-gray-500">👤 {clientName(t.clientId)}</span>}
                          {t.assignedEmployeeId && <span className="text-xs text-gray-500">👷 {empName(t.assignedEmployeeId)}</span>}
                          {t.dueDate && <span className="text-xs text-gray-400">📅 {new Date(t.dueDate).toLocaleDateString("en-IN")}</span>}
                          {t.billingAmount && <span className="text-xs text-green-600 font-medium">₹{t.billingAmount.toLocaleString("en-IN")}</span>}
                          {subs.length > 0 && <span className="text-xs text-blue-500">{completedSubs}/{subs.length} subtasks</span>}
                          {totalHours > 0 && <span className="text-xs text-orange-500">⏱ {totalHours}h logged</span>}
                        </div>
                        {/* Subtask progress bar */}
                        {subs.length > 0 && (
                          <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                            <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${(completedSubs / subs.length) * 100}%` }} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => toggleExpand(t.id)} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 text-xs flex items-center gap-1">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                      <select value={t.status} onChange={e => updateStatus(t.id, e.target.value)} className="text-xs border border-gray-200 rounded px-2 py-1">
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="completed">Completed</option>
                        <option value="overdue">Overdue</option>
                      </select>
                      <button onClick={() => { setForm({ title: t.title, description: t.description || "", category: t.category, status: t.status, priority: t.priority, clientId: t.clientId || "", assignedEmployeeId: t.assignedEmployeeId || "", billingAmount: t.billingAmount?.toString() || "", dueDate: t.dueDate ? new Date(t.dueDate).toISOString().slice(0, 10) : "", recurring: t.recurring || "none", notes: t.notes || "" }); setEditId(t.id); setShowModal(true); }} className="p-1.5 hover:bg-blue-50 rounded text-blue-500">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => del(t.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded: Sub-tasks + Time logs */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50/50 space-y-4">
                    {/* Sub-tasks */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sub-tasks</h4>
                      <div className="space-y-1.5">
                        {subs.map(sub => (
                          <div key={sub.id} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-100">
                            <button onClick={() => toggleSubTask(sub)}>
                              {sub.status === "completed" ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4 text-gray-300" />}
                            </button>
                            <span className={`flex-1 text-sm ${sub.status === "completed" ? "line-through text-gray-400" : "text-gray-700"}`}>{sub.title}</span>
                            <button onClick={() => deleteSubTask(sub)} className="text-red-400 hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
                          </div>
                        ))}
                        <div className="flex gap-2 mt-1">
                          <input
                            value={newSubTask[t.id] || ""}
                            onChange={e => setNewSubTask(prev => ({ ...prev, [t.id]: e.target.value }))}
                            onKeyDown={e => e.key === "Enter" && addSubTask(t.id)}
                            placeholder="Add sub-task..."
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <button onClick={() => addSubTask(t.id)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Add</button>
                        </div>
                      </div>
                    </div>

                    {/* Time logs */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Time Logged: <span className="text-orange-600">{totalHours}h</span></h4>
                        <button onClick={() => setShowTimeModal(t.id)} className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-medium hover:bg-orange-100">
                          <Timer className="w-3 h-3" /> Log Time
                        </button>
                      </div>
                      {logs.length > 0 && (
                        <div className="space-y-1">
                          {logs.map(log => (
                            <div key={log.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100 text-xs">
                              <span className="text-gray-600">{log.employeeName}</span>
                              <span className="text-gray-400">{log.logDate}</span>
                              <span className="font-semibold text-orange-600">{log.hours}h</span>
                              <span className="text-gray-400 flex-1 mx-2 truncate">{log.description}</span>
                              <button onClick={() => deleteTimeLog(log.id, t.id)} className="text-red-400 hover:text-red-600"><X className="w-3 h-3" /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Time log modal */}
      {showTimeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold">Log Time</h2>
              <button onClick={() => setShowTimeModal(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Hours *</label>
                <input type="number" step="0.5" min="0.5" value={timeForm.hours} onChange={e => setTimeForm({ ...timeForm, hours: e.target.value })}
                  placeholder="e.g. 2.5" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Date</label>
                <input type="date" value={timeForm.logDate} onChange={e => setTimeForm({ ...timeForm, logDate: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                <input value={timeForm.description} onChange={e => setTimeForm({ ...timeForm, description: e.target.value })}
                  placeholder="What did you work on?" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowTimeModal(null)} className="flex-1 border border-gray-200 rounded-lg py-2 text-sm">Cancel</button>
                <button onClick={() => logTime(showTimeModal)} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 text-sm font-medium">Log Time</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">{editId ? "Edit Task" : "New Task"}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Task Title *</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., GSTR-3B Filing - August 2025" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {["gst", "itr", "tds", "audit", "roc", "general"].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Client</label>
                  <select value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select client</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Assign To</label>
                  <select value={form.assignedEmployeeId} onChange={e => setForm({ ...form, assignedEmployeeId: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select employee</option>
                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Billing Amount (₹)</label>
                  <input type="number" value={form.billingAmount} onChange={e => setForm({ ...form, billingAmount: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Recurring</label>
                  <select value={form.recurring} onChange={e => setForm({ ...form, recurring: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="none">None</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="annual">Annual</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="review">Review</option><option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-medium">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 btn-blue rounded-lg py-2.5 text-sm font-medium">
                  {loading ? "Saving..." : editId ? "Update" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
