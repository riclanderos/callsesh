// Pinned images are fetched by exact Pexels photo ID — stable across builds.
// Pages not in PINNED_IMAGES fall back to THEME_MAP query-based search.
const PINNED_IMAGES: Record<string, { id: string; alt: string }> = {
  '/coaching-booking-software': {
    id: '19915766',
    alt: 'Making a schedule on a laptop screen',
  },
  '/coaching-scheduling-software': {
    id: '29509538',
    alt: 'Modern workspace with calendar and laptop display',
  },
  '/coaching-session-software': {
    id: '5951326',
    alt: 'Hands typing on a laptop with notepad and pen at a desk',
  },
  '/online-coaching-platform': {
    id: '35962986',
    alt: 'Professional working on a laptop in a cozy home workspace',
  },
  '/for/business-coaches': {
    id: '7278819',
    alt: 'Professional working on laptop with business strategy',
  },
  '/for/life-coaches': {
    id: '8092410',
    alt: 'Minimalist workspace with open notebook and laptop on white desk',
  },
  '/for/fitness-coaches': {
    id: '30539360',
    alt: 'Cozy workspace with open planner and laptop',
  },
  '/for/health-coaches': {
    id: '8250994',
    alt: 'Serene workspace with laptop, notebooks, and soft lighting',
  },
}

const THEME_MAP: Record<string, { query: string; alt: string }> = {
  // Core commercial pages
  '/coaching-booking-software': {
    query: 'online booking confirmation laptop screen notification',
    alt: 'Online booking confirmation on a laptop screen',
  },
  '/video-coaching-platform': {
    query: 'video call laptop woman home screen blur',
    alt: 'Professional video coaching session on laptop',
  },
  '/all-in-one-coaching-platform': {
    query: 'clean minimal desk macbook morning light workspace',
    alt: 'Clean minimal professional workspace',
  },
  '/coaching-scheduling-software': {
    query: 'digital calendar computer screen schedule online app',
    alt: 'Digital calendar and scheduling on a computer screen',
  },
  '/coaching-client-management-software': {
    query: 'open notebook laptop desk organized notes records',
    alt: 'Organized notes and client records at a desk',
  },
  '/coaching-billing-software': {
    query: 'mobile phone contactless payment tap card reader',
    alt: 'Mobile contactless payment',
  },
  '/online-coaching-platform': {
    query: 'remote worker laptop bright modern room focused daylight',
    alt: 'Professional working remotely on a laptop in a bright room',
  },
  '/coaching-session-software': {
    query: 'focused professional typing laptop quiet desk notes',
    alt: 'Focused professional typing notes on a laptop',
  },
  '/coaching-business-software': {
    query: 'home office dual monitor organized productivity desk',
    alt: 'Organized home office with dual monitors',
  },
  '/coach-payment-processing': {
    query: 'credit card laptop online checkout payment screen',
    alt: 'Online payment checkout on a laptop',
  },
  '/tools-for-coaching-business': {
    query: 'notebook laptop coffee desk morning planning open',
    alt: 'Notebook and laptop at a desk for planning',
  },
  // Alternatives
  '/alternatives/calendly-for-coaches': {
    query: 'computer screen calendar app digital scheduling interface',
    alt: 'Digital scheduling app on a computer screen',
  },
  '/alternatives/calendly-alternative-for-coaches': {
    query: 'laptop productivity workflow modern desk organized',
    alt: 'Productive workflow on a modern desk',
  },
  '/alternatives/zoom-alternative-for-coaching': {
    query: 'video conference screen laptop professional call remote',
    alt: 'Professional video conference call on a laptop',
  },
  '/alternatives/stripe-alternative-for-coaches': {
    query: 'laptop screen invoice payment professional',
    alt: 'Payment invoice on a laptop screen',
  },
  '/alternatives/acuity-alternative-for-coaches': {
    query: 'scheduling app laptop screen online booking software',
    alt: 'Online scheduling software on a laptop screen',
  },
  '/alternatives/practice-alternative-for-coaches': {
    query: 'dashboard notes laptop professional workflow organized screen',
    alt: 'Professional workflow dashboard on a laptop',
  },
  '/alternatives/honeybook-alternative-for-coaches': {
    query: 'business proposal document laptop screen professional',
    alt: 'Business proposal document on a laptop screen',
  },
  // Coach verticals
  '/for/business-coaches': {
    query: 'laptop screen business strategy notes remote workspace digital',
    alt: 'Business strategy work on a laptop at a remote workspace',
  },
  '/for/life-coaches': {
    query: 'calm desk workspace journal notebook laptop morning light',
    alt: 'Calm laptop workspace for online coaching',
  },
  '/for/fitness-coaches': {
    query: 'fitness planning laptop desk spreadsheet workspace remote coaching',
    alt: 'Online fitness coaching plan on a laptop at a desk',
  },
  '/for/health-coaches': {
    query: 'wellness coach laptop notebook desk remote digital workspace',
    alt: 'Online health coaching workspace with laptop and notes',
  },
  '/for/executive-coaches': {
    query: 'executive professional confident suit leader portrait',
    alt: 'Executive professional leader',
  },
  '/for/career-coaches': {
    query: 'resume laptop career job search professional review',
    alt: 'Career coaching and resume review on a laptop',
  },
}

export interface PexelsPhoto {
  url: string
  alt: string
  photographer: string
  photographerUrl: string
}

interface PexelsPhotoData {
  photographer: string
  photographer_url: string
  src: {
    large2x: string
  }
}

interface PexelsSearchResponse {
  photos: PexelsPhotoData[]
}

export async function fetchHeroImage(path: string): Promise<PexelsPhoto | null> {
  const apiKey = process.env.PEXELS_API_KEY
  if (!apiKey) return null

  const pinned = PINNED_IMAGES[path]
  if (pinned) {
    try {
      const res = await fetch(`https://api.pexels.com/v1/photos/${pinned.id}`, {
        headers: { Authorization: apiKey },
        next: { revalidate: 86400 },
      })
      if (!res.ok) return null
      const photo = (await res.json()) as PexelsPhotoData
      if (!photo?.src?.large2x) return null
      return {
        url: photo.src.large2x,
        alt: pinned.alt,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
      }
    } catch {
      return null
    }
  }

  const theme = THEME_MAP[path]
  if (!theme) return null

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(theme.query)}&per_page=1&orientation=landscape`,
      {
        headers: { Authorization: apiKey },
        next: { revalidate: 86400 },
      }
    )
    if (!res.ok) return null
    const data = (await res.json()) as PexelsSearchResponse
    const photo = data.photos?.[0]
    if (!photo) return null
    return {
      url: photo.src.large2x,
      alt: theme.alt,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
    }
  } catch {
    return null
  }
}
