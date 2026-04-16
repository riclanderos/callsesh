import type { Metadata } from "next"
import Calculator from "./calculator"

export const metadata: Metadata = {
  title: "No-Show Cost Calculator for Coaches | CallSesh",
  description: "Estimate how much revenue you lose from missed coaching sessions each month and year.",
  alternates: { canonical: "/tools/no-show-cost-calculator" },
}

export default function NoShowCostCalculatorPage() {
  return <Calculator />
}
