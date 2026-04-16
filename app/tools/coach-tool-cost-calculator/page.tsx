import type { Metadata } from "next"
import Calculator from "./calculator"

export const metadata: Metadata = {
  title: "Coaching Booking Software Cost Calculator | CallSesh",
  description:
    "Compare the cost of coaching booking software, scheduling tools, and payment processing platforms like Calendly, Zoom, and Stripe. Calculate your total monthly and yearly costs.",
  alternates: { canonical: "/tools/coach-tool-cost-calculator" },
}

export default function CoachToolCostCalculatorPage() {
  return <Calculator />
}
