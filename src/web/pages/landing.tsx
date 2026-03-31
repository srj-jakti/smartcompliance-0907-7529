import { useState } from "react";
import { Link } from "wouter";
import {
  CheckSquare, Users, FileText, Shield, Bot, Calendar, Bell, BarChart3,
  ArrowRight, Star, Check, ChevronDown, MessageSquare, Zap, Clock,
  TrendingUp, Lock, Phone, Mail, MapPin, Menu, X,
  IndianRupee, Award, Building2, ChevronRight, Play,
  Layers, GitBranch, Globe, Sparkles
} from "lucide-react";
import { toast } from "sonner";

const APP_NAME = "Smart Compliance Tracker";

const features = [
  { icon: CheckSquare, title: "Task & Workflow Management", desc: "Auto-create recurring tasks for GSTR, ITR, TDS. Assign to staff, set priorities, and track progress in real-time with sub-task support.", color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
  { icon: Calendar, title: "Compliance Calendar", desc: "Never miss a deadline. GST, ITR, TDS, ROC dates pre-loaded with intelligent alerts 15 days in advance.", color: "bg-violet-50 text-violet-600", border: "border-violet-100" },
  { icon: Users, title: "Client Management", desc: "Complete client database with PAN, GSTIN, documents, and a dedicated client login portal.", color: "bg-cyan-50 text-cyan-600", border: "border-cyan-100" },
  { icon: FileText, title: "GST Billing & Invoicing", desc: "Professional PDF invoices with multi-entity support. Auto payment reminders via WhatsApp & SMS.", color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100" },
  { icon: Bot, title: "AI Tax Assistant", desc: "AI-powered answers on GST rules, ITR sections, TDS rates — with live context from your firm data.", color: "bg-purple-50 text-purple-600", border: "border-purple-100" },
  { icon: Shield, title: "DSC Management", desc: "Track expiry dates, token numbers, and issuers. Get reminders 30 days before any client DSC expires.", color: "bg-green-50 text-green-600", border: "border-green-100" },
  { icon: MessageSquare, title: "WhatsApp & Telegram", desc: "Send bulk reminders, invoices, and task updates directly via WhatsApp Business API and Telegram bot.", color: "bg-teal-50 text-teal-600", border: "border-teal-100" },
  { icon: BarChart3, title: "Practice Analytics", desc: "Revenue reports, task completion rates, client analytics, and outstanding payment tracking — all unified.", color: "bg-orange-50 text-orange-600", border: "border-orange-100" },
  { icon: Lock, title: "Role-Based Access", desc: "CA owner, employee, and client portals — each with precisely scoped permissions and data isolation.", color: "bg-rose-50 text-rose-600", border: "border-rose-100" },
];

const testimonials = [
  { name: "CA Rajesh Sharma", firm: "Sharma & Associates, New Delhi", text: "Smart Compliance Tracker transformed how we run our practice. We went from 4 Excel sheets to one clean dashboard. The AI assistant alone saves us hours every week.", rating: 5, initials: "RS" },
  { name: "CA Priya Mehta", firm: "PM Tax Consultants, Mumbai", text: "The WhatsApp integration is a game-changer. Clients get automated reminders and invoices without anyone manually following up. Our collection rate improved by 40%.", rating: 5, initials: "PM" },
  { name: "CA Vivek Agrawal", firm: "Agrawal & Co, Pune", text: "The compliance calendar and DSC tracker are exactly what we needed. During ITR season, we managed 180+ clients without chaos for the first time ever.", rating: 5, initials: "VA" },
  { name: "CA Suresh Gupta", firm: "Gupta Tax Services, Ahmedabad", text: "The client portal is outstanding. Our clients love being able to track their filings and download documents themselves. Reduces our support calls by half.", rating: 5, initials: "SG" },
  { name: "CA Anjali Singh", firm: "Singh & Partners, Bengaluru", text: "Migrated from three different software to Smart Compliance Tracker. The billing module with PDF invoices and GST calculation is exactly right for Indian CA firms.", rating: 5, initials: "AS" },
  { name: "CA Mohammed Rafi", firm: "Rafi Associates, Hyderabad", text: "The employee portal keeps my staff accountable without micromanaging. Task assignments, time tracking, leave management — all handled professionally.", rating: 5, initials: "MR" },
];

const faqs = [
  { q: "Is Smart Compliance Tracker built specifically for Indian CA firms?", a: "Yes, 100%. We are built exclusively for India — pre-loaded with GST, ITR, TDS, ROC compliance calendars, Indian ₹ billing with 18% GST calculation, and WhatsApp/Telegram integration for the Indian market." },
  { q: "How does the AI Tax Assistant work?", a: "Our AI works with live context from your firm data — overdue tasks, unpaid invoices, expiring DSCs. It answers GST, ITR, TDS, and Companies Act queries instantly, available 24/7." },
  { q: "Can multiple users access the platform?", a: "Yes. You get three separate portals — CA / Owner dashboard, Employee portal (staff see only their assigned work), and Client portal (clients see only their own data). Full data isolation." },
  { q: "Is my data secure?", a: "We use Cloudflare's global edge network, encrypted D1 database, R2 object storage, and role-based access control. All data is isolated per firm — no firm can see another's data." },
  { q: "Can I import existing client data?", a: "Yes, import clients in bulk via Excel/CSV. PAN, GSTIN, contact details, and previous tasks can all be migrated. Our team assists with onboarding." },
  { q: "What happens after the 14-day trial?", a: "Choose an annual plan or your data is safely exported. Payment is annual — no auto-renewal surprises. No credit card required for the trial." },
];

// Per-client annual pricing — CA pays based on how many clients they manage
// Rate: ₹X per client per year, billed annually
const plans = [
  {
    name: "Starter",
    clientLimit: 25,
    ratePerClient: 499,        // ₹499 per client per year
    annualTotal: 25 * 499,     // ₹12,475/year
    desc: "Solo CAs & small practices",
    features: [
      "Up to 25 clients",
      "3 staff accounts",
      "All core modules",
      "Compliance calendar",
      "Client portal",
      "GST Billing & invoicing",
      "WhatsApp integration",
      "Email support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Growth",
    clientLimit: 50,
    ratePerClient: 449,        // ₹449 per client per year
    annualTotal: 50 * 449,     // ₹22,450/year
    desc: "Growing CA firms",
    features: [
      "Up to 50 clients",
      "10 staff accounts",
      "Everything in Starter",
      "AI Tax Assistant",
      "DSC management",
      "Advanced analytics",
      "Bulk WhatsApp & Telegram",
      "Priority support",
    ],
    cta: "Get Started",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Pro",
    clientLimit: 100,
    ratePerClient: 399,        // ₹399 per client per year
    annualTotal: 100 * 399,    // ₹39,900/year
    desc: "Established firms & networks",
    features: [
      "Up to 100 clients",
      "Unlimited staff accounts",
      "Everything in Growth",
      "Custom AI key (BYO)",
      "Multi-branch support",
      "Dedicated onboarding",
      "SLA guarantee",
      "API access",
    ],
    cta: "Get Started",
    highlighted: false,
  },
];

export default function Landing() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", firmName: "" });
  const [submitting, setSubmitting] = useState(false);


  const handleDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      toast.success("Demo request received. We'll reach out within 4 hours.");
      setForm({ name: "", email: "", phone: "", firmName: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ─── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
              <Zap className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-gray-900 text-[15px] tracking-tight">
              Smart<span className="text-blue-600"> Compliance Tracker</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            {[["#features", "Features"], ["#pricing", "Pricing"], ["#testimonials", "Customers"], ["#faq", "FAQ"]].map(([href, label]) => (
              <a key={href} href={href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">{label}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors">
              Sign In
            </Link>
            <Link href="/login" className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition-all bg-blue-600 hover:bg-blue-700 shadow-sm">
              Get Started Free
            </Link>
          </div>

          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenu && (
          <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-1">
            {[["#features", "Features"], ["#pricing", "Pricing"], ["#testimonials", "Customers"], ["#faq", "FAQ"]].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMobileMenu(false)} className="block text-sm text-gray-700 py-2.5 font-medium border-b border-gray-50 last:border-0">{label}</a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" className="block text-center text-sm font-medium text-gray-700 border border-gray-200 py-2.5 rounded-lg">Sign In</Link>
              <Link href="/login" className="block text-center text-sm font-semibold text-white bg-blue-600 py-2.5 rounded-lg">Get Started Free</Link>
            </div>
          </div>
        )}
      </nav>


      {/* ─── HERO ───────────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-0 overflow-hidden relative" style={{ background: "linear-gradient(160deg, #0a0f1e 0%, #0f1f3d 50%, #0d2860 100%)" }}>

        {/* ── Animated CA background ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">

          {/* Grid lines — ledger paper feel */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="ledger" width="60" height="40" patternUnits="userSpaceOnUse">
                <line x1="0" y1="40" x2="60" y2="40" stroke="#60a5fa" strokeWidth="0.5"/>
                <line x1="0" y1="0" x2="0" y2="40" stroke="#60a5fa" strokeWidth="0.25"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ledger)"/>
          </svg>

          {/* Vertical red margin line like accounting ledger */}
          <div className="absolute left-[8%] top-0 bottom-0 w-px bg-red-500/10" />
          <div className="absolute left-[9%] top-0 bottom-0 w-px bg-red-500/5" />

          {/* Floating accounting numbers */}
          {[
            { text: "₹2,45,800", x: "5%",  y: "18%", delay: "0s",   dur: "18s", size: "text-sm",  opacity: "opacity-[0.07]" },
            { text: "GSTR-3B",   x: "88%", y: "12%", delay: "2s",   dur: "22s", size: "text-xs",  opacity: "opacity-[0.08]" },
            { text: "TDS 194C",  x: "78%", y: "55%", delay: "5s",   dur: "20s", size: "text-xs",  opacity: "opacity-[0.07]" },
            { text: "₹84,200",   x: "92%", y: "35%", delay: "1s",   dur: "16s", size: "text-sm",  opacity: "opacity-[0.06]" },
            { text: "ITR-3",     x: "3%",  y: "60%", delay: "3.5s", dur: "24s", size: "text-xs",  opacity: "opacity-[0.07]" },
            { text: "18% GST",   x: "15%", y: "80%", delay: "7s",   dur: "19s", size: "text-xs",  opacity: "opacity-[0.06]" },
            { text: "PAN: ABCDE1234F", x: "68%", y: "78%", delay: "4s", dur: "21s", size: "text-[10px]", opacity: "opacity-[0.05]" },
            { text: "Balance Sheet", x: "55%", y: "10%", delay: "6s", dur: "17s", size: "text-xs", opacity: "opacity-[0.07]" },
            { text: "Dr  ₹1,20,000", x: "30%", y: "85%", delay: "8s", dur: "23s", size: "text-xs", opacity: "opacity-[0.06]" },
            { text: "Cr  ₹98,500",  x: "42%", y: "90%", delay: "2s", dur: "20s", size: "text-xs", opacity: "opacity-[0.05]" },
            { text: "ROC Filing",   x: "72%", y: "22%", delay: "9s", dur: "18s", size: "text-xs", opacity: "opacity-[0.07]" },
            { text: "26AS",         x: "20%", y: "25%", delay: "1.5s", dur: "25s", size: "text-sm", opacity: "opacity-[0.06]" },
          ].map((n, i) => (
            <div
              key={i}
              className={`absolute font-mono font-semibold text-blue-300 ${n.size} ${n.opacity}`}
              style={{ left: n.x, top: n.y, animation: `floatUp ${n.dur} ${n.delay} ease-in-out infinite alternate` }}
            >
              {n.text}
            </div>
          ))}

          {/* Calculator keys grid — bottom right */}
          <div className="absolute bottom-10 right-8 opacity-[0.06] grid grid-cols-4 gap-2" style={{ animation: "fadeFloat 12s 1s ease-in-out infinite alternate" }}>
            {["7","8","9","÷","4","5","6","×","1","2","3","−","0",".","=","+"].map((k, i) => (
              <div key={i} className="w-8 h-8 rounded border border-blue-400/60 flex items-center justify-center text-blue-300 text-xs font-mono font-bold bg-blue-900/30">
                {k}
              </div>
            ))}
          </div>

          {/* Mini ledger book — left side */}
          <div className="absolute top-24 left-6 opacity-[0.06]" style={{ animation: "fadeFloat 15s 3s ease-in-out infinite alternate" }}>
            <div className="border border-blue-400/50 rounded-lg p-3 w-36 bg-blue-900/20">
              <div className="h-1.5 bg-blue-400/50 rounded mb-2 w-full" />
              {[80, 60, 90, 50, 70].map((w, i) => (
                <div key={i} className="flex gap-2 mb-1.5 items-center">
                  <div className="h-1 bg-blue-300/40 rounded" style={{ width: `${w}%` }} />
                  <div className="h-1 bg-emerald-400/40 rounded w-6 ml-auto flex-shrink-0" />
                </div>
              ))}
              <div className="mt-2 border-t border-blue-400/30 pt-1 flex justify-between">
                <div className="h-1.5 bg-blue-400/60 rounded w-12" />
                <div className="h-1.5 bg-emerald-400/60 rounded w-8" />
              </div>
            </div>
          </div>

          {/* Ticking counter — revenue feel */}
          <div className="absolute top-32 right-[12%] opacity-[0.07]" style={{ animation: "fadeFloat 10s 0s ease-in-out infinite alternate" }}>
            <div className="font-mono text-emerald-400 text-2xl font-bold tracking-wider">
              ₹ 24,67,890
            </div>
            <div className="text-emerald-500/60 text-[10px] font-mono mt-0.5 tracking-widest">TOTAL REVENUE YTD</div>
          </div>

          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/8 blur-3xl" />
        </div>

        {/* ── CSS keyframes injected inline ── */}
        <style>{`
          @keyframes floatUp {
            0%   { transform: translateY(0px) translateX(0px); opacity: 0.5; }
            50%  { opacity: 1; }
            100% { transform: translateY(-28px) translateX(8px); opacity: 0.5; }
          }
          @keyframes fadeFloat {
            0%   { transform: translateY(0px); opacity: 0.5; }
            100% { transform: translateY(-14px); opacity: 1; }
          }
        `}</style>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Badge */}
          <div className="flex justify-center pt-12 mb-8">
            <div className="inline-flex items-center gap-2 border border-blue-400/30 bg-blue-500/10 rounded-full px-4 py-1.5 text-blue-300 text-xs font-semibold tracking-widest uppercase">
              <Award className="w-3.5 h-3.5 text-yellow-400" />
              Trusted by CA & Accounting Firms Across India
            </div>
          </div>

          {/* Headline */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-[3.25rem] md:text-[4.25rem] font-bold text-white leading-[1.08] tracking-tight mb-5">
              Stop Managing Chaos.<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)" }}>
                Start Running Your Practice.
              </span>
            </h1>
            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              The all-in-one platform for CA firms — handle clients, tasks, GST/ITR compliance, billing, and your entire team without juggling 5 different tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link href="/login" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[15px] text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)" }}>
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#demo" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[15px] text-slate-200 border border-slate-600 bg-white/5 hover:bg-white/10 transition-all">
                <Play className="w-4 h-4" /> Book a Demo
              </a>
            </div>
            <p className="text-slate-500 text-sm">No credit card required · 14-day free trial · Cancel anytime</p>
          </div>

          {/* Dashboard preview */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 blur-xl" />
            <div className="relative border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50" style={{ background: "#0f172a" }}>
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.03]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white/5 rounded-md px-4 py-1 text-slate-500 text-xs flex items-center gap-2 w-72">
                    <Lock className="w-3 h-3 text-green-500" /> app.smartcompliancetracker.in
                  </div>
                </div>
              </div>
              {/* Dashboard grid */}
              <div className="p-5">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Active Clients", value: "247", delta: "+12", color: "text-blue-400", bg: "bg-blue-500/10", dot: "bg-blue-500" },
                    { label: "Pending Tasks", value: "38", delta: "Due this week", color: "text-amber-400", bg: "bg-amber-500/10", dot: "bg-amber-500" },
                    { label: "Revenue MTD", value: "₹2.4L", delta: "+18%", color: "text-emerald-400", bg: "bg-emerald-500/10", dot: "bg-emerald-500" },
                    { label: "Compliance", value: "7", delta: "Deadlines soon", color: "text-purple-400", bg: "bg-purple-500/10", dot: "bg-purple-500" },
                  ].map((s, i) => (
                    <div key={i} className={`${s.bg} rounded-xl p-3.5 border border-white/5`}>
                      <div className={`w-2 h-2 rounded-full ${s.dot} mb-2.5`} />
                      <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
                      <p className="text-slate-600 text-xs mt-1">{s.delta}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "GSTR-3B", date: "Aug 20", days: "12 days", color: "border-blue-700/50 bg-blue-950/40", badge: "text-blue-400" },
                    { label: "TDS Deposit", date: "Aug 7", days: "Overdue", color: "border-red-700/40 bg-red-950/30", badge: "text-red-400" },
                    { label: "Advance Tax", date: "Sep 15", days: "38 days", color: "border-emerald-700/30 bg-emerald-950/20", badge: "text-emerald-400" },
                  ].map((item, i) => (
                    <div key={i} className={`rounded-xl p-3.5 border ${item.color}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm font-semibold">{item.label}</span>
                        <span className={`text-xs ${item.badge} font-medium`}>{item.days}</span>
                      </div>
                      <p className="text-slate-500 text-xs">{item.date}, 2025</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ─── TRUST BAR ──────────────────────────────────────────────────────── */}
      <section className="bg-gray-900 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "2,000+", label: "CA Firms Trust Us" },
              { value: "4.8 / 5", label: "Average Rating" },
              { value: "15 Lakh+", label: "Tax Files Managed" },
              { value: "99.9%", label: "Uptime SLA" },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ───────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-3">Everything You Need</p>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Built for Smarter CA Practice</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">One platform that replaces 4–5 disconnected tools your firm currently uses.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className={`border ${f.border} rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white`}>
                  <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-[15px] mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: "linear-gradient(160deg, #f8fafc 0%, #eff6ff 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Up and running in minutes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[22%] right-[22%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200" />
            {[
              { step: "01", title: "Set Up Your Firm", desc: "Add your firm details, invite employees, and import existing client data in minutes.", icon: Building2 },
              { step: "02", title: "Add Clients & Tasks", desc: "Create clients, assign compliance tasks, and let the calendar auto-populate deadlines.", icon: CheckSquare },
              { step: "03", title: "Track & Automate", desc: "Get alerts, send WhatsApp reminders, generate invoices, and use AI for instant answers.", icon: Sparkles },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="text-center relative">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-200 relative z-10">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-blue-600 font-bold text-xs tracking-widest mb-2">STEP {s.step}</p>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── AI HIGHLIGHT ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-full px-3 py-1.5 text-purple-600 text-xs font-semibold mb-5">
                <Sparkles className="w-3.5 h-3.5" /> Powered by AI
              </div>
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-5 leading-tight">
                An AI assistant that knows<br />Indian tax law
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Ask anything — GST rates, ITR sections, TDS deadlines, penalty calculations. The AI has live context from your firm's own data: overdue tasks, unpaid invoices, expiring DSCs.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Instant answers on GST, ITR, TDS, Companies Act",
                  "Aware of your firm's live data — not just generic answers",
                  "Conversation history for context-aware follow-ups",
                  "Per-firm custom OpenAI key support",
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-purple-600" />
                    </div>
                    <span className="text-gray-700 text-sm">{t}</span>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/ai" className="inline-flex items-center gap-2 text-purple-600 font-semibold text-sm hover:gap-3 transition-all">
                Try AI Assistant <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {/* AI Chat mockup */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">AI Tax Assistant</p>
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" /><span className="text-xs text-green-600">Online</span></div>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex gap-3">
                  <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-white" /></div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-700 shadow-sm border border-gray-100 max-w-xs">
                    Namaste! I'm your AI compliance assistant. Ask me anything about GST, ITR, TDS, or your firm's current status.
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">CA</div>
                  <div className="bg-blue-600 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white max-w-xs">
                    What's the penalty for late GSTR-3B filing?
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-white" /></div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-700 shadow-sm border border-gray-100 max-w-xs">
                    Late GSTR-3B filing attracts <strong>₹50/day</strong> (₹25 CGST + ₹25 SGST) up to a max of <strong>₹5,000</strong>. For nil returns, it's ₹20/day max ₹500. Plus 18% interest on tax due.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3 PORTALS ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: "linear-gradient(160deg, #f8fafc 0%, #eff6ff 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-3">One Platform, Three Portals</p>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">The right view for every role</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Data isolation built-in — each user sees only what they should.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "CA / Owner Portal",
                sub: "Full practice control",
                color: "from-blue-600 to-blue-700",
                light: "bg-blue-50 border-blue-100",
                icon: Building2,
                items: ["Client & task management", "Billing & invoicing", "Team management", "AI assistant", "Reports & analytics", "Settings & integrations"],
              },
              {
                title: "Employee Portal",
                sub: "My assigned work",
                color: "from-violet-600 to-purple-700",
                light: "bg-violet-50 border-violet-100",
                icon: Users,
                items: ["My tasks & deadlines", "Assigned clients", "Attendance & leave", "Time tracking", "Team messages", "My performance reports"],
              },
              {
                title: "Client Portal",
                sub: "My filings & invoices",
                color: "from-emerald-600 to-teal-700",
                light: "bg-emerald-50 border-emerald-100",
                icon: FileText,
                items: ["Filing status tracker", "Document vault", "Compliance deadlines", "Invoice payment", "Secure messaging", "Support tickets"],
              },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className={`border ${p.light} rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200`}>
                  <div className={`bg-gradient-to-br ${p.color} p-6`}>
                    <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg">{p.title}</h3>
                    <p className="text-white/70 text-sm mt-1">{p.sub}</p>
                  </div>
                  <div className="p-5 bg-white">
                    <ul className="space-y-2.5">
                      {p.items.map((item, j) => (
                        <li key={j} className="flex items-center gap-2.5 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/login" className={`mt-5 w-full block text-center py-2.5 rounded-xl text-sm font-semibold text-white transition-colors bg-gradient-to-r ${p.color}`}>
                      Access Portal →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ───────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Trusted by 2,000+ CA Firms</h2>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
              <span className="text-gray-500 text-sm ml-2">4.8/5 average from 200+ reviews</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-6 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">{t.initials}</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.firm}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6" style={{ background: "linear-gradient(160deg, #f8fafc 0%, #eff6ff 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Pay only for what you use</h2>
            <p className="text-gray-500 text-lg mb-2">Per-client annual pricing — the more clients, the lower the rate.</p>
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mt-2">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 text-sm font-medium">Annual billing only · One-time yearly payment</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5 items-start">
            {plans.map((p, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden border transition-all duration-200 ${p.highlighted ? "border-blue-500 shadow-xl shadow-blue-100 scale-[1.02]" : "border-gray-200 bg-white hover:shadow-md"}`}>
                {p.highlighted && (
                  <div className="bg-blue-600 text-white text-xs font-semibold text-center py-2 tracking-wide uppercase">{p.badge}</div>
                )}
                <div className="bg-white p-7">
                  <h3 className="font-bold text-gray-900 text-xl mb-1">{p.name}</h3>
                  <p className="text-gray-400 text-sm mb-5">{p.desc}</p>

                  {/* Annual total */}
                  <div className="mb-1">
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold text-gray-900">₹{p.annualTotal.toLocaleString("en-IN")}</span>
                      <span className="text-gray-400 text-sm mb-1">/year</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">
                      <span className="text-blue-600 font-semibold">₹{p.ratePerClient}</span> × {p.clientLimit} clients · billed annually
                    </p>
                  </div>

                  {/* Per-client rate badge */}
                  <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5 mt-4 mb-6">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-blue-700 text-xs font-semibold">Up to {p.clientLimit} clients · ₹{p.ratePerClient}/client/yr</span>
                  </div>

                  <ul className="space-y-3 mb-7">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/login" className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all ${p.highlighted ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                    {p.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing note */}
          <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-6 max-w-2xl mx-auto text-center">
            <p className="text-gray-700 text-sm font-medium mb-1">Need more than 100 clients?</p>
            <p className="text-gray-500 text-sm">Contact us for a custom enterprise quote tailored to your firm size.</p>
            <a href="#demo" className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm mt-3 hover:underline">
              Talk to us <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-center text-gray-400 text-sm mt-6">All plans include 14-day free trial. No credit card required.</p>
        </div>
      </section>

      {/* ─── FAQ ────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Questions? Answered.</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button className="w-full flex items-center justify-between py-5 text-left group" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-gray-800 text-[15px] pr-4 group-hover:text-blue-600 transition-colors">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180 text-blue-600" : ""}`} />
                </button>
                {openFaq === i && <div className="pb-5 text-gray-500 text-sm leading-relaxed">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEMO FORM ──────────────────────────────────────────────────────── */}
      <section id="demo" className="py-24 px-6" style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e3a5f 60%, #1e40af 100%)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white tracking-tight mb-4">See it live in 20 minutes</h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">Our team will walk you through a personalised demo tailored to your firm's size and needs.</p>
              <div className="space-y-4">
                {[
                  { icon: Check, text: "Full product walkthrough — no sales pressure" },
                  { icon: Check, text: "See your specific compliance calendar pre-loaded" },
                  { icon: Check, text: "Free onboarding & data import assistance" },
                  { icon: Check, text: "Questions answered by a CA, not just sales" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-blue-500/20 border border-blue-400/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3 h-3 text-blue-400" />
                      </div>
                      <span className="text-slate-300 text-sm">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <form onSubmit={handleDemo} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-7 space-y-4">
              <h3 className="text-white font-bold text-lg mb-1">Book a Free Demo</h3>
              <p className="text-slate-400 text-sm mb-4">We'll respond within 4 business hours.</p>
              {[
                { key: "name", label: "Full Name", placeholder: "CA Rajesh Sharma", type: "text" },
                { key: "email", label: "Work Email", placeholder: "ca@yourfirm.in", type: "email" },
                { key: "phone", label: "Phone / WhatsApp", placeholder: "+91 98765 43210", type: "tel" },
                { key: "firmName", label: "Firm Name", placeholder: "Sharma & Associates", type: "text" },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-slate-300 text-xs font-medium mb-1.5 block">{field.label}</label>
                  <input
                    required={field.key !== "firmName"}
                    type={field.type}
                    value={(form as any)[field.key]}
                    onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>
              ))}
              <button type="submit" disabled={submitting}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm mt-2 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)" }}>
                {submitting ? "Booking..." : <><span>Request Demo</span> <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-white text-[15px]">Smart Compliance Tracker</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                All-in-one practice management software for Chartered Accountants and accounting firms across India.
              </p>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-gray-600 text-xs">Made in India</span>
                <span className="text-lg">🇮🇳</span>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-gray-300 font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-2.5">
                {[["#features", "Features"], ["#pricing", "Pricing"], ["/login", "Dashboard"], ["#demo", "Book Demo"]].map(([h, l]) => (
                  <li key={h}><a href={h} className="text-gray-500 text-sm hover:text-gray-200 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-gray-300 font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2.5">
                {[["/about", "About Us"], ["/contact", "Contact"], ["/privacy", "Privacy Policy"], ["/terms", "Terms of Use"], ["/refund", "Refund Policy"]].map(([h, l]) => (
                  <li key={h}><Link href={h} className="text-gray-500 text-sm hover:text-gray-200 transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-gray-300 font-semibold text-sm mb-4">Contact</h4>
              <div className="space-y-3">
                <a href="tel:+919024570899" className="flex items-center gap-2 text-gray-500 text-sm hover:text-gray-200 transition-colors">
                  <Phone className="w-4 h-4 text-blue-500" /> +91 90245 70899
                </a>
                <a href="mailto:hello@smartcompliancetracker.in" className="flex items-center gap-2 text-gray-500 text-sm hover:text-gray-200 transition-colors">
                  <Mail className="w-4 h-4 text-blue-500" /> hello@smartcompliancetracker.in
                </a>
                <div className="flex items-start gap-2 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" /> Bengaluru, India — 560001
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Smart Compliance Tracker. All rights reserved.</p>
            <div className="flex items-center gap-6">
              {[["/privacy", "Privacy"], ["/terms", "Terms"], ["/refund", "Refund Policy"]].map(([h, l]) => (
                <Link key={h} href={h} className="text-gray-600 text-sm hover:text-gray-300 transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
