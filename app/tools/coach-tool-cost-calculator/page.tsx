import type { Metadata } from "next"
import Calculator from "./calculator"

export const metadata: Metadata = {
  title: "Coaching Booking Software Cost Calculator | CallSesh",
  description:
    "Compare the cost of coaching booking software, scheduling tools, and payment processing platforms like Calendly, Zoom, and Stripe. Calculate your total monthly and yearly costs.",
  alternates: { canonical: "/tools/coach-tool-cost-calculator" },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does coaching software cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The monthly cost varies depending on which tools you use. Coaches often pay for coaching booking software, a video meeting tool, and payment processing separately. Combined, these subscriptions typically range from $30 to $100 or more per month — which adds up to $360–$1,200 or more on a yearly basis.",
      },
    },
    {
      "@type": "Question",
      name: "What tools do online coaches usually pay for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most online coaches pay for at least three categories of tools: coaching booking software or scheduling tools (like Calendly), a video meeting platform (like Zoom), and payment processing (like Stripe). Many also pay for note-taking or client management tools on top of that.",
      },
    },
    {
      "@type": "Question",
      name: "Why do coaching software costs add up?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each tool solves one part of the problem. Scheduling tools handle availability, video meeting tools handle the session itself, and payment processing handles getting paid. Because no single tool covers everything, coaches end up paying multiple monthly subscription fees — and that total monthly cost can quietly grow over time.",
      },
    },
    {
      "@type": "Question",
      name: "Can an all-in-one coaching platform reduce software costs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Replacing separate coaching booking software, scheduling tools, and payment processing with a single platform can significantly lower your monthly and yearly cost. An all-in-one platform also removes the friction of managing multiple accounts and integrations.",
      },
    },
  ],
}

export default function CoachToolCostCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Calculator />
    </>
  )
}
