"use client"

import { useState } from "react"
import Link from "next/link"

type SessionType =
  | "Life Coaching"
  | "Business Coaching"
  | "Mindset Coaching"
  | "Career Coaching"
  | "Wellness Coaching"

const templates: Record<SessionType, string> = {
  "Life Coaching": `LIFE COACHING SESSION NOTES
============================
Client:
Date:
Session #:

CHECK-IN
--------
How is the client feeling today (1–10)?
What's been on their mind since the last session?

PROGRESS SINCE LAST SESSION
-----------------------------
Goals set last session:
What did they follow through on?
What got in the way?

TODAY'S FOCUS
--------------
Main topic or challenge to explore:
What outcome does the client want from this session?

KEY INSIGHTS
-------------
Breakthroughs or shifts that came up:
Patterns or themes noticed:
What the client said that stood out:

ACTIONS & COMMITMENTS
-----------------------
1.
2.
3.
By when:

NEXT SESSION
-------------
Date/time:
Topic to revisit:`,

  "Business Coaching": `BUSINESS COACHING SESSION NOTES
================================
Client:
Business/Role:
Date:
Session #:

CHECK-IN
--------
Current energy and focus level (1–10)?
What's the biggest thing happening in the business right now?

PROGRESS SINCE LAST SESSION
-----------------------------
Priorities set last session:
What moved forward?
What stalled and why?

TODAY'S FOCUS
--------------
Primary business challenge or goal to work through:
Desired outcome from this session:

KEY INSIGHTS
-------------
Clarity gained on strategy, team, or operations:
Assumptions challenged:
Decisions made:

METRICS TO TRACK
-----------------
Revenue / pipeline / other KPI updates:

ACTIONS & COMMITMENTS
-----------------------
1.
2.
3.
Owner:
Deadline:

NEXT SESSION
-------------
Date/time:
Priority to revisit:`,

  "Mindset Coaching": `MINDSET COACHING SESSION NOTES
================================
Client:
Date:
Session #:

CHECK-IN
--------
Emotional state today (1–10)?
Any recurring thoughts or feelings since the last session?

PROGRESS SINCE LAST SESSION
-----------------------------
Mindset shifts practiced:
Moments where old patterns showed up:
Wins — even small ones:

TODAY'S FOCUS
--------------
Limiting belief or thought pattern to explore:
What does the client want to feel or think differently about?

KEY INSIGHTS
-------------
Root belief uncovered:
Reframe or new perspective developed:
Emotional shift noticed during the session:

PRACTICES & COMMITMENTS
------------------------
Daily practice or exercise to try:
1.
2.
Journaling prompt:

NEXT SESSION
-------------
Date/time:
Belief or pattern to revisit:`,

  "Career Coaching": `CAREER COACHING SESSION NOTES
==============================
Client:
Current role/situation:
Date:
Session #:

CHECK-IN
--------
Motivation and clarity level today (1–10)?
What's feeling urgent or uncertain in their career right now?

PROGRESS SINCE LAST SESSION
-----------------------------
Applications, outreach, or interviews since last session:
What worked?
What needs adjusting?

TODAY'S FOCUS
--------------
Primary career challenge to address:
Target outcome for this session:

KEY INSIGHTS
-------------
Clarity on direction, values, or strengths:
Obstacles identified:
Shifts in how they're presenting themselves or their story:

ACTIONS & COMMITMENTS
-----------------------
1.
2.
3.
Deadline:

RESOURCES / REFERRALS
----------------------
Tools, contacts, or research to follow up on:

NEXT SESSION
-------------
Date/time:
Milestone to check in on:`,

  "Wellness Coaching": `WELLNESS COACHING SESSION NOTES
================================
Client:
Date:
Session #:

CHECK-IN
--------
Overall wellbeing today (1–10)?
Energy, sleep, and stress level since last session:

PROGRESS SINCE LAST SESSION
-----------------------------
Habits or routines worked on:
What they maintained:
Where they struggled:

TODAY'S FOCUS
--------------
Wellness area to address (sleep / nutrition / movement / stress / mindset):
What outcome does the client want from today?

KEY INSIGHTS
-------------
Patterns or triggers noticed:
What the client connected with during the session:
Small win to acknowledge:

HABITS & COMMITMENTS
---------------------
1.
2.
3.
Tracking method:

NEXT SESSION
-------------
Date/time:
Habit or area to review:`,
}

const sessionTypes: SessionType[] = [
  "Life Coaching",
  "Business Coaching",
  "Mindset Coaching",
  "Career Coaching",
  "Wellness Coaching",
]

export default function Generator() {
  const [sessionType, setSessionType] = useState<SessionType>("Life Coaching")
  const [copied, setCopied] = useState(false)

  const template = templates[sessionType]

  function handleCopy() {
    navigator.clipboard.writeText(template).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Home nav */}
        <div className="mb-10">
          <Link href="/" className="text-sm font-semibold text-zinc-900 hover:text-zinc-700 transition-colors">
            CallSesh
          </Link>
        </div>

        {/* Breadcrumb */}
        <Link href="/tools" className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors inline-block mb-8">
          ← Back to Free Tools
        </Link>

        {/* Header */}
        <div className="mb-10 space-y-4">
          <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">Free Tool</span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-zinc-900">
            Session Notes Template Generator
          </h1>
          <p className="text-zinc-700 leading-relaxed">
            Select your coaching niche and get a ready-to-use session notes template you can copy and adapt for your own sessions.
          </p>
        </div>

        {/* Generator */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm mb-6 space-y-5">
          <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">Choose Your Session Type</p>

          <div className="space-y-1.5">
            <label htmlFor="session-type" className="text-sm font-medium text-zinc-700">
              Session type
            </label>
            <select
              id="session-type"
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value as SessionType)}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-300 bg-white"
            >
              {sessionTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Your template</label>
            <pre className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-4 text-xs text-zinc-700 leading-relaxed whitespace-pre-wrap font-mono overflow-auto">
              {template}
            </pre>
            <p className="text-xs text-zinc-500">
              Use this as a starting point and adapt it to your coaching style. Want to understand your full tool setup? Try our{" "}
              <Link href="/tools/coach-tool-cost-calculator" className="underline underline-offset-2 hover:text-zinc-700 transition-colors">
                coaching booking software cost calculator
              </Link>.
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            {copied ? "Copied!" : "Copy Template"}
          </button>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-7">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-1.5">Why should coaches take session notes?</h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                Session notes help coaches track client progress over time, identify recurring patterns, and prepare for future sessions without relying on memory. They also create a record of commitments and actions agreed upon during the session, which improves accountability for both coach and client.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-1.5">What should a coaching session notes template include?</h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                A good coaching session notes template typically covers a check-in, progress since the last session, the main focus of the current session, key insights or breakthroughs, and specific actions or commitments before the next session. The exact structure should reflect your coaching style and the needs of your niche.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-1.5">Do coaching session notes need to be formal?</h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                No. Session notes are a practical tool for the coach, not a clinical document. They should be easy and fast to fill in — detailed enough to be useful in the next session, but not so rigid that they slow you down. A simple template adapted to your style is more useful than a complex one you don't use consistently.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-1.5">Should coaches share session notes with clients?</h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                Some coaches share a summary or action items with clients after each session, while others keep their notes private and internal. Sharing a brief recap can help clients stay accountable and feel supported between sessions. What you share — and how — is a personal choice based on your coaching model and client preferences.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Keep all your session notes in one place
          </h2>
          <p className="text-zinc-700 text-sm leading-relaxed">
            CallSesh stores session notes, recaps, and client history automatically — no separate docs or folders needed.
          </p>
          <div className="pt-1">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-7 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Try CallSesh
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
