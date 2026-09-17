import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal, useCountUp } from '../hooks/useReveal'
import { posts as allBlogPosts, type BlogPost } from '../data/blogData'

const drDeepHero = '/images/doctor/dr-deep-hero.webp'
const drDeepRbg = '/images/doctor/dr-deep-portrait-cutout.webp'
const drDeep1 = '/images/doctor/dr-deep-full.webp'

function StatCard({
  value,
  suffix = '',
  label,
  delay = 0,
}: {
  value: number
  suffix?: string
  label: string
  delay?: number
}) {
  const numRef = useCountUp(value)
  return (
    <div
      className={`reveal reveal-delay-${delay} bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 lg:p-6 shadow-xs border border-border/60 text-center card-hover flex flex-col justify-center min-w-0`}
    >
      <div className="text-2xl sm:text-3xl font-display font-800 text-navy tracking-tight truncate">
        <span ref={numRef}>0</span>
        <span>{suffix}</span>
      </div>
      <div className="text-xs sm:text-sm text-navy-700 mt-1 font-medium leading-tight line-clamp-2">{label}</div>
    </div>
  )
}

const conditions = [
  {
    image: '/icons/png/symptoms/kneepain.webp',
    label: 'Knee Pain',
    desc: 'Osteoarthritis, ligament tears, meniscus injuries',
    bgGradient: 'from-[#e0f2fe]/70 via-[#ebf5fe]/85 to-[#f0f8ff]',
    borderColor: 'border-sky-100/90',
  },
  {
    image: '/icons/png/symptoms/hippain.webp',
    label: 'Hip Pain',
    desc: 'Labral tears, hip arthritis, bursitis',
    bgGradient: 'from-[#ffedd5]/60 via-[#fff3e8]/85 to-[#fff7ed]',
    borderColor: 'border-amber-100/90',
  },
  {
    image: '/icons/png/symptoms/shoulderpain.webp',
    label: 'Shoulder Pain',
    desc: 'Rotator cuff, frozen shoulder, dislocations',
    bgGradient: 'from-[#dcfce7]/60 via-[#ecfdf3]/85 to-[#f0fdf4]',
    borderColor: 'border-emerald-100/90',
  },
  {
    image: '/icons/png/symptoms/sports.webp',
    label: 'Sports Injuries',
    desc: 'ACL tears, cartilage damage, stress fractures',
    bgGradient: 'from-[#fef3c7]/60 via-[#fff8ed]/85 to-[#fffbeb]',
    borderColor: 'border-amber-100/90',
  },
  {
    image: '/icons/png/symptoms/fracture.webp',
    label: 'Fractures',
    desc: 'Complex fractures, non-unions, deformities',
    bgGradient: 'from-[#ede9fe]/60 via-[#f4f2ff]/85 to-[#f8f7ff]',
    borderColor: 'border-indigo-100/90',
  },
  {
    image: '/icons/png/symptoms/backpain.webp',
    label: 'Back Pain',
    desc: 'Disc herniation, sciatica, spinal stenosis',
    bgGradient: 'from-[#e0f2fe]/70 via-[#ebf6ff]/85 to-[#f0f9ff]',
    borderColor: 'border-sky-100/90',
  },
]

const treatments = [
  {
    title: 'Robotic Joint Replacement',
    desc: 'Precision-guided robotic surgery for knee and hip replacement with faster recovery.',
    image: '/icons/png/specialties/robotic-joint-replacement.webp',
  },
  {
    title: 'Arthroscopy',
    desc: 'Minimally invasive joint surgery with tiny incisions and rapid recovery.',
    image: '/icons/png/specialties/arthroscopy.webp',
  },
  {
    title: 'Sports Medicine',
    desc: 'Advanced care for athletes — from diagnosis to return-to-play rehabilitation.',
    image: '/icons/png/specialties/sports-medicine.webp',
  },
  {
    title: 'Trauma Surgery',
    desc: 'Expert management of complex fractures and polytrauma cases.',
    image: '/icons/png/specialties/trauma-surgery.webp',
  },
  {
    title: 'Revision Surgery',
    desc: 'Corrective procedures for failed joint replacements and implant complications.',
    image: '/icons/png/specialties/revision-surgery.webp',
  },
  {
    title: 'Pediatric Orthopedics',
    desc: "Specialized care for children's bone and joint conditions.",
    image: '/icons/png/specialties/pediatric-orthopedics.webp',
  },
]

const whyItems = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 19a5 5 0 0 0-5-5H5a5 5 0 0 0-5 5v1" />
        <circle cx="7.5" cy="7" r="3.5" />
        <line x1="18" y1="16" x2="18" y2="22" />
        <line x1="15" y1="19" x2="21" y2="19" />
      </svg>
    ),
    title: 'Personalized Treatment',
    desc: 'Every patient receives a care plan tailored to their unique anatomy, lifestyle and goals.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h6" />
        <path d="M13 2l5 5v5" />
        <path d="M13 2v5h5" />
        <line x1="8" y1="9" x2="11" y2="9" />
        <line x1="8" y1="13" x2="13" y2="13" />
        <circle cx="17.5" cy="17.5" r="4.2" />
        <path d="M15.8 17.5l1.2 1.2 2.3-2.4" />
      </svg>
    ),
    title: 'Evidence-Based Care',
    desc: 'Treatment decisions grounded in current research and global best practices.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5c0 4.418-4.03 8-9 8a9.86 9.86 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 14.7 3 13.2 3 11.5 3 7.082 7.03 3.5 12 3.5s9 3.582 9 8z" />
      </svg>
    ),
    title: 'Transparent Communication',
    desc: 'Clear explanations at every step — you always know your diagnosis and options.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 2v6c0 1.5-1.8 2.5-1.8 4 0 1 1.2 1.5 2.8 1.5s2-.7 2-1.5c0 .8.8 1.5 2 1.5s2.8-.5 2.8-1.5c0-1.5-1.8-2.5-1.8-4V2" />
        <path d="M7.2 15.5c0-1 1.2-1.5 2.8-1.5s2 .7 2 1.5c0-.8.8-1.5 2-1.5s2.8.5 2.8 1.5c0 1.5-1.8 2.5-1.8 4V22h-6v-2.5c0-1.5-1.8-2.5-1.8-4z" />
      </svg>
    ),
    title: 'Advanced Surgical Expertise',
    desc: 'Fellowship-trained with proficiency in robotic, arthroscopic and revision procedures.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4.5" r="2" />
        <path d="M9.5 9l2.5-2 3 1.5 2 3" />
        <path d="M12 7v5l-3 4-2-1" />
        <path d="M12 12l3 3.5 1.5 4" />
        <path d="M4.5 17c3.5 3.5 11 3.5 15-.5" />
      </svg>
    ),
    title: 'Complete Rehabilitation',
    desc: 'Structured recovery support from post-surgery day one through full return to activity.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <line x1="12" y1="8" x2="12" y2="14" />
        <line x1="9" y1="11" x2="15" y2="11" />
      </svg>
    ),
    title: 'Hospital-Grade Safety',
    desc: 'Procedures performed in accredited hospitals with world-class infection control standards.',
  },
]

const journeySteps = [
  { num: '01', label: 'Consultation', desc: 'Detailed history and physical examination' },
  { num: '02', label: 'Diagnosis', desc: 'X-rays, MRI and advanced imaging review' },
  { num: '03', label: 'Treatment Plan', desc: 'Personalized surgical or non-surgical pathway' },
  { num: '04', label: 'Surgery', desc: 'Precision-guided procedure in accredited theatre' },
  { num: '05', label: 'Recovery', desc: 'Structured post-operative care and monitoring' },
  { num: '06', label: 'Rehabilitation', desc: 'Physiotherapy and functional restoration' },
  { num: '07', label: 'Follow-up', desc: 'Long-term wellness and preventive guidance' },
]

const testimonials = [
  {
    name: 'Sudipta Banerjee',
    age: 58,
    procedure: 'Knee Replacement',
    text: "I walked without pain for the first time in five years within 6 weeks of surgery. Dr. Deep's calm reassurance before the operation made all the difference.",
    stars: 5,
    img: 'https://images.unsplash.com/photo-1547212371-eb5e6a4b590c?w=80&h=80&fit=crop&auto=format',
  },
  {
    name: 'Rohit Sharma',
    age: 28,
    procedure: 'ACL Reconstruction',
    text: "As a competitive footballer, returning to the pitch after an ACL tear felt impossible. Thanks to Dr. Deep and his team, I was back on the field in 9 months.",
    stars: 5,
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format',
  },
  {
    name: 'Pratima Dey',
    age: 65,
    procedure: 'Hip Replacement',
    text: "The robotic surgery meant I was up and walking the very next day. I wish I had come to Dr. Deep years ago instead of suffering in silence.",
    stars: 5,
    img: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=80&h=80&fit=crop&auto=format',
  },
]

const faqs = [
  {
    q: 'Do I need a referral to see Dr. Deep Chakraborty?',
    a: "No referral is needed. You can book a consultation directly through this website, by calling the clinic, or via WhatsApp.",
  },
  {
    q: 'How long is the typical wait time for an appointment?',
    a: "Most patients receive an appointment within 2–3 working days. Urgent cases are accommodated at the earliest available slot.",
  },
  {
    q: 'What should I bring to my first consultation?',
    a: "Please bring any prior X-rays, MRI or CT reports, a list of current medications, your ID proof, and previous prescription records if available.",
  },
]

const blogPosts: BlogPost[] = [
  allBlogPosts.find((p) => p.title.toLowerCase().includes('osteoarthritis')) ?? allBlogPosts[1],
  allBlogPosts.find((p) => p.title.toLowerCase().includes('robotic surgery')) ?? allBlogPosts[0],
  allBlogPosts.find((p) => p.title.toLowerCase().includes('acl injury')) ?? allBlogPosts[2],
]

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&h=400&fit=crop&auto=format', label: 'Operating Theatre' },
  { src: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=600&h=400&fit=crop&auto=format', label: 'Consultation' },
  { src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop&auto=format', label: 'Medical Conference' },
  { src: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=600&h=400&fit=crop&auto=format', label: 'Patient Awareness' },
  { src: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=400&fit=crop&auto=format', label: 'Clinic Facility' },
  { src: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=400&fit=crop&auto=format', label: 'Professional' },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-border/60 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-soft-gray transition-colors"
      >
        <span className="font-display font-600 text-navy text-sm">{q}</span>
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.5"
          className={`flex-shrink-0 ml-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-navy-700 leading-relaxed border-t border-border/40 pt-4 bg-soft-gray/50">
          {a}
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useReveal()
  const aboutRef = useReveal()
  const conditionsRef = useReveal()
  const treatRef = useReveal()
  const whyRef = useReveal()
  const journeyRef = useReveal()
  const testimonialsRef = useReveal()
  const blogRef = useReveal()
  const galleryRef = useReveal()
  const faqRef = useReveal()
  const contactRef = useReveal()

  // Appointment widget state
  const [clinic, setClinic] = useState('')
  const [date, setDate] = useState('')

  // Parallax for hero
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const handleScroll = () => {
      const y = window.scrollY
      el.style.backgroundPositionY = `${y * 0.3}px`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen bg-navy overflow-hidden flex items-center"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(2,132,199,0.18) 0%, transparent 70%)',
        }}
      >
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 bg-center bg-cover pointer-events-none"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&h=900&fit=crop&auto=format)',
            opacity: 0.08,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20 w-full">
          {/* ── Mobile & Tablet Single-Column Natural Flow Layout (< 1024px) ── */}
          <div className="lg:hidden flex flex-col space-y-4 xs:space-y-5 w-full">
            {/* 1. Specialist Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B2548]/90 border border-sky-400/30 shadow-sm whitespace-nowrap w-fit">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse flex-shrink-0" />
              <span className="text-sky-400 text-xs font-display font-bold tracking-wide uppercase">
                Orthopedic Specialist · Kolkata
              </span>
            </div>

            {/* 2. Heading */}
            <h1 className="font-display font-800 text-white leading-[1.12] tracking-tight text-[clamp(1.75rem,7vw,2.5rem)]">
              Restoring Movement.
              <br />
              <span className="text-[#38BDF8]">Renewing Lives.</span>
            </h1>

            {/* 3. Description */}
            <p className="text-white/80 text-[clamp(0.8125rem,3.2vw,0.9375rem)] leading-relaxed max-w-xl">
              Dr. Deep Chakraborty brings world-class orthopedic expertise to Kolkata — combining
              fellowship-trained surgical precision with compassionate, patient-first care.
            </p>

            {/* 4. Doctor Image (in normal flow, visual right alignment, occupying its own layout space, never overlapping) */}
            <div className="flex justify-end w-full py-1">
              <div className="w-[68%] xs:w-[60%] sm:w-[50%] max-w-[260px] [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]">
                <img
                  src={drDeepRbg}
                  alt="Dr. Deep Chakraborty — Orthopedic Surgeon"
                  className="w-full h-auto object-contain select-none drop-shadow-xl"
                />
              </div>
            </div>

            {/* 5 & 6. Doctor Credentials & Stats Card */}
            <div className="bg-[#0c2242]/85 backdrop-blur-md border border-sky-400/30 rounded-2xl p-4 sm:p-5 shadow-xl w-full">
              {/* Doctor Credentials */}
              <div className="text-white font-display font-700 text-[clamp(1rem,4vw,1.25rem)] leading-tight">
                Dr. Deep Chakraborty
              </div>
              <div className="text-sky-300 text-[clamp(0.75rem,3vw,0.875rem)] font-medium mt-1">
                MS (Ortho) · DNB · Fellowship Germany
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-white/15 my-3.5" />

              {/* Stats */}
              <div className="grid grid-cols-2 items-center">
                <div className="pr-3">
                  <div className="text-[#38BDF8] font-display font-800 text-[clamp(1.25rem,5vw,1.5rem)] leading-none">
                    5,000+
                  </div>
                  <div className="text-slate-300 text-xs mt-1 font-medium">
                    Surgeries
                  </div>
                </div>
                <div className="pl-4 border-l border-white/15">
                  <div className="text-[#38BDF8] font-display font-800 text-[clamp(1.25rem,5vw,1.5rem)] leading-none">
                    15+
                  </div>
                  <div className="text-slate-300 text-xs mt-1 font-medium">
                    Yrs Experience
                  </div>
                </div>
              </div>
            </div>

            {/* 7. Book Appointment & Meet Dr. Deep CTAs */}
            <div className="pt-2">
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3.5 w-full">
                <Link
                  to="/book-appointment"
                  className="btn-primary w-full sm:w-auto justify-center py-3.5 px-6 min-h-[44px] text-sm font-semibold shadow-lg shadow-teal/20"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Book Appointment
                </Link>
                <Link
                  to="/about"
                  className="btn-outline w-full sm:w-auto justify-center py-3.5 px-6 min-h-[44px] text-sm font-semibold"
                >
                  Meet Dr. Deep
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* ── Desktop Hero Layout (>= 1024px) ── */}
          <div className="hidden lg:grid grid-cols-2 gap-16 items-center">
            {/* Desktop Left Column */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal/15 border border-teal/25 mb-8 animate-fade-up">
                <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                <span className="text-teal text-xs font-display font-700 tracking-wide uppercase">
                  Orthopedic Specialist · Kolkata
                </span>
              </div>

              <h1
                className="font-display font-800 text-white leading-[1.1] animate-fade-up text-5xl lg:text-6xl tracking-tight"
                style={{ animationDelay: '0.1s' }}
              >
                Restoring Movement.
                <br />
                <span className="text-teal-light">Renewing Lives.</span>
              </h1>

              <p
                className="text-white/75 text-lg leading-relaxed mt-6 max-w-lg animate-fade-up"
                style={{ animationDelay: '0.2s' }}
              >
                Dr. Deep Chakraborty brings world-class orthopedic expertise to Kolkata — combining
                fellowship-trained surgical precision with compassionate, patient-first care.
              </p>

              {/* CTAs */}
              <div
                className="flex flex-row gap-4 mt-10 animate-fade-up"
                style={{ animationDelay: '0.3s' }}
              >
                <Link to="/book-appointment" className="btn-primary py-3.5 px-6 min-h-[44px]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Book Appointment
                </Link>
                <Link to="/about" className="btn-outline py-3.5 px-6 min-h-[44px]">
                  Meet Dr. Deep
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>

              {/* Quick trust metrics */}
              <div
                className="flex flex-wrap items-center gap-x-5 gap-y-2.5 mt-10 animate-fade-up text-sm text-white/70"
                style={{ animationDelay: '0.4s' }}
              >
                {['15+ Years Experience', '5,000+ Surgeries', 'MBBS · MS · DNB'].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Doctor image + floating card */}
            <div className="relative">
              {/* Image frame */}
              <div className="relative w-full aspect-[4/5] max-w-md mx-auto">
                <div
                  className="absolute -inset-4 rounded-3xl opacity-20"
                  style={{ background: 'radial-gradient(ellipse, #0EA5E9 0%, transparent 70%)' }}
                />
                <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-navy-800">
                  <img
                    src={drDeepHero}
                    alt="Dr. Deep Chakraborty — Orthopedic Surgeon"
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Name card overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy via-navy/80 to-transparent p-6">
                    <div className="text-white font-display font-700 text-xl">Dr. Deep Chakraborty</div>
                    <div className="text-teal-light text-sm mt-1">MS (Ortho) · DNB · Fellowship in Arthroplasty</div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -left-6 top-12 glass-card rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal/20 flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-display font-700 text-lg leading-none">5,000+</div>
                      <div className="text-white/60 text-xs">Successful Surgeries</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating appointment widget */}
              <div className="absolute -right-4 bottom-8 glass-card rounded-2xl p-5 shadow-2xl w-56">
                <div className="text-white font-display font-700 text-sm mb-4">Quick Appointment</div>
                <div className="space-y-3">
                  <select
                    value={clinic}
                    onChange={(e) => setClinic(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xs placeholder-white/40 focus:outline-none focus:border-teal"
                  >
                    <option value="" className="text-navy">Select Clinic</option>
                    <option value="salt-lake" className="text-navy">Salt Lake Clinic</option>
                    <option value="alipore" className="text-navy">Alipore Clinic</option>
                    <option value="newtown" className="text-navy">Newtown Clinic</option>
                  </select>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-teal"
                  />
                  <Link
                    to={`/book-appointment${clinic ? `?clinic=${clinic}&date=${date}` : ''}`}
                    className="block w-full text-center bg-teal hover:bg-teal-dark text-white text-xs font-display font-700 py-2.5 rounded-lg transition-colors shadow-md"
                  >
                    Book Now →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator (Hidden on tiny phones to maximize viewport space) */}
        <div className="hidden sm:flex absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1s' }}>
          <span className="text-white/40 text-[10px] sm:text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── Trust & Credentials ── */}
      <section className="bg-soft-gray py-12 sm:py-16" ref={statsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <div className="section-label reveal">Credentials & Trust</div>
            <h2 className="font-display font-800 text-2xl sm:text-3xl text-navy mt-2 reveal reveal-delay-1">
              Trusted by Thousands of Patients
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
            <StatCard value={15} suffix="+" label="Years Experience" delay={1} />
            <StatCard value={5000} suffix="+" label="Successful Surgeries" delay={2} />
            <StatCard value={8} label="Hospital Affiliations" delay={3} />
            <StatCard value={12} label="Awards & Honours" delay={4} />
            <StatCard value={4800} suffix="+" label="Verified Reviews" delay={5} />
            <StatCard value={98} suffix="%" label="Patient Satisfaction" delay={6} />
          </div>

          {/* Credential badges */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3.5 mt-6 sm:mt-8 reveal">
            {['MBBS · IPGMER', 'MS (Orthopedics)', 'DNB (Ortho)', 'Fellowship – Arthroplasty (Germany)', 'MCI Registered', 'ISAKOS Member'].map((c) => (
              <div key={c} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full border border-border/60 text-xs sm:text-sm text-navy-700 font-medium shadow-2xs">
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet Dr. Deep ── */}
      <section className="py-14 sm:py-20 bg-white" ref={aboutRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
            <div className="relative reveal">
              <div className="aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-soft-gray">
                <img
                  src={drDeep1}
                  alt="Dr. Deep Chakraborty in consultation"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating quote */}
              <div className="absolute -bottom-4 right-2 sm:-bottom-6 sm:-right-6 bg-gradient-to-br from-teal via-teal to-teal-dark text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl shadow-teal/35 border border-white/25 backdrop-blur-md max-w-[calc(100%-1.5rem)] xs:max-w-[270px] sm:max-w-[300px]">
                <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white/40 mb-1.5 sm:mb-2 fill-current" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="font-display font-700 italic text-xs sm:text-base leading-snug text-white tracking-tight">
                  “My purpose is to restore what pain has taken away.”
                </p>
                <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-white/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-light animate-pulse" />
                  <span className="text-white/90 text-[10px] sm:text-xs font-display font-bold tracking-wide uppercase">
                    Dr. Deep Chakraborty
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="section-label reveal">About</div>
              <h2 className="font-display font-800 text-3xl sm:text-4xl text-navy mt-2 leading-tight reveal reveal-delay-1">
                Meet Dr. Deep<br />Chakraborty
              </h2>
              <div className="w-12 h-1 bg-teal rounded mt-4 reveal reveal-delay-2" />
              <p className="text-navy-700 leading-relaxed mt-5 sm:mt-6 text-sm sm:text-base reveal reveal-delay-2">
                Dr. Deep Chakraborty is a fellowship-trained orthopedic surgeon based in Kolkata with over 15 years of clinical experience. After completing his post-graduation from IPGMER, he pursued advanced fellowship training in Joint Arthroplasty in Germany, gaining expertise in robotic-assisted surgeries.
              </p>
              <p className="text-navy-700 leading-relaxed mt-3.5 sm:mt-4 text-sm sm:text-base reveal reveal-delay-3">
                His practice philosophy centers on listening carefully to each patient, explaining every diagnosis in plain language, and developing treatment plans that respect their individual circumstances and goals.
              </p>

              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8 reveal reveal-delay-3">
                {[
                  { label: 'Specialization', value: 'Joint Replacement & Arthroscopy' },
                  { label: 'Training', value: 'IPGMER + Germany Fellowship' },
                  { label: 'Languages', value: 'Bengali, Hindi, English' },
                  { label: 'Practice', value: 'Kolkata, West Bengal' },
                ].map((item) => (
                  <div key={item.label} className="bg-soft-gray rounded-xl p-3.5 sm:p-4">
                    <div className="text-[11px] sm:text-xs text-navy-700 font-medium uppercase tracking-wide">{item.label}</div>
                    <div className="text-navy font-display font-700 text-xs sm:text-sm mt-0.5">{item.value}</div>
                  </div>
                ))}
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 mt-6 sm:mt-8 text-teal font-display font-700 hover:gap-3 transition-all reveal reveal-delay-4 text-sm sm:text-base"
              >
                View Complete Profile
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Conditions ── */}
      <section className="relative py-14 sm:py-20 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] overflow-hidden" ref={conditionsRef}>
        {/* Background decorative runner on left */}
        <div className="absolute top-2 left-0 sm:left-4 w-40 sm:w-64 h-36 sm:h-52 opacity-15 pointer-events-none select-none mix-blend-multiply overflow-hidden">
          <img
            src="/icons/png/symptoms/sports.webp"
            alt=""
            className="w-full h-full object-cover object-left filter contrast-125 brightness-110 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
          />
        </div>

        {/* Script text on left: "Stronger Everyday" (Hidden on mobile/tablet to avoid collision) */}
        <div className="hidden xl:block absolute top-10 left-8 xl:left-14 rotate-[-12deg] select-none pointer-events-none">
          <div className="font-script text-3xl xl:text-4xl text-teal font-bold leading-tight drop-shadow-xs tracking-wide">
            Stronger<br />Everyday
          </div>
        </div>

        {/* Script text on right: "Move Better Live Brighter" (Hidden on mobile/tablet to avoid collision) */}
        <div className="hidden xl:block absolute top-8 right-8 xl:right-14 rotate-[-8deg] select-none pointer-events-none text-right">
          <div className="font-script text-3xl xl:text-4xl text-teal font-bold leading-tight drop-shadow-xs tracking-wide">
            Move Better<br />Live Brighter
          </div>
          <svg className="w-28 sm:w-36 h-4 text-teal/70 mt-1 ml-auto" viewBox="0 0 120 18" fill="none">
            <path d="M4 14C40 4 85 5 116 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center gap-2.5 sm:gap-3 mb-2.5 reveal">
              <span className="w-6 sm:w-8 h-[2px] bg-teal rounded-full" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-teal uppercase">
                Conditions We Treat
              </span>
              <span className="w-6 sm:w-8 h-[2px] bg-teal rounded-full" />
            </div>

            <h2 className="font-display font-800 text-3xl sm:text-4xl lg:text-5xl text-navy mt-1 reveal reveal-delay-1 tracking-tight">
              From Pain to <span className="text-teal">Recovery</span>
            </h2>

            <p className="text-navy-700 mt-2.5 sm:mt-3.5 max-w-xl mx-auto text-xs sm:text-base leading-relaxed reveal reveal-delay-2 font-normal">
              Comprehensive orthopedic care for a wide range of bone, joint and soft tissue conditions. Get the right diagnosis and the right treatment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {conditions.map((c, i) => (
              <Link
                to="/treatments"
                key={c.label}
                className={`reveal reveal-delay-${(i % 6) + 1} group relative flex items-stretch min-h-[150px] sm:min-h-[175px] h-auto rounded-2xl sm:rounded-[24px] overflow-hidden border ${c.borderColor} bg-gradient-to-r ${c.bgGradient} shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_28px_-6px_rgba(2,132,199,0.18)] hover:-translate-y-0.5 transition-all duration-300 block`}
              >
                {/* Image on left */}
                <div className="w-[38%] sm:w-[42%] relative flex-shrink-0 h-full overflow-hidden min-h-[140px]">
                  <img
                    src={c.image}
                    alt={c.label}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                    style={{
                      maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)',
                      WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)',
                    }}
                  />
                </div>

                {/* Content on right */}
                <div className="flex-1 flex flex-col justify-center py-3 pr-3.5 pl-2 sm:py-4 sm:pr-5 sm:pl-2 z-10 min-w-0">
                  <h3 className="font-display font-800 text-navy text-base sm:text-xl tracking-tight group-hover:text-teal transition-colors truncate">
                    {c.label}
                  </h3>
                  <p className="text-navy-700/80 text-[11px] sm:text-xs leading-relaxed mt-1 line-clamp-2">
                    {c.desc}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal mt-2 sm:mt-3 group-hover:text-teal-dark group-hover:gap-2.5 transition-all">
                    <span>Learn More</span>
                    <span className="text-sm sm:text-base leading-none">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Explore Button */}
          <div className="text-center mt-8 sm:mt-12 reveal">
            <Link
              to="/treatments"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-teal hover:bg-teal-dark text-white text-xs sm:text-base font-display font-700 rounded-xl shadow-lg shadow-teal/25 hover:shadow-teal/40 transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto"
            >
              <span>Explore All Conditions</span>
              <span>→</span>
            </Link>
          </div>

          {/* Bottom decorative tagline */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 text-[9px] xs:text-[10px] sm:text-xs font-semibold tracking-[0.08em] xs:tracking-[0.12em] sm:tracking-[0.18em] text-navy-700/60 uppercase mt-8 sm:mt-10 reveal text-center flex-wrap px-2">
            <span className="hidden sm:inline-block w-8 sm:w-12 h-px bg-border" />
            <span className="inline-flex items-center flex-wrap justify-center gap-x-2 gap-y-1">
              <span>PERSONALISED CARE</span>
              <span className="text-teal/60 font-normal">|</span>
              <span>BETTER MOVEMENT</span>
              <span className="text-teal/60 font-normal">|</span>
              <span>BRIGHTER TOMORROWS</span>
            </span>
            <span className="hidden sm:inline-block w-8 sm:w-12 h-px bg-border" />
          </div>
        </div>
      </section>

      {/* ── Featured Treatments ── */}
      <section className="py-14 sm:py-20 bg-navy" ref={treatRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="section-label reveal" style={{ color: '#0EA5E9' }}>Treatments & Specialities</div>
            <h2 className="font-display font-800 text-3xl sm:text-4xl text-white mt-2 reveal reveal-delay-1">
              World-Class Surgical Expertise
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {treatments.map((t, i) => (
              <Link
                to="/treatments"
                key={t.title}
                className={`reveal reveal-delay-${(i % 6) + 1} group relative flex items-stretch min-h-[150px] sm:min-h-[175px] h-auto rounded-2xl sm:rounded-[22px] overflow-hidden border border-[#1e2e4a] bg-[#101d36] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.3)] hover:border-sky-500/40 hover:shadow-[0_12px_28px_-6px_rgba(14,165,233,0.2)] hover:-translate-y-0.5 transition-all duration-300 block`}
              >
                {/* Image on left with fade mask */}
                <div className="w-[38%] sm:w-[42%] relative flex-shrink-0 h-full overflow-hidden min-h-[140px]">
                  <img
                    src={t.image}
                    alt={t.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                    style={{
                      maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 52%, rgba(0,0,0,0) 100%)',
                      WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 52%, rgba(0,0,0,0) 100%)',
                    }}
                  />
                </div>

                {/* Content on right */}
                <div className="flex-1 flex flex-col justify-center py-3 pr-3.5 pl-2 sm:py-4 sm:pr-5 sm:pl-2 z-10 min-w-0">
                  <h3 className="font-display font-700 text-white text-base sm:text-lg lg:text-xl tracking-tight leading-snug group-hover:text-teal-light transition-colors truncate">
                    {t.title}
                  </h3>
                  <p className="text-slate-300/80 text-[11px] sm:text-xs leading-relaxed mt-1 line-clamp-2">
                    {t.desc}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-light mt-2 sm:mt-3 group-hover:text-white group-hover:gap-2.5 transition-all">
                    <span>Learn More</span>
                    <span className="text-sm sm:text-base leading-none">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12 reveal">
            <Link
              to="/treatments"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#0C1A36] hover:bg-[#11244A] text-white text-xs sm:text-base font-display font-semibold rounded-xl border border-white/20 hover:border-teal-light/50 shadow-lg shadow-navy/60 transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto"
            >
              <span>View All Treatments</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Choose ── */}
      <section className="py-14 sm:py-20 bg-white" ref={whyRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <div className="section-label reveal">Why Choose Dr. Deep</div>
              <h2 className="font-display font-800 text-3xl sm:text-4xl text-navy mt-2 leading-tight reveal reveal-delay-1">
                Care That Goes Beyond the Operating Theatre
              </h2>
              <p className="text-navy-700 mt-3 sm:mt-4 leading-relaxed text-sm sm:text-base reveal reveal-delay-2">
                Every aspect of Dr. Deep's practice is designed to make your orthopedic journey as seamless, transparent and effective as possible.
              </p>
              <div className="mt-6 sm:mt-8 aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-soft-gray border border-border/40 shadow-lg reveal reveal-delay-3">
                <img
                  src="/images/banners/consultation-highlight.webp"
                  alt="Orthopedic care and consultation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-3.5 sm:space-y-4">
              {whyItems.map((item, i) => (
                <div
                  key={item.title}
                  className={`reveal reveal-delay-${(i % 6) + 1} flex items-start sm:items-center gap-3.5 sm:gap-5 bg-[#F8FAFC] hover:bg-white rounded-2xl p-4 sm:p-5 border border-border/60 hover:border-teal/30 hover:shadow-md transition-all duration-200`}
                >
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#E0F2FE]/80 flex items-center justify-center flex-shrink-0 text-teal shadow-2xs">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-display font-700 text-navy text-sm sm:text-base">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-navy-700/80 mt-0.5 sm:mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
              <div className="reveal pt-2">
                <Link to="/about" className="btn-primary w-full sm:w-auto justify-center text-sm min-h-[44px]">
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Patient Journey ── */}
      <section className="py-14 sm:py-20 bg-soft-gray" ref={journeyRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="section-label reveal">The Patient Journey</div>
            <h2 className="font-display font-800 text-3xl sm:text-4xl text-navy mt-2 reveal reveal-delay-1">
              Your Path to Recovery
            </h2>
            <p className="text-navy-700 mt-2.5 sm:mt-3 max-w-md mx-auto text-xs sm:text-base reveal reveal-delay-2">
              A clear, step-by-step process designed to guide you from first consultation to full recovery.
            </p>
          </div>

          {/* Mobile Stepper (< 640px) */}
          <div className="sm:hidden space-y-3">
            {journeySteps.map((step, i) => (
              <div
                key={step.num}
                className={`reveal reveal-delay-${(i % 6) + 1} flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-border/70 shadow-2xs`}
              >
                <div className="w-11 h-11 rounded-xl bg-teal/10 border border-teal/25 flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-800 text-teal text-base leading-none">{step.num}</span>
                </div>
                <div>
                  <h4 className="font-display font-700 text-navy text-sm">{step.label}</h4>
                  <p className="text-xs text-navy-700/80 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tablet & Desktop Stepper (>= 640px) */}
          <div className="hidden sm:block relative">
            <div className="hidden lg:block absolute top-7 sm:top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="grid grid-cols-4 lg:grid-cols-7 gap-4 lg:gap-6">
              {journeySteps.map((step, i) => (
                <div
                  key={step.num}
                  className={`reveal reveal-delay-${(i % 6) + 1} flex flex-col items-center text-center group`}
                >
                  <div className="w-13 sm:w-14 lg:w-16 h-13 sm:h-14 lg:h-16 rounded-2xl bg-white border-2 border-border group-hover:border-teal group-hover:shadow-lg transition-all flex flex-col items-center justify-center relative z-10 mb-3">
                    <div className="font-display font-800 text-teal text-base lg:text-lg leading-none">{step.num}</div>
                  </div>
                  <h4 className="font-display font-700 text-navy text-xs lg:text-sm">{step.label}</h4>
                  <p className="text-[11px] lg:text-xs text-navy-700 mt-1 leading-relaxed line-clamp-3">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8 sm:mt-10 reveal">
            <Link to="/patient-resources" className="btn-primary w-full sm:w-auto justify-center text-sm min-h-[44px]">
              Know the Complete Process →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-14 sm:py-20 bg-white" ref={testimonialsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="section-label reveal">Patient Stories</div>
            <h2 className="font-display font-800 text-3xl sm:text-4xl text-navy mt-2 reveal reveal-delay-1">
              Lives Restored. Stories Shared.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`reveal reveal-delay-${i + 1} bg-soft-gray rounded-2xl p-5 sm:p-7 border border-border/50 card-hover relative flex flex-col justify-between`}
              >
                <div>
                  <div className="text-teal mb-3 sm:mb-4 text-sm sm:text-base">
                    {'★'.repeat(t.stars)}
                  </div>
                  <p className="text-navy-700 text-xs sm:text-sm leading-relaxed italic">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-3 mt-5 pt-4 sm:mt-6 sm:pt-5 border-t border-border/50">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover bg-border flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-display font-700 text-navy text-xs sm:text-sm truncate">{t.name}</div>
                    <div className="text-[11px] sm:text-xs text-navy-700 truncate">{t.procedure} · Age {t.age}</div>
                  </div>
                  <div className="ml-auto flex-shrink-0">
                    <div className="text-[11px] sm:text-xs text-teal font-semibold">Google ★</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-10 reveal">
            <Link to="/patient-resources" className="btn-primary w-full sm:w-auto justify-center text-sm min-h-[44px]">
              Read More Stories →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Blog ── */}
      <section className="py-14 sm:py-20 bg-soft-gray" ref={blogRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-6 mb-8 sm:mb-12">
            <div>
              <div className="section-label reveal">Latest Articles</div>
              <h2 className="font-display font-800 text-3xl sm:text-4xl text-navy mt-2 reveal reveal-delay-1">
                Insights from Dr. Deep
              </h2>
            </div>
            <Link to="/blog" className="text-teal font-display font-700 hover:gap-3 flex items-center gap-2 transition-all reveal text-sm sm:text-base">
              Visit Blog →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {blogPosts.map((post, i) => (
              <Link
                to="/blog"
                key={post.title}
                className={`reveal reveal-delay-${i + 1} group bg-white rounded-2xl overflow-hidden border border-border/50 card-hover block`}
              >
                <div className="aspect-[5/3] overflow-hidden bg-soft-gray">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <span className="text-[11px] sm:text-xs font-700 text-teal bg-teal/10 px-2.5 py-0.5 rounded-full">{post.category}</span>
                    <span className="text-[11px] sm:text-xs text-navy-700">{post.readTime}</span>
                  </div>
                  <h3 className="font-display font-700 text-navy text-sm sm:text-base leading-snug group-hover:text-teal transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-navy-700 mt-2 leading-relaxed line-clamp-2">{post.excerpt}</p>
                  <div className="text-[11px] sm:text-xs text-navy-700/60 mt-3 sm:mt-4">{post.date}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="py-14 sm:py-20 bg-white" ref={galleryRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-6 mb-8 sm:mb-12">
            <div>
              <div className="section-label reveal">Gallery</div>
              <h2 className="font-display font-800 text-3xl sm:text-4xl text-navy mt-2 reveal reveal-delay-1">
                A Glimpse Into the Practice
              </h2>
            </div>
            <Link to="/gallery" className="text-teal font-display font-700 flex items-center gap-2 hover:gap-3 transition-all reveal text-sm sm:text-base">
              View Full Gallery →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
            {galleryImages.map((img, i) => (
              <Link
                to="/gallery"
                key={i}
                className={`reveal reveal-delay-${(i % 6) + 1} group relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-soft-gray block`}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-colors duration-300 flex items-end p-2.5 sm:p-4">
                  <span className="text-white font-display font-700 text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                    {img.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-14 sm:py-20 bg-soft-gray" ref={faqRef}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="section-label reveal">Frequently Asked</div>
            <h2 className="font-display font-800 text-3xl sm:text-4xl text-navy mt-2 reveal reveal-delay-1">
              Questions Patients Often Ask
            </h2>
          </div>

          <div className="space-y-3 reveal reveal-delay-2">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-10 reveal">
            <Link to="/patient-resources" className="btn-primary w-full sm:w-auto justify-center text-sm min-h-[44px]">
              View All FAQs →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact Preview ── */}
      <section className="py-14 sm:py-20 bg-white" ref={contactRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <div className="section-label reveal">Find Us</div>
              <h2 className="font-display font-800 text-3xl sm:text-4xl text-navy mt-2 leading-tight reveal reveal-delay-1">
                Ready to Start Your Recovery?
              </h2>
              <p className="text-navy-700 mt-3 sm:mt-4 leading-relaxed text-sm sm:text-base reveal reveal-delay-2">
                Consultations are available across multiple clinic locations in Kolkata. Same-week appointments are usually available.
              </p>

              <div className="space-y-3.5 sm:space-y-4 mt-6 sm:mt-8">
                {[
                  { clinic: 'Salt Lake Clinic', addr: 'CF-140, Sector 1, Salt Lake, Kolkata 700064', time: 'Mon–Sat: 5:00 PM – 8:00 PM' },
                  { clinic: 'Alipore Clinic', addr: '22B, Judges Court Road, Alipore, Kolkata 700027', time: 'Mon, Wed, Fri: 11:00 AM – 1:00 PM' },
                ].map((loc, i) => (
                  <div key={loc.clinic} className={`reveal reveal-delay-${i + 3} flex items-start gap-3.5 sm:gap-4 bg-soft-gray rounded-xl p-4 sm:p-5`}>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-display font-700 text-navy text-sm sm:text-base">{loc.clinic}</div>
                      <div className="text-xs sm:text-sm text-navy-700 mt-0.5">{loc.addr}</div>
                      <div className="text-xs text-teal font-semibold mt-1">{loc.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-6 sm:mt-8 reveal reveal-delay-4">
                <a
                  href="tel:+919830000000"
                  className="flex items-center justify-center gap-2 bg-soft-gray text-navy rounded-xl px-5 py-3 text-sm font-display font-600 hover:bg-border/60 transition-colors min-h-[44px] group"
                >
                  <img
                    src="/icons/svg/call-icon.svg"
                    alt="Call Clinic"
                    className="w-4 h-4 object-contain group-hover:scale-110 transition-transform"
                  />
                  <span>Call Clinic</span>
                </a>
                <a
                  href="https://wa.me/919830000000"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-xl px-5 py-3 text-sm font-display font-600 hover:bg-green-100 transition-colors min-h-[44px] group"
                >
                  <img
                    src="/icons/svg/whatsapp-icon.svg"
                    alt="WhatsApp"
                    className="w-4 h-4 object-contain group-hover:scale-110 transition-transform"
                  />
                  <span>WhatsApp</span>
                </a>
                <Link to="/contact" className="flex items-center justify-center gap-2 bg-soft-gray text-navy rounded-xl px-5 py-3 text-sm font-display font-600 hover:bg-border/60 transition-colors min-h-[44px]">
                  View All Locations →
                </Link>
              </div>
            </div>

            {/* Map placeholder + CTA */}
            <div className="relative reveal">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-soft-gray border border-border/50">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=700&h=525&fit=crop&auto=format"
                  alt="Clinic facility"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 text-center shadow-xl max-w-xs w-full">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <h3 className="font-display font-700 text-navy text-base sm:text-lg">Visit Our Clinic</h3>
                    <p className="text-xs sm:text-sm text-navy-700 mt-1 sm:mt-2">Multiple convenient locations across Kolkata</p>
                    <Link to="/book-appointment" className="btn-primary mt-3 sm:mt-4 w-full justify-center text-xs sm:text-sm min-h-[44px]">
                      Book Appointment
                    </Link>
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
