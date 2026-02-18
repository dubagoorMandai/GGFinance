/**
 * Calculate auto loan amortization schedule.
 * @param {number} principal  - Loan amount after down payment
 * @param {number} annualRate - Annual interest rate (e.g. 5.5 for 5.5%)
 * @param {number} termMonths - Loan term in months
 * @param {number} extraPayment - Extra monthly payment toward principal
 * @returns {{ monthlyPayment, totalInterest, totalPaid, schedule, payoffMonth }}
 */
export function calcAutoLoan({ principal, annualRate, termMonths, extraPayment = 0 }) {
  const monthlyRate = annualRate / 100 / 12

  // Standard monthly payment (ignoring extra)
  const monthlyPayment =
    monthlyRate === 0
      ? principal / termMonths
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1)

  const schedule = []
  let balance = principal
  let totalInterest = 0
  let month = 0

  while (balance > 0 && month < termMonths * 2) {
    month++
    const interestCharge = balance * monthlyRate
    let principalCharge = monthlyPayment - interestCharge + extraPayment
    if (principalCharge > balance) principalCharge = balance

    totalInterest += interestCharge
    balance -= principalCharge

    schedule.push({
      month,
      payment: principalCharge + interestCharge,
      principal: principalCharge,
      interest: interestCharge,
      balance: Math.max(balance, 0),
    })

    if (balance <= 0.01) break
  }

  return {
    monthlyPayment: monthlyPayment + extraPayment,
    baseMonthlyPayment: monthlyPayment,
    totalInterest,
    totalPaid: principal + totalInterest,
    payoffMonth: month,
    schedule,
  }
}

export function fmt(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)
}
