import { resend } from './resend'

export interface BookingEmailParams {
  sessionTitle: string
  bookingDate: string   // "YYYY-MM-DD"
  startTime: string     // "HH:MM" or "HH:MM:SS"
  endTime: string       // "HH:MM" or "HH:MM:SS"
  guestName: string
  guestEmail: string
  coachEmail: string
  coachTimezone: string // IANA timezone name, e.g. "America/New_York"
  guestSessionUrl: string
  guestCancelUrl: string
}

function formatDate(d: string): string {
  const [year, month, day] = d.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

export async function sendGuestConfirmation(params: BookingEmailParams): Promise<void> {
  const {
    sessionTitle,
    bookingDate,
    startTime,
    endTime,
    guestName,
    guestEmail,
    coachEmail,
    coachTimezone,
    guestSessionUrl,
    guestCancelUrl,
  } = params

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: guestEmail,
    subject: `Your session is confirmed — ${sessionTitle}`,
    text: [
      `Hi ${guestName},`,
      '',
      'Your session has been confirmed and payment received.',
      '',
      `Session:  ${sessionTitle}`,
      `Date:     ${formatDate(bookingDate)}`,
      `Time:     ${formatTime(startTime)} – ${formatTime(endTime)} (${coachTimezone})`,
      `Coach:    ${coachEmail}`,
      '',
      'Join your session here:',
      guestSessionUrl,
      '',
      'Need to cancel? Use this link:',
      guestCancelUrl,
      '',
      'See you then!',
      '— CallSesh',
    ].join('\n'),
  })
}

export async function sendGuestReminder(
  params: BookingEmailParams,
  reminderType: '24h' | '1h'
): Promise<void> {
  const { sessionTitle, bookingDate, startTime, endTime, guestName, guestEmail, coachTimezone, guestSessionUrl } = params

  const subject = reminderType === '24h'
    ? `Reminder: your session is tomorrow — ${sessionTitle}`
    : `Your session starts in 1 hour — ${sessionTitle}`

  const opening = reminderType === '24h'
    ? 'This is a reminder that your session is tomorrow.'
    : 'Your session starts in approximately 1 hour.'

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: guestEmail,
    subject,
    text: [
      `Hi ${guestName},`,
      '',
      opening,
      '',
      `Session:  ${sessionTitle}`,
      `Date:     ${formatDate(bookingDate)}`,
      `Time:     ${formatTime(startTime)} – ${formatTime(endTime)} (${coachTimezone})`,
      '',
      'Join your session here:',
      guestSessionUrl,
      '',
      '— CallSesh',
    ].join('\n'),
  })
}

export async function sendCoachNotification(params: BookingEmailParams): Promise<void> {
  const {
    sessionTitle,
    bookingDate,
    startTime,
    endTime,
    guestName,
    guestEmail,
    coachEmail,
    coachTimezone,
  } = params

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: coachEmail,
    subject: `New booking — ${guestName}`,
    text: [
      'You have a new confirmed booking.',
      '',
      `Session:  ${sessionTitle}`,
      `Date:     ${formatDate(bookingDate)}`,
      `Time:     ${formatTime(startTime)} – ${formatTime(endTime)} (${coachTimezone})`,
      `Guest:    ${guestName} (${guestEmail})`,
      '',
      '— CallSesh',
    ].join('\n'),
  })
}
