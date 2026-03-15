import React, { useRef, useState, useEffect } from 'react'

// ── Intersection observer hook ────────────────────────────────
const useVisible = (threshold = 0.12) => {
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

// ── FadeUp wrapper ────────────────────────────────────────────
const FadeUp = ({ children, delay = 0, className = '' }) => {
  const [ref, visible] = useVisible()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ── Shared section label ──────────────────────────────────────
const SectionLabel = ({ children }) => (
  <span
    className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 mb-3"
    style={{ fontFamily: "'Sora', sans-serif" }}
  >
    {children}
  </span>
)

// ── Section heading ───────────────────────────────────────────
const SectionTitle = ({ children, light = false }) => (
  <h2
    className={`font-extrabold mb-4 leading-tight ${light ? 'text-slate-50' : 'text-slate-900'}`}
    style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(1.7rem, 3vw, 2.4rem)' }}
  >
    {children}
  </h2>
)

// ─────────────────────────────────────────────────────────────
// NAVBAR (minimal, shared with landing)
// ─────────────────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-shadow duration-300 ${scrolled ? 'shadow-lg shadow-slate-900/5' : ''}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
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
          { label: 'Templates', href: '/#templates' },
          { label: 'Pricing', href: '/pricing' },
          { label: 'About', href: '/about' },
        ].map(l => (
          <li key={l.label}>
            <a
              href={l.href}
              className={`text-sm font-medium no-underline transition-colors duration-200 ${l.label === 'About' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        <a href="/login" className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 no-underline transition-all duration-200">
          Sign In
        </a>
        <a href="/register" className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 no-underline transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-blue-600/30">
          Start Free
        </a>
      </div>
    </nav>
  )
}

// ─────────────────────────────────────────────────────────────
// HERO — What is InvoiceFlow
// ─────────────────────────────────────────────────────────────
const AboutHero = () => (
  <section
    className="pt-32 pb-20 px-8 relative overflow-hidden"
    style={{ background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 50%, #1e3a5f 100%)' }}
  >
    {/* Grid overlay */}
    <div className="absolute inset-0 pointer-events-none"
      style={{ backgroundImage: 'linear-gradient(rgba(37,99,235,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,.07) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
    {/* Glow */}
    <div className="absolute pointer-events-none rounded-full"
      style={{ width: 600, height: 600, top: -200, right: -100, background: 'radial-gradient(circle, rgba(37,99,235,.15) 0%, transparent 70%)' }} />

    <div className="max-w-4xl mx-auto relative z-10 text-center">
      <FadeUp>
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 text-xs font-semibold"
          style={{ background: 'rgba(37,99,235,.15)', borderColor: 'rgba(37,99,235,.3)', color: '#93C5FD', fontFamily: "'Sora', sans-serif" }}
        >
          <span>📖</span> Our Story
        </div>

        <h1
          className="font-extrabold text-slate-50 mb-6 leading-tight"
          style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', lineHeight: 1.12 }}
        >
          Built to make billing<br />
          <span className="text-blue-400">simple for everyone</span>
        </h1>

        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
          InvoiceFlow was born from one frustration — billing software was either too complex, too expensive,
          or too ugly. We set out to build something different: a platform that feels as good as it works.
        </p>

        {/* Quick stat row */}
        <div className="flex flex-wrap justify-center gap-10 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,.07)' }}>
          {[
            { num: '2022', label: 'Year Founded' },
            { num: '12K+', label: 'Active Businesses' },
            { num: '3', label: 'Team Members' },
            { num: '₹0', label: 'Raised (Bootstrapped)' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="font-extrabold text-2xl text-slate-50 mb-0.5" style={{ fontFamily: "'Sora', sans-serif" }}>{s.num}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </FadeUp>
    </div>
  </section>
)

// ─────────────────────────────────────────────────────────────
// WHAT IS INVOICEFLOW
// ─────────────────────────────────────────────────────────────
const WhatIsIt = () => (
  <section className="py-24 px-8 bg-white">
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      {/* Left — copy */}
      <FadeUp>
        <SectionLabel>What we built</SectionLabel>
        <SectionTitle>A billing platform that gets out of your way</SectionTitle>
        <p className="text-base text-slate-500 leading-relaxed mb-6">
          InvoiceFlow is an all-in-one billing and invoice management platform designed for small businesses,
          freelancers, and growing organizations. It replaces messy spreadsheets and overpriced accounting
          tools with one clean, fast, and affordable workspace.
        </p>
        <p className="text-base text-slate-500 leading-relaxed mb-8">
          From creating your first invoice in seconds to tracking who owes what — and sending professional
          PDFs with your own branding — InvoiceFlow handles the full billing cycle so you can focus on
          the work that actually pays.
        </p>
        <div className="flex flex-col gap-3">
          {[
            'Create invoices using beautiful, customizable templates',
            'Manage customers, vendors, and transaction history',
            'Track invoice status — Draft, Pending, Paid, Overdue',
            'Export polished PDFs and share via link or email',
            'Multi-user support with role-based access control',
          ].map(f => (
            <div key={f} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-bold" style={{ fontSize: '.6rem' }}>✓</span>
              </div>
              <span className="text-sm text-slate-600 leading-relaxed">{f}</span>
            </div>
          ))}
        </div>
      </FadeUp>

      {/* Right — visual card */}
      <FadeUp delay={150}>
        <div className="relative">
          {/* Main card */}
          <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs text-slate-500 mb-1">Invoice #INV-0089</div>
                <div className="font-display font-bold text-slate-100 text-lg" style={{ fontFamily: "'Sora', sans-serif" }}>Acme Corporation</div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#DCFCE7', color: '#15803D' }}>Paid</span>
            </div>
            <div className="space-y-2 mb-5">
              {[
                { name: 'Brand Identity Design', qty: 1, price: '$1,200' },
                { name: 'Website Development', qty: 1, price: '$3,500' },
                { name: 'Monthly Retainer', qty: 3, price: '$450' },
              ].map(item => (
                <div key={item.name} className="flex items-center justify-between py-2 border-b border-slate-800">
                  <div>
                    <div className="text-sm text-slate-200 font-medium">{item.name}</div>
                    <div className="text-xs text-slate-500">Qty: {item.qty}</div>
                  </div>
                  <div className="font-bold text-slate-100 text-sm" style={{ fontFamily: "'Sora', sans-serif" }}>{item.price}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-sm text-slate-500">Total Due</span>
              <span className="font-extrabold text-white text-xl" style={{ fontFamily: "'Sora', sans-serif" }}>$6,050.00</span>
            </div>
          </div>
          {/* Floating badge */}
          <div className="absolute -top-4 -right-4 bg-blue-600 text-white rounded-xl px-4 py-2 shadow-lg shadow-blue-600/30">
            <div className="text-xs font-semibold opacity-80">Sent via</div>
            <div className="font-bold text-sm" style={{ fontFamily: "'Sora', sans-serif" }}>InvoiceFlow</div>
          </div>
          {/* Bottom accent */}
          <div className="absolute -bottom-3 -left-3 w-16 h-16 rounded-2xl bg-green-50 border-2 border-green-200 flex items-center justify-center shadow-md">
            <span className="text-2xl">✅</span>
          </div>
        </div>
      </FadeUp>
    </div>
  </section>
)

// ─────────────────────────────────────────────────────────────
// WHY WE BUILT IT
// ─────────────────────────────────────────────────────────────
const WhyWeBuiltIt = () => (
  <section className="py-24 px-8 bg-slate-50">
    <div className="max-w-4xl mx-auto">
      <FadeUp className="text-center mb-14">
        <SectionLabel>Why we built it</SectionLabel>
        <SectionTitle>The problem we were tired of</SectionTitle>
        <p className="text-base text-slate-500 leading-relaxed max-w-2xl mx-auto">
          We were small business owners ourselves. Every tool we tried was designed for enterprise accountants,
          not for someone sending 10–20 invoices a month.
        </p>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: '😤',
            problem: 'Too Complicated',
            desc: 'Most billing tools require a finance degree to operate. We wanted something anyone could use in under 5 minutes.',
            color: 'bg-red-50 border-red-100',
            iconBg: 'bg-red-100',
          },
          {
            icon: '💸',
            problem: 'Too Expensive',
            desc: 'Paying $50–$100/month for a tool you use to send a few invoices makes no sense. Billing should be affordable.',
            color: 'bg-amber-50 border-amber-100',
            iconBg: 'bg-amber-100',
          },
          {
            icon: '🙈',
            problem: 'Too Ugly',
            desc: 'Your invoice is often the last thing a client sees. It should look professional, not like it was made in 2003.',
            color: 'bg-blue-50 border-blue-100',
            iconBg: 'bg-blue-100',
          },
        ].map((c, i) => (
          <FadeUp key={c.problem} delay={i * 100}>
            <div className={`rounded-2xl p-7 border h-full ${c.color} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>
              <div className={`w-12 h-12 rounded-xl ${c.iconBg} flex items-center justify-center text-2xl mb-5`}>{c.icon}</div>
              <h3 className="font-bold text-slate-900 mb-2.5" style={{ fontFamily: "'Sora', sans-serif" }}>{c.problem}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{c.desc}</p>
            </div>
          </FadeUp>
        ))}
      </div>

      {/* Quote */}
      <FadeUp delay={200}>
        <div className="mt-12 rounded-2xl p-8 relative overflow-hidden"
          style={{ background: '#0F172A' }}>
          <div className="absolute top-4 left-6 text-6xl font-bold opacity-10 text-blue-400 select-none" style={{ fontFamily: "'Sora', sans-serif" }}>"</div>
          <p className="text-lg text-slate-300 leading-relaxed italic text-center max-w-2xl mx-auto relative z-10 mb-5">
            So we built InvoiceFlow — the billing tool we always wished existed. Fast to learn, beautiful
            by default, and priced for real people running real businesses.
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm">RF</div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Rahul & Fatima</div>
              <div className="text-xs text-slate-500">Co-founders, InvoiceFlow</div>
            </div>
          </div>
        </div>
      </FadeUp>
    </div>
  </section>
)

// ─────────────────────────────────────────────────────────────
// MISSION
// ─────────────────────────────────────────────────────────────
const Mission = () => (
  <section className="py-24 px-8 bg-white">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — mission pillars */}
        <FadeUp>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '⚡', title: 'Speed', desc: 'Create an invoice in under 60 seconds, every time.', bg: 'bg-blue-50', border: 'border-blue-100' },
              { icon: '🎨', title: 'Design', desc: 'Every template looks like a designer made it.', bg: 'bg-purple-50', border: 'border-purple-100' },
              { icon: '🔒', title: 'Trust', desc: 'Your data is safe, private, and always available.', bg: 'bg-green-50', border: 'border-green-100' },
              { icon: '❤️', title: 'Simplicity', desc: 'No jargon. No learning curve. Just billing that works.', bg: 'bg-rose-50', border: 'border-rose-100' },
            ].map((p, i) => (
              <div key={p.title} className={`rounded-2xl p-6 border ${p.bg} ${p.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}>
                <div className="text-3xl mb-3">{p.icon}</div>
                <div className="font-bold text-slate-900 mb-1.5" style={{ fontFamily: "'Sora', sans-serif" }}>{p.title}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{p.desc}</div>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* Right — copy */}
        <FadeUp delay={150}>
          <SectionLabel>Our Mission</SectionLabel>
          <SectionTitle>
            Empower every business to bill with confidence
          </SectionTitle>
          <p className="text-base text-slate-500 leading-relaxed mb-5">
            Our mission is simple: make professional billing accessible to every business — whether you're
            a solo freelancer sending your first invoice or a team managing hundreds of clients a month.
          </p>
          <p className="text-base text-slate-500 leading-relaxed mb-8">
            We believe that getting paid on time shouldn't require expensive software, complex setup, or a
            finance background. InvoiceFlow puts the power of professional billing in everyone's hands.
          </p>
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-blue-50 border border-blue-100">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🎯</span>
            </div>
            <div>
              <div className="font-bold text-slate-900 mb-0.5" style={{ fontFamily: "'Sora', sans-serif" }}>Our North Star</div>
              <div className="text-sm text-slate-600 leading-relaxed">
                Every business, no matter how small, deserves tools that look and work like the big ones.
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  </section>
)

// ─────────────────────────────────────────────────────────────
// WHO IT'S FOR
// ─────────────────────────────────────────────────────────────
const WhoItsFor = () => (
  <section className="py-24 px-8" style={{ background: '#0F172A' }}>
    <div className="max-w-6xl mx-auto">
      <FadeUp className="text-center mb-14">
        <SectionLabel>Who it's for</SectionLabel>
        <SectionTitle light>
          Made for the people who<br />keep businesses running
        </SectionTitle>
        <p className="text-base text-slate-400 leading-relaxed max-w-xl mx-auto">
          Whether you're billing your first client or managing a whole team's invoicing, InvoiceFlow adapts to you.
        </p>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            emoji: '💼',
            audience: 'Freelancers',
            tagline: 'Get paid faster, look more professional',
            desc: 'Stop sending invoices as Word docs or plain emails. Create beautiful, branded invoices in minutes and impress every client.',
            features: ['Quick invoice creation', 'Client-ready PDF export', 'Payment status tracking', 'Affordable pricing from ₹0'],
            color: '#2563EB',
            accent: 'rgba(37,99,235,.1)',
            border: 'rgba(37,99,235,.2)',
          },
          {
            emoji: '🏪',
            audience: 'Small Businesses',
            tagline: 'Replace spreadsheets with a real system',
            desc: 'Manage customers, vendors, and invoices from one clean dashboard. Get a real-time view of who owes you money.',
            features: ['Customer & vendor management', 'Dashboard with revenue overview', 'Multi-user team access', 'Status badges (Paid / Overdue)'],
            color: '#16A34A',
            accent: 'rgba(22,163,74,.1)',
            border: 'rgba(22,163,74,.2)',
          },
          {
            emoji: '🏢',
            audience: 'Organizations',
            tagline: 'Scale billing across teams and clients',
            desc: 'Super admin control, customer portals, and organization-wide reporting. Built for businesses with multiple teams and high invoice volumes.',
            features: ['Super admin + role control', 'Unlimited users & invoices', 'Organization-level reporting', 'Dedicated support'],
            color: '#D97706',
            accent: 'rgba(217,119,6,.1)',
            border: 'rgba(217,119,6,.2)',
          },
        ].map((card, i) => (
          <FadeUp key={card.audience} delay={i * 100}>
            <div
              className="rounded-2xl p-7 h-full flex flex-col transition-all duration-300 hover:-translate-y-1"
              style={{ background: card.accent, border: `1px solid ${card.border}` }}
            >
              <div className="text-4xl mb-4">{card.emoji}</div>
              <div
                className="text-xs font-bold tracking-widest uppercase mb-2"
                style={{ color: card.color, fontFamily: "'Sora', sans-serif" }}
              >
                {card.audience}
              </div>
              <h3 className="font-bold text-slate-100 mb-3 leading-snug" style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.05rem' }}>
                {card.tagline}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">{card.desc}</p>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {card.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <span className="font-bold flex-shrink-0" style={{ color: card.color }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
)

// ─────────────────────────────────────────────────────────────
// VALUES
// ─────────────────────────────────────────────────────────────
const Values = () => (
  <section className="py-24 px-8 bg-white">
    <div className="max-w-6xl mx-auto">
      <FadeUp className="text-center mb-14">
        <SectionLabel>Our Values</SectionLabel>
        <SectionTitle>The principles we build by</SectionTitle>
        <p className="text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
          Every decision we make — from design to pricing — is guided by these core beliefs.
        </p>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { num: '01', title: 'Simplicity over features', desc: "We'd rather do fewer things exceptionally well than build a cluttered product that tries to do everything. Every feature earns its place." },
          { num: '02', title: 'Honest, fair pricing', desc: "We charge what is fair. No inflated tiers, no hidden fees, no locking essential features behind expensive plans. Growth shouldn't cost a fortune." },
          { num: '03', title: 'Design is not decoration', desc: "Good design is how the product works, not just how it looks. We sweat every interaction so our users never have to think twice." },
          { num: '04', title: 'Build for the underdog', desc: "Big businesses have big software budgets. We build for the solo freelancer, the local shop, the 5-person agency. They deserve great tools too." },
        ].map((v, i) => (
          <FadeUp key={v.num} delay={i * 80}>
            <div className="flex gap-5 p-7 rounded-2xl bg-slate-50 border border-slate-200 h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5">
              <div className="font-extrabold text-3xl text-blue-100 flex-shrink-0 select-none"
                style={{ fontFamily: "'Sora', sans-serif" }}>{v.num}</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>{v.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
)

// ─────────────────────────────────────────────────────────────
// TEAM (small, honest)
// ─────────────────────────────────────────────────────────────
const Team = () => (
  <section className="py-24 px-8 bg-slate-50">
    <div className="max-w-5xl mx-auto">
      <FadeUp className="text-center mb-14">
        <SectionLabel>The Team</SectionLabel>
        <SectionTitle>Small team, big focus</SectionTitle>
        <p className="text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
          InvoiceFlow is built by a small, bootstrapped team obsessed with making billing software that
          people actually enjoy using.
        </p>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        {[
          { initials: 'RK', name: 'Rahul Kumar', role: 'Co-founder & Product', color: '#2563EB', bio: 'Former SaaS product manager. Spent 5 years frustrated with billing tools before deciding to fix it.' },
          { initials: 'FI', name: 'Fatima Iyer', role: 'Co-founder & Engineering', color: '#7C3AED', bio: 'Full-stack engineer. Believes software should be fast, reliable, and never make users feel dumb.' },
          { initials: 'AS', name: 'Aryan Singh', role: 'Design & Growth', color: '#D97706', bio: 'Self-taught designer. Obsessed with the idea that every business deserves beautiful invoices.' },
        ].map((m, i) => (
          <FadeUp key={m.name} delay={i * 100}>
            <div className="bg-white border border-slate-200 rounded-2xl p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
              <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl text-white mx-auto mb-4"
                style={{ background: m.color, fontFamily: "'Sora', sans-serif" }}>
                {m.initials}
              </div>
              <div className="font-bold text-slate-900 mb-0.5" style={{ fontFamily: "'Sora', sans-serif" }}>{m.name}</div>
              <div className="text-xs text-blue-600 font-semibold mb-4 uppercase tracking-wider">{m.role}</div>
              <p className="text-sm text-slate-500 leading-relaxed">{m.bio}</p>
            </div>
          </FadeUp>
        ))}
      </div>

      {/* Hiring callout */}
      <FadeUp>
        <div className="rounded-2xl p-8 text-center" style={{ background: '#0F172A' }}>
          <div className="text-2xl mb-3">👋</div>
          <h3 className="font-bold text-slate-100 mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>We're a small team with big plans</h3>
          <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto mb-5">
            We're always looking for people who care deeply about craft and simplicity. Think that's you?
          </p>
          <a href="mailto:team@invoiceflow.com"
            className="inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 no-underline transition-all duration-200 hover:-translate-y-px">
            Say hello →
          </a>
        </div>
      </FadeUp>
    </div>
  </section>
)

// ─────────────────────────────────────────────────────────────
// FINAL CTA
// ─────────────────────────────────────────────────────────────
const AboutCTA = () => (
  <section
    className="py-24 px-8 text-center relative overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0F172A 60%, #162032 100%)' }}
  >
    <div className="absolute rounded-full pointer-events-none"
      style={{ width: 600, height: 600, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'radial-gradient(circle, rgba(37,99,235,.18) 0%, transparent 70%)' }} />
    <div className="relative z-10 max-w-2xl mx-auto">
      <FadeUp>
        <h2 className="font-extrabold text-slate-50 mb-4 leading-tight"
          style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          Ready to try InvoiceFlow?
        </h2>
        <p className="text-base text-slate-400 leading-relaxed mb-10 max-w-lg mx-auto">
          Join 12,000+ businesses already sending professional invoices. Start free — no credit card needed.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/register"
            className="inline-flex items-center px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 no-underline transition-all duration-200 hover:-translate-y-px hover:shadow-xl hover:shadow-blue-600/30">
            🚀 Start Free — No Card Needed
          </a>
          <a href="/"
            className="inline-flex items-center px-8 py-3.5 rounded-xl text-base font-semibold no-underline transition-all duration-200 border hover:bg-white/5"
            style={{ borderColor: 'rgba(255,255,255,.15)', color: '#94A3B8' }}>
            ← Back to Home
          </a>
        </div>
      </FadeUp>
    </div>
  </section>
)

// ─────────────────────────────────────────────────────────────
// FOOTER (minimal)
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
          <a key={l} href="#" className="text-xs text-slate-600 hover:text-slate-400 no-underline transition-colors duration-200">{l}</a>
        ))}
      </div>
    </div>
  </footer>
)

// ─────────────────────────────────────────────────────────────
// ABOUT PAGE
// ─────────────────────────────────────────────────────────────
const AboutPage = () => (
  <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
    {/* <Navbar /> */}
    <AboutHero />
    <WhatIsIt />
    <WhyWeBuiltIt />
    <Mission />
    <WhoItsFor />
    <Values />
    <Team />
    <AboutCTA />
    {/* <Footer /> */}
  </div>
)

export default AboutPage