'use client'

import { useState } from 'react'
import Card from './Card'

export default function PremiumPlans() {
  const [upgrading, setUpgrading] = useState(false)
  const [upgraded, setUpgraded] = useState(false)

  const handleUpgrade = () => {
    setUpgrading(true)
    setTimeout(() => {
      setUpgrading(false)
      setUpgraded(true)
    }, 1500)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-8 pt-4">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Upgrade Your Financial Journey
        </h1>
        <p className="text-slate-500 mt-3 text-sm leading-relaxed">
          Unlock advanced AI tools, direct advisor access, and comprehensive legacy planning features.
        </p>
      </div>

      {upgraded ? (
        <div className="max-w-md mx-auto p-8 bg-emerald-50 border border-emerald-100 rounded-3xl text-center space-y-4 shadow-lg shadow-emerald-50/50">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto">
            <i className="fas fa-crown"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">You are now a Pro!</h2>
            <p className="text-sm text-slate-500 mt-1">
              Thank you for upgrading. Your account is now provisioned with full legacy planning, custom calculations, and advisory access.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          <Card className="flex flex-col justify-between border-2 border-transparent">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Basic Plan</h3>
              <p className="text-4xl font-extrabold mt-4 text-slate-800">Free</p>
              <ul className="mt-8 space-y-4 text-sm text-slate-600">
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3 text-xs"></i>
                  Dashboard & Net Worth Tracking
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3 text-xs"></i>
                  Basic Goal Planning
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3 text-xs"></i>
                  Standard Financial Health Score
                </li>
              </ul>
            </div>
            <button className="w-full mt-10 bg-slate-100 text-slate-400 font-bold py-3.5 rounded-xl cursor-not-allowed text-sm">
              Current Plan
            </button>
          </Card>

          <Card className="border-2 border-primary shadow-xl shadow-sky-100 relative flex flex-col justify-between transform md:-translate-y-4 bg-white">
            <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-extrabold px-4 py-1.5 rounded-bl-2xl rounded-tr-2xl tracking-wider">
              POPULAR
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Premium Pro</h3>
              <p className="text-4xl font-extrabold mt-4 text-primary">
                RM 49
                <span className="text-base text-slate-400 font-normal">/month</span>
              </p>
              <ul className="mt-8 space-y-4 text-sm text-slate-600">
                <li className="flex items-center">
                  <i className="fas fa-check text-primary mr-3 text-xs"></i>
                  Advanced Retirement Projections
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-primary mr-3 text-xs"></i>
                  AI Financial Coach Insights
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-primary mr-3 text-xs"></i>
                  Monthly Advisor Consultations
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-primary mr-3 text-xs"></i>
                  Tax & Estate Planning Insights
                </li>
              </ul>
            </div>
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="w-full mt-10 bg-primary hover:bg-sky-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-sky-200 text-sm flex justify-center items-center gap-2"
            >
              {upgrading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                'Upgrade Now'
              )}
            </button>
          </Card>
        </div>
      )}
    </div>
  )
}
