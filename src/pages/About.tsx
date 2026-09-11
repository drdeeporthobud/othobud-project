import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import drDeepImg from '../imports/Dr_Deep.png'

const timeline = [
  {
    year: '2003',
    event: 'MBBS from Medical College, Kolkata',
    desc: 'Graduated with academic honours from one of India’s most historic and premier medical institutions.',
  },
  {
    year: '2007',
    event: 'MS (Orthopedics) from IPGMER & SSKM Hospital, Kolkata',
    desc: 'Specialized in complex trauma, reconstructive orthopedics, and joint preservation surgery.',
  },
  {
    year: '2009',
    event: 'DNB Orthopedics — National Board of Examinations',
    desc: 'Awarded national board diplomate certification for the highest standard of orthopedic surgical competence.',
  },
  {
    year: '2010',
    event: 'Fellowship in Joint Arthroplasty — Endo-Klinik, Hamburg, Germany',
    desc: 'Advanced fellowship training in high-volume primary and complex revision joint replacements.',
  },
  {
    year: '2011',
    event: 'Commenced independent practice in Kolkata',
    desc: 'Established dedicated consultation clinics and surgical services prioritizing personalized patient care.',
  },
  {
    year: '2015',
    event: 'Introduced Robotic-Assisted Joint Replacement in Eastern India',
    desc: 'Pioneered sub-millimeter precision robotic surgery in the region, dramatically reducing recovery times.',
  },
  {
    year: '2018',
    event: 'Best Orthopedic Surgeon Award — Calcutta Medical Association',
    desc: 'Recognized for distinguished clinical excellence, outstanding patient outcomes, and surgical innovation.',
  },
  {
    year: '2023',
    event: 'Completed 5,000th successful joint replacement surgery',
    desc: 'Crossed a landmark milestone in restorative joint procedures with over 98% patient satisfaction.',
  },
]

const awards = [
  'Best Orthopedic Surgeon, Calcutta Medical Association (2018)',
  'Excellence in Patient Care, IMA West Bengal (2020)',
  'Distinguished Service Award, Indian Orthopaedic Association (2021)',
  'Innovation in Surgical Practice, ISMAICON (2022)',
  'Top Orthopedic Surgeons of India — Times Health (2023)',
]

const hospitals = [
  { name: 'AMRI Hospitals', location: 'Dhakuria, Kolkata', role: 'Visiting Consultant' },
  { name: 'Peerless Hospital', location: 'Pancha Sayar, Kolkata', role: 'Senior Consultant' },
  { name: 'CMRI Hospital', location: 'Kasba, Kolkata', role: 'Honorary Consultant' },
  { name: 'Fortis Hospital', location: 'Anandapur, Kolkata', role: 'Visiting Consultant' },
  { name: 'Ruby General Hospital', location: 'Kasba, Kolkata', role: 'Consultant' },
]

const memberships = [
  'Indian Orthopaedic Association (IOA)',
  'ISAKOS — International Society of Arthroscopy, Knee Surgery',
  'ISKS — Indian Society of Knee Surgery',
  'Arthritis Foundation India',
  'Calcutta Medical Association (CMA)',
]

export default function About() {
  const heroRef = useReveal()
  const timelineRef = useReveal()
  const awardsRef = useReveal()
  const hospitalsRef = useReveal()
  const mediaRef = useReveal()

  // Timeline scroll animation state
  const timelineContainerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [fillHeight, setFillHeight] = useState(0)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const container = timelineContainerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      // Trigger line at 55% of the viewport height
      const triggerY = window.innerHeight * 0.55
      const relativeY = triggerY - rect.top
      const progress = Math.max(0, Math.min(relativeY, rect.height))
      setFillHeight(progress)

      let current = 0
      itemRefs.current.forEach((el, idx) => {
        if (!el) return
        const itemRect = el.getBoundingClientRect()
        if (itemRect.top + itemRect.height * 0.25 <= triggerY) {
          current = idx
        }
      })
      setActiveStep(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-navy py-20" ref={heroRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label reveal" style={{ color: '#0EA5E9' }}>About</div>
              <h1 className="font-display font-800 text-5xl text-white mt-2 leading-tight reveal reveal-delay-1">
                Dr. Deep<br />Chakraborty
              </h1>
              <p className="text-teal-light font-medium mt-3 reveal reveal-delay-2">
                MS (Ortho) · DNB · Fellowship in Joint Arthroplasty, Germany
              </p>
              <p className="text-white/70 mt-6 leading-relaxed text-lg reveal reveal-delay-3">
                A fellowship-trained orthopedic surgeon with 15+ years of experience restoring mobility and quality of life for patients across Eastern India and beyond.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { label: 'MCI Registration', value: 'MCR/40521/2008' },
                  { label: 'Experience', value: '15+ Years' },
                  { label: 'Surgeries', value: '5,000+' },
                  { label: 'Languages', value: 'Bengali · Hindi · English' },
                ].map((item, i) => (
                  <div key={item.label} className={`reveal reveal-delay-${i + 3} bg-white/8 rounded-xl p-4 border border-white/10`}>
                    <div className="text-white/40 text-xs uppercase tracking-wide">{item.label}</div>
                    <div className="text-white font-display font-700 mt-1">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-8 reveal reveal-delay-5">
                <Link to="/book-appointment" className="btn-primary">Book Consultation</Link>
                <a href="tel:+919830000000" className="btn-outline">Call Clinic</a>
              </div>
            </div>

            <div className="relative reveal">
              <div className="aspect-[3/4] max-w-sm mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-navy-800">
                <img
                  src={drDeepImg}
                  alt="Dr. Deep Chakraborty"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-teal rounded-2xl p-5 shadow-xl">
                <div className="text-white/70 text-xs">Verified by</div>
                <div className="text-white font-display font-700 text-sm mt-0.5">Medical Council of India</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biography */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="section-label mb-3">Biography</div>
          <h2 className="font-display font-800 text-4xl text-navy mb-8">A Life Dedicated to Orthopedic Excellence</h2>
          <div className="prose max-w-none text-navy-700 leading-relaxed space-y-5 text-base">
            <p>
              Dr. Deep Chakraborty grew up in Kolkata with an early passion for medicine, shaped by watching family members suffer from musculoskeletal conditions. This personal connection drove him toward orthopedics — a field where surgical precision and patient empathy intersect.
            </p>
            <p>
              After securing his MBBS and MS in Orthopedics from the prestigious IPGMER & SSKM Hospital, Dr. Deep pursued advanced training in Joint Arthroplasty at the Endo-Klinik in Hamburg, Germany — one of Europe's leading centers for joint replacement surgery. This international fellowship gave him exposure to robotic surgical systems, complex revision procedures, and the highest standards of peri-operative care.
            </p>
            <p>
              Returning to Kolkata, Dr. Deep established a practice grounded in the philosophy that every patient deserves time, honesty and individualized care. He was among the first surgeons in Eastern India to introduce robotic-assisted joint replacement, bringing a level of surgical accuracy previously unavailable in the region.
            </p>
            <p>
              Beyond the operating theatre, Dr. Deep is deeply committed to patient education and community outreach — conducting awareness camps, publishing accessible health articles, and training the next generation of orthopedic surgeons.
            </p>
          </div>

          <div className="mt-10 bg-soft-gray rounded-2xl p-8 border-l-4 border-teal">
            <p className="text-navy font-display font-600 text-xl italic leading-relaxed">
              "Surgery is a last resort, not a first instinct. My goal is always to exhaust every conservative option before recommending an operation — and when surgery is necessary, to perform it with the precision and care I would give a member of my own family."
            </p>
            <div className="text-teal font-display font-700 mt-4">— Dr. Deep Chakraborty</div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-soft-gray" ref={timelineRef}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="section-label reveal mb-2">Career Timeline</div>
          <h2 className="font-display font-800 text-4xl text-navy mb-4 reveal reveal-delay-1">
            Education & Milestones
          </h2>
          <p className="text-navy-700/80 text-sm sm:text-base max-w-xl mb-12 reveal reveal-delay-2">
            A continuous journey of specialized surgical training, academic honours, and pioneering advancements in orthopedic surgery.
          </p>

          <div className="relative" ref={timelineContainerRef}>
            {/* Base Background Track Line (precisely centered on left-6 sm:left-8) */}
            <div className="absolute left-6 sm:left-8 top-8 bottom-8 w-[3px] -translate-x-1/2 bg-slate-200 rounded-full" />

            {/* Dynamic Animated Line connecting point-to-point */}
            <div
              className="absolute left-6 sm:left-8 top-8 w-[3px] -translate-x-1/2 bg-gradient-to-b from-teal via-teal-light to-teal rounded-full transition-[height] duration-150 ease-out"
              style={{ height: `${fillHeight}px`, maxHeight: 'calc(100% - 64px)' }}
            >
              {/* Glowing leading indicator head dot */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-teal-light shadow-[0_0_12px_#0ea5e9] animate-pulse" />
            </div>

            {/* Timeline Items */}
            <div className="space-y-8">
              {timeline.map((item, i) => {
                const isPassed = i <= activeStep
                const isCurrent = i === activeStep

                return (
                  <div
                    key={item.year}
                    ref={(el) => { itemRefs.current[i] = el }}
                    className="relative pl-14 sm:pl-20"
                  >
                    {/* Node / Point (ALWAYS locked onto the line axis at left-6 sm:left-8, unaffected by card scaling) */}
                    <div
                      className={`absolute left-6 sm:left-8 top-8 -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center origin-center transition-all duration-300 ease-out pointer-events-none ${
                        isCurrent
                          ? 'bg-white border-2 border-teal shadow-lg shadow-teal/30 scale-120 z-20'
                          : isPassed
                          ? 'bg-white border-2 border-teal shadow-sm scale-105 z-10'
                          : 'bg-white border-2 border-slate-300 scale-90 z-0'
                      }`}
                    >
                      {isCurrent && (
                        <span className="absolute inset-0 rounded-full bg-teal/30 animate-ping opacity-75" />
                      )}
                      <div
                        className={`rounded-full transition-all duration-300 origin-center ${
                          isCurrent
                            ? 'w-3.5 h-3.5 sm:w-4 sm:h-4 bg-teal shadow-xs'
                            : isPassed
                            ? 'w-3 h-3 sm:w-3.5 sm:h-3.5 bg-teal'
                            : 'w-2.5 h-2.5 bg-slate-300'
                        }`}
                      />
                    </div>

                    {/* Milestone Card with Scaling & Elevation (Transform applied exclusively to the card) */}
                    <div
                      className={`transition-all duration-500 ease-out transform origin-left ${
                        isCurrent
                          ? 'scale-[1.02] sm:scale-[1.03] translate-x-1 sm:translate-x-2'
                          : isPassed
                          ? 'scale-100 translate-x-0 opacity-100'
                          : 'scale-[0.98] opacity-60'
                      }`}
                    >
                      <div
                        className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
                          isCurrent
                            ? 'bg-white border-teal/70 shadow-xl shadow-teal/10 ring-2 ring-teal/20'
                            : isPassed
                            ? 'bg-white border-border/70 shadow-sm hover:border-teal/40 hover:shadow-md'
                            : 'bg-white/60 border-border/40 shadow-none'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`font-display font-800 text-xs sm:text-sm px-3 py-1 rounded-full transition-all duration-300 ${
                              isCurrent
                                ? 'bg-teal text-white shadow-sm'
                                : isPassed
                                ? 'bg-teal/15 text-teal'
                                : 'bg-slate-200/80 text-slate-500'
                            }`}
                          >
                            {item.year}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            Milestone #{i + 1}
                          </span>
                        </div>
                        <h3
                          className={`font-display font-700 text-base sm:text-xl transition-colors duration-300 ${
                            isCurrent ? 'text-teal-dark' : isPassed ? 'text-navy' : 'text-slate-700'
                          }`}
                        >
                          {item.event}
                        </h3>
                        {item.desc && (
                          <p className="text-xs sm:text-sm text-navy-700/80 mt-1.5 leading-relaxed font-normal">
                            {item.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Affiliations */}
      <section className="py-20 bg-white" ref={awardsRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Column 1: Awards & Honours */}
            <div>
              <div className="section-label reveal">Recognition</div>
              <h2 className="font-display font-800 text-2xl sm:text-3xl text-navy mt-1.5 mb-6 reveal reveal-delay-1">
                Awards & Honours
              </h2>
              <div className="space-y-3">
                {awards.map((award, i) => (
                  <div
                    key={award}
                    className={`reveal reveal-delay-${(i % 5) + 1} flex items-center gap-3.5 bg-soft-gray/80 hover:bg-white rounded-xl p-4 border border-border/60 hover:border-teal/30 hover:shadow-xs transition-all duration-200 min-h-[72px]`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0 text-teal">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                        <circle cx="12" cy="8" r="6" />
                        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                      </svg>
                    </div>
                    <p className="text-navy font-medium text-xs sm:text-sm leading-snug">{award}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Professional Affiliations */}
            <div>
              <div className="section-label reveal">Professional Affiliations</div>
              <h2 className="font-display font-800 text-2xl sm:text-3xl text-navy mt-1.5 mb-6 reveal reveal-delay-1">
                Memberships
              </h2>
              <div className="space-y-3">
                {memberships.map((m, i) => (
                  <div
                    key={m}
                    className={`reveal reveal-delay-${(i % 5) + 1} flex items-center gap-3.5 bg-soft-gray/80 hover:bg-white rounded-xl p-4 border border-border/60 hover:border-teal/30 hover:shadow-xs transition-all duration-200 min-h-[72px]`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0 text-teal">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.5">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-navy font-medium text-xs sm:text-sm leading-snug">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Hospital Affiliations */}
            <div>
              <div className="section-label reveal">Practice Network</div>
              <h2 className="font-display font-800 text-2xl sm:text-3xl text-navy mt-1.5 mb-6 reveal reveal-delay-1">
                Hospital Affiliations
              </h2>
              <div className="space-y-3">
                {hospitals.map((h, i) => (
                  <div
                    key={h.name}
                    className={`reveal reveal-delay-${(i % 5) + 1} flex items-center justify-between gap-3 bg-soft-gray/80 hover:bg-white rounded-xl p-4 border border-border/60 hover:border-teal/30 hover:shadow-xs transition-all duration-200 min-h-[72px]`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0 text-teal">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                          <path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 9h6M9 13h6M9 17h6" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="font-display font-700 text-navy text-xs sm:text-sm truncate">{h.name}</div>
                        <div className="text-[11px] sm:text-xs text-navy-700/70 truncate">{h.location}</div>
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-teal font-semibold bg-teal/10 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 border border-teal/20">
                      {h.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media */}
      <section className="py-20 bg-soft-gray" ref={mediaRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="section-label reveal">Media Coverage</div>
          <h2 className="font-display font-800 text-4xl text-navy mt-2 mb-10 reveal reveal-delay-1">
            In the News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { source: 'The Telegraph', date: 'March 2024', headline: "Kolkata Surgeon Performs Eastern India's 1,000th Robotic Knee Replacement" },
              { source: 'Anandabazar Patrika', date: 'November 2023', headline: 'নতুন প্রযুক্তিতে হাঁটু প্রতিস্থাপন — ডাঃ দীপ চক্রবর্তীর অভিজ্ঞতা' },
              { source: 'Times of India', date: 'August 2023', headline: "Dr. Deep Chakraborty Named Among India's Top 100 Orthopedic Surgeons" },
            ].map((item, i) => (
              <div key={item.source} className={`reveal reveal-delay-${i + 2} bg-white rounded-2xl p-6 border border-border/50 card-hover`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display font-800 text-navy text-sm">{item.source}</span>
                  <span className="text-xs text-navy-700">{item.date}</span>
                </div>
                <p className="text-navy-700 text-sm leading-relaxed">{item.headline}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-teal">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display font-800 text-3xl text-white">Book a Consultation with Dr. Deep</h2>
          <p className="text-white/80 mt-3">Same-week appointments available at multiple Kolkata locations.</p>
          <Link to="/book-appointment" className="inline-flex items-center gap-2 mt-7 bg-white text-teal font-display font-700 px-7 py-3.5 rounded-xl hover:bg-soft-gray transition-colors">
            Book Appointment →
          </Link>
        </div>
      </section>
    </div>
  )
}
