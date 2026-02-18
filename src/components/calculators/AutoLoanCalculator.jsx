import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { calcAutoLoan, fmt } from '../../utils/autoLoan'
import InputField from '../shared/InputField'
import ResultCard from '../shared/ResultCard'
import AmortizationTable from '../shared/AmortizationTable'

const DEFAULT = {
  vehiclePrice: 35000,
  downPayment: 5000,
  tradeIn: 0,
  annualRate: 6.5,
  termMonths: 60,
  extraPayment: 0,
}

export default function AutoLoanCalculator() {
  const [form, setForm] = useState(DEFAULT)
  const [result, setResult] = useState(null)

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: parseFloat(val) || 0 }))

  const calculate = () => {
    const principal = form.vehiclePrice - form.downPayment - form.tradeIn
    if (principal <= 0) { alert('Loan amount must be greater than 0.'); return }
    const res = calcAutoLoan({
      principal,
      annualRate: form.annualRate,
      termMonths: form.termMonths,
      extraPayment: form.extraPayment,
    })
    setResult({ ...res, principal })
  }

  // Chart data: summarise by year
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

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="calc-card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Loan Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Vehicle Price" id="vehiclePrice" prefix="$"
            value={form.vehiclePrice} onChange={set('vehiclePrice')} min={0} step={100} />
          <InputField label="Down Payment" id="downPayment" prefix="$"
            value={form.downPayment} onChange={set('downPayment')} min={0} step={100} />
          <InputField label="Trade-In Value" id="tradeIn" prefix="$"
            value={form.tradeIn} onChange={set('tradeIn')} min={0} step={100} />
          <InputField label="Annual Interest Rate" id="annualRate" suffix="%"
            value={form.annualRate} onChange={set('annualRate')} min={0} max={30} step={0.1} />
          <InputField label="Loan Term" id="termMonths" suffix="months"
            value={form.termMonths} onChange={set('termMonths')} min={12} max={84} step={12} />
          <InputField label="Extra Monthly Payment" id="extraPayment" prefix="$"
            value={form.extraPayment} onChange={set('extraPayment')} min={0} step={50}
            hint="Additional payment toward principal each month" />
        </div>
        <button onClick={calculate} className="btn-primary mt-5 w-full sm:w-auto">
          Calculate
        </button>
      </div>

      {/* Results */}
      {result && (
        <>
          <div className="calc-card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Results</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ResultCard accent label="Monthly Payment" value={fmt(result.monthlyPayment)} />
              <ResultCard label="Loan Amount" value={fmt(result.principal)} />
              <ResultCard label="Total Interest" value={fmt(result.totalInterest)} />
              <ResultCard label="Total Cost" value={fmt(result.totalPaid)} />
            </div>

            {form.extraPayment > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
                🎉 With your extra <strong>{fmt(form.extraPayment)}/mo</strong> payment, you'll
                pay off the loan in <strong>{result.payoffMonth} months</strong> instead of{' '}
                <strong>{form.termMonths}</strong>, saving{' '}
                <strong>
                  {fmt(
                    calcAutoLoan({
                      principal: result.principal,
                      annualRate: form.annualRate,
                      termMonths: form.termMonths,
                    }).totalInterest - result.totalInterest
                  )}
                </strong>{' '}
                in interest.
              </div>
            )}
          </div>

          {/* Chart */}
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
