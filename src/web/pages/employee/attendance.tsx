import { useState, useEffect } from "react";
import { Clock, CheckCircle, Calendar, Plus, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";

const today = new Date().toISOString().split("T")[0];

export default function EmployeeAttendance() {
  const user = getUser();
  const [tab, setTab] = useState<"attendance" | "leave">("attendance");

  // Attendance state
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [saved, setSaved] = useState(false);

  // Leave state
  const [leaves, setLeaves] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [leaveType, setLeaveType] = useState("casual");
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const now = () => new Date().toTimeString().slice(0, 5);

  const handleCheckIn = () => {
    const t = now(); setCheckIn(t);
    toast.success(`Checked in at ${t}`);
  };

  const handleCheckOut = () => {
    const t = now(); setCheckOut(t);
    toast.success(`Checked out at ${t}`);
  };

  const save = async () => {
    if (!user) return;
    await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firmId: user.firmId, employeeId: user.id, date: today, checkIn, checkOut, status: "present" })
    });
    setSaved(true); toast.success("Attendance saved!");
  };

  const workHours = checkIn && checkOut ? (() => {
    const [ih, im] = checkIn.split(":").map(Number);
    const [oh, om] = checkOut.split(":").map(Number);
    const diff = (oh * 60 + om) - (ih * 60 + im);
    return diff > 0 ? `${Math.floor(diff / 60)}h ${diff % 60}m` : "—";
  })() : null;

  const loadLeaves = () => {
    if (!user) return;
    fetch(`/api/leaves?firmId=${user.firmId}&empId=${user.id}`)
      .then(r => r.json())
      .then(d => setLeaves(Array.isArray(d) ? d : []))
      .catch(() => {});
  };

  useEffect(() => { loadLeaves(); }, []);

  const calcDays = () => {
    const d1 = new Date(fromDate), d2 = new Date(toDate);
    const diff = Math.round((d2.getTime() - d1.getTime()) / 86400000) + 1;
    return diff > 0 ? diff : 1;
  };

  const submitLeave = async () => {
    if (!user) return;
    if (!reason.trim()) { toast.error("Please enter a reason"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firmId: user.firmId,
          employeeId: user.id,
          employeeName: user.name,
          leaveType,
          fromDate,
          toDate,
          days: calcDays(),
          reason,
        }),
      });
      if (res.ok) {
        toast.success("Leave request submitted!");
        setShowForm(false);
        setReason("");
        setFromDate(today);
        setToDate(today);
        loadLeaves();
      } else {
        toast.error("Failed to submit leave");
      }
    } catch {
      toast.error("Error submitting leave");
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance & Leave</h1>
        <p className="text-gray-500 text-sm">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[{ id: "attendance", label: "Attendance" }, { id: "leave", label: "Leave Requests" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "attendance" && (
        <div className="max-w-md">
          <Card className="border-0 shadow-sm mb-4">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg">
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{user?.empRole} • {user?.firmName}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-green-600 mb-1">Check In</p>
                    <p className="text-2xl font-bold text-green-700">{checkIn || "—:—"}</p>
                    <button onClick={handleCheckIn} disabled={!!checkIn}
                      className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white text-xs py-1.5 rounded-lg font-medium disabled:opacity-50 transition-colors">
                      {checkIn ? "✓ Checked In" : "Check In Now"}
                    </button>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-blue-600 mb-1">Check Out</p>
                    <p className="text-2xl font-bold text-blue-700">{checkOut || "—:—"}</p>
                    <button onClick={handleCheckOut} disabled={!checkIn || !!checkOut}
                      className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 rounded-lg font-medium disabled:opacity-50 transition-colors">
                      {checkOut ? "✓ Checked Out" : "Check Out"}
                    </button>
                  </div>
                </div>

                {workHours && (
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-purple-600 mb-1">Work Hours Today</p>
                    <p className="text-3xl font-bold text-purple-700">{workHours}</p>
                  </div>
                )}

                {checkIn && !saved && (
                  <button onClick={save} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Save Attendance
                  </button>
                )}
                {saved && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center text-green-700 font-medium text-sm">
                    ✓ Attendance saved for today!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
            <p className="font-medium mb-2">📋 Attendance Rules</p>
            <ul className="space-y-1 text-xs text-gray-500">
              <li>• Office hours: 10:00 AM – 6:00 PM</li>
              <li>• Half day: less than 4 hours work</li>
              <li>• Mark attendance before 11 AM</li>
              <li>• Use Leave tab to apply for leave</li>
            </ul>
          </div>
        </div>
      )}

      {tab === "leave" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{leaves.length} leave request{leaves.length !== 1 ? "s" : ""}</p>
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
              <Plus className="w-4 h-4" /> Apply Leave
            </button>
          </div>

          {/* Apply Leave Form */}
          {showForm && (
            <Card className="border-0 shadow-sm mb-4">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">New Leave Request</h3>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Leave Type</label>
                    <select value={leaveType} onChange={e => setLeaveType(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="casual">Casual Leave</option>
                      <option value="sick">Sick Leave</option>
                      <option value="earned">Earned Leave</option>
                      <option value="half_day">Half Day</option>
                      <option value="work_from_home">Work From Home</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">From Date</label>
                      <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                        min={today}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">To Date</label>
                      <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                        min={fromDate}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                  </div>
                  <div className="text-sm text-purple-600 font-medium">
                    Duration: {calcDays()} day{calcDays() !== 1 ? "s" : ""}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Reason</label>
                    <textarea value={reason} onChange={e => setReason(e.target.value)}
                      rows={3} placeholder="Brief reason for leave..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setShowForm(false)}
                      className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                      Cancel
                    </button>
                    <button onClick={submitLeave} disabled={submitting}
                      className="flex-1 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-60">
                      {submitting ? "Submitting..." : "Submit Request"}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leave history */}
          {leaves.length === 0 && !showForm && (
            <div className="text-center py-12 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No leave requests yet</p>
            </div>
          )}
          <div className="space-y-3">
            {leaves.map(l => (
              <Card key={l.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 capitalize">{l.leaveType?.replace("_", " ")} Leave</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[l.status] || "bg-gray-100 text-gray-600"}`}>
                          {l.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(l.fromDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        {l.fromDate !== l.toDate && ` – ${new Date(l.toDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                        {" "}• {l.days} day{l.days !== 1 ? "s" : ""}
                      </p>
                      {l.reason && <p className="text-xs text-gray-400 mt-1">{l.reason}</p>}
                    </div>
                    <div className="text-right text-xs text-gray-400 flex-shrink-0">
                      {l.createdAt && new Date(typeof l.createdAt === "number" ? l.createdAt * 1000 : l.createdAt).toLocaleDateString("en-IN")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
