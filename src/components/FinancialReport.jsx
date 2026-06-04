'use client'

import Card from './Card'

export default function FinancialReport({ profile, assets, liabilities }) {
  const formatRM = (val) => {
    return `RM ${Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  }

  const totalAssets = assets.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  const totalLiabilities = liabilities.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  const netWorth = totalAssets - totalLiabilities

  // Compute donut chart ratios
  const totalBalance = totalAssets + totalLiabilities
  const assetsPct = totalBalance > 0 ? Math.round((totalAssets / totalBalance) * 100) : 100
  const liabilitiesPct = totalBalance > 0 ? Math.round((totalLiabilities / totalBalance) * 100) : 0

  // SVG dasharray calculations (perimeter = 2 * PI * r, for r=15.9155, perimeter ~ 100)
  const assetsDash = `${assetsPct}, 100`
  const liabilitiesDash = `${liabilitiesPct}, 100`

  const handleDownloadPDF = () => {
    alert('Generating your comprehensive MY WealthPlan PDF Report. This features dynamic tables of assets, liabilities, retirement trajectories, and protection scoring.')
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Report Hero Card */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-md border border-white/10 shrink-0">
            <i className="fas fa-file-pdf text-sky-300"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Financial Summary Report</h2>
            <p className="text-slate-300 text-sm mt-1">Review your holistic financial snapshot before exporting.</p>
          </div>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="relative z-10 bg-primary hover:bg-sky-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/30 flex items-center gap-3 whitespace-nowrap w-full md:w-auto justify-center group"
        >
          <i className="fas fa-download group-hover:-translate-y-0.5 transition-transform"></i> Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Net Worth statement details */}
        <Card className="col-span-1 lg:col-span-2 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Net Worth Statement</h3>
            <span className="text-sm font-bold text-primary bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              {formatRM(netWorth)}
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Donut Chart SVG */}
            <div className="relative w-48 h-48 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Assets Ring (Blue) */}
                <path
                  className="text-primary"
                  strokeDasharray={assetsDash}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Liabilities Ring (Rose) */}
                {liabilitiesPct > 0 && (
                  <path
                    className="text-rose-400"
                    strokeDasharray={liabilitiesDash}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Net Worth</span>
                <span className="font-bold text-slate-800 text-lg">{formatRM(netWorth)}</span>
              </div>
            </div>

            {/* Balances details */}
            <div className="flex-1 w-full space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-slate-600 font-semibold text-sm">Total Assets</span>
                  </div>
                  <span className="font-bold text-slate-800">{formatRM(totalAssets)}</span>
                </div>
                <p className="text-xs text-slate-400 ml-5">Properties, EPF accounts, investments, cash reserves</p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    <span className="text-slate-600 font-semibold text-sm">Total Liabilities</span>
                  </div>
                  <span className="font-bold text-rose-600">{formatRM(totalLiabilities)}</span>
                </div>
                <p className="text-xs text-rose-400 ml-5">Outstanding mortgages, car loans, card balances</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Dynamic List Sidebar */}
        <Card className="max-h-[400px] overflow-y-auto">
          <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Asset Itemization</h3>
          <div className="space-y-3">
            {assets.map((item, index) => (
              <div key={item.id || index} className="flex justify-between text-xs py-2 border-b border-slate-100">
                <span className="text-slate-600 font-medium">{item.name}</span>
                <span className="font-bold text-slate-800">{formatRM(item.amount)}</span>
              </div>
            ))}
            {assets.length === 0 && (
              <p className="text-slate-400 text-center py-4 text-xs">No assets recorded</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
