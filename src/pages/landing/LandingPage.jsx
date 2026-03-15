import React, { useState, useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────────────────────
   SETUP REQUIRED
   1. In index.html <head>:
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

   2. tailwind.config.js:
      theme: {
        extend: {
          fontFamily: {
            display: ['Sora', 'sans-serif'],
            body: ['DM Sans', 'sans-serif'],
          }
        }
      }
   ───────────────────────────────────────────────────────────── */

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
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
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
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-shadow duration-300 font-body ${scrolled ? 'shadow-lg shadow-slate-900/5' : ''}`}>

      {/* Logo */}
      <a href="#" className="flex items-center gap-2 no-underline">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <span className="font-display font-bold text-xl text-slate-900">InvoiceFlow</span>
      </a>

      {/* Nav links */}
      <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
        {['Features', 'Templates', 'Pricing', 'Testimonials'].map(l => (
          <li key={l}>
            <a href={`#${l.toLowerCase()}`} className="text-sm font-medium text-slate-500 hover:text-blue-600 no-underline transition-colors duration-200">
              {l}
            </a>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <a href="/login" className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 no-underline transition-all duration-200">
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
// HERO
// ─────────────────────────────────────────────────────────────
const Hero = () => {
  const barHeights = [40, 55, 35, 70, 60, 80, 65, 90, 75, 85, 70, 95]

  return (
    <section
      className="min-h-screen flex items-center justify-center pt-28 pb-16 px-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 45%, #1e3a5f 100%)' }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(37,99,235,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,.08) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      {/* Glow top-right */}
      <div className="absolute pointer-events-none rounded-full"
        style={{ width: 700, height: 700, top: -200, right: -200, background: 'radial-gradient(circle, rgba(37,99,235,.18) 0%, transparent 70%)' }} />
      {/* Glow bottom-left */}
      <div className="absolute pointer-events-none rounded-full"
        style={{ width: 400, height: 400, bottom: 0, left: -100, background: 'radial-gradient(circle, rgba(34,197,94,.1) 0%, transparent 70%)' }} />

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* ── Left copy ── */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 text-xs font-semibold font-display"
            style={{ background: 'rgba(37,99,235,.18)', borderColor: 'rgba(37,99,235,.35)', color: '#93C5FD' }}>
            <span>🚀</span> New · Multi-template invoicing is here
          </div>

          <h1 className="font-display font-extrabold text-slate-50 mb-5 leading-tight"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', lineHeight: 1.15 }}>
            Billing Software<br />Built for<br />
            <span className="text-blue-400">Modern Business</span>
          </h1>

          <p className="text-base text-slate-400 leading-relaxed mb-9 max-w-lg">
            Create stunning invoices, manage vendors & customers, track payments — all from one powerful dashboard. Trusted by 12,000+ businesses.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="/register"
              className="inline-flex items-center px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 no-underline transition-all duration-200 hover:-translate-y-px hover:shadow-xl hover:shadow-blue-600/30">
              Start Free Trial
            </a>
            <a href="#templates"
              className="inline-flex items-center px-7 py-3.5 rounded-xl text-base font-semibold no-underline transition-all duration-200 border hover:bg-white/5"
              style={{ borderColor: 'rgba(255,255,255,.15)', color: '#94A3B8' }}>
              View Templates →
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
            {[
              { num: '12K+', label: 'Active Businesses' },
              { num: '$84M+', label: 'Invoices Processed' },
              { num: '99.9%', label: 'Uptime SLA' },
            ].map(s => (
              <div key={s.label}>
                <div className="font-display font-extrabold text-2xl text-slate-50">{s.num}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: mock dashboard ── */}
        <div className="hidden lg:block">
          <div
            className="bg-white rounded-2xl overflow-hidden transition-transform duration-500 cursor-default"
            style={{ boxShadow: '0 32px 80px rgba(0,0,0,.45)', transform: 'perspective(1000px) rotateY(-6deg) rotateX(2deg)' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'perspective(1000px) rotateY(-2deg) rotateX(0deg)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'perspective(1000px) rotateY(-6deg) rotateX(2deg)'}
          >
            {/* Window bar */}
            <div className="flex items-center gap-2 px-5 py-3 bg-white border-b border-slate-100">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <div className="flex-1 h-2 bg-slate-100 rounded ml-3" />
            </div>
            {/* Body */}
            <div className="flex min-h-80">
              {/* Sidebar */}
              <div className="w-14 flex flex-col items-center py-4 gap-3 bg-slate-900">
                {[true, false, false, false, false].map((active, i) => (
                  <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: active ? '#2563EB' : 'rgba(148,163,184,.1)' }}>
                    <div className="w-3.5 h-3.5 rounded" style={{ background: active ? '#fff' : 'rgba(148,163,184,.4)' }} />
                  </div>
                ))}
              </div>
              {/* Content */}
              <div className="flex-1 p-4 bg-slate-50">
                {/* Stat cards */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[{ l: 'Total Revenue', v: '$48,240' }, { l: 'Pending', v: '$6,120' }, { l: 'Paid', v: '$42,120' }].map(c => (
                    <div key={c.l} className="bg-white rounded-xl p-2.5 border border-slate-100">
                      <div className="text-slate-400 mb-1" style={{ fontSize: '.5rem' }}>{c.l}</div>
                      <div className="font-display font-bold text-slate-900 text-sm">{c.v}</div>
                    </div>
                  ))}
                </div>
                {/* Mini bar chart */}
                <div className="bg-white rounded-xl p-2.5 border border-slate-100 mb-3">
                  <div className="text-slate-400 mb-1.5" style={{ fontSize: '.5rem' }}>Monthly Revenue</div>
                  <div className="flex items-end gap-0.5 h-10">
                    {barHeights.map((h, i) => (
                      <div key={i} className="flex-1"
                        style={{ height: `${h}%`, background: i === barHeights.length - 1 ? '#2563EB' : '#DBEAFE', borderRadius: '2px 2px 0 0' }} />
                    ))}
                  </div>
                </div>
                {/* Table */}
                <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                  <div className="grid bg-slate-50" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
                    {['Client', 'Date', 'Amount', 'Status'].map(h => (
                      <div key={h} className="px-2 py-1.5 font-semibold text-slate-600" style={{ fontSize: '.5rem' }}>{h}</div>
                    ))}
                  </div>
                  {[
                    { c: 'Acme Corp', d: 'Mar 12', a: '$1,240', bg: '#DCFCE7', tc: '#15803D', s: 'paid' },
                    { c: 'TechFlow', d: 'Mar 10', a: '$3,500', bg: '#FEF3C7', tc: '#B45309', s: 'pending' },
                    { c: 'Studio X', d: 'Mar 08', a: '$840', bg: '#FEE2E2', tc: '#B91C1C', s: 'overdue' },
                    { c: 'BuildIt', d: 'Mar 05', a: '$2,100', bg: '#DCFCE7', tc: '#15803D', s: 'paid' },
                  ].map(r => (
                    <div key={r.c} className="grid border-t border-slate-50" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
                      <div className="px-2 py-1 text-slate-500" style={{ fontSize: '.5rem' }}>{r.c}</div>
                      <div className="px-2 py-1 text-slate-400" style={{ fontSize: '.5rem' }}>{r.d}</div>
                      <div className="px-2 py-1 font-semibold text-slate-700" style={{ fontSize: '.5rem' }}>{r.a}</div>
                      <div className="px-2 py-1">
                        <span className="px-1.5 py-0.5 rounded-full font-bold" style={{ fontSize: '.4rem', background: r.bg, color: r.tc }}>{r.s}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// FEATURES
// ─────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: '🧾', title: 'Smart Invoice Builder', desc: 'Build professional invoices in seconds. Choose from multiple templates, add your logo, and customize every detail.' },
  { icon: '👥', title: 'Customer & Vendor Management', desc: 'Maintain a complete directory of customers and vendors. Track history, balances, and contact details in one place.' },
  { icon: '📊', title: 'Real-time Dashboard', desc: 'Get an instant snapshot of your revenue, pending dues, and overdue invoices — all updated in real time.' },
  { icon: '🏷️', title: 'Invoice Status Tracking', desc: 'Track every invoice from Draft → Pending → Paid or Overdue. Color-coded statuses make it effortless.' },
  { icon: '🔐', title: 'Multi-user & Role Control', desc: 'Super Admin controls the organization. Customers manage their own vendors, clients, and invoices independently.' },
  { icon: '📤', title: 'PDF Export & Sharing', desc: 'Export any invoice as a beautifully formatted PDF. Share directly via email or a secure link.' },
]

const Features = () => (
  <section id="features" className="py-24 px-8 bg-white">
    <div className="max-w-6xl mx-auto">
      <FadeUp className="text-center">
        <span className="inline-block text-xs font-display font-bold tracking-widest uppercase text-blue-600 mb-3">Features</span>
        <h2 className="font-display font-extrabold text-slate-900 mb-4" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.5rem)' }}>
          Everything you need to<br />run billing smoothly
        </h2>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
          From invoice creation to payment tracking, InvoiceFlow covers your entire billing workflow in one elegant platform.
        </p>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
        {FEATURES.map((f, i) => (
          <FadeUp key={f.title} delay={i * 80}>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl mb-5">{f.icon}</div>
              <h3 className="font-display font-bold text-slate-900 mb-2.5" style={{ fontSize: '1.05rem' }}>{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
)

// ─────────────────────────────────────────────────────────────
// TEMPLATES
// ─────────────────────────────────────────────────────────────
const TEMPLATES = [
  { name: 'Classic Pro', tag: 'Clean & Professional', color: '#2563EB', accent: '#DBEAFE' },
  { name: 'Modern Minimal', tag: 'Sleek & Minimal', color: '#0F172A', accent: '#F1F5F9' },
  { name: 'Bold Agency', tag: 'Creative & Bold', color: '#7C3AED', accent: '#EDE9FE' },
  { name: 'Soft Studio', tag: 'Elegant & Warm', color: '#D97706', accent: '#FEF3C7' },
  { name: 'Corporate Dark', tag: 'Dark & Premium', color: '#1E293B', accent: '#CBD5E1' },
]

const TemplateCard = ({ tpl, active }) => (
  <div className={`flex-shrink-0 w-72 bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 border-2 ${active ? 'border-blue-600 shadow-xl shadow-blue-600/15' : 'border-slate-200 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-600/15'}`}>
    <div className="flex flex-col p-5 gap-2" style={{ height: 208, background: tpl.accent }}>
      <div className="flex justify-between items-start">
        <div className="w-10 h-4 rounded" style={{ background: tpl.color }} />
        <div>
          <div className="font-bold text-xs" style={{ color: tpl.color }}>INVOICE</div>
          <div className="flex gap-3 mt-0.5">
            <span className="text-slate-400" style={{ fontSize: '.45rem' }}>#INV-0042</span>
            <span className="text-slate-400" style={{ fontSize: '.45rem' }}>Mar 15, 2026</span>
          </div>
        </div>
      </div>
      <div className="h-px bg-slate-200 my-1" />
      {[['Web Design', '3', '$300'], ['SEO Audit', '1', '$180'], ['Hosting', '12', '$96']].map(([n, q, p]) => (
        <div key={n} className="flex justify-between">
          <span className="text-slate-500" style={{ fontSize: '.45rem' }}>{n}</span>
          <span className="text-slate-400" style={{ fontSize: '.45rem' }}>{q}</span>
          <span className="text-slate-500" style={{ fontSize: '.45rem' }}>{p}</span>
        </div>
      ))}
      <div className="h-px bg-slate-200 my-1" />
      <div className="flex justify-between">
        <span />
        <span className="font-semibold text-slate-600" style={{ fontSize: '.45rem' }}>Total</span>
        <span className="font-bold" style={{ fontSize: '.55rem', color: tpl.color }}>$576.00</span>
      </div>
    </div>
    <div className="px-5 py-4">
      <div className="font-display font-bold text-slate-900" style={{ fontSize: '.9rem' }}>{tpl.name}</div>
      <div className="text-xs text-slate-400 mt-0.5">{tpl.tag}</div>
    </div>
  </div>
)

const TemplatesSection = () => (
  <section id="templates" className="py-24 px-8 bg-slate-50">
    <div className="max-w-6xl mx-auto">
      <FadeUp>
        <span className="inline-block text-xs font-display font-bold tracking-widest uppercase text-blue-600 mb-3">Invoice Templates</span>
        <h2 className="font-display font-extrabold text-slate-900 mb-4" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.5rem)' }}>
          Beautiful templates for<br />every business type
        </h2>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Pick a template that matches your brand. Every template is fully customizable — add your logo, colors, and terms.
        </p>
      </FadeUp>
      <div className="flex gap-6 mt-10 overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin' }}>
        {TEMPLATES.map((t, i) => <TemplateCard key={t.name} tpl={t} active={i === 0} />)}
      </div>
    </div>
  </section>
)

// ─────────────────────────────────────────────────────────────
// DASHBOARD PREVIEW
// ─────────────────────────────────────────────────────────────
const BARS = [30, 45, 60, 40, 75, 55, 80, 65, 90, 70, 85, 100]
const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

const DashboardPreview = () => (
  <section className="py-24 px-8 bg-white">
    <div className="max-w-6xl mx-auto">
      <FadeUp className="text-center">
        <span className="inline-block text-xs font-display font-bold tracking-widest uppercase text-blue-600 mb-3">Dashboard</span>
        <h2 className="font-display font-extrabold text-slate-900 mb-4" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.5rem)' }}>
          Your entire business at a glance
        </h2>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
          Understand your cash flow, track overdue invoices, and monitor growth — all in one clean dashboard.
        </p>
      </FadeUp>

      <FadeUp delay={150}>
        <div className="rounded-2xl p-6 mt-10" style={{ background: '#0F172A', boxShadow: '0 24px 60px rgba(0,0,0,.3)' }}>
          {/* Top bar */}
          <div className="flex items-center justify-between rounded-xl px-4 py-3 mb-4" style={{ background: 'rgba(255,255,255,.04)' }}>
            <span className="font-display font-bold text-slate-100 text-sm">📊 Overview — March 2026</span>
            <div className="flex gap-2">
              {['This Month', 'Last Month', 'YTD'].map(l => (
                <button key={l} className="px-3 py-1 rounded text-xs font-semibold border-0 cursor-pointer transition-all duration-200"
                  style={{ background: l === 'This Month' ? '#2563EB' : 'rgba(255,255,255,.06)', color: l === 'This Month' ? '#fff' : '#64748B' }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[
              { label: 'Total Revenue', val: '$48,240', delta: '+12.4%', up: true },
              { label: 'Invoices Sent', val: '142', delta: '+8 this week', up: true },
              { label: 'Pending Dues', val: '$6,120', delta: '3 invoices', up: false },
              { label: 'Overdue', val: '$1,840', delta: '2 invoices', up: false },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)' }}>
                <div className="text-xs text-slate-500 mb-1">{s.label}</div>
                <div className="font-display font-extrabold text-slate-100 text-2xl mb-1">{s.val}</div>
                <div className={`text-xs ${s.up ? 'text-green-400' : 'text-red-400'}`}>{s.up ? '↑' : '↓'} {s.delta}</div>
              </div>
            ))}
          </div>

          {/* Chart + recent invoices */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 rounded-xl p-4" style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)' }}>
              <div className="text-xs font-semibold text-slate-400 mb-3">Monthly Revenue Trend</div>
              <div className="flex items-end gap-1.5 h-24">
                {BARS.map((h, i) => (
                  <div key={i} className="flex-1 rounded-t transition-all duration-300"
                    style={{ height: `${h}%`, background: i === BARS.length - 1 ? '#2563EB' : 'rgba(37,99,235,.3)' }} />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {MONTHS.map(m => <div key={m} className="flex-1 text-center text-slate-600" style={{ fontSize: '.45rem' }}>{m}</div>)}
              </div>
            </div>
            <div className="lg:col-span-2 rounded-xl p-4" style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)' }}>
              <div className="text-xs font-semibold text-slate-400 mb-3">Recent Invoices</div>
              <div className="flex flex-col gap-2">
                {[
                  { name: 'Acme Corp', amt: '$1,240', s: 'paid', bg: '#DCFCE7', tc: '#15803D' },
                  { name: 'TechFlow Ltd', amt: '$3,500', s: 'pending', bg: '#FEF3C7', tc: '#B45309' },
                  { name: 'Studio X', amt: '$840', s: 'overdue', bg: '#FEE2E2', tc: '#B91C1C' },
                  { name: 'BuildIt Inc', amt: '$2,100', s: 'paid', bg: '#DCFCE7', tc: '#15803D' },
                  { name: 'Spark Media', amt: '$650', s: 'pending', bg: '#FEF3C7', tc: '#B45309' },
                ].map(r => (
                  <div key={r.name} className="flex items-center justify-between px-2.5 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,.04)' }}>
                    <span className="text-slate-300 font-medium text-xs">{r.name}</span>
                    <span className="px-2 py-0.5 rounded-full font-bold" style={{ fontSize: '.5rem', background: r.bg, color: r.tc }}>{r.s}</span>
                    <span className="font-bold text-slate-100 text-xs">{r.amt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeUp>
    </div>
  </section>
)

// ─────────────────────────────────────────────────────────────
// PRICING
// ─────────────────────────────────────────────────────────────
const PLANS = [
  {
    plan: 'Starter', price: '0', desc: 'Perfect for freelancers just getting started.',
    features: ['5 invoices / month', '1 user', '2 templates', 'PDF export'],
    missing: ['Customer portal', 'Priority support'],
    cta: 'Get Started Free', featured: false,
  },
  {
    plan: 'Professional', price: '19', desc: 'For growing businesses with more clients.',
    features: ['Unlimited invoices', '5 users', 'All templates', 'PDF export', 'Customer portal', 'Priority support'],
    missing: [], cta: 'Start Free Trial', featured: true,
  },
  {
    plan: 'Enterprise', price: '49', desc: 'Full control for large organizations.',
    features: ['Unlimited invoices', 'Unlimited users', 'All templates', 'PDF export', 'Customer portal', 'Dedicated support'],
    missing: [], cta: 'Contact Sales', featured: false,
  },
]

const Pricing = () => (
  <section id="pricing" className="py-24 px-8 bg-slate-50">
    <div className="max-w-6xl mx-auto">
      <FadeUp className="text-center">
        <span className="inline-block text-xs font-display font-bold tracking-widest uppercase text-blue-600 mb-3">Pricing</span>
        <h2 className="font-display font-extrabold text-slate-900 mb-4" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.5rem)' }}>
          Simple, transparent pricing
        </h2>
        <p className="text-base text-slate-500 max-w-md mx-auto">No hidden fees. Start free, upgrade when you're ready.</p>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {PLANS.map((p, i) => (
          <FadeUp key={p.plan} delay={i * 100}>
            <div className={`relative rounded-2xl p-8 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 ${p.featured ? 'border-2 border-blue-600 shadow-2xl shadow-blue-600/20' : 'border border-slate-200 bg-white hover:shadow-xl hover:shadow-slate-900/10'}`}
              style={p.featured ? { background: 'linear-gradient(145deg, #EFF6FF 0%, #fff 100%)' } : {}}>
              {p.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-xs font-display font-bold whitespace-nowrap">
                  ⚡ Most Popular
                </div>
              )}
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">{p.plan}</div>
              <div className="flex items-end gap-1 mb-1 font-display">
                <span className="text-xl font-bold text-slate-900 self-start mt-2">$</span>
                <span className="font-extrabold text-slate-900 leading-none" style={{ fontSize: '2.8rem' }}>{p.price}</span>
                <span className="text-slate-400 text-sm mb-1">/mo</span>
              </div>
              <p className="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">{p.desc}</p>
              <ul className="flex flex-col gap-3 mb-8 flex-1 list-none p-0 m-0">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <span className="font-bold text-green-500 text-base flex-shrink-0">✓</span> {f}
                  </li>
                ))}
                {p.missing.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-400 opacity-50">
                    <span className="text-slate-300 flex-shrink-0">–</span> {f}
                  </li>
                ))}
              </ul>
              <a href="/register"
                className={`w-full flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold no-underline transition-all duration-200 ${p.featured ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}>
                {p.cta}
              </a>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
)

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { text: 'InvoiceFlow completely changed how we handle billing. Our clients love the clean invoice designs and we save hours every month.', name: 'Riya Sharma', role: 'Founder, Studio Bloom', color: '#7C3AED', initials: 'RS' },
  { text: 'As a freelancer managing 30+ clients, the customer portal and vendor management features are a game-changer. Highly recommend.', name: 'Arjun Mehta', role: 'Independent Consultant', color: '#2563EB', initials: 'AM' },
  { text: 'We switched from spreadsheets to InvoiceFlow and never looked back. The dashboard gives us complete visibility on our cash flow.', name: 'Priya Nair', role: 'Operations Lead, TechForge', color: '#D97706', initials: 'PN' },
]

const Testimonials = () => (
  <section id="testimonials" className="py-24 px-8" style={{ background: '#0F172A' }}>
    <div className="max-w-6xl mx-auto">
      <FadeUp className="text-center">
        <span className="inline-block text-xs font-display font-bold tracking-widest uppercase text-blue-500 mb-3">Testimonials</span>
        <h2 className="font-display font-extrabold text-slate-50 mb-4" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.5rem)' }}>
          Loved by businesses across India
        </h2>
        <p className="text-base text-slate-400 max-w-md mx-auto leading-relaxed">
          Join thousands of businesses who trust InvoiceFlow to run their billing.
        </p>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {TESTIMONIALS.map((t, i) => (
          <FadeUp key={t.name} delay={i * 100}>
            <div className="rounded-2xl p-7 flex flex-col h-full" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
              <div className="text-yellow-400 text-base mb-4 tracking-widest">★★★★★</div>
              <p className="text-sm text-slate-400 leading-relaxed italic flex-1 mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                  style={{ background: t.color }}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-slate-100 text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{t.role}</div>
                </div>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
)

// ─────────────────────────────────────────────────────────────
// FINAL CTA
// ─────────────────────────────────────────────────────────────
const FinalCTA = () => (
  <section className="py-24 px-8 text-center relative overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0F172A 60%, #162032 100%)' }}>
    <div className="absolute rounded-full pointer-events-none"
      style={{ width: 600, height: 600, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'radial-gradient(circle, rgba(37,99,235,.2) 0%, transparent 70%)' }} />
    <div className="relative z-10 max-w-2xl mx-auto">
      <FadeUp>
        <h2 className="font-display font-extrabold text-slate-50 mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}>
          Ready to simplify<br />your billing?
        </h2>
        <p className="text-base text-slate-400 leading-relaxed mb-10">
          Start free today. No credit card required. Set up your first invoice in under 5 minutes.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/register"
            className="inline-flex items-center px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 no-underline transition-all duration-200 hover:-translate-y-px hover:shadow-xl hover:shadow-blue-600/30">
            🚀 Start Free — No Card Needed
          </a>
          <a href="/demo"
            className="inline-flex items-center px-8 py-3.5 rounded-xl text-base font-semibold no-underline transition-all duration-200 border hover:bg-white/5"
            style={{ borderColor: 'rgba(255,255,255,.15)', color: '#94A3B8' }}>
            See Live Demo
          </a>
        </div>
      </FadeUp>
    </div>
  </section>
)

// ─────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="px-8 pt-12 pb-8" style={{ background: '#080E1A', borderTop: '1px solid rgba(255,255,255,.06)' }}>
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        <div>
          <a href="#" className="flex items-center gap-2 no-underline mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
              </svg>
            </div>
            <span className="font-display font-bold text-xl text-slate-100">InvoiceFlow</span>
          </a>
          <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
            Modern billing software for freelancers, agencies, and growing businesses.
          </p>
        </div>
        {[
          { title: 'Product', links: ['Features', 'Templates', 'Pricing', 'Changelog'] },
          { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
          { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
        ].map(col => (
          <div key={col.title}>
            <div className="text-xs font-display font-bold uppercase tracking-widest text-slate-400 mb-4">{col.title}</div>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              {col.links.map(l => (
                <li key={l}>
                  <a href="#" className="text-sm text-slate-600 hover:text-slate-300 no-underline transition-colors duration-200">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <span className="text-xs text-slate-600">© 2026 InvoiceFlow. All rights reserved.</span>
        <span className="text-xs text-slate-600">Made with ❤️ for businesses everywhere</span>
      </div>
    </div>
  </footer>
)

// ─────────────────────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────────────────────
const LandingPage = () => (
  <div className="font-body">
    {/* <Navbar /> */}
    <Hero />
    <Features />
    <TemplatesSection />
    <DashboardPreview />
    <Pricing />
    <Testimonials />
    <FinalCTA />
    {/* <Footer /> */}
  </div>
)

export default LandingPage