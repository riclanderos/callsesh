export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-3xl space-y-10">

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-zinc-100">Privacy Policy</h1>
          <p className="text-sm text-zinc-500">Last updated: March 24, 2026</p>
        </div>

        <Section title="1. Who We Are">
          <P>
            CallSesh is operated by Landeros Systems. We provide a platform that enables coaches,
            consultants, and service providers to accept bookings and host paid sessions online.
            This policy explains what data we collect, how we use it, and your rights.
          </P>
        </Section>

        <Section title="2. Information We Collect">
          <P><Strong>Account information.</Strong> When you create an account, we collect your email address and any profile information you provide (such as your timezone).</P>
          <P><Strong>Booking information.</Strong> When a client books a session, we collect the client&apos;s name, email address, and the session details (date, time, session type).</P>
          <P><Strong>Payment information.</Strong> Payments are processed by Stripe. We do not store your full card number or payment credentials. We store only what Stripe returns to us: a customer ID, subscription ID, and payment status. By using CallSesh, you agree to Stripe&apos;s Privacy Policy.</P>
          <P><Strong>Usage data.</Strong> We collect basic usage information such as pages visited and actions taken within the platform, used to improve the service.</P>
          <P><Strong>Communications.</Strong> If you contact us for support, we retain those communications.</P>
        </Section>

        <Section title="3. How We Use Your Information">
          <P>We use collected data to:</P>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-zinc-400 leading-relaxed">
            <li>Create and manage your account</li>
            <li>Facilitate bookings between coaches and clients</li>
            <li>Process payments and manage subscriptions through Stripe</li>
            <li>Send booking confirmation and notification emails</li>
            <li>Provide access to video sessions</li>
            <li>Improve and maintain the platform</li>
            <li>Respond to support requests</li>
            <li>Comply with legal obligations</li>
          </ul>
          <P>We do not sell your personal data to third parties.</P>
        </Section>

        <Section title="4. Third-Party Services">
          <P>CallSesh relies on the following third-party providers:</P>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-zinc-400 leading-relaxed">
            <li><Strong>Stripe</Strong> — payment processing and subscription billing. Stripe handles all payment data under their own privacy policy and PCI compliance standards.</li>
            <li><Strong>Daily.co</Strong> — video session infrastructure. Session rooms are provisioned and managed by our video provider under their own privacy policy.</li>
            <li><Strong>Supabase</Strong> — database and authentication infrastructure. Data is stored in Supabase-managed infrastructure.</li>
          </ul>
          <P>We are not responsible for the data practices of these third parties. We encourage you to review their respective privacy policies.</P>
        </Section>

        <Section title="5. Data Retention">
          <P>
            We retain your account data for as long as your account is active. If you delete your
            account, we will delete or anonymize your personal data within 30 days, except where
            retention is required by law or for legitimate business purposes (such as financial
            record-keeping).
          </P>
        </Section>

        <Section title="6. Your Rights">
          <P>Depending on your location, you may have the right to:</P>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-zinc-400 leading-relaxed">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict certain processing</li>
          </ul>
          <P>To exercise any of these rights, contact us at <Email />.</P>
        </Section>

        <Section title="7. Cookies">
          <P>
            CallSesh uses cookies and similar technologies for session management and
            authentication. We do not use cookies for advertising or cross-site tracking.
          </P>
        </Section>

        <Section title="8. Security">
          <P>
            We take reasonable technical and organizational measures to protect your data. However,
            no system is perfectly secure. No method of transmission over the Internet or method of
            electronic storage is 100% secure. You are responsible for maintaining the
            confidentiality of your account credentials.
          </P>
        </Section>

        <Section title="9. Changes to This Policy">
          <P>
            We may update this policy from time to time. We will notify registered users of
            material changes by email or by a notice in the platform. Continued use of CallSesh
            after changes take effect constitutes acceptance of the updated policy.
          </P>
        </Section>

        <Section title="10. Contact">
          <P>For privacy-related questions, contact us at <Email />.</P>
        </Section>

      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-200">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-zinc-400 leading-relaxed">{children}</p>
}

function Strong({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-zinc-300">{children}</span>
}

function Email() {
  return (
    <a
      href="mailto:support@landerossystems.com"
      className="text-indigo-400 hover:text-indigo-300 transition-colors"
    >
      support@landerossystems.com
    </a>
  )
}
