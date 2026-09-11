import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'

const categories = ['All', "Doctor's Insights", 'Patient Education', 'Sports Medicine', 'Recovery', 'Research']

export interface BlogPost {
  category: string
  title: string
  excerpt: string
  date: string
  readTime: string
  featured?: boolean
  img: string
  tags: string[]
}

export const posts: BlogPost[] = [
  {
    category: "Doctor's Insights",
    title: 'Robotic Surgery vs Conventional Joint Replacement — What the Data Says',
    excerpt: 'Breaking down accuracy margins, recovery times and patient outcomes from 500 robotic procedures performed at our centre.',
    date: 'July 18, 2025',
    readTime: '8 min read',
    featured: true,
    img: '/icons/png/Home/Folder_2/robotic-joint-replacement.png',
    tags: ['Robotic Surgery', 'Joint Replacement'],
  },
  {
    category: 'Patient Education',
    title: 'Understanding Knee Osteoarthritis: When Is Surgery the Right Choice?',
    excerpt: 'A detailed guide on grading arthritis severity, conservative management approaches, and the thresholds at which surgery becomes the best option.',
    date: 'July 5, 2025',
    readTime: '6 min read',
    img: '/icons/png/Blog/Folder_1/osteoarthritis.png',
    tags: ['Knee', 'Osteoarthritis'],
  },
  {
    category: 'Sports Medicine',
    title: 'ACL Injury in Young Athletes — Prevention, Diagnosis & Return to Sport',
    excerpt: 'Screening strategies, surgical decision-making and rehabilitation timelines for active patients from school sports to professional competition.',
    date: 'June 22, 2025',
    readTime: '7 min read',
    img: '/icons/png/Blog/Folder_1/acl-injury.png',
    tags: ['ACL', 'Sports Injury'],
  },
  {
    category: 'Recovery',
    title: 'The First 6 Weeks After Knee Replacement: A Week-by-Week Guide',
    excerpt: 'What to expect at each stage of recovery — from day-one mobilization to returning to normal daily activities at week six.',
    date: 'June 10, 2025',
    readTime: '5 min read',
    img: '/icons/png/Blog/Folder_1/knee-replacement.png',
    tags: ['Recovery', 'Knee Replacement'],
  },
  {
    category: 'Patient Education',
    title: 'Frozen Shoulder: Stages, Treatment, and What Patients Often Miss',
    excerpt: 'The three stages of adhesive capsulitis, why many patients are undertreated, and the most effective treatment combinations.',
    date: 'May 28, 2025',
    readTime: '6 min read',
    img: '/icons/png/Blog/Folder_1/frozen-shoulder.png',
    tags: ['Shoulder', 'Frozen Shoulder'],
  },
  {
    category: 'Research',
    title: 'Minimally Invasive Hip Replacement: Long-Term Outcomes at 10 Years',
    excerpt: 'A review of our 10-year data on minimally invasive posterior hip replacement — implant survival rates, complications and patient satisfaction.',
    date: 'May 14, 2025',
    readTime: '9 min read',
    img: '/icons/png/Blog/Folder_1/hip-replacement.png',
    tags: ['Hip Replacement', 'Research'],
  },
]

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const ref = useReveal()

  const featured = posts.find((p) => p.featured)
  const rest = posts.filter((p) => !p.featured)

  const filtered = rest.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = search === '' || p.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="bg-navy py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="section-label" style={{ color: '#0EA5E9' }}>Blog</div>
          <h1 className="font-display font-800 text-5xl text-white mt-2">Insights & Articles</h1>
          <p className="text-white/70 mt-4 max-w-lg mx-auto">
            Evidence-based orthopedic knowledge — written by Dr. Deep Chakraborty to help patients make informed decisions.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto mt-8 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 pl-12 text-white placeholder-white/40 focus:outline-none focus:border-teal text-sm"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
      </section>

      {/* Featured article */}
      {featured && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="section-label mb-5">Featured Article</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-soft-gray rounded-3xl overflow-hidden border border-border/50">
              <div className="aspect-[5/3] lg:aspect-auto lg:h-full min-h-[280px] overflow-hidden">
                <img src={featured.img} alt={featured.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-8 lg:py-12 lg:pr-12">
                <span className="text-xs text-teal font-700 bg-teal/10 px-3 py-1 rounded-full">{featured.category}</span>
                <h2 className="font-display font-800 text-2xl text-navy mt-4 leading-snug">{featured.title}</h2>
                <p className="text-navy-700 text-sm mt-3 leading-relaxed">{featured.excerpt}</p>
                <div className="flex items-center gap-4 mt-5 text-xs text-navy-700">
                  <span>{featured.date}</span>
                  <span>·</span>
                  <span>{featured.readTime}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {featured.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-white border border-border/60 text-navy-700 px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <button className="btn-primary mt-6 text-sm">Read Article →</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filter + Grid */}
      <section className="py-10 bg-soft-gray" ref={ref}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-8 reveal">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-display font-600 transition-all ${
                  activeCategory === cat
                    ? 'bg-teal text-white shadow-md'
                    : 'bg-white text-navy-700 border border-border/60 hover:border-teal hover:text-teal'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-navy-700">No articles found matching your search.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <div key={post.title} className={`reveal reveal-delay-${(i % 6) + 1} group bg-white rounded-2xl overflow-hidden border border-border/50 card-hover`}>
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
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-navy-700/60">{post.date}</span>
                      <button className="text-teal text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                        Read
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-navy">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display font-800 text-3xl text-white">Stay informed about your joint health</h2>
          <p className="text-white/70 mt-3 text-sm">Get new articles and patient guides delivered to your inbox — no spam, ever.</p>
          <div className="flex gap-3 mt-7 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-teal text-sm"
            />
            <button className="btn-primary py-3 px-5 text-sm whitespace-nowrap">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  )
}
