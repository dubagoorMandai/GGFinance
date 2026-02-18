import RentVsBuyCalculator from '../components/calculators/RentVsBuyCalculator'

export default function RentVsBuyPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">🏠 vs 🏢 Rent vs Buy Estimator</h1>
        <p className="text-gray-500 mt-1">
          Should you buy a home or keep renting? This tool compares the true long-term cost of
          each path — factoring in mortgage payments, taxes, insurance, PMI, maintenance, home
          appreciation, rent increases, and the opportunity cost of your down payment.
        </p>
      </div>
      <RentVsBuyCalculator />
    </div>
  )
}
