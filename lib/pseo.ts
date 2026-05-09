export type PseoPage = {
  path: string
  title: string
  description: string
  h1: string
  intro: string
  forWho: string[]
  problem: {
    heading: string
    points: string[]
  }
  solution: {
    heading: string
    points: string[]
  }
  comparison?: {
    theyLabel: string
    rows: { feature: string; them: string; us: string }[]
  }
  workflow: { step: string; detail: string }[]
  faq: { q: string; a: string }[]
  ctaHeading: string
  ctaBody: string
  related: { label: string; href: string }[]
  contextualNote?: { prefix: string; linkText: string; href: string; suffix: string }
}

const pages: PseoPage[] = [
  {
    path: '/coaching-booking-software',
    title: 'Coaching Booking Software — CallSesh',
    description:
      'Schedule paid coaching sessions, collect payment, and run video calls from one link. CallSesh is booking software built specifically for coaches.',
    h1: 'Coaching Booking Software That Handles Payments and Video Too',
    intro:
      'Most booking tools were built for meetings, not paid coaching. They force you to stitch together a scheduler, a payment processor, and a video app — then manually coordinate all three. CallSesh is different: one link for your clients to book, pay, and join a session.',
    forWho: [
      'Solo coaches moving from free to paid sessions',
      'Career, life, and executive coaches billing hourly',
      'Fitness and health coaches running remote sessions',
      'Consultants and advisors who want payment upfront',
    ],
    problem: {
      heading: 'The problem with generic booking tools',
      points: [
        'Tools like Calendly handle scheduling but not payments — you still have to invoice clients manually or build a fragile Stripe integration that breaks.',
        'Zoom or Google Meet have no connection to your booking system, so you\'re copying session links by hand and hoping clients show up.',
        'Unpaid bookings mean no-shows cost you real money. Without payment required at booking, clients ghost without consequence.',
      ],
    },
    solution: {
      heading: 'How CallSesh solves it',
      points: [
        'Payment is required at booking time — clients can\'t hold a slot without paying, eliminating unpaid no-shows.',
        'A private video room is created automatically for each booking. Clients get a secure link in their confirmation email.',
        'Your availability, session types, and prices are all managed in one dashboard. No integrations to maintain.',
        'Automatic payouts go to your bank after each session via Stripe — no manual transfers, no invoicing.',
      ],
    },
    workflow: [
      { step: 'Create your booking page', detail: 'Set your availability, define session types, and set your price. Takes under two minutes.' },
      { step: 'Share one link', detail: 'Send your CallSesh URL in an email, add it to your bio, or put it on your website.' },
      { step: 'Client books and pays', detail: 'Clients pick an available slot and pay by card. Confirmation is instant.' },
      { step: 'Show up and coach', detail: 'At session time, click your session link. A private video room opens in the browser — nothing to install.' },
    ],
    faq: [
      {
        q: 'How is this different from Calendly?',
        a: 'Calendly is built for scheduling meetings. It has no native payment collection for coaching and no built-in video. You need to connect Stripe manually and still use a separate video tool. CallSesh includes all three by default.',
      },
      {
        q: 'Do I need a Stripe account?',
        a: 'Yes. You connect a free Stripe account during setup. Stripe handles payment processing and automatic payouts to your bank.',
      },
      {
        q: 'What video technology does CallSesh use?',
        a: 'Sessions run on Daily.co, a browser-based video platform. No software install is required for you or your clients.',
      },
      {
        q: 'Can I offer different session types at different prices?',
        a: 'Yes. You can create multiple session types — for example, a 30-minute intro call at one price and a 60-minute deep dive at another.',
      },
      {
        q: 'Is there a free plan?',
        a: 'Yes. Your first 10 sessions are included at no cost. After that, Starter is $19.99/month for up to 40 sessions, or Pro at $49.99/month for unlimited sessions. A 10% platform fee applies per session.',
      },
    ],
    ctaHeading: 'Set up your coaching page in under two minutes',
    ctaBody: 'No credit card required to start. Your first 10 sessions are free.',
    related: [
      { label: 'Online coaching platform', href: '/online-coaching-platform' },
      { label: 'Coach payment processing', href: '/coach-payment-processing' },
      { label: 'Video coaching platform', href: '/video-coaching-platform' },
      { label: 'Coaching scheduling software', href: '/coaching-scheduling-software' },
    ],
    contextualNote: {
      prefix: 'CallSesh also includes a built-in ',
      linkText: 'video coaching platform',
      href: '/video-coaching-platform',
      suffix: ' — no third-party video tool required.',
    },
  },

  {
    path: '/coach-payment-processing',
    title: 'Get Paid When Clients Book — Coach Payment Processing | CallSesh',
    description:
      'Stop chasing invoices. CallSesh requires payment at booking time so sessions are only confirmed after the client pays. Powered by Stripe.',
    h1: 'Stop Chasing Payments—Get Paid When Clients Book Your Sessions',
    intro:
      'Clients pay during booking. Sessions are confirmed only after payment clears. By the time you show up to coach, the money is already collected — no invoices, no follow-ups, no uncertainty.',
    forWho: [
      'Coaches tired of sending invoices and chasing payment after sessions',
      'Coaches who have lost income to no-shows from unpaid bookings',
      'Coaches currently collecting via Venmo, PayPal, or bank transfer',
      'Coaches transitioning from free to paid sessions and want a clean setup',
    ],
    problem: {
      heading: 'Why payment collection is broken for most coaches',
      points: [
        'Chasing invoices after a session is awkward and slow. Clients delay, forget, or dispute charges — and you feel uncomfortable following up on money you\'ve already earned.',
        'No-shows hurt more when there\'s no payment commitment. Free scheduling tools let clients hold a slot without any financial stake, so cancellations cost you real income.',
        'Using multiple tools — a scheduling app, a payment link, and a video platform — means more admin and more ways for the handoff to break.',
        'Uncertainty about whether you\'ll get paid creates stress before every session. You shouldn\'t have to wonder.',
      ],
    },
    solution: {
      heading: 'Payment required at booking — sessions confirmed only after payment',
      points: [
        'Clients pay by card during booking. The slot is not confirmed until payment clears — so every session on your calendar is already paid.',
        'Stripe handles all payment processing. CallSesh connects to your Stripe account; you never touch card data.',
        'Session confirmation emails go to both you and your client the moment payment succeeds. No manual follow-up needed on your end.',
        'Track your earnings from the CallSesh dashboard — see session history and cumulative income without logging into a separate tool.',
      ],
    },
    workflow: [
      { step: 'Connect Stripe', detail: 'Link a free Stripe account in the dashboard. Takes five minutes, no technical knowledge needed.' },
      { step: 'Set your session price', detail: 'Price each session type however you like — flat rate, hourly, or tiered by length.' },
      { step: 'Client books and pays', detail: 'Clients enter card details on your booking page. Payment is processed immediately. The session is confirmed only after payment clears.' },
      { step: 'Track your earnings', detail: 'View your session history and earnings in the CallSesh dashboard. Stripe handles the actual payout to your bank on its standard schedule.' },
    ],
    faq: [
      {
        q: 'When do I get paid?',
        a: 'Payments are processed via Stripe and follow Stripe\'s payout schedule — typically two business days after a payment is captured. CallSesh tracks your earnings but does not manage payout timing; that is handled entirely by Stripe.',
      },
      {
        q: 'Do I need to send invoices?',
        a: 'No. Clients pay during booking. There is no invoicing step. Once a session is on your calendar, payment has already been collected.',
      },
      {
        q: 'What payment methods does CallSesh accept?',
        a: 'All major credit and debit cards via Stripe — Visa, Mastercard, American Express, and Discover.',
      },
      {
        q: 'What fees are involved?',
        a: 'CallSesh charges a 10% platform fee per session. Stripe adds its standard processing fee (approximately 2.9% + 30¢). Both are deducted automatically — no manual math.',
      },
      {
        q: 'Can I offer free or discounted sessions?',
        a: 'Yes. You can set any session price—including $0—for free sessions, trials, or promotions. There\'s no platform fee on free sessions. For paid sessions, standard fees apply.',
      },
      {
        q: 'Is payment data stored securely?',
        a: 'CallSesh never stores card data. All payment information is handled directly by Stripe, which is PCI Level 1 certified.',
      },
    ],
    ctaHeading: 'Stop Chasing Payments—Get Paid at Booking',
    ctaBody: 'Clients pay when they book—so every session is confirmed and paid upfront.',
    related: [
      { label: 'Coaching billing software', href: '/coaching-billing-software' },
      { label: 'Paid session booking software', href: '/coaching-booking-software' },
      { label: 'Video coaching platform', href: '/video-coaching-platform' },
      { label: 'Calendly for coaches', href: '/alternatives/calendly-for-coaches' },
    ],
  },

  {
    path: '/video-coaching-platform',
    title: 'Video Coaching Platform — CallSesh',
    description:
      'Run paid video coaching sessions without juggling Zoom, Calendly, and Stripe. One booking link — clients book, pay, and join a private video room automatically.',
    h1: 'Video Coaching Platform With Built-in Booking and Payments',
    intro:
      'Running a video coaching practice shouldn\'t require three separate tools and a spreadsheet to hold them together. CallSesh gives you one booking link. Clients pick a time, pay by card, and receive a private video room link in their confirmation email. You show up and coach.',
    forWho: [
      'Coaches moving from in-person to remote sessions',
      'Online coaches replacing Zoom + Calendly with one tool',
      'Coaches who want a professional client experience from first click to session',
      'New coaches building a paid practice from scratch',
    ],
    problem: {
      heading: 'The problem with stitching tools together',
      points: [
        'Using Calendly + Zoom + Stripe means three separate products to pay for, three logins to manage, and a fragile set of integrations that break silently.',
        'Clients receive multiple emails from different platforms — a Calendly confirmation, a Stripe receipt, and a separate Zoom invite — which looks disjointed and unprofessional.',
        'When something goes wrong (wrong Zoom link, failed payment, scheduling conflict), diagnosing the problem across three platforms wastes time on both sides.',
      ],
    },
    solution: {
      heading: 'One link. Booking, payment, and video together.',
      points: [
        'Your CallSesh booking page handles scheduling, payment collection, and video room creation in a single flow.',
        'Each booking automatically generates a private video room. The room link is included in the confirmation email — no separate calendar invite needed.',
        'Video runs in the browser using Daily.co. Clients don\'t install anything. You don\'t generate or share Zoom links manually.',
        'Sessions, earnings, and upcoming bookings live in a single dashboard — no spreadsheet, no context switching.',
      ],
    },
    workflow: [
      { step: 'Create your session types', detail: 'Define what you offer — 30-minute check-ins, 60-minute deep dives, strategy sessions — each with its own price.' },
      { step: 'Share your booking link', detail: 'One URL for everything. Add it to your email signature, website, or social profiles.' },
      { step: 'Client books and pays', detail: 'Clients pick a slot and pay by card. A confirmation email with their private video link is sent automatically.' },
      { step: 'Join at session time', detail: 'Click your session link from the dashboard. The video room opens instantly in your browser.' },
    ],
    faq: [
      {
        q: 'Do I need to install any software?',
        a: 'No. The video room runs entirely in the browser. No downloads required for you or your clients.',
      },
      {
        q: 'Do clients need a CallSesh account?',
        a: 'No. Clients book as guests. They receive their session link by email and join with one click.',
      },
      {
        q: 'Can I record sessions?',
        a: 'Session recording is not currently supported. This is planned for a future update.',
      },
      {
        q: 'What is the video quality like?',
        a: 'HD video and audio powered by Daily.co, which is purpose-built for real-time video. Quality depends on each participant\'s internet connection.',
      },
      {
        q: 'What happens if a client doesn\'t show up?',
        a: 'Because clients pay at booking time, no-shows don\'t mean lost income. The session fee has already been collected. You can choose to reschedule at your discretion.',
      },
      {
        q: 'Is the video room private?',
        a: 'Yes. Each booking generates a unique, private room accessible only to the coach and client via the secure link sent in the confirmation email.',
      },
    ],
    ctaHeading: 'Replace your video + booking + payment stack with one link',
    ctaBody: 'Get started free. First 10 sessions included at no cost.',
    related: [
      { label: 'Booking software for coaches', href: '/coaching-booking-software' },
      { label: 'Coach payment processing', href: '/coach-payment-processing' },
      { label: 'Online coaching platform', href: '/online-coaching-platform' },
      { label: 'Software for business coaches', href: '/for/business-coaches' },
    ],
  },

  {
    path: '/alternatives/calendly-for-coaches',
    title: 'Is Calendly Good for Coaches? What Paid Coaching Actually Needs | CallSesh',
    description:
      'Calendly works well for free calls and meeting scheduling. For paid coaching sessions, here\'s where it falls short — and what coaches use instead.',
    h1: 'Is Calendly Good for Coaches? An Honest Assessment for Paid Sessions',
    intro:
      'Calendly is excellent scheduling software for sales calls, team meetings, and free discovery sessions. If you run a paid coaching practice, the picture is more complicated. Payment collection requires a higher-tier plan and manual Stripe configuration. There is no built-in video room. And clients can technically book a slot without payment completing if the integration fails silently. This page explains where Calendly works well, where it breaks down for paid coaching, and what coaches who charge for their time use instead.',
    forWho: [
      'Coaches considering Calendly and wondering if it works for paid sessions',
      'Coaches currently on Calendly who need to add payment collection to their flow',
      'Coaches comparing scheduling tools before committing to a setup',
      'New coaches figuring out the right stack for a paid practice from day one',
    ],
    problem: {
      heading: 'Where Calendly works — and where it breaks down for paid coaching',
      points: [
        'For free discovery calls, internal scheduling, and meeting coordination, Calendly is a genuinely good tool. The limitation is paid sessions specifically.',
        'Payment integration in Calendly requires a paid plan and a manual Stripe webhook setup. Even when configured correctly, clients can technically hold a slot without payment completing — booking and payment are separate flows.',
        'There is no video room. After a client books through Calendly, you still need to generate a Zoom or Google Meet link, attach it to the calendar event, and ensure the client receives it before every session.',
      ],
    },
    solution: {
      heading: 'What paid coaching sessions actually need',
      points: [
        'Payment required at booking time — not as an optional add-on, but as the default. Slots confirm only when payment clears.',
        'An automatic video room tied to each booking, sent to the client in the confirmation email. No manual link generation for every session.',
        'Session history and client records — not just a calendar of upcoming events.',
        'A single dashboard covering scheduling, payment, and sessions — not three tools configured to talk to each other.',
      ],
    },
    comparison: {
      theyLabel: 'Calendly',
      rows: [
        { feature: 'Payment at booking', them: 'Paid plan + manual setup', us: 'Built in, always on' },
        { feature: 'Built-in video room', them: 'No — use Zoom or Meet', us: 'Yes, browser-based' },
        { feature: 'No-show protection', them: 'None (free bookings allowed)', us: 'Payment required to book' },
        { feature: 'Client needs account', them: 'No', us: 'No' },
        { feature: 'Coach dashboard', them: 'Yes', us: 'Yes' },
        { feature: 'Purpose-built for coaches', them: 'No — general scheduling', us: 'Yes' },
      ],
    },
    workflow: [
      { step: 'Create your CallSesh account', detail: 'Sign up free. Connect Stripe. Takes five minutes.' },
      { step: 'Add your session types', detail: 'Define what you offer and set your prices. Your booking page is ready immediately.' },
      { step: 'Share your link', detail: 'Send your CallSesh URL wherever you used to send your Calendly link.' },
      { step: 'Clients book and pay in one step', detail: 'No chasing invoices. No separate Stripe link. Payment is part of booking.' },
    ],
    faq: [
      {
        q: 'Can I run both Calendly and CallSesh at the same time during a transition?',
        a: 'Yes. They are independent tools. You can use CallSesh for paid sessions while keeping Calendly for free introductory calls if needed.',
      },
      {
        q: 'Does CallSesh integrate with Google Calendar?',
        a: 'Not currently. Your session schedule is managed within CallSesh. Google Calendar integration is on the roadmap.',
      },
      {
        q: 'Is CallSesh more expensive than Calendly?',
        a: 'A Calendly Teams plan plus Stripe fees plus a Zoom subscription typically costs more than CallSesh Starter plus Stripe. And with CallSesh you get fewer tools to manage.',
      },
      {
        q: 'What if I want to keep offering free discovery calls?',
        a: 'You can set any session type to $0. There is no platform fee on free sessions.',
      },
      {
        q: 'How long does setup take?',
        a: 'Under five minutes. You connect Stripe, set your availability, create a session type, and your booking page is live.',
      },
    ],
    ctaHeading: 'Switch to a tool built for paid coaching sessions',
    ctaBody: 'Set up in under five minutes. First 10 sessions are free.',
    related: [
      { label: 'Calendly alternative for coaches', href: '/alternatives/calendly-alternative-for-coaches' },
      { label: 'Coaching booking software', href: '/coaching-booking-software' },
      { label: 'Coach payment processing', href: '/coach-payment-processing' },
    ],
    contextualNote: {
      prefix: 'Ready to switch? See exactly how CallSesh works as a ',
      linkText: 'Calendly alternative for coaches',
      href: '/alternatives/calendly-alternative-for-coaches',
      suffix: ' — built for paid sessions from the ground up.',
    },
  },

  {
    path: '/for/business-coaches',
    title: 'Software for Business Coaches — CallSesh',
    description:
      'Business coaches need clients to commit before the call starts. CallSesh handles booking, payment, and video for executive coaches, B2B coaches, and strategy advisors.',
    h1: 'Coaching Software for Business Coaches Who Bill for Their Time',
    intro:
      'Business and executive coaches offer high-value, time-intensive services. Every unbooked or unpaid session is a real dollar loss. CallSesh makes your time billable from the first interaction — clients book a strategy call, pay by card, and receive a private video room link. You focus on delivering value, not chasing down payment.',
    forWho: [
      'Executive and leadership coaches running paid engagements',
      'Business strategy coaches billing for advisory sessions',
      'B2B coaches whose clients pay out of pocket or via corporate card',
      'Coaches building a solo advisory practice',
    ],
    problem: {
      heading: 'Time spent on admin is time not spent coaching',
      points: [
        'High-value coaching sessions lost to no-shows or late cancellations are especially costly. Without upfront payment, clients have no financial commitment.',
        'Invoicing after a session creates awkward follow-ups, delayed payment, and occasional disputes — undermining the professional relationship you\'ve built.',
        'Enterprise and corporate clients expect a polished, seamless experience. A booking flow that involves Venmo links or emailed invoices doesn\'t match that expectation.',
      ],
    },
    solution: {
      heading: 'A professional booking experience that respects your time',
      points: [
        'Clients book a session type — strategy call, advisory session, review meeting — and pay by card immediately. The slot is confirmed only after payment.',
        'A branded, professional booking page with your session types and availability. Share a single link on LinkedIn, in email, or on your website.',
        'Video sessions are private and browser-based. No Zoom account required. Clients receive their session link in a confirmation email.',
        'Your full session schedule, client history, and cumulative earnings are all tracked in the CallSesh dashboard.',
      ],
    },
    workflow: [
      { step: 'Define your service offerings', detail: 'Create session types for different engagement formats — 30-min clarity calls, 90-min strategy sessions, or monthly advisory retainer check-ins.' },
      { step: 'Set your availability', detail: 'Block out hours when you\'re available for client sessions. Clients can only book during those windows.' },
      { step: 'Share your booking page', detail: 'Add your CallSesh link to your email signature, LinkedIn profile, or website. Clients click, book, and pay.' },
      { step: 'Show up and deliver', detail: 'Join your session from the dashboard at the scheduled time. The video room opens in your browser.' },
    ],
    faq: [
      {
        q: 'Can I offer different session types for different services?',
        a: 'Yes. Create as many session types as you need — clarity calls, deep dives, strategy sessions — each with its own duration and price.',
      },
      {
        q: 'Can corporate clients pay with a company card?',
        a: 'Yes. Clients enter any valid credit or debit card. Corporate cards work the same as personal cards.',
      },
      {
        q: 'Does CallSesh handle time zones for global clients?',
        a: 'Yes. Your availability is set in your local time zone and displayed in the client\'s local time when they book.',
      },
      {
        q: 'Is the booking page professional enough for enterprise clients?',
        a: 'Yes. The booking experience is clean, card-based, and does not display CallSesh branding prominently. It reads as your professional booking page, not a third-party tool.',
      },
      {
        q: 'What happens if a session needs to be rescheduled?',
        a: 'Currently, rescheduling is handled by reaching out to your client directly. Built-in rescheduling is on the roadmap.',
      },
    ],
    ctaHeading: 'Make your time billable from the first booking',
    ctaBody: 'Set up your coaching page in minutes. First 10 sessions are free.',
    related: [
      { label: 'Booking software for executive coaches', href: '/for/executive-coaches' },
      { label: 'All-in-one coaching platform', href: '/all-in-one-coaching-platform' },
      { label: 'Coaching business software', href: '/coaching-business-software' },
      { label: 'Coach payment processing', href: '/coach-payment-processing' },
    ],
    contextualNote: {
      prefix: 'CallSesh is ',
      linkText: 'software for business coaches',
      href: 'https://callsesh.com',
      suffix: ' — booking, payment, and video in a single professional platform.',
    },
  },

  // ── 10 new SEO pages ──────────────────────────────────────────────────────

  {
    path: '/alternatives/calendly-alternative-for-coaches',
    title: 'Calendly Alternative for Coaches (With Payments + Video Built In)',
    description:
      'Calendly handles scheduling, but not payments or sessions. See how CallSesh replaces your full coaching stack in one platform.',
    h1: 'The Calendly Alternative Coaches Actually Need',
    intro:
      'Calendly is a scheduling tool. It books meetings. But coaching is a paid service that needs upfront payment, a dedicated video room, and a clear client record. CallSesh was built from scratch for coaches who charge for their time — replacing Calendly, Zoom, and Stripe with one booking link.',
    forWho: [
      'Coaches on Calendly who can\'t collect payment reliably',
      'Coaches running a Calendly + Stripe + Zoom stack they want to simplify',
      'Coaches who\'ve lost sessions to unpaid no-shows through free booking tools',
      'New coaches who want an all-in-one setup from day one',
    ],
    problem: {
      heading: 'Why Calendly falls short for paid coaching',
      points: [
        'Calendly was designed for scheduling, not for paid services. Payment collection requires a higher-tier paid plan and manual Stripe configuration — and clients can still book without paying if any step breaks.',
        'There\'s no video room. After a client books, you still need to generate a Zoom or Meet link, attach it to the calendar event, and hope the client finds it. That\'s extra work every single booking.',
        'Scheduling for coaching sessions and scheduling for sales calls are different problems. Calendly optimizes for the latter — round-robins, team routing, lead routing — none of which applies to a solo coaching practice.',
      ],
    },
    solution: {
      heading: 'What CallSesh gives you instead',
      points: [
        'Payment is built into booking. Clients cannot confirm a session without completing card payment — no plan upgrades needed, no webhooks to configure.',
        'Every booking generates a private video room automatically. The client gets the link in their confirmation email. No Zoom required.',
        'One dashboard for your entire practice: availability, session types, past sessions, and earnings. No context switching between tools.',
        'Flat, transparent pricing: 10% platform fee per session. No per-seat fees, no tier locks.',
      ],
    },
    comparison: {
      theyLabel: 'Calendly',
      rows: [
        { feature: 'Upfront payment at booking', them: 'Requires paid plan + manual Stripe setup', us: 'Built in, on by default' },
        { feature: 'Built-in video room', them: 'Not included — bring Zoom or Meet', us: 'Included, browser-based' },
        { feature: 'No-show protection', them: 'Clients can book without paying', us: 'Payment required to confirm slot' },
        { feature: 'Session history & notes', them: 'No', us: 'Yes' },
        { feature: 'Built for paid coaching', them: 'No — general scheduling tool', us: 'Yes' },
      ],
    },
    workflow: [
      { step: 'Create a CallSesh account', detail: 'Sign up, connect Stripe, and set your availability. Takes under five minutes.' },
      { step: 'Define your session types', detail: 'Create session types with names, durations, and prices. Your booking page is live immediately.' },
      { step: 'Share your link wherever you used Calendly', detail: 'One URL. Email, bio, website — wherever clients previously went to book.' },
      { step: 'Clients book, pay, and show up', detail: 'No extra steps for you or your client. Payment, confirmation, and video link all happen automatically.' },
    ],
    faq: [
      {
        q: 'Does CallSesh replace Calendly completely?',
        a: 'For paid coaching sessions, yes. If you also use Calendly for free discovery calls with prospects, you can keep it for that use case and use CallSesh for paid sessions.',
      },
      {
        q: 'How long does the switch take?',
        a: 'Under ten minutes. Create your account, connect Stripe, set your availability, and your booking page is live.',
      },
      {
        q: 'Does CallSesh sync with Google Calendar or iCal?',
        a: 'Not currently. Your schedule lives in CallSesh. Google Calendar sync is on the roadmap.',
      },
      {
        q: 'Is the pricing competitive with Calendly?',
        a: 'A Calendly Teams plan (needed for payment features) plus Stripe fees plus Zoom costs more per month than CallSesh Starter at $19.99/month. With CallSesh you also eliminate Zoom entirely.',
      },
      {
        q: 'Can I keep my Calendly for non-paid sessions?',
        a: 'Yes. They\'re independent. You can use CallSesh for paid coaching and Calendly for free intro calls in parallel.',
      },
    ],
    ctaHeading: 'Switch to a booking tool built for paid coaching',
    ctaBody: 'No credit card required to start. First 10 sessions are free.',
    related: [
      { label: 'Zoom alternative for coaching', href: '/alternatives/zoom-alternative-for-coaching' },
      { label: 'Acuity alternative for coaches', href: '/alternatives/acuity-alternative-for-coaches' },
      { label: 'Complete coaching platform', href: '/all-in-one-coaching-platform' },
      { label: 'Booking software built for paid coaching', href: '/coaching-booking-software' },
    ],
    contextualNote: {
      prefix: 'CallSesh is ',
      linkText: 'all-in-one coaching software',
      href: 'https://callsesh.com',
      suffix: ' that replaces your entire booking and payment stack.',
    },
  },

  {
    path: '/alternatives/zoom-alternative-for-coaching',
    title: 'Zoom Alternative for Coaching (With Booking and Payments Included)',
    description:
      'Zoom doesn\'t handle scheduling or payments. CallSesh lets clients book, pay, and join sessions in one place — no extra tools needed.',
    h1: 'A Zoom Alternative for Coaching With Built-in Booking and Payment',
    intro:
      'Zoom is a general-purpose video tool. It doesn\'t know your clients, doesn\'t collect payment, and doesn\'t connect to your booking system. Every session requires manual coordination: generate a link, attach it to a calendar event, send it, and hope the client shows up. CallSesh removes all of that — a video room is created automatically for every booked, paid session.',
    forWho: [
      'Coaches using Zoom who manually share links for every session',
      'Coaches on a Calendly + Zoom + Stripe stack looking to consolidate',
      'Online coaches who want a seamless, professional client experience',
      'Coaches who\'ve had clients miss sessions because of missing or wrong Zoom links',
    ],
    problem: {
      heading: 'Why Zoom is the wrong tool for coaching',
      points: [
        'Zoom is built for team meetings and webinars, not one-on-one paid sessions. There\'s no built-in booking, no payment layer, and no session history tied to a specific client.',
        'Generating and sharing a Zoom link for every session is repetitive admin. If a link is wrong, the session doesn\'t happen. It\'s a fragile manual process that breaks.',
        'A no-show on Zoom costs you real money — Zoom has no connection to payment, so clients who haven\'t paid have no financial reason to show up.',
        'Clients have to download or update the Zoom app before joining. Every update is a potential source of friction right before a session starts.',
      ],
    },
    solution: {
      heading: 'What CallSesh does differently',
      points: [
        'Every booking automatically creates a private video room. The link is included in the confirmation email the moment payment clears — no manual step required.',
        'Video runs in the browser using Daily.co technology. Clients click a link and the session starts. No app download, no account creation.',
        'Because clients pay at booking, every video session is pre-confirmed and pre-paid. No-shows don\'t mean lost income.',
        'Session history, client records, and video room access all live in one dashboard. Nothing to copy, nothing to coordinate.',
      ],
    },
    comparison: {
      theyLabel: 'Zoom',
      rows: [
        { feature: 'Automatic video room per session', them: 'No — generate and share manually', us: 'Yes — created on booking' },
        { feature: 'Client download required', them: 'Often yes (app or update)', us: 'No — browser-based' },
        { feature: 'Built-in booking', them: 'No', us: 'Yes' },
        { feature: 'Payment at booking', them: 'No', us: 'Yes' },
        { feature: 'Session history per client', them: 'No', us: 'Yes' },
      ],
    },
    workflow: [
      { step: 'Create your coaching page', detail: 'Set your availability, session types, and prices in the CallSesh dashboard.' },
      { step: 'Client books and pays', detail: 'Client selects a slot and pays by card. A private video room is created instantly.' },
      { step: 'Both sides get the link automatically', detail: 'You see it in your dashboard. Client receives it in their confirmation email. No coordination needed.' },
      { step: 'Click to join', detail: 'At session time, click the room link. It opens in the browser. Your client does the same.' },
    ],
    faq: [
      {
        q: 'Does CallSesh use Zoom at all?',
        a: 'No. Video runs on Daily.co, which is purpose-built for real-time video. It\'s browser-based, requires no download, and is more reliable for one-on-one sessions than general conferencing tools.',
      },
      {
        q: 'Can I record sessions?',
        a: 'Recording is not supported currently. It\'s planned for a future release.',
      },
      {
        q: 'What is the video quality?',
        a: 'HD video and audio with Daily.co. Quality depends on participants\' internet connections, as with any video platform.',
      },
      {
        q: 'Do I need a separate Zoom account for anything?',
        a: 'No. Once you\'re using CallSesh, you no longer need Zoom for coaching sessions. Clients join with a single click from their confirmation email.',
      },
      {
        q: 'What if a client has trouble joining?',
        a: 'The session link is in their confirmation email and accessible from their booking confirmation page. Most connection issues resolve by refreshing the browser.',
      },
    ],
    ctaHeading: 'Replace Zoom with a video tool built around your coaching sessions',
    ctaBody: 'Sessions are browser-based, auto-generated, and tied to payment. First 10 free.',
    related: [
      { label: 'Calendly alternative for coaches', href: '/alternatives/calendly-alternative-for-coaches' },
      { label: 'Coaching business software', href: '/coaching-business-software' },
      { label: 'Video coaching platform', href: '/video-coaching-platform' },
    ],
    contextualNote: {
      prefix: 'CallSesh is ',
      linkText: 'video coaching software',
      href: 'https://callsesh.com',
      suffix: ' that automatically creates a private room for every booked session.',
    },
  },

  {
    path: '/alternatives/stripe-alternative-for-coaches',
    title: 'Stripe Alternative for Coaches — CallSesh',
    description:
      'Stop configuring Stripe manually for every coaching tool. CallSesh handles upfront payment collection built into the booking flow — no custom integration required.',
    h1: 'Stop Configuring Stripe by Hand — Built-in Coaching Payments That Work',
    intro:
      'Stripe is excellent payment infrastructure, but it\'s infrastructure — not a finished product. Coaches who use Stripe directly configure a payment link, integrate it with a booking tool, and manually reconcile sessions with payments. CallSesh wraps Stripe into a finished coaching payment flow. Clients pay at booking. Sessions are confirmed automatically. Earnings appear in your dashboard.',
    forWho: [
      'Coaches using raw Stripe payment links disconnected from their booking system',
      'Coaches on Calendly + Stripe who deal with payment confirmation breaking',
      'Coaches who\'ve had sessions booked without payment going through',
      'Coaches who want a clean, professional payment flow without custom configuration',
    ],
    problem: {
      heading: 'The problem with using Stripe directly for coaching',
      points: [
        'A raw Stripe payment link isn\'t connected to your booking flow. Clients can book without paying, or pay without booking — you\'re manually matching sessions to payments.',
        'Calendly\'s Stripe integration requires a paid plan and configuration. When it breaks, clients can hold slots without paying and you won\'t know until the session doesn\'t happen.',
        'Issuing invoices after a session is slow and awkward. Clients who\'ve already received their coaching have less incentive to pay promptly, and following up damages the relationship.',
        'Managing Stripe separately from your booking tool means two dashboards, two fee structures, and more places for something to go wrong.',
      ],
    },
    solution: {
      heading: 'Payments built into the booking flow — no configuration required',
      points: [
        'Clients pay during booking. Slot confirmation is conditional on payment clearing. A session cannot be booked without a completed payment.',
        'Stripe powers the payment processing. You connect a free Stripe account during onboarding — Stripe handles PCI compliance, card processing, and bank payouts.',
        'Your CallSesh dashboard shows session history and earnings. No need to log into Stripe to track what you\'ve made from coaching.',
        'The 10% platform fee and Stripe\'s processing fee are deducted automatically. No manual math, no separate invoices.',
      ],
    },
    comparison: {
      theyLabel: 'Stripe (standalone)',
      rows: [
        { feature: 'Payment tied to booking', them: 'Manual integration required', us: 'Built in, always on' },
        { feature: 'Video room for sessions', them: 'Not included', us: 'Included' },
        { feature: 'Session confirmed on payment', them: 'Manual process', us: 'Automatic' },
        { feature: 'Earnings dashboard', them: 'Stripe dashboard (generic)', us: 'Coaching-specific dashboard' },
        { feature: 'Setup complexity', them: 'High — requires configuration', us: 'Low — connect in 5 minutes' },
      ],
    },
    workflow: [
      { step: 'Connect your Stripe account', detail: 'Link a free Stripe account during CallSesh setup. Stripe handles all payment processing and bank payouts.' },
      { step: 'Set your prices per session type', detail: 'Price your sessions however you like. CallSesh displays your prices on the booking page.' },
      { step: 'Client pays during booking', detail: 'Client selects a slot and enters card details. Payment clears before the session is confirmed.' },
      { step: 'Track earnings in the dashboard', detail: 'See your session history and cumulative earnings in CallSesh. Stripe handles the bank payout on its standard schedule.' },
    ],
    faq: [
      {
        q: 'Do I still need a Stripe account?',
        a: 'Yes. CallSesh uses Stripe for payment processing. You connect a free Stripe account to receive payouts. CallSesh itself does not hold your money.',
      },
      {
        q: 'What fees are involved?',
        a: 'CallSesh charges a 10% platform fee per session. Stripe charges approximately 2.9% + 30¢ per transaction. Both are deducted automatically — no manual math.',
      },
      {
        q: 'When do I get paid?',
        a: 'Stripe follows its standard payout schedule — typically two business days after a session payment is captured. CallSesh doesn\'t control payout timing.',
      },
      {
        q: 'Can I still use Stripe for other things?',
        a: 'Yes. Connecting your Stripe account to CallSesh doesn\'t affect any other Stripe usage. It simply allows CallSesh to process coaching session payments on your behalf.',
      },
      {
        q: 'Is payment data secure?',
        a: 'CallSesh never stores card data. All payment information is handled directly by Stripe, which is PCI Level 1 certified.',
      },
    ],
    ctaHeading: 'Get paid at booking without configuring payment yourself',
    ctaBody: 'Connect Stripe once. Every session is paid before it starts.',
    related: [
      { label: 'One platform for booking, payments, and video', href: '/all-in-one-coaching-platform' },
      { label: 'Simple booking system for coaches', href: '/simple-coaching-booking-system' },
      { label: 'Coach payment processing', href: '/coach-payment-processing' },
    ],
    contextualNote: {
      prefix: 'CallSesh is ',
      linkText: 'coaching payment software',
      href: 'https://callsesh.com',
      suffix: ' that requires payment before every session — no manual invoicing.',
    },
  },

  {
    path: '/all-in-one-coaching-platform',
    title: 'All-in-One Coaching Platform (Booking, Payments, Video in One Tool)',
    description:
      'Stop juggling multiple apps. CallSesh combines scheduling, payments, and video into one platform built for paid coaching sessions.',
    h1: 'All-in-One Coaching Platform: Booking, Payment, and Video in One Link',
    intro:
      'Most coaches run their practice on a patchwork of tools: Calendly for scheduling, Zoom for video, Stripe or PayPal for payments, and a spreadsheet to hold it together. Every additional tool is another subscription, another login, and another place for something to go wrong. CallSesh is a single platform built to replace all of it. One booking link — clients pick a time, pay, and receive their video room.',
    forWho: [
      'Solo coaches replacing a multi-tool stack with one platform',
      'New coaches who want everything set up before their first paid session',
      'Coaches who\'ve had payment or booking integrations break',
      'Coaches paying for Calendly + Zoom + Stripe separately',
    ],
    problem: {
      heading: 'Why a multi-tool stack breaks down over time',
      points: [
        'Each tool you add increases operational overhead. Calendly connects to Stripe only on higher-tier plans, and that integration requires ongoing maintenance. Zoom links have to be generated manually for every session.',
        'When a client has trouble booking or paying, diagnosing the issue across three platforms wastes time. Most coaches can\'t afford to be their own IT department.',
        'Paying for three separate tools adds up. Calendly Teams, Zoom Pro, and Stripe fees combined often exceed what a focused coaching platform costs.',
        'As your practice grows, managing three tools becomes harder, not easier. Scheduling conflicts, missed payments, and wrong video links become more frequent.',
      ],
    },
    solution: {
      heading: 'Everything your coaching practice needs in one place',
      points: [
        'Booking, payment, and video all handled in a single platform. Clients go through one flow and arrive in one video room — nothing disconnected.',
        'Payment is required at booking. Slots are confirmed only when payment clears. No chasing invoices, no unpaid no-shows.',
        'Video rooms are generated automatically for each booking and sent to clients in their confirmation email.',
        'Your dashboard shows your full schedule, client history, and earnings. Nothing is split across external tools.',
      ],
    },
    workflow: [
      { step: 'Sign up and connect Stripe', detail: 'Create your CallSesh account and link a Stripe account for payouts. Takes five minutes.' },
      { step: 'Set your availability and session types', detail: 'Block out your coaching hours and define what sessions you offer, with prices.' },
      { step: 'Share your booking link', detail: 'One URL replaces every separate tool link you\'ve been managing.' },
      { step: 'Run your sessions', detail: 'Clients book, pay, and get their video link automatically. You join from the dashboard at session time.' },
    ],
    faq: [
      {
        q: 'Does CallSesh replace all three tools — Calendly, Zoom, and Stripe?',
        a: 'Yes. CallSesh handles booking (replacing Calendly), video sessions (replacing Zoom), and payment collection (integrated with Stripe). You don\'t need separate subscriptions for any of them.',
      },
      {
        q: 'What does it cost compared to running three separate tools?',
        a: 'CallSesh Starter is $19.99/month with a 10% per-session fee. Calendly Teams ($20+), Zoom Pro ($15.99+), and Stripe transaction fees alone typically exceed this — before factoring in the time saved on admin.',
      },
      {
        q: 'Is the platform ready to use immediately after signup?',
        a: 'Yes. After connecting Stripe and setting your availability, your booking page is live. There are no integrations to configure.',
      },
      {
        q: 'Does it work for coaches who sell packages or retainers?',
        a: 'Currently, CallSesh supports individual session bookings. Package and retainer billing is on the roadmap.',
      },
      {
        q: 'What if I want to keep using Calendly for free calls?',
        a: 'You can. CallSesh and Calendly are independent. Use CallSesh for paid sessions and Calendly for free introductory calls if that\'s your workflow.',
      },
    ],
    ctaHeading: 'Replace your entire coaching tool stack with one platform',
    ctaBody: 'Booking, payment, and video. No integrations needed. First 10 sessions free.',
    related: [
      { label: 'Online coaching platform', href: '/online-coaching-platform' },
      { label: 'Calendly alternative for coaches', href: '/alternatives/calendly-alternative-for-coaches' },
      { label: 'Zoom alternative for coaching', href: '/alternatives/zoom-alternative-for-coaching' },
      { label: 'Coaching scheduling software', href: '/coaching-scheduling-software' },
    ],
    contextualNote: {
      prefix: 'CallSesh is the ',
      linkText: 'all-in-one platform for paid coaching',
      href: 'https://callsesh.com',
      suffix: ' — built to replace Calendly, Zoom, and Stripe.',
    },
  },

  {
    path: '/coaching-business-software',
    title: 'Coaching Business Software to Manage Sessions, Clients, and Payments',
    description:
      'Everything you need to run a coaching business — booking, payments, video, and client history — without switching between tools.',
    h1: 'Coaching Business Software That Handles Booking, Payments, and Video',
    intro:
      'Running a coaching business means more than delivering sessions. It means managing a calendar, collecting payment, sending video links, and staying organized. Every hour spent on that admin is an hour not spent coaching. CallSesh handles the operational layer of your coaching business — so you can focus on the work that actually earns money.',
    forWho: [
      'Coaches building a sustainable paid practice',
      'Coaches who spend too much time on scheduling and invoicing',
      'Coaches transitioning from agency or employed roles to independent coaching',
      'Small coaching businesses looking for a clean, professional client-facing setup',
    ],
    problem: {
      heading: 'The hidden cost of manual coaching admin',
      points: [
        'Scheduling back-and-forth via email or DMs wastes 20–30 minutes per new client before you\'ve even had a session. A booking link solves this, but only if it collects payment too.',
        'Manual invoicing after sessions creates friction: you feel awkward asking for payment, clients delay, and your cash flow becomes unpredictable.',
        'Clients who book without paying have nothing on the line. No-show rates are significantly higher when there\'s no upfront financial commitment.',
        'As client volume grows, managing it manually — across spreadsheets, email threads, and payment apps — becomes unsustainable.',
      ],
    },
    solution: {
      heading: 'The operational layer your coaching business needs',
      points: [
        'Clients book and pay in a single step. Confirmation is automatic, payment is collected upfront, and a video room is created immediately.',
        'Your dashboard is the single source of truth: upcoming sessions, past session notes, and client history — without switching between apps.',
        'No-shows are significantly reduced because clients have already paid. Their financial commitment is made at booking time.',
        'The setup is professional by default. Your booking page looks like a real business, not a DIY scheduling link.',
      ],
    },
    workflow: [
      { step: 'Define your services', detail: 'Create session types with names, durations, and prices. Think of this as building your service menu.' },
      { step: 'Set your availability', detail: 'Block the hours you coach. Clients can only book during those windows.' },
      { step: 'Publish your booking link', detail: 'Share one URL in your email signature, on LinkedIn, or on your website. That\'s your coaching business front door.' },
      { step: 'Manage clients from the dashboard', detail: 'See upcoming and past sessions, access client notes, and track your earnings without leaving CallSesh.' },
    ],
    faq: [
      {
        q: 'Is CallSesh just for solopreneurs, or can it support a small team?',
        a: 'Currently, CallSesh is optimized for individual coaches. Multi-coach support is on the roadmap.',
      },
      {
        q: 'Can I add session notes to client records?',
        a: 'Yes. After a session, you can add notes to the client\'s record in the dashboard. These persist across all sessions with that client.',
      },
      {
        q: 'Does CallSesh help with client retention?',
        a: 'By making the booking process seamless and professional, CallSesh reduces friction for returning clients. Rebooking is straightforward from the same booking link.',
      },
      {
        q: 'What do clients see on the booking page?',
        a: 'Your session types, availability calendar, and a payment form. The experience is clean and simple — no distractions.',
      },
      {
        q: 'Can I use this alongside my current setup while transitioning?',
        a: 'Yes. You can run CallSesh in parallel with whatever you\'re using today. Switch clients to your CallSesh link at your own pace.',
      },
    ],
    ctaHeading: 'Run your coaching business from one dashboard',
    ctaBody: 'Booking, payment, client notes, and video. No spreadsheets required.',
    related: [
      { label: 'Coaching client management software', href: '/coaching-client-management-software' },
      { label: 'One platform for all coaching tools', href: '/all-in-one-coaching-platform' },
      { label: 'Tools for coaching business', href: '/tools-for-coaching-business' },
      { label: 'Coaching booking software', href: '/coaching-booking-software' },
    ],
    contextualNote: {
      prefix: 'CallSesh is ',
      linkText: 'coaching business software',
      href: 'https://callsesh.com',
      suffix: ' built specifically for coaches who charge for their time.',
    },
  },

  {
    path: '/tools-for-coaching-business',
    title: 'Tools You Actually Need for a Coaching Business — CallSesh',
    description:
      'Most coaches over-complicate their tool stack. Here are the tools a coaching business actually needs — and how CallSesh replaces most of them with one platform.',
    h1: 'Tools You Actually Need for a Coaching Business (And What to Skip)',
    intro:
      'Coaches are often told they need a CRM, an email marketing platform, a course tool, a scheduling app, a video platform, a payment processor, and a website builder — before they\'ve earned their first dollar. Most of that advice is wrong. A coaching business needs exactly three things to operate: a way for clients to book, a way to collect payment, and a way to deliver sessions. Everything else is optional.',
    forWho: [
      'New coaches figuring out what tools to start with',
      'Coaches auditing their current stack and looking to cut costs',
      'Coaches paying for software they rarely use',
      'Coaches who want to focus on coaching, not software management',
    ],
    problem: {
      heading: 'The problem with over-engineering your coaching stack',
      points: [
        'Tool bloat is expensive. A typical coach running Calendly + Zoom + Stripe + an email tool spends $60–100/month on software before earning a single dollar from a new client.',
        'Too many tools means too many logins, too many integrations to maintain, and too many ways for something to break during a client\'s booking experience.',
        'Most recommended "coaching tools" are designed for larger businesses with marketing teams. A solo practice doesn\'t need most of that functionality.',
        'Time spent evaluating, configuring, and maintaining tools is time not spent with clients. The return on that time is often negative.',
      ],
    },
    solution: {
      heading: 'The minimal, effective coaching tool stack',
      points: [
        'A booking tool that collects payment upfront. Not just any booking tool — one where payment is required to confirm the slot. This is the most important feature.',
        'A video platform that auto-generates session links. Not Zoom with manual link management — a tool where every booking automatically creates a private room.',
        'A client record system. At minimum, session notes tied to client history.',
        'Everything else — email marketing, course platforms, group coaching tools — is optional until you have the core covered and revenue to support it.',
      ],
    },
    workflow: [
      { step: 'Start with booking and payment', detail: 'Get a CallSesh account. This covers booking, payment, and video in one product. That\'s your core stack.' },
      { step: 'Add a simple website when you\'re ready', detail: 'A one-page site with your bio and a link to your CallSesh booking page is all most coaches need initially.' },
      { step: 'Use email for direct outreach, not automation', detail: 'Direct outreach to potential clients works. Complex email sequences can wait until you have consistent inbound.' },
      { step: 'Add tools only when revenue justifies them', detail: 'A specific, revenue-generating need should drive every new tool purchase. Don\'t buy tools for problems you don\'t have yet.' },
    ],
    faq: [
      {
        q: 'Do I need a website before I can start coaching?',
        a: 'No. A CallSesh booking link works without a website. Share it via email, LinkedIn, or direct message. Add a website once you have consistent bookings.',
      },
      {
        q: 'Do I need a CRM?',
        a: 'Not at first. CallSesh stores basic client records and session history. A dedicated CRM becomes useful if you have more clients than you can track manually — typically 30+ active clients.',
      },
      {
        q: 'Do I need email marketing software?',
        a: 'Not initially. Direct outreach and a booking link are more effective for early-stage coaches than newsletters or automation sequences.',
      },
      {
        q: 'What\'s the minimum viable coaching setup?',
        a: 'A CallSesh account (covering booking, payment, and video), a way to collect testimonials, and a link to share. That\'s it.',
      },
      {
        q: 'When should I invest in more sophisticated tools?',
        a: 'When your current process has a specific bottleneck that software would fix. Don\'t buy tools in anticipation of problems you don\'t have yet.',
      },
    ],
    ctaHeading: 'Start with the tools you actually need',
    ctaBody: 'CallSesh covers booking, payment, and video in one product. First 10 sessions free.',
    related: [
      { label: 'Coaching business software', href: '/coaching-business-software' },
      { label: 'Simple coaching booking system', href: '/simple-coaching-booking-system' },
      { label: 'Scheduling and payment software for coaches', href: '/coaching-booking-software' },
    ],
    contextualNote: {
      prefix: 'CallSesh is ',
      linkText: 'coaching platform software',
      href: 'https://callsesh.com',
      suffix: ' that covers booking, payment, and video — the three core tools in one product.',
    },
  },

  {
    path: '/for/life-coaches',
    title: 'Booking Software for Life Coaches (Get Paid Before Every Session)',
    description:
      'Simple booking software built for life coaches. Let clients schedule, pay, and join sessions without back-and-forth or missed payments.',
    h1: 'Booking Software for Life Coaches That Collects Payment Before Every Session',
    intro:
      'Life coaching is built on trust and transformation — but the business side of it needs to run like a real business. That means clients pay before sessions, not after. It means showing up to coach, not spending your prep time copying Zoom links and chasing invoices. CallSesh gives life coaches a booking page that handles payment, confirmation, and video in a single client flow.',
    forWho: [
      'Life coaches starting to charge for their sessions',
      'Life coaches currently booking through email or social media DMs',
      'Life coaches on Calendly who need integrated payment',
      'Life coaches offering remote sessions who want a clean video experience',
    ],
    problem: {
      heading: 'What breaks down when life coaches use generic booking tools',
      points: [
        'Generic scheduling tools like Calendly were designed for B2B teams. Adding payment requires a higher plan and fragile integrations — and clients can still book without paying if anything breaks.',
        'Collecting payment after a session puts you in a difficult position. Following up on unpaid invoices feels wrong in a coaching relationship built on trust.',
        'Coordinating a Zoom link separately from your booking confirmation creates extra admin before every session and increases the chance of something going wrong.',
        'No-shows from clients who haven\'t paid cost life coaches real income and real time slots they could have filled.',
      ],
    },
    solution: {
      heading: 'A booking page built around the paid life coaching flow',
      points: [
        'Clients book and pay in a single step. The session slot is held only after payment clears — no unpaid bookings.',
        'A private video room is created automatically for each booking. The link arrives in the client\'s confirmation email. You don\'t generate or share it manually.',
        'Upcoming sessions, past client notes, and session history all live in your CallSesh dashboard.',
        'The setup takes under five minutes. Share your booking link on social profiles, in your email signature, or on your website.',
      ],
    },
    workflow: [
      { step: 'Create your session types', detail: 'Set up your 1-on-1 life coaching sessions with duration and price. Add a brief description so clients know what to expect.' },
      { step: 'Set your availability', detail: 'Define your coaching hours. Clients can only book during those windows.' },
      { step: 'Share your link', detail: 'Add your CallSesh booking URL to your Instagram bio, LinkedIn, email signature, or website.' },
      { step: 'Coach, not admin', detail: 'Confirmation emails, video links, and payment are all handled automatically. You show up and focus on your client.' },
    ],
    faq: [
      {
        q: 'Can I offer free discovery calls through CallSesh?',
        a: 'Yes. Set any session type to $0. There\'s no platform fee on free sessions, so discovery calls cost nothing.',
      },
      {
        q: 'What if a client needs to reschedule?',
        a: 'Currently, rescheduling is handled by reaching out to the client directly. Built-in rescheduling is planned for a future update.',
      },
      {
        q: 'Can I sell session packages?',
        a: 'Not currently. Package and bundle billing is on the roadmap. Individual session bookings are supported today.',
      },
      {
        q: 'Is the video quality good enough for sensitive coaching conversations?',
        a: 'Yes. Sessions run on Daily.co with HD video and audio. The browser-based experience is stable, private, and distraction-free.',
      },
      {
        q: 'What do clients need to join a session?',
        a: 'Just a browser. Clients click the link in their confirmation email. No app download, no account creation.',
      },
    ],
    ctaHeading: 'Set up your life coaching booking page in under five minutes',
    ctaBody: 'Clients book, pay, and join your session in one flow. First 10 sessions free.',
    related: [
      { label: 'Simple coaching booking system', href: '/simple-coaching-booking-system' },
      { label: 'Booking software for health coaches', href: '/for/health-coaches' },
      { label: 'Tools for coaching business', href: '/tools-for-coaching-business' },
      { label: 'Booking software for fitness coaches', href: '/for/fitness-coaches' },
    ],
    contextualNote: {
      prefix: 'CallSesh is ',
      linkText: 'booking software for life coaches',
      href: 'https://callsesh.com',
      suffix: ' — payment required, video included, no integrations needed.',
    },
  },

  {
    path: '/for/fitness-coaches',
    title: 'Booking Software for Fitness Coaches — CallSesh',
    description:
      'CallSesh is booking software for fitness coaches who run paid 1-on-1 online sessions. Clients book, pay upfront, and join a private video room — no Zoom or Calendly needed.',
    h1: 'Booking Software for Fitness Coaches Running Online 1-on-1 Sessions',
    intro:
      'Online fitness coaching requires structure: a consistent schedule, clients who show up, and sessions that start on time with payment already sorted. Generic tools add friction to all of this. CallSesh is designed for fitness coaches who run paid remote sessions — booking, payment, and video in a single client-facing link.',
    forWho: [
      'Fitness coaches transitioning from in-person to online sessions',
      'Personal trainers running virtual training who want something purpose-built',
      'Fitness coaches who deal with no-shows from unpaid bookings',
      'Health and wellness coaches charging hourly for nutrition, training, or habit coaching',
    ],
    problem: {
      heading: 'Why generic tools don\'t work well for fitness coaches',
      points: [
        'Fitness coaching is high-frequency. You book multiple sessions per client per week. Manually managing this through email or a generic scheduler wastes time that should go toward programming and client prep.',
        'No-shows are especially costly for fitness coaches with packed schedules. Without upfront payment, clients can cancel last-minute — and you lose that slot.',
        'Most scheduling tools treat all sessions the same. Fitness coaches often need different types — training, nutrition consults, program reviews — each with different durations and prices.',
        'Managing Zoom links, Calendly bookings, and Stripe payments as three separate flows creates more admin than the work of coaching itself.',
      ],
    },
    solution: {
      heading: 'A booking flow built for repeat, paid fitness sessions',
      points: [
        'Create different session types for training, nutrition, or assessment sessions — each with its own duration and price.',
        'Clients pay when they book. No-shows don\'t cost you income because payment was already collected.',
        'Video is browser-based. No update prompts, no app installs. Clients join from their phone or laptop with one click.',
        'Session history with each client is tracked in the dashboard. You can see how many sessions they\'ve had and access your session notes.',
      ],
    },
    workflow: [
      { step: 'Create session types for each service', detail: 'Online training session, nutrition consult, program review — each as a separate bookable type with its own price and duration.' },
      { step: 'Block your training hours', detail: 'Set your weekly availability in the dashboard. Clients book into those slots directly.' },
      { step: 'Share your booking link', detail: 'Send it to clients, add it to your Instagram bio, or link to it from your website.' },
      { step: 'Coach remotely without the admin', detail: 'Every booking generates a video room automatically. You join at session time and focus on your client.' },
    ],
    faq: [
      {
        q: 'Can I offer different session lengths for different clients?',
        a: 'Yes. Create multiple session types — a 30-minute check-in and a 60-minute training session can both be available on the same booking page.',
      },
      {
        q: 'Can I handle recurring weekly clients?',
        a: 'Clients can book individual sessions at their preferred frequency. Recurring subscription-based bookings are on the roadmap.',
      },
      {
        q: 'Is the video good enough for demonstrating exercises?',
        a: 'HD video via Daily.co, browser-based. Quality is good for demonstration, especially on a strong wifi connection.',
      },
      {
        q: 'Can clients pay with an HSA or FSA card?',
        a: 'CallSesh accepts all major credit and debit cards via Stripe. HSA and FSA cards work if they carry a Visa or Mastercard logo.',
      },
      {
        q: 'What if a client no-shows?',
        a: 'Payment was collected at booking, so you\'re compensated regardless. You can choose to offer a reschedule at your discretion.',
      },
    ],
    ctaHeading: 'Set up your fitness coaching booking page today',
    ctaBody: 'Clients book, pay, and join your session automatically. First 10 sessions free.',
    related: [
      { label: 'Simple booking system for coaches', href: '/simple-coaching-booking-system' },
      { label: 'Booking software for health coaches', href: '/for/health-coaches' },
      { label: 'Booking software for life coaches', href: '/for/life-coaches' },
      { label: 'Online session booking software', href: '/coaching-booking-software' },
    ],
    contextualNote: {
      prefix: 'CallSesh is ',
      linkText: 'online fitness coaching software',
      href: 'https://callsesh.com',
      suffix: ' that handles booking, payment, and video in one link.',
    },
  },

  {
    path: '/simple-coaching-booking-system',
    title: 'Simple Coaching Booking System — CallSesh',
    description:
      'CallSesh is a simple coaching booking system that requires payment at booking and automatically creates a video room for each session. No complex setup required.',
    h1: 'A Simple Coaching Booking System That Handles Payment and Video Too',
    intro:
      'The ideal coaching booking system does one thing well: gets a paying client into a session with minimal friction on both sides. The client picks a time, pays, and gets their video link — all in one step. You don\'t generate links, chase invoices, or reconcile bookings with payments. CallSesh is that system.',
    forWho: [
      'Coaches who want a booking system that doesn\'t require a technology background to set up',
      'Coaches currently managing bookings through DMs, emails, or spreadsheets',
      'Coaches who tried other tools and found them too complex or too expensive',
      'Coaches who want to be operational today, not in two weeks',
    ],
    problem: {
      heading: 'Why coaching booking tools become complicated fast',
      points: [
        'Most booking tools were built for enterprise teams and then adapted for individual coaches. The result is far more features than needed and a configuration process that takes hours.',
        'Connecting a booking tool to a payment processor to a video platform requires reading documentation, generating API keys, and testing integrations. This is work a coach shouldn\'t have to do.',
        'Many tools lock key features — like payment collection — behind expensive higher-tier plans. The free version books meetings; the paid version books paid meetings.',
        'Configuration complexity means the setup never quite gets done. Coaches continue booking manually because finishing the tool setup keeps getting pushed to "next week."',
      ],
    },
    solution: {
      heading: 'Simple by design — ready in five minutes',
      points: [
        'Sign up, connect Stripe, set your availability. Your booking page is live. There are no integrations to configure.',
        'Clients pick a time slot, enter card details, and receive a confirmation email with their video room link. The whole flow takes under two minutes on their end.',
        'You don\'t configure anything for video. Every booking automatically creates a private room. The link appears in your dashboard at session time.',
        'One subscription covers everything. No piecing together three tools or managing separate billing accounts.',
      ],
    },
    workflow: [
      { step: 'Create your account', detail: 'Sign up at CallSesh. Takes two minutes.' },
      { step: 'Connect Stripe and set your availability', detail: 'Link your Stripe account for payouts. Block your available hours for coaching.' },
      { step: 'Add a session type', detail: 'Give your session a name, set the duration, and set the price. Your booking page is now live.' },
      { step: 'Share the link and coach', detail: 'Send your URL to your first client. They book, pay, and get their video link. You show up.' },
    ],
    faq: [
      {
        q: 'How long does setup actually take?',
        a: 'Under five minutes for a functional booking page. Connecting Stripe, setting availability, and creating a session type each take under two minutes individually.',
      },
      {
        q: 'Do I need a website to use CallSesh?',
        a: 'No. Your CallSesh booking page is a standalone URL. Share it directly without any other web presence.',
      },
      {
        q: 'What if I offer multiple types of sessions?',
        a: 'You can create multiple session types on a single booking page. Clients choose the type when they book.',
      },
      {
        q: 'Is there a free version?',
        a: 'Yes. Your first 10 sessions are free with no subscription required. After that, Starter is $19.99/month for up to 40 sessions per month.',
      },
      {
        q: 'Can I add this to my website later?',
        a: 'Yes. You can link to your booking page from anywhere — a website button, email signature, or social bio. The URL stays the same.',
      },
    ],
    ctaHeading: 'Get your coaching booking system running today',
    ctaBody: 'Five minutes from signup to your first live booking page. First 10 sessions free.',
    related: [
      { label: 'Booking software for life coaches', href: '/for/life-coaches' },
      { label: 'Booking software for fitness coaches', href: '/for/fitness-coaches' },
      { label: 'Full-featured coaching platform', href: '/all-in-one-coaching-platform' },
    ],
    contextualNote: {
      prefix: 'CallSesh is the ',
      linkText: 'simplest coaching booking system',
      href: 'https://callsesh.com',
      suffix: ' that connects scheduling, payment, and video in one link.',
    },
  },

  {
    path: '/coaching-scheduling-software',
    title: 'Coaching Scheduling Software — Set Your Hours, Let Clients Book | CallSesh',
    description:
      'Stop coordinating session times by email. Set your availability once and let clients self-schedule into paid slots. Coaching scheduling software with built-in payment and video.',
    h1: 'Coaching Scheduling Software That Eliminates Calendar Back-and-Forth',
    intro:
      'Managing your coaching schedule shouldn\'t require email threads, time zone math, or chasing clients to confirm. Coaching scheduling software lets you set your availability once — clients pick a slot that works for them, pay upfront, and receive a video room link automatically. No calendar ping-pong. No unpaid bookings. No manual coordination.',
    forWho: [
      'Coaches spending 20+ minutes per new client just coordinating a session time',
      'Coaches dealing with time zone confusion and accidental double bookings',
      'Coaches on Calendly who need payment built directly into the scheduling flow',
      'Coaches who want client-facing scheduling that also handles video and reminders',
    ],
    problem: {
      heading: 'Why manual session scheduling doesn\'t scale',
      points: [
        'Coordinating times via email or DM with every new client wastes 15–30 minutes per booking. A scheduling link solves this — but only if payment is collected at the same time, or clients can hold slots without committing.',
        'Time zone errors are common when coaches and clients are in different regions. Without automatic timezone display, clients show up at the wrong time — or not at all.',
        'Generic scheduling tools don\'t enforce payment. A client books a slot, something comes up, and they cancel last-minute with nothing on the line. You lose that hour with no compensation.',
        'Managing a coaching calendar, a payment processor, and a video tool as three separate flows means three places to check before every session.',
      ],
    },
    solution: {
      heading: 'Set your schedule once — clients book, pay, and confirm automatically',
      points: [
        'Define your weekly coaching hours in the dashboard. Clients see only the slots you\'ve opened, displayed in their own timezone automatically.',
        'Payment is required at the time of scheduling. Confirmed sessions are paid sessions — no unpaid gaps in your calendar.',
        'Session confirmation emails go to both coach and client the moment payment clears, including the private video room link. No reminders to send manually.',
        'Manage everything from a single dashboard: upcoming sessions, client history, and earnings. Nothing split across external tools.',
      ],
    },
    comparison: {
      theyLabel: 'Generic Scheduling Software',
      rows: [
        { feature: 'Payment at scheduling', them: 'Requires add-on or integration', us: 'Built in by default' },
        { feature: 'Automatic video room', them: 'No — use Zoom separately', us: 'Yes — created per booking' },
        { feature: 'Timezone display for clients', them: 'Varies by tool', us: 'Yes, automatic' },
        { feature: 'No-show protection', them: 'None — free bookings allowed', us: 'Payment required to confirm' },
        { feature: 'Session history per client', them: 'No', us: 'Yes' },
        { feature: 'Purpose-built for paid coaching', them: 'No — general use', us: 'Yes' },
      ],
    },
    workflow: [
      { step: 'Set your weekly coaching hours', detail: 'Define which days and hours clients can schedule. Closed hours are automatically blocked — no double bookings.' },
      { step: 'Create your session types', detail: 'Name your session, set the duration (30, 60, or 90 min), and set your price. Multiple types can appear on one booking page.' },
      { step: 'Share your scheduling link', detail: 'Send your CallSesh URL anywhere. Clients pick a slot in their local timezone — no time zone math on either side.' },
      { step: 'Clients pay and confirm', detail: 'Slots are held only after payment clears. The confirmed session appears in your dashboard immediately with the video link ready.' },
    ],
    faq: [
      {
        q: 'How does the scheduling handle different time zones?',
        a: 'Your availability is defined in your local timezone. When clients open your booking page, times are automatically displayed in their local timezone. No manual adjustment needed on either side.',
      },
      {
        q: 'Can I block off time for other commitments?',
        a: 'Yes. Your availability windows are set by you — hours you are not available simply aren\'t shown to clients. You can update availability from the dashboard at any time.',
      },
      {
        q: 'What happens when a time slot fills up?',
        a: 'Once a slot is booked, it disappears from the client-facing calendar automatically. No double bookings.',
      },
      {
        q: 'Does CallSesh send session reminders?',
        a: 'Clients receive a confirmation email with their video room link immediately when they book. Automated pre-session reminders are planned for a future update.',
      },
      {
        q: 'Can I offer multiple session types at different lengths and prices?',
        a: 'Yes. Create as many session types as you need — a 30-minute check-in and a 90-minute deep dive can both appear on the same booking page, each with their own price.',
      },
      {
        q: 'How is this different from general coaching booking software?',
        a: 'The focus here is on the scheduling and calendar layer specifically: availability management, self-booking, and timezone handling. CallSesh also handles payment and video in the same flow — but the scheduling piece is what eliminates the back-and-forth.',
      },
    ],
    ctaHeading: 'Stop coordinating times by email — let your schedule do it',
    ctaBody: 'Set your coaching hours once. Clients book the slots that work for them and pay upfront.',
    related: [
      { label: 'Coaching booking software', href: '/coaching-booking-software' },
      { label: 'Coaching session software', href: '/coaching-session-software' },
      { label: 'All-in-one coaching platform', href: '/all-in-one-coaching-platform' },
      { label: 'Calendly alternative for coaches', href: '/alternatives/calendly-alternative-for-coaches' },
    ],
    contextualNote: {
      prefix: 'CallSesh also handles ',
      linkText: 'coach payment processing',
      href: '/coach-payment-processing',
      suffix: ' — payment is collected at scheduling time, not after the session.',
    },
  },

  {
    path: '/alternatives/acuity-alternative-for-coaches',
    title: 'Acuity Scheduling Alternative for Coaches — Built-in Payment and Video | CallSesh',
    description:
      'Acuity Scheduling handles appointments but lacks built-in video for coaching sessions. CallSesh adds payment-at-booking and automatic video rooms in a single coaching platform.',
    h1: 'The Acuity Scheduling Alternative Built for Paid Coaching Sessions',
    intro:
      'Acuity Scheduling is capable appointment software with solid calendar management and payment options. For coaches running paid 1-on-1 sessions, though, there are still gaps: payment at booking requires configuration, there is no built-in video room, and client session history lives separately from your scheduling tool. CallSesh is built specifically for paid coaching — scheduling, payment, and video in one booking link, with no integration work required.',
    forWho: [
      'Coaches using Acuity who still manage Zoom links separately for every session',
      'Coaches on Acuity who want payment enforced at booking without manual configuration',
      'Coaches comparing scheduling tools before committing to a multi-tool setup',
      'New coaches who want everything in one place from day one',
    ],
    problem: {
      heading: 'Where Acuity Scheduling falls short for paid coaching',
      points: [
        'Acuity can collect payment at booking, but it requires configuration through intake forms and payment step settings. Mistakes in that setup let bookings through unpaid — and you may not know until the session is about to start.',
        'There is no built-in video room. After a client books through Acuity, you still need to generate a Zoom or Google Meet link, attach it to the confirmation email, and repeat that process for every single session.',
        'Acuity is general-purpose appointment software built for salons, photographers, and service businesses broadly. The coaching session workflow — paid slot, private video, session notes, client history — is not what it was designed for.',
      ],
    },
    solution: {
      heading: 'One booking link — scheduling, payment, and video handled automatically',
      points: [
        'Payment is required at booking by default. Clients cannot hold a session slot without completing card payment. No configuration, no optional payment forms — this is how the product works out of the box.',
        'Every booking automatically generates a private video room. The room link is sent to the client in their confirmation email. No Zoom account, no manual link generation, no extra steps.',
        'Your entire coaching schedule — availability, session types, client history, session notes, and earnings — lives in one dashboard. No context switching between tools.',
        'Flat, transparent pricing: 10% platform fee per session. No per-seat fees, no tier locks to unlock key features.',
      ],
    },
    comparison: {
      theyLabel: 'Acuity Scheduling',
      rows: [
        { feature: 'Payment required at booking', them: 'Optional — requires configuration', us: 'On by default, always enforced' },
        { feature: 'Built-in video room', them: 'No — use Zoom or Meet', us: 'Yes — created per booking' },
        { feature: 'No-show protection', them: 'Depends on payment setup', us: 'Payment required to confirm slot' },
        { feature: 'Session notes per client', them: 'No', us: 'Yes' },
        { feature: 'Purpose-built for paid coaching', them: 'No — general appointments', us: 'Yes' },
      ],
    },
    workflow: [
      { step: 'Create your CallSesh account', detail: 'Sign up, connect Stripe, and set your availability. Under five minutes.' },
      { step: 'Define your session types', detail: 'Create 1-on-1 coaching sessions with names, durations, and prices. Your booking page goes live immediately.' },
      { step: 'Share your link', detail: 'One URL for scheduling, payment, and video. Replace your Acuity link wherever you\'ve shared it.' },
      { step: 'Clients book, pay, and show up', detail: 'Payment clears, a video room is created, and confirmation is sent automatically. No follow-up required on your end.' },
    ],
    faq: [
      {
        q: 'Does Acuity require payment at booking?',
        a: 'Acuity can collect payment at booking, but it is configured through intake forms and payment step settings rather than enforced by default. In CallSesh, payment is the booking — the slot does not confirm until the card clears, with no setup required.',
      },
      {
        q: 'How long does switching from Acuity take?',
        a: 'Under ten minutes. Create your CallSesh account, connect Stripe, set your availability, and create your first session type. Your booking page is live immediately.',
      },
      {
        q: 'Can I keep Acuity for non-coaching bookings?',
        a: 'Yes. They are independent platforms. If you use Acuity for other service types, you can keep it running while switching coaching sessions to CallSesh.',
      },
      {
        q: 'Does CallSesh support intake forms?',
        a: 'Not currently. Session types, pricing, and a simple booking flow are supported. Intake form support is on the roadmap.',
      },
      {
        q: 'What about calendar sync?',
        a: 'CallSesh manages your coaching schedule internally. Google Calendar sync is on the roadmap.',
      },
    ],
    ctaHeading: 'Switch to a booking tool built specifically for paid coaching',
    ctaBody: 'Scheduling, payment, and video in one link. First 10 sessions free.',
    related: [
      { label: 'Calendly alternative for coaches', href: '/alternatives/calendly-alternative-for-coaches' },
      { label: 'Practice.do alternative for coaches', href: '/alternatives/practice-alternative-for-coaches' },
      { label: 'Coaching booking software', href: '/coaching-booking-software' },
      { label: 'Coach payment processing', href: '/coach-payment-processing' },
    ],
    contextualNote: {
      prefix: 'See how CallSesh compares to other tools in the ',
      linkText: 'coaching software alternatives',
      href: '/alternatives',
      suffix: ' overview.',
    },
  },

  {
    path: '/for/health-coaches',
    title: 'Booking Software for Health Coaches — CallSesh',
    description:
      'Simple booking software for health coaches who run paid 1-on-1 sessions. Let clients schedule, pay upfront, and join video sessions without back-and-forth coordination.',
    h1: 'Booking Software for Health Coaches Running Paid Online Sessions',
    intro:
      'Health coaching is relationship-driven work — accountability check-ins, nutrition reviews, habit-building sessions, and progress calls. The business side of it should stay out of the way. That means clients who book their own slots, pay before sessions start, and can join a video call without downloading anything. CallSesh gives health coaches a booking page that handles scheduling, payment, and video in one client-facing link.',
    forWho: [
      'Health and wellness coaches transitioning to paid online 1-on-1 sessions',
      'Nutrition coaches and lifestyle coaches booking check-ins and consults',
      'Health coaches currently coordinating sessions through email or DMs',
      'Coaches who want clients to pay upfront without sending invoices after the fact',
    ],
    problem: {
      heading: 'Why generic booking tools add friction to health coaching sessions',
      points: [
        'Coordinating session times via email or social media DMs is slow and unprofessional. Generic scheduling links solve part of this — but only if they also collect payment, otherwise clients book with no financial commitment.',
        'Invoicing after a session is especially awkward in health coaching. The relationship is built on trust and accountability — following up on a late invoice undermines both.',
        'Most scheduling tools require a separate Zoom setup for every session. Generating and sharing links manually adds admin before every call and increases the chance something goes wrong right before you start.',
        'Without upfront payment, no-shows and last-minute cancellations cost health coaches income and calendar slots that could have gone to committed clients.',
      ],
    },
    solution: {
      heading: 'A booking page that handles scheduling, payment, and video for health coaches',
      points: [
        'Clients book and pay in a single step. The session slot is confirmed only after payment clears — no unpaid bookings, no invoices to send.',
        'A private video room is created automatically for every booking. Clients receive the link in their confirmation email and join with one click from any browser — no app required.',
        'Set up different session types for different engagements: initial consultations, weekly check-ins, nutrition reviews, or accountability calls — each with its own duration and price.',
        'Upcoming sessions, past client notes, and session history are all tracked in the CallSesh dashboard.',
      ],
    },
    workflow: [
      { step: 'Create your session types', detail: 'Set up session types for the services you offer — initial consults, weekly check-ins, or accountability calls. Each gets its own price and duration.' },
      { step: 'Set your coaching hours', detail: 'Block your available hours in the dashboard. Clients book directly into open slots in their own timezone.' },
      { step: 'Share your booking link', detail: 'Add your CallSesh URL to your website, Instagram bio, or email signature.' },
      { step: 'Coach without the admin', detail: 'Payment, confirmation, and video room are all handled automatically. Show up and focus on your client.' },
    ],
    faq: [
      {
        q: 'Is CallSesh suitable for health coaching conversations?',
        a: 'CallSesh uses browser-based video powered by Daily.co, which runs over encrypted connections. It is designed for coaching conversations, not medical treatment or clinical care. It is not a HIPAA-compliant medical platform.',
      },
      {
        q: 'Can I offer free discovery calls through CallSesh?',
        a: 'Yes. Set any session type to $0 and there is no platform fee on free sessions. Discovery calls work alongside paid session types on the same booking page.',
      },
      {
        q: 'Can I create different session types for different services?',
        a: 'Yes. Create as many session types as you need — a 30-minute check-in and a 60-minute initial consultation can both be available on the same booking page with their own prices.',
      },
      {
        q: 'What do clients need to join a session?',
        a: 'Just a browser. No app download, no account creation. Clients click the link in their confirmation email and the video room opens.',
      },
      {
        q: 'Can I add session notes for each client?',
        a: 'Yes. After a session, you can add notes to the client\'s record in the dashboard. Notes are tied to that client and persist across all sessions.',
      },
    ],
    ctaHeading: 'Set up your health coaching booking page today',
    ctaBody: 'Clients book, pay, and join your session in one flow. First 10 sessions free.',
    related: [
      { label: 'Booking software for life coaches', href: '/for/life-coaches' },
      { label: 'Booking software for fitness coaches', href: '/for/fitness-coaches' },
      { label: 'Simple coaching booking system', href: '/simple-coaching-booking-system' },
    ],
    contextualNote: {
      prefix: 'CallSesh is ',
      linkText: 'booking software for coaches',
      href: '/for',
      suffix: ' of all types — health, life, fitness, and business.',
    },
  },

  {
    path: '/alternatives/practice-alternative-for-coaches',
    title: 'Practice.do Alternative for Coaches — Built-in Video and Upfront Payment | CallSesh',
    description:
      'Practice.do is a full coaching CRM. If your priority is paid session booking with built-in video and no admin overhead, CallSesh is a more focused alternative.',
    h1: 'A Practice.do Alternative Built Around Paid Session Delivery',
    intro:
      'Practice.do is coaching-specific software with a broad feature set: client portals, contracts, intake forms, and CRM-style client management. That depth is genuinely useful for coaches who need all of it. But if what you need most is a clean way for clients to book, pay upfront, and join a video call — Practice is more complex than the job requires, and still lacks built-in video. CallSesh focuses on exactly that workflow: one booking link, payment required at booking, private video room created automatically.',
    forWho: [
      'Coaches evaluating Practice.do who primarily need booking, payment, and video',
      "Coaches who find Practice's feature set broader than their current needs",
      'Coaches who want clients booking and paying in a single step without form-heavy onboarding',
      'New coaches who want a focused, low-overhead tool to start taking paid sessions today',
    ],
    problem: {
      heading: 'When a full coaching CRM is more than you need right now',
      points: [
        "Practice.do covers contracts, intake forms, client portals, resource libraries, and CRM-style notes. If you're running a high-volume practice with ongoing client engagements, that depth is valuable. If you're focused on booking and delivering paid sessions, it's overhead.",
        'Practice.do does not include built-in video. Coaching sessions still run through Zoom or another conferencing tool — meaning you generate and share links manually, separately from each booking.',
        "The fuller the feature set, the longer the configuration process. Getting Practice.do set up for your specific workflow — intake forms, packages, payment settings — takes meaningful time before your first session.",
        'Practice.do pricing combined with a separate Zoom subscription can exceed what a simpler, more focused platform charges.',
      ],
    },
    solution: {
      heading: 'Booking, payment, and video — without the CRM overhead',
      points: [
        'CallSesh is purpose-built for paid session delivery. Clients book, pay, and receive a private video room — in one flow, without intake forms, contracts, or portals in the way.',
        'Built-in video means no Zoom. Every confirmed booking generates a private, browser-based room. The client gets the link in their confirmation email. Nothing to configure, nothing to share manually.',
        'Payment is required at booking by default. There are no invoices, no payment reminders, and no sessions that start unpaid.',
        "Session history, client notes, and earnings all live in one dashboard. If that covers your operational needs, you don't need a full CRM on top.",
      ],
    },
    comparison: {
      theyLabel: 'Practice.do',
      rows: [
        { feature: 'Built-in video room', them: 'No — requires Zoom or Meet', us: 'Yes — created per booking' },
        { feature: 'Payment required at booking', them: 'Invoicing-based by default', us: 'On by default, always enforced' },
        { feature: 'No-show protection', them: 'Minimal — payment after session', us: 'Payment required to confirm slot' },
        { feature: 'Client portal and contracts', them: 'Yes — full CRM features', us: 'No — focused on session delivery' },
        { feature: 'Setup time to first session', them: 'Longer — forms, packages, configuration', us: 'Under five minutes' },
        { feature: 'Purpose-built for paid session flow', them: 'No — broader coaching CRM', us: 'Yes' },
      ],
    },
    workflow: [
      { step: 'Create your CallSesh account', detail: 'Sign up, connect Stripe, and set your availability. Under five minutes from account to live booking page.' },
      { step: 'Add your session types', detail: 'Create the session types you offer — 30-minute calls, 60-minute deep dives — with their durations and prices.' },
      { step: 'Share your booking link', detail: 'One URL handles scheduling, payment, and video. Send it in email, add it to your bio, or link to it from your website.' },
      { step: 'Clients book, pay, and show up', detail: 'Payment clears, a private video room is created, and a confirmation email goes out. You join at session time from the dashboard.' },
    ],
    faq: [
      {
        q: 'Is CallSesh a CRM like Practice.do?',
        a: "Not in the traditional sense. CallSesh tracks session history, client records, and session notes — but it does not have intake forms, contracts, resource libraries, or a client portal. If those features are central to your practice, Practice may be a better fit. If your primary need is reliable paid session booking with video included, CallSesh is more focused.",
      },
      {
        q: 'Does Practice.do include built-in video?',
        a: 'No. Practice.do integrates with Zoom for session delivery. You still need a separate Zoom account and must generate or attach meeting links to sessions manually.',
      },
      {
        q: 'How does pricing compare?',
        a: "Practice.do pricing varies by plan. Combined with a Zoom subscription, total monthly costs often exceed CallSesh Starter at $19.99/month plus a 10% per-session fee. For coaches focused on session delivery rather than full CRM features, CallSesh is typically more cost-efficient.",
      },
      {
        q: 'Can I switch from Practice.do to CallSesh without losing client history?',
        a: "CallSesh does not have a migration import tool. You'd re-enter active client session types and start fresh. Historic session notes from Practice would stay in Practice during any transition.",
      },
      {
        q: 'What if I eventually need features Practice.do has — contracts, intake forms?',
        a: 'CallSesh is built for session delivery. Intake forms are on the roadmap; contracts are not currently planned. If your practice grows to require contract management and a client portal, Practice.do may serve that stage better.',
      },
    ],
    ctaHeading: 'Start taking paid coaching sessions today — no CRM setup required',
    ctaBody: 'Booking, payment, and video in under five minutes. First 10 sessions free.',
    related: [
      { label: 'HoneyBook alternative for coaches', href: '/alternatives/honeybook-alternative-for-coaches' },
      { label: 'Acuity alternative for coaches', href: '/alternatives/acuity-alternative-for-coaches' },
      { label: 'Calendly alternative for coaches', href: '/alternatives/calendly-alternative-for-coaches' },
      { label: 'Coaching booking software', href: '/coaching-booking-software' },
    ],
    contextualNote: {
      prefix: 'See how CallSesh compares to other tools in the ',
      linkText: 'coaching software alternatives',
      href: '/alternatives',
      suffix: ' overview.',
    },
  },

  {
    path: '/for/executive-coaches',
    title: 'Booking Software for Executive Coaches — CallSesh',
    description:
      'Executive coaches need a professional, friction-free booking experience that collects payment upfront and handles video sessions without manual coordination. That is what CallSesh is built for.',
    h1: 'Booking Software for Executive Coaches Who Bill for High-Value Sessions',
    intro:
      'Executive coaching operates at a premium. Your clients are senior leaders with demanding schedules, global time zones, and high expectations for professionalism. Every piece of your client experience — from the first booking to the session itself — should reflect the quality of the work you do. CallSesh gives executive coaches a clean, professional booking page that handles scheduling, payment, and video in a single flow. No invoices. No Zoom link coordination. No scheduling back-and-forth.',
    forWho: [
      'Executive and leadership coaches running high-value paid sessions',
      'Coaches working with C-suite and senior leaders who pay by corporate card',
      'Executive coaches with global clients across multiple time zones',
      'Coaches building a solo executive coaching practice and want a professional operational setup from day one',
    ],
    problem: {
      heading: 'Why executive coaching sessions demand a better booking setup',
      points: [
        'Scheduling back-and-forth with a senior executive wastes time on both sides. When a client is a VP or CEO, every email asking "does Tuesday at 3pm work?" adds unnecessary friction to a relationship that should feel effortless.',
        'Invoicing after a session is misaligned with premium professional services. Sending a payment request after coaching a senior leader creates an awkward dynamic that upfront payment eliminates entirely.',
        "Executive clients are often across multiple time zones — New York, London, Singapore. Generic scheduling tools display times in your local zone and leave the client to do the math. That math fails, and sessions start late or not at all.",
        'Manually generating and sending a Zoom link for every session is low-status admin that takes time and occasionally goes wrong. A missed link or an expired meeting URL is unprofessional at any level — especially at this one.',
      ],
    },
    solution: {
      heading: 'A professional booking experience that matches the quality of your work',
      points: [
        'Clients see your availability in their own time zone automatically. They pick a slot that works, pay by corporate or personal card, and receive a confirmation with their private video link — all without an email exchange.',
        'Payment is collected at booking. Sessions are confirmed only when payment clears. No invoices to send, no outstanding balances to manage, no post-session payment conversations.',
        'Every booking generates a private, browser-based video room. The client clicks a link from their confirmation email and joins — no Zoom account, no app update, no friction right before the call starts.',
        'Your session schedule, client history, and earnings are all tracked in one dashboard. Nothing to reconcile across separate tools.',
      ],
    },
    comparison: {
      theyLabel: 'Generic scheduling tools',
      rows: [
        { feature: 'Payment at booking', them: 'Requires add-on or manual setup', us: 'Built in, always enforced' },
        { feature: 'Automatic video room', them: 'No — generate and share manually', us: 'Yes — created per booking' },
        { feature: 'Timezone handling', them: 'Varies — often manual', us: 'Automatic, client-facing' },
        { feature: 'No-show protection', them: 'None — free bookings allowed', us: 'Payment required to confirm slot' },
        { feature: 'Professional client experience', them: 'Fragmented across tools', us: 'Single unified booking flow' },
        { feature: 'Purpose-built for paid coaching', them: 'No — general scheduling', us: 'Yes' },
      ],
    },
    workflow: [
      { step: 'Create your session types', detail: 'Define your executive coaching sessions — 60-minute leadership sessions, 90-minute strategy calls, quarterly reviews — each with its own duration and price.' },
      { step: 'Set your availability', detail: 'Block your coaching hours once. Clients book into the slots you have open, displayed in their local time zone.' },
      { step: 'Share one link', detail: 'Your CallSesh URL goes in your email signature, LinkedIn profile, or website. Clients book and pay without any coordination required from you.' },
      { step: 'Join at session time', detail: 'Open the session from your dashboard. Your client joins from the link in their confirmation email. No coordination, no extra steps.' },
    ],
    faq: [
      {
        q: 'Can clients pay with a corporate card?',
        a: 'Yes. CallSesh accepts all major credit and debit cards through Stripe — corporate cards included. Clients can use whatever card their company issues for business expenses.',
      },
      {
        q: 'Does CallSesh handle international clients and time zones automatically?',
        a: "Yes. Your availability is defined in your local time zone and displayed in the client's local time when they view your booking page. No manual conversion needed on either side.",
      },
      {
        q: 'Is the booking experience professional enough for C-suite clients?',
        a: "The booking page is clean, card-based, and focused. It presents your session types and availability without prominent third-party branding. Clients see your professional booking page, not a generic scheduling tool.",
      },
      {
        q: 'Can I offer different session types for different engagement formats?',
        a: 'Yes. Create separate session types for each format you offer — a 60-minute coaching session, a 90-minute strategy session, an executive team debrief — each with its own price and duration on the same booking page.',
      },
      {
        q: 'What happens to my income if a client no-shows?',
        a: "Because clients pay at booking, their session fee is already collected before the call starts. A no-show doesn't cost you income. You can choose to offer a reschedule at your discretion.",
      },
      {
        q: 'Does CallSesh support session notes for ongoing client engagements?',
        a: 'Yes. After each session, you can add notes to the client record in the dashboard. Notes persist across sessions so you can track progress and context for ongoing executive coaching relationships.',
      },
    ],
    ctaHeading: 'Give your executive coaching practice a professional booking experience',
    ctaBody: 'Scheduling, payment, and video in one link. Set up in under five minutes. First 10 sessions free.',
    related: [
      { label: 'Booking software for business coaches', href: '/for/business-coaches' },
      { label: 'Booking software for career coaches', href: '/for/career-coaches' },
      { label: 'Coaching scheduling software', href: '/coaching-scheduling-software' },
      { label: 'All-in-one coaching platform', href: '/all-in-one-coaching-platform' },
    ],
    contextualNote: {
      prefix: 'CallSesh is ',
      linkText: 'coaching software for every type of coach',
      href: '/for',
      suffix: ' — business, executive, life, health, and fitness.',
    },
  },

  {
    path: '/for/career-coaches',
    title: 'Booking Software for Career Coaches — CallSesh',
    description:
      'Career coaches need a frictionless way for clients to book, pay upfront, and join sessions for interview prep, resume reviews, and career strategy calls. CallSesh handles the entire flow in one link.',
    h1: 'Booking Software for Career Coaches Running Paid 1-on-1 Sessions',
    intro:
      'Career coaching clients are often in motion — actively job searching, prepping for an interview next week, or navigating a career pivot under time pressure. They need to book quickly, pay cleanly, and show up ready to work. CallSesh gives career coaches a professional booking page where clients schedule a session, pay upfront, and receive a private video room link in one flow. No back-and-forth scheduling. No invoices to chase. No manual video link coordination.',
    forWho: [
      'Career coaches offering interview prep, resume reviews, and strategy calls',
      'Career coaches whose clients pay out of pocket and need a simple, professional payment experience',
      'Coaches with clients across different time zones who need automatic timezone handling',
      'Career coaches currently coordinating sessions via email, LinkedIn DMs, or social media',
    ],
    problem: {
      heading: 'Why generic booking tools slow down career coaches',
      points: [
        'Career coaching clients often need to book quickly — an interview is in three days, a job offer expires this week, or a recruiter call is coming up. Scheduling back-and-forth by email adds delay that your client cannot afford.',
        'Invoicing after a career coaching session creates awkward follow-up. Clients who have just had their resume reviewed or completed a mock interview have less urgency to pay promptly — and following up damages the professional relationship.',
        'Career coaches frequently work across time zones. A client in San Francisco booking with a coach in London cannot reliably decode "Tuesday at 2pm" without automatic timezone display. Errors lead to missed sessions.',
        'Managing a scheduling tool, a payment link, and a Zoom account as three separate systems adds admin overhead before and after every session — time that should go toward session prep and client follow-up.',
      ],
    },
    solution: {
      heading: 'A booking flow that matches how career coaching clients actually work',
      points: [
        'Clients book, pay, and get their video room link in one step. No email ping-pong, no separate payment request, no Zoom link to generate and send.',
        'Payment is required at booking. Sessions confirm only when payment clears — so every session on your calendar is paid before it starts.',
        'Timezone is handled automatically. Your availability is shown in the client\'s local time. A client in New York sees your London availability in their own zone without doing any math.',
        'Create separate session types for each service you offer: mock interview, resume review, LinkedIn profile audit, job search strategy call — each with its own duration and price on the same booking page.',
      ],
    },
    comparison: {
      theyLabel: 'Generic scheduling tools',
      rows: [
        { feature: 'Payment at booking', them: 'Requires add-on or manual setup', us: 'Built in, always enforced' },
        { feature: 'Automatic video room', them: 'No — generate and share manually', us: 'Yes — created per booking' },
        { feature: 'Timezone display for clients', them: 'Varies — often manual', us: 'Automatic, client-facing' },
        { feature: 'Multiple session types', them: 'Yes, on most tools', us: 'Yes' },
        { feature: 'No-show protection', them: 'None — free bookings allowed', us: 'Payment required to confirm slot' },
        { feature: 'Purpose-built for paid coaching', them: 'No — general scheduling', us: 'Yes' },
      ],
    },
    workflow: [
      { step: 'Create your session types', detail: 'Add your career coaching services — mock interview, resume review, career strategy call — each with its own duration and price.' },
      { step: 'Set your availability', detail: 'Define your coaching hours once. Clients book into open slots displayed in their local time zone.' },
      { step: 'Share your booking link', detail: 'One URL goes in your LinkedIn bio, email signature, or website. Clients book and pay without any back-and-forth.' },
      { step: 'Join at session time', detail: 'Open the session from your dashboard. Your client joins from their confirmation email link. No coordination required.' },
    ],
    faq: [
      {
        q: 'Can I offer different session types for different services?',
        a: 'Yes. Create a separate session type for each service — a 60-minute mock interview, a 45-minute resume review, a 30-minute career strategy call — each with its own price and duration on the same booking page.',
      },
      {
        q: 'Does CallSesh handle different time zones automatically?',
        a: "Yes. Your availability is defined in your local time zone and displayed in the client's local time when they view your booking page. No manual conversion or clarification needed.",
      },
      {
        q: 'Can clients pay by card even if their employer isn\'t covering the cost?',
        a: 'Yes. Clients pay by any major credit or debit card through Stripe. Personal cards, corporate cards, and HSA/FSA cards with a Visa or Mastercard logo all work.',
      },
      {
        q: 'What if a client needs to book urgently — same day or next day?',
        a: "As long as you have availability open, clients can book any open slot — including short-notice slots. You control what's available; same-day booking works if that window is open.",
      },
      {
        q: 'Can I add notes after a session?',
        a: 'Yes. After each session, you can add notes to the client record in the dashboard. Notes persist across all sessions with that client — useful for tracking a client through a job search over multiple sessions.',
      },
      {
        q: 'Is there a free plan?',
        a: 'Yes. Your first 10 sessions are included at no cost, no credit card required. After that, Starter is $19.99/month for up to 40 sessions, or Pro at $49.99/month for unlimited sessions.',
      },
    ],
    ctaHeading: 'Set up your career coaching booking page in under five minutes',
    ctaBody: 'Clients book, pay, and join your session in one flow. First 10 sessions free.',
    related: [
      { label: 'Booking software for executive coaches', href: '/for/executive-coaches' },
      { label: 'Booking software for business coaches', href: '/for/business-coaches' },
      { label: 'Coaching scheduling software', href: '/coaching-scheduling-software' },
      { label: 'All-in-one coaching platform', href: '/all-in-one-coaching-platform' },
    ],
    contextualNote: {
      prefix: 'CallSesh is ',
      linkText: 'coaching software for every type of coach',
      href: '/for',
      suffix: ' — career, executive, business, life, health, and fitness.',
    },
  },

  {
    path: '/alternatives/honeybook-alternative-for-coaches',
    title: 'HoneyBook Alternative for Coaches — Focused on Paid Sessions, Not Projects | CallSesh',
    description:
      'HoneyBook is built for project-based creative businesses. If you run paid 1-on-1 coaching sessions and want booking, payment, and video without contract workflows, CallSesh is a more focused alternative.',
    h1: 'A HoneyBook Alternative Built for Paid Coaching Sessions',
    intro:
      'HoneyBook is capable client management software with a strong feature set: contracts, proposals, questionnaires, automations, and project workflows. It was built for creative freelancers — photographers, event planners, designers — managing complex project engagements with multiple deliverables. Coaches who have adopted it often find it genuinely useful for contracts and intake, but still need Zoom for video and still manage invoicing separately from session scheduling. CallSesh is built for a different, simpler use case: a client books a paid session, pays upfront, and joins a private video room — in one flow, with no project management overhead.',
    forWho: [
      'Coaches using HoneyBook for contracts but still managing Zoom and payment separately',
      'Coaches who find HoneyBook\'s project workflow overhead more than their session-based practice needs',
      'Coaches evaluating tools and wanting booking, payment, and video in one place without CRM complexity',
      'New coaches who want to take paid sessions immediately without a lengthy setup process',
    ],
    problem: {
      heading: 'Where HoneyBook works well — and where it adds friction for session-based coaching',
      points: [
        'HoneyBook is genuinely good for contract management, project proposals, questionnaires, and automating multi-step client onboarding. If those are central to your practice, that depth has real value.',
        'For coaching sessions specifically, HoneyBook still requires a separate video tool. Sessions run through Zoom or Google Meet — meaning you generate and share meeting links manually for every booking.',
        'Payment in HoneyBook is invoice-based. Clients receive an invoice and pay it — before or after the session depending on your setup. That is different from payment enforced at booking time, where a slot cannot be confirmed without a completed card transaction.',
        'HoneyBook was designed around project-based work: a defined scope, a contract, deliverables, and a project close. Session-based coaching — weekly 1-on-1 calls with no fixed project scope — is a different operating model that does not map cleanly onto that structure.',
      ],
    },
    solution: {
      heading: 'Booking, payment, and video designed for the coaching session workflow',
      points: [
        'Clients book a session type, pay by card, and receive a private video room link in a single flow. No proposal, no contract step, no separate invoice — just a confirmed, paid session.',
        'Payment is enforced at booking by default. The slot does not confirm until the card clears. No outstanding invoices, no payment follow-up, no sessions that start unpaid.',
        'Built-in video means no Zoom. Every confirmed booking generates a private, browser-based room sent to the client in their confirmation email.',
        'Session history, client notes, and earnings are all tracked in one dashboard. If that is what your coaching practice actually needs to run, you do not need project pipelines and contract workflows on top of it.',
      ],
    },
    comparison: {
      theyLabel: 'HoneyBook',
      rows: [
        { feature: 'Payment enforced at booking', them: 'Invoice-based — not enforced at booking', us: 'On by default, slot confirms on payment' },
        { feature: 'Built-in video room', them: 'No — requires Zoom or Meet', us: 'Yes — created per booking' },
        { feature: 'No-show protection', them: 'Depends on invoice timing', us: 'Payment required to confirm slot' },
        { feature: 'Contracts and proposals', them: 'Yes — core feature', us: 'No — focused on session delivery' },
        { feature: 'Setup time to first session', them: 'Longer — pipeline, contract, invoice config', us: 'Under five minutes' },
        { feature: 'Purpose-built for paid session flow', them: 'No — project-based client management', us: 'Yes' },
      ],
    },
    workflow: [
      { step: 'Create your CallSesh account', detail: 'Sign up, connect Stripe, and set your availability. Under five minutes from account to live booking page.' },
      { step: 'Add your session types', detail: 'Create session types for what you offer — strategy sessions, coaching calls, review sessions — each with a duration and price.' },
      { step: 'Share your booking link', detail: 'One URL handles scheduling, payment, and video. Replace your HoneyBook booking link wherever you have shared it.' },
      { step: 'Clients book, pay, and show up', detail: 'Payment clears, a video room is created, and a confirmation email goes out automatically. No follow-up required on your end.' },
    ],
    faq: [
      {
        q: 'Is HoneyBook good for coaching businesses?',
        a: "HoneyBook has real strengths for coaches who need contract management, intake questionnaires, and client onboarding workflows. If those are central to how you run your practice, it serves that need well. Where it falls short is the session delivery layer — no built-in video, invoice-based payment rather than payment enforced at booking, and a project-centric structure that doesn't map cleanly onto a recurring session-based model.",
      },
      {
        q: 'Does HoneyBook have built-in video for coaching sessions?',
        a: 'No. HoneyBook does not include a built-in video room. Sessions still require a separate Zoom or Google Meet link that you generate and share manually for each booking.',
      },
      {
        q: 'How does payment work differently in CallSesh vs. HoneyBook?',
        a: 'HoneyBook uses an invoice-based payment model — you send an invoice and the client pays it, which can happen before or after the session. In CallSesh, payment is required to confirm the booking. The slot does not exist on your calendar until the card transaction completes.',
      },
      {
        q: 'How long does switching take?',
        a: 'Under ten minutes. Create your CallSesh account, connect Stripe, set your availability, and create your first session type. Your booking page is live immediately. You can keep HoneyBook running for contract-based work while switching session bookings to CallSesh.',
      },
      {
        q: 'Can I keep HoneyBook for contracts and use CallSesh for sessions?',
        a: "Yes. They are independent platforms. Some coaches use HoneyBook for initial client onboarding and contracts, then switch to CallSesh for ongoing session booking and delivery. There's no conflict.",
      },
    ],
    ctaHeading: 'Take paid coaching sessions today — no project workflows required',
    ctaBody: 'Booking, payment, and video in one link. Set up in under five minutes. First 10 sessions free.',
    related: [
      { label: 'Practice.do alternative for coaches', href: '/alternatives/practice-alternative-for-coaches' },
      { label: 'Acuity alternative for coaches', href: '/alternatives/acuity-alternative-for-coaches' },
      { label: 'Coaching booking software', href: '/coaching-booking-software' },
      { label: 'All-in-one coaching platform', href: '/all-in-one-coaching-platform' },
    ],
    contextualNote: {
      prefix: 'See how CallSesh compares to other tools in the ',
      linkText: 'coaching software alternatives',
      href: '/alternatives',
      suffix: ' overview.',
    },
  },

  {
    path: '/coaching-client-management-software',
    title: 'Coaching Client Management Software — Track Sessions, Notes, and Bookings | CallSesh',
    description:
      'Manage your coaching clients without a complex CRM. CallSesh tracks session history, notes, and upcoming bookings in one dashboard — with a built-in booking and payment flow your clients use directly.',
    h1: 'Coaching Client Management Software Built Around Sessions, Not Pipelines',
    intro:
      'Most coaches do not need a CRM. They need to know who their clients are, what sessions they have had, what notes came out of those sessions, and what is coming up next — without switching between a calendar, a notes app, a payment tool, and a spreadsheet. CallSesh gives coaches a session-focused client management layer: every client has a booking history, every session has notes, and clients book their next session directly through your booking page without any coordination required.',
    forWho: [
      'Coaches who track client session history across notes apps, emails, and calendars',
      'Coaches who lose context between sessions and want session notes tied to the right client',
      'Coaches whose clients have to DM or email to book a follow-up session',
      'Coaches who want a cleaner operational setup without adopting a full enterprise CRM',
    ],
    problem: {
      heading: 'What coaching client management actually breaks down to',
      points: [
        'Most coaches piece together client tracking from memory, a notes app, and whatever their booking tool shows. When a client comes back after six weeks, pulling up context across three places takes time you do not have before the session starts.',
        'Generic CRM tools are built for sales teams: pipeline stages, deal values, lead scoring, and contact records. None of that maps onto the coaching session model — and configuring a CRM you only need 10% of wastes significant setup time.',
        'When clients have to email or message to book a follow-up, the rebooking rate drops. Friction between sessions is where coaching relationships stall. A self-serve booking link keeps the momentum going.',
        'Without session notes tied to a client record, insights from one session disappear before the next. You start rebuilding context every time instead of building on it.',
      ],
    },
    solution: {
      heading: 'Session history, notes, and booking — in one place, without CRM complexity',
      points: [
        'Every client in your CallSesh dashboard has a session history: past sessions, upcoming bookings, and notes you have added after each call — all tied to that client record.',
        'After each session, add notes directly to the client record. They persist across every future session with that client. No separate notes app, no searching email threads.',
        'Clients self-book their next session through your booking page. Payment is collected at booking — so the follow-up session is confirmed and paid before you even think about it.',
        'Your full schedule — upcoming sessions, past clients, earnings — is visible in one dashboard. No reconciliation across separate tools.',
      ],
    },
    comparison: {
      theyLabel: 'Generic CRM software',
      rows: [
        { feature: 'Session history per client', them: 'Not designed for it', us: 'Yes — every session tied to client' },
        { feature: 'Session notes per client', them: 'Custom fields or workarounds', us: 'Yes — native after each session' },
        { feature: 'Client self-booking', them: 'Requires separate scheduling tool', us: 'Built in — booking page included' },
        { feature: 'Payment at booking', them: 'Not included', us: 'Yes — enforced by default' },
        { feature: 'Built-in video room', them: 'Not included', us: 'Yes — created per booking' },
        { feature: 'Setup time', them: 'Days — pipeline config, fields, workflows', us: 'Under five minutes' },
      ],
    },
    workflow: [
      { step: 'Create your client-facing booking page', detail: 'Set your availability, add session types with prices, and share your booking URL. Clients book and pay without involving you.' },
      { step: 'Manage upcoming sessions from the dashboard', detail: 'All confirmed, paid sessions appear in your dashboard. Click to join a session at the scheduled time.' },
      { step: 'Add session notes after each call', detail: 'After the session, add notes to the client record. They stay attached to that client across all future sessions.' },
      { step: 'Let clients rebook themselves', detail: 'Your booking link is always live. Clients who want a follow-up session book and pay directly — no coordination required from you.' },
    ],
    faq: [
      {
        q: 'Does CallSesh replace a CRM?',
        a: "For session-based coaching practices, it covers the client management layer you actually need: session history, notes per client, and a booking flow clients use themselves. It does not replace a CRM for coaches who need lead pipelines, deal tracking, or contact databases — that is a different tool for a different workflow.",
      },
      {
        q: 'Can I see the full history of sessions with a specific client?',
        a: 'Yes. Each client record in the dashboard shows past sessions, upcoming bookings, and any notes you have added. The full session history is tied to that client.',
      },
      {
        q: 'Can I add notes after every session?',
        a: 'Yes. After a session, you can add notes to the client record from the dashboard. Notes are saved to that client and remain accessible for every future session.',
      },
      {
        q: 'Can clients book their own follow-up sessions?',
        a: 'Yes. Your CallSesh booking page is always live. Clients visit the link, pick an available slot, and pay — no scheduling back-and-forth, no message thread required.',
      },
      {
        q: 'Does CallSesh send reminders to clients?',
        a: 'Clients receive a confirmation email with their session details and video room link when they book. Automated pre-session reminder emails are on the roadmap.',
      },
      {
        q: 'What is the difference between this and coaching business software?',
        a: 'Coaching business software covers the full operational layer: booking, payment, earnings tracking, and running the business. Client management software is the session-level layer specifically: client records, session history, notes, and the booking flow clients use to continue working with you.',
      },
    ],
    ctaHeading: 'Manage your coaching clients without a complex CRM',
    ctaBody: 'Session history, notes, and booking in one dashboard. First 10 sessions free.',
    related: [
      { label: 'Coaching session software', href: '/coaching-session-software' },
      { label: 'Coaching booking software', href: '/coaching-booking-software' },
      { label: 'Coaching scheduling software', href: '/coaching-scheduling-software' },
      { label: 'All-in-one coaching platform', href: '/all-in-one-coaching-platform' },
    ],
    contextualNote: {
      prefix: 'See how CallSesh fits coaches of every type at the ',
      linkText: 'use cases overview',
      href: '/for',
      suffix: ' — career, executive, business, life, health, and fitness coaching.',
    },
  },

  {
    path: '/coaching-billing-software',
    title: 'Coaching Billing Software — Get Paid at Booking, Track Sessions, Skip Invoices | CallSesh',
    description:
      'Stop billing clients after the fact. CallSesh collects payment when clients book, tracks every paid session, and eliminates invoicing from your coaching workflow entirely.',
    h1: 'Coaching Billing Software That Collects Payment Before Sessions Start',
    intro:
      'Billing software for coaches does not need to be accounting infrastructure. It needs to solve one problem cleanly: clients pay for sessions, coaches get paid, and nothing falls through the cracks between booking and payment. CallSesh handles the entire billing flow — clients pay by card at booking, sessions confirm only after payment clears, earnings are tracked in the dashboard, and Stripe handles the bank payout. No invoices to send, no outstanding balances to chase, no manual reconciliation between what was booked and what was paid.',
    forWho: [
      'Coaches who invoice clients after sessions and deal with delayed or missed payment',
      'Coaches who use a payment link disconnected from their booking tool and manually match the two',
      'Coaches transitioning from informal payment methods — Venmo, PayPal, bank transfer — to a professional billing setup',
      'New coaches who want a clean billing workflow from their first paid session',
    ],
    problem: {
      heading: 'Why coaching billing breaks down without the right workflow',
      points: [
        'Invoicing after a session puts payment at the end of the value exchange. Clients have already received the coaching — the urgency to pay drops immediately after the call ends, and following up on outstanding invoices is awkward in a relationship built on trust.',
        'Using a separate payment link alongside a booking tool means matching every Stripe transaction to a calendar booking manually. When volumes grow, that matching fails silently — sessions go unpaid and you find out weeks later.',
        'Informal payment methods create professional friction. Asking for a Venmo or bank transfer before or after a session signals that your practice is not yet set up like a real business — which affects client confidence and willingness to rebook.',
        'Without a billing record tied to sessions, tracking what you have earned across clients and time periods requires manual work. Your financial picture is always incomplete.',
      ],
    },
    solution: {
      heading: 'Billing built into the booking flow — payment is required, not requested',
      points: [
        'Clients enter card details during booking. The session confirms only when payment clears. There is no invoice step, no follow-up required, and no session that starts unpaid.',
        'Every paid session is recorded in the CallSesh dashboard with the session date, client, and amount. Your billing history is always current — no manual entry, no spreadsheet to maintain.',
        'Stripe handles all payment processing and bank payouts. You connect a free Stripe account during setup; Stripe deposits earnings on its standard payout schedule without any action required from you.',
        'Free sessions work too. Set any session type to $0 for discovery calls, trials, or comped sessions. The billing workflow handles both paid and free sessions in the same flow.',
      ],
    },
    comparison: {
      theyLabel: 'Invoice-based billing',
      rows: [
        { feature: 'When payment is collected', them: 'After the session — on invoice', us: 'At booking — before the session' },
        { feature: 'No-show financial risk', them: 'High — unpaid booking, lost slot', us: 'None — payment confirms the slot' },
        { feature: 'Invoice follow-up required', them: 'Yes — for every session', us: 'No — payment is automatic' },
        { feature: 'Billing tied to session record', them: 'Manual matching required', us: 'Yes — linked automatically' },
        { feature: 'Earnings dashboard', them: 'Separate tool or spreadsheet', us: 'Yes — in the coaching dashboard' },
        { feature: 'Setup time', them: 'Invoicing tool + booking tool + reconciliation', us: 'Under five minutes' },
      ],
    },
    workflow: [
      { step: 'Connect Stripe during setup', detail: 'Link a free Stripe account. Stripe handles card processing, PCI compliance, and bank payouts on its standard schedule.' },
      { step: 'Set your session prices', detail: 'Price each session type — 30-minute calls, 60-minute sessions, different service tiers. Prices display on your booking page.' },
      { step: 'Client books and pays', detail: 'Client selects a slot and enters card details. Payment clears before the session is confirmed. No invoice sent.' },
      { step: 'Track earnings in the dashboard', detail: 'Every paid session appears in your billing history with client, date, and amount. Stripe handles the bank payout automatically.' },
    ],
    faq: [
      {
        q: 'Does CallSesh replace invoicing software?',
        a: 'For session-based coaching, yes — because CallSesh eliminates the need to invoice at all. Payment is collected during booking, so there are no outstanding invoices to manage. If your practice includes project-based work that requires formal invoices, you would still need a separate invoicing tool for that work.',
      },
      {
        q: 'When do I get paid?',
        a: "Payments are processed by Stripe and follow Stripe's standard payout schedule — typically two business days after a payment is captured. CallSesh tracks your earnings but does not manage payout timing; that is handled entirely by Stripe.",
      },
      {
        q: 'What fees are involved?',
        a: 'CallSesh charges a 10% platform fee per session. Stripe charges approximately 2.9% + 30¢ per transaction. Both are deducted automatically from each session payment — no manual calculation.',
      },
      {
        q: 'Can I see a billing history for each client?',
        a: 'Yes. Each client record in the dashboard includes session history with dates and amounts paid. Your overall earnings history is also visible in the dashboard.',
      },
      {
        q: 'Does CallSesh handle refunds?',
        a: 'Refunds can be issued through Stripe directly. CallSesh does not currently have a built-in refund flow in the dashboard — this is on the roadmap.',
      },
      {
        q: 'Is this the same as coach payment processing?',
        a: 'Coach payment processing refers specifically to how card transactions are handled at booking time. Coaching billing software is the broader workflow: how billing fits into your practice — collecting payment upfront, tracking what has been paid, avoiding invoicing, and maintaining a billing history across all clients and sessions.',
      },
    ],
    ctaHeading: 'Replace your invoicing workflow with payment at booking',
    ctaBody: 'Clients pay when they book. No invoices. No follow-up. First 10 sessions free.',
    related: [
      { label: 'Coach payment processing', href: '/coach-payment-processing' },
      { label: 'Coaching booking software', href: '/coaching-booking-software' },
      { label: 'Coaching client management software', href: '/coaching-client-management-software' },
      { label: 'All-in-one coaching platform', href: '/all-in-one-coaching-platform' },
    ],
    contextualNote: {
      prefix: 'See how CallSesh compares to invoicing tools and payment add-ons in the ',
      linkText: 'coaching software alternatives',
      href: '/alternatives',
      suffix: ' overview.',
    },
  },

  {
    path: '/online-coaching-platform',
    title: 'Online Coaching Platform for Paid 1-on-1 Sessions — CallSesh',
    description:
      'Run a paid online coaching practice from one platform. CallSesh handles booking, payments, scheduling, reminders, and video — no tool switching required.',
    h1: 'Online Coaching Platform Built for Paid 1-on-1 Sessions',
    intro:
      'An online coaching practice has a lot of moving parts: clients need to book a time, pay before the session, receive a reminder, and join a video room — all without confusion. Most coaches handle this across four or five separate tools that barely talk to each other. CallSesh brings the whole workflow into one platform. Clients get a clean booking experience. You get paid before every session. Sessions run in a private video room without a separate app.',
    forWho: [
      'Coaches building or scaling a paid online practice',
      'Coaches replacing a multi-tool stack with one platform',
      'Online coaches who want a professional, frictionless client experience',
      'Coaches tired of managing booking, payment, and video in separate systems',
    ],
    problem: {
      heading: 'What breaks when you run online coaching across multiple tools',
      points: [
        'Booking tools like Calendly don\'t enforce payment — clients can hold a slot without paying, which means unpaid no-shows are a recurring risk.',
        'Video platforms like Zoom operate separately from your booking system. You manually generate a meeting link, copy it to a calendar invite, and hope the client finds it.',
        'Payment tools don\'t connect to your session schedule. You invoice after the session or chase payment after the fact.',
        'Reminders, confirmations, and session links come from different platforms and land in the client\'s inbox with no consistent format — which looks unprofessional.',
      ],
    },
    solution: {
      heading: 'One platform for your full online coaching workflow',
      points: [
        'Your booking page, payment collection, session video room, and client reminders all live in one system. Nothing needs to be connected manually.',
        'Clients pay when they book. Every confirmed session has a paid status before it ever appears on your calendar.',
        'A private video room is created for each booking automatically. Clients receive the room link in their confirmation email — no manual work on your end.',
        'Automatic reminders go out before each session. Clients show up prepared. You don\'t send anything by hand.',
      ],
    },
    comparison: {
      theyLabel: 'Multi-tool setup',
      rows: [
        { feature: 'Payment required to confirm booking', them: 'Optional — requires manual setup', us: 'Built-in, enforced at booking' },
        { feature: 'Session video room delivery', them: 'Manual — copy/paste link to calendar', us: 'Automatic in confirmation email' },
        { feature: 'Client session reminders', them: 'Manual or third-party tool', us: 'Automatic before each session' },
        { feature: 'Booking and payment connected', them: 'Requires Stripe + Calendly integration', us: 'Unified in one flow' },
        { feature: 'Session history per client', them: 'Spreadsheet or separate CRM', us: 'Built-in dashboard' },
        { feature: 'Tools required', them: '3 or more', us: '1' },
      ],
    },
    workflow: [
      { step: 'Create your session types', detail: 'Define what you offer — 30-minute check-ins, 60-minute strategy sessions, intro calls — each with its own price and duration.' },
      { step: 'Connect Stripe and go live', detail: 'Link your Stripe account for payouts. Your booking page is ready to share in minutes.' },
      { step: 'Share one booking link', detail: 'Add your CallSesh link to your website, email signature, or social profiles. Clients book and pay without any back-and-forth.' },
      { step: 'Run sessions from the dashboard', detail: 'Join your video room with one click. Client history, past notes, and upcoming sessions are all in one place.' },
    ],
    faq: [
      {
        q: 'Is CallSesh a course platform or community platform?',
        a: 'No. CallSesh is built for live, paid 1-on-1 coaching sessions — not pre-recorded courses, group cohorts, or membership communities. If you run synchronous paid sessions, it\'s designed for your workflow.',
      },
      {
        q: 'How is this different from an all-in-one coaching platform?',
        a: 'CallSesh is intentionally focused on the session workflow — booking, payment, video, and client records. It does not include CRM pipelines, course builders, or contract management. If you want a lighter tool built for running sessions rather than managing a business suite, CallSesh is the better fit.',
      },
      {
        q: 'Do clients need to create an account to book?',
        a: 'No. Clients book as guests. They receive their confirmation and video link by email without signing up for anything.',
      },
      {
        q: 'Can I run group sessions or webinars on CallSesh?',
        a: 'Not currently. CallSesh is built for 1-on-1 sessions. Group sessions and cohort-based formats are not supported at this time.',
      },
      {
        q: 'Does the platform handle scheduling across time zones?',
        a: 'Yes. Booking pages display your availability in each client\'s local time zone, so you don\'t have to manage time zone conversions manually.',
      },
      {
        q: 'What does it cost to run my online coaching through CallSesh?',
        a: 'CallSesh Starter is $19.99/month with a 10% per-session fee, replacing the combined cost of a scheduler, video tool, and payment setup. First 10 sessions are free to try the full workflow.',
      },
    ],
    ctaHeading: 'Run your online coaching practice from one platform',
    ctaBody: 'Booking, payments, video, and reminders — ready in minutes. First 10 sessions free.',
    related: [
      { label: 'Coaching booking software', href: '/coaching-booking-software' },
      { label: 'Coaching scheduling software', href: '/coaching-scheduling-software' },
      { label: 'Coaching session software', href: '/coaching-session-software' },
      { label: 'Video coaching platform', href: '/video-coaching-platform' },
      { label: 'Coaching billing software', href: '/coaching-billing-software' },
      { label: 'Coaching client management software', href: '/coaching-client-management-software' },
    ],
    contextualNote: {
      prefix: 'See how CallSesh works for different coaching specialties in the ',
      linkText: 'coaching verticals hub',
      href: '/for',
      suffix: '.',
    },
  },

  {
    path: '/coaching-session-software',
    title: 'Coaching Session Software — Book, Run, and Track Paid Sessions | CallSesh',
    description:
      'Software built around the coaching session: upfront payment, automated reminders, video rooms, and session history in one place. No manual coordination.',
    h1: 'Coaching Session Software That Handles Everything Around the Session',
    intro:
      'Every paid coaching session involves the same set of tasks: the client needs to find a slot, pay to confirm it, receive a reminder before the call, join a video room, and leave with a record of what was covered. Most coaches handle each step with a different tool or a manual workaround. Coaching session software should close that loop — from the moment a client books to the moment the session ends and the record is saved.',
    forWho: [
      'Coaches charging hourly for paid 1-on-1 sessions',
      'Coaches who want payment confirmed before a session goes on the calendar',
      'Online coaches looking to reduce manual coordination between scheduling, reminders, and video',
      'New coaches who want a clean session workflow from their first paid client',
    ],
    problem: {
      heading: 'The coordination overhead hidden inside every session',
      points: [
        'Booking and payment are disconnected. A client picks a time but pays separately — if payment doesn\'t clear, you\'ve lost the slot to someone who never intended to show.',
        'Session reminders require manual effort. Without a reminder system, you send messages by hand the day before, or clients forget and no-shows go uncompensated.',
        'Video links live outside your booking system. You generate a Zoom link separately, copy it into a calendar invite, and hope the client finds the right one for the right session.',
        'Session notes and history have no home. After the call, notes end up in a Google doc or spreadsheet with no clean tie to the specific session or client.',
      ],
    },
    solution: {
      heading: 'Session software that covers the whole session lifecycle',
      points: [
        'Payment is required at booking. No confirmed slot exists until payment clears — unpaid no-shows are eliminated before they happen.',
        'Each booking triggers an automatic confirmation with session details and a private video room link. No manual reminder step needed.',
        'Sessions run in a browser-based video room generated automatically per booking. No Zoom links to create, copy, or manage.',
        'Session history and notes are stored per client in your dashboard, tied to the session record — not scattered across separate documents.',
      ],
    },
    comparison: {
      theyLabel: 'Manual session coordination',
      rows: [
        { feature: 'Payment to confirm slot', them: 'Separate step, easy to skip', us: 'Required at booking — slot held only when paid' },
        { feature: 'Pre-session reminder', them: 'Manual or skipped', us: 'Automatic with session details in confirmation' },
        { feature: 'Video room for the session', them: 'Manually created and shared', us: 'Auto-generated per booking' },
        { feature: 'Session notes', them: 'External doc or spreadsheet', us: 'Stored per session in dashboard' },
        { feature: 'Session history per client', them: 'Spreadsheet or memory', us: 'Built-in client session log' },
        { feature: 'Tools required per session', them: '3–4', us: '1' },
      ],
    },
    workflow: [
      { step: 'Set up your session types', detail: 'Define 30-minute, 60-minute, or custom session formats with a price for each. Takes a few minutes.' },
      { step: 'Share your booking link', detail: 'One URL handles scheduling and payment across all your session types.' },
      { step: 'Client books and pays', detail: 'The slot is confirmed only after payment. Confirmation email includes the client\'s private video room link.' },
      { step: 'Run the session', detail: 'Join from your dashboard with one click. Past notes and session details are on the same screen.' },
    ],
    faq: [
      {
        q: 'What is coaching session software?',
        a: 'Software that manages the lifecycle of a paid coaching session: scheduling, payment, reminders, video delivery, and session records — as opposed to general business tools that handle each step separately.',
      },
      {
        q: 'How is this different from coaching booking software?',
        a: 'Booking software focuses on the scheduling and payment flow at the moment of booking. Session software covers the full lifecycle — what happens before, during, and after: reminders, the video call itself, and session notes tied to each client record.',
      },
      {
        q: 'Does CallSesh send pre-session reminders?',
        a: 'Clients receive a confirmation email with their session details and video room link when they book. Automated pre-session reminder emails are on the roadmap.',
      },
      {
        q: 'Can I take notes during or after a session?',
        a: 'Session notes can be added per session in your client dashboard after the call, and are stored against the session record.',
      },
      {
        q: 'Do I need separate video software?',
        a: 'No. CallSesh generates a private browser-based video room for each booking automatically. Clients join with one click — no app download required.',
      },
      {
        q: 'Is this software for group coaching?',
        a: 'No. CallSesh is built for 1-on-1 paid sessions. Group or cohort-based coaching is not currently supported.',
      },
    ],
    ctaHeading: 'Handle every step of your coaching session in one place',
    ctaBody: 'Book, pay, remind, run, and track — without switching tools. First 10 sessions free.',
    related: [
      { label: 'Online coaching platform', href: '/online-coaching-platform' },
      { label: 'Coaching booking software', href: '/coaching-booking-software' },
      { label: 'Coaching scheduling software', href: '/coaching-scheduling-software' },
      { label: 'Coaching billing software', href: '/coaching-billing-software' },
      { label: 'Video coaching platform', href: '/video-coaching-platform' },
      { label: 'Coaching client management software', href: '/coaching-client-management-software' },
    ],
    contextualNote: {
      prefix: 'Compare CallSesh to other session management tools in the ',
      linkText: 'coaching software alternatives',
      href: '/alternatives',
      suffix: ' overview.',
    },
  },
]

export function getPage(path: string): PseoPage | undefined {
  return pages.find((p) => p.path === path)
}

export function getPagesByPrefix(prefix: string): PseoPage[] {
  return pages.filter((p) => p.path.startsWith(prefix))
}
