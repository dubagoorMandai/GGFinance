import AutoLoanCalculator from '../components/calculators/AutoLoanCalculator'

export default function AutoLoanPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">🚗 Auto Loan Calculator</h1>
        <p className="text-gray-500 mt-1">
          Enter your loan details to see your monthly payment, total interest, and full
          amortization schedule. Add an extra monthly payment to see how much sooner you'll
          pay off the loan.
        </p>
      </div>
      <AutoLoanCalculator />
    </div>
  )
}
