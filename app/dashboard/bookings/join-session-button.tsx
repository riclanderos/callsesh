'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Props {
  bookingId: string
  bookingDate: string   // "YYYY-MM-DD"
  startTime: string     // "HH:MM" or "HH:MM:SS"
  endTime: string       // "HH:MM" or "HH:MM:SS"
  formattedStartTime: string
}

function parseSessionDate(date: string, time: string): Date {
  const [year, month, day] = date.split('-').map(Number)
  const [h, m] = time.split(':').map(Number)
  return new Date(year, month - 1, day, h, m)
}

export default function JoinSessionButton({
  bookingId,
  bookingDate,
  startTime,
  endTime,
  formattedStartTime,
}: Props) {
  const [canJoin, setCanJoin] = useState(false)

  useEffect(() => {
    function check() {
      const now = new Date()
      const sessionStart = parseSessionDate(bookingDate, startTime)
      const sessionEnd   = parseSessionDate(bookingDate, endTime)
      const joinWindow   = new Date(sessionStart.getTime() - 10 * 60 * 1000)
      setCanJoin(now >= joinWindow && now <= sessionEnd)
    }
    check()
    const id = setInterval(check, 30_000)
    return () => clearInterval(id)
  }, [bookingDate, startTime, endTime])

  if (canJoin) {
    return (
      <Link
        href={`/session/${bookingId}`}
        className="inline-block rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
      >
        Join Session
      </Link>
    )
  }

  return (
    <span className="text-xs text-zinc-600">Starts at {formattedStartTime}</span>
  )
}
