/**
 * Calculate mortgage amortization.
 * @param {number} homePrice
 * @param {number} downPayment
 * @param {number} annualRate        - e.g. 6.5
 * @param {number} termYears         - e.g. 30
 * @param {number} annualTax         - annual property tax dollars
 * @param {number} annualInsurance   - annual homeowners insurance dollars
 * @param {number} extraPayment      - extra monthly principal payment
 * @param {number|null} customPMIRate - user-supplied annual PMI rate % (e.g. 0.8). 
 *                                     If null, auto-calculated at 0.5% when LTV > 80%.
 * @returns mortgage details + schedule
 */
export function calcMortgage({
  homePrice,
  downPayment,
  annualRate,
  termYears,
  annualTax = 0,
  annualInsurance = 0,
  extraPayment = 0,
  customPMIRate = null,
}) {
  const principal = homePrice - downPayment
  const termMonths = termYears * 12
  const monthlyRate = annualRate / 100 / 12

  const piPayment =
    monthlyRate === 0
      ? principal / termMonths
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1)

  const monthlyTax = annualTax / 12
  const monthlyInsurance = annualInsurance / 12

  // PMI: use user-supplied rate if provided, otherwise auto 0.5% when LTV > 80%
  const ltv = downPayment / homePrice
  const pmiRate = customPMIRate !== null ? customPMIRate : (ltv < 0.2 ? 0.5 : 0)
  const monthlyPMI = pmiRate > 0 ? (principal * (pmiRate / 100)) / 12 : 0
  const pmiAutoMode = customPMIRate === null

  const totalMonthly = piPayment + monthlyTax + monthlyInsurance + monthlyPMI

  const schedule = []
  let balance = principal
  let totalInterest = 0
  let month = 0
  let pmiDropMonth = null

  while (balance > 0 && month < termMonths * 2) {
    month++
    const interestCharge = balance * monthlyRate
    let principalCharge = piPayment - interestCharge + extraPayment
    if (principalCharge > balance) principalCharge = balance

    totalInterest += interestCharge
    balance -= principalCharge

    // PMI drops once equity >= 20% (LTV <= 80%)
    const currentEquityPct = 1 - (balance / homePrice)
    const pmiActive = pmiRate > 0 && currentEquityPct < 0.2
    if (pmiRate > 0 && !pmiActive && pmiDropMonth === null) pmiDropMonth = month

    schedule.push({
      month,
      payment: principalCharge + interestCharge,
      principal: principalCharge,
      interest: interestCharge,
      balance: Math.max(balance, 0),
      pmi: pmiActive ? monthlyPMI : 0,
    })

    if (balance <= 0.01) break
  }

  return {
    principal,
    piPayment,
    monthlyTax,
    monthlyInsurance,
    monthlyPMI,
    pmiRate,
    pmiAutoMode,
    pmiDropMonth,
    totalMonthly,
    totalInterest,
    totalPaid: principal + totalInterest,
    payoffMonth: month,
    schedule,
  }
}

export function fmt(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)
}
