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
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MOCK POST DATA  (swap with real data / props / router param)
// ─────────────────────────────────────────────────────────────
const POST = {
  category: 'Invoicing',
  categoryColor: { bg: '#DBEAFE', text: '#1D4ED8' },
  title: 'How to Create a Professional Invoice That Gets You Paid Faster',
  subtitle: 'A well-designed invoice is more than paperwork — it\'s a statement of trust.',
  date: 'March 10, 2026',
  readTime: '6 min read',
  author: {
    name: 'Rahul Kumar',
    initials: 'RK',
    color: '#2563EB',
    role: 'Co-founder & Product',
    bio: 'Former SaaS product manager turned builder. Passionate about making billing feel less like work.',
  },
  tags: ['Invoicing', 'Design', 'Getting Paid', 'Business'],
  tableOfContents: [
    { id: 'why-design-matters', label: 'Why Invoice Design Matters' },
    { id: 'essential-elements', label: 'Essential Invoice Elements' },
    { id: 'payment-terms', label: 'Setting Clear Payment Terms' },
    { id: 'common-mistakes', label: 'Common Mistakes to Avoid' },
    { id: 'template-choice', label: 'Choosing the Right Template' },
    { id: 'conclusion', label: 'Conclusion' },
  ],
}

const RELATED_POSTS = [
  {
    slug: 'freelancer-invoice-mistakes',
    category: 'Freelancing',
    categoryColor: { bg: '#FEF3C7', text: '#B45309' },
    title: '7 Invoice Mistakes Freelancers Make (And How to Fix Them)',
    excerpt: 'From missing payment terms to vague line items — these common errors delay payment and damage client trust.',
    author: { name: 'Fatima Iyer', initials: 'FI', color: '#7C3AED' },
    date: 'Mar 5, 2026',
    readTime: '5 min read',
    bg: '#EFF6FF',
  },
  {
    slug: 'invoice-payment-terms-guide',
    category: 'Finance',
    categoryColor: { bg: '#FEE2E2', text: '#B91C1C' },
    title: 'Net 15, Net 30, Due on Receipt — What Payment Terms Should You Use?',
    excerpt: 'Payment terms can make or break your cash flow. Learn which term fits your business type.',
    author: { name: 'Aryan Singh', initials: 'AS', color: '#D97706' },
    date: 'Feb 27, 2026',
    readTime: '7 min read',
    bg: '#FFFBEB',
  },
  {
    slug: 'small-business-billing-tips',
    category: 'Business Tips',
    categoryColor: { bg: '#DCFCE7', text: '#15803D' },
    title: '10 Billing Best Practices for Small Business Owners in 2026',
    excerpt: 'Consistent billing habits protect your cash flow and keep revenue predictable all year long.',
    author: { name: 'Rahul Kumar', initials: 'RK', color: '#2563EB' },
    date: 'Feb 14, 2026',
    readTime: '8 min read',
    bg: '#F8FAFC',
  },
]

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
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16 bg-white/92 backdrop-blur-md border-b border-slate-200 transition-shadow duration-300 ${scrolled ? 'shadow-lg shadow-slate-900/5' : ''}`}
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
// READ PROGRESS BAR
// ─────────────────────────────────────────────────────────────
const ReadProgressBar = () => {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <div className="fixed top-16 left-0 right-0 z-40 h-0.5 bg-slate-100">
      <div className="h-full bg-blue-600 transition-all duration-100"
        style={{ width: `${progress}%` }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// HERO BANNER
// ─────────────────────────────────────────────────────────────
const PostHero = ({ post }) => (
  <section
    className="pt-24 pb-0 px-8 relative overflow-hidden"
    style={{ background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 55%, #1e3a5f 100%)' }}
  >
    <div className="absolute inset-0 pointer-events-none"
      style={{ backgroundImage: 'linear-gradient(rgba(37,99,235,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,.06) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
    <div className="absolute pointer-events-none rounded-full"
      style={{ width: 600, height: 600, top: -200, right: -100, background: 'radial-gradient(circle, rgba(37,99,235,.15) 0%, transparent 70%)' }} />

    <div className="max-w-4xl mx-auto relative z-10 pt-10 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-xs text-slate-500">
        <a href="/" className="hover:text-slate-300 no-underline transition-colors">Home</a>
        <span>›</span>
        <a href="/blog" className="hover:text-slate-300 no-underline transition-colors">Blog</a>
        <span>›</span>
        <span className="text-slate-400 truncate max-w-48">{post.category}</span>
      </div>

      <FadeUp>
        {/* Category + meta row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: post.categoryColor.bg, color: post.categoryColor.text }}>
            {post.category}
          </span>
          <span className="text-slate-500 text-xs flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {post.date}
          </span>
          <span className="text-slate-500 text-xs flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {post.readTime}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-extrabold text-slate-50 mb-5 leading-tight"
          style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.18 }}>
          {post.title}
        </h1>

        <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-2xl">{post.subtitle}</p>

        {/* Author row */}
        <div className="flex items-center justify-between flex-wrap gap-4 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,.07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
              style={{ background: post.author.color }}>
              {post.author.initials}
            </div>
            <div>
              <div className="font-semibold text-slate-200 text-sm" style={{ fontFamily: "'Sora', sans-serif" }}>{post.author.name}</div>
              <div className="text-xs text-slate-500">{post.author.role}</div>
            </div>
          </div>
          {/* Share buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 mr-1">Share:</span>
            {['Twitter', 'LinkedIn', 'Copy Link'].map(s => (
              <button key={s}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 border border-slate-700 bg-transparent hover:bg-slate-800 hover:text-white transition-all duration-200 cursor-pointer">
                {s === 'Twitter' ? '𝕏' : s === 'LinkedIn' ? 'in' : '🔗'} {s}
              </button>
            ))}
          </div>
        </div>
      </FadeUp>
    </div>
  </section>
)

// ─────────────────────────────────────────────────────────────
// TABLE OF CONTENTS (sticky sidebar)
// ─────────────────────────────────────────────────────────────
const TableOfContents = ({ items }) => {
  const [active, setActive] = useState(items[0]?.id || '')

  useEffect(() => {
    const fn = () => {
      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id)
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(items[i].id)
          break
        }
      }
    }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [items])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="sticky top-24">
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4"
          style={{ fontFamily: "'Sora', sans-serif" }}>
          Contents
        </div>
        <nav className="flex flex-col gap-1">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer border-0 bg-transparent ${active === item.id
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
            >
              {active === item.id && <span className="text-blue-600 mr-1.5 font-bold">›</span>}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* CTA widget */}
      <div className="mt-5 rounded-2xl p-5 text-center"
        style={{ background: 'linear-gradient(145deg, #1e3a5f 0%, #0F172A 100%)' }}>
        <div className="text-2xl mb-2">🧾</div>
        <div className="font-bold text-slate-100 text-sm mb-1.5" style={{ fontFamily: "'Sora', sans-serif" }}>
          Try InvoiceFlow Free
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          Create beautiful invoices in minutes. No credit card needed.
        </p>
        <a href="/register"
          className="block w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 no-underline transition-all duration-200 text-center">
          Start Free →
        </a>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ARTICLE BODY
// ─────────────────────────────────────────────────────────────

// Reusable prose components
const H2 = ({ id, children }) => (
  <h2 id={id}
    className="font-extrabold text-slate-900 mt-12 mb-5 leading-tight scroll-mt-24"
    style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.6rem' }}>
    {children}
  </h2>
)

const H3 = ({ children }) => (
  <h3 className="font-bold text-slate-800 mt-8 mb-3 leading-snug"
    style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.15rem' }}>
    {children}
  </h3>
)

const P = ({ children }) => (
  <p className="text-slate-600 leading-8 mb-5 text-base">{children}</p>
)

const UL = ({ children }) => (
  <ul className="flex flex-col gap-2.5 mb-6 list-none p-0 m-0">{children}</ul>
)

const LI = ({ children }) => (
  <li className="flex items-start gap-3 text-slate-600 text-base leading-relaxed">
    <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
      <span className="text-blue-600 font-bold" style={{ fontSize: '.55rem' }}>✓</span>
    </span>
    {children}
  </li>
)

const Callout = ({ emoji = '💡', title, children, type = 'info' }) => {
  const styles = {
    info:    { bg: '#EFF6FF', border: '#BFDBFE', icon: '#2563EB', title: '#1D4ED8' },
    warning: { bg: '#FFFBEB', border: '#FDE68A', icon: '#D97706', title: '#B45309' },
    success: { bg: '#F0FDF4', border: '#BBF7D0', icon: '#16A34A', title: '#15803D' },
    danger:  { bg: '#FEF2F2', border: '#FECACA', icon: '#DC2626', title: '#B91C1C' },
  }
  const s = styles[type]
  return (
    <div className="my-8 rounded-2xl p-5 border"
      style={{ background: s.bg, borderColor: s.border }}>
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5">{emoji}</span>
        <div>
          {title && <div className="font-bold text-sm mb-1" style={{ color: s.title, fontFamily: "'Sora', sans-serif" }}>{title}</div>}
          <div className="text-sm leading-relaxed" style={{ color: s.title }}>{children}</div>
        </div>
      </div>
    </div>
  )
}

const BlockQuote = ({ children, author }) => (
  <blockquote className="my-8 relative pl-6 border-l-4 border-blue-600">
    <p className="text-lg text-slate-700 italic leading-relaxed mb-2">{children}</p>
    {author && <span className="text-sm text-slate-400 font-medium">— {author}</span>}
  </blockquote>
)

const InvoicePreviewCard = () => (
  <div className="my-8 bg-slate-900 rounded-2xl p-6 shadow-2xl">
    <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
      Example — Well-structured invoice
    </div>
    <div className="bg-white rounded-xl overflow-hidden">
      {/* Invoice header */}
      <div className="flex justify-between items-start p-5 bg-blue-600 text-white">
        <div>
          <div className="font-bold text-lg" style={{ fontFamily: "'Sora', sans-serif" }}>INVOICE</div>
          <div className="text-blue-200 text-xs mt-0.5">#INV-2026-0089</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-sm" style={{ fontFamily: "'Sora', sans-serif" }}>YourBiz Studio</div>
          <div className="text-blue-200 text-xs">hello@yourbiz.com</div>
        </div>
      </div>
      {/* Billed to + dates */}
      <div className="grid grid-cols-3 gap-4 px-5 py-4 bg-slate-50 border-b border-slate-100">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Billed To</div>
          <div className="text-sm font-semibold text-slate-800">Acme Corp</div>
          <div className="text-xs text-slate-500">billing@acme.com</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Issue Date</div>
          <div className="text-sm text-slate-700">Mar 10, 2026</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Due Date</div>
          <div className="text-sm font-semibold text-red-600">Mar 25, 2026</div>
          <div className="text-xs text-slate-400">Net 15</div>
        </div>
      </div>
      {/* Line items */}
      <div className="px-5 py-3">
        <div className="grid text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100"
          style={{ gridTemplateColumns: '3fr 1fr 1fr 1fr' }}>
          <span>Description</span><span className="text-center">Qty</span><span className="text-right">Rate</span><span className="text-right">Total</span>
        </div>
        {[
          { desc: 'Brand Identity Package', qty: 1, rate: '$1,200', total: '$1,200' },
          { desc: 'Website Design (5 pages)', qty: 1, rate: '$2,500', total: '$2,500' },
          { desc: 'Monthly Maintenance', qty: 3, rate: '$150', total: '$450' },
        ].map(row => (
          <div key={row.desc} className="grid py-2.5 border-b border-slate-50 text-sm"
            style={{ gridTemplateColumns: '3fr 1fr 1fr 1fr' }}>
            <span className="text-slate-700">{row.desc}</span>
            <span className="text-center text-slate-500">{row.qty}</span>
            <span className="text-right text-slate-500">{row.rate}</span>
            <span className="text-right font-semibold text-slate-800">{row.total}</span>
          </div>
        ))}
      </div>
      {/* Totals */}
      <div className="px-5 pb-5 pt-2">
        <div className="ml-auto w-48 flex flex-col gap-1.5">
          <div className="flex justify-between text-sm text-slate-500"><span>Subtotal</span><span>$4,150.00</span></div>
          <div className="flex justify-between text-sm text-slate-500"><span>GST (18%)</span><span>$747.00</span></div>
          <div className="flex justify-between font-bold text-base text-slate-900 pt-2 border-t border-slate-200">
            <span style={{ fontFamily: "'Sora', sans-serif" }}>Total Due</span>
            <span style={{ fontFamily: "'Sora', sans-serif" }} className="text-blue-700">$4,897.00</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const NumberedStep = ({ num, title, children }) => (
  <div className="flex gap-5 my-6">
    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-sm flex-shrink-0 mt-0.5"
      style={{ fontFamily: "'Sora', sans-serif" }}>
      {num}
    </div>
    <div className="flex-1">
      <div className="font-bold text-slate-900 mb-1.5" style={{ fontFamily: "'Sora', sans-serif" }}>{title}</div>
      <div className="text-slate-600 text-sm leading-relaxed">{children}</div>
    </div>
  </div>
)

const ArticleBody = () => (
  <article className="min-w-0">
    {/* Intro */}
    <P>
      When was the last time you really looked at the invoice you're sending to clients? For most freelancers
      and small business owners, invoices are an afterthought — a formality generated after the real work is done.
      But your invoice is the final impression you leave with a client after every project. It signals whether
      you run a professional operation or a casual side hustle.
    </P>
    <P>
      In this guide, we'll walk through every element a professional invoice should include, the design
      principles that encourage faster payment, and the most common mistakes to avoid.
    </P>

    {/* Section 1 */}
    <H2 id="why-design-matters">Why Invoice Design Matters</H2>
    <P>
      Research consistently shows that clients pay faster when invoices are clear, well-organized, and
      professional-looking. A cluttered or confusing invoice creates friction — the client has to work
      to understand what they owe, which delays payment.
    </P>
    <P>
      Beyond payment speed, a well-designed invoice reinforces your brand. Every touchpoint with a
      client is an opportunity to show that you care about quality — including the paperwork.
    </P>

    <BlockQuote author="Freelancers Union, 2024 Report">
      71% of freelancers have experienced late payment at some point in their career — and unclear
      invoices are one of the leading causes.
    </BlockQuote>

    <Callout emoji="💡" title="Key Insight" type="info">
      Clients who receive professional, itemized invoices pay on average 2.4× faster than those who
      receive generic invoices — according to data from over 50,000 InvoiceFlow transactions.
    </Callout>

    {/* Section 2 */}
    <H2 id="essential-elements">Essential Invoice Elements</H2>
    <P>
      A complete invoice should never leave any ambiguity about what was done, what it costs, and how
      to pay. Here are the non-negotiable elements every invoice must include:
    </P>

    <H3>1. Your Business Identity</H3>
    <UL>
      <LI>Your full name or business name, clearly displayed at the top</LI>
      <LI>Your logo (even a simple wordmark adds credibility)</LI>
      <LI>Contact email and phone number</LI>
      <LI>Business address (required for GST invoices in India)</LI>
    </UL>

    <H3>2. Client Information</H3>
    <UL>
      <LI>Client's full name or company name</LI>
      <LI>Their billing email address</LI>
      <LI>Their GSTIN if applicable (for B2B in India)</LI>
    </UL>

    <H3>3. Invoice Metadata</H3>
    <UL>
      <LI>A unique invoice number (e.g. INV-2026-0089) for tracking</LI>
      <LI>Issue date — when the invoice was created</LI>
      <LI>Due date — the specific date payment is expected</LI>
    </UL>

    <InvoicePreviewCard />

    <H3>4. Line Items — Be Specific</H3>
    <P>
      Vague line items like "Design work — $2,000" create distrust and confusion. Break your work
      into specific deliverables. Specificity signals professionalism and makes it harder for
      clients to dispute the bill.
    </P>
    <UL>
      <LI>Description of each service or deliverable</LI>
      <LI>Quantity and unit (hours, days, items)</LI>
      <LI>Unit rate and line total</LI>
    </UL>

    <Callout emoji="✅" title="Good example" type="success">
      "Website Homepage Design (Figma, 2 revisions included) — 1 × $800 = $800"
    </Callout>
    <Callout emoji="❌" title="Avoid this" type="danger">
      "Web design — $800" (no context, no deliverable description)
    </Callout>

    {/* Section 3 */}
    <H2 id="payment-terms">Setting Clear Payment Terms</H2>
    <P>
      Payment terms tell your client exactly when you expect to be paid. Without them, "I'll pay soon"
      becomes the default — which can mean anything from next week to never.
    </P>

    <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        { term: 'Due on Receipt', desc: 'Payment expected immediately. Best for small projects or first-time clients.', badge: 'Fastest', badgeColor: '#DCFCE7', badgeText: '#15803D' },
        { term: 'Net 15', desc: 'Payment due 15 days after invoice date. Good balance for most freelancers.', badge: 'Popular', badgeColor: '#DBEAFE', badgeText: '#1D4ED8' },
        { term: 'Net 30', desc: 'Payment due in 30 days. Common for larger agencies and enterprise clients.', badge: 'Standard', badgeColor: '#F1F5F9', badgeText: '#334155' },
      ].map(t => (
        <div key={t.term} className="rounded-2xl p-5 bg-slate-50 border border-slate-200">
          <div className="flex items-start justify-between mb-2">
            <div className="font-bold text-slate-900 text-sm" style={{ fontFamily: "'Sora', sans-serif" }}>{t.term}</div>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: t.badgeColor, color: t.badgeText }}>{t.badge}</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
        </div>
      ))}
    </div>

    <Callout emoji="⚡" title="Pro Tip" type="warning">
      Add a late payment clause — e.g. "Invoices unpaid after 30 days are subject to a 1.5% monthly
      late fee." Even if you never enforce it, it signals that you take payment seriously.
    </Callout>

    {/* Section 4 */}
    <H2 id="common-mistakes">Common Mistakes to Avoid</H2>
    <P>
      Even experienced freelancers make these invoice errors. Here are the most common ones and how to
      fix them:
    </P>

    {[
      { num: '01', title: 'No due date', desc: 'An invoice without a due date is an open invitation to delay. Always include a specific calendar date, not just "Net 30" without calculating the actual date.' },
      { num: '02', title: 'Wrong email address', desc: 'Sending to a personal email when the billing department needs a copy is a common and avoidable mistake. Confirm the billing contact before sending.' },
      { num: '03', title: 'Missing invoice number', desc: 'Invoice numbers let both you and your client track and reference invoices easily. Without them, disputes and follow-ups become much harder.' },
      { num: '04', title: 'Unclear payment methods', desc: 'If your client doesn\'t know how to pay you — bank transfer, UPI, PayPal — they\'ll delay. Include clear payment instructions and account details.' },
    ].map(s => <NumberedStep key={s.num} num={s.num} title={s.title}>{s.desc}</NumberedStep>)}

    {/* Section 5 */}
    <H2 id="template-choice">Choosing the Right Template</H2>
    <P>
      Your invoice template sets the visual tone. A dark, minimal template works great for a design
      agency. A clean, classic template suits a legal or consulting practice. Here are the key
      factors to consider when choosing:
    </P>
    <UL>
      <LI><strong>Industry fit</strong> — creative fields can afford bolder designs; finance and legal should stay classic</LI>
      <LI><strong>Logo placement</strong> — make sure the template gives your brand room to breathe</LI>
      <LI><strong>Color customization</strong> — a template you can brand to your colors beats a generic one</LI>
      <LI><strong>PDF quality</strong> — the template must look as good in print as on screen</LI>
    </UL>

    <div className="my-8 rounded-2xl overflow-hidden border border-slate-200">
      <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">InvoiceFlow Templates</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-slate-100">
        {[
          { name: 'Classic Pro', color: '#2563EB' },
          { name: 'Modern Minimal', color: '#0F172A' },
          { name: 'Bold Agency', color: '#7C3AED' },
          { name: 'Soft Studio', color: '#D97706' },
          { name: 'Corporate Dark', color: '#1E293B' },
        ].map(t => (
          <div key={t.name} className="flex flex-col items-center gap-2 p-4">
            <div className="w-full h-14 rounded-lg" style={{ background: t.color, opacity: 0.15 }}>
              <div className="w-full h-full rounded-lg flex items-center justify-center" style={{ background: t.color }}>
                <div className="w-6 h-4 bg-white/30 rounded" />
              </div>
            </div>
            <span className="text-xs text-slate-600 font-medium text-center leading-tight">{t.name}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Section 6 */}
    <H2 id="conclusion">Conclusion</H2>
    <P>
      A professional invoice is one of the simplest ways to signal that you run a real, trustworthy
      business. It reduces disputes, speeds up payment, and leaves your clients with a positive final
      impression after every engagement.
    </P>
    <P>
      With the right tool, creating a beautiful, complete invoice takes less than two minutes. Focus on
      clear line items, specific due dates, and a template that represents your brand — and you'll
      notice the difference in how quickly clients pay.
    </P>

    <Callout emoji="🚀" title="Ready to create better invoices?" type="info">
      InvoiceFlow gives you 5 professional templates, automatic tax calculation, PDF export, and client
      tracking — all for free on the Starter plan.{' '}
      <a href="/register" className="font-bold text-blue-700 underline">Start free today →</a>
    </Callout>
  </article>
)

// ─────────────────────────────────────────────────────────────
// AUTHOR BIO
// ─────────────────────────────────────────────────────────────
const AuthorBio = ({ author }) => (
  <FadeUp>
    <div className="mt-12 rounded-2xl p-6 bg-slate-50 border border-slate-200 flex items-start gap-5">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl text-white flex-shrink-0"
        style={{ background: author.color, fontFamily: "'Sora', sans-serif" }}>
        {author.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <span className="font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>{author.name}</span>
          <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2.5 py-0.5 rounded-full">{author.role}</span>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">{author.bio}</p>
      </div>
    </div>
  </FadeUp>
)

// ─────────────────────────────────────────────────────────────
// TAGS + SHARE ROW
// ─────────────────────────────────────────────────────────────
const TagsShareRow = ({ tags }) => (
  <FadeUp>
    <div className="mt-8 pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        {tags.map(t => (
          <span key={t} className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors duration-200 cursor-pointer">
            #{t}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Share this article</span>
        {[
          { label: '𝕏 Twitter', bg: '#000', text: '#fff' },
          { label: 'in LinkedIn', bg: '#0077B5', text: '#fff' },
          { label: '🔗 Copy', bg: '#F1F5F9', text: '#334155' },
        ].map(s => (
          <button key={s.label}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all duration-200 hover:-translate-y-px hover:shadow-md"
            style={{ background: s.bg, color: s.text }}>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  </FadeUp>
)

// ─────────────────────────────────────────────────────────────
// RELATED POSTS
// ─────────────────────────────────────────────────────────────
const RelatedPosts = ({ posts }) => (
  <section className="mt-20">
    <FadeUp>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-extrabold text-slate-900" style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.5rem' }}>
          Continue Reading
        </h2>
        <a href="/blog" className="text-sm font-semibold text-blue-600 hover:text-blue-700 no-underline transition-colors">
          View all articles →
        </a>
      </div>
    </FadeUp>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((post, i) => (
        <FadeUp key={post.slug} delay={i * 80}>
          <a href={`/blog/${post.slug}`}
            className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden no-underline transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-900/10 h-full">
            <div className="h-1.5 w-full" style={{ background: post.author.color }} />
            <div className="h-28 flex items-center justify-center px-5 relative overflow-hidden"
              style={{ background: post.bg || '#F8FAFC' }}>
              <div className="absolute top-2 right-2 w-12 h-12 rounded-full opacity-15" style={{ background: post.author.color }} />
              <span className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: post.categoryColor.bg, color: post.categoryColor.text }}>
                {post.category}
              </span>
            </div>
            <div className="flex flex-col flex-1 p-5">
              <h3 className="font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors duration-200"
                style={{ fontFamily: "'Sora', sans-serif", fontSize: '.95rem', lineHeight: 1.4 }}>
                {post.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: post.author.color }}>
                    {post.author.initials}
                  </div>
                  <span className="text-xs text-slate-500">{post.author.name}</span>
                </div>
                <span className="text-xs text-slate-400">{post.readTime}</span>
              </div>
            </div>
          </a>
        </FadeUp>
      ))}
    </div>
  </section>
)

// ─────────────────────────────────────────────────────────────
// NEWSLETTER INLINE
// ─────────────────────────────────────────────────────────────
const InlineNewsletter = () => {
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
      <div className="mt-16 rounded-3xl p-8 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0F172A 100%)' }}>
        <div className="absolute pointer-events-none rounded-full"
          style={{ width: 400, height: 400, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(37,99,235,.2) 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <div className="text-3xl mb-3">📬</div>
          <h3 className="font-extrabold text-slate-50 mb-2"
            style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.4rem' }}>
            Enjoyed this article?
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-md mx-auto">
            Get billing tips, product updates, and business guides delivered straight to your inbox every week.
          </p>
          {status === 'success' ? (
            <div className="flex items-center justify-center gap-2 text-green-400 font-semibold text-sm">
              <span className="text-xl">✅</span> You're subscribed! Great to have you.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" required
                className="flex-1 px-4 py-3 rounded-xl text-sm text-slate-900 bg-white border-0 outline-none placeholder-slate-400" />
              <button type="submit" disabled={status === 'loading'}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 border-0 cursor-pointer transition-all duration-200 whitespace-nowrap disabled:opacity-60">
                {status === 'loading' ? '…' : 'Subscribe →'}
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
  <footer className="px-8 py-6 mt-16" style={{ background: '#080E1A', borderTop: '1px solid rgba(255,255,255,.06)' }}>
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
// BLOG DETAILS PAGE
// ─────────────────────────────────────────────────────────────
const BlogDetails = () => (
  <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
    {/* <Navbar /> */}
    <ReadProgressBar />
    <PostHero post={POST} />

    {/* Main content */}
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* Article — 3 cols */}
          <div className="lg:col-span-3">
            <ArticleBody />
            <TagsShareRow tags={POST.tags} />
            <AuthorBio author={POST.author} />
          </div>

          {/* Sidebar — 1 col */}
          <div className="hidden lg:block lg:col-span-1">
            <TableOfContents items={POST.tableOfContents} />
          </div>
        </div>

        {/* Related posts */}
        <RelatedPosts posts={RELATED_POSTS} />

        {/* Newsletter */}
        <InlineNewsletter />
      </div>
    </div>

    {/* <Footer /> */}
  </div>
)

export default BlogDetails