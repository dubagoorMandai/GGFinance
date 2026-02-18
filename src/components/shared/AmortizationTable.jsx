import { useState, useMemo } from 'react'

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

/**
 * Builds a year-grouped summary from a monthly schedule array.
 * Each year entry has: year, totalPayment, totalPrincipal, totalInterest, endingBalance, months[]
 */
function buildYearGroups(schedule) {
  const groups = {}
  for (const row of schedule) {
    const yr = Math.ceil(row.month / 12)
    if (!groups[yr]) {
      groups[yr] = { year: yr, totalPayment: 0, totalPrincipal: 0, totalInterest: 0, endingBalance: 0, months: [] }
    }
    groups[yr].totalPayment += row.payment
    groups[yr].totalPrincipal += row.principal
    groups[yr].totalInterest += row.interest
    groups[yr].endingBalance = row.balance
    groups[yr].months.push(row)
  }
  return Object.values(groups)
}

export default function AmortizationTable({ schedule, label = 'Month' }) {
  const [show, setShow] = useState(false)
  const [view, setView] = useState('monthly') // 'monthly' | 'yearly'
  const [expandedYears, setExpandedYears] = useState(new Set())

  const yearGroups = useMemo(() => buildYearGroups(schedule), [schedule])

  const toggleYear = (yr) =>
    setExpandedYears((prev) => {
      const next = new Set(prev)
      next.has(yr) ? next.delete(yr) : next.add(yr)
      return next
    })

  return (
    <div className="mt-2">
      {/* Toggle visibility */}
      <button
        onClick={() => setShow((s) => !s)}
        className="text-sm text-brand-600 hover:underline font-medium"
      >
        {show ? '▲ Hide' : '▼ Show'} amortization schedule ({schedule.length} {label}s)
      </button>

      {show && (
        <div className="mt-3">
          {/* View switcher */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setView('monthly')}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                view === 'monthly'
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-brand-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setView('yearly')}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                view === 'yearly'
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-brand-400'
              }`}
            >
              Yearly Summary
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            {/* ── MONTHLY VIEW ── */}
            {view === 'monthly' && (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs sticky top-0">
                  <tr>
                    <th className="px-4 py-2.5">{label}</th>
                    <th className="px-4 py-2.5">Payment</th>
                    <th className="px-4 py-2.5">Principal</th>
                    <th className="px-4 py-2.5">Interest</th>
                    <th className="px-4 py-2.5">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {schedule.map((row) => (
                    <tr key={row.month} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-2 font-medium text-gray-700">{row.month}</td>
                      <td className="px-4 py-2">{fmt(row.payment)}</td>
                      <td className="px-4 py-2 text-brand-700">{fmt(row.principal)}</td>
                      <td className="px-4 py-2 text-red-600">{fmt(row.interest)}</td>
                      <td className="px-4 py-2">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
                {/* Totals footer */}
                <tfoot className="bg-gray-50 border-t-2 border-gray-300 text-xs font-semibold text-gray-700">
                  <tr>
                    <td className="px-4 py-2.5">Totals</td>
                    <td className="px-4 py-2.5">
                      {fmt(schedule.reduce((s, r) => s + r.payment, 0))}
                    </td>
                    <td className="px-4 py-2.5 text-brand-700">
                      {fmt(schedule.reduce((s, r) => s + r.principal, 0))}
                    </td>
                    <td className="px-4 py-2.5 text-red-600">
                      {fmt(schedule.reduce((s, r) => s + r.interest, 0))}
                    </td>
                    <td className="px-4 py-2.5">—</td>
                  </tr>
                </tfoot>
              </table>
            )}

            {/* ── YEARLY VIEW ── */}
            {view === 'yearly' && (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs sticky top-0">
                  <tr>
                    <th className="px-4 py-2.5">Year</th>
                    <th className="px-4 py-2.5">Total Payment</th>
                    <th className="px-4 py-2.5">Principal Paid</th>
                    <th className="px-4 py-2.5">Interest Paid</th>
                    <th className="px-4 py-2.5">Ending Balance</th>
                    <th className="px-4 py-2.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {yearGroups.map((grp) => (
                    <>
                      {/* Year summary row */}
                      <tr
                        key={`yr-${grp.year}`}
                        className="hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100"
                        onClick={() => toggleYear(grp.year)}
                      >
                        <td className="px-4 py-2.5 font-semibold text-gray-800">
                          Year {grp.year}
                        </td>
                        <td className="px-4 py-2.5">{fmt(grp.totalPayment)}</td>
                        <td className="px-4 py-2.5 text-brand-700">{fmt(grp.totalPrincipal)}</td>
                        <td className="px-4 py-2.5 text-red-600">{fmt(grp.totalInterest)}</td>
                        <td className="px-4 py-2.5">{fmt(grp.endingBalance)}</td>
                        <td className="px-4 py-2.5 text-gray-400 text-xs">
                          {expandedYears.has(grp.year) ? '▲' : '▼'} months
                        </td>
                      </tr>

                      {/* Expanded monthly breakdown for this year */}
                      {expandedYears.has(grp.year) &&
                        grp.months.map((row) => (
                          <tr
                            key={`m-${row.month}`}
                            className="bg-blue-50/60 border-b border-blue-100 text-xs"
                          >
                            <td className="px-4 py-1.5 pl-8 text-gray-500">Month {row.month}</td>
                            <td className="px-4 py-1.5">{fmt(row.payment)}</td>
                            <td className="px-4 py-1.5 text-brand-600">{fmt(row.principal)}</td>
                            <td className="px-4 py-1.5 text-red-500">{fmt(row.interest)}</td>
                            <td className="px-4 py-1.5">{fmt(row.balance)}</td>
                            <td />
                          </tr>
                        ))}
                    </>
                  ))}
                </tbody>
                {/* Totals footer */}
                <tfoot className="bg-gray-50 border-t-2 border-gray-300 text-xs font-semibold text-gray-700">
                  <tr>
                    <td className="px-4 py-2.5">Totals</td>
                    <td className="px-4 py-2.5">
                      {fmt(yearGroups.reduce((s, g) => s + g.totalPayment, 0))}
                    </td>
                    <td className="px-4 py-2.5 text-brand-700">
                      {fmt(yearGroups.reduce((s, g) => s + g.totalPrincipal, 0))}
                    </td>
                    <td className="px-4 py-2.5 text-red-600">
                      {fmt(yearGroups.reduce((s, g) => s + g.totalInterest, 0))}
                    </td>
                    <td className="px-4 py-2.5">—</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-2 text-xs text-gray-400">
            <span><span className="text-brand-600 font-semibold">Blue</span> = principal</span>
            <span><span className="text-red-500 font-semibold">Red</span> = interest</span>
            {view === 'yearly' && <span>Click a year row to expand monthly detail</span>}
          </div>
        </div>
      )}
    </div>
  )
}
