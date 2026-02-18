import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { calcInvestment, fmt } from '../../utils/investment'
import { COUNTRIES } from '../../utils/inflation'
import { useInflationRate } from '../../hooks/useInflationRate'
import InputField from '../shared/InputField'
import ResultCard from '../shared/ResultCard'

const DEFAULT = {
  initialAmount: 10000,
  monthlyContrib: 500,
  annualReturn: 7,
  years: 20,
  taxRate: 15,
}

export default function InvestmentCalculator() {
  const [form, setForm] = useState(DEFAULT)
  const [result, setResult] = useState(null)
  const [inflationMode, setInflationMode] = useState('official') // 'official' | 'manual'
  const [manualInflation, setManualInflation] = useState(3.0)
  const [selectedCountry, setSelectedCountry] = useState('US')

  const { rate: apiRate, loading, error, source, fetchRate } = useInflationRate()

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: parseFloat(val) || 0 }))

  const effectiveInflation =
    inflationMode === 'manual' ? manualInflation : (apiRate ?? manualInflation)

  const handleCountryChange = (code) => {
    setSelectedCountry(code)
    fetchRate(code)
  }

  const calculate = () => {
    const res = calcInvestment({
      ...form,
      inflationRate: effectiveInflation,
    })
    setResult(res)
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="calc-card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Investment Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Initial Investment" id="initial" prefix="$"
            value={form.initialAmount} onChange={set('initialAmount')} min={0} step={500} />
          <InputField label="Monthly Contribution" id="monthly" prefix="$"
            value={form.monthlyContrib} onChange={set('monthlyContrib')} min={0} step={50} />
          <InputField label="Expected Annual Return" id="return" suffix="%"
            value={form.annualReturn} onChange={set('annualReturn')} min={0} max={30} step={0.5}
            hint="Historical S&P 500 avg ≈ 7% (inflation-adjusted)" />
          <InputField label="Investment Period" id="years" suffix="years"
            value={form.years} onChange={set('years')} min={1} max={50} step={1} />
          <InputField label="Capital Gains Tax Rate" id="tax" suffix="%"
            value={form.taxRate} onChange={set('taxRate')} min={0} max={50} step={1}
            hint="Applied to gains only, not principal" />
        </div>
      </div>

      {/* Inflation Section */}
      <div className="calc-card">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Inflation Rate</h2>
        <p className="text-sm text-gray-500 mb-4">
          Used to calculate the real (purchasing-power-adjusted) value of your investment.
        </p>

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setInflationMode('official')}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              inflationMode === 'official'
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-brand-400'
            }`}
          >
            🌐 Official Rate (World Bank)
          </button>
          <button
            onClick={() => setInflationMode('manual')}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              inflationMode === 'manual'
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-brand-400'
            }`}
          >
            ✏️ Enter Manually
          </button>
        </div>

        {inflationMode === 'official' ? (
          <div className="space-y-3">
            <div>
              <label className="input-label">Country of Residence</label>
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="input-field"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {loading && (
              <p className="text-sm text-brand-600 animate-pulse">Fetching official rate…</p>
            )}
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            {apiRate !== null && !loading && (
              <div className="flex items-center gap-2 p-3 bg-brand-50 border border-brand-100 rounded-lg">
                <span className="text-brand-700 font-bold text-lg">{apiRate}%</span>
                <span className="text-sm text-gray-500">
                  Official CPI inflation rate for{' '}
                  {COUNTRIES.find((c) => c.code === selectedCountry)?.name} (World Bank)
                </span>
              </div>
            )}
            {apiRate === null && !loading && !error && (
              <button onClick={() => fetchRate(selectedCountry)} className="btn-primary text-sm py-1.5 px-4">
                Fetch Rate
              </button>
            )}
          </div>
        ) : (
          <InputField
            label="Custom Inflation Rate"
            id="manualInflation"
            suffix="%"
            value={manualInflation}
            onChange={(v) => setManualInflation(parseFloat(v) || 0)}
            min={0}
            max={50}
            step={0.1}
            hint="Enter your expected or custom annual inflation rate"
          />
        )}

        <p className="mt-3 text-xs text-gray-400">
          Rate used in calculation:{' '}
          <strong className="text-gray-600">{effectiveInflation}%</strong>{' '}
          {source === 'api' ? '(World Bank official)' : '(manual)'}
        </p>
      </div>

      <button onClick={calculate} className="btn-primary w-full sm:w-auto">
        Calculate Returns
      </button>

      {/* Results */}
      {result && (
        <>
          <div className="calc-card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Summary after {form.years} Years</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <ResultCard accent label="Final Value (Nominal)" value={fmt(result.summary.finalNominal)} />
              <ResultCard label="After Tax" value={fmt(result.summary.finalAfterTax)} />
              <ResultCard label="Real Value (Inflation-Adj.)" value={fmt(result.summary.finalReal)} />
              <ResultCard label="Total Contributed" value={fmt(result.summary.totalContributions)} />
              <ResultCard label="Total Gains" value={fmt(result.summary.totalGains)} />
              <ResultCard label="Tax Paid on Gains" value={fmt(result.summary.taxPaid)} />
            </div>

            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600">
              <strong>Effective total return:</strong> {result.summary.effectiveReturn}% &nbsp;|&nbsp;
              <strong>Inflation rate used:</strong> {effectiveInflation}% &nbsp;|&nbsp;
              <strong>Tax rate:</strong> {form.taxRate}%
            </div>
          </div>

          {/* Growth Chart */}
          <div className="calc-card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Growth Over Time</h2>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={result.yearlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottomRight', offset: -5 }}
                  tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => fmt(v)} />
                <Legend />
                <Line type="monotone" dataKey="nominal" name="Nominal Value"
                  stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="afterTax" name="After-Tax Value"
                  stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="real" name="Real Value (Inflation-Adj.)"
                  stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="5 4" />
                <Line type="monotone" dataKey="contributions" name="Total Contributed"
                  stroke="#94a3b8" strokeWidth={1.5} dot={false} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Year-by-year table */}
          <div className="calc-card">
            <button
              onClick={() => document.getElementById('inv-table').classList.toggle('hidden')}
              className="text-sm text-brand-600 hover:underline font-medium"
            >
              ▼ Show year-by-year breakdown
            </button>
            <div id="inv-table" className="hidden mt-3 overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-2">Year</th>
                    <th className="px-4 py-2">Contributed</th>
                    <th className="px-4 py-2">Nominal Value</th>
                    <th className="px-4 py-2">After Tax</th>
                    <th className="px-4 py-2">Real Value</th>
                    <th className="px-4 py-2">Gains</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.yearlyData.map((row) => (
                    <tr key={row.year} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{row.year}</td>
                      <td className="px-4 py-2">{fmt(row.contributions)}</td>
                      <td className="px-4 py-2">{fmt(row.nominal)}</td>
                      <td className="px-4 py-2">{fmt(row.afterTax)}</td>
                      <td className="px-4 py-2">{fmt(row.real)}</td>
                      <td className="px-4 py-2 text-green-700">{fmt(row.gains)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
