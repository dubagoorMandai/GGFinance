import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/',           label: 'Home' },
  { to: '/auto-loan',  label: 'Auto Loan' },
  { to: '/mortgage',   label: 'Mortgage' },
  { to: '/investment', label: 'Investment' },
]

export default function Header() {
  return (
    <header className="bg-brand-900 text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <span className="text-2xl">💰</span>
          <span>GG Finance</span>
        </NavLink>
        <nav className="flex gap-1">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
