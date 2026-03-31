import { useState, useEffect } from "react";
import { Save, Bell, MessageSquare, Shield, Building2, User, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";

export default function Settings() {
  const [firmName, setFirmName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gstin, setGstin] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, whatsapp: true, telegram: false, sms: true });
  const [alerts, setAlerts] = useState({ compliance15days: true, dscExpiry30days: true, overdueTask: true, invoiceDue: true });

  const firmId = getUser()?.firmId || "";

  useEffect(() => {
    if (!firmId) { setLoading(false); return; }
    fetch(`/api/firms/${firmId}`)
      .then(r => r.json())
      .then((firm: any) => {
        if (firm) {
          setFirmName(firm.name || "");
          setEmail(firm.email || "");
          setPhone(firm.phone || "");
          setGstin(firm.gstin || "");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [firmId]);

  const save = async () => {
    if (!firmId) { toast.error("No firm ID found"); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/firms/${firmId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: firmName, email, phone, gstin }),
      });
      if (res.ok) toast.success("Settings saved successfully!");
      else toast.error("Failed to save settings");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm">Configure your practice preferences</p>
        </div>
        <button onClick={save} disabled={saving} className="btn-blue flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Firm Profile */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" /> Firm Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Firm Name</label>
              <input value={firmName} onChange={e => setFirmName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
              <input value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Firm GSTIN</label>
              <input value={gstin} onChange={e => setGstin(e.target.value.toUpperCase())} placeholder="27XXXXX..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" /> Notification Channels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "email", label: "Email Notifications", sub: "Send alerts via email" },
              { key: "whatsapp", label: "WhatsApp Messages", sub: "WhatsApp Business API" },
              { key: "telegram", label: "Telegram Bot", sub: "Telegram notifications" },
              { key: "sms", label: "SMS Alerts", sub: "DLT registered SMS" },
            ].map(n => (
              <div key={n.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{n.label}</p>
                  <p className="text-xs text-gray-400">{n.sub}</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))}
                  className={`w-11 h-6 rounded-full transition-all relative ${(notifications as any)[n.key] ? "bg-blue-600" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${(notifications as any)[n.key] ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alert Settings */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" /> Smart Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "compliance15days", label: "Compliance Due in 15 Days", sub: "Alert before deadlines" },
              { key: "dscExpiry30days", label: "DSC Expiry in 30 Days", sub: "DSC renewal reminders" },
              { key: "overdueTask", label: "Overdue Task Alerts", sub: "Tasks past due date" },
              { key: "invoiceDue", label: "Invoice Payment Due", sub: "Payment reminder alerts" },
            ].map(a => (
              <div key={a.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{a.label}</p>
                  <p className="text-xs text-gray-400">{a.sub}</p>
                </div>
                <button
                  onClick={() => setAlerts(prev => ({ ...prev, [a.key]: !prev[a.key as keyof typeof prev] }))}
                  className={`w-11 h-6 rounded-full transition-all relative ${(alerts as any)[a.key] ? "bg-blue-600" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${(alerts as any)[a.key] ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* WhatsApp/Telegram Config */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" /> Integration Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">WhatsApp API Token</label>
              <input type="password" placeholder="Enter WhatsApp Business API token"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">WhatsApp Phone Number ID</label>
              <input placeholder="e.g., 1234567890"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Telegram Bot Token</label>
              <input type="password" placeholder="Enter Telegram bot token"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">SMS API Key (MSG91/TextLocal)</label>
              <input type="password" placeholder="Enter SMS API key"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
              💡 Tip: Use WhatsApp Business API for automated client reminders. 1000 free SMS credits included.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
