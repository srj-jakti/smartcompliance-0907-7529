import { Zap, ArrowLeft, Users, Target, Shield, TrendingUp, Building2, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Built for Indian CA Practices",
      desc: "Every feature is designed around India's compliance calendar — GST, ITR, ROC, TDS, audit cycles. We don't force a generic tool onto your workflow.",
    },
    {
      icon: Shield,
      title: "Data Privacy First",
      desc: "Your client data never mixes with another firm's. Full logical isolation, encrypted storage, India-hosted on AWS Mumbai.",
    },
    {
      icon: TrendingUp,
      title: "Automate the Repetitive",
      desc: "AI-powered task assignment, auto-generated compliance checklists, smart deadline tracking. Less admin, more actual work.",
    },
    {
      icon: Users,
      title: "Three Portals, One Platform",
      desc: "CA owners, employees, and clients each get their own tailored portal — not a one-size-fits-all dashboard.",
    },
  ];

  const stats = [
    { value: "500+", label: "CA Firms" },
    { value: "15,000+", label: "Clients Managed" },
    { value: "99.5%", label: "Uptime SLA" },
    { value: "2019", label: "Founded" },
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

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)" }} className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm text-blue-200 mb-6">
            <Building2 className="w-4 h-4" />
            Our Story
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Built by CA professionals,<br />for CA professionals.
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            We've worked inside CA firms and seen first-hand how much time gets lost to spreadsheets, WhatsApp
            reminders, and disconnected tools. Smart Compliance Tracker is our answer to that.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-blue-600 mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              India has over 300,000 practicing Chartered Accountants. Most of them manage complex compliance workflows
              for dozens of clients — using a mix of Excel, WhatsApp groups, and fragmented software.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We built Smart Compliance Tracker to replace that chaos with a single, purpose-built platform that
              handles the full lifecycle of CA practice management — from client onboarding to task assignment,
              deadline tracking, invoicing, and client communication.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our goal: give every CA firm — from solo practitioners to 50+ person teams — the tools to run a
              tight, profitable, and transparent practice.
            </p>
          </div>
          <div className="space-y-4">
            {[
              "No more missed GST deadlines",
              "Client documents in one secure place",
              "Team attendance & task tracking built-in",
              "AI-powered compliance suggestions",
              "Client portal for transparent communication",
              "DSC tracker with expiry alerts",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">What We Stand For</h2>
          <p className="text-gray-500 text-center mb-10">Principles that guide every product decision we make.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to streamline your practice?</h2>
        <p className="text-gray-500 mb-6">14-day free trial. No credit card needed.</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/login" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors">
            Start Free Trial
          </Link>
          <Link href="/contact" className="px-6 py-3 border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-semibold text-sm transition-colors">
            Contact Sales
          </Link>
        </div>
      </div>

      {/* Footer */}
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
