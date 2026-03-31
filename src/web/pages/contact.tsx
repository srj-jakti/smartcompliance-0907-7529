import { useState } from "react";
import { Zap, ArrowLeft, Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", firm: "", message: "", type: "demo" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact_page" }),
      });
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you within 1 business day.");
    } catch {
      toast.error("Something went wrong. Email us directly at hello@smartcompliancetracker.in");
    }
    setLoading(false);
  };

  const contactPoints = [
    { icon: Mail, label: "Email", value: "hello@smartcompliancetracker.in", sub: "We reply within 1 business day" },
    { icon: Phone, label: "Phone / WhatsApp", value: "+91 98765 43210", sub: "Mon–Fri, 10 AM – 6 PM IST" },
    { icon: MapPin, label: "Address", value: "Bengaluru, Karnataka", sub: "India" },
    { icon: Clock, label: "Support Hours", value: "Mon–Fri, 10 AM – 6 PM IST", sub: "Critical issues: 24/7 email" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Zap className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-bold text-gray-900 text-base">Smart Compliance Tracker</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="text-gray-500 mt-2">Questions, demos, billing — we're here to help.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-[1fr_1.4fr] gap-12">
        {/* Left */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Get in touch</h2>
          <div className="space-y-5 mb-10">
            {contactPoints.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{c.label}</p>
                    <p className="text-sm font-medium text-gray-900">{c.value}</p>
                    <p className="text-xs text-gray-400">{c.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
            <p className="text-sm font-semibold text-blue-900 mb-1">Want a live demo?</p>
            <p className="text-sm text-blue-700">
              Book a 30-minute walkthrough with our team. We'll show you the platform live and answer
              questions specific to your practice size and workflow.
            </p>
          </div>
        </div>

        {/* Right — Form */}
        <div>
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <CheckCircle className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Message received!</h3>
              <p className="text-gray-500 mb-6">We'll get back to you within 1 business day.</p>
              <button onClick={() => setSubmitted(false)} className="text-sm text-blue-600 hover:underline">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 space-y-4">
              <h3 className="font-semibold text-gray-900 mb-1">Send us a message</h3>
              <p className="text-sm text-gray-400 mb-4">We'll respond within 1 business day.</p>

              {/* Type */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">I'm contacting about</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="demo">Book a Demo</option>
                  <option value="sales">Pricing / Sales</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing / Refund</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Your Name *</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="CA Rajesh Sharma"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="ca@yourfirm.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Firm Name</label>
                <input
                  type="text"
                  value={form.firm}
                  onChange={e => setForm({ ...form, firm: e.target.value })}
                  placeholder="Sharma & Associates"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Message *</label>
                <textarea
                  required
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your practice size, current tools, and what you're looking to solve..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60"
              >
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Send className="w-4 h-4" /><span>Send Message</span></>
                }
              </button>
            </form>
          )}
        </div>
      </div>

      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-400">© 2025 Smart Compliance Tracker. All rights reserved.</span>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-600">Terms</Link>
            <Link href="/refund" className="hover:text-gray-600">Refund</Link>
            <Link href="/contact" className="hover:text-gray-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
