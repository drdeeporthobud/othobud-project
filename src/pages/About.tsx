import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useReveal } from "../hooks/useReveal"
import {
  GraduationCap,
  Award,
  Activity,
  Cpu,
  Globe2,
  ShieldCheck,
  Trophy,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"

const drDeepImg = "/images/doctor/dr-deep-hero.webp"

interface TimelineMilestone {
  year: string
  periodTag?: string
  title: string
  institution: string
  location: string
  category: string
  desc: string
  type: "degree" | "fellowship" | "milestone"
  badgeColor?: string
  icon: React.ComponentType<{ className?: string }>
  metrics?: { label: string value: string detail?: string }[]
  tags?: string[]
}

const timeline: TimelineMilestone[] = [
  {
    year: "2005 – 2010",
    periodTag: "5-Year Medical Program",
    title: "MBBS (Bachelor of Medicine & Bachelor of Surgery)",
    institution: "Dr. B.R. Ambedkar Medical College",
    location: "Bangalore, Karnataka",
    category: "Medical Degree",
    desc: "Graduated from Dr. B.R. Ambedkar Medical College followed by rigorous rotatory clinical internship, establishing core surgical competence, emergency care skills, and medical excellence.",
    type: "degree",
    icon: GraduationCap,
    tags: ["Medical Graduation", "Clinical Internship", "Bengaluru"],
  },
  {
    year: "2013 – 2016",
    periodTag: "3-Year Master Residency",
    title: "MS (Orthopedics) — Master of Surgery",
    institution: "JJM Medical College",
    location: "Davanagere, Karnataka",
    category: "Postgraduate Residency",
    desc: "Completed three years of intensive postgraduate surgical residency at JJM Medical College, mastering complex polytrauma surgery, musculoskeletal reconstructive orthopedics, and joint preservation.",
    type: "degree",
    icon: Award,
    tags: ["Master of Surgery", "Musculoskeletal Trauma", "Surgical Residency"],
  },
  {
    year: "2018",
    periodTag: "Sub-Specialty Fellowship",
    title: "Fellowship in Sports & Arthroscopic Surgery",
    institution: "Sports & Keyhole Arthroscopy Institute",
    location: "Kolkata, West Bengal",
    category: "Sports & Arthroscopy Fellowship",
    desc: "Advanced super-specialization in keyhole arthroscopy, minimally invasive ligament reconstructions (ACL / PCL), meniscus repairs, cartilage restorations, and high-performance athletic sports injury rehabilitation.",
    type: "fellowship",
    icon: Activity,
    tags: ["Sports Medicine", "Keyhole Arthroscopy", "Ligament Reconstruction"],
  },
  {
    year: "2022",
    periodTag: "Robotic Arthroplasty",
    title: "Fellowship in Joint Arthroplasty & Robotic Joint Replacement",
    institution: "Belle Vue Hospital",
    location: "Kolkata, West Bengal",
    category: "Robotic Arthroplasty Fellowship",
    desc: "Comprehensive clinical fellowship at Belle Vue Hospital specializing in sub-millimeter precision computer-navigated and robotic-assisted total knee and hip replacement surgeries with rapid recovery pathways.",
    type: "fellowship",
    icon: Cpu,
    tags: ["Belle Vue Hospital", "Robotic Surgery", "Joint Arthroplasty"],
  },
  {
    year: "2023",
    periodTag: "International Fellowship",
    title: "Fellowship in Advanced Arthroscopy Surgeries",
    institution: "Advanced Orthopedic & Arthroscopy Center",
    location: "Dubai, UAE",
    category: "International Fellowship",
    desc: "Prestigious international surgical fellowship in Dubai mastering world-class techniques for complex shoulder rotator cuff repairs, labral reconstruction, multi-ligament knee surgeries, and ankle arthroscopy.",
    type: "fellowship",
    icon: Globe2,
    tags: [
      "Dubai, UAE",
      "International Faculty",
      "Shoulder & Knee Arthroscopy",
    ],
  },
  {
    year: "2025",
    periodTag: "USA Super-Specialty",
    title: "Fellowship in Advanced Joint Replacement & Preservation",
    institution: "Center for Orthopedic Excellence",
    location: "USA",
    category: "Global Joint Preservation Fellowship",
    desc: "Super-specialty fellowship in the United States covering biological joint preservation, partial knee resurfacing, complex revision arthroplasty, and state-of-the-art Next-Gen robotic orthopedic innovations.",
    type: "fellowship",
    icon: ShieldCheck,
    tags: ["USA Fellowship", "Joint Preservation", "Next-Gen Robotics"],
  },
  {
    year: "2026",
    periodTag: "Major Surgical Landmark",
    title: "Completed 2,000 Joint Replacements & 1,000+ Arthroscopic Surgeries",
    institution: "High-Volume Restorative Practice",
    location: "Eastern India & Global Patients",
    category: "Historic Clinical Milestone",
    desc: "Crossed the extraordinary landmark of 2,000 conventional and robotic joint replacements alongside 1,000+ advanced arthroscopic keyhole surgeries across shoulder, knee, elbow, and ankle joints with outstanding clinical outcomes.",
    type: "milestone",
    icon: Trophy,
    metrics: [
      {
        label: "Conventional & Robotic Replacements",
        value: "2,000+",
        detail: "Total Knee & Hip Joint Arthroplasties",
      },
      {
        label: "Advanced Arthroscopic Surgeries",
        value: "1,000+",
        detail: "Shoulder · Knee · Elbow · Ankle",
      },
      {
        label: "Years of Dedicated Practice",
        value: "15+",
        detail: "Surgical & Clinical Excellence",
      },
    ],
    tags: [
      "2,000 Joint Replacements",
      "1,000+ Arthroscopies",
      "Shoulder · Knee · Elbow · Ankle",
    ],
  },
]

const awards = [
  "Best Orthopedic Surgeon, Calcutta Medical Association (2018)",
  "Excellence in Patient Care, IMA West Bengal (2020)",
  "Distinguished Service Award, Indian Orthopaedic Association (2021)",
  "Innovation in Surgical Practice, ISMAICON (2022)",
  "Top Orthopedic Surgeons of India — Times Health (2023)",
]

const hospitals = [
  {
    name: "Belle Vue Clinic",
    location: "Dr. U.N. Brahmachari Street, Kolkata",
    role: "Fellowship Center",
  },
  {
    name: "AMRI Hospitals",
    location: "Dhakuria, Kolkata",
    role: "Visiting Consultant",
  },
  {
    name: "Peerless Hospital",
    location: "Pancha Sayar, Kolkata",
    role: "Senior Consultant",
  },
  {
    name: "CMRI Hospital",
    location: "Kasba, Kolkata",
    role: "Honorary Consultant",
  },
  {
    name: "Fortis Hospital",
    location: "Anandapur, Kolkata",
    role: "Visiting Consultant",
  },
  {
    name: "Apollo Clinic",
    location: "Newtown, Kolkata",
    role: "Visiting Consultant",
  },
]

const memberships = [
  "Indian Orthopaedic Association (IOA)",
  "ISAKOS — International Society of Arthroscopy, Knee Surgery",
  "ISKS — Indian Society of Knee Surgery",
  "Arthritis Foundation India",
  "Calcutta Medical Association (CMA)",
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
      // Trigger line at 50% of the viewport height
      const triggerY = window.innerHeight * 0.5
      const relativeY = triggerY - rect.top
      const progress = Math.max(0, Math.min(relativeY, rect.height))
      setFillHeight(progress)

      let current = 0
      itemRefs.current.forEach((el, idx) => {
        if (!el) return
        const itemRect = el.getBoundingClientRect()
        if (itemRect.top + itemRect.height * 0.3 <= triggerY) {
          current = idx
        }
      })
      setActiveStep(current)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  const scrollToMilestone = (index: number) => {
    const el = itemRefs.current[index]
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
      setActiveStep(index)
    }
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-navy py-12 sm:py-16 lg:py-20" ref={heroRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div
                className="section-label reveal"
                style={{ color: "#0EA5E9" }}
              >
                About
              </div>
              <h1 className="font-display font-800 text-3xl xs:text-4xl sm:text-5xl lg:text-6xl text-white mt-2 leading-[1.12] tracking-tight reveal reveal-delay-1">
                Dr. Deep
                <br />
                Chakraborty
              </h1>
              <p className="text-teal-light text-xs xs:text-sm sm:text-base lg:text-lg font-medium mt-2.5 sm:mt-3 reveal reveal-delay-2">
                MS (Orthopedics) · Fellowships in Kolkata, USA & Dubai · Robotic
                & Advanced Arthroscopy Specialist
              </p>
              <p className="text-white/75 mt-4 sm:mt-6 leading-relaxed text-xs xs:text-sm sm:text-base lg:text-lg reveal reveal-delay-3 max-w-xl">
                A fellowship-trained orthopedic surgeon with 15+ years of
                clinical excellence, having performed over 2,000 joint
                replacements and 1,000+ advanced arthroscopic surgeries across
                India and abroad.
              </p>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-2 gap-2.5 xs:gap-3 sm:gap-4 mt-6 sm:mt-8">
                {[
                  { label: "WBMC Registration", value: "WBMC-76107" },
                  { label: "Experience", value: "15+ Years" },
                  { label: "Surgeries Done", value: "3,000+" },
                  { label: "Languages", value: "Bengali · Hindi · English" },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    className={`reveal reveal-delay-${i + 3} bg-white/8 rounded-xl p-3 xs:p-3.5 sm:p-4 border border-white/10 flex flex-col justify-center min-w-0`}
                  >
                    <div className="text-white/50 text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-wider font-semibold truncate">
                      {item.label}
                    </div>
                    <div className="text-white font-display font-700 text-xs xs:text-sm sm:text-base mt-1 leading-snug break-words">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 reveal reveal-delay-5 w-full sm:w-auto">
                <Link
                  to="/book-appointment"
                  className="btn-primary w-full sm:w-auto justify-center py-3 sm:py-3.5 px-6 min-h-[44px]"
                >
                  Book Consultation
                </Link>
                <a
                  href="tel:+917980144046"
                  className="btn-outline w-full sm:w-auto justify-center py-3 sm:py-3.5 px-6 min-h-[44px]"
                >
                  Call Clinic
                </a>
              </div>
            </div>

            {/* Doctor Image with Responsive Badge */}
            <div className="relative reveal mt-4 lg:mt-0">
              <div className="aspect-[3/4] max-w-[270px] xs:max-w-[300px] sm:max-w-sm mx-auto rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-navy-800">
                <img
                  src={drDeepImg}
                  alt="Dr. Deep Chakraborty"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute bottom-2 left-2 sm:-bottom-4 sm:-left-4 bg-teal rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-xl border border-white/20">
                <div className="text-white/80 text-[10px] sm:text-xs">
                  Verified by
                </div>
                <div className="text-white font-display font-700 text-xs sm:text-sm mt-0.5 whitespace-nowrap">
                  Medical Council of India
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biography */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-label mb-3">Biography</div>
          <h2 className="font-display font-800 text-2xl xs:text-3xl sm:text-4xl text-navy mb-6 sm:mb-8">
            A Life Dedicated to Orthopedic Excellence
          </h2>
          <div className="prose max-w-none text-navy-700 leading-relaxed space-y-4 sm:space-y-5 text-sm sm:text-base">
            <p>
              Dr. Deep Chakraborty is a fellowship-trained orthopedic surgeon in
              Kolkata with over 15 years of surgical experience. He completed
              his MBBS from Dr. B.R. Ambedkar Medical College, Bangalore,
              followed by an MS in Orthopedics from JJM Medical College,
              Davanagere, Karnataka. He provides specialized orthopedic care for
              patients across Kolkata, New Town, Anandapur, and surrounding
              areas.
            </p>
            <p>
              His areas of expertise include robotic knee replacement, joint
              replacement surgery, advanced shoulder and knee arthroscopy,
              sports medicine, and joint preservation. His advanced fellowship
              training in Sports and Arthroscopic Surgery, Joint Arthroplasty
              and Robotic Joint Replacement, Advanced Arthroscopy, and Joint
              Replacement and Preservation has included training in Kolkata,
              Dubai, and the USA.
            </p>
            <p>
              Dr. Deep Chakraborty has performed more than 2,000 joint
              replacement surgeries, including conventional and robotic-assisted
              joint replacements, along with 1,000+ arthroscopic procedures
              involving the knee, shoulder, elbow, and ankle. His surgical
              experience includes the management of joint pain, arthritis,
              sports injuries, ligament and cartilage problems, and conditions
              requiring arthroscopic or joint replacement procedures.
            </p>
            <p>
              Based in Kolkata, Dr. Deep Chakraborty combines advanced
              orthopedic surgical expertise with a patient-focused approach. He
              takes time to understand each patient's symptoms, lifestyle, and
              treatment goals, explains the diagnosis and available treatment
              options clearly, and develops individualized treatment plans for
              patients seeking advanced joint replacement, robotic surgery,
              arthroscopy, and sports injury treatment in Kolkata.
            </p>
          </div>

          {/* Sized Quote Box */}
          <div className="mt-8 sm:mt-10 bg-soft-gray/90 rounded-xl sm:rounded-2xl p-4.5 xs:p-6 sm:p-8 border-l-4 border-teal shadow-xs">
            <p className="text-navy font-display font-semibold text-sm xs:text-base sm:text-xl italic leading-relaxed">
              "Surgery is a last resort, not a first instinct. My goal is always
              to exhaust every conservative option before recommending an
              operation — and when surgery is necessary, to perform it with the
              precision and care I would give a member of my own family."
            </p>
            <div className="text-teal font-display font-700 text-xs sm:text-sm mt-3 sm:mt-4">
              — Dr. Deep Chakraborty
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section
        className="py-12 sm:py-16 lg:py-24 bg-soft-gray relative overflow-hidden"
        ref={timelineRef}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-label reveal mb-2">Career Timeline</div>
          <h2 className="font-display font-800 text-2xl xs:text-3xl sm:text-4xl text-navy mb-3 reveal reveal-delay-1">
            Education & Milestones
          </h2>
          <p className="text-navy-700/80 text-xs xs:text-sm sm:text-base max-w-2xl mb-8 sm:mb-10 reveal reveal-delay-2">
            A continuous journey of specialized surgical training, academic
            honours, and pioneering advancements in orthopedic surgery.
          </p>

          {/* Quick Jump Timeline Navigation Pills */}
          <div className="mb-10 sm:mb-12 reveal reveal-delay-2 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-2 min-w-max">
              <span className="text-xs font-display font-700 text-navy-700 uppercase tracking-wide mr-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal" />
                Jump To:
              </span>
              {timeline.map((item, idx) => {
                const isActive = activeStep === idx
                return (
                  <button
                    key={item.year}
                    type="button"
                    onClick={() => scrollToMilestone(idx)}
                    className={`px-3 py-1.5 rounded-full text-xs font-display font-700 transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-teal text-white shadow-sm ring-2 ring-teal/30 scale-105"
                        : item.type === "milestone"
                          ? "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
                          : "bg-white text-navy-700 border border-border/70 hover:border-teal hover:text-teal"
                    }`}
                  >
                    {item.type === "milestone" && (
                      <Sparkles className="w-3 h-3 text-amber-600" />
                    )}
                    <span>{item.year.split("–")[0].trim()}</span>
                    <span className="hidden md:inline text-[11px] font-medium opacity-80">
                      {item.type === "milestone"
                        ? "Milestone"
                        : item.category.split(" ")[0]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="relative" ref={timelineContainerRef}>
            {/* Base Background Track Line */}
            <div className="absolute left-6 sm:left-10 top-10 bottom-10 w-[3px] -translate-x-1/2 bg-slate-200 rounded-full" />

            {/* Dynamic Animated Line connecting point-to-point */}
            <div
              className="absolute left-6 sm:left-10 top-10 w-[3px] -translate-x-1/2 bg-gradient-to-b from-teal via-teal-light to-teal rounded-full transition-[height] duration-150 ease-out shadow-[0_0_12px_rgba(14,165,233,0.4)]"
              style={{
                height: `${fillHeight}px`,
                maxHeight: "calc(100% - 80px)",
              }}
            >
              {/* Glowing leading indicator head dot */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-teal-light shadow-[0_0_14px_#0ea5e9] animate-pulse ring-2 ring-white" />
            </div>

            {/* Timeline Items */}
            <div className="space-y-8 sm:space-y-12">
              {timeline.map((item, i) => {
                const isPassed = i <= activeStep
                const isCurrent = i === activeStep
                const IconComponent = item.icon
                const isMilestone = item.type === "milestone"

                return (
                  <div
                    key={item.year}
                    ref={(el) => {
                      itemRefs.current[i] = el
                    }}
                    className="relative pl-14 xs:pl-16 sm:pl-24 group"
                  >
                    {/* Node / Point Badge */}
                    <div
                      onClick={() => scrollToMilestone(i)}
                      className={`absolute left-6 sm:left-10 top-8 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center origin-center transition-all duration-300 ease-out cursor-pointer z-10 ${
                        isMilestone && isCurrent
                          ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xl shadow-amber-500/30 scale-110 sm:scale-120 ring-4 ring-amber-400/30"
                          : isMilestone
                            ? "bg-amber-500 text-white border-2 border-amber-300 shadow-md scale-100 sm:scale-105"
                            : isCurrent
                              ? "bg-white border-2 border-teal text-teal shadow-xl shadow-teal/30 scale-110 sm:scale-120 ring-4 ring-teal/20"
                              : isPassed
                                ? "bg-teal text-white border-2 border-teal shadow-sm scale-100 sm:scale-105"
                                : "bg-white border-2 border-slate-300 text-slate-400 scale-95 hover:border-teal/60 hover:text-teal"
                      }`}
                    >
                      {isCurrent && (
                        <span
                          className={`absolute inset-0 rounded-2xl animate-ping opacity-60 ${
                            isMilestone ? "bg-amber-400" : "bg-teal"
                          }`}
                        />
                      )}
                      <IconComponent
                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                          isCurrent ? "scale-110" : ""
                        }`}
                      />
                    </div>

                    {/* Milestone Card */}
                    <div
                      className={`transition-all duration-500 ease-out transform origin-left ${
                        isCurrent
                          ? "scale-[1.01] sm:scale-[1.02] translate-x-0.5 sm:translate-x-2"
                          : isPassed
                            ? "scale-100 translate-x-0 opacity-100"
                            : "scale-[0.99] opacity-75 group-hover:opacity-100"
                      }`}
                    >
                      {/* Special Card Layout for 2026 Grand Milestone */}
                      {isMilestone ? (
                        <div
                          className={`p-5 sm:p-8 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-white via-amber-50/20 to-teal/5 ${
                            isCurrent
                              ? "border-amber-500/80 shadow-2xl shadow-amber-500/10 ring-4 ring-amber-500/15"
                              : "border-amber-300/80 shadow-lg hover:border-amber-500/60"
                          }`}
                        >
                          {/* Top Tag & Year */}
                          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-display font-800 text-xs sm:text-sm px-3.5 py-1 rounded-full shadow-xs">
                                <Trophy className="w-3.5 h-3.5 text-white" />
                                {item.year}
                              </span>
                              <span className="text-[11px] sm:text-xs font-display font-700 uppercase tracking-wider text-amber-800 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-200">
                                {item.category}
                              </span>
                            </div>
                            <span className="text-xs font-display font-700 text-navy-700/60 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              Milestone #7 (Landmark)
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-display font-800 text-lg xs:text-xl sm:text-2xl text-navy leading-snug">
                            {item.title}
                          </h3>

                          <div className="flex items-center gap-2 text-xs sm:text-sm text-navy-700/70 mt-2">
                            <MapPin className="w-4 h-4 text-teal shrink-0" />
                            <span>
                              {item.institution} · {item.location}
                            </span>
                          </div>

                          <p className="text-xs sm:text-base text-navy-700 mt-3 leading-relaxed">
                            {item.desc}
                          </p>

                          {/* 3 Metric Cards for Joint Replacement & Arthroscopy */}
                          {item.metrics && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mt-6">
                              {item.metrics.map((m) => (
                                <div
                                  key={m.label}
                                  className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-colors"
                                >
                                  <div>
                                    <div className="font-display font-800 text-2xl sm:text-3xl text-teal">
                                      {m.value}
                                    </div>
                                    <div className="font-display font-700 text-navy text-xs sm:text-sm mt-1 leading-snug">
                                      {m.label}
                                    </div>
                                  </div>
                                  {m.detail && (
                                    <div className="text-[11px] text-navy-700/70 mt-2 pt-2 border-t border-border/50 font-medium">
                                      {m.detail}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Tags & Action Link */}
                          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-amber-200/60">
                            <div className="flex flex-wrap gap-2">
                              {item.tags?.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[11px] font-medium bg-white px-2.5 py-1 rounded-lg text-navy-700 border border-border/70"
                                >
                                  ✓ {tag}
                                </span>
                              ))}
                            </div>
                            <Link
                              to="/book-appointment"
                              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-display font-700 text-teal hover:text-teal-dark hover:underline"
                            >
                              <span>Consult Dr. Deep</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      ) : (
                        /* Standard Milestone Card */
                        <div
                          className={`p-4 xs:p-5 sm:p-7 rounded-2xl border transition-all duration-300 ${
                            isCurrent
                              ? "bg-white border-teal/80 shadow-xl shadow-teal/10 ring-2 ring-teal/20"
                              : isPassed
                                ? "bg-white border-border/80 shadow-xs hover:border-teal/50 hover:shadow-md"
                                : "bg-white/80 border-border/50 shadow-none hover:bg-white hover:border-border"
                          }`}
                        >
                          {/* Card Top Metadata */}
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1.5 font-display font-800 text-xs sm:text-sm px-3 py-1 rounded-full transition-all duration-300 ${
                                  isCurrent
                                    ? "bg-teal text-white shadow-xs"
                                    : isPassed
                                      ? "bg-teal/15 text-teal"
                                      : "bg-slate-200/80 text-slate-600"
                                }`}
                              >
                                <Calendar className="w-3 h-3" />
                                {item.year}
                              </span>
                              <span className="text-[11px] sm:text-xs font-display font-600 px-2.5 py-0.5 rounded-md bg-navy/5 text-navy-700 border border-border/60">
                                {item.category}
                              </span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                              Milestone #{i + 1}
                            </span>
                          </div>

                          {/* Title */}
                          <h3
                            className={`font-display font-800 text-base xs:text-lg sm:text-xl transition-colors duration-300 leading-snug ${
                              isCurrent
                                ? "text-teal-dark"
                                : isPassed
                                  ? "text-navy"
                                  : "text-slate-800"
                            }`}
                          >
                            {item.title}
                          </h3>

                          {/* Institution & Location */}
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-navy-700/70 mt-1.5 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-teal shrink-0" />
                            <span>{item.institution}</span>
                            <span>·</span>
                            <span className="text-teal font-semibold">
                              {item.location}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-xs sm:text-sm text-navy-700/85 mt-2.5 leading-relaxed font-normal">
                            {item.desc}
                          </p>

                          {/* Tags */}
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-4 pt-3.5 border-t border-border/40">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] sm:text-[11px] font-medium bg-soft-gray px-2 py-0.5 rounded-md text-navy-700"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Affiliations */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white" ref={awardsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 items-start">
            {/* Column 1: Awards & Honours */}
            <div>
              <div className="section-label reveal">Recognition</div>
              <h2 className="font-display font-800 text-2xl sm:text-3xl text-navy mt-1.5 mb-5 sm:mb-6 reveal reveal-delay-1">
                Awards & Honours
              </h2>
              <div className="space-y-2.5 sm:space-y-3">
                {awards.map((award, i) => (
                  <div
                    key={award}
                    className={`reveal reveal-delay-${(i % 5) + 1} flex items-center gap-3.5 bg-soft-gray/80 hover:bg-white rounded-xl p-3.5 sm:p-4 border border-border/60 hover:border-teal/30 hover:shadow-xs transition-all duration-200 min-h-[64px] sm:min-h-[72px]`}
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0 text-teal">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0284C7"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="8" r="6" />
                        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                      </svg>
                    </div>
                    <p className="text-navy font-medium text-xs sm:text-sm leading-snug">
                      {award}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Professional Affiliations */}
            <div>
              <div className="section-label reveal">
                Professional Affiliations
              </div>
              <h2 className="font-display font-800 text-2xl sm:text-3xl text-navy mt-1.5 mb-5 sm:mb-6 reveal reveal-delay-1">
                Memberships
              </h2>
              <div className="space-y-2.5 sm:space-y-3">
                {memberships.map((m, i) => (
                  <div
                    key={m}
                    className={`reveal reveal-delay-${(i % 5) + 1} flex items-center gap-3.5 bg-soft-gray/80 hover:bg-white rounded-xl p-3.5 sm:p-4 border border-border/60 hover:border-teal/30 hover:shadow-xs transition-all duration-200 min-h-[64px] sm:min-h-[72px]`}
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0 text-teal">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0284C7"
                        strokeWidth="2.5"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-navy font-medium text-xs sm:text-sm leading-snug">
                      {m}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Hospital Affiliations */}
            <div>
              <div className="section-label reveal">Practice Network</div>
              <h2 className="font-display font-800 text-2xl sm:text-3xl text-navy mt-1.5 mb-5 sm:mb-6 reveal reveal-delay-1">
                Hospital Affiliations
              </h2>
              <div className="space-y-2.5 sm:space-y-3">
                {hospitals.map((h, i) => (
                  <div
                    key={h.name}
                    className={`reveal reveal-delay-${(i % 5) + 1} flex items-center justify-between gap-3 bg-soft-gray/80 hover:bg-white rounded-xl p-3.5 sm:p-4 border border-border/60 hover:border-teal/30 hover:shadow-xs transition-all duration-200 min-h-[64px] sm:min-h-[72px]`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0 text-teal">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#0284C7"
                          strokeWidth="2"
                        >
                          <path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 9h6M9 13h6M9 17h6" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="font-display font-700 text-navy text-xs sm:text-sm truncate">
                          {h.name}
                        </div>
                        <div className="text-[11px] sm:text-xs text-navy-700/70 truncate">
                          {h.location}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-teal font-semibold bg-teal/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full whitespace-nowrap shrink-0 border border-teal/20">
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
      <section className="py-12 sm:py-16 lg:py-20 bg-soft-gray" ref={mediaRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-label reveal">Media Coverage</div>
          <h2 className="font-display font-800 text-2xl xs:text-3xl sm:text-4xl text-navy mt-2 mb-6 sm:mb-10 reveal reveal-delay-1">
            In the News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {[
              {
                source: "The Telegraph",
                date: "March 2024",
                headline:
                  "Kolkata Surgeon Performs Eastern India's 1,000th Robotic Knee Replacement",
              },
              {
                source: "Anandabazar Patrika",
                date: "November 2023",
                headline: "নতুন প্রযুক্তিতে হাঁটু প্রতিস্থাপন — ডাঃ দীপ চক্রবর্তীর অভিজ্ঞতা",
              },
              {
                source: "Times of India",
                date: "August 2023",
                headline:
                  "Dr. Deep Chakraborty Named Among India's Top 100 Orthopedic Surgeons",
              },
            ].map((item, i) => (
              <div
                key={item.source}
                className={`reveal reveal-delay-${i + 2} bg-white rounded-xl sm:rounded-2xl p-4.5 sm:p-6 border border-border/50 card-hover`}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="font-display font-800 text-navy text-xs sm:text-sm">
                    {item.source}
                  </span>
                  <span className="text-[11px] sm:text-xs text-navy-700">
                    {item.date}
                  </span>
                </div>
                <p className="text-navy-700 text-xs sm:text-sm leading-relaxed">
                  {item.headline}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-teal">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display font-800 text-2xl sm:text-3xl text-white">
            Book a Consultation with Dr. Deep
          </h2>
          <p className="text-white/80 text-xs sm:text-base mt-2 sm:mt-3">
            Same-week appointments available at multiple Kolkata locations.
          </p>
          <Link
            to="/book-appointment"
            className="inline-flex items-center gap-2 mt-6 sm:mt-7 bg-white text-teal font-display font-700 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl hover:bg-soft-gray transition-colors text-sm sm:text-base"
          >
            Book Appointment →
          </Link>
        </div>
      </section>
    </div>
  )
}
