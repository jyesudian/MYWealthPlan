'use client'

import { useState } from 'react'
import Card from './Card'

export default function RetirementPlanner({ profile, assets }) {
  const currentAge = Number(profile?.age) || 38

  // Interactive Calculator States
  const [retireAge, setRetireAge] = useState(60)
  const [lifespan, setLifespan] = useState(85)
  const [monthlyNeed, setMonthlyNeed] = useState(8000)

  // Get current retirement assets (EPF + Investments)
  const epfAssets = assets
    .filter(a => a.category?.toUpperCase() === 'EPF')
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  const investmentAssets = assets
    .filter(a => a.category?.toUpperCase() === 'INVESTMENTS')
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  const currentRetirementAssets = epfAssets + investmentAssets

  // Dynamic Math Engine
  const yearsInRetirement = Math.max(0, lifespan - retireAge)
  const yearsToAccumulate = Math.max(0, retireAge - currentAge)

  // Required Corpus = Annual Need * Years in Retirement (simplified for illustration/compounding)
  const requiredCorpus = monthlyNeed * 12 * yearsInRetirement

  // Projected Corpus = Current Retirement Assets grown at 5% p.a. + monthly savings (if any)
  // Let's assume current assets grow at 5% annually
  const annualGrowthRate = 0.05
  const projectedFromExisting = currentRetirementAssets * Math.pow(1 + annualGrowthRate, yearsToAccumulate)
  
  // Assume savings rate capacity is saved
  const monthlyInflow = Number(profile?.monthly_inflow) || 12000
  const monthlyOutflow = Number(profile?.monthly_outflow) || 8500
  const monthlySavings = Math.max(0, monthlyInflow - monthlyOutflow)
  
  // Future Value of monthly annuity savings at 5% p.a.
  const monthlyRate = annualGrowthRate / 12
  const totalMonths = yearsToAccumulate * 12
  const projectedFromSavings = totalMonths > 0
    ? monthlySavings * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)
    : 0

  const totalProjected = Math.round(projectedFromExisting + projectedFromSavings)
  const shortfall = Math.max(0, requiredCorpus - totalProjected)
  const retirementReadinessPct = requiredCorpus > 0
    ? Math.min(100, Math.round((totalProjected / requiredCorpus) * 100))
    : 100

  const formatRM = (val) => {
    return `RM ${Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  }

  // Generate SVG curve path dynamically based on score
  // Low readiness = flatter curve, High readiness = steeper exponential curve
  const chartHeightFactor = Math.min(1.2, 0.4 + (retirementReadinessPct / 100) * 0.8)
  const curvePath = `M0,95 Q20,${90 - 5 * chartHeightFactor} 40,${75 - 15 * chartHeightFactor} T70,${40 - 25 * chartHeightFactor} T100,${25 - 20 * chartHeightFactor}`
  const areaPath = `${curvePath} L100,100 L0,100 Z`

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Retirement Planner</h1>
        <p className="text-slate-500 text-sm mt-1">Ensure you have enough corpus to live comfortably.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Corpus Projection</h3>
          <div className="h-64 bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden flex flex-col justify-end pb-4 pt-10 px-4">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="20" x2="100" y2="20" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2" />
              
              {/* Target Line */}
              <line x1="0" y1="25" x2="100" y2="25" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2,2" />
              
              {/* Projection Area */}
              <path d={areaPath} fill="url(#areaGradient)" className="transition-all duration-500" />
              
              {/* Projection Curve */}
              <path d={curvePath} fill="none" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" className="transition-all duration-500" />
              
              <circle cx="100" cy={25 - 20 * chartHeightFactor} r="3.5" fill="white" stroke="#0ea5e9" strokeWidth="2.5" className="transition-all duration-500" />
            </svg>
            
            <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
              <span className="text-slate-600 font-medium">Target ({formatRM(requiredCorpus)})</span>
              <div className="w-2.5 h-2.5 rounded-full bg-primary ml-2"></div>
              <span className="text-slate-600 font-medium">Projected ({formatRM(totalProjected)})</span>
            </div>
            
            <div className="absolute bottom-1 left-4 right-4 flex justify-between text-[10px] text-slate-400 font-bold">
              <span>Age {currentAge} (Now)</span>
              <span>Age {Math.round(currentAge + (retireAge - currentAge)/2)}</span>
              <span>Age {retireAge} (Retirement)</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 text-center">
            <div>
              <p className="text-xs text-slate-500">Required Corpus</p>
              <p className="font-bold text-slate-800 text-lg">{formatRM(requiredCorpus)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Projected</p>
              <p className="font-bold text-secondary text-lg">{formatRM(totalProjected)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Shortfall</p>
              <p className="font-bold text-rose-500 text-lg">
                {shortfall > 0 ? formatRM(shortfall) : 'RM 0 (Fully Funded!)'}
              </p>
            </div>
          </div>
        </Card>

        {/* Assumptions Inputs Panel */}
        <Card className="space-y-5">
          <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Calculator Variables</h3>
          
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <span>Retirement Age</span>
              <span className="text-slate-800">{retireAge} Years</span>
            </div>
            <input
              type="range"
              className="w-full accent-primary h-2 bg-slate-100 rounded-lg cursor-pointer appearance-none"
              min="50"
              max="70"
              value={retireAge}
              onChange={(e) => setRetireAge(Number(e.target.value))}
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <span>Expected Lifespan</span>
              <span className="text-slate-800">{lifespan} Years</span>
            </div>
            <input
              type="range"
              className="w-full accent-primary h-2 bg-slate-100 rounded-lg cursor-pointer appearance-none"
              min={Math.max(70, retireAge + 1)}
              max="100"
              value={lifespan}
              onChange={(e) => setLifespan(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Monthly Spend in Retirement (RM)
            </label>
            <input
              type="number"
              className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800 font-semibold"
              value={monthlyNeed}
              onChange={(e) => setMonthlyNeed(Number(e.target.value))}
            />
          </div>

          <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-800 space-y-1">
            <p className="font-bold"><i className="fas fa-info-circle mr-1"></i> Compound Growth Active</p>
            <p className="text-slate-500 leading-normal">
              Your assets are assumed to grow at a conservative rate of <strong>5% per annum</strong> until your retirement. Your monthly savings capacity is also factored into the projection.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
