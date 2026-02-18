import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { calcRentVsBuy, fmt } from '../../utils/rentVsBuy'
import InputField from '../shared/InputField'
import ResultCard from '../shared/ResultCard'

const DEFAULT = {
  // Buy
  homePrice: 400000,
  downPayment: 80000,
  annualMortgageRate: 7.0,
  termYears: 30,
  annualTax: 4800,
  annualInsurance: 1200,
  pmiRate: 0.5,
  annualMaintenance: 1.0,
  maintenanceMode: 'percent', // 'percent' | 'dollar'
  annualAppreciation: 3.0,
  // Rent
  monthlyRent: 2000,
  annualRentIncrease: 3.0,
  // Shared
  horizon: 10,
  investmentReturn: 7.0,
}

export default function RentVsBuyCalculator() {
  const [form, setForm] = useState(DEFAULT)
  const [result, setResult] = useState(null)
  const [showTable, setShowTable] = useState(false)

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: parseFloat(val) || 0 }))
  const setRaw = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))

  const calculate = () => {
    if (form.homePrice <= form.downPayment) {
      alert('Down payment must be less than home price.')
      return
    }
    const res = calcRentVsBuy(form)
    setResult(res)
  }

  const recommendation = result?.summary.recommendation
  const breakEvenYear = result?.summary.breakEvenYear

  return (
    <div className="space-y-6">

      {/* Buy inputs */}
      <div className="calc-card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Buying Costs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Home Price" id="homePrice" prefix="$"
            value={form.homePrice} onChange={set('homePrice')} min={0} step={5000} />
          <InputField label="Down Payment" id="downPayment" prefix="$"
            value={form.downPayment} onChange={set('downPayment')} min={0} step={5000} />
          <InputField label="Mortgage Rate" id="mortgageRate" suffix="%"
            value={form.annualMortgageRate} onChange={set('annualMortgageRate')} min={0} max={20} step={0.125} />
          <InputField label="Loan Term" id="termYears" suffix="years"
            value={form.termYears} onChange={set('termYears')} min={5} max={30} step={5} />
          <InputField label="Annual Property Tax" id="annualTax" prefix="$"
            value={form.annualTax} onChange={set('annualTax')} min={0} step={100} />
          <InputField label="Annual Home Insurance" id="annualInsurance" prefix="$"
            value={form.annualInsurance} onChange={set('annualInsurance')} min={0} step={100} />
          <InputField label="Annual PMI Rate" id="pmiRate" suffix="%"
            value={form.pmiRate} onChange={set('pmiRate')} min={0} max={3} step={0.1}
            hint="Applied until equity reaches 20%" />
          {/* Maintenance — % or $ toggle */}
          <div>
            <label className="input-label">Annual Maintenance</label>
            {/* Toggle buttons sit above the input, full width of the cell */}
            <div className="flex rounded-lg border border-gray-300 overflow-hidden text-sm mb-2 w-fit">
              <button
                type="button"
                onClick={() => {
                  setRaw('maintenanceMode')('percent')
                  setForm((f) => ({ ...f, annualMaintenance: 1.0 }))
                }}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  form.maintenanceMode === 'percent'
                    ? 'bg-brand-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                % of value
              </button>
              <button
                type="button"
                onClick={() => {
                  setRaw('maintenanceMode')('dollar')
                  setForm((f) => ({ ...f, annualMaintenance: 4000 }))
                }}
                className={`px-3 py-1.5 font-medium transition-colors border-l border-gray-300 ${
                  form.maintenanceMode === 'dollar'
                    ? 'bg-brand-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                $ fixed
              </button>
            </div>
            <InputField
              label=""
              id="maintenance"
              prefix={form.maintenanceMode === 'dollar' ? '$' : undefined}
              suffix={form.maintenanceMode === 'percent' ? '%' : undefined}
              value={form.annualMaintenance}
              onChange={set('annualMaintenance')}
              min={0}
              max={form.maintenanceMode === 'percent' ? 10 : undefined}
              step={form.maintenanceMode === 'percent' ? 0.1 : 500}
              hint={form.maintenanceMode === 'percent' ? 'Typical: 1% of home value/yr' : 'Fixed annual maintenance cost'}
            />
          </div>
          <InputField label="Annual Home Appreciation" id="appreciation" suffix="%"
            value={form.annualAppreciation} onChange={set('annualAppreciation')} min={0} max={15} step={0.5}
            hint="Expected annual home value growth" />
        </div>
      </div>

      {/* Rent inputs */}
      <div className="calc-card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Renting Costs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Monthly Rent" id="monthlyRent" prefix="$"
            value={form.monthlyRent} onChange={set('monthlyRent')} min={0} step={50} />
          <InputField label="Annual Rent Increase" id="rentIncrease" suffix="%"
            value={form.annualRentIncrease} onChange={set('annualRentIncrease')} min={0} max={20} step={0.5}
            hint="Expected annual rent growth" />
        </div>
      </div>

      {/* Shared */}
      <div className="calc-card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Comparison Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Time Horizon" id="horizon" suffix="years"
            value={form.horizon} onChange={set('horizon')} min={1} max={40} step={1}
            hint="How many years to compare rent vs buy" />
          <InputField label="Investment Return (Opportunity Cost)" id="investReturn" suffix="%"
            value={form.investmentReturn} onChange={set('investmentReturn')} min={0} max={20} step={0.5}
            hint="What the down payment could earn if invested instead" />
        </div>
      </div>

      <button onClick={calculate} className="btn-primary w-full sm:w-auto">
        Compare Rent vs Buy
      </button>

      {/* Results */}
      {result && (
        <>
          {/* Verdict banner */}
          <div className={`p-5 rounded-2xl border-2 text-center ${
            recommendation === 'buy'
              ? 'bg-emerald-50 border-emerald-400'
              : 'bg-blue-50 border-blue-400'
          }`}>
            <p className="text-2xl font-bold mb-1">
              {recommendation === 'buy' ? '🏠 Buying looks better' : '🏢 Renting looks better'}
              {' '}over {form.horizon} years
            </p>
            <p className="text-sm text-gray-600">
              {recommendation === 'buy'
                ? `Buying puts you ${fmt(Math.abs(result.summary.buyAdvantage))} ahead after ${form.horizon} years.`
                : `Renting puts you ${fmt(Math.abs(result.summary.buyAdvantage))} ahead after ${form.horizon} years.`}
              {breakEvenYear
                ? ` Buying breaks even at year ${breakEvenYear}.`
                : ' Buying does not break even within the horizon.'}
            </p>
          </div>

          {/* Key metrics */}
          <div className="calc-card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">After {form.horizon} Years</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <ResultCard accent label="Total Buy Cost"      value={fmt(result.summary.totalBuyCost)} />
              <ResultCard accent label="Total Rent Cost"     value={fmt(result.summary.totalRentCost)} />
              <ResultCard label="Final Home Value"           value={fmt(result.summary.finalHomeValue)} />
              <ResultCard label="Home Equity"                value={fmt(result.summary.finalEquity)} />
              <ResultCard label="Investment Value (if rented)" value={fmt(result.summary.opportunityValue)} />
              <ResultCard label="Break-even Year"
                value={breakEvenYear ? `Year ${breakEvenYear}` : 'Never'}
                sub="First year buying is ahead" />
            </div>
          </div>

          {/* Chart */}
          <div className="calc-card">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Cumulative Cost Comparison</h2>
            <p className="text-xs text-gray-400 mb-4">
              Buy cost includes all housing expenses. Rent cost includes rent payments. Investment value shows what the down payment grows to if invested instead.
            </p>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={result.yearlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottomRight', offset: -5 }} tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => fmt(v)} />
                <Legend />
                {breakEvenYear && (
                  <ReferenceLine x={breakEvenYear} stroke="#10b981" strokeDasharray="4 2"
                    label={{ value: 'Break-even', position: 'top', fontSize: 11, fill: '#10b981' }} />
                )}
                <Line type="monotone" dataKey="cumulativeBuyCost" name="Total Buy Cost"
                  stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="cumulativeRentCost" name="Total Rent Cost"
                  stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="homeValue" name="Home Value"
                  stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 4" />
                <Line type="monotone" dataKey="opportunityValue" name="Investment Value (if renting)"
                  stroke="#8b5cf6" strokeWidth={2} dot={false} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Year by year table */}
          <div className="calc-card">
            <button
              onClick={() => setShowTable((s) => !s)}
              className="text-sm text-brand-600 hover:underline font-medium"
            >
              {showTable ? '▲ Hide' : '▼ Show'} year-by-year breakdown
            </button>
            {showTable && <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-2">Year</th>
                    <th className="px-4 py-2">Cum. Buy Cost</th>
                    <th className="px-4 py-2">Cum. Rent Cost</th>
                    <th className="px-4 py-2">Home Value</th>
                    <th className="px-4 py-2">Equity</th>
                    <th className="px-4 py-2">Investment Value</th>
                    <th className="px-4 py-2">Buy Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.yearlyData.map((row) => (
                    <tr key={row.year} className={`hover:bg-gray-50 ${row.year === breakEvenYear ? 'bg-emerald-50 font-semibold' : ''}`}>
                      <td className="px-4 py-2">{row.year}{row.year === breakEvenYear ? ' *' : ''}</td>
                      <td className="px-4 py-2">{fmt(row.cumulativeBuyCost)}</td>
                      <td className="px-4 py-2">{fmt(row.cumulativeRentCost)}</td>
                      <td className="px-4 py-2">{fmt(row.homeValue)}</td>
                      <td className="px-4 py-2">{fmt(row.equity)}</td>
                      <td className="px-4 py-2">{fmt(row.opportunityValue)}</td>
                      <td className={`px-4 py-2 ${row.buyAdvantage >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {row.buyAdvantage >= 0 ? '+' : ''}{fmt(row.buyAdvantage)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-400 p-3">* Break-even year</p>
            </div>}
          </div>

          <div className="p-3 bg-gray-100 rounded-xl text-xs text-gray-500">
            This is an estimate. Results depend heavily on assumptions like home appreciation,
            rent increases, and investment returns. Consult a financial advisor for personalised advice.
          </div>
        </>
      )}
    </div>
  )
}
