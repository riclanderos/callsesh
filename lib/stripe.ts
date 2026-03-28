import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

// DIAGNOSTIC — remove after confirming live key in Vercel logs
console.log('[stripe] key mode:', process.env.STRIPE_SECRET_KEY.slice(0, 12))

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
