import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal, useCountUp } from '../hooks/useReveal'
import drDeepHero from '../imports/Dr_Deep.png'
import drDeep1 from '../imports/Dr-Deep-1.png'
import { posts as allBlogPosts, BlogPost } from './Blog'

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
      className={`reveal reveal-delay-${delay} bg-white rounded-2xl p-6 shadow-sm border border-border/60 text-center card-hover`}
    >
      <div className="text-3xl font-display font-800 text-navy">
        <span ref={numRef}>0</span>
        <span>{suffix}</span>
      </div>
      <div className="text-sm text-navy-700 mt-1 font-medium">{label}</div>
    </div>
  )
}

const conditions = [
  {
    image: '/icons/png/Home/Folder_1/kneepain.png',
    label: 'Knee Pain',
    desc: 'Osteoarthritis, ligament tears, meniscus injuries',
    bgGradient: 'from-[#e0f2fe]/70 via-[#ebf5fe]/85 to-[#f0f8ff]',
    borderColor: 'border-sky-100/90',
  },
  {
    image: '/icons/png/Home/Folder_1/hippain.png',
    label: 'Hip Pain',
    desc: 'Labral tears, hip arthritis, bursitis',
    bgGradient: 'from-[#ffedd5]/60 via-[#fff3e8]/85 to-[#fff7ed]',
    borderColor: 'border-amber-100/90',
  },
  {
    image: '/icons/png/Home/Folder_1/shoulderpain.png',
    label: 'Shoulder Pain',
    desc: 'Rotator cuff, frozen shoulder, dislocations',
    bgGradient: 'from-[#dcfce7]/60 via-[#ecfdf3]/85 to-[#f0fdf4]',
    borderColor: 'border-emerald-100/90',
  },
  {
    image: '/icons/png/Home/Folder_1/sports.png',
    label: 'Sports Injuries',
    desc: 'ACL tears, cartilage damage, stress fractures',
    bgGradient: 'from-[#fef3c7]/60 via-[#fff8ed]/85 to-[#fffbeb]',
    borderColor: 'border-amber-100/90',
  },
  {
    image: '/icons/png/Home/Folder_1/fracture.png',
    label: 'Fractures',
    desc: 'Complex fractures, non-unions, deformities',
    bgGradient: 'from-[#ede9fe]/60 via-[#f4f2ff]/85 to-[#f8f7ff]',
    borderColor: 'border-indigo-100/90',
  },
  {
    image: '/icons/png/Home/Folder_1/backpain.png',
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
    image: '/icons/png/Home/Folder_2/robotic-joint-replacement.png',
  },
  {
    title: 'Arthroscopy',
    desc: 'Minimally invasive joint surgery with tiny incisions and rapid recovery.',
    image: '/icons/png/Home/Folder_2/arthroscopy.png',
  },
  {
    title: 'Sports Medicine',
    desc: 'Advanced care for athletes — from diagnosis to return-to-play rehabilitation.',
    image: '/icons/png/Home/Folder_2/sports-medicine.png',
  },
  {
    title: 'Trauma Surgery',
    desc: 'Expert management of complex fractures and polytrauma cases.',
    image: '/icons/png/Home/Folder_2/trauma-surgery.png',
  },
  {
    title: 'Revision Surgery',
    desc: 'Corrective procedures for failed joint replacements and implant complications.',
    image: '/icons/png/Home/Folder_2/revision-surgery.png',
  },
  {
    title: 'Pediatric Orthopedics',
    desc: "Specialized care for children's bone and joint conditions.",
    image: '/icons/png/Home/Folder_2/pediatric-orthopedics.png',
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
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&h=900&fit=crop&auto=format)',
            opacity: 0.08,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal/15 border border-teal/25 mb-8 animate-fade-up">
                <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                <span className="text-teal text-xs font-display font-700 tracking-wide uppercase">
                  Orthopedic Specialist · Kolkata
                </span>
              </div>

              <h1
                className="font-display font-800 text-white leading-[1.1] animate-fade-up"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', animationDelay: '0.1s' }}
              >
                Restoring Movement.
                <br />
                <span className="text-teal-light">Renewing Lives.</span>
              </h1>

              <p
                className="text-white/70 text-lg leading-relaxed mt-6 max-w-lg animate-fade-up"
                style={{ animationDelay: '0.2s' }}
              >
                Dr. Deep Chakraborty brings world-class orthopedic expertise to Kolkata — combining
                fellowship-trained surgical precision with compassionate, patient-first care.
              </p>

              <div
                className="flex flex-wrap gap-4 mt-10 animate-fade-up"
                style={{ animationDelay: '0.3s' }}
              >
                <Link to="/book-appointment" className="btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Book Appointment
                </Link>
                <Link to="/about" className="btn-outline">
                  Meet Dr. Deep
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>

              {/* Quick trust */}
              <div
                className="flex flex-wrap gap-6 mt-12 animate-fade-up"
                style={{ animationDelay: '0.4s' }}
              >
                {['15+ Years Experience', '5,000+ Surgeries', 'MBBS · MS · DNB'].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-white/60 text-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor image + floating card */}
            <div className="relative hidden lg:block">
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
                    className="block w-full text-center bg-teal hover:bg-teal-dark text-white text-xs font-display font-700 py-2.5 rounded-lg transition-colors"
                  >
                    Book Now →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1s' }}>
          <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── Trust & Credentials ── */}
      <section className="bg-soft-gray py-16" ref={statsRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="section-label reveal">Credentials & Trust</div>
            <h2 className="font-display font-800 text-3xl text-navy mt-2 reveal reveal-delay-1">
              Trusted by Thousands of Patients
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard value={15} suffix="+" label="Years Experience" delay={1} />
            <StatCard value={5000} suffix="+" label="Successful Surgeries" delay={2} />
            <StatCard value={8} label="Hospital Affiliations" delay={3} />
            <StatCard value={12} label="Awards & Honours" delay={4} />
            <StatCard value={4800} suffix="+" label="Verified Reviews" delay={5} />
            <StatCard value={98} suffix="%" label="Patient Satisfaction" delay={6} />
          </div>

          {/* Credential badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 reveal">
            {['MBBS · IPGMER', 'MS (Orthopedics)', 'DNB (Ortho)', 'Fellowship – Arthroplasty (Germany)', 'MCI Registered', 'ISAKOS Member'].map((c) => (
              <div key={c} className="px-4 py-2 bg-white rounded-full border border-border/60 text-sm text-navy-700 font-medium shadow-sm">
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet Dr. Deep ── */}
      <section className="py-20 bg-white" ref={aboutRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative reveal">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-soft-gray">
                <img
                  src={drDeep1}
                  alt="Dr. Deep Chakraborty in consultation"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating quote */}
              <div className="absolute -bottom-6 -right-3 sm:-right-6 bg-gradient-to-br from-teal via-teal to-teal-dark text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl shadow-teal/35 border border-white/25 backdrop-blur-md max-w-[260px] sm:max-w-[300px]">
                <svg className="w-7 h-7 text-white/40 mb-2 fill-current" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="font-display font-700 italic text-sm sm:text-base leading-snug text-white tracking-tight">
                  “My purpose is to restore what pain has taken away.”
                </p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-light animate-pulse" />
                  <span className="text-white/90 text-xs font-display font-bold tracking-wide uppercase">
                    Dr. Deep Chakraborty
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="section-label reveal">About</div>
              <h2 className="font-display font-800 text-4xl text-navy mt-2 leading-tight reveal reveal-delay-1">
                Meet Dr. Deep<br />Chakraborty
              </h2>
              <div className="w-12 h-1 bg-teal rounded mt-4 reveal reveal-delay-2" />
              <p className="text-navy-700 leading-relaxed mt-6 reveal reveal-delay-2">
                Dr. Deep Chakraborty is a fellowship-trained orthopedic surgeon based in Kolkata with over 15 years of clinical experience. After completing his post-graduation from IPGMER, he pursued advanced fellowship training in Joint Arthroplasty in Germany, gaining expertise in robotic-assisted surgeries.
              </p>
              <p className="text-navy-700 leading-relaxed mt-4 reveal reveal-delay-3">
                His practice philosophy centers on listening carefully to each patient, explaining every diagnosis in plain language, and developing treatment plans that respect their individual circumstances and goals.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8 reveal reveal-delay-3">
                {[
                  { label: 'Specialization', value: 'Joint Replacement & Arthroscopy' },
                  { label: 'Training', value: 'IPGMER + Germany Fellowship' },
                  { label: 'Languages', value: 'Bengali, Hindi, English' },
                  { label: 'Practice', value: 'Kolkata, West Bengal' },
                ].map((item) => (
                  <div key={item.label} className="bg-soft-gray rounded-xl p-4">
                    <div className="text-xs text-navy-700 font-medium uppercase tracking-wide">{item.label}</div>
                    <div className="text-navy font-display font-700 text-sm mt-1">{item.value}</div>
                  </div>
                ))}
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 mt-8 text-teal font-display font-700 hover:gap-3 transition-all reveal reveal-delay-4"
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
      <section className="relative py-20 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] overflow-hidden" ref={conditionsRef}>
        {/* Background decorative runner on left */}
        <div className="absolute top-2 left-0 sm:left-4 w-48 sm:w-64 h-40 sm:h-52 opacity-15 pointer-events-none select-none mix-blend-multiply overflow-hidden">
          <img
            src="/icons/png/Home/Folder_1/sports.png"
            alt=""
            className="w-full h-full object-cover object-left filter contrast-125 brightness-110 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
          />
        </div>

        {/* Script text on left: "Stronger Everyday" */}
        <div className="hidden lg:block absolute top-10 left-8 xl:left-14 rotate-[-12deg] select-none pointer-events-none">
          <div className="font-script text-3xl xl:text-4xl text-teal font-bold leading-tight drop-shadow-sm tracking-wide">
            Stronger<br />Everyday
          </div>
        </div>

        {/* Script text on right: "Move Better Live Brighter" with curved underline */}
        <div className="hidden lg:block absolute top-8 right-8 xl:right-14 rotate-[-8deg] select-none pointer-events-none text-right">
          <div className="font-script text-3xl xl:text-4xl text-teal font-bold leading-tight drop-shadow-sm tracking-wide">
            Move Better<br />Live Brighter
          </div>
          <svg className="w-28 sm:w-36 h-4 text-teal/70 mt-1 ml-auto" viewBox="0 0 120 18" fill="none">
            <path d="M4 14C40 4 85 5 116 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-3 mb-3 reveal">
              <span className="w-8 h-[2px] bg-teal rounded-full" />
              <span className="text-xs font-bold tracking-[0.2em] text-teal uppercase">
                Conditions We Treat
              </span>
              <span className="w-8 h-[2px] bg-teal rounded-full" />
            </div>

            <h2 className="font-display font-800 text-4xl sm:text-5xl text-navy mt-1 reveal reveal-delay-1 tracking-tight">
              From Pain to <span className="text-teal">Recovery</span>
            </h2>

            <p className="text-navy-700 mt-3.5 max-w-xl mx-auto text-sm sm:text-base leading-relaxed reveal reveal-delay-2 font-normal">
              Comprehensive orthopedic care for a wide range of bone, joint and soft tissue conditions. Get the right diagnosis and the right treatment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conditions.map((c, i) => (
              <Link
                to="/treatments"
                key={c.label}
                className={`reveal reveal-delay-${(i % 6) + 1} group relative flex items-stretch h-[175px] sm:h-[185px] rounded-[24px] overflow-hidden border ${c.borderColor} bg-gradient-to-r ${c.bgGradient} shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_28px_-6px_rgba(2,132,199,0.18)] hover:-translate-y-1 transition-all duration-300 block`}
              >
                {/* Image on left */}
                <div className="w-[43%] relative flex-shrink-0 h-full overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.label}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                    style={{
                      maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%)',
                      WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%)',
                    }}
                  />
                </div>

                {/* Content on right */}
                <div className="flex-1 flex flex-col justify-center py-4 pr-5 pl-2 z-10">
                  <h3 className="font-display font-800 text-navy text-xl tracking-tight group-hover:text-teal transition-colors">
                    {c.label}
                  </h3>
                  <p className="text-navy-700/80 text-xs sm:text-[13px] leading-relaxed mt-1 line-clamp-2">
                    {c.desc}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal mt-3 group-hover:text-teal-dark group-hover:gap-2.5 transition-all">
                    <span>Learn More</span>
                    <span className="text-base leading-none">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Explore Button */}
          <div className="text-center mt-12 reveal">
            <Link
              to="/treatments"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal hover:bg-teal-dark text-white text-sm sm:text-base font-display font-700 rounded-xl shadow-lg shadow-teal/25 hover:shadow-teal/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              <span>Explore All Conditions</span>
              <span>→</span>
            </Link>
          </div>

          {/* Bottom decorative tagline */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-semibold tracking-[0.18em] text-navy-700/60 uppercase mt-10 reveal">
            <span className="w-8 sm:w-12 h-px bg-border" />
            <span>PERSONALISED CARE &nbsp;|&nbsp; BETTER MOVEMENT &nbsp;|&nbsp; BRIGHTER TOMORROWS</span>
            <span className="w-8 sm:w-12 h-px bg-border" />
          </div>
        </div>
      </section>

      {/* ── Featured Treatments ── */}
      <section className="py-20 bg-navy" ref={treatRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-label reveal" style={{ color: '#0EA5E9' }}>Treatments & Specialities</div>
            <h2 className="font-display font-800 text-4xl text-white mt-2 reveal reveal-delay-1">
              World-Class Surgical Expertise
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treatments.map((t, i) => (
              <Link
                to="/treatments"
                key={t.title}
                className={`reveal reveal-delay-${(i % 6) + 1} group relative flex items-stretch h-[175px] sm:h-[185px] rounded-[22px] overflow-hidden border border-[#1e2e4a] bg-[#101d36] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.3)] hover:border-sky-500/40 hover:shadow-[0_12px_28px_-6px_rgba(14,165,233,0.2)] hover:-translate-y-1 transition-all duration-300 block`}
              >
                {/* Image on left with fade mask */}
                <div className="w-[43%] relative flex-shrink-0 h-full overflow-hidden">
                  <img
                    src={t.image}
                    alt={t.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                    style={{
                      maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)',
                      WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)',
                    }}
                  />
                </div>

                {/* Content on right */}
                <div className="flex-1 flex flex-col justify-center py-4 pr-5 pl-2 z-10">
                  <h3 className="font-display font-700 text-white text-lg sm:text-xl tracking-tight leading-snug group-hover:text-teal-light transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-slate-300/80 text-xs sm:text-[13px] leading-relaxed mt-1.5 line-clamp-2 sm:line-clamp-3">
                    {t.desc}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-light mt-3 group-hover:text-white group-hover:gap-2.5 transition-all">
                    <span>Learn More</span>
                    <span className="text-base leading-none">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12 reveal">
            <Link
              to="/treatments"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0C1A36] hover:bg-[#11244A] text-white text-sm sm:text-base font-display font-semibold rounded-xl border border-white/20 hover:border-teal-light/50 shadow-lg shadow-navy/60 transition-all duration-200 hover:-translate-y-0.5"
            >
              <span>View All Treatments</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Choose ── */}
      <section className="py-20 bg-white" ref={whyRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="section-label reveal">Why Choose Dr. Deep</div>
              <h2 className="font-display font-800 text-4xl text-navy mt-2 leading-tight reveal reveal-delay-1">
                Care That Goes Beyond the Operating Theatre
              </h2>
              <p className="text-navy-700 mt-4 leading-relaxed reveal reveal-delay-2">
                Every aspect of Dr. Deep's practice is designed to make your orthopedic journey as seamless, transparent and effective as possible.
              </p>
              <div className="mt-8 aspect-[4/3] rounded-3xl overflow-hidden bg-soft-gray border border-border/40 shadow-lg reveal reveal-delay-3">
                <img
                  src="/icons/png/Home/Folder_3/part3-mainpic.png"
                  alt="Orthopedic care and consultation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-4">
              {whyItems.map((item, i) => (
                <div
                  key={item.title}
                  className={`reveal reveal-delay-${(i % 6) + 1} flex items-center gap-5 bg-[#F8FAFC] hover:bg-white rounded-2xl p-5 sm:p-6 border border-border/60 hover:border-teal/30 hover:shadow-md transition-all duration-200`}
                >
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#E0F2FE]/80 flex items-center justify-center flex-shrink-0 text-teal shadow-2xs">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-display font-700 text-navy text-base sm:text-lg">{item.title}</h3>
                    <p className="text-sm text-navy-700/80 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
              <div className="reveal pt-2">
                <Link to="/about" className="btn-primary">
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Patient Journey ── */}
      <section className="py-20 bg-soft-gray" ref={journeyRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-label reveal">The Patient Journey</div>
            <h2 className="font-display font-800 text-4xl text-navy mt-2 reveal reveal-delay-1">
              Your Path to Recovery
            </h2>
            <p className="text-navy-700 mt-3 max-w-md mx-auto reveal reveal-delay-2">
              A clear, step-by-step process designed to guide you from first consultation to full recovery.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
              {journeySteps.map((step, i) => (
                <div
                  key={step.num}
                  className={`reveal reveal-delay-${(i % 6) + 1} flex flex-col items-center text-center group`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-white border-2 border-border group-hover:border-teal group-hover:shadow-lg transition-all flex flex-col items-center justify-center relative z-10 mb-3">
                    <div className="font-display font-800 text-teal text-lg leading-none">{step.num}</div>
                  </div>
                  <h4 className="font-display font-700 text-navy text-sm">{step.label}</h4>
                  <p className="text-xs text-navy-700 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10 reveal">
            <Link to="/patient-resources" className="btn-primary">
              Know the Complete Process →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-white" ref={testimonialsRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-label reveal">Patient Stories</div>
            <h2 className="font-display font-800 text-4xl text-navy mt-2 reveal reveal-delay-1">
              Lives Restored. Stories Shared.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`reveal reveal-delay-${i + 1} bg-soft-gray rounded-2xl p-7 border border-border/50 card-hover relative`}
              >
                <div className="text-teal mb-4">
                  {'★'.repeat(t.stars)}
                </div>
                <p className="text-navy-700 text-sm leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border/50">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover bg-border"
                  />
                  <div>
                    <div className="font-display font-700 text-navy text-sm">{t.name}</div>
                    <div className="text-xs text-navy-700">{t.procedure} · Age {t.age}</div>
                  </div>
                  <div className="ml-auto">
                    <div className="text-xs text-teal font-semibold">Google ★</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 reveal">
            <Link to="/patient-resources" className="btn-primary">
              Read More Stories →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Blog ── */}
      <section className="py-20 bg-soft-gray" ref={blogRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="section-label reveal">Latest Articles</div>
              <h2 className="font-display font-800 text-4xl text-navy mt-2 reveal reveal-delay-1">
                Insights from Dr. Deep
              </h2>
            </div>
            <Link to="/blog" className="text-teal font-display font-700 hover:gap-3 flex items-center gap-2 transition-all reveal">
              Visit Blog →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-700 text-teal bg-teal/10 px-3 py-1 rounded-full">{post.category}</span>
                    <span className="text-xs text-navy-700">{post.readTime}</span>
                  </div>
                  <h3 className="font-display font-700 text-navy text-base leading-snug group-hover:text-teal transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-navy-700 mt-2 leading-relaxed line-clamp-2">{post.excerpt}</p>
                  <div className="text-xs text-navy-700/60 mt-4">{post.date}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="py-20 bg-white" ref={galleryRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="section-label reveal">Gallery</div>
              <h2 className="font-display font-800 text-4xl text-navy mt-2 reveal reveal-delay-1">
                A Glimpse Into the Practice
              </h2>
            </div>
            <Link to="/gallery" className="text-teal font-display font-700 flex items-center gap-2 hover:gap-3 transition-all reveal">
              View Full Gallery →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img, i) => (
              <Link
                to="/gallery"
                key={i}
                className={`reveal reveal-delay-${(i % 6) + 1} group relative aspect-[4/3] rounded-2xl overflow-hidden bg-soft-gray block`}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-colors duration-300 flex items-end p-4">
                  <span className="text-white font-display font-700 text-sm opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                    {img.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-20 bg-soft-gray" ref={faqRef}>
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-label reveal">Frequently Asked</div>
            <h2 className="font-display font-800 text-4xl text-navy mt-2 reveal reveal-delay-1">
              Questions Patients Often Ask
            </h2>
          </div>

          <div className="space-y-3 reveal reveal-delay-2">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>

          <div className="text-center mt-10 reveal">
            <Link to="/patient-resources" className="btn-primary">
              View All FAQs →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact Preview ── */}
      <section className="py-20 bg-white" ref={contactRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="section-label reveal">Find Us</div>
              <h2 className="font-display font-800 text-4xl text-navy mt-2 leading-tight reveal reveal-delay-1">
                Ready to Start Your Recovery?
              </h2>
              <p className="text-navy-700 mt-4 leading-relaxed reveal reveal-delay-2">
                Consultations are available across multiple clinic locations in Kolkata. Same-week appointments are usually available.
              </p>

              <div className="space-y-4 mt-8">
                {[
                  { clinic: 'Salt Lake Clinic', addr: 'CF-140, Sector 1, Salt Lake, Kolkata 700064', time: 'Mon–Sat: 5:00 PM – 8:00 PM' },
                  { clinic: 'Alipore Clinic', addr: '22B, Judges Court Road, Alipore, Kolkata 700027', time: 'Mon, Wed, Fri: 11:00 AM – 1:00 PM' },
                ].map((loc, i) => (
                  <div key={loc.clinic} className={`reveal reveal-delay-${i + 3} flex items-start gap-4 bg-soft-gray rounded-xl p-5`}>
                    <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-display font-700 text-navy">{loc.clinic}</div>
                      <div className="text-sm text-navy-700 mt-1">{loc.addr}</div>
                      <div className="text-xs text-teal font-semibold mt-1">{loc.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mt-8 reveal reveal-delay-4">
                <a href="tel:+919830000000" className="flex items-center gap-2 bg-soft-gray text-navy rounded-xl px-5 py-3 text-sm font-display font-600 hover:bg-border/60 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  Call Clinic
                </a>
                <a href="https://wa.me/919830000000" className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-xl px-5 py-3 text-sm font-display font-600 hover:bg-green-100 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
                <Link to="/contact" className="flex items-center gap-2 bg-soft-gray text-navy rounded-xl px-5 py-3 text-sm font-display font-600 hover:bg-border/60 transition-colors">
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl max-w-xs">
                    <div className="w-12 h-12 bg-teal rounded-xl flex items-center justify-center mx-auto mb-4">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <h3 className="font-display font-700 text-navy text-lg">Visit Our Clinic</h3>
                    <p className="text-sm text-navy-700 mt-2">Multiple convenient locations across Kolkata</p>
                    <Link to="/book-appointment" className="btn-primary mt-4 w-full justify-center text-sm">
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
