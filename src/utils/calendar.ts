export interface CalendarEvent {
  title: string
  description: string
  location: string
  startDate: string // YYYY-MM-DD
  timeSlot: string // e.g. "5:00 PM"
  durationMinutes?: number
}

// Helper to convert date and 12-hr time string to ISO-like Date object
function parseEventDateTime(
  dateStr: string,
  timeStr: string,
): { start: Date end: Date } {
  const [year, month, day] = dateStr.split("-").map(Number)
  const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)

  let hour = 17
  let minute = 0

  if (timeMatch) {
    let h = parseInt(timeMatch[1], 10)
    minute = parseInt(timeMatch[2], 10)
    const ampm = timeMatch[3].toUpperCase()

    if (ampm === "PM" && h < 12) h += 12
    if (ampm === "AM" && h === 12) h = 0
    hour = h
  }

  const start = new Date(year, month - 1, day, hour, minute, 0)
  const end = new Date(start.getTime() + 30 * 60 * 1000)

  return { start, end }
}

function formatDateToICS(d: Date): string {
  const pad = (n: number) => (n < 10 ? "0" + n : "" + n)
  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    "00"
  )
}

/**
 * Generate and trigger download of an .ics calendar file for Apple Calendar, Outlook, etc.
 */
export function downloadICSFile(event: CalendarEvent) {
  const { start, end } = parseEventDateTime(event.startDate, event.timeSlot)
  const startFormatted = formatDateToICS(start)
  const endFormatted = formatDateToICS(end)

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Orthobud//Dr. Deep Chakraborty Clinic//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:orthobud-${Date.now()}@orthobud.in`,
    `DTSTAMP:${formatDateToICS(new Date())}Z`,
    `DTSTART:${startFormatted}`,
    `DTEND:${endFormatted}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${event.location.replace(/,/g, "\\,")}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder: Orthopedic Consultation with Dr. Deep in 2 hours",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", `appointment-${event.startDate}.ics`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Generate direct Google Calendar Event URL
 */
export function getGoogleCalendarUrl(event: CalendarEvent): string {
  const { start, end } = parseEventDateTime(event.startDate, event.timeSlot)
  const startFormatted = formatDateToICS(start)
  const endFormatted = formatDateToICS(end)

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${startFormatted}/${endFormatted}`,
    details: event.description,
    location: event.location,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
