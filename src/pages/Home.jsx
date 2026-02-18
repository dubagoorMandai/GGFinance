import { Link } from 'react-router-dom'

const tools = [
  {
    to: '/auto-loan',
    emoji: '🚗',
    title: 'Auto Loan',
    subtitle: 'Calculator',
    description: 'Monthly payments, total interest, and a full amortization schedule. See real savings from extra payments.',
    features: ['Payment breakdown', 'Amortization schedule', 'Early payoff savings'],
    gradient: 'from-sky-400 to-blue-600',
    glow: 'shadow-blue-200',
    tag: 'Loans',
    tagColor: 'text-blue-600 bg-blue-50',
  },
  {
    to: '/mortgage',
    emoji: '🏠',
    title: 'Mortgage',
    subtitle: 'Calculator',
    description: 'Full PITI breakdown with flexible PMI options, taxes, insurance, and payoff scenarios.',
    features: ['PITI + PMI control', 'Amortization schedule', 'Payoff scenarios'],
    gradient: 'from-emerald-400 to-teal-600',
    glow: 'shadow-emerald-200',
    tag: 'Real Estate',
    tagColor: 'text-emerald-600 bg-emerald-50',
  },
  {
    to: '/rent-vs-buy',
    emoji: '⚖️',
    title: 'Rent vs Buy',
    subtitle: 'Estimator',
    description: 'Compare true long-term costs of renting vs owning. Break-even analysis with opportunity cost.',
    features: ['Break-even finder', 'Opportunity cost', 'Year-by-year chart'],
    gradient: 'from-orange-400 to-rose-500',
    glow: 'shadow-rose-200',
    tag: 'Real Estate',
    tagColor: 'text-rose-600 bg-rose-50',
    badge: 'Popular',
  },
  {
    to: '/investment',
    emoji: '📈',
    title: 'Investment',
    subtitle: 'Calculator',
    description: 'Project growth with inflation and capital gains tax. Live rates from the World Bank for 30+ countries.',
    features: ['Real vs nominal returns', 'World Bank live data', 'Tax-adjusted growth'],
    gradient: 'from-violet-400 to-purple-600',
    glow: 'shadow-violet-200',
    tag: 'Investing',
    tagColor: 'text-violet-600 bg-violet-50',
  },
]

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: 'Live Inflation Data',
    desc: 'Official CPI rates from the World Bank for 30+ countries, fetched in real time.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Private by Design',
    desc: 'Every calculation runs locally in your browser. No data leaves your device.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Instant Results',
    desc: 'Full amortization schedules and interactive charts computed in milliseconds.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Always Free',
    desc: 'No account, no paywall, no ads. All four tools available forever at no cost.',
  },
]

export default function Home() {
  return (
    <div className="space-y-16 -mt-2 pb-8">

      {/* ── HERO ── */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-8 py-16 text-center text-white">
        {/* dot grid */}
        <div className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* blue glow orb */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Free Financial Tools
          </div>

          <h1 className="text-5xl sm:text-6xl font-black mb-5 leading-[1.1] tracking-tight">
            Smarter money<br />
            <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              decisions start here
            </span>
          </h1>

          <p className="text-slate-300 text-lg mb-10 leading-relaxed">
            Four powerful calculators built for real life — inflation, taxes,
            PMI, opportunity cost, and break-even analysis all included.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/mortgage"
              className="bg-white text-slate-900 font-bold px-7 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Mortgage Calculator
            </Link>
            <Link
              to="/rent-vs-buy"
              className="bg-white/10 border border-white/20 text-white font-semibold px-7 py-3 rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              Rent vs Buy
            </Link>
          </div>
        </div>
      </section>

      {/* ── TOOL CARDS ── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Tools</h2>
            <p className="text-sm text-gray-500 mt-0.5">Pick a calculator to get started</p>
          </div>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            4 tools
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className={`group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg ${tool.glow} transition-all duration-200 p-6 flex flex-col overflow-hidden`}
            >
              {/* subtle gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`} />

              {/* badge */}
              {tool.badge && (
                <span className="absolute top-4 right-4 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                  {tool.badge}
                </span>
              )}

              <div className="relative z-10 flex flex-col h-full">
                {/* icon */}
                <div className={`self-start bg-gradient-to-br ${tool.gradient} rounded-2xl w-12 h-12 flex items-center justify-center text-2xl mb-4 shadow-md`}>
                  {tool.emoji}
                </div>

                {/* tag + title */}
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${tool.tagColor}`}>
                    {tool.tag}
                  </span>
                </div>
                <h3 className="text-[17px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                  {tool.title}{' '}
                  <span className="font-normal text-gray-400">{tool.subtitle}</span>
                </h3>

                {/* description */}
                <p className="text-sm text-gray-500 mt-2 mb-5 leading-relaxed flex-1">
                  {tool.description}
                </p>

                {/* feature pills */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {tool.features.map((f) => (
                    <span key={f} className="text-[11px] bg-gray-50 border border-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>

                {/* CTA row */}
                <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                  Open calculator
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── WHY GG FINANCE ── */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Why GG Finance?</h2>
          <p className="text-sm text-gray-500 mt-1">Built to give you real answers, not estimates that ignore real life.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUICK STATS BAR ── */}
      <section className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-white">
          {[
            { val: '4',     label: 'Financial Tools' },
            { val: '100%',  label: 'Free Forever' },
            { val: '30+',   label: 'Countries Supported' },
            { val: '0',     label: 'Accounts Needed' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-black text-blue-300">{s.val}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DISCLAIMER ── */}
      <p className="text-center text-xs text-gray-400">
        For informational and educational purposes only. Not financial advice.
        Consult a qualified financial professional before making decisions.
      </p>

    </div>
  )
}
