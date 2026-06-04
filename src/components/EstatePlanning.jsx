'use client'

import { useState } from 'react'
import Card from './Card'
import ProgressBar from './ProgressBar'

export default function EstatePlanning() {
  // Milestones State
  const [epfNominees, setEpfNominees] = useState(true)
  const [willWritten, setWillWritten] = useState(false)
  const [trustSetup, setTrustSetup] = useState(false)

  // Coffin/Final Expenses Allocation
  const [coffinAllocation, setCoffinAllocation] = useState(30000)
  const [inheritanceAllocation, setInheritanceAllocation] = useState(500000)

  // Compute legacy readiness score dynamically
  const score = (epfNominees ? 30 : 0) + (willWritten ? 40 : 0) + (trustSetup ? 30 : 0)

  const formatRM = (val) => {
    return `RM ${Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Estate & Legacy Planning</h1>
        <p className="text-slate-500 text-sm mt-1">Protect your wealth and ensure a smooth transfer to your loved ones.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">Legacy Readiness</h3>
            <span className="text-2xl font-bold text-accent">{score}/100</span>
          </div>
          <ProgressBar progress={score} color="bg-accent" />
          
          <div className="mt-6 space-y-4">
            <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50/50 transition-colors select-none">
              <input
                type="checkbox"
                className="w-5 h-5 accent-accent"
                checked={epfNominees}
                onChange={(e) => setEpfNominees(e.target.checked)}
              />
              <div className="text-sm">
                <p className="font-semibold text-slate-700">EPF Nominees Nominated</p>
                <p className="text-xs text-slate-400">Essential first step for asset transfer in Malaysia</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50/50 transition-colors select-none">
              <input
                type="checkbox"
                className="w-5 h-5 accent-accent"
                checked={willWritten}
                onChange={(e) => setWillWritten(e.target.checked)}
              />
              <div className="text-sm">
                <p className="font-semibold text-slate-700">Will Written (Wasiat)</p>
                <p className="text-xs text-slate-400">Specifies executor, guardians, and asset division</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50/50 transition-colors select-none">
              <input
                type="checkbox"
                className="w-5 h-5 accent-accent"
                checked={trustSetup}
                onChange={(e) => setTrustSetup(e.target.checked)}
              />
              <div className="text-sm">
                <p className="font-semibold text-slate-700">Hibah / Trust Setup</p>
                <p className="text-xs text-slate-400">Ensures swift payout bypasses probate delay</p>
              </div>
            </label>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 mb-4">Specific Legacy Allocations</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Coffin & Final Expenses</p>
                  <p className="text-xs text-slate-500">Allocated via Term Life policies</p>
                </div>
                <div className="text-right">
                  <input
                    type="number"
                    className="w-28 border border-slate-200 rounded-lg p-1 text-right text-sm font-semibold focus:ring-1 focus:ring-accent outline-none"
                    value={coffinAllocation}
                    onChange={(e) => setCoffinAllocation(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Children's Inheritance</p>
                  <p className="text-xs text-slate-500">Allocated in Trust Fund assets</p>
                </div>
                <div className="text-right">
                  <input
                    type="number"
                    className="w-32 border border-slate-200 rounded-lg p-1 text-right text-sm font-semibold focus:ring-1 focus:ring-accent outline-none"
                    value={inheritanceAllocation}
                    onChange={(e) => setInheritanceAllocation(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 text-sm text-accent font-semibold border border-accent rounded-xl py-3 hover:bg-indigo-50 transition-colors">
            Manage Beneficiaries & Trust Deeds
          </button>
        </Card>
      </div>
    </div>
  )
}
