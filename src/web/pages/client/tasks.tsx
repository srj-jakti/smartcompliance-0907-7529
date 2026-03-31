import { useEffect, useState } from "react";
import { FileText, CheckCircle, Clock, AlertTriangle, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getUser } from "@/lib/auth";

export default function ClientTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const u = getUser();
    fetch(`/api/tasks?firmId=${u?.firmId||""}&clientId=${u?.id||""}`).then(r => r.json()).then(setTasks);
  }, []);

  const filtered = tasks.filter(t => filter === "all" || t.status === filter);

  const statusColor: Record<string, string> = {
    completed: "status-completed", pending: "status-pending",
    in_progress: "status-in_progress", overdue: "status-overdue"
  };

  const catColor: Record<string, string> = {
    gst: "bg-green-100 text-green-700", itr: "bg-blue-100 text-blue-700",
    tds: "bg-yellow-100 text-yellow-700", audit: "bg-purple-100 text-purple-700",
    roc: "bg-orange-100 text-orange-700", general: "bg-gray-100 text-gray-600"
  };

  const statusIcon: Record<string, JSX.Element> = {
    completed: <CheckCircle className="w-5 h-5 text-green-500" />,
    in_progress: <Clock className="w-5 h-5 text-blue-500" />,
    pending: <Clock className="w-5 h-5 text-yellow-500" />,
    overdue: <AlertTriangle className="w-5 h-5 text-red-500" />,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Filings & Tasks</h1>
        <p className="text-gray-500 text-sm">Track all your compliance work with your CA firm</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["all", "pending", "in_progress", "completed", "overdue"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${filter === s ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-200 hover:border-green-300"}`}>
            {s === "all" ? "All" : s.replace("_", " ")} {s !== "all" && `(${tasks.filter(t => t.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No filings in this category</div>}
        {filtered.map(t => (
          <Card key={t.id} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  {statusIcon[t.status] || <FileText className="w-5 h-5 text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{t.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${catColor[t.category] || "bg-gray-100 text-gray-600"}`}>
                          {t.category?.toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[t.status] || ""}`}>
                          {t.status?.replace("_", " ")}
                        </span>
                        {t.billingAmount && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            💰 ₹{t.billingAmount?.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>
                    {t.dueDate && (
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-xs">{new Date(t.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{t.status === "completed" ? "100%" : t.status === "in_progress" ? "60%" : t.status === "review" ? "80%" : "0%"}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${t.status === "completed" ? "bg-green-500" : t.status === "overdue" ? "bg-red-400" : "bg-blue-500"}`}
                        style={{ width: t.status === "completed" ? "100%" : t.status === "in_progress" ? "60%" : t.status === "review" ? "80%" : "10%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
