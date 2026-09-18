import { Link, useLocation } from 'react-router-dom'
import { MapPin } from 'lucide-react'

const quickLinks = [
  { label: 'About Dr. Deep', href: '/about' },
  { label: 'Treatments', href: '/treatments' },
  { label: 'Patient Resources', href: '/patient-resources' },
  { label: 'Blog & Articles', href: '/blog' },
  { label: 'Surgery Gallery', href: '/gallery' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Track Existing Booking', href: '/my-booking' },
]

const treatments = [
  { label: 'Knee Replacement', query: 'knee' },
  { label: 'Hip Replacement', query: 'hip' },
  { label: 'Arthroscopy & ACL', query: 'sports' },
  { label: 'Sports Medicine', query: 'sports' },
  { label: 'Fracture Care', query: 'trauma' },
  { label: 'Spine Care', query: 'spine' },
]

const footerClinics = [
  {
    name: 'Alexa Newtown',
    timing: 'Mon–Sat: 6 PM – 8 PM',
  },
  {
    name: 'Manipal Broadway (Salt Lake)',
    timing: 'Mon & Fri: 4 PM – 5 PM',
  },
  {
    name: 'Narayana Barasat',
    timing: 'Wed & Sat: 12 PM – 2 PM',
  },
  {
    name: 'Fortis (EM Bypass)',
    timing: 'Sat: 3 PM – 5 PM',
  },
  {
    name: 'Daffodil Laketown',
    timing: 'Wed: 7:30–9 PM · Sat: 10:30–11:30 AM',
  },
  {
    name: 'Apollo Clinic Newtown',
    timing: 'Tue, Thu, Fri, Sun: 4:30 PM – 6 PM',
  },
]

export default function Footer() {
  const location = useLocation()
  const hideCta = location.pathname === '/book-appointment' || location.pathname === '/admin'

  return (
    <footer className="bg-navy text-white">
      {/* Top CTA strip - Hidden on Booking & Admin pages */}
      {!hideCta && (
        <div className="bg-teal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 className="font-display font-700 text-lg sm:text-xl text-white">Ready to start your recovery journey?</h3>
              <p className="text-white/85 mt-1 text-xs sm:text-sm max-w-xl">
                Book a consultation with Dr. Deep Chakraborty across Newtown, Salt Lake, Barasat, Lake Town, or Anandapur.
              </p>
            </div>
            <Link
              to="/book-appointment"
              className="bg-white text-teal font-display font-700 px-7 py-3 rounded-xl hover:bg-soft-gray transition-all text-sm w-full sm:w-auto text-center justify-center inline-flex items-center gap-2 shadow-md hover:shadow-lg active:scale-98"
            >
              <span>Book Appointment</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-teal flex items-center justify-center shadow-md flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <div className="font-display font-800 text-lg leading-none">Orthobud</div>
                <div className="text-white/60 text-xs mt-0.5">Dr. Deep Chakraborty</div>
              </div>
            </div>
            <p className="text-white/65 text-xs sm:text-sm leading-relaxed mb-6">
              Specialized orthopedic surgery and joint restoration across Kolkata. Advanced minimally invasive & robotic care.
            </p>
            <div className="flex items-center gap-2.5">
              {['facebook', 'instagram', 'youtube', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-white/8 hover:bg-teal flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  aria-label={social}
                >
                  <SocialIcon name={social} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-700 text-xs uppercase tracking-widest text-white/50 mb-4 sm:mb-5">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/75 hover:text-white text-sm transition-colors hover:translate-x-0.5 inline-block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Treatments */}
          <div>
            <h4 className="font-display font-700 text-xs uppercase tracking-widest text-white/50 mb-4 sm:mb-5">Treatments</h4>
            <ul className="space-y-2">
              {treatments.map((t) => (
                <li key={t.label}>
                  <Link
                    to={`/treatments?category=${t.query}`}
                    className="text-white/75 hover:text-white text-sm transition-colors hover:translate-x-0.5 inline-block py-0.5"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-700 text-xs uppercase tracking-widest text-white/50 mb-4 sm:mb-5">Clinics in Kolkata</h4>
            <ul className="space-y-2">
              {footerClinics.map((clinic) => (
                <li key={clinic.name} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-3 h-3 text-sky-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white/95 text-xs font-semibold leading-snug">{clinic.name}</div>
                    <div className="text-white/55 text-[11px] mt-0.5 leading-snug">{clinic.timing}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
          <p className="text-white/45 text-xs leading-relaxed">
            © 2026 Orthobud · Dr. Deep Chakraborty (MS Ortho · Fellowships USA, Dubai & Kolkata). All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6 text-xs flex-wrap justify-center">
            <Link to="/my-booking" className="text-white/60 hover:text-white transition-colors py-1">
              Track Booking
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ name }: { name: string }) {
  if (name === 'facebook') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" fillOpacity="0.7">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  )
  if (name === 'instagram') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.7">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="white" fillOpacity="0.7" stroke="none" />
    </svg>
  )
  if (name === 'youtube') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" fillOpacity="0.7">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
      <polygon points="9.75,15.02 15.5,12 9.75,8.98" fill="#0F172A" />
    </svg>
  )
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" fillOpacity="0.7">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}
