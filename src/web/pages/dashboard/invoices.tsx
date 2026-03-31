import { useEffect, useState, useRef } from "react";
import { Plus, X, IndianRupee, CheckCircle, Download, Upload, Sparkles, FileText, Table, Eye, Loader2, ScanLine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";

interface Invoice { id: string; invoiceNo: string; clientId: string; amount: number; gstAmount: number; totalAmount: number; status: string; dueDate?: string; description?: string; createdAt?: string; }
interface Client { id: string; name: string; gstin?: string; address?: string; email?: string; phone?: string; }

const defaultForm = { invoiceNo: "", clientId: "", amount: "", gstRate: "18", description: "", status: "unpaid", dueDate: "" };
const statusColor: Record<string, string> = { paid: "status-completed", unpaid: "status-pending", partial: "status-in_progress", overdue: "status-overdue" };

// ─── PDF GENERATOR ────────────────────────────────────────────────────────────
function generateInvoicePDF(inv: Invoice, client: Client, firmName: string) {
  const gstRate = inv.amount > 0 ? Math.round((inv.gstAmount / inv.amount) * 100) : 18;
  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; font-size: 13px; color: #1a1a2e; background: #fff; }
  .page { width: 210mm; min-height: 297mm; padding: 20mm; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 3px solid #1e3a8a; padding-bottom: 20px; }
  .brand h1 { font-size: 24px; font-weight: 800; color: #1e3a8a; }
  .brand p { color: #64748b; font-size: 12px; margin-top: 4px; }
  .inv-title { text-align: right; }
  .inv-title h2 { font-size: 28px; font-weight: 700; color: #1e3a8a; letter-spacing: 2px; }
  .inv-title p { color: #64748b; margin-top: 4px; }
  .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
  .meta-box h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 8px; }
  .meta-box p { font-size: 13px; font-weight: 600; color: #1a1a2e; }
  .meta-box .sub { font-size: 12px; font-weight: 400; color: #475569; margin-top: 2px; }
  .items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  .items th { background: #1e3a8a; color: #fff; padding: 10px 14px; text-align: left; font-size: 12px; }
  .items td { padding: 12px 14px; border-bottom: 1px solid #e2e8f0; }
  .items tr:nth-child(even) td { background: #f8fafc; }
  .totals { margin-left: auto; width: 280px; }
  .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
  .totals-row.total { border-top: 2px solid #1e3a8a; margin-top: 6px; padding-top: 10px; font-size: 16px; font-weight: 700; color: #1e3a8a; }
  .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
  .status-paid { background: #dcfce7; color: #15803d; }
  .status-unpaid { background: #fef3c7; color: #b45309; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; color: #64748b; font-size: 11px; }
  .notes { background: #f8fafc; border-left: 4px solid #1e3a8a; padding: 12px 16px; margin-bottom: 20px; border-radius: 0 8px 8px 0; }
  .notes p { font-size: 12px; color: #475569; }
  @media print { body { print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="brand">
      <h1>${firmName}</h1>
      <p>Chartered Accountants & Tax Consultants</p>
    </div>
    <div class="inv-title">
      <h2>INVOICE</h2>
      <p style="font-size:16px; font-weight:700; color:#1e3a8a">${inv.invoiceNo}</p>
      <p>Date: ${new Date(inv.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
      ${inv.dueDate ? `<p>Due: ${new Date(inv.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>` : ""}
      <div style="margin-top:8px"><span class="status-badge status-${inv.status}">${inv.status}</span></div>
    </div>
  </div>

  <div class="meta">
    <div class="meta-box">
      <h3>Billed To</h3>
      <p>${client.name}</p>
      ${client.address ? `<p class="sub">${client.address}</p>` : ""}
      ${client.gstin ? `<p class="sub">GSTIN: ${client.gstin}</p>` : ""}
      ${client.email ? `<p class="sub">${client.email}</p>` : ""}
      ${client.phone ? `<p class="sub">${client.phone}</p>` : ""}
    </div>
    <div class="meta-box" style="text-align:right">
      <h3>Payment Info</h3>
      <p>Invoice No: ${inv.invoiceNo}</p>
      <p class="sub">Status: <strong>${inv.status.toUpperCase()}</strong></p>
    </div>
  </div>

  ${inv.description ? `<div class="notes"><p><strong>Description:</strong> ${inv.description}</p></div>` : ""}

  <table class="items">
    <thead>
      <tr>
        <th>#</th>
        <th>Description</th>
        <th style="text-align:right">Amount (₹)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>${inv.description || "Professional Services"}</td>
        <td style="text-align:right">₹${inv.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row"><span>Subtotal:</span><span>₹${inv.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>
    <div class="totals-row"><span>GST (${gstRate}%):</span><span>₹${inv.gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>
    <div class="totals-row total"><span>Total Amount:</span><span>₹${inv.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>
  </div>

  <div class="footer">
    <div>
      <p>Thank you for your business!</p>
      <p>Generated by SmartCompliance Tracker</p>
    </div>
    <div style="text-align:right">
      <p>${firmName}</p>
      <p>Authorized Signatory</p>
    </div>
  </div>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win) {
    win.onload = () => { win.print(); };
  }
  toast.success("Invoice opened for printing/saving as PDF");
}

// ─── EXCEL EXPORT ─────────────────────────────────────────────────────────────
function exportToExcel(invoices: Invoice[], clients: Client[]) {
  const clientName = (id: string) => clients.find(c => c.id === id)?.name || "Unknown";
  const rows = [
    ["Invoice No", "Client", "Description", "Amount (₹)", "GST (₹)", "Total (₹)", "Status", "Due Date", "Created"],
    ...invoices.map(inv => [
      inv.invoiceNo,
      clientName(inv.clientId),
      inv.description || "",
      inv.amount,
      inv.gstAmount,
      inv.totalAmount,
      inv.status,
      inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-IN") : "",
      inv.createdAt ? new Date(inv.createdAt).toLocaleDateString("en-IN") : "",
    ])
  ];

  // Build CSV (Excel-compatible)
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `invoices_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  toast.success("Excel/CSV exported!");
}

// ─── AI EXTRACTION TYPES ──────────────────────────────────────────────────────
interface ExtractedInvoice { vendor: string; invoiceNo: string; date: string; amount: string; gst: string; total: string; description: string; rawText?: string; }

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showExtractModal, setShowExtractModal] = useState(false);
  const [form, setForm] = useState({ ...defaultForm });
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

  // AI extraction state
  const [extractFiles, setExtractFiles] = useState<File[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedInvoice[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = getUser();

  const load = () => fetch(`/api/invoices?firmId=${user?.firmId || ""}`).then(r => r.json()).then(setInvoices);
  useEffect(() => {
    load();
    fetch(`/api/clients?firmId=${user?.firmId || ""}`).then(r => r.json()).then(setClients);
  }, []);

  const clientName = (id: string) => clients.find(c => c.id === id)?.name || "Unknown";
  const clientObj = (id: string) => clients.find(c => c.id === id) || { id, name: "Unknown" } as Client;

  const totalRevenue = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.totalAmount, 0);
  const pendingAmount = invoices.filter(i => i.status !== "paid").reduce((s, i) => s + i.totalAmount, 0);
  const filtered = invoices.filter(i => filterStatus === "all" || i.status === filterStatus);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const amount = parseFloat(form.amount);
      const gstAmount = amount * (parseFloat(form.gstRate) / 100);
      const totalAmount = amount + gstAmount;
      const invNo = form.invoiceNo || `INV-${Date.now()}`;
      await fetch("/api/invoices", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, invoiceNo: invNo, amount, gstAmount, totalAmount, dueDate: form.dueDate ? new Date(form.dueDate) : null, firmId: user?.firmId || "" })
      });
      toast.success("Invoice created!"); setShowModal(false); setForm({ ...defaultForm }); load();
    } catch { toast.error("Failed"); } finally { setLoading(false); }
  };

  const markPaid = async (id: string) => {
    await fetch(`/api/invoices/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "paid", paidAt: new Date() }) });
    toast.success("Marked as paid!"); load();
  };

  // ─── AI INVOICE EXTRACTION ─────────────────────────────────────────────────
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/") || f.type === "application/pdf");
    setExtractFiles(prev => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setExtractFiles(prev => [...prev, ...files]);
  };

  const extractInvoices = async () => {
    if (extractFiles.length === 0) { toast.error("Upload at least one image/PDF"); return; }
    setExtracting(true);
    setExtracted([]);
    try {
      const results: ExtractedInvoice[] = [];
      for (const file of extractFiles) {
        const base64 = await fileToBase64(file);
        const res = await fetch("/api/ai/extract-invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, mimeType: file.type, fileName: file.name })
        });
        if (res.ok) {
          const data = await res.json();
          results.push({ ...data, fileName: file.name });
        } else {
          results.push({ vendor: file.name, invoiceNo: "", date: "", amount: "0", gst: "0", total: "0", description: "Extraction failed" });
        }
      }
      setExtracted(results);
      toast.success(`Extracted ${results.length} invoice(s)!`);
    } catch (err) {
      toast.error("Extraction failed");
    } finally {
      setExtracting(false);
    }
  };

  const exportExtractedExcel = () => {
    const rows = [
      ["Vendor/Party", "Invoice No", "Date", "Amount (₹)", "GST (₹)", "Total (₹)", "Description"],
      ...extracted.map(e => [e.vendor, e.invoiceNo, e.date, e.amount, e.gst, e.total, e.description])
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `extracted_invoices_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success("Extracted data exported to Excel!");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 text-sm">{invoices.length} invoices · ₹{totalRevenue.toLocaleString("en-IN")} collected</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowExtractModal(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
            <ScanLine className="w-4 h-4" /> AI Extract
          </button>
          <button onClick={() => exportToExcel(filtered, clients)} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Table className="w-4 h-4" /> Export Excel
          </button>
          <button onClick={() => setShowModal(true)} className="btn-blue flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" /> New Invoice
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-600 mb-1">Revenue Collected</p>
          <p className="text-2xl font-bold text-green-700">₹{totalRevenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-600 mb-1">Pending Amount</p>
          <p className="text-2xl font-bold text-yellow-700">₹{pendingAmount.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-600 mb-1">Total Invoices</p>
          <p className="text-2xl font-bold text-blue-700">{invoices.length}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-5 w-fit">
        {["all", "unpaid", "paid", "overdue", "partial"].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filterStatus === s ? "bg-white shadow text-blue-700" : "text-gray-500 hover:text-gray-700"}`}>
            {s === "all" ? `All (${invoices.length})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${invoices.filter(i => i.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No invoices found.</div>}
        {filtered.map(inv => (
          <Card key={inv.id} className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold text-blue-600">{inv.invoiceNo}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[inv.status] || ""}`}>{inv.status}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1 font-medium">{clientName(inv.clientId)}</p>
                  {inv.description && <p className="text-xs text-gray-400 mt-0.5">{inv.description}</p>}
                  {inv.dueDate && <p className="text-xs text-gray-400 mt-0.5">Due: {new Date(inv.dueDate).toLocaleDateString("en-IN")}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-gray-500">₹{inv.amount?.toLocaleString("en-IN")} + GST</p>
                  <p className="text-lg font-bold text-gray-900">₹{inv.totalAmount?.toLocaleString("en-IN")}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setViewInvoice(inv)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100">
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                  <button onClick={() => generateInvoicePDF(inv, clientObj(inv.clientId), user?.firmName || "CA Firm")}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100">
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                  {inv.status !== "paid" && (
                    <button onClick={() => markPaid(inv.id)} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100">
                      <CheckCircle className="w-3.5 h-3.5" /> Paid
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ─── CREATE INVOICE MODAL ─── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">Create Invoice</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Invoice No</label>
                <input value={form.invoiceNo} onChange={e => setForm({ ...form, invoiceNo: e.target.value })} placeholder="Auto-generated"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Client *</label>
                <select required value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Amount (₹) *</label>
                  <input required type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">GST Rate (%)</label>
                  <select value={form.gstRate} onChange={e => setForm({ ...form, gstRate: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="0">0% (Exempt)</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
              </div>
              {form.amount && (
                <div className="bg-blue-50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between"><span>Subtotal:</span><span>₹{parseFloat(form.amount || "0").toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between text-gray-500">
                    <span>GST ({form.gstRate}%):</span>
                    <span>₹{(parseFloat(form.amount || "0") * parseFloat(form.gstRate) / 100).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-bold text-blue-700 border-t border-blue-200 mt-1 pt-1">
                    <span>Total:</span>
                    <span>₹{(parseFloat(form.amount || "0") * (1 + parseFloat(form.gstRate) / 100)).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 btn-blue rounded-lg py-2.5 text-sm font-medium">
                  {loading ? "Creating..." : "Create Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── VIEW INVOICE MODAL ─── */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold">Invoice Preview</h2>
              <button onClick={() => setViewInvoice(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6">
              <div className="flex justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-blue-700">{user?.firmName || "CA Firm"}</h3>
                  <p className="text-gray-500 text-sm">Chartered Accountants</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">INVOICE</p>
                  <p className="text-blue-600 font-semibold">{viewInvoice.invoiceNo}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[viewInvoice.status]}`}>{viewInvoice.status}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-xs text-gray-500 mb-1">BILLED TO</p>
                <p className="font-semibold">{clientName(viewInvoice.clientId)}</p>
              </div>
              <div className="border rounded-xl overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-blue-700 text-white">
                    <tr><th className="text-left p-3">Description</th><th className="text-right p-3">Amount</th></tr>
                  </thead>
                  <tbody>
                    <tr className="border-b"><td className="p-3">{viewInvoice.description || "Professional Services"}</td><td className="p-3 text-right">₹{viewInvoice.amount?.toLocaleString("en-IN")}</td></tr>
                    <tr className="border-b bg-gray-50"><td className="p-3 text-gray-500">GST</td><td className="p-3 text-right text-gray-500">₹{viewInvoice.gstAmount?.toLocaleString("en-IN")}</td></tr>
                    <tr className="bg-blue-50"><td className="p-3 font-bold text-blue-700">Total</td><td className="p-3 text-right font-bold text-blue-700 text-lg">₹{viewInvoice.totalAmount?.toLocaleString("en-IN")}</td></tr>
                  </tbody>
                </table>
              </div>
              <button onClick={() => { generateInvoicePDF(viewInvoice, clientObj(viewInvoice.clientId), user?.firmName || "CA Firm"); setViewInvoice(null); }}
                className="w-full btn-blue py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download / Print PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── AI EXTRACT MODAL ─── */}
      {showExtractModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">AI Invoice Extractor</h2>
                  <p className="text-xs text-gray-500">Upload sales invoices — AI extracts all data automatically</p>
                </div>
              </div>
              <button onClick={() => { setShowExtractModal(false); setExtractFiles([]); setExtracted([]); }}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Drop zone */}
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center cursor-pointer hover:bg-purple-50 transition-colors"
              >
                <Upload className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                <p className="font-medium text-gray-700">Drag & drop invoice images here</p>
                <p className="text-sm text-gray-400 mt-1">PNG, JPG, PDF supported · Multiple files allowed</p>
                <p className="text-xs text-purple-600 mt-2 font-medium">Click to browse files</p>
                <input ref={fileInputRef} type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={handleFileSelect} />
              </div>

              {/* File list */}
              {extractFiles.length > 0 && (
                <div className="space-y-2">
                  {extractFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{f.name}</span>
                        <span className="text-xs text-gray-400">({(f.size / 1024).toFixed(0)} KB)</span>
                      </div>
                      <button onClick={() => setExtractFiles(prev => prev.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={extractInvoices} disabled={extracting || extractFiles.length === 0}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                {extracting ? <><Loader2 className="w-4 h-4 animate-spin" /> Extracting with AI...</> : <><Sparkles className="w-4 h-4" /> Extract Invoice Data</>}
              </button>

              {/* Results */}
              {extracted.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">Extracted Data ({extracted.length} invoices)</h3>
                    <button onClick={exportExtractedExcel} className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
                      <Table className="w-3.5 h-3.5" /> Export to Excel
                    </button>
                  </div>
                  <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          {["Vendor/Party", "Invoice No", "Date", "Amount", "GST", "Total", "Description"].map(h => (
                            <th key={h} className="text-left p-3 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {extracted.map((e, i) => (
                          <tr key={i} className="border-t hover:bg-gray-50">
                            <td className="p-3 font-medium">{e.vendor}</td>
                            <td className="p-3 text-blue-600">{e.invoiceNo || "-"}</td>
                            <td className="p-3">{e.date || "-"}</td>
                            <td className="p-3">₹{e.amount}</td>
                            <td className="p-3">₹{e.gst}</td>
                            <td className="p-3 font-semibold">₹{e.total}</td>
                            <td className="p-3 text-gray-500 max-w-[120px] truncate">{e.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">Review data before use. AI extraction may have minor errors.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper: file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]); // strip data:...;base64,
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
