export interface WhatsAppNotificationPayload {
  patientName: string
  clinicName: string
  clinicAddress: string
  date: string
  timeSlot: string
  bookingReference: string
  whatsappNumber?: string
}

/**
 * Generate a pre-filled WhatsApp click-to-chat URL for patients
 */
export function getWhatsAppConfirmationUrl(
  payload: WhatsAppNotificationPayload,
): string {
  const number = payload.whatsappNumber || "917980144046"
  const message = [
    `*Orthopedic Consultation Confirmed*`,
    `👨‍⚕️ *Doctor:* Dr. Deep Chakraborty (MS Ortho, Fellowships USA, Dubai, Kolkata)`,
    `📌 *Reference:* ${payload.bookingReference}`,
    `👤 *Patient:* ${payload.patientName}`,
    `🏥 *Clinic:* ${payload.clinicName}`,
    `📍 *Address:* ${payload.clinicAddress}`,
    `📅 *Date & Time:* ${payload.date} at ${payload.timeSlot}`,
    ``,
    `*Before you visit:*`,
    `Please bring any prior X-rays, MRI reports, prescriptions, and valid ID.`,
    ``,
    `Manage or view booking at: https://orthobud.in/my-booking?ref=${payload.bookingReference}`,
  ].join("\n")

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
