/**
 * Calculate mortgage amortization.
 * @param {number} homePrice
 * @param {number} downPayment
 * @param {number} annualRate      - e.g. 6.5
 * @param {number} termYears       - e.g. 30
 * @param {number} annualTax       - annual property tax dollars
 * @param {number} annualInsurance - annual homeowners insurance dollars
 * @param {number} extraPayment    - extra monthly principal payment
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

  // PMI: ~0.5% of loan per year if down payment < 20%
  const ltv = downPayment / homePrice
  const monthlyPMI = ltv < 0.2 ? (principal * 0.005) / 12 : 0

  const totalMonthly = piPayment + monthlyTax + monthlyInsurance + monthlyPMI

  const schedule = []
  let balance = principal
  let totalInterest = 0
  let month = 0

  while (balance > 0 && month < termMonths * 2) {
    month++
    const interestCharge = balance * monthlyRate
    let principalCharge = piPayment - interestCharge + extraPayment
    if (principalCharge > balance) principalCharge = balance

    totalInterest += interestCharge
    balance -= principalCharge

    // Remove PMI once equity >= 20%
    const currentLTV = balance / homePrice
    const pmi = currentLTV >= 0.8 ? monthlyPMI : 0

    schedule.push({
      month,
      payment: principalCharge + interestCharge,
      principal: principalCharge,
      interest: interestCharge,
      balance: Math.max(balance, 0),
      pmi,
    })

    if (balance <= 0.01) break
  }

  return {
    principal,
    piPayment,
    monthlyTax,
    monthlyInsurance,
    monthlyPMI,
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
