import InvestmentCalculator from '../components/calculators/InvestmentCalculator'

export default function InvestmentPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">📈 Investment Return Calculator</h1>
        <p className="text-gray-500 mt-1">
          Project your investment growth with real-world factors: inflation adjustment and
          capital gains tax. Choose your country to automatically load the official inflation
          rate from the World Bank, or enter your own.
        </p>
      </div>
      <InvestmentCalculator />
    </div>
  )
}
