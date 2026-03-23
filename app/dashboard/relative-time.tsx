'use client'

import { useEffect, useState } from 'react'

function fmtTime(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

function getRelative(bookingDate: string, startTime: string): string {
  const [y, mo, d] = bookingDate.split('-').map(Number)
  const [h, m] = startTime.split(':').map(Number)
  const target = new Date(y, mo - 1, d, h, m, 0)
  const diffMs = target.getTime() - Date.now()

  if (diffMs <= 0) return 'Starting now'

  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 60) return `In ${diffMin}m`

  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `In ${diffHr}h`

  const diffDay = Math.floor(diffHr / 24)
  return `In ${diffDay} day${diffDay === 1 ? '' : 's'}`
}

function getAbsolute(bookingDate: string, startTime: string, endTime: string): string {
  const [y, mo, d] = bookingDate.split('-').map(Number)
  const date = new Date(y, mo - 1, d)
  const label = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  return `${label} · ${fmtTime(startTime)} – ${fmtTime(endTime)}`
}

export default function RelativeTime({
  bookingDate,
  startTime,
  endTime,
}: {
  bookingDate: string
  startTime: string
  endTime: string
}) {
  const [relative, setRelative] = useState<string | null>(null)

  useEffect(() => {
    setRelative(getRelative(bookingDate, startTime))
    const id = setInterval(() => setRelative(getRelative(bookingDate, startTime)), 60_000)
    return () => clearInterval(id)
  }, [bookingDate, startTime])

  const absolute = getAbsolute(bookingDate, startTime, endTime)

  return (
    <p className="text-sm text-zinc-400">
      {relative && (
        <>
          <span className="font-medium text-indigo-300">{relative}</span>
          {' · '}
        </>
      )}
      {absolute}
    </p>
  )
}
