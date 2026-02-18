import MortgageCalculator from '../components/calculators/MortgageCalculator'

export default function MortgagePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">🏠 Mortgage Calculator</h1>
        <p className="text-gray-500 mt-1">
          Calculate your monthly mortgage payment including principal, interest, property tax,
          insurance, and PMI. See how extra payments can save you thousands in interest.
        </p>
      </div>
      <MortgageCalculator />
    </div>
  )
}
