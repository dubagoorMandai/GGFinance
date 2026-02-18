/**
 * Calculate investment growth over time with inflation and tax adjustments.
 *
 * @param {number} initialAmount     - Lump sum invested at start
 * @param {number} monthlyContrib    - Recurring monthly contribution
 * @param {number} annualReturn      - Expected annual return % (e.g. 7)
 * @param {number} years             - Investment horizon in years
 * @param {number} inflationRate     - Annual inflation rate % (e.g. 3.2)
 * @param {number} taxRate           - Capital gains tax rate % (e.g. 15)
 * @returns {{ yearlyData, summary }}
 */
export function calcInvestment({
  initialAmount,
  monthlyContrib,
  annualReturn,
  years,
  inflationRate,
  taxRate,
}) {
  const monthlyRate = annualReturn / 100 / 12
  const monthlyInflation = inflationRate / 100 / 12

  const yearlyData = []
  let nominalBalance = initialAmount
  let totalContributions = initialAmount

  for (let year = 1; year <= years; year++) {
    for (let m = 0; m < 12; m++) {
      nominalBalance = nominalBalance * (1 + monthlyRate) + monthlyContrib
      totalContributions += monthlyContrib
    }

    const gains = nominalBalance - totalContributions
    const taxOnGains = gains > 0 ? gains * (taxRate / 100) : 0
    const afterTaxBalance = nominalBalance - taxOnGains

    // Real (inflation-adjusted) value
    const inflationFactor = Math.pow(1 + inflationRate / 100, year)
    const realBalance = afterTaxBalance / inflationFactor
    const nominalRealBalance = nominalBalance / inflationFactor

    yearlyData.push({
      year,
      nominal: Math.round(nominalBalance),
      afterTax: Math.round(afterTaxBalance),
      real: Math.round(realBalance),
      contributions: Math.round(totalContributions),
      gains: Math.round(Math.max(gains, 0)),
    })
  }

  const last = yearlyData[yearlyData.length - 1]
  const totalGains = last.nominal - last.contributions
  const taxPaid = totalGains > 0 ? totalGains * (taxRate / 100) : 0

  return {
    yearlyData,
    summary: {
      finalNominal: last.nominal,
      finalAfterTax: last.afterTax,
      finalReal: last.real,
      totalContributions: last.contributions,
      totalGains: Math.round(Math.max(totalGains, 0)),
      taxPaid: Math.round(taxPaid),
      effectiveReturn:
        ((last.afterTax / last.contributions - 1) * 100).toFixed(1),
    },
  }
}

export function fmt(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
}
