/**
 * Generates landing-page screenshots from self-contained HTML mockups.
 * Uses system Chrome via puppeteer-core — no bundled browser download.
 *
 * Usage:  node scripts/capture-screenshots.mjs
 */

import puppeteer from 'puppeteer-core'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '..', 'public', 'images')
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

// ─── shared CSS ─────────────────────────────────────────────────────────────

const BASE_CSS = `
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      background: #09090b;
      color: #f4f4f5;
      -webkit-font-smoothing: antialiased;
      font-size: 16px;
      line-height: 1.5;
    }
    button { cursor: default; font-family: inherit; }
  </style>
`

// ─── hero.png — 1200 × 720 ──────────────────────────────────────────────────
// Coach dashboard: upcoming session prominent, "Open session" button glows.
// Tighter viewport, higher contrast, indigo accent light behind the card.

function heroHtml() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${BASE_CSS}
<style>
  .glow-card {
    position:relative;
    background:#18181b;
    border:1px solid #4338ca;
    border-radius:14px;
    padding:28px;
  }
  .glow-card::before {
    content:'';
    position:absolute;
    inset:-1px;
    border-radius:14px;
    box-shadow:0 0 40px 4px rgba(99,102,241,.25);
    pointer-events:none;
  }
  .open-btn {
    background:#4f46e5;
    border:none;
    border-radius:9px;
    padding:10px 20px;
    font-size:14px;
    font-weight:600;
    color:#fff;
    box-shadow:0 0 18px 2px rgba(99,102,241,.55);
  }
</style>
</head><body>
<div style="width:1200px;height:720px;overflow:hidden;background:linear-gradient(160deg,#09090b 60%,#0f0a2a 100%);padding:40px 200px">

  <!-- Header -->
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px">
    <div>
      <h1 style="font-size:22px;font-weight:600;color:#f4f4f5">Your dashboard</h1>
      <p style="font-size:13px;color:#52525b;margin-top:2px">daniel@example.com &mdash; Starter plan</p>
    </div>
    <div style="display:flex;gap:8px">
      <button style="background:transparent;border:1px solid #27272a;border-radius:8px;padding:7px 14px;font-size:13px;color:#71717a">Bookings</button>
      <button style="background:transparent;border:1px solid #27272a;border-radius:8px;padding:7px 14px;font-size:13px;color:#71717a">Session types</button>
    </div>
  </div>

  <!-- Next session — glowing card -->
  <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#6366f1;margin-bottom:10px">Next Session</p>
  <div class="glow-card" style="margin-bottom:20px">
    <div style="display:flex;align-items:center;justify-content:space-between">
      <div>
        <p style="font-size:20px;font-weight:700;color:#f4f4f5;margin-bottom:3px">Maya Chen</p>
        <p style="font-size:14px;color:#a1a1aa;margin-bottom:8px">1:1 Coaching Call</p>
        <p style="font-size:13px;color:#71717a">Today &middot; 2:00 PM &ndash; 3:00 PM</p>
      </div>
      <button class="open-btn">Open session &rarr;</button>
    </div>
  </div>

  <!-- Upcoming -->
  <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#52525b;margin-bottom:10px">Upcoming</p>
  <div style="background:#18181b;border:1px solid #27272a;border-radius:12px;overflow:hidden;margin-bottom:20px">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px">
      <div>
        <p style="font-size:14px;font-weight:500;color:#e4e4e7">Jordan Blake</p>
        <p style="font-size:12px;color:#52525b;margin-top:2px">Mon, Mar 30 &middot; 10:00 AM</p>
      </div>
      <span style="font-size:12px;color:#52525b">Quick Call</span>
    </div>
    <div style="border-top:1px solid #27272a;display:flex;align-items:center;justify-content:space-between;padding:14px 20px">
      <div>
        <p style="font-size:14px;font-weight:500;color:#e4e4e7">Alex Rivera</p>
        <p style="font-size:12px;color:#52525b;margin-top:2px">Tue, Mar 31 &middot; 3:00 PM</p>
      </div>
      <span style="font-size:12px;color:#52525b">1:1 Coaching Call</span>
    </div>
  </div>

  <!-- Booking links -->
  <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#52525b;margin-bottom:10px">Booking links</p>
  <div style="background:#18181b;border:1px solid #27272a;border-radius:12px;overflow:hidden">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px">
      <div>
        <p style="font-size:14px;font-weight:500;color:#e4e4e7">1:1 Coaching Call</p>
        <p style="font-size:12px;margin-top:2px"><span style="color:#3f3f46">callsesh.com</span><span style="color:#818cf8">/book/coaching-call</span></p>
      </div>
      <button style="background:#27272a;border:1px solid #3f3f46;border-radius:7px;padding:5px 12px;font-size:12px;font-weight:500;color:#d4d4d8">Copy</button>
    </div>
    <div style="border-top:1px solid #27272a;display:flex;align-items:center;justify-content:space-between;padding:14px 20px">
      <div>
        <p style="font-size:14px;font-weight:500;color:#e4e4e7">Quick Call</p>
        <p style="font-size:12px;margin-top:2px"><span style="color:#3f3f46">callsesh.com</span><span style="color:#818cf8">/book/quick-call</span></p>
      </div>
      <button style="background:#27272a;border:1px solid #3f3f46;border-radius:7px;padding:5px 12px;font-size:12px;font-weight:500;color:#d4d4d8">Copy</button>
    </div>
  </div>

</div>
</body></html>`
}

// ─── how-it-works-1.png — 800 × 560 ─────────────────────────────────────────
// "Set your schedule in seconds" — availability setup page.
// Shows a weekly schedule grid with active time slots highlighted in indigo.

function howItWorks1Html() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${BASE_CSS}</head><body>
<div style="width:800px;height:560px;overflow:hidden;background:#09090b;padding:32px 48px">

  <!-- Page header -->
  <div style="margin-bottom:24px">
    <h1 style="font-size:20px;font-weight:600;color:#f4f4f5">Set your availability</h1>
    <p style="font-size:13px;color:#52525b;margin-top:3px">Choose the days and times you're open for bookings.</p>
  </div>

  <!-- Weekly grid -->
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:20px">

    <!-- Mon -->
    <div style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:14px 10px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <p style="font-size:12px;font-weight:600;color:#f4f4f5">Mon</p>
        <div style="width:28px;height:16px;background:#4f46e5;border-radius:8px;position:relative"><div style="position:absolute;right:2px;top:2px;width:12px;height:12px;background:#fff;border-radius:50%"></div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:5px">
        <div style="background:#312e81;border:1px solid #4338ca;border-radius:6px;padding:5px 8px;font-size:11px;font-weight:500;color:#c7d2fe">9:00 AM</div>
        <div style="background:#312e81;border:1px solid #4338ca;border-radius:6px;padding:5px 8px;font-size:11px;font-weight:500;color:#c7d2fe">10:00 AM</div>
        <div style="background:#312e81;border:1px solid #4338ca;border-radius:6px;padding:5px 8px;font-size:11px;font-weight:500;color:#c7d2fe">2:00 PM</div>
        <div style="background:#312e81;border:1px solid #4338ca;border-radius:6px;padding:5px 8px;font-size:11px;font-weight:500;color:#c7d2fe">3:00 PM</div>
      </div>
    </div>

    <!-- Tue -->
    <div style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:14px 10px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <p style="font-size:12px;font-weight:600;color:#f4f4f5">Tue</p>
        <div style="width:28px;height:16px;background:#4f46e5;border-radius:8px;position:relative"><div style="position:absolute;right:2px;top:2px;width:12px;height:12px;background:#fff;border-radius:50%"></div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:5px">
        <div style="background:#312e81;border:1px solid #4338ca;border-radius:6px;padding:5px 8px;font-size:11px;font-weight:500;color:#c7d2fe">10:00 AM</div>
        <div style="background:#312e81;border:1px solid #4338ca;border-radius:6px;padding:5px 8px;font-size:11px;font-weight:500;color:#c7d2fe">11:00 AM</div>
        <div style="background:#312e81;border:1px solid #4338ca;border-radius:6px;padding:5px 8px;font-size:11px;font-weight:500;color:#c7d2fe">3:00 PM</div>
      </div>
    </div>

    <!-- Wed -->
    <div style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:14px 10px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <p style="font-size:12px;font-weight:600;color:#f4f4f5">Wed</p>
        <div style="width:28px;height:16px;background:#4f46e5;border-radius:8px;position:relative"><div style="position:absolute;right:2px;top:2px;width:12px;height:12px;background:#fff;border-radius:50%"></div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:5px">
        <div style="background:#312e81;border:1px solid #4338ca;border-radius:6px;padding:5px 8px;font-size:11px;font-weight:500;color:#c7d2fe">9:00 AM</div>
        <div style="background:#312e81;border:1px solid #4338ca;border-radius:6px;padding:5px 8px;font-size:11px;font-weight:500;color:#c7d2fe">1:00 PM</div>
        <div style="background:#312e81;border:1px solid #4338ca;border-radius:6px;padding:5px 8px;font-size:11px;font-weight:500;color:#c7d2fe">2:00 PM</div>
      </div>
    </div>

    <!-- Thu -->
    <div style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:14px 10px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <p style="font-size:12px;font-weight:600;color:#f4f4f5">Thu</p>
        <div style="width:28px;height:16px;background:#27272a;border:1px solid #3f3f46;border-radius:8px;position:relative"><div style="position:absolute;left:2px;top:2px;width:12px;height:12px;background:#52525b;border-radius:50%"></div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:5px">
        <div style="background:#1c1c1f;border:1px solid #27272a;border-radius:6px;padding:5px 8px;font-size:11px;color:#3f3f46">Unavailable</div>
      </div>
    </div>

    <!-- Fri -->
    <div style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:14px 10px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <p style="font-size:12px;font-weight:600;color:#f4f4f5">Fri</p>
        <div style="width:28px;height:16px;background:#4f46e5;border-radius:8px;position:relative"><div style="position:absolute;right:2px;top:2px;width:12px;height:12px;background:#fff;border-radius:50%"></div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:5px">
        <div style="background:#312e81;border:1px solid #4338ca;border-radius:6px;padding:5px 8px;font-size:11px;font-weight:500;color:#c7d2fe">10:00 AM</div>
        <div style="background:#312e81;border:1px solid #4338ca;border-radius:6px;padding:5px 8px;font-size:11px;font-weight:500;color:#c7d2fe">11:00 AM</div>
      </div>
    </div>

  </div>

  <!-- Save button -->
  <div style="display:flex;justify-content:flex-end">
    <button style="background:#4f46e5;border:none;border-radius:9px;padding:10px 24px;font-size:14px;font-weight:600;color:#fff">Save availability</button>
  </div>

</div>
</body></html>`
}

// ─── how-it-works-2.png — 800 × 560 ─────────────────────────────────────────
// "Clients book instantly" — booking page with one slot selected.
// Focused on slot picker + CTA button, indigo selected slot pops.

function howItWorks2Html() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${BASE_CSS}</head><body>
<div style="width:800px;height:560px;overflow:hidden;background:#09090b;padding:32px 64px">

  <!-- Session card -->
  <div style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:20px 24px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between">
    <div>
      <h1 style="font-size:18px;font-weight:600;color:#f4f4f5;margin-bottom:3px">1:1 Coaching Call</h1>
      <p style="font-size:13px;color:#71717a">with Daniel from CallSesh</p>
    </div>
    <div style="text-align:right">
      <p style="font-size:20px;font-weight:700;color:#f4f4f5">$75.00</p>
      <p style="font-size:12px;color:#52525b">60 min</p>
    </div>
  </div>

  <!-- Slot picker label -->
  <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#52525b;margin-bottom:12px">Choose a time</p>

  <!-- Day columns -->
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px">

    <!-- Mon -->
    <div style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:14px 12px">
      <p style="font-size:12px;font-weight:600;color:#f4f4f5">Mon</p>
      <p style="font-size:11px;color:#52525b;margin-bottom:11px">Mar 30</p>
      <div style="display:flex;flex-direction:column;gap:6px">
        <button style="background:#27272a;border:1px solid #3f3f46;border-radius:7px;padding:8px 0;font-size:12px;color:#a1a1aa;width:100%">9:00 AM</button>
        <button style="background:#27272a;border:1px solid #3f3f46;border-radius:7px;padding:8px 0;font-size:12px;color:#a1a1aa;width:100%">10:00 AM</button>
        <button style="background:#4f46e5;border:1px solid #4338ca;border-radius:7px;padding:8px 0;font-size:12px;font-weight:700;color:#fff;width:100%;box-shadow:0 0 12px rgba(99,102,241,.5)">2:00 PM &#10003;</button>
        <button style="background:#27272a;border:1px solid #3f3f46;border-radius:7px;padding:8px 0;font-size:12px;color:#a1a1aa;width:100%">3:00 PM</button>
      </div>
    </div>

    <!-- Tue -->
    <div style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:14px 12px">
      <p style="font-size:12px;font-weight:600;color:#f4f4f5">Tue</p>
      <p style="font-size:11px;color:#52525b;margin-bottom:11px">Mar 31</p>
      <div style="display:flex;flex-direction:column;gap:6px">
        <button style="background:#27272a;border:1px solid #3f3f46;border-radius:7px;padding:8px 0;font-size:12px;color:#a1a1aa;width:100%">10:00 AM</button>
        <button style="background:#27272a;border:1px solid #3f3f46;border-radius:7px;padding:8px 0;font-size:12px;color:#a1a1aa;width:100%">11:00 AM</button>
        <button style="background:#27272a;border:1px solid #3f3f46;border-radius:7px;padding:8px 0;font-size:12px;color:#a1a1aa;width:100%">3:00 PM</button>
      </div>
    </div>

    <!-- Wed -->
    <div style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:14px 12px">
      <p style="font-size:12px;font-weight:600;color:#f4f4f5">Wed</p>
      <p style="font-size:11px;color:#52525b;margin-bottom:11px">Apr 1</p>
      <div style="display:flex;flex-direction:column;gap:6px">
        <button style="background:#27272a;border:1px solid #3f3f46;border-radius:7px;padding:8px 0;font-size:12px;color:#a1a1aa;width:100%">9:00 AM</button>
        <button style="background:#27272a;border:1px solid #3f3f46;border-radius:7px;padding:8px 0;font-size:12px;color:#a1a1aa;width:100%">1:00 PM</button>
        <button style="background:#27272a;border:1px solid #3f3f46;border-radius:7px;padding:8px 0;font-size:12px;color:#a1a1aa;width:100%">3:00 PM</button>
      </div>
    </div>

  </div>

  <!-- Book CTA -->
  <button style="width:100%;background:#4f46e5;border:none;border-radius:10px;padding:13px 0;font-size:15px;font-weight:700;color:#fff;letter-spacing:.01em;box-shadow:0 0 20px 2px rgba(99,102,241,.35)">
    Book Session &mdash; $75.00
  </button>

</div>
</body></html>`
}

// ─── how-it-works-3.png — 800 × 560 ─────────────────────────────────────────
// "Get paid automatically" — booking confirmation + payment summary.
// Green confirmation banner, session details, payout info.

function howItWorks3Html() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${BASE_CSS}</head><body>
<div style="width:800px;height:560px;overflow:hidden;background:#09090b;padding:32px 80px">

  <!-- Confirmation banner -->
  <div style="background:#052e16;border:1px solid #166534;border-radius:12px;padding:16px 20px;display:flex;align-items:center;gap:12px;margin-bottom:22px">
    <div style="width:28px;height:28px;background:#16a34a;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px;color:#fff;font-weight:700">&#10003;</div>
    <div>
      <p style="font-size:15px;font-weight:600;color:#4ade80">Booking confirmed!</p>
      <p style="font-size:13px;color:#86efac;margin-top:1px">A confirmation email has been sent to jordan@example.com</p>
    </div>
  </div>

  <!-- Session details card -->
  <div style="background:#18181b;border:1px solid #27272a;border-radius:12px;overflow:hidden;margin-bottom:16px">
    <div style="padding:18px 22px;border-bottom:1px solid #27272a">
      <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#52525b;margin-bottom:6px">Session</p>
      <p style="font-size:16px;font-weight:600;color:#f4f4f5">1:1 Coaching Call</p>
      <p style="font-size:13px;color:#71717a;margin-top:2px">with Daniel &mdash; 60 minutes</p>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;padding:18px 22px;gap:16px">
      <div>
        <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#52525b;margin-bottom:5px">Date &amp; Time</p>
        <p style="font-size:14px;color:#e4e4e7">Mon, Mar 30, 2026</p>
        <p style="font-size:13px;color:#71717a">2:00 PM &ndash; 3:00 PM</p>
      </div>
      <div>
        <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#52525b;margin-bottom:5px">Guest</p>
        <p style="font-size:14px;color:#e4e4e7">Jordan Blake</p>
        <p style="font-size:13px;color:#71717a">jordan@example.com</p>
      </div>
    </div>
  </div>

  <!-- Payment summary card -->
  <div style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:18px 22px">
    <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#52525b;margin-bottom:14px">Payment</p>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <p style="font-size:14px;color:#a1a1aa">Session fee</p>
      <p style="font-size:14px;color:#f4f4f5;font-weight:500">$75.00</p>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <p style="font-size:14px;color:#a1a1aa">Platform fee (10%)</p>
      <p style="font-size:14px;color:#71717a">&minus;$7.50</p>
    </div>
    <div style="border-top:1px solid #27272a;padding-top:12px;display:flex;align-items:center;justify-content:space-between">
      <p style="font-size:14px;font-weight:600;color:#f4f4f5">You receive</p>
      <p style="font-size:18px;font-weight:700;color:#4ade80">$67.50</p>
    </div>
  </div>

</div>
</body></html>`
}

// ─── capture ─────────────────────────────────────────────────────────────────

const SHOTS = [
  { file: 'hero.png',            w: 1200, h: 720,  html: heroHtml() },
  { file: 'how-it-works-1.png',  w: 800,  h: 560,  html: howItWorks1Html() },
  { file: 'how-it-works-2.png',  w: 800,  h: 560,  html: howItWorks2Html() },
  { file: 'how-it-works-3.png',  w: 800,  h: 560,  html: howItWorks3Html() },
]

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
})

for (const { file, w, h, html } of SHOTS) {
  const page = await browser.newPage()
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 2 })
  await page.setContent(html, { waitUntil: 'domcontentloaded' })
  const outPath = path.join(OUT, file)
  await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: w, height: h } })
  const kb = Math.round(fs.statSync(outPath).size / 1024)
  console.log(`✓  ${file}  (${kb} kB)`)
  await page.close()
}

await browser.close()
console.log('\nAll screenshots saved to public/images/')
