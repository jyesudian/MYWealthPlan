'use client'

import Card from './Card'
import ProgressBar from './ProgressBar'

export default function Dashboard({ profile, assets, liabilities, setActiveTab }) {
  // Safe helper to format Ringgit Malaysia (RM) values
  const formatRM = (val) => {
    const num = Number(val) || 0
    return `RM ${num.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  }

  // Calculate Asset Categories
  const totalAssets = assets.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  const totalLiabilities = liabilities.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  const calculatedNetWorth = totalAssets - totalLiabilities

  // Calculate categories for assets bar chart
  const epfAssets = assets
    .filter(a => a.category?.toUpperCase() === 'EPF')
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  const propertyAssets = assets
    .filter(a => a.category?.toUpperCase() === 'PROPERTY')
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  const cashAssets = assets
    .filter(a => a.category?.toUpperCase() === 'CASH')
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  const investmentAssets = assets
    .filter(a => a.category?.toUpperCase() === 'INVESTMENTS')
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)

  // Calculate percentages (avoid division by zero)
  const epfPct = totalAssets ? Math.round((epfAssets / totalAssets) * 100) : 0
  const propertyPct = totalAssets ? Math.round((propertyAssets / totalAssets) * 100) : 0
  const cashPct = totalAssets ? Math.round((cashAssets / totalAssets) * 100) : 0
  const investPct = totalAssets ? Math.round((investmentAssets / totalAssets) * 100) : 0

  // Calculate Credit Card liabilities
  const creditLiabs = liabilities
    .filter(l => l.category?.toLowerCase() === 'credit card')
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)

  // Inflow & Outflow values
  const inflow = Number(profile?.monthly_inflow) || 12000
  const outflow = Number(profile?.monthly_outflow) || 8500
  const calculatedSavingsRate = inflow > 0 ? Math.round(((inflow - outflow) / inflow) * 100) : 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {profile?.full_name || 'User'}!
          </h1>
          <p className="text-slate-500 text-sm mt-1">Here is a snapshot of your financial well-being.</p>
        </div>
        <button 
          onClick={() => setActiveTab('report')} 
          className="bg-white px-4 py-2 border border-slate-200 rounded-xl shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <i className="fas fa-file-invoice-dollar text-slate-400"></i> View Report
        </button>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex flex-col justify-center">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 mb-1">Financial Health</p>
              <h2 className="text-3xl font-bold text-slate-800">
                {profile?.financial_health_score || 50}
                <span className="text-lg text-slate-400 font-normal">/100</span>
              </h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
              <i className="fas fa-heartbeat"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">
              {profile?.financial_health_score >= 70 ? 'Good' : 'Needs Review'}
            </span>
            <span className="text-xs text-slate-400">Top 20% of peers</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-center border-t-4 border-t-primary">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 mb-1">Net Worth</p>
              <h2 className="text-2xl font-bold text-slate-800">{formatRM(calculatedNetWorth)}</h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center text-primary">
              <i className="fas fa-wallet"></i>
            </div>
          </div>
          <div className="mt-4 flex gap-4 text-xs text-slate-500">
            <div>Assets: <span className="text-slate-800 font-bold">{formatRM(totalAssets)}</span></div>
            <div>Liab: <span className="text-rose-500 font-bold">{formatRM(totalLiabilities)}</span></div>
          </div>
        </Card>

        <Card className="flex flex-col justify-center border-t-4 border-t-secondary">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 mb-1">Monthly Savings Rate</p>
              <h2 className="text-2xl font-bold text-slate-800">{calculatedSavingsRate}%</h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-secondary">
              <i className="fas fa-piggy-bank"></i>
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar progress={calculatedSavingsRate} color="bg-secondary" />
            <p className="text-xs text-slate-400 mt-2">Target: 30%</p>
          </div>
        </Card>

        <Card className="flex flex-col justify-center border-t-4 border-t-accent">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 mb-1">Retirement Readiness</p>
              <h2 className="text-2xl font-bold text-slate-800">
                {profile?.retirement_readiness || 80}%
              </h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-accent">
              <i className="fas fa-umbrella-beach"></i>
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar progress={profile?.retirement_readiness || 80} color="bg-accent" />
            <p className="text-xs text-slate-400 mt-2">On track for Age 60</p>
          </div>
        </Card>
      </div>

      {/* Grid for charts and stats breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Net Worth Asset Allocation</h3>
              <button
                onClick={() => setActiveTab('discovery')}
                className="text-sm text-primary hover:text-sky-700 font-medium transition-colors flex items-center gap-1"
              >
                Update Assets <i className="fas fa-chevron-right text-xs"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 font-medium">EPF & Retirement</span>
                  <span className="font-bold text-slate-800">{formatRM(epfAssets)} ({epfPct}%)</span>
                </div>
                <ProgressBar progress={epfPct} color="bg-primary" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 font-medium">Real Estate (Property)</span>
                  <span className="font-bold text-slate-800">{formatRM(propertyAssets)} ({propertyPct}%)</span>
                </div>
                <ProgressBar progress={propertyPct} color="bg-secondary" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 font-medium">Cash & Equivalents</span>
                  <span className="font-bold text-slate-800">{formatRM(cashAssets)} ({cashPct}%)</span>
                </div>
                <ProgressBar progress={cashPct} color="bg-amber-400" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 font-medium">Equities & Investments</span>
                  <span className="font-bold text-slate-800">{formatRM(investmentAssets)} ({investPct}%)</span>
                </div>
                <ProgressBar progress={investPct} color="bg-accent" />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-800 text-white border-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            <h3 className="font-bold mb-2">Need Expert Advice?</h3>
            <p className="text-sm text-slate-300 mb-4">
              Connect with a certified financial planner to optimize your portfolio.
            </p>
            <button
              onClick={() => setActiveTab('advisor')}
              className="w-full bg-primary hover:bg-sky-600 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Book Consultation
            </button>
          </Card>

          <Card className="p-0 overflow-hidden border-rose-100">
            <div className="p-4 bg-rose-50 border-b border-rose-100 flex justify-between items-center">
              <h3 className="font-bold text-rose-800 text-sm">Credit Cards & Personal</h3>
              <span className="font-bold text-rose-600">{formatRM(creditLiabs)}</span>
            </div>
            <div className="p-4 space-y-4">
              {liabilities.filter(l => l.category?.toLowerCase() === 'credit card').map((l, index) => (
                <div key={l.id || index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center">
                      <i className="fas fa-credit-card text-xs"></i>
                    </div>
                    <span className="text-slate-600">{l.name}</span>
                  </div>
                  <span className="font-medium text-rose-600">{formatRM(l.amount)}</span>
                </div>
              ))}
              {liabilities.filter(l => l.category?.toLowerCase() === 'credit card').length === 0 && (
                <p className="text-xs text-slate-400 text-center py-2">No active credit card debt</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
