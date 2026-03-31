import { useEffect, useState } from "react";
import { Calendar, AlertTriangle, Clock, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getUser } from "@/lib/auth";

export default function ClientCompliance() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    const u = getUser();
    fetch(`/api/compliance?firmId=${u?.firmId||""}`).then(r => r.json()).then(setItems);
  }, []);

  const today = new Date();
  const getDays = (d: string) => Math.ceil((new Date(d).getTime() - today.getTime()) / 86400000);

  const catColor: Record<string, string> = {
    gst: "bg-green-100 text-green-700", itr: "bg-blue-100 text-blue-700",
    tds: "bg-yellow-100 text-yellow-700", roc: "bg-orange-100 text-orange-700"
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Compliance Due Dates</h1>
        <p className="text-gray-500 text-sm">All GST, ITR, TDS deadlines for your compliance</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <div>
            <p className="text-2xl font-bold text-red-600">{items.filter(i => getDays(i.dueDate) < 0).length}</p>
            <p className="text-sm text-red-600">Overdue</p>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
          <Bell className="w-6 h-6 text-orange-500" />
          <div>
            <p className="text-2xl font-bold text-orange-600">{items.filter(i => { const d = getDays(i.dueDate); return d >= 0 && d <= 7; }).length}</p>
            <p className="text-sm text-orange-600">Due in 7 days</p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <Clock className="w-6 h-6 text-blue-500" />
          <div>
            <p className="text-2xl font-bold text-blue-600">{items.filter(i => { const d = getDays(i.dueDate); return d > 7 && d <= 30; }).length}</p>
            <p className="text-sm text-blue-600">Due in 30 days</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {items.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map(item => {
          const d = getDays(item.dueDate);
          const isOverdue = d < 0;
          const isUrgent = d >= 0 && d <= 7;
          return (
            <Card key={item.id} className={`border-0 shadow-sm ${isOverdue ? "border-l-4 border-l-red-500" : isUrgent ? "border-l-4 border-l-orange-500" : "border-l-4 border-l-green-400"}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isOverdue ? "bg-red-100" : isUrgent ? "bg-orange-100" : "bg-green-50"}`}>
                      {isOverdue ? <AlertTriangle className="w-5 h-5 text-red-500" /> : isUrgent ? <Bell className="w-5 h-5 text-orange-500" /> : <Calendar className="w-5 h-5 text-green-600" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${catColor[item.category?.toLowerCase()] || "bg-gray-100 text-gray-600"}`}>{item.category?.toUpperCase()}</span>
                        {item.applicableTo && <span className="text-xs text-gray-400">• {item.applicableTo}</span>}
                      </div>
                      {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">{new Date(item.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    <p className={`text-sm font-bold mt-0.5 ${isOverdue ? "text-red-500" : isUrgent ? "text-orange-500" : "text-green-600"}`}>
                      {isOverdue ? `${Math.abs(d)}d overdue` : d === 0 ? "Due today!" : `${d} days left`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
