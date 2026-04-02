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
      { label: 'Coach payment processing', href: '/coach-payment-processing' },
      { label: 'Video coaching platform', href: '/video-coaching-platform' },
      { label: 'For business coaches', href: '/for/business-coaches' },
    ],
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
      { label: 'Coaching booking software', href: '/coaching-booking-software' },
      { label: 'Video coaching platform', href: '/video-coaching-platform' },
      { label: 'Calendly alternative for coaches', href: '/alternatives/calendly-for-coaches' },
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
        'Sessions are tracked in your dashboard. You see upcoming sessions, past sessions, and earnings in one place.',
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
      { label: 'Coaching booking software', href: '/coaching-booking-software' },
      { label: 'Coach payment processing', href: '/coach-payment-processing' },
      { label: 'For business coaches', href: '/for/business-coaches' },
    ],
  },

  {
    path: '/alternatives/calendly-for-coaches',
    title: 'Calendly for Coaches — A Better Alternative | CallSesh',
    description:
      'Calendly is great for meetings but doesn\'t collect payments for coaching. CallSesh is the Calendly alternative that requires payment at booking so you get paid before every session.',
    h1: 'A Better Calendly for Coaches: Built-in Payments and Video',
    intro:
      'Calendly is excellent at what it does — scheduling meetings. But coaching isn\'t meetings. Coaching is a paid service, and Calendly\'s payment story for coaches is an afterthought. Clients can book without paying, integrations are fragile, and there\'s no video room. CallSesh was built specifically for coaches who need payment collected before the session starts.',
    forWho: [
      'Coaches currently using Calendly who need payment built in',
      'Coaches running a Calendly + Stripe + Zoom stack they want to simplify',
      'Coaches who have dealt with no-shows from unpaid bookings',
      'New coaches who want a professional setup from day one',
    ],
    problem: {
      heading: 'What Calendly gets wrong for coaches',
      points: [
        'Calendly was designed for B2B sales and internal scheduling — contexts where payment isn\'t part of the flow. Coaching is different. You need payment to hold a slot.',
        'Calendly\'s Stripe integration requires a paid Calendly plan and manual configuration. Clients can still book without paying if the integration isn\'t set up exactly right.',
        'There is no video room. After a client books through Calendly, you still have to generate a Zoom link, add it to the event, and hope the client finds it.',
      ],
    },
    solution: {
      heading: 'What CallSesh does instead',
      points: [
        'Payment is required at booking. Clients cannot hold a time slot without completing card payment. No configuration needed — it\'s how the product works by default.',
        'A private video room is created automatically for every booking. Clients receive the link in their confirmation email. No Zoom, no Google Meet, no extra steps.',
        'One flat pricing model — no per-seat fees, no higher-tier requirements to unlock payment. The 10% platform fee covers the cost of the platform.',
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
    ctaHeading: 'Switch from Calendly to a tool built for paid coaching',
    ctaBody: 'Set up in under five minutes. First 10 sessions are free.',
    related: [
      { label: 'Coaching booking software', href: '/coaching-booking-software' },
      { label: 'Coach payment processing', href: '/coach-payment-processing' },
      { label: 'Video coaching platform', href: '/video-coaching-platform' },
    ],
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
        'Your dashboard shows upcoming sessions, past sessions, and cumulative earnings. Everything in one place.',
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
      { label: 'Coaching booking software', href: '/coaching-booking-software' },
      { label: 'Coach payment processing', href: '/coach-payment-processing' },
      { label: 'Video coaching platform', href: '/video-coaching-platform' },
    ],
  },
]

export function getPage(path: string): PseoPage | undefined {
  return pages.find((p) => p.path === path)
}

export function getPagesByPrefix(prefix: string): PseoPage[] {
  return pages.filter((p) => p.path.startsWith(prefix))
}
