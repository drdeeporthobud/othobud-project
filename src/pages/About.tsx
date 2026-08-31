import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'

const timeline = [
  { year: '2003', event: 'MBBS from Medical College, Kolkata' },
  { year: '2007', event: 'MS (Orthopedics) from IPGMER & SSKM Hospital, Kolkata' },
  { year: '2009', event: 'DNB Orthopedics — National Board of Examinations' },
  { year: '2010', event: 'Fellowship in Joint Arthroplasty — Endo-Klinik, Hamburg, Germany' },
  { year: '2011', event: 'Commenced independent practice in Kolkata' },
  { year: '2015', event: 'Introduced Robotic-Assisted Joint Replacement in Eastern India' },
  { year: '2018', event: 'Best Orthopedic Surgeon Award — Calcutta Medical Association' },
  { year: '2023', event: 'Completed 5,000th successful joint replacement surgery' },
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
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=800&fit=crop&auto=format"
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
          <h2 className="font-display font-800 text-4xl text-navy mb-12 reveal reveal-delay-1">
            Education & Milestones
          </h2>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-teal via-border to-transparent" />
            <div className="space-y-8 pl-16">
              {timeline.map((item, i) => (
                <div key={item.year} className={`reveal reveal-delay-${(i % 6) + 1} relative`}>
                  <div className="absolute -left-10 top-1 w-8 h-8 rounded-full bg-white border-2 border-teal flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-teal" />
                  </div>
                  <div className="text-teal font-display font-800 text-sm">{item.year}</div>
                  <div className="text-navy font-medium mt-1">{item.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-20 bg-white" ref={awardsRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="section-label reveal">Recognition</div>
              <h2 className="font-display font-800 text-4xl text-navy mt-2 mb-8 reveal reveal-delay-1">
                Awards & Honours
              </h2>
              <div className="space-y-4">
                {awards.map((award, i) => (
                  <div key={award} className={`reveal reveal-delay-${i + 2} flex items-start gap-4 bg-soft-gray rounded-xl p-5`}>
                    <div className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                        <circle cx="12" cy="8" r="6" />
                        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                      </svg>
                    </div>
                    <p className="text-navy-700 text-sm leading-relaxed">{award}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="section-label reveal">Professional Affiliations</div>
              <h2 className="font-display font-800 text-4xl text-navy mt-2 mb-8 reveal reveal-delay-1">
                Memberships
              </h2>
              <div className="space-y-3 mb-10">
                {memberships.map((m, i) => (
                  <div key={m} className={`reveal reveal-delay-${i + 2} flex items-center gap-3 bg-soft-gray rounded-xl px-5 py-4`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-navy-700 text-sm">{m}</span>
                  </div>
                ))}
              </div>

              <div className="reveal">
                <div className="section-label mb-4">Hospital Affiliations</div>
                <div className="space-y-3">
                  {hospitals.map((h, i) => (
                    <div key={h.name} className={`reveal reveal-delay-${i + 1} flex items-center justify-between bg-soft-gray rounded-xl px-5 py-4`}>
                      <div>
                        <div className="font-display font-700 text-navy text-sm">{h.name}</div>
                        <div className="text-xs text-navy-700 mt-0.5">{h.location}</div>
                      </div>
                      <span className="text-xs text-teal font-semibold bg-teal/10 px-3 py-1 rounded-full">{h.role}</span>
                    </div>
                  ))}
                </div>
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
