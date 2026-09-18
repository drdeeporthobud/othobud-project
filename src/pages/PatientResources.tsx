import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'

const faqs = [
  {
    category: 'Before Surgery',
    items: [
      { q: 'Do I need a referral to see Dr. Deep?', a: 'No referral is required. You can book directly via this website, phone, or WhatsApp.' },
      { q: 'What tests do I need before a consultation?', a: 'For a first consultation, please bring any existing X-rays, MRI or CT reports. Dr. Deep will advise on additional investigations as required.' },
      { q: 'How do I know if I need surgery?', a: 'Surgery is only recommended when conservative management (physiotherapy, medication, injections) has failed to provide adequate relief, or when there is significant structural damage. Dr. Deep will explain all options before any recommendation.' },
    ],
  },
  {
    category: 'After Surgery',
    items: [
      { q: 'How long will I stay in hospital after joint replacement?', a: 'Most patients are discharged within 3–5 days after a knee or hip replacement. Robotic procedures often allow earlier discharge.' },
      { q: 'When can I drive after knee replacement?', a: 'Most patients can drive after 6–8 weeks, provided they are not on prescription pain medication and have adequate reflexes. Your surgeon will confirm this at your follow-up.' },
      { q: 'Is physiotherapy compulsory after surgery?', a: 'Yes — physiotherapy is an essential part of recovery. A structured rehabilitation programme begins from the first day post-surgery.' },
    ],
  },
  {
    category: 'Insurance & Billing',
    items: [
      { q: 'Does Dr. Deep accept cashless insurance?', a: 'Yes. Cashless treatment is available through empanelled hospitals for most major health insurance providers. Please confirm your insurer with our clinic coordinator.' },
      { q: 'What is the consultation fee?', a: 'Consultation fees vary by clinic. Please contact us at +91 79801 44046 for current fee details.' },
    ],
  },
]

const guides = [
  {
    icon: '/icons/png/patient-guides/pre-checklist.webp',
    title: 'Pre-Operative Checklist',
    desc: 'Everything you need to do and bring before your surgery date.',
    tag: 'Surgery Prep',
  },
  {
    icon: '/icons/png/patient-guides/post-knee.webp',
    title: 'Post-Knee Replacement Exercises',
    desc: 'A gentle illustrated guide to exercises from Day 1 through Week 12.',
    tag: 'Rehabilitation',
  },
  {
    icon: '/icons/png/patient-guides/nutrition-bone.webp',
    title: 'Nutrition for Bone Health',
    desc: 'Diet recommendations before and after orthopedic surgery.',
    tag: 'Recovery',
  },
  {
    icon: '/icons/png/patient-guides/sleep.webp',
    title: 'Sleep & Rest After Surgery',
    desc: 'Positioning, sleeping aids, and what to expect during the first 2 weeks.',
    tag: 'Recovery',
  },
  {
    icon: '/icons/png/patient-guides/post-surgical.webp',
    title: 'Managing Post-Surgical Pain',
    desc: 'Medication guidance, when to call the clinic, and natural pain relief.',
    tag: 'Pain Management',
  },
  {
    icon: '/icons/png/patient-guides/patient-discharge.webp',
    title: 'Patient Discharge Instructions',
    desc: 'Step-by-step home care guide for the first 30 days post-discharge.',
    tag: 'Discharge',
  },
]

const testimonials = [
  {
    name: 'Sudipta Banerjee', age: 58, procedure: 'Knee Replacement',
    text: "I walked without pain for the first time in five years within 6 weeks of surgery. Dr. Deep's calm reassurance made all the difference.",
    img: 'https://images.unsplash.com/photo-1547212371-eb5e6a4b590c?w=80&h=80&fit=crop&auto=format',
    stars: 5,
  },
  {
    name: 'Rohit Sharma', age: 28, procedure: 'ACL Reconstruction',
    text: 'As a competitive footballer, I was back on the pitch in 9 months. The rehabilitation guidance I received was exceptional.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format',
    stars: 5,
  },
  {
    name: 'Pratima Dey', age: 65, procedure: 'Hip Replacement',
    text: 'The robotic surgery meant I was up and walking the very next day. I wish I had come to Dr. Deep years ago.',
    img: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=80&h=80&fit=crop&auto=format',
    stars: 5,
  },
  {
    name: 'Anirban Ghosh', age: 45, procedure: 'Shoulder Arthroscopy',
    text: 'Six months after surgery I am completely pain-free. The recovery guide was incredibly helpful and the follow-up care was thorough.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format',
    stars: 5,
  },
  {
    name: 'Meena Agarwal', age: 52, procedure: 'Knee Arthroscopy',
    text: 'Very professional and understanding doctor. He explained everything clearly and I never felt rushed during consultation.',
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&auto=format',
    stars: 5,
  },
  {
    name: 'Debashis Roy', age: 70, procedure: 'Hip Replacement',
    text: 'At 70, I was nervous about major surgery. Dr. Deep made me feel completely safe. Today I walk 5 km every morning.',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&auto=format',
    stars: 5,
  },
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
          className={`flex-shrink-0 ml-4 transition-transform ${open ? 'rotate-180' : ''}`}
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

export default function PatientResources() {
  const [activeTab, setActiveTab] = useState('Guides')
  const heroRef = useReveal()
  const guidesRef = useReveal()
  const faqRef = useReveal()
  const testimonialsRef = useReveal()

  const tabs = ['Guides', 'Patient Stories', 'FAQs', 'Downloads']

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="bg-navy py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="section-label" style={{ color: '#0EA5E9' }}>For Patients</div>
          <h1 className="font-display font-800 text-5xl text-white mt-2">Patient Resource Centre</h1>
          <p className="text-white/70 mt-4 max-w-xl mx-auto">
            Everything you need to prepare, recover and thrive — guides, videos, FAQs, and real patient stories.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-white border-b border-border sticky top-18 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-4 text-sm font-display font-600 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-teal text-teal'
                    : 'border-transparent text-navy-700 hover:text-navy'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recovery Guides */}
      {activeTab === 'Guides' && (
        <section className="py-16 bg-soft-gray" ref={guidesRef}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="font-display font-800 text-3xl text-navy mb-8 reveal">Recovery & Patient Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {guides.map((g, i) => (
                <div key={g.title} className={`reveal reveal-delay-${(i % 6) + 1} bg-white rounded-2xl p-6 border border-border/50 card-hover`}>
                  <div className="w-14 h-14 mb-4 flex items-center justify-center">
                    <img src={g.icon} alt={g.title} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-teal font-700 bg-teal/10 px-3 py-1 rounded-full">{g.tag}</span>
                  <h3 className="font-display font-700 text-navy text-lg mt-3">{g.title}</h3>
                  <p className="text-sm text-navy-700 mt-2 leading-relaxed">{g.desc}</p>
                  <button className="mt-5 flex items-center gap-2 text-teal text-sm font-semibold hover:gap-3 transition-all">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download PDF
                  </button>
                </div>
              ))}
            </div>

            {/* Exercise videos */}
            <div className="mt-16">
              <h2 className="font-display font-800 text-3xl text-navy mb-8 reveal">Exercise & Rehabilitation Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { title: 'Post-Knee Replacement: Week 1–2 Exercises', duration: '12 min' },
                  { title: 'Hip Replacement: Safe Movements Guide', duration: '15 min' },
                  { title: 'ACL Recovery: Return to Sport Protocol', duration: '20 min' },
                ].map((video, i) => (
                  <div key={video.title} className={`reveal reveal-delay-${i + 1} bg-white rounded-2xl overflow-hidden border border-border/50 card-hover`}>
                    <div className="aspect-video bg-navy-800 relative flex items-center justify-center">
                      <img
                        src={`https://images.unsplash.com/photo-${i === 0 ? '1559757175-0eb30cd8c063' : i === 1 ? '1551076805-e1869033e561' : '1576091160399-112ba8d25d1d'}?w=400&h=225&fit=crop&auto=format`}
                        alt={video.title}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute w-14 h-14 rounded-full bg-teal/90 flex items-center justify-center shadow-xl">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-700 text-navy text-sm">{video.title}</h3>
                      <p className="text-xs text-navy-700 mt-1">By Dr. Deep Chakraborty</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Patient Stories */}
      {activeTab === 'Patient Stories' && (
        <section className="py-16 bg-soft-gray" ref={testimonialsRef}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="font-display font-800 text-3xl text-navy mb-8 reveal">Real Patient Experiences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div key={t.name} className={`reveal reveal-delay-${(i % 6) + 1} bg-white rounded-2xl p-7 border border-border/50 card-hover`}>
                  <div className="text-teal text-lg mb-4">{'★'.repeat(t.stars)}</div>
                  <p className="text-navy-700 text-sm leading-relaxed italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border/50">
                    <img src={t.img} alt={t.name} className="w-11 h-11 rounded-full object-cover bg-border" />
                    <div>
                      <div className="font-display font-700 text-navy text-sm">{t.name}</div>
                      <div className="text-xs text-navy-700">{t.procedure} · Age {t.age}</div>
                    </div>
                    <div className="ml-auto text-xs text-teal font-semibold">Google ★</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {activeTab === 'FAQs' && (
        <section className="py-16 bg-soft-gray" ref={faqRef}>
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="font-display font-800 text-3xl text-navy mb-8 reveal">Frequently Asked Questions</h2>
            <div className="space-y-8">
              {faqs.map((section) => (
                <div key={section.category}>
                  <h3 className="font-display font-700 text-teal text-sm uppercase tracking-widest mb-4">{section.category}</h3>
                  <div className="space-y-3">
                    {section.items.map((item) => (
                      <FAQItem key={item.q} q={item.q} a={item.a} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Downloads */}
      {activeTab === 'Downloads' && (
        <section className="py-16 bg-soft-gray">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <h2 className="font-display font-800 text-3xl text-navy mb-8">Patient Downloads</h2>
            <div className="space-y-3">
              {[
                { title: 'Pre-Operative Instructions', size: '1.2 MB', type: 'PDF' },
                { title: 'Post-Operative Exercise Programme — Knee', size: '3.5 MB', type: 'PDF' },
                { title: 'Post-Operative Exercise Programme — Hip', size: '3.1 MB', type: 'PDF' },
                { title: 'Diet & Nutrition Guide for Recovery', size: '0.8 MB', type: 'PDF' },
                { title: 'Insurance & Documentation Checklist', size: '0.5 MB', type: 'PDF' },
                { title: 'Medication Schedule Template', size: '0.3 MB', type: 'PDF' },
              ].map((doc, i) => (
                <div key={doc.title} className="flex items-center justify-between bg-white rounded-xl border border-border/60 px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                      <span className="text-red-600 font-display font-800 text-xs">PDF</span>
                    </div>
                    <div>
                      <div className="font-display font-600 text-navy text-sm">{doc.title}</div>
                      <div className="text-xs text-navy-700 mt-0.5">{doc.size}</div>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-teal text-sm font-semibold hover:text-teal-dark transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-teal">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display font-800 text-3xl text-white">Have a specific question?</h2>
          <p className="text-white/80 mt-3">Speak directly with Dr. Deep's care team or book a consultation.</p>
          <div className="flex flex-wrap gap-4 justify-center mt-7">
            <Link to="/book-appointment" className="bg-white text-teal font-display font-700 px-7 py-3 rounded-xl hover:bg-soft-gray transition-colors">
              Book Appointment
            </Link>
            <a href="https://wa.me/917980144046" className="bg-white/20 text-white border border-white/30 font-display font-700 px-7 py-3 rounded-xl hover:bg-white/30 transition-colors">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
