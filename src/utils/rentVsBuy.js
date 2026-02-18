/**
 * Rent vs Buy estimator.
 *
 * Compares the true cost of buying a home vs renting over a given horizon,
 * accounting for: mortgage P&I, PMI, taxes, insurance, maintenance,
 * opportunity cost of down payment, home appreciation, and rent increases.
 *
 * @param {object} params
 * @returns {{ yearlyData, summary }}
 */
export function calcRentVsBuy({
  // Buy inputs
  homePrice,
  downPayment,
  annualMortgageRate,   // e.g. 7.0
  termYears,            // e.g. 30
  annualTax,            // annual property tax $
  annualInsurance,      // annual homeowners insurance $
  pmiRate,              // annual PMI % (e.g. 0.5), applied until 20% equity
  annualMaintenance,    // annual maintenance — either % of home value OR fixed $ amount
  maintenanceMode = 'percent', // 'percent' | 'dollar'
  annualAppreciation,   // expected home value appreciation % (e.g. 3)
  // Rent inputs
  monthlyRent,
  annualRentIncrease,   // % per year (e.g. 3)
  // Shared
  horizon,              // years to compare (e.g. 10)
  investmentReturn,     // opportunity cost: what down payment could earn % (e.g. 7)
}) {
  const principal = homePrice - downPayment
  const monthlyRate = annualMortgageRate / 100 / 12
  const termMonths = termYears * 12

  const piPayment =
    monthlyRate === 0
      ? principal / termMonths
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1)

  const yearlyData = []

  // Buying state
  let balance = principal
  let cumulativeBuyCost = downPayment  // include down payment as upfront cost
  let homeValue = homePrice

  // Renting state
  let currentRent = monthlyRent
  let cumulativeRentCost = 0

  // Opportunity cost: down payment invested instead
  let opportunityValue = downPayment

  for (let year = 1; year <= horizon; year++) {
    // ── BUY: calculate this year's costs ──
    let yearlyPI = 0
    let yearlyInterest = 0
    let yearlyPMI = 0

    for (let m = 0; m < 12; m++) {
      const interest = balance * monthlyRate
      const princ = Math.min(piPayment - interest, balance)
      balance = Math.max(balance - princ, 0)
      yearlyPI += piPayment
      yearlyInterest += interest

      const equity = homeValue - balance
      const equityPct = equity / homeValue
      if (equityPct < 0.2 && pmiRate > 0) {
        yearlyPMI += (principal * (pmiRate / 100)) / 12
      }
    }

    homeValue *= 1 + annualAppreciation / 100
    const yearlyMaintenance =
      maintenanceMode === 'dollar'
        ? annualMaintenance
        : homeValue * (annualMaintenance / 100)
    const yearlyTax = annualTax
    const yearlyInsurance = annualInsurance

    const buyThisYear = yearlyPI + yearlyPMI + yearlyMaintenance + yearlyTax + yearlyInsurance
    cumulativeBuyCost += buyThisYear

    // Net equity (home value minus remaining loan)
    const equity = homeValue - balance

    // ── RENT: calculate this year's costs ──
    const rentThisYear = currentRent * 12
    cumulativeRentCost += rentThisYear
    currentRent *= 1 + annualRentIncrease / 100

    // Opportunity cost: down payment + what you save vs buying grows at investmentReturn
    const buyVsRentSavings = buyThisYear - rentThisYear
    opportunityValue = opportunityValue * (1 + investmentReturn / 100) +
      (buyVsRentSavings > 0 ? buyVsRentSavings : 0)

    // Net position for each path
    // Buy net worth contribution: equity - cumulative costs (relative to renting)
    const buyNetPosition = equity - cumulativeBuyCost
    const rentNetPosition = opportunityValue - cumulativeRentCost

    yearlyData.push({
      year,
      cumulativeBuyCost: Math.round(cumulativeBuyCost),
      cumulativeRentCost: Math.round(cumulativeRentCost),
      homeValue: Math.round(homeValue),
      equity: Math.round(equity),
      buyNetPosition: Math.round(buyNetPosition),
      rentNetPosition: Math.round(rentNetPosition),
      opportunityValue: Math.round(opportunityValue),
      // positive = buying ahead, negative = renting ahead
      buyAdvantage: Math.round(buyNetPosition - rentNetPosition),
    })
  }

  const last = yearlyData[yearlyData.length - 1]

  // Break-even year: first year buying is ahead
  const breakEvenYear = yearlyData.find((d) => d.buyAdvantage >= 0)?.year ?? null

  return {
    yearlyData,
    summary: {
      totalBuyCost: last.cumulativeBuyCost,
      totalRentCost: last.cumulativeRentCost,
      finalHomeValue: last.homeValue,
      finalEquity: last.equity,
      opportunityValue: last.opportunityValue,
      buyNetPosition: last.buyNetPosition,
      rentNetPosition: last.rentNetPosition,
      buyAdvantage: last.buyAdvantage,
      breakEvenYear,
      recommendation: last.buyAdvantage >= 0 ? 'buy' : 'rent',
    },
  }
}

export function fmt(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency, maximumFractionDigits: 0,
  }).format(value)
}
