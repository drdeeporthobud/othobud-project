import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'

const categories = ['All', 'Joint Replacement', 'Arthroscopy', 'Sports Medicine', 'Trauma', 'Pediatric']

const treatments = [
  {
    category: 'Joint Replacement',
    title: 'Robotic Knee Replacement',
    img: '/icons/png/Treatments/robotic-knee-replacement.png',
    symptoms: ['Severe knee pain not relieved by medication', 'Inability to walk without aid', 'Night pain affecting sleep', 'Significant joint deformity'],
    recovery: '6 weeks to full mobility',
    description: 'State-of-the-art robotic-assisted total knee replacement with sub-millimeter implant placement accuracy, resulting in faster recovery and longer implant life.',
  },
  {
    category: 'Joint Replacement',
    title: 'Total Hip Replacement',
    img: '/icons/png/Treatments/hip-replacement.png',
    symptoms: ['Groin or hip pain affecting daily activity', 'Limping and leg shortening', 'Stiffness limiting range of motion', 'Failed conservative management'],
    recovery: '8–12 weeks',
    description: 'Minimally invasive total hip replacement using modern ceramic, metal and polyethylene implants with customized sizing for optimal function.',
  },
  {
    category: 'Joint Replacement',
    title: 'Unicompartmental Knee Replacement',
    img: '/icons/png/Treatments/knee-replacement.png',
    symptoms: ['Localized knee arthritis (medial or lateral)', 'Bone-on-bone contact in one compartment', 'Good ligament integrity', 'Active patients under 70'],
    recovery: '4–6 weeks',
    description: 'A conservative surgical option for patients with arthritis affecting only one compartment, preserving healthy bone and faster rehabilitation.',
  },
  {
    category: 'Arthroscopy',
    title: 'Knee Arthroscopy',
    img: '/icons/png/Treatments/knee-arthroscopy.png',
    symptoms: ['Knee locking or giving way', 'Persistent swelling and pain', 'Torn meniscus or ligament', 'Cartilage damage'],
    recovery: '2–6 weeks',
    description: 'Key-hole surgery for diagnosis and treatment of knee joint pathologies including meniscal tears, cartilage damage, ligament reconstruction and loose body removal.',
  },
  {
    category: 'Sports Medicine',
    title: 'ACL Reconstruction',
    img: '/icons/png/Treatments/acl-reconstruction.png',
    symptoms: ['Knee instability during pivoting', 'Immediate swelling after injury', 'Pop sensation at time of injury', 'Inability to continue sporting activity'],
    recovery: '9–12 months to return to sport',
    description: 'Anatomic ACL reconstruction using hamstring or patellar tendon graft with accelerated rehabilitation protocols designed for athletes.',
  },
  {
    category: 'Sports Medicine',
    title: 'Shoulder Arthroscopy',
    img: '/icons/png/Treatments/shoulder-arthroscopy.png',
    symptoms: ['Rotator cuff tear', 'Recurrent shoulder dislocation', 'SLAP lesion', 'Frozen shoulder unresponsive to physio'],
    recovery: '3–6 months',
    description: 'Minimally invasive shoulder surgery for rotator cuff repairs, bankart repairs, SLAP repairs and subacromial decompression.',
  },
  {
    category: 'Trauma',
    title: 'Fracture Fixation',
    img: '/icons/png/Treatments/fracture-fixation.png',
    symptoms: ['Complex periarticular fractures', 'Intra-articular fractures', 'Non-union and malunion', 'Pathological fractures'],
    recovery: 'Varies by fracture type',
    description: 'Surgical fixation of complex fractures using modern plates, intramedullary nails and fixators with early mobilization protocols.',
  },
  {
    category: 'Pediatric',
    title: 'Pediatric Orthopedics',
    img: '/icons/png/Treatments/pediatric-orthopedics.png',
    symptoms: ["Congenital hip dysplasia", "Clubfoot deformity", "Scoliosis in children", "Limb length discrepancy"],
    recovery: 'Individualized',
    description: "Specialized orthopedic care for growing children — from congenital deformities and developmental issues to sports injuries and fractures.",
  },
]

function TreatmentCard({ t }: { t: typeof treatments[0] }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-border/60 hover:border-teal/30 hover:shadow-lg transition-all duration-300 card-hover reveal flex flex-col h-full">
      <div className="aspect-[5/3] overflow-hidden bg-soft-gray relative">
        <img
          src={t.img}
          alt={t.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3.5 right-3.5">
          <span className="text-xs font-700 text-teal bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-border/40">
            {t.category}
          </span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 mb-2 text-xs text-navy-700/80 font-medium">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.5" className="flex-shrink-0">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Recovery: <strong className="text-navy font-600">{t.recovery}</strong></span>
        </div>

        <h3 className="font-display font-700 text-navy text-xl leading-snug group-hover:text-teal transition-colors">
          {t.title}
        </h3>
        <p className="text-navy-700 text-sm mt-2.5 leading-relaxed flex-1">
          {t.description}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-teal text-sm font-semibold mt-4 hover:gap-2 transition-all w-fit cursor-pointer"
        >
          {expanded ? 'Hide Details' : 'View Symptoms & Indications'}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-border/50 space-y-3 animate-fade-up">
            <div>
              <div className="text-xs font-700 text-navy uppercase tracking-wider mb-2">Common Symptoms & Indications</div>
              <ul className="space-y-1.5">
                {t.symptoms.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-xs sm:text-sm text-navy-700">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 pt-2">
          <Link
            to={`/book-appointment?condition=${encodeURIComponent(t.title)}`}
            className="btn-primary w-full justify-center text-sm py-3 px-4 font-display font-semibold rounded-xl shadow-sm hover:shadow-md transition-all group/btn"
          >
            <span>Book for this Treatment</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover/btn:translate-x-1"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Treatments() {
  const [activeCategory, setActiveCategory] = useState('All')
  const ref = useReveal()

  const filtered = activeCategory === 'All'
    ? treatments
    : treatments.filter((t) => t.category === activeCategory)

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="bg-navy py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="section-label" style={{ color: '#0EA5E9' }}>Specialities</div>
          <h1 className="font-display font-800 text-3xl sm:text-4xl lg:text-5xl text-white mt-2">
            Treatments & Specialities
          </h1>
          <p className="text-white/70 mt-4 max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
            Comprehensive orthopedic care ranging from minimally invasive arthroscopy to advanced robotic joint replacement.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-14 sm:py-16 bg-soft-gray" ref={ref}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-10 reveal">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-display font-600 transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-teal text-white shadow-md'
                    : 'bg-white text-navy-700 border border-border/60 hover:border-teal hover:text-teal'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {filtered.map((t) => (
              <TreatmentCard key={t.title} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display font-800 text-2xl sm:text-3xl text-navy">
            Not sure which treatment you need?
          </h2>
          <p className="text-navy-700 mt-3 leading-relaxed text-sm sm:text-base">
            Book a consultation and Dr. Deep will evaluate your condition with a thorough examination and imaging review before recommending the appropriate care pathway.
          </p>
          <Link to="/book-appointment" className="btn-primary mt-7 inline-flex text-sm sm:text-base">
            Book a Consultation →
          </Link>
        </div>
      </section>
    </div>
  )
}
