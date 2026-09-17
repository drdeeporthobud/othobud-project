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

export const categories = ['All', "Doctor's Insights", 'Patient Education', 'Sports Medicine', 'Recovery', 'Research']

export const posts: BlogPost[] = [
  {
    category: "Doctor's Insights",
    title: 'Robotic Surgery vs Conventional Joint Replacement — What the Data Says',
    excerpt: 'Breaking down accuracy margins, recovery times and patient outcomes from 500 robotic procedures performed at our centre.',
    date: 'July 18, 2025',
    readTime: '8 min read',
    featured: true,
    img: '/icons/png/specialties/robotic-joint-replacement.webp',
    tags: ['Robotic Surgery', 'Joint Replacement'],
  },
  {
    category: 'Patient Education',
    title: 'Understanding Knee Osteoarthritis: When Is Surgery the Right Choice?',
    excerpt: 'A detailed guide on grading arthritis severity, conservative management approaches, and the thresholds at which surgery becomes the best option.',
    date: 'July 5, 2025',
    readTime: '6 min read',
    img: '/icons/png/blog/osteoarthritis.webp',
    tags: ['Knee', 'Osteoarthritis'],
  },
  {
    category: 'Sports Medicine',
    title: 'ACL Injury in Young Athletes — Prevention, Diagnosis & Return to Sport',
    excerpt: 'Screening strategies, surgical decision-making and rehabilitation timelines for active patients from school sports to professional competition.',
    date: 'June 22, 2025',
    readTime: '7 min read',
    img: '/icons/png/blog/acl-injury.webp',
    tags: ['ACL', 'Sports Injury'],
  },
  {
    category: 'Recovery',
    title: 'The First 6 Weeks After Knee Replacement: A Week-by-Week Guide',
    excerpt: 'What to expect at each stage of recovery — from day-one mobilization to returning to normal daily activities at week six.',
    date: 'June 10, 2025',
    readTime: '5 min read',
    img: '/icons/png/blog/knee-replacement.webp',
    tags: ['Recovery', 'Knee Replacement'],
  },
  {
    category: 'Patient Education',
    title: 'Frozen Shoulder: Stages, Treatment, and What Patients Often Miss',
    excerpt: 'The three stages of adhesive capsulitis, why many patients are undertreated, and the most effective treatment combinations.',
    date: 'May 28, 2025',
    readTime: '6 min read',
    img: '/icons/png/blog/frozen-shoulder.webp',
    tags: ['Shoulder', 'Frozen Shoulder'],
  },
  {
    category: 'Research',
    title: 'Minimally Invasive Hip Replacement: Long-Term Outcomes at 10 Years',
    excerpt: 'A review of our 10-year data on minimally invasive posterior hip replacement — implant survival rates, complications and patient satisfaction.',
    date: 'May 14, 2025',
    readTime: '9 min read',
    img: '/icons/png/blog/hip-replacement.webp',
    tags: ['Hip Replacement', 'Research'],
  },
]
