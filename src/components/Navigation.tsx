import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { Squash as Hamburger } from "hamburger-react"

const navLinks = [
  { label: "About Dr. Deep", href: "/about" },
  { label: "Treatments", href: "/treatments" },
  { label: "Patient Resources", href: "/patient-resources" },
  { label: "Blog", href: "/blog" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
  { label: "Track Booking", href: "/my-booking" },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === "/"
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    if (menuOpen) {
      window.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  const navBg = scrolled || !isHome ? "glass-nav shadow-xs" : "bg-transparent"

  const linkColor =
    scrolled || !isHome
      ? "text-navy hover:text-teal"
      : "text-white/90 hover:text-white"

  const logoColor = scrolled || !isHome ? "text-navy" : "text-white"

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 py-2.5">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group select-none"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-teal to-teal-dark flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="min-w-0">
              <div
                className={`font-display font-800 text-base sm:text-lg leading-none tracking-tight transition-colors ${logoColor}`}
              >
                Orthobud
              </div>
              <div
                className={`text-[11px] sm:text-xs font-medium transition-colors truncate max-w-[140px] xs:max-w-none ${
                  scrolled || !isHome ? "text-navy-700" : "text-white/70"
                }`}
              >
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
                      ? "text-teal bg-teal/8 font-semibold"
                      : "text-white bg-white/15 font-semibold"
                    : linkColor
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Booking Appointment CTA: Completely removed from mobile/tablet navigation, ONLY rendered on desktop lg+ */}
            <div className="hidden lg:block">
              <Link
                to="/book-appointment"
                className="btn-primary text-sm py-2.5 px-5"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Book Appointment
              </Link>
            </div>

            {/* Mobile Squash Hamburger Menu Button */}
            <div className="lg:hidden flex items-center">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl transition-all border flex items-center justify-center overflow-hidden ${
                  scrolled || !isHome
                    ? "border-slate-200/90 bg-white/90 shadow-2xs hover:bg-slate-100"
                    : "border-white/25 bg-white/10 hover:bg-white/20"
                }`}
              >
                <div className="scale-[0.68] sm:scale-[0.72] flex items-center justify-center flex-shrink-0">
                  <Hamburger
                    toggled={menuOpen}
                    toggle={setMenuOpen}
                    size={22}
                    distance="sm"
                    duration={0.35}
                    rounded
                    color={scrolled || !isHome ? "#0F172A" : "#FFFFFF"}
                    label="Toggle navigation menu"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 top-16 sm:top-18 bg-navy/60 backdrop-blur-xs z-40 lg:hidden animate-fade-in"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Panel */}
      {menuOpen && (
        <div
          ref={drawerRef}
          className="relative z-50 lg:hidden bg-navy/98 backdrop-blur-xl border-t border-white/10 px-4 sm:px-6 py-5 shadow-2xl animate-fade-up max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <div className="space-y-1.5">
            {navLinks.map((link) => {
              const active = location.pathname === link.href
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium min-h-[44px] transition-colors ${
                    active
                      ? "text-teal bg-white/10 font-semibold"
                      : "text-white/85 hover:text-white hover:bg-white/5 active:bg-white/10"
                  }`}
                >
                  <span>{link.label}</span>
                  <span
                    className={`text-xs ${
                      active ? "text-teal" : "text-white/40"
                    }`}
                  >
                    →
                  </span>
                </Link>
              )
            })}
          </div>

          <div className="pt-4 mt-3 border-t border-white/10 space-y-2.5">
            <Link
              to="/book-appointment"
              className="btn-primary w-full justify-center py-3.5 text-sm font-display font-700 min-h-[44px]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Book Appointment Now
            </Link>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="tel:+917980144046"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/8 hover:bg-white/12 text-white text-xs font-medium border border-white/10 min-h-[44px] transition-colors group"
              >
                <img
                  src="/icons/svg/call-icon.svg"
                  alt="Call Clinic"
                  className="w-4 h-4 object-contain brightness-0 invert group-hover:scale-110 transition-transform"
                />
                <span>Call Clinic</span>
              </a>
              <a
                href="https://wa.me/917980144046"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-medium border border-emerald-500/30 min-h-[44px] transition-colors group"
              >
                <img
                  src="/icons/svg/whatsapp-icon.svg"
                  alt="WhatsApp"
                  className="w-4 h-4 object-contain group-hover:scale-110 transition-transform"
                />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
