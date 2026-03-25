export default function TermsPage() {
  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-3xl space-y-10">

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-zinc-100">Terms of Service</h1>
          <p className="text-sm text-zinc-500">Last updated: March 24, 2026</p>
        </div>

        <Section title="1. Acceptance of Terms">
          <P>
            By creating an account or using CallSesh, you agree to these Terms of Service
            (&ldquo;Terms&rdquo;). If you do not agree, do not use the platform. These Terms apply
            to all users, including coaches, consultants, service providers (&ldquo;Coaches&rdquo;),
            and their clients (&ldquo;Clients&rdquo;).
          </P>
        </Section>

        <Section title="2. What CallSesh Is">
          <P>
            CallSesh provides technology that allows Coaches to create booking pages, accept
            payments, and host video sessions. CallSesh is a platform — we do not provide coaching,
            consulting, or any professional services ourselves. Coaches are solely responsible for
            the services they offer and deliver through the platform.
          </P>
        </Section>

        <Section title="3. Accounts and Eligibility">
          <ul className="list-disc list-inside space-y-1.5 text-sm text-zinc-400 leading-relaxed">
            <li>You must be at least 18 years old to create an account.</li>
            <li>You are responsible for maintaining the security of your account credentials.</li>
            <li>You agree to provide accurate and current information when registering.</li>
            <li>You may not share your account with others or impersonate another person or entity.</li>
          </ul>
        </Section>

        <Section title="4. Coach Responsibilities">
          <P>If you use CallSesh as a Coach, you agree that:</P>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-zinc-400 leading-relaxed">
            <li>You are solely responsible for the services you offer, deliver, and represent through your booking links.</li>
            <li>You will not offer illegal, harmful, or fraudulent services.</li>
            <li>You are responsible for any applicable taxes or professional licensing requirements in your jurisdiction.</li>
            <li>You will handle client relationships, disputes, and refunds for your sessions in good faith.</li>
            <li>You agree not to make misleading claims or guarantees about outcomes or results from your services.</li>
            <li>CallSesh is not a party to the agreement between you and your clients.</li>
          </ul>
        </Section>

        <Section title="5. Client Responsibilities">
          <P>If you book a session through CallSesh as a Client, you acknowledge that:</P>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-zinc-400 leading-relaxed">
            <li>CallSesh facilitates the booking and payment, but the Coach is the service provider.</li>
            <li>CallSesh is not responsible for the quality, accuracy, or outcome of any session.</li>
            <li>You should direct service-related disputes or concerns to the Coach directly.</li>
            <li>Any disputes regarding services must be resolved directly between the Client and the Coach.</li>
          </ul>
        </Section>

        <Section title="6. Payments and Billing">
          <P><Strong>Session payments.</Strong> Clients pay for sessions at the time of booking. Payments are processed by Stripe, a third-party payment processor. CallSesh does not store or process payment credentials directly. By completing a payment, you agree to Stripe&apos;s Terms of Service.</P>
          <P><Strong>Platform subscriptions.</Strong> Coaches may subscribe to a paid CallSesh plan (Starter or Pro) to increase their session limits. Subscriptions are billed monthly and renew automatically.</P>
          <P><Strong>Free plan.</Strong> The Free plan provides a limited number of total sessions at no charge. This is a founder-only introductory tier and is not available as a downgrade target once exhausted.</P>
          <P><Strong>Subscription changes.</Strong> You may upgrade or downgrade your plan at any time through the billing portal. Downgrades take effect at the end of the current billing period. Upgrades take effect immediately.</P>
          <P><Strong>Failed payments.</Strong> If a subscription payment fails, access to paid plan features may be suspended until payment is resolved.</P>
        </Section>

        <Section title="7. Refunds and Cancellations">
          <P><Strong>Platform subscription refunds.</Strong> CallSesh subscriptions are generally non-refundable. If you believe you were charged in error, contact us at <Email /> and we will review the case.</P>
          <P><Strong>Session refunds.</Strong> CallSesh does not manage refunds for individual coaching sessions. Refund eligibility for a booked session is determined by the Coach. If a Coach fails to deliver a session, please contact the Coach directly. CallSesh may assist in facilitation but is not obligated to issue refunds on behalf of Coaches.</P>
          <P><Strong>Session cancellations.</Strong> Clients may cancel a booked session using the cancellation link provided in their confirmation email. Whether a cancellation results in a refund is at the Coach&apos;s discretion.</P>
        </Section>

        <Section title="8. Prohibited Use">
          <P>You agree not to:</P>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-zinc-400 leading-relaxed">
            <li>Use the platform for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to any account or system</li>
            <li>Reverse-engineer, scrape, or interfere with the platform</li>
            <li>Use the platform to send spam or unsolicited communications</li>
            <li>Misrepresent your identity or the services you provide</li>
          </ul>
        </Section>

        <Section title="9. Intellectual Property">
          <P>
            CallSesh and its branding, design, and code are the property of Landeros Systems. You
            retain ownership of any content you create on the platform (such as session type
            descriptions). By posting content on CallSesh, you grant us a limited license to
            display it as necessary to operate the service.
          </P>
        </Section>

        <Section title="10. Limitation of Liability">
          <P>To the maximum extent permitted by law:</P>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-zinc-400 leading-relaxed">
            <li>CallSesh is provided &ldquo;as is&rdquo; without warranties of any kind.</li>
            <li>We do not guarantee uninterrupted or error-free access to the platform.</li>
            <li>We are not liable for the actions, services, or conduct of any Coach or Client.</li>
            <li>In no event shall Landeros Systems be liable for indirect, incidental, special, or consequential damages arising from your use of CallSesh.</li>
            <li>We do not guarantee that the platform will meet your specific requirements or expectations.</li>
            <li>We are not responsible for interruptions caused by third-party services including payment providers or video infrastructure.</li>
            <li>Our total liability to you for any claim shall not exceed the amount you paid to CallSesh in the 12 months preceding the claim.</li>
          </ul>
        </Section>

        <Section title="11. Account Termination">
          <P><Strong>By you.</Strong> You may close your account at any time by contacting <Email />. Closing your account does not entitle you to a refund of any prepaid subscription fees.</P>
          <P><Strong>By us.</Strong> We reserve the right to suspend or terminate your account at any time if you violate these Terms, engage in fraudulent activity, or use the platform in a way that harms other users or Landeros Systems. We will make reasonable efforts to notify you before termination except where immediate action is required.</P>
        </Section>

        <Section title="12. Changes to These Terms">
          <P>
            We may update these Terms from time to time. We will notify you of material changes by
            email or within the platform. Continued use of CallSesh after the effective date of
            updated Terms constitutes acceptance.
          </P>
        </Section>

        <Section title="13. Governing Law">
          <P>
            These Terms are governed by the laws of the State of California, United States.
          </P>
        </Section>

        <Section title="14. Contact">
          <P>For questions about these Terms, contact us at <Email />.</P>
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
