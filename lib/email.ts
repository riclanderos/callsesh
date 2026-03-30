import { resend } from './resend'
import { tzAbbr, convertTime } from './booking'

export interface BookingEmailParams {
  sessionTitle: string
  bookingDate: string    // "YYYY-MM-DD"
  startTime: string      // "HH:MM" or "HH:MM:SS"
  endTime: string        // "HH:MM" or "HH:MM:SS"
  guestName: string
  guestEmail: string
  coachEmail: string
  coachTimezone: string  // IANA timezone name, e.g. "America/New_York"
  guestTimezone?: string // IANA timezone name detected from the guest's browser
  guestSessionUrl: string
  guestCancelUrl: string
}

/** Formats a time range with timezone abbreviation, plus a guest-local line if timezones differ. */
function formatTimeBlock(
  bookingDate: string,
  startTime: string,
  endTime: string,
  coachTimezone: string,
  guestTimezone?: string
): string {
  const coachLine = `${formatTime(startTime)} – ${formatTime(endTime)} (${tzAbbr(coachTimezone)} · ${coachTimezone})`
  if (!guestTimezone || guestTimezone === coachTimezone) return coachLine
  const guestStart = convertTime(bookingDate, startTime, coachTimezone, guestTimezone)
  const guestEnd   = convertTime(bookingDate, endTime,   coachTimezone, guestTimezone)
  return `${coachLine}\n          ${formatTime(guestStart)} – ${formatTime(guestEnd)} (${tzAbbr(guestTimezone)} · your local time)`
}

function formatUSD(cents: number): string {
  return '$' + (cents / 100).toFixed(2)
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
    guestTimezone,
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
      `Time:     ${formatTimeBlock(bookingDate, startTime, endTime, coachTimezone, guestTimezone)}`,
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
  const { sessionTitle, bookingDate, startTime, endTime, guestName, guestEmail, coachTimezone, guestTimezone, guestSessionUrl } = params

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

export interface CancellationEmailParams {
  sessionTitle: string
  bookingDate: string
  startTime: string
  endTime: string
  guestName: string
  guestEmail: string
  coachEmail: string
  coachTimezone: string
}

export async function sendGuestCancelledByGuest(params: CancellationEmailParams): Promise<void> {
  const { sessionTitle, bookingDate, startTime, endTime, guestName, guestEmail, coachEmail, coachTimezone } = params
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: guestEmail,
    subject: 'Your session was cancelled',
    text: [
      `Hi ${guestName},`,
      '',
      'Your session has been cancelled.',
      '',
      `Session:  ${sessionTitle}`,
      `Date:     ${formatDate(bookingDate)}`,
      `Time:     ${formatTime(startTime)} – ${formatTime(endTime)} (${coachTimezone})`,
      `Coach:    ${coachEmail}`,
      '',
      'The time slot has been released.',
      '',
      '— CallSesh',
    ].join('\n'),
  })
}

export async function sendCoachGuestCancelled(params: CancellationEmailParams): Promise<void> {
  const { sessionTitle, bookingDate, startTime, endTime, guestName, guestEmail, coachEmail, coachTimezone } = params
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: coachEmail,
    subject: `Session cancelled — ${guestName}`,
    text: [
      `${guestName} has cancelled their session.`,
      '',
      `Session:  ${sessionTitle}`,
      `Date:     ${formatDate(bookingDate)}`,
      `Time:     ${formatTime(startTime)} – ${formatTime(endTime)} (${coachTimezone})`,
      `Guest:    ${guestName} (${guestEmail})`,
      '',
      'The time slot has been released.',
      '',
      '— CallSesh',
    ].join('\n'),
  })
}

export async function sendGuestCancelledByCoach(params: CancellationEmailParams): Promise<void> {
  const { sessionTitle, bookingDate, startTime, endTime, guestName, guestEmail, coachTimezone } = params
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: guestEmail,
    subject: 'Your session was cancelled by the coach',
    text: [
      `Hi ${guestName},`,
      '',
      'Your upcoming session has been cancelled by the coach.',
      '',
      `Session:  ${sessionTitle}`,
      `Date:     ${formatDate(bookingDate)}`,
      `Time:     ${formatTime(startTime)} – ${formatTime(endTime)} (${coachTimezone})`,
      '',
      'Please contact the coach if you have any questions.',
      '',
      '— CallSesh',
    ].join('\n'),
  })
}

export interface CoachNotificationParams {
  coachName: string
  coachEmail: string
  coachTimezone: string
  sessionTitle: string
  bookingDate: string
  startTime: string
  endTime: string
  durationMinutes: number
  guestName: string
  guestEmail: string
  clientMessage?: string
  totalAmountCents: number
  coachSessionUrl: string
  appUrl: string
}

export async function sendCoachNotification(params: CoachNotificationParams): Promise<void> {
  const {
    coachName,
    coachEmail,
    coachTimezone,
    sessionTitle,
    bookingDate,
    startTime,
    endTime,
    durationMinutes,
    guestName,
    guestEmail,
    clientMessage,
    totalAmountCents,
    coachSessionUrl,
    appUrl,
  } = params

  const platformFeeCents = Math.round(totalAmountCents * 0.1)
  const netAmountCents   = totalAmountCents - platformFeeCents

  const total   = formatUSD(totalAmountCents)
  const fee     = formatUSD(platformFeeCents)
  const net     = formatUSD(netAmountCents)
  const dateStr = formatDate(bookingDate)
  const timeStr = `${formatTime(startTime)} – ${formatTime(endTime)} (${coachTimezone})`

  const text = [
    `Hi ${coachName},`,
    '',
    `You've just received a new booking on CallSesh.`,
    '',
    'Session details',
    `Client:    ${guestName} (${guestEmail})`,
    `Session:   ${sessionTitle}`,
    `Date:      ${dateStr}`,
    `Time:      ${timeStr}`,
    `Duration:  ${durationMinutes} minutes`,
    ...(clientMessage ? ['', `Message from client: "${clientMessage}"`] : []),
    '',
    'Earnings',
    `Total paid:          ${total}`,
    `Platform fee (10%):  -${fee}`,
    `You'll receive:      ${net}`,
    '',
    'Your session is confirmed and ready.',
    'Join here:',
    coachSessionUrl,
    '',
    'Manage this booking and view your earnings from your dashboard.',
    `${appUrl}/dashboard`,
    '',
    'Need help? Contact support@callsesh.com',
    '',
    '— CallSesh',
  ].join('\n')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New booking confirmed</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;-webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="padding:32px 28px;font-family:system-ui,-apple-system,sans-serif;color:#18181b;font-size:15px;line-height:1.6;">
              <p style="margin:0 0 16px;">Hi ${coachName},</p>
              <p style="margin:0 0 24px;">You've just received a new booking on CallSesh.</p>

              <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#71717a;border-top:1px solid #e4e4e7;padding-top:20px;">Session details</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                <tr><td style="padding:3px 0;color:#71717a;width:120px;vertical-align:top;">Client</td><td style="padding:3px 0;color:#18181b;">${guestName}</td></tr>
                <tr><td style="padding:3px 0;color:#71717a;vertical-align:top;">Email</td><td style="padding:3px 0;color:#18181b;"><a href="mailto:${guestEmail}" style="color:#4f46e5;text-decoration:none;">${guestEmail}</a></td></tr>
                <tr><td style="padding:3px 0;color:#71717a;vertical-align:top;">Session</td><td style="padding:3px 0;color:#18181b;">${sessionTitle}</td></tr>
                <tr><td style="padding:3px 0;color:#71717a;vertical-align:top;">Date</td><td style="padding:3px 0;color:#18181b;">${dateStr}</td></tr>
                <tr><td style="padding:3px 0;color:#71717a;vertical-align:top;">Time</td><td style="padding:3px 0;color:#18181b;">${timeStr}</td></tr>
                <tr><td style="padding:3px 0;color:#71717a;vertical-align:top;">Duration</td><td style="padding:3px 0;color:#18181b;">${durationMinutes} minutes</td></tr>
                ${clientMessage ? `<tr><td style="padding:3px 0;color:#71717a;vertical-align:top;">Message</td><td style="padding:3px 0;color:#18181b;font-style:italic;">&ldquo;${clientMessage}&rdquo;</td></tr>` : ''}
              </table>

              <p style="margin:24px 0 10px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#71717a;border-top:1px solid #e4e4e7;padding-top:20px;">Earnings</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                <tr><td style="padding:3px 0;color:#71717a;">Total paid</td><td style="padding:3px 0;color:#18181b;text-align:right;">${total}</td></tr>
                <tr><td style="padding:3px 0;color:#71717a;">Platform fee (10%)</td><td style="padding:3px 0;color:#71717a;text-align:right;">&minus;${fee}</td></tr>
                <tr><td colspan="2" style="border-top:1px solid #e4e4e7;padding:0;line-height:0;font-size:0;">&nbsp;</td></tr>
                <tr><td style="padding:8px 0 3px;color:#18181b;font-weight:600;">You'll receive</td><td style="padding:8px 0 3px;color:#18181b;font-weight:600;text-align:right;">${net}</td></tr>
              </table>

              <div style="border-top:1px solid #e4e4e7;margin-top:20px;padding-top:20px;">
                <p style="margin:0 0 16px;font-size:14px;color:#18181b;">Your session is confirmed and ready.</p>
                <a href="${coachSessionUrl}" style="display:inline-block;background:#4f46e5;color:#ffffff;padding:11px 22px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;line-height:1;">Join session</a>
              </div>

              <p style="margin:24px 0 4px;font-size:13px;color:#71717a;">Manage this booking and view your earnings from your <a href="${appUrl}/dashboard" style="color:#4f46e5;text-decoration:none;">dashboard</a>.</p>
              <p style="margin:0;font-size:13px;color:#71717a;">Need help? Contact <a href="mailto:support@callsesh.com" style="color:#4f46e5;text-decoration:none;">support@callsesh.com</a></p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;background:#f4f4f5;border-top:1px solid #e4e4e7;font-family:system-ui,-apple-system,sans-serif;font-size:12px;color:#a1a1aa;text-align:center;">
              CallSesh &bull; Sent to ${coachEmail}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: coachEmail,
    subject: 'New booking confirmed',
    text,
    html,
  })
}
