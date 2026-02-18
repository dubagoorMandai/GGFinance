/**
 * Displays a labeled value in a highlight card.
 */
export default function ResultCard({ label, value, sub, accent = false }) {
  return (
    <div className={`result-pill ${accent ? 'bg-brand-600 border-brand-600 text-white' : ''}`}>
      <p className={`text-xs font-medium mb-1 ${accent ? 'text-blue-100' : 'text-gray-500'}`}>
        {label}
      </p>
      <p className={`text-xl font-bold ${accent ? 'text-white' : 'text-brand-700'}`}>{value}</p>
      {sub && (
        <p className={`text-xs mt-0.5 ${accent ? 'text-blue-200' : 'text-gray-400'}`}>{sub}</p>
      )}
    </div>
  )
}
