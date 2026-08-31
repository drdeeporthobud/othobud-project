import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'

const clinics = [
  {
    name: 'Salt Lake Clinic',
    address: 'CF-140, Sector 1, Salt Lake City, Kolkata 700064',
    timing: 'Monday to Saturday: 5:00 PM – 8:00 PM',
    phone: '+91 98300 00001',
    whatsapp: '919830000001',
    landmark: 'Near Hyatt Regency, Salt Lake',
    mapEmbed: null,
  },
  {
    name: 'Alipore Clinic',
    address: '22B, Judges Court Road, Alipore, Kolkata 700027',
    timing: 'Monday, Wednesday, Friday: 11:00 AM – 1:00 PM',
    phone: '+91 98300 00002',
    whatsapp: '919830000002',
    landmark: 'Opposite Alipore Court, Near Zoological Garden',
    mapEmbed: null,
  },
  {
    name: 'Newtown Clinic',
    address: 'AA-III, Action Area III, Newtown, Kolkata 700135',
    timing: 'Tuesday & Thursday: 6:00 PM – 9:00 PM',
    phone: '+91 98300 00003',
    whatsapp: '919830000003',
    landmark: 'Near Eco Park Gate 2, Newtown',
    mapEmbed: null,
  },
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', message: '', clinic: '', subject: 'General Enquiry',
  })
  const [submitted, setSubmitted] = useState(false)
  const ref = useReveal()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="bg-navy py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="section-label" style={{ color: '#0EA5E9' }}>Get in Touch</div>
          <h1 className="font-display font-800 text-5xl text-white mt-2">Contact & Locations</h1>
          <p className="text-white/70 mt-4 max-w-lg mx-auto">
            Reach Dr. Deep's clinic team via phone, WhatsApp, or the enquiry form below. Same-day responses during clinic hours.
          </p>
        </div>
      </section>

      {/* Quick contact bar */}
      <div className="bg-teal">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            <a href="tel:+919830000000" className="flex items-center gap-2 text-white font-display font-600 text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              +91 98300 00000
            </a>
            <a href="https://wa.me/919830000000" className="flex items-center gap-2 text-white font-display font-600 text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <a href="mailto:dr.deep@orthobud.in" className="flex items-center gap-2 text-white font-display font-600 text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              dr.deep@orthobud.in
            </a>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.7">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Emergency: +91 98300 99999
            </div>
          </div>
        </div>
      </div>

      {/* Clinics */}
      <section className="py-16 bg-soft-gray" ref={ref}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="section-label mb-2 reveal">Consultation Locations</div>
          <h2 className="font-display font-800 text-4xl text-navy mb-10 reveal reveal-delay-1">
            Find a Clinic Near You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clinics.map((clinic, i) => (
              <div key={clinic.name} className={`reveal reveal-delay-${i + 2} bg-white rounded-2xl border border-border/50 overflow-hidden card-hover`}>
                {/* Map placeholder */}
                <div className="aspect-[16/9] bg-soft-gray relative overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-${i === 0 ? '1519494026892-80bbd2d6fd0d' : i === 1 ? '1516574187841-cb9cc2ca948b' : '1581056771107-24ca5f033842'}?w=500&h=280&fit=crop&auto=format`}
                    alt={clinic.name}
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-xl px-4 py-2 shadow-lg flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="text-xs font-display font-700 text-navy">{clinic.name}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-display font-700 text-navy text-lg">{clinic.name}</h3>
                  <div className="space-y-3 mt-4">
                    <div className="flex items-start gap-3">
                      <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <div>
                        <div className="text-navy-700 text-sm">{clinic.address}</div>
                        <div className="text-xs text-navy-700/60 mt-0.5">{clinic.landmark}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <div className="text-sm text-navy-700">{clinic.timing}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81" />
                      </svg>
                      <a href={`tel:${clinic.phone.replace(/\s/g, '')}`} className="text-sm text-navy-700 hover:text-teal transition-colors">{clinic.phone}</a>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-5">
                    <a
                      href={`https://wa.me/${clinic.whatsapp}`}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 text-green-700 border border-green-200 rounded-xl py-2.5 text-xs font-display font-700 hover:bg-green-100 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a6.27 6.27 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                      </svg>
                      WhatsApp
                    </a>
                    <Link
                      to={`/book-appointment?clinic=${encodeURIComponent(clinic.name)}`}
                      className="flex-1 btn-primary justify-center text-xs py-2.5"
                    >
                      Book Here
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="section-label mb-2">Send a Message</div>
              <h2 className="font-display font-800 text-4xl text-navy mb-6">Enquiry Form</h2>
              <p className="text-navy-700 leading-relaxed mb-8">
                For non-urgent enquiries, fill in the form and our team will respond within one business day. For urgent concerns, please call directly.
              </p>

              {submitted ? (
                <div className="bg-teal/10 border border-teal/30 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-teal/20 flex items-center justify-center mx-auto mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="font-display font-700 text-navy text-xl">Message Received</h3>
                  <p className="text-navy-700 text-sm mt-2">We'll respond within one business day.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-display font-700 text-navy uppercase tracking-wide block mb-1.5">Full Name *</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-border/60 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:border-teal"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-display font-700 text-navy uppercase tracking-wide block mb-1.5">Phone *</label>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full border border-border/60 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:border-teal"
                        placeholder="+91 98300 00000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-display font-700 text-navy uppercase tracking-wide block mb-1.5">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-border/60 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:border-teal"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-display font-700 text-navy uppercase tracking-wide block mb-1.5">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full border border-border/60 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:border-teal bg-white"
                    >
                      <option>General Enquiry</option>
                      <option>Book Appointment</option>
                      <option>Second Opinion</option>
                      <option>Insurance Query</option>
                      <option>Post-Surgery Query</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-display font-700 text-navy uppercase tracking-wide block mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full border border-border/60 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:border-teal resize-none"
                      placeholder="Describe your condition or question..."
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center">
                    Send Message →
                  </button>
                </form>
              )}
            </div>

            {/* Right: info */}
            <div className="space-y-6">
              <div className="bg-soft-gray rounded-2xl p-7">
                <h3 className="font-display font-700 text-navy text-lg mb-5">Clinic Hours & Emergency</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Salt Lake', time: 'Mon–Sat: 5 PM – 8 PM' },
                    { label: 'Alipore', time: 'Mon/Wed/Fri: 11 AM – 1 PM' },
                    { label: 'Newtown', time: 'Tue/Thu: 6 PM – 9 PM' },
                  ].map((loc) => (
                    <div key={loc.label} className="flex items-center justify-between text-sm">
                      <span className="font-display font-600 text-navy">{loc.label}</span>
                      <span className="text-navy-700">{loc.time}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="font-display font-700 text-navy">Emergency Line:</span>
                      <a href="tel:+919830099999" className="text-red-600 font-semibold">+91 98300 99999</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-soft-gray rounded-2xl p-7">
                <h3 className="font-display font-700 text-navy text-lg mb-4">Frequently Used Contacts</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Main Enquiries', val: '+91 98300 00000', type: 'phone' },
                    { label: 'WhatsApp Booking', val: '+91 98300 00000', type: 'whatsapp' },
                    { label: 'Email', val: 'dr.deep@orthobud.in', type: 'email' },
                  ].map((c) => (
                    <div key={c.label} className="flex items-center justify-between text-sm">
                      <span className="text-navy-700">{c.label}</span>
                      <span className="font-display font-600 text-teal">{c.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-soft-gray relative">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=450&fit=crop&auto=format"
                  alt="Clinic exterior"
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 flex items-end p-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                    <div className="text-xs text-navy-700">Primary Location</div>
                    <div className="font-display font-700 text-navy text-sm">Salt Lake Clinic, Kolkata</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
