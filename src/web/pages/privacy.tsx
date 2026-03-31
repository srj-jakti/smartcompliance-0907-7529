import { Zap, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

function LegalLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
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
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 mt-2">{subtitle}</p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-gray max-w-none">{children}</div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 mt-20">
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

export default function Privacy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="Last updated: March 31, 2025 · Effective immediately"
    >
      <section className="space-y-8 text-gray-700 text-[15px] leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
          <p>
            Smart Compliance Tracker ("we", "us", or "our") is a practice management platform built for Chartered
            Accountants, their employees, and their clients in India. We take your privacy seriously. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
          <p className="mt-3">
            By using Smart Compliance Tracker, you agree to the collection and use of information as described in this policy.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
          <p className="mb-3"><strong>Account Information:</strong> When you register or are added to the platform, we collect your name, email address, phone number, and role (CA, Employee, or Client).</p>
          <p className="mb-3"><strong>Practice Data:</strong> Compliance tasks, GST/ITR filings, client records, invoices, documents, and DSC metadata that you or your firm enters into the platform.</p>
          <p className="mb-3"><strong>Usage Data:</strong> Page views, feature interactions, session duration, and error logs used to improve the product.</p>
          <p><strong>Device Information:</strong> Browser type, IP address, and operating system for security and audit purposes.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide, operate, and maintain the platform</li>
            <li>Send compliance reminders, task notifications, and system alerts</li>
            <li>Generate reports and analytics for your firm</li>
            <li>Improve features based on usage patterns (aggregated, not individual)</li>
            <li>Respond to support tickets and inquiries</li>
            <li>Comply with legal obligations under Indian law</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Isolation & Security</h2>
          <p className="mb-3">
            Each CA firm's data is logically isolated. Employees and clients only access data explicitly shared by their firm.
            No firm can view another firm's data.
          </p>
          <p>
            We use industry-standard encryption (TLS in transit, AES-256 at rest), access controls, and regular security
            audits. Our infrastructure is hosted on AWS Mumbai region (ap-south-1) for data residency within India.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Sharing</h2>
          <p className="mb-3">We do not sell your personal data. We share data only:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>With infrastructure providers (AWS) under strict data processing agreements</li>
            <li>With payment processors for subscription billing</li>
            <li>When required by law or valid court order</li>
            <li>With your explicit consent for specific integrations</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active. After account deletion, we permanently delete all
            personal data within 30 days, except where retention is required by law (e.g., financial records under the
            Companies Act, 2013).
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Your Rights</h2>
          <p className="mb-3">Under the Digital Personal Data Protection Act, 2023 (India), you have the right to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate personal data</li>
            <li>Request deletion of your data (subject to legal requirements)</li>
            <li>Withdraw consent at any time</li>
            <li>Lodge a complaint with the Data Protection Board</li>
          </ul>
          <p className="mt-3">To exercise these rights, email us at <strong>privacy@smartcompliancetracker.in</strong>.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Cookies</h2>
          <p>
            We use essential session cookies for authentication and optional analytics cookies (with consent) to understand
            usage. You can disable non-essential cookies through your browser settings without affecting core functionality.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to This Policy</h2>
          <p>
            We may update this policy periodically. We'll notify you via email or in-app notification at least 15 days
            before significant changes take effect. Continued use after changes constitutes acceptance.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact</h2>
          <p>
            For privacy-related inquiries: <strong>privacy@smartcompliancetracker.in</strong><br />
            Data Protection Officer: Available on request
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}
