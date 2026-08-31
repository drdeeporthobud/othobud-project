import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'About Dr. Deep', href: '/about' },
  { label: 'Treatments', href: '/treatments' },
  { label: 'Patient Resources', href: '/patient-resources' },
  { label: 'Blog', href: '/blog' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
  { label: 'Track Booking', href: '/my-booking' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const navBg =
    scrolled || !isHome
      ? 'glass-nav shadow-sm'
      : 'bg-transparent'

  const linkColor =
    scrolled || !isHome ? 'text-navy hover:text-teal' : 'text-white/90 hover:text-white'

  const logoColor = scrolled || !isHome ? 'text-navy' : 'text-white'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal to-teal-dark flex items-center justify-center shadow-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <div className={`font-display font-800 text-lg leading-none transition-colors ${logoColor}`}>
                Orthobud
              </div>
              <div className={`text-xs font-medium transition-colors ${scrolled || !isHome ? 'text-navy-700' : 'text-white/60'}`}>
                Dr. Deep Chakraborty
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.href
                    ? scrolled || !isHome
                      ? 'text-teal bg-teal/8'
                      : 'text-white bg-white/15'
                    : linkColor
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Book CTA */}
          <div className="flex items-center gap-3">
            <Link
              to="/book-appointment"
              className="hidden lg:flex btn-primary text-sm py-2.5 px-5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Book Appointment
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled || !isHome ? 'text-navy' : 'text-white'}`}
              aria-label="Toggle menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-navy/98 backdrop-blur-lg border-t border-white/10 px-6 py-6 space-y-3 animate-fade-up">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                location.pathname === link.href ? 'text-teal bg-white/10' : 'text-white/80 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              to="/book-appointment"
              className="btn-primary w-full justify-center py-3 text-sm font-display font-700"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
