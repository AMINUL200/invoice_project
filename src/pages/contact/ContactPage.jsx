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

const FadeUp = ({ children, delay = 0, className = '' }) => {
  const [ref, visible] = useVisible()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
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
          { label: 'Pricing', href: '/pricing' },
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ].map(l => (
          <li key={l.label}>
            <a
              href={l.href}
              className={`text-sm font-medium no-underline transition-colors duration-200 ${l.label === 'Contact' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
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
// HERO
// ─────────────────────────────────────────────────────────────
const ContactHero = () => (
  <section
    className="pt-32 pb-16 px-8 relative overflow-hidden"
    style={{ background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 50%, #1e3a5f 100%)' }}
  >
    <div className="absolute inset-0 pointer-events-none"
      style={{ backgroundImage: 'linear-gradient(rgba(37,99,235,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,.07) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
    <div className="absolute pointer-events-none rounded-full"
      style={{ width: 500, height: 500, top: -150, right: -100, background: 'radial-gradient(circle, rgba(37,99,235,.15) 0%, transparent 70%)' }} />

    <div className="max-w-3xl mx-auto text-center relative z-10">
      <FadeUp>
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 text-xs font-semibold"
          style={{ background: 'rgba(37,99,235,.15)', borderColor: 'rgba(37,99,235,.3)', color: '#93C5FD', fontFamily: "'Sora', sans-serif" }}
        >
          <span>💬</span> We're here to help
        </div>
        <h1
          className="font-extrabold text-slate-50 mb-5 leading-tight"
          style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', lineHeight: 1.13 }}
        >
          Get in touch with<br />
          <span className="text-blue-400">our team</span>
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-xl mx-auto">
          Have a question, problem, or just want to say hello? We typically respond within a few hours during business days.
        </p>
      </FadeUp>
    </div>
  </section>
)

// ─────────────────────────────────────────────────────────────
// CONTACT CHANNELS
// ─────────────────────────────────────────────────────────────
const ContactChannels = () => (
  <section className="py-12 px-8 bg-white border-b border-slate-100">
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[
        {
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          ),
          label: 'Email Us',
          value: 'support@invoiceflow.com',
          sub: 'Response within 4–6 hours',
          href: 'mailto:support@invoiceflow.com',
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-100',
        },
        {
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          ),
          label: 'Live Chat',
          value: 'Chat with support',
          sub: 'Mon–Fri, 9am–6pm IST',
          href: '#',
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-100',
        },
        {
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ),
          label: 'Help Center',
          value: 'Browse help articles',
          sub: '200+ guides & tutorials',
          href: '/help',
          color: 'text-purple-600',
          bg: 'bg-purple-50',
          border: 'border-purple-100',
        },
      ].map((c, i) => (
        <FadeUp key={c.label} delay={i * 80}>
          <a
            href={c.href}
            className={`flex items-start gap-4 p-5 rounded-2xl border no-underline transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${c.bg} ${c.border}`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm ${c.color}`}>
              {c.icon}
            </div>
            <div>
              <div className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${c.color}`} style={{ fontFamily: "'Sora', sans-serif" }}>{c.label}</div>
              <div className="font-semibold text-slate-800 text-sm mb-0.5" style={{ fontFamily: "'Sora', sans-serif" }}>{c.value}</div>
              <div className="text-xs text-slate-500">{c.sub}</div>
            </div>
          </a>
        </FadeUp>
      ))}
    </div>
  </section>
)

// ─────────────────────────────────────────────────────────────
// CONTACT FORM + SUPPORT INFO
// ─────────────────────────────────────────────────────────────
const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: 'general', message: '' })
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'
  const [focused, setFocused] = useState('')

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    setTimeout(() => setStatus('success'), 1800)
  }

  const inputBase = "w-full px-4 py-3 rounded-xl border text-slate-900 text-sm bg-white outline-none transition-all duration-200 placeholder-slate-400"
  const getInputStyle = (field) => ({
    borderColor: focused === field ? '#2563EB' : '#CBD5E1',
    boxShadow: focused === field ? '0 0 0 3px rgba(37,99,235,.1)' : 'none',
  })

  return (
    <section className="py-20 px-8 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-14">

        {/* ── FORM (3/5) ── */}
        <div className="lg:col-span-3">
          <FadeUp>
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>
              Send a Message
            </span>
            <h2 className="font-extrabold text-slate-900 mb-2 leading-tight" style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)' }}>
              We read every message
            </h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Whether it's a bug, a feature request, or just a question — drop us a note and we'll get back to you.
            </p>

            {status === 'success' ? (
              <div className="rounded-2xl p-10 text-center border border-green-200 bg-green-50">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="font-bold text-slate-900 mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>Message sent!</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Thanks for reaching out, <span className="font-semibold text-slate-700">{form.name}</span>. We'll reply to <span className="font-semibold text-slate-700">{form.email}</span> within a few hours.
                </p>
                <button
                  onClick={() => { setStatus(null); setForm({ name: '', email: '', subject: 'general', message: '' }) }}
                  className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 border-0 cursor-pointer transition-all duration-200"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Full Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused('')}
                      placeholder="Rahul Kumar"
                      required
                      className={inputBase}
                      style={getInputStyle('name')}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email Address *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused('')}
                      placeholder="you@company.com"
                      required
                      className={inputBase}
                      style={getInputStyle('email')}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    onFocus={() => setFocused('subject')}
                    onBlur={() => setFocused('')}
                    className={inputBase + " cursor-pointer"}
                    style={{ ...getInputStyle('subject'), color: form.subject ? '#0F172A' : '#94A3B8' }}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="technical">Technical Support</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="enterprise">Enterprise / Sales</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused('')}
                    placeholder="Tell us what's on your mind. The more detail you share, the faster we can help."
                    required
                    rows={5}
                    className={inputBase + " resize-none"}
                    style={getInputStyle('message')}
                  />
                  <div className="text-xs text-slate-400 text-right">{form.message.length} / 1000</div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 border-0 cursor-pointer transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-blue-600/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  {status === 'sending' ? (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </FadeUp>
        </div>

        {/* ── SUPPORT INFO (2/5) ── */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <FadeUp delay={120}>
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>
              Support Info
            </span>
            <h2 className="font-extrabold text-slate-900 mb-6 leading-tight" style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.5rem' }}>
              Other ways to reach us
            </h2>

            {/* Email cards */}
            <div className="flex flex-col gap-4 mb-6">
              {[
                { label: 'General Support', email: 'support@invoiceflow.com', icon: '🛟', desc: 'Account issues, billing questions, general help' },
                { label: 'Sales & Enterprise', email: 'sales@invoiceflow.com', icon: '💼', desc: 'Pricing, custom plans, team onboarding' },
                { label: 'Report a Bug', email: 'bugs@invoiceflow.com', icon: '🐛', desc: 'Found something broken? Tell us directly' },
              ].map(e => (
                <div key={e.email} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-200">
                  <span className="text-xl flex-shrink-0 mt-0.5">{e.icon}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">{e.label}</div>
                    <a href={`mailto:${e.email}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700 no-underline block truncate">{e.email}</a>
                    <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{e.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Office hours card */}
            <div className="rounded-2xl p-5 border border-slate-200 bg-white">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🕐</span>
                <span className="font-bold text-slate-900 text-sm" style={{ fontFamily: "'Sora', sans-serif" }}>Support Hours</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  { day: 'Monday – Friday', time: '9:00 AM – 7:00 PM', note: 'IST', active: true },
                  { day: 'Saturday', time: '10:00 AM – 4:00 PM', note: 'IST', active: true },
                  { day: 'Sunday', time: 'Closed', note: '', active: false },
                ].map(h => (
                  <div key={h.day} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{h.day}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${h.active ? 'text-slate-700' : 'text-slate-400'}`}>{h.time}</span>
                      {h.note && <span className="text-xs text-slate-400">{h.note}</span>}
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${h.active ? 'bg-green-400' : 'bg-slate-300'}`} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-slate-500">Average response time: <strong className="text-slate-700">under 4 hours</strong></span>
              </div>
            </div>

            {/* Social / community */}
            <div className="rounded-2xl p-5 border border-slate-200 bg-slate-50 mt-4">
              <div className="font-bold text-slate-900 text-sm mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>
                🌐 Find us online
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Twitter / X', handle: '@invoiceflow', href: '#' },
                  { label: 'LinkedIn', handle: 'InvoiceFlow', href: '#' },
                  { label: 'GitHub', handle: 'invoiceflow-app', href: '#' },
                ].map(s => (
                  <a key={s.label} href={s.href}
                    className="flex items-center justify-between text-xs no-underline text-slate-500 hover:text-blue-600 transition-colors duration-200 py-1">
                    <span className="font-medium">{s.label}</span>
                    <span className="text-blue-500 font-semibold">{s.handle}</span>
                  </a>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'How quickly will I get a response?',
    a: 'We aim to respond to all messages within 4–6 hours during business hours (Mon–Sat, 9am–7pm IST). For enterprise or urgent queries, response times are typically faster.',
  },
  {
    q: 'Is there a free plan available?',
    a: "Yes! Our Starter plan is completely free and lets you send up to 5 invoices per month with 1 user and 2 templates. No credit card needed to get started.",
  },
  {
    q: 'Can I upgrade or downgrade my plan anytime?',
    a: 'Absolutely. You can switch plans at any time from your account settings. Upgrades take effect immediately; downgrades apply at the next billing cycle.',
  },
  {
    q: 'Do you offer refunds?',
    a: "Yes, we offer a 7-day full refund on all paid plans — no questions asked. Just reach out to support@invoiceflow.com and we'll process it promptly.",
  },
  {
    q: 'Can I use InvoiceFlow for my whole team?',
    a: 'Yes. The Professional plan supports up to 5 users, and the Enterprise plan supports unlimited users. Each user gets their own login and permissions can be managed by the admin.',
  },
  {
    q: 'What invoice templates are available?',
    a: 'We currently offer 5 beautifully designed templates: Classic Pro, Modern Minimal, Bold Agency, Soft Studio, and Corporate Dark. New templates are added regularly.',
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. All data is encrypted in transit and at rest. We use industry-standard security practices and never share your data with third parties.',
  },
  {
    q: 'Do you have a mobile app?',
    a: "Our web app is fully responsive and works great on mobile browsers. A dedicated iOS and Android app is currently in development — subscribe to updates for early access.",
  },
]

const FAQItem = ({ faq, index }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${open ? 'border-blue-200 shadow-md shadow-blue-600/5' : 'border-slate-200 hover:border-slate-300'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white cursor-pointer border-0 outline-none transition-colors duration-200 hover:bg-slate-50"
      >
        <span className="font-semibold text-slate-800 text-sm pr-4 leading-snug" style={{ fontFamily: "'Sora', sans-serif" }}>{faq.q}</span>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${open ? 'bg-blue-600 rotate-45' : 'bg-slate-100'}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={open ? '#fff' : '#64748B'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '200px' : '0', opacity: open ? 1 : 0 }}
      >
        <div className="px-6 pb-5 pt-1 text-sm text-slate-500 leading-relaxed border-t border-slate-100 bg-white">
          {faq.a}
        </div>
      </div>
    </div>
  )
}

const FAQ = () => (
  <section className="py-24 px-8 bg-slate-50">
    <div className="max-w-4xl mx-auto">
      <FadeUp className="text-center mb-12">
        <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>FAQ</span>
        <h2 className="font-extrabold text-slate-900 mb-4 leading-tight" style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(1.7rem, 3vw, 2.4rem)' }}>
          Frequently asked questions
        </h2>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
          Can't find your answer here? Use the contact form above or email us directly.
        </p>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FAQS.map((faq, i) => (
          <FadeUp key={i} delay={i * 50}>
            <FAQItem faq={faq} index={i} />
          </FadeUp>
        ))}
      </div>

      {/* Still need help */}
      <FadeUp delay={200}>
        <div className="mt-10 rounded-2xl p-8 text-center" style={{ background: '#0F172A' }}>
          <p className="text-slate-300 text-sm mb-4">
            Still have questions? We're always happy to help.
          </p>
          <a
            href="mailto:support@invoiceflow.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 no-underline transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-blue-600/30"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Email support@invoiceflow.com
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
        {['Privacy', 'Terms', 'About'].map(l => (
          <a key={l} href={`/${l.toLowerCase()}`} className="text-xs text-slate-600 hover:text-slate-400 no-underline transition-colors duration-200">{l}</a>
        ))}
      </div>
    </div>
  </footer>
)

// ─────────────────────────────────────────────────────────────
// CONTACT PAGE
// ─────────────────────────────────────────────────────────────
const ContactPage = () => (
  <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
    {/* <Navbar /> */}
    <ContactHero />
    <ContactChannels />
    <ContactForm />
    <FAQ />
    {/* <Footer /> */}
  </div>
)

export default ContactPage