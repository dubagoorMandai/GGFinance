# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

A finance tools website offering three interactive calculators:

1. **Auto Loan Calculator** – Calculates monthly payments, total interest paid, and an amortization schedule. Includes a payoff early / extra payment feature.
2. **Mortgage Calculator** – Calculates monthly mortgage payments (principal + interest + optional PMI/taxes/insurance), amortization schedule, and payoff scenarios with extra payments.
3. **Investment Return Calculator** – Projects investment growth over time, factoring in:
   - Contributions (lump sum + recurring)
   - Annual rate of return
   - Inflation adjustment (real vs. nominal returns)
   - Tax rate on gains (e.g., capital gains tax)
   - Official country inflation rate fetched live from the **World Bank API**, with a manual override option for users who want to input their own rate.

Users can select their country of residence to auto-populate the official inflation rate, or manually enter a custom rate.

---

## Tech Stack

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Language:** JavaScript (JSX)
- **Inflation Data:** World Bank API (`https://api.worldbank.org/v2/country/{code}/indicator/FP.CPI.TOTL.ZG`)
- **Charts:** Recharts (for amortization and growth visualizations)
- **Routing:** React Router v6
- **State Management:** React hooks (useState, useContext) — no external state library

---

## Development Setup

```bash
npm install        # Install all dependencies
npm run dev        # Start Vite dev server (localhost:5173)
npm run build      # Production build to /dist
npm run preview    # Preview production build locally
```

Requires Node.js 18+. No environment variables needed — the World Bank API is public and requires no key.

---

## Common Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## Architecture & Key Decisions

- **Single Page App** with React Router handling `/`, `/mortgage`, `/auto-loan`, `/investment` routes.
- **Calculator logic** is isolated in pure JS utility functions under `src/utils/` (no side effects) so they are easy to test.
- **Inflation rate flow:**
  1. User selects country → app fetches latest rate from World Bank API.
  2. If fetch fails or user prefers manual, they can type their own rate.
  3. Rate is passed into investment return calculations to show both nominal and inflation-adjusted (real) returns.
- **Tax handling:** Tax rate is applied to gains only (not principal), approximating capital gains tax.
- **Charts:** Recharts line/area charts show year-by-year growth (investment) and month-by-month balance (loans/mortgage).
- **No backend** — all calculations run client-side.

---

## File Structure

```
src/
  components/
    layout/         # Header, Footer, Nav
    calculators/    # AutoLoan, Mortgage, Investment components
    shared/         # InputField, ResultCard, Chart wrappers
  pages/            # Route-level page components
  utils/
    autoLoan.js     # Amortization logic
    mortgage.js     # Mortgage calculation logic
    investment.js   # Compound growth, inflation, tax logic
    inflation.js    # World Bank API fetch helper
  hooks/
    useInflationRate.js  # Custom hook for fetching/caching inflation data
  App.jsx
  main.jsx
```

---

## Conventions & Style

- Functional components only — no class components.
- Tailwind for all styling — avoid inline styles and separate CSS files unless necessary.
- Descriptive variable names in calculator logic (e.g., `monthlyRate`, `remainingBalance`).
- All monetary outputs formatted with `Intl.NumberFormat` for locale-aware currency display.
- Keep calculator utility functions **pure** (input → output, no state).
- Country selector uses ISO 3166-1 alpha-2 codes to query the World Bank API.

---

## Notes for Claude

- Always keep calculator logic in `src/utils/` as pure functions, separate from React components.
- Use the World Bank API for inflation data; always provide a manual fallback input.
- Prefer Tailwind utility classes over custom CSS.
- Use Recharts for any data visualizations.
- Format all currency values using `Intl.NumberFormat` with the user's locale.
- When adding new calculators, follow the existing pattern: page component → calculator component → utility functions.
- Do not use any paid APIs or services — keep the project free to run.
- Run `npm run build` to verify no build errors before considering a feature complete.
