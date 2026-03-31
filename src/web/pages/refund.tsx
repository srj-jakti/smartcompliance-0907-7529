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

export default function Refund() {
  return (
    <LegalLayout
      title="Refund & Cancellation Policy"
      subtitle="Last updated: March 31, 2025 · Applies to all paid subscriptions."
    >
      <section className="space-y-8 text-gray-700 text-[15px] leading-relaxed">

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <p className="text-blue-800 font-medium text-sm">
            <strong>Summary:</strong> Monthly plans can be cancelled anytime (no refund for current period).
            Annual plans are eligible for a prorated refund within 30 days. We offer a 14-day free trial — no charge until the trial ends.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Free Trial</h2>
          <p>
            Smart Compliance Tracker offers a <strong>14-day free trial</strong> on all plans. No credit card is required
            to start the trial. You will not be charged until the trial period ends and you choose to subscribe.
            You may cancel at any point during the trial without any charge.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Monthly Subscriptions</h2>
          <p className="mb-3">
            Monthly subscriptions are billed at the beginning of each billing cycle. You may cancel your subscription at
            any time from the Account Settings page.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Cancellations take effect at the end of the current billing period</li>
            <li>You retain full access until the end of the paid period</li>
            <li><strong>No refunds are issued</strong> for the current billing month after payment is processed</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Annual Subscriptions</h2>
          <p className="mb-3">
            Annual subscriptions offer a discounted rate and are billed upfront for 12 months.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Within 30 days of payment:</strong> Eligible for a prorated refund based on unused months.
              A ₹999 processing fee applies.
            </li>
            <li>
              <strong>After 30 days:</strong> No refund is available. You may cancel to stop auto-renewal at the end of
              the annual period.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Exceptional Circumstances</h2>
          <p className="mb-3">
            We evaluate refund requests on a case-by-case basis for:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Extended outages (&gt;72 hours) caused by our infrastructure failures</li>
            <li>Accidental duplicate charges</li>
            <li>Death or serious illness of the account holder (with supporting documentation)</li>
            <li>Billing errors on our part</li>
          </ul>
          <p className="mt-3">
            Email <strong>billing@smartcompliancetracker.in</strong> with your request and relevant documentation.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. How Refunds Are Processed</h2>
          <p>
            Approved refunds are processed to the original payment method within <strong>7–10 business days</strong>.
            For UPI/bank transfers, processing may take up to 15 business days depending on your bank.
            You will receive an email confirmation once the refund is initiated.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Plan Downgrades</h2>
          <p>
            Downgrading to a lower plan takes effect at the next billing cycle. No partial refund is issued for the
            price difference in the current cycle. If you upgrade, the difference is prorated and charged immediately.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Contact for Billing</h2>
          <p>
            Email: <strong>billing@smartcompliancetracker.in</strong><br />
            Response time: Within 1 business day (Mon–Fri, 10 AM – 6 PM IST)<br />
            Or use our <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link>
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}
