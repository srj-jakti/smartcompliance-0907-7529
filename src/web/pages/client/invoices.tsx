import { useEffect, useState } from "react";
import { CheckCircle, CreditCard, Download, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";

export default function ClientInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const u = getUser();
    fetch(`/api/invoices?firmId=${u?.firmId||""}&clientId=${u?.id||""}`).then(r => r.json()).then(setInvoices);
  }, []);

  const filtered = filter === "all" ? invoices : invoices.filter(i => i.status === filter);
  const totalDue = invoices.filter(i => i.status !== "paid").reduce((s, i) => s + i.totalAmount, 0);
  const totalPaid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.totalAmount, 0);

  const statusColor: Record<string, string> = { paid: "status-completed", unpaid: "status-pending", partial: "status-in_progress", overdue: "status-overdue" };

  const payNow = (inv: any) => {
    toast.success(`Redirecting to payment for ${inv.invoiceNo}...`);
    // In production: open Razorpay / payment gateway
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Invoices</h1>
        <p className="text-gray-500 text-sm">View and pay your CA firm's invoices</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-sm text-red-600 mb-1">Amount Due</p>
          <p className="text-2xl font-bold text-red-700">₹{totalDue.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-sm text-green-600 mb-1">Total Paid</p>
          <p className="text-2xl font-bold text-green-700">₹{totalPaid.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm text-blue-600 mb-1">Total Invoices</p>
          <p className="text-2xl font-bold text-blue-700">{invoices.length}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["all", "unpaid", "paid", "overdue", "partial"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${filter === s ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-200 hover:border-green-300"}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No invoices found</div>}
        {filtered.map(inv => (
          <Card key={inv.id} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-blue-600">{inv.invoiceNo}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[inv.status] || ""}`}>{inv.status}</span>
                    </div>
                    {inv.description && <p className="text-sm text-gray-600 mt-1">{inv.description}</p>}
                    <div className="flex gap-4 mt-1 text-xs text-gray-400">
                      {inv.dueDate && <span>Due: {new Date(inv.dueDate).toLocaleDateString("en-IN")}</span>}
                      <span>GST: ₹{inv.gstAmount?.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">Amount</p>
                  <p className="text-xl font-bold text-gray-900">₹{inv.totalAmount?.toLocaleString("en-IN")}</p>
                  <div className="flex gap-2 mt-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs hover:bg-gray-100">
                      <Download className="w-3 h-3" /> PDF
                    </button>
                    {inv.status !== "paid" && (
                      <button onClick={() => payNow(inv)} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
                        <ExternalLink className="w-3 h-3" /> Pay Now
                      </button>
                    )}
                    {inv.status === "paid" && (
                      <span className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs">
                        <CheckCircle className="w-3 h-3" /> Paid
                      </span>
                    )}
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
