import type { Metadata } from "next"
import Generator from "./generator"

export const metadata: Metadata = {
  title: "Session Notes Template Generator for Coaches | CallSesh",
  description:
    "Generate a simple coaching session notes template for life coaches, business coaches, and other coaching niches.",
  alternates: { canonical: "/tools/session-notes-template-generator" },
}

export default function SessionNotesTemplateGeneratorPage() {
  return <Generator />
}
