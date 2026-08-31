import { Link, useLocation } from 'react-router-dom'

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

export default function Footer() {
  const location = useLocation()
  const hideCta = location.pathname === '/book-appointment' || location.pathname === '/admin'

  return (
    <footer className="bg-navy text-white">
      {/* Top CTA strip - Hidden on Booking & Admin pages */}
      {!hideCta && (
        <div className="bg-teal">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-700 text-xl text-white">Ready to start your recovery journey?</h3>
              <p className="text-white/80 mt-1 text-sm">
                Book a consultation with Dr. Deep Chakraborty across Salt Lake, Alipore, or Newtown.
              </p>
            </div>
            <Link
              to="/book-appointment"
              className="bg-white text-teal font-display font-700 px-7 py-3 rounded-xl hover:bg-soft-gray transition-colors text-sm whitespace-nowrap"
            >
              Book Appointment →
            </Link>
          </div>
        </div>
      )}

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-teal flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <div className="font-display font-800 text-lg leading-none">Orthobud</div>
                <div className="text-white/50 text-xs">Dr. Deep Chakraborty</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Specialized orthopedic surgery and joint restoration across Kolkata. Advanced minimally invasive & robotic care.
            </p>
            <div className="flex gap-3">
              {['facebook', 'instagram', 'youtube', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-teal flex items-center justify-center transition-colors"
                  aria-label={social}
                >
                  <SocialIcon name={social} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-700 text-sm uppercase tracking-widest text-white/40 mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors hover:translate-x-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Treatments */}
          <div>
            <h4 className="font-display font-700 text-sm uppercase tracking-widest text-white/40 mb-5">Treatments</h4>
            <ul className="space-y-2.5">
              {treatments.map((t) => (
                <li key={t.label}>
                  <Link
                    to={`/treatments?category=${t.query}`}
                    className="text-white/70 hover:text-white text-sm transition-colors hover:translate-x-0.5 inline-block"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-700 text-sm uppercase tracking-widest text-white/40 mb-5">Clinics in Kolkata</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                  📍
                </div>
                <div>
                  <div className="text-white/90 text-xs font-semibold">Salt Lake City (Sec 1)</div>
                  <div className="text-white/50 text-[11px]">Mon–Sat: 5 PM – 8 PM</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                  📍
                </div>
                <div>
                  <div className="text-white/90 text-xs font-semibold">Alipore (Woodlands)</div>
                  <div className="text-white/50 text-[11px]">Mon, Wed, Fri: 11 AM – 1 PM</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                  📍
                </div>
                <div>
                  <div className="text-white/90 text-xs font-semibold">Newtown (Axis Mall)</div>
                  <div className="text-white/50 text-[11px]">Tue, Thu: 6 PM – 9 PM</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar with discreet staff portal link */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © 2025 Orthobud · Dr. Deep Chakraborty (MS Ortho, DNB, Fellow Germany). All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs">
            <Link to="/my-booking" className="text-white/60 hover:text-white transition-colors">
              Track Booking
            </Link>
            <span className="text-white/20">·</span>
            <Link
              to="/admin"
              className="text-white/40 hover:text-teal transition-colors flex items-center gap-1"
              title="Doctor & Clinic Staff Management Portal"
            >
              <span>🔒</span> Staff Portal
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
