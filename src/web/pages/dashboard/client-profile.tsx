import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Phone, Mail, MapPin, CreditCard, Building2, User, CheckCircle, Clock, AlertTriangle, FileText, FolderOpen, Shield, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth";

const statusColor: Record<string, string> = {
  completed: "status-completed", pending: "status-pending",
  in_progress: "status-in_progress", overdue: "status-overdue",
  paid: "status-completed", unpaid: "status-pending",
};

const catColor: Record<string, string> = {
  gst: "bg-green-100 text-green-700", itr: "bg-blue-100 text-blue-700",
  tds: "bg-yellow-100 text-yellow-700", audit: "bg-purple-100 text-purple-700",
  roc: "bg-orange-100 text-orange-700", general: "bg-gray-100 text-gray-600",
  pan: "bg-blue-100 text-blue-700", bank: "bg-yellow-100 text-yellow-700", other: "bg-gray-100 text-gray-600",
};

export default function ClientProfile() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [, navigate] = useLocation();
  const firmId = getUser()?.firmId || "";

  const [client, setClient] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [dscs, setDscs] = useState<any[]>([]);
  const [tab, setTab] = useState<"overview" | "tasks" | "invoices" | "docs" | "dsc">("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !firmId) return;
    Promise.all([
      fetch(`/api/clients/${id}`).then(r => r.json()),
      fetch(`/api/tasks?firmId=${firmId}&clientId=${id}`).then(r => r.json()),
      fetch(`/api/invoices?firmId=${firmId}&clientId=${id}`).then(r => r.json()),
      fetch(`/api/documents?firmId=${firmId}&clientId=${id}`).then(r => r.json()),
      fetch(`/api/dsc?firmId=${firmId}&clientId=${id}`).then(r => r.json()),
    ]).then(([c, t, i, d, dsc]) => {
      setClient(c);
      setTasks(Array.isArray(t) ? t : []);
      setInvoices(Array.isArray(i) ? i : []);
      setDocs(Array.isArray(d) ? d : []);
      setDscs(Array.isArray(dsc) ? dsc : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id, firmId]);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading client profile...</div>;
  if (!client) return (
    <div className="text-center py-20 text-gray-400">
      <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
      <p>Client not found.</p>
      <button onClick={() => navigate("/dashboard/clients")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Back to Clients</button>
    </div>
  );

  const totalDue = invoices.filter(i => i.status !== "paid").reduce((s, i) => s + (i.totalAmount || 0), 0);
  const activeTasks = tasks.filter(t => t.status !== "completed");
  const overdueTasks = tasks.filter(t => t.status === "overdue");

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "tasks", label: `Tasks (${tasks.length})` },
    { key: "invoices", label: `Invoices (${invoices.length})` },
    { key: "docs", label: `Docs (${docs.length})` },
    { key: "dsc", label: `DSC (${dscs.length})` },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/dashboard/clients")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${client.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {client.status}
                </span>
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium capitalize">{client.clientType}</span>
                {client.city && <span className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{client.city}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs text-blue-600 mb-1">Active Tasks</p>
          <p className="text-2xl font-bold text-blue-700">{activeTasks.length}</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-xs text-red-600 mb-1">Overdue</p>
          <p className="text-2xl font-bold text-red-700">{overdueTasks.length}</p>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
          <p className="text-xs text-orange-600 mb-1">Amount Due</p>
          <p className="text-xl font-bold text-orange-700">₹{totalDue.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-xs text-green-600 mb-1">Total Invoices</p>
          <p className="text-2xl font-bold text-green-700">{invoices.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
              tab === t.key ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Client Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {client.phone && <div className="flex items-center gap-3 text-sm"><Phone className="w-4 h-4 text-gray-400 flex-shrink-0" /><span>{client.phone}</span></div>}
              {client.email && <div className="flex items-center gap-3 text-sm"><Mail className="w-4 h-4 text-gray-400 flex-shrink-0" /><span>{client.email}</span></div>}
              {(client.city || client.state) && (
                <div className="flex items-center gap-3 text-sm"><MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" /><span>{[client.city, client.state].filter(Boolean).join(", ")}</span></div>
              )}
              {client.pan && <div className="flex items-center gap-3 text-sm"><CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" /><span>PAN: <strong>{client.pan}</strong></span></div>}
              {client.gstin && <div className="flex items-center gap-3 text-sm"><Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" /><span>GSTIN: <strong>{client.gstin}</strong></span></div>}
              {client.assignedTo && <div className="flex items-center gap-3 text-sm"><User className="w-4 h-4 text-gray-400 flex-shrink-0" /><span>Assigned to: {client.assignedTo}</span></div>}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" /> Recent Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? <p className="text-sm text-gray-400">No tasks yet</p> : (
                <div className="space-y-2">
                  {tasks.slice(0, 5).map(t => (
                    <div key={t.id} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-700 truncate flex-1">{t.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusColor[t.status] || ""}`}>{t.status?.replace("_"," ")}</span>
                    </div>
                  ))}
                  {tasks.length > 5 && <p className="text-xs text-gray-400 mt-2">+{tasks.length - 5} more — see Tasks tab</p>}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> Recent Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? <p className="text-sm text-gray-400">No invoices yet</p> : (
                <div className="space-y-2">
                  {invoices.slice(0, 5).map(i => (
                    <div key={i.id} className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-sm font-medium text-blue-600">{i.invoiceNo}</span>
                        {i.description && <p className="text-xs text-gray-400">{i.description}</p>}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gray-800">₹{i.totalAmount?.toLocaleString("en-IN")}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[i.status] || ""}`}>{i.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" /> DSC Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dscs.length === 0 ? <p className="text-sm text-gray-400">No DSC records</p> : (
                <div className="space-y-2">
                  {dscs.map(d => {
                    const days = Math.ceil((new Date(d.expiryDate).getTime() - Date.now()) / 86400000);
                    const isExpired = days < 0;
                    const isNear = days >= 0 && days <= 30;
                    return (
                      <div key={d.id} className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{d.holderName}</p>
                          <p className="text-xs text-gray-400">{d.dscClass} • {d.issuer}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-500">Expires {new Date(d.expiryDate).toLocaleDateString("en-IN")}</p>
                          <p className={`text-xs font-bold ${isExpired ? "text-red-500" : isNear ? "text-orange-500" : "text-green-600"}`}>
                            {isExpired ? "Expired" : isNear ? `${days}d left` : "Valid"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tasks Tab */}
      {tab === "tasks" && (
        <div className="space-y-3">
          {tasks.length === 0 && <div className="text-center py-16 text-gray-400"><Clock className="w-10 h-10 mx-auto mb-3 text-gray-300" /><p>No tasks for this client</p></div>}
          {tasks.map(t => (
            <Card key={t.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{t.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${catColor[t.category] || catColor.general}`}>{t.category?.toUpperCase()}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[t.status] || ""}`}>{t.status?.replace("_", " ")}</span>
                      {t.billingAmount && <span className="text-xs text-gray-500">💰 ₹{t.billingAmount?.toLocaleString("en-IN")}</span>}
                    </div>
                  </div>
                  {t.dueDate && (
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs">{new Date(t.dueDate).toLocaleDateString("en-IN")}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Invoices Tab */}
      {tab === "invoices" && (
        <div className="space-y-3">
          {invoices.length === 0 && <div className="text-center py-16 text-gray-400"><FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" /><p>No invoices for this client</p></div>}
          {invoices.map(inv => (
            <Card key={inv.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600">{inv.invoiceNo}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[inv.status] || ""}`}>{inv.status}</span>
                    </div>
                    {inv.description && <p className="text-sm text-gray-500 mt-1">{inv.description}</p>}
                    {inv.dueDate && <p className="text-xs text-gray-400 mt-1">Due: {new Date(inv.dueDate).toLocaleDateString("en-IN")}</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-gray-900">₹{inv.totalAmount?.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-gray-400">GST: ₹{inv.gstAmount?.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Docs Tab */}
      {tab === "docs" && (
        <div className="space-y-3">
          {docs.length === 0 && <div className="text-center py-16 text-gray-400"><FolderOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" /><p>No documents for this client</p></div>}
          {docs.map(doc => (
            <Card key={doc.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="w-8 h-8 text-red-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${catColor[doc.category] || catColor.other}`}>{doc.category?.toUpperCase()}</span>
                        <span className="text-xs text-gray-400">by {doc.uploadedBy}</span>
                      </div>
                    </div>
                  </div>
                  {doc.fileUrl && (
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer"
                       className="flex-shrink-0 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100">
                      View
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* DSC Tab */}
      {tab === "dsc" && (
        <div className="space-y-3">
          {dscs.length === 0 && <div className="text-center py-16 text-gray-400"><Shield className="w-10 h-10 mx-auto mb-3 text-gray-300" /><p>No DSC records for this client</p></div>}
          {dscs.map(d => {
            const days = Math.ceil((new Date(d.expiryDate).getTime() - Date.now()) / 86400000);
            const isExpired = days < 0;
            const isNear = days >= 0 && days <= 30;
            return (
              <Card key={d.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{d.holderName}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded font-medium">{d.dscClass}</span>
                        <span className="text-xs text-gray-500">{d.issuer}</span>
                        {d.serialNo && <span className="text-xs text-gray-400">S/N: {d.serialNo}</span>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-800">Expires {new Date(d.expiryDate).toLocaleDateString("en-IN")}</p>
                      <p className={`text-sm font-bold mt-0.5 ${isExpired ? "text-red-500" : isNear ? "text-orange-500" : "text-green-600"}`}>
                        {isExpired ? `Expired ${Math.abs(days)}d ago` : isNear ? `${days} days left` : "Valid"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
