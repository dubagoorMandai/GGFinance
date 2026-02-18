export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 text-center text-sm py-5 mt-8">
      <p>
        FinanceCalc &mdash; For informational purposes only. Not financial advice.
      </p>
      <p className="mt-1">
        Inflation data sourced from the{' '}
        <a
          href="https://data.worldbank.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          World Bank
        </a>
        .
      </p>
    </footer>
  )
}
