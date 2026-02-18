import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { calcMortgage, fmt } from '../../utils/mortgage'
import InputField from '../shared/InputField'
import ResultCard from '../shared/ResultCard'
import AmortizationTable from '../shared/AmortizationTable'

const DEFAULT = {
  homePrice: 400000,
  downPayment: 80000,
  annualRate: 7.0,
  termYears: 30,
  annualTax: 4800,
  annualInsurance: 1200,
  extraPayment: 0,
}

const PIE_COLORS = ['#2563eb', '#60a5fa', '#f59e0b', '#10b981']

export default function MortgageCalculator() {
  const [form, setForm] = useState(DEFAULT)
  const [result, setResult] = useState(null)

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: parseFloat(val) || 0 }))

  const calculate = () => {
    const principal = form.homePrice - form.downPayment
    if (principal <= 0) { alert('Loan amount must be greater than 0.'); return }
    const res = calcMortgage({ ...form })
    setResult(res)
  }

  const pieData = result
    ? [
        { name: 'Principal & Interest', value: Math.round(result.piPayment) },
        { name: 'Property Tax', value: Math.round(result.monthlyTax) },
        { name: 'Insurance', value: Math.round(result.monthlyInsurance) },
        { name: 'PMI', value: Math.round(result.monthlyPMI) },
      ].filter((d) => d.value > 0)
    : []

  const chartData = result
    ? Object.values(
        result.schedule.reduce((acc, row) => {
          const yr = Math.ceil(row.month / 12)
          if (!acc[yr]) acc[yr] = { year: `Yr ${yr}`, balance: 0, interest: 0, principal: 0 }
          acc[yr].balance = Math.round(row.balance)
          acc[yr].interest += row.interest
          acc[yr].principal += row.principal
          return acc
        }, {})
      )
    : []

  const ltv = result ? ((form.homePrice - form.downPayment) / form.homePrice * 100).toFixed(1) : null

  return (
    <div className="space-y-6">
      <div className="calc-card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Mortgage Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Home Price" id="homePrice" prefix="$"
            value={form.homePrice} onChange={set('homePrice')} min={0} step={1000} />
          <InputField label="Down Payment" id="downPayment" prefix="$"
            value={form.downPayment} onChange={set('downPayment')} min={0} step={1000} />
          <InputField label="Annual Interest Rate" id="annualRate" suffix="%"
            value={form.annualRate} onChange={set('annualRate')} min={0} max={20} step={0.125} />
          <InputField label="Loan Term" id="termYears" suffix="years"
            value={form.termYears} onChange={set('termYears')} min={5} max={30} step={5} />
          <InputField label="Annual Property Tax" id="annualTax" prefix="$"
            value={form.annualTax} onChange={set('annualTax')} min={0} step={100} />
          <InputField label="Annual Home Insurance" id="annualInsurance" prefix="$"
            value={form.annualInsurance} onChange={set('annualInsurance')} min={0} step={100} />
          <InputField label="Extra Monthly Payment" id="extraPayment" prefix="$"
            value={form.extraPayment} onChange={set('extraPayment')} min={0} step={100}
            hint="Additional payment toward principal each month" />
        </div>
        <button onClick={calculate} className="btn-primary mt-5 w-full sm:w-auto">
          Calculate
        </button>
      </div>

      {result && (
        <>
          {/* PMI notice */}
          {result.monthlyPMI > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              ⚠️ Your down payment is less than 20% (LTV: {ltv}%). PMI of{' '}
              <strong>{fmt(result.monthlyPMI)}/mo</strong> applies until your equity reaches 20%.
            </div>
          )}

          <div className="calc-card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Payment Breakdown</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <ResultCard accent label="Total Monthly" value={fmt(result.totalMonthly)} />
              <ResultCard label="Principal & Interest" value={fmt(result.piPayment)} />
              <ResultCard label="Total Interest" value={fmt(result.totalInterest)} />
              <ResultCard label="Payoff" value={`${Math.ceil(result.payoffMonth / 12)} yrs`} />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ResponsiveContainer width={220} height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                    dataKey="value" nameKey="name">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(v)} />
                </PieChart>
              </ResponsiveContainer>
              <ul className="space-y-2 text-sm">
                {pieData.map((d, i) => (
                  <li key={d.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block"
                      style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-gray-600">{d.name}:</span>
                    <strong>{fmt(d.value)}/mo</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {form.extraPayment > 0 && (
            <div className="calc-card bg-green-50 border-green-200">
              <p className="text-green-800 text-sm">
                🎉 With your extra <strong>{fmt(form.extraPayment)}/mo</strong>, you'll pay off in{' '}
                <strong>{Math.ceil(result.payoffMonth / 12)} years</strong> instead of{' '}
                <strong>{form.termYears}</strong> and save{' '}
                <strong>
                  {fmt(
                    calcMortgage({ ...form, extraPayment: 0 }).totalInterest -
                      result.totalInterest
                  )}
                </strong>{' '}
                in interest.
              </p>
            </div>
          )}

          <div className="calc-card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Balance Over Time</h2>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => fmt(v)} />
                <Legend />
                <Area type="monotone" dataKey="balance" name="Remaining Balance"
                  stroke="#2563eb" fill="#dbeafe" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="calc-card">
            <AmortizationTable schedule={result.schedule} />
          </div>
        </>
      )}
    </div>
  )
}
