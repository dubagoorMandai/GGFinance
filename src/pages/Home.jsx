import { Link } from 'react-router-dom'

const tools = [
  {
    to: '/auto-loan',
    icon: '🚗',
    title: 'Auto Loan Calculator',
    description:
      'Calculate your monthly payment, total interest, and full amortization schedule. See how extra payments accelerate your payoff.',
    highlights: ['Monthly payment breakdown', 'Amortization schedule', 'Early payoff savings'],
    color: 'from-blue-500 to-blue-700',
  },
  {
    to: '/mortgage',
    icon: '🏠',
    title: 'Mortgage Calculator',
    description:
      'Estimate your mortgage payment including taxes, insurance, and PMI. Model extra payments and see how they reduce interest.',
    highlights: ['PITI payment breakdown', 'PMI auto-removal', 'Payoff scenarios'],
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    to: '/investment',
    icon: '📈',
    title: 'Investment Return Calculator',
    description:
      'Project your portfolio growth with real-world adjustments for inflation and capital gains tax. Use official country inflation rates or enter your own.',
    highlights: ['Nominal & real returns', 'Official inflation rates (World Bank)', 'Tax-adjusted projections'],
    color: 'from-violet-500 to-violet-700',
  },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Smart Financial Calculators
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Free, accurate tools to help you understand loans, mortgages, and investments —
          with real-world inflation and tax adjustments.
        </p>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        {tools.map((tool) => (
          <Link
            key={tool.to}
            to={tool.to}
            className="calc-card flex flex-col hover:shadow-lg transition-shadow group"
          >
            <div className={`bg-gradient-to-br ${tool.color} rounded-xl p-4 mb-4 w-fit`}>
              <span className="text-3xl">{tool.icon}</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-brand-600 transition-colors">
              {tool.title}
            </h2>
            <p className="text-sm text-gray-500 flex-1 mb-4">{tool.description}</p>
            <ul className="space-y-1">
              {tool.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="text-brand-500">✓</span> {h}
                </li>
              ))}
            </ul>
            <span className="mt-4 text-sm font-medium text-brand-600 group-hover:underline">
              Open calculator →
            </span>
          </Link>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-10 p-4 bg-gray-100 rounded-xl text-xs text-gray-500 text-center">
        ⚠️ All calculators are for informational and educational purposes only. Results are
        estimates and do not constitute financial advice. Consult a qualified financial
        professional before making financial decisions.
      </div>
    </div>
  )
}
