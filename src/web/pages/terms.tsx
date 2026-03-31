import { Zap, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

function LegalLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
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
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 mt-2">{subtitle}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-gray max-w-none">{children}</div>
      </div>
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

export default function Terms() {
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="Last updated: March 31, 2025 · Please read carefully before using the platform."
    >
      <section className="space-y-8 text-gray-700 text-[15px] leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Smart Compliance Tracker ("Platform"), you agree to be bound by these Terms of Service.
            If you are using the platform on behalf of a CA firm or organization, you represent that you have authority to
            bind that entity. These terms constitute a legally binding agreement between you and Smart Compliance Tracker.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
          <p className="mb-3">
            Smart Compliance Tracker is a SaaS platform that provides CA practices with tools for:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Client and compliance task management (GST, ITR, ROC, TDS, etc.)</li>
            <li>Team management, attendance tracking, and leave management</li>
            <li>Document storage, DSC management, and invoice generation</li>
            <li>Multi-role portals for CA owners, employees, and clients</li>
            <li>AI-powered task assignment and compliance suggestions</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Account Responsibilities</h2>
          <p className="mb-3">
            You are responsible for maintaining the confidentiality of your login credentials. The CA account owner is
            responsible for all actions taken by employees and clients added to their firm workspace.
          </p>
          <p>
            You must not share credentials, use the platform for illegal purposes, attempt to reverse engineer the software,
            or violate any applicable laws including the IT Act, 2000.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Subscription & Payment</h2>
          <p className="mb-3">
            Smart Compliance Tracker operates on a subscription model. Subscriptions are billed monthly or annually as
            selected at signup. Prices are inclusive of applicable GST.
          </p>
          <p>
            Non-payment within 7 days of the due date will result in account suspension. Data is retained for 30 days after
            suspension before permanent deletion. See our <Link href="/refund" className="text-blue-600 hover:underline">Refund Policy</Link> for
            cancellation terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Ownership</h2>
          <p>
            You retain full ownership of all data you enter into the platform. We do not claim any rights to your client
            data, compliance records, or documents. You may export your data at any time through the platform's export tools.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Intellectual Property</h2>
          <p>
            Smart Compliance Tracker owns all rights to the platform, including its code, design, trademarks, and features.
            We grant you a non-exclusive, non-transferable license to use the platform during your subscription period.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Service Availability</h2>
          <p className="mb-3">
            We target 99.5% monthly uptime, excluding scheduled maintenance windows (announced 48 hours in advance).
            Planned maintenance is typically performed between 2:00 AM – 4:00 AM IST on Sundays.
          </p>
          <p>
            We are not liable for service interruptions caused by third-party providers (AWS, internet providers) or
            circumstances beyond our reasonable control.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
          <p>
            Our total liability to you for any claims arising from use of the platform is limited to the amount you paid us
            in the 3 months preceding the claim. We are not liable for indirect, incidental, or consequential damages.
            Smart Compliance Tracker is a practice management tool and does not provide legal or tax advice.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Termination</h2>
          <p>
            Either party may terminate the agreement at any time. Upon termination, your access will be revoked and your
            data will be deleted after 30 days. We may immediately terminate accounts for violation of these terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Governing Law</h2>
          <p>
            These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of
            courts in Bengaluru, Karnataka. We encourage resolving disputes through our support team first.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact</h2>
          <p>
            Legal queries: <strong>legal@smartcompliancetracker.in</strong><br />
            General support: <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link>
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}
