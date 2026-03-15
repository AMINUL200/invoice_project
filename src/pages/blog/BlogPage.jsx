import React, { useState, useEffect, useRef } from 'react'

// ── Intersection observer hook ────────────────────────────────
const useVisible = (threshold = 0.1) => {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

const FadeUp = ({ children, delay = 0, className = '' }) => {
  const [ref, visible] = useVisible()
  return (
    <div ref={ref} className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Invoicing', 'Business Tips', 'Product Updates', 'Freelancing', 'Finance']

const POSTS = [
  {
    id: 1,
    slug: 'how-to-create-professional-invoice',
    category: 'Invoicing',
    featured: true,
    title: 'How to Create a Professional Invoice That Gets You Paid Faster',
    excerpt: 'A well-designed invoice isn\'t just paperwork — it\'s a signal of professionalism. Learn the key elements every invoice must have and the design principles that make clients pay on time.',
    author: { name: 'Rahul Kumar', initials: 'RK', color: '#2563EB' },
    date: 'Mar 10, 2026',
    readTime: '6 min read',
    tags: ['Invoicing', 'Design', 'Getting Paid'],
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #0F172A 100%)',
    accent: '#60A5FA',
  },
  {
    id: 2,
    slug: 'freelancer-invoice-mistakes',
    category: 'Freelancing',
    featured: false,
    title: '7 Invoice Mistakes Freelancers Make (And How to Fix Them)',
    excerpt: 'From missing payment terms to vague line items, these common errors delay payment and damage client relationships. Here\'s what to watch out for.',
    author: { name: 'Fatima Iyer', initials: 'FI', color: '#7C3AED' },
    date: 'Mar 5, 2026',
    readTime: '5 min read',
    tags: ['Freelancing', 'Invoicing'],
    bg: '#EFF6FF',
  },
  {
    id: 3,
    slug: 'invoice-payment-terms-guide',
    category: 'Finance',
    featured: false,
    title: 'Net 15, Net 30, Due on Receipt — What Payment Terms Should You Use?',
    excerpt: 'Payment terms can make or break your cash flow. This guide breaks down every common term and helps you choose the right one for your business type.',
    author: { name: 'Aryan Singh', initials: 'AS', color: '#D97706' },
    date: 'Feb 27, 2026',
    readTime: '7 min read',
    tags: ['Finance', 'Cash Flow'],
    bg: '#FFFBEB',
  },
  {
    id: 4,
    slug: 'invoiceflow-template-update',
    category: 'Product Updates',
    featured: false,
    title: 'New in InvoiceFlow: 3 Fresh Invoice Templates + Dark Mode Preview',
    excerpt: 'We\'ve shipped 3 brand-new invoice templates and a dark mode preview option. Here\'s a full tour of what\'s new and how to use them.',
    author: { name: 'Fatima Iyer', initials: 'FI', color: '#7C3AED' },
    date: 'Feb 20, 2026',
    readTime: '3 min read',
    tags: ['Product Updates', 'Templates'],
    bg: '#F0FDF4',
  },
  {
    id: 5,
    slug: 'small-business-billing-tips',
    category: 'Business Tips',
    featured: false,
    title: '10 Billing Best Practices for Small Business Owners in 2026',
    excerpt: 'Consistent billing habits protect your cash flow. From auto-reminders to clear cancellation policies, these practices keep revenue predictable.',
    author: { name: 'Rahul Kumar', initials: 'RK', color: '#2563EB' },
    date: 'Feb 14, 2026',
    readTime: '8 min read',
    tags: ['Business Tips', 'Billing'],
    bg: '#F8FAFC',
  },
  {
    id: 6,
    slug: 'recurring-invoices-guide',
    category: 'Invoicing',
    featured: false,
    title: 'Recurring Invoices: The Complete Guide for Service Businesses',
    excerpt: 'If you bill clients the same amount every month, manual invoicing is wasting your time. Set up recurring billing once and let automation do the rest.',
    author: { name: 'Aryan Singh', initials: 'AS', color: '#D97706' },
    date: 'Feb 8, 2026',
    readTime: '6 min read',
    tags: ['Invoicing', 'Automation'],
    bg: '#FFF7ED',
  },
  {
    id: 7,
    slug: 'gst-invoice-india-guide',
    category: 'Finance',
    featured: false,
    title: 'GST-Compliant Invoices in India: Everything You Need to Know',
    excerpt: 'GST invoicing has specific requirements — GSTIN, HSN codes, tax breakdowns. This guide walks through every mandatory field and how InvoiceFlow handles them.',
    author: { name: 'Rahul Kumar', initials: 'RK', color: '#2563EB' },
    date: 'Jan 30, 2026',
    readTime: '9 min read',
    tags: ['Finance', 'GST', 'India'],
    bg: '#EFF6FF',
  },
  {
    id: 8,
    slug: 'client-onboarding-invoicing',
    category: 'Business Tips',
    featured: false,
    title: 'How to Onboard New Clients with a Billing Process They\'ll Love',
    excerpt: 'First impressions matter. A smooth invoicing onboarding process builds trust, sets expectations, and reduces late payments from day one.',
    author: { name: 'Fatima Iyer', initials: 'FI', color: '#7C3AED' },
    date: 'Jan 22, 2026',
    readTime: '5 min read',
    tags: ['Business Tips', 'Clients'],
    bg: '#FAF5FF',
  },
  {
    id: 9,
    slug: 'invoiceflow-multi-user-launch',
    category: 'Product Updates',
    featured: false,
    title: 'Announcing Multi-User Support: Invite Your Team to InvoiceFlow',
    excerpt: 'You can now invite team members, assign roles, and manage invoicing as a team. Here\'s everything about the new multi-user experience.',
    author: { name: 'Aryan Singh', initials: 'AS', color: '#D97706' },
    date: 'Jan 15, 2026',
    readTime: '4 min read',
    tags: ['Product Updates', 'Team'],
    bg: '#F0FDF4',
  },
]

const CATEGORY_COLORS = {
  'Invoicing':        { bg: '#DBEAFE', text: '#1D4ED8' },
  'Business Tips':    { bg: '#DCFCE7', text: '#15803D' },
  'Product Updates':  { bg: '#EDE9FE', text: '#6D28D9' },
  'Freelancing':      { bg: '#FEF3C7', text: '#B45309' },
  'Finance':          { bg: '#FEE2E2', text: '#B91C1C' },
}

// ─────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-shadow duration-300 ${scrolled ? 'shadow-lg shadow-slate-900/5' : ''}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <a href="/" className="flex items-center gap-2 no-underline">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <span className="font-bold text-xl text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>InvoiceFlow</span>
      </a>

      <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
        {[
          { label: 'Features', href: '/#features' },
          { label: 'Pricing', href: '/pricing' },
          { label: 'Blog', href: '/blog' },
          { label: 'About', href: '/about' },
        ].map(l => (
          <li key={l.label}>
            <a href={l.href}
              className={`text-sm font-medium no-underline transition-colors duration-200 ${l.label === 'Blog' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        <a href="/login" className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 no-underline transition-all duration-200">Sign In</a>
        <a href="/register" className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 no-underline transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-blue-600/30">Start Free</a>
      </div>
    </nav>
  )
}

// ─────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────
const BlogHero = () => (
  <section
    className="pt-32 pb-16 px-8 relative overflow-hidden"
    style={{ background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 50%, #1e3a5f 100%)' }}
  >
    <div className="absolute inset-0 pointer-events-none"
      style={{ backgroundImage: 'linear-gradient(rgba(37,99,235,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,.07) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
    <div className="absolute pointer-events-none rounded-full"
      style={{ width: 600, height: 600, top: -180, right: -80, background: 'radial-gradient(circle, rgba(37,99,235,.14) 0%, transparent 70%)' }} />

    <div className="max-w-3xl mx-auto text-center relative z-10">
      <FadeUp>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 text-xs font-semibold"
          style={{ background: 'rgba(37,99,235,.15)', borderColor: 'rgba(37,99,235,.3)', color: '#93C5FD', fontFamily: "'Sora', sans-serif" }}>
          <span>✍️</span> InvoiceFlow Blog
        </div>
        <h1 className="font-extrabold text-slate-50 mb-5 leading-tight"
          style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', lineHeight: 1.12 }}>
          Insights on billing,<br />
          <span className="text-blue-400">business & beyond</span>
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-xl mx-auto">
          Practical guides, product updates, and tips to help you get paid faster and run your business better.
        </p>
      </FadeUp>
    </div>
  </section>
)

// ─────────────────────────────────────────────────────────────
// FEATURED POST
// ─────────────────────────────────────────────────────────────
const FeaturedPost = ({ post }) => {
  const cc = CATEGORY_COLORS[post.category] || { bg: '#DBEAFE', text: '#1D4ED8' }
  return (
    <FadeUp>
      <a href={`/blog/${post.slug}`}
        className="group block rounded-3xl overflow-hidden no-underline transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/20"
        style={{ background: post.gradient }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-72">
          {/* Content */}
          <div className="p-10 flex flex-col justify-between relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(96,165,250,.2)', color: '#93C5FD' }}>
                  ⭐ Featured
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: cc.bg, color: cc.text }}>
                  {post.category}
                </span>
              </div>
              <h2 className="font-extrabold text-white mb-4 leading-tight group-hover:text-blue-200 transition-colors duration-200"
                style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', lineHeight: 1.25 }}>
                {post.title}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6">{post.excerpt}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: post.author.color }}>
                  {post.author.initials}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-300">{post.author.name}</div>
                  <div className="text-xs text-slate-500">{post.date}</div>
                </div>
              </div>
              <span className="text-xs text-slate-500 px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,.06)' }}>
                {post.readTime}
              </span>
            </div>
          </div>

          {/* Visual side */}
          <div className="relative hidden lg:flex items-center justify-center p-8 overflow-hidden">
            {/* Decorative mock invoice */}
            <div className="w-full max-w-xs bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 group-hover:scale-105 transition-transform duration-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="w-20 h-4 rounded bg-blue-400/30 mb-1.5" />
                  <div className="w-28 h-2.5 rounded bg-white/10" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-400/20 text-green-300">Paid</span>
              </div>
              <div className="space-y-2 mb-4">
                {[70, 55, 45].map((w, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <div className="h-2 rounded bg-white/20" style={{ width: `${w}%` }} />
                    <div className="h-2 w-12 rounded bg-blue-400/30" />
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-1">
                <div className="h-2 w-16 rounded bg-white/10" />
                <div className="font-bold text-blue-300 text-base" style={{ fontFamily: "'Sora', sans-serif" }}>$4,200</div>
              </div>
            </div>
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 70% 50%, rgba(37,99,235,.2) 0%, transparent 70%)' }} />
          </div>
        </div>
      </a>
    </FadeUp>
  )
}

// ─────────────────────────────────────────────────────────────
// BLOG CARD
// ─────────────────────────────────────────────────────────────
const BlogCard = ({ post, delay = 0 }) => {
  const cc = CATEGORY_COLORS[post.category] || { bg: '#DBEAFE', text: '#1D4ED8' }
  return (
    <FadeUp delay={delay}>
      <a href={`/blog/${post.slug}`}
        className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden no-underline transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-900/10 hover:border-slate-300 h-full">
        {/* Color top strip */}
        <div className="h-1.5 w-full" style={{ background: post.author.color }} />

        {/* Card illustration area */}
        <div className="h-40 flex items-center justify-center px-6 py-4 relative overflow-hidden"
          style={{ background: post.bg || '#F8FAFC' }}>
          {/* Abstract decorative elements */}
          <div className="absolute top-3 right-3 w-16 h-16 rounded-full opacity-20"
            style={{ background: post.author.color }} />
          <div className="absolute bottom-2 left-4 w-8 h-8 rounded-lg opacity-15"
            style={{ background: post.author.color }} />
          {/* Category icon */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="text-3xl">
              {post.category === 'Invoicing' ? '🧾'
                : post.category === 'Business Tips' ? '💡'
                : post.category === 'Product Updates' ? '🚀'
                : post.category === 'Freelancing' ? '🎯'
                : '📊'}
            </div>
            <div className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: cc.bg, color: cc.text }}>
              {post.category}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6">
          <h3 className="font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors duration-200"
            style={{ fontFamily: "'Sora', sans-serif", fontSize: '1rem', lineHeight: 1.4 }}>
            {post.title}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 2).map(t => (
              <span key={t} className="px-2.5 py-0.5 rounded-full text-xs font-medium text-slate-500 bg-slate-100">
                {t}
              </span>
            ))}
          </div>

          {/* Author + meta */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: post.author.color }}>
                {post.author.initials}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-700">{post.author.name}</div>
                <div className="text-xs text-slate-400">{post.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {post.readTime}
            </div>
          </div>
        </div>
      </a>
    </FadeUp>
  )
}

// ─────────────────────────────────────────────────────────────
// NEWSLETTER
// ─────────────────────────────────────────────────────────────
const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setTimeout(() => setStatus('success'), 1500)
  }

  return (
    <FadeUp>
      <div className="rounded-3xl p-10 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0F172A 100%)' }}>
        <div className="absolute pointer-events-none rounded-full"
          style={{ width: 400, height: 400, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(37,99,235,.2) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-lg mx-auto">
          <div className="text-3xl mb-3">📬</div>
          <h3 className="font-extrabold text-slate-50 mb-2"
            style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.6rem' }}>
            Stay in the loop
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-7">
            Get the latest articles, product updates, and billing tips delivered to your inbox. No spam, unsubscribe anytime.
          </p>
          {status === 'success' ? (
            <div className="flex items-center justify-center gap-2 text-green-400 font-semibold">
              <span className="text-xl">✅</span> You're subscribed! Welcome aboard.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="flex-1 px-4 py-3 rounded-xl text-sm text-slate-900 bg-white border-0 outline-none placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 border-0 cursor-pointer transition-all duration-200 hover:-translate-y-px whitespace-nowrap disabled:opacity-60"
              >
                {status === 'loading' ? 'Subscribing…' : 'Subscribe →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </FadeUp>
  )
}

// ─────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="px-8 py-6" style={{ background: '#080E1A', borderTop: '1px solid rgba(255,255,255,.06)' }}>
    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <span className="font-bold text-slate-200 text-sm" style={{ fontFamily: "'Sora', sans-serif" }}>InvoiceFlow</span>
      </div>
      <span className="text-xs text-slate-600">© 2026 InvoiceFlow. All rights reserved.</span>
      <div className="flex gap-5">
        {['Privacy', 'Terms', 'Contact'].map(l => (
          <a key={l} href={`/${l.toLowerCase()}`} className="text-xs text-slate-600 hover:text-slate-400 no-underline transition-colors duration-200">{l}</a>
        ))}
      </div>
    </div>
  </footer>
)

// ─────────────────────────────────────────────────────────────
// BLOG PAGE
// ─────────────────────────────────────────────────────────────
const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const featuredPost = POSTS.find(p => p.featured)
  const regularPosts = POSTS.filter(p => !p.featured)

  const filtered = regularPosts.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchCat && matchSearch
  })

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* <Navbar /> */}
      <BlogHero />

      <main className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-8 py-14">

          {/* Featured */}
          <div className="mb-14">
            {featuredPost && <FeaturedPost post={featuredPost} />}
          </div>

          {/* Filter bar */}
          <FadeUp>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer ${activeCategory === cat
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/25'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative flex-shrink-0">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search articles…"
                  className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 outline-none transition-all duration-200 w-52"
                  style={{ boxShadow: searchQuery ? '0 0 0 3px rgba(37,99,235,.1)' : 'none', borderColor: searchQuery ? '#2563EB' : '#E2E8F0' }}
                />
              </div>
            </div>
          </FadeUp>

          {/* Results count */}
          {(activeCategory !== 'All' || searchQuery) && (
            <FadeUp>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm text-slate-500">
                  Showing <strong className="text-slate-800">{filtered.length}</strong> article{filtered.length !== 1 ? 's' : ''}
                  {activeCategory !== 'All' && <> in <strong className="text-blue-600">{activeCategory}</strong></>}
                  {searchQuery && <> for "<strong className="text-slate-800">{searchQuery}</strong>"</>}
                </span>
                <button
                  onClick={() => { setActiveCategory('All'); setSearchQuery('') }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 px-2.5 py-1 rounded-full border-0 cursor-pointer transition-colors duration-200"
                >
                  Clear ✕
                </button>
              </div>
            </FadeUp>
          )}

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filtered.map((post, i) => (
                <BlogCard key={post.id} post={post} delay={i * 60} />
              ))}
            </div>
          ) : (
            <FadeUp>
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-bold text-slate-900 mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>No articles found</h3>
                <p className="text-sm text-slate-500 mb-6">Try a different category or search term.</p>
                <button
                  onClick={() => { setActiveCategory('All'); setSearchQuery('') }}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 border-0 cursor-pointer transition-all duration-200"
                >
                  View all articles
                </button>
              </div>
            </FadeUp>
          )}

          {/* Newsletter */}
          <Newsletter />
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  )
}

export default BlogPage