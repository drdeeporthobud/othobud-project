import { useState } from "react"
import { useReveal } from "../hooks/useReveal"

const categories = [
  "All",
  "Consultations",
  "Conferences",
  "Workshops",
  "Facilities",
  "Community",
  "Media",
  "Achievements",
]

const images = [
  {
    src: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=700&h=500&fit=crop&auto=format",
    category: "Facilities",
    title: "State-of-the-Art Operation Theatre",
    desc: "Equipped with Mako robotic surgical system",
    wide: true,
  },
  {
    src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&h=350&fit=crop&auto=format",
    category: "Conferences",
    title: "Indian Orthopaedic Association Annual Conference",
    desc: "Presenting research on robotic arthroplasty outcomes, 2024",
  },
  {
    src: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=350&fit=crop&auto=format",
    category: "Consultations",
    title: "Patient Consultation",
    desc: "Review of post-operative MRI imaging",
  },
  {
    src: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=500&h=350&fit=crop&auto=format",
    category: "Community",
    title: "Free Bone Health Camp — Park Street",
    desc: "Screening 500+ residents for osteoporosis and arthritis, 2023",
  },
  {
    src: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=500&h=350&fit=crop&auto=format",
    category: "Facilities",
    title: "Physiotherapy & Rehabilitation Centre",
    desc: "Fully equipped rehab facility attached to clinic",
  },
  {
    src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&h=350&fit=crop&auto=format",
    category: "Media",
    title: "Television Interview — Health & Wellness",
    desc: "Zee 24 Ghanta: Arthritis awareness programme, 2023",
  },
  {
    src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=700&h=350&fit=crop&auto=format",
    category: "Facilities",
    title: "Modern Consultation Suite",
    desc: "Equipped with digital X-ray viewer and 3D model library",
    wide: true,
  },
  {
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=350&fit=crop&auto=format",
    category: "Workshops",
    title: "Cadaveric Workshop — Arthroscopy Techniques",
    desc: "Teaching advanced shoulder arthroscopy to postgraduate trainees, 2024",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=350&fit=crop&auto=format",
    category: "Achievements",
    title: "Best Orthopedic Surgeon Award",
    desc: "Calcutta Medical Association Annual Awards, 2018",
  },
  {
    src: "https://images.unsplash.com/photo-1547212371-eb5e6a4b590c?w=500&h=350&fit=crop&auto=format",
    category: "Community",
    title: "School Sports Injury Awareness",
    desc: "Educating young athletes on injury prevention and first aid",
  },
  {
    src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=350&fit=crop&auto=format",
    category: "Consultations",
    title: "Second Opinion Consultation",
    desc: "Comprehensive review of prior imaging and treatment history",
  },
  {
    src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=350&fit=crop&auto=format",
    category: "Conferences",
    title: "ISAKOS World Congress",
    desc: "Presenting at the International Society of Arthroscopy conference",
  },
]

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [lightbox, setLightbox] = useState<null | typeof images[0]>(null)
  const ref = useReveal()

  const filtered =
    activeCategory === "All"
      ? images
      : images.filter((img) => img.category === activeCategory)

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="bg-navy py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="section-label" style={{ color: "#0EA5E9" }}>
            Visual Journey
          </div>
          <h1 className="font-display font-800 text-5xl text-white mt-2">
            Gallery
          </h1>
          <p className="text-white/70 mt-4 max-w-lg mx-auto">
            A window into Dr. Deep's clinical practice, academic contributions,
            community outreach and professional achievements.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-12 bg-soft-gray" ref={ref}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-10 reveal">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-display font-600 transition-all ${
                  activeCategory === cat
                    ? "bg-teal text-white shadow-md"
                    : "bg-white text-navy-700 border border-border/60 hover:border-teal hover:text-teal"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry-style grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[280px]">
            {filtered.map((img, i) => (
              <div
                key={img.title}
                onClick={() => setLightbox(img)}
                className={`reveal reveal-delay-${(i % 6) + 1} group relative rounded-2xl overflow-hidden bg-navy-800 cursor-pointer ${
                  img.wide ? "sm:col-span-2" : ""
                }`}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-xs text-teal-light font-700 uppercase tracking-wide">
                    {img.category}
                  </span>
                  <h3 className="font-display font-700 text-white text-base mt-1">
                    {img.title}
                  </h3>
                  <p className="text-white/70 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {img.desc}
                  </p>
                </div>

                {/* Expand icon */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="max-w-3xl w-full rounded-2xl overflow-hidden bg-navy animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={lightbox.src}
                alt={lightbox.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex items-start justify-between">
              <div>
                <span className="text-xs text-teal-light font-700 uppercase tracking-wide">
                  {lightbox.category}
                </span>
                <h3 className="font-display font-700 text-white text-lg mt-1">
                  {lightbox.title}
                </h3>
                <p className="text-white/60 text-sm mt-1">{lightbox.desc}</p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0 ml-4"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
