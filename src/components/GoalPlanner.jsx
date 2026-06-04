'use client'

import { useState } from 'react'
import Card from './Card'
import ProgressBar from './ProgressBar'

export default function GoalPlanner({ goals, onAddGoal }) {
  const [showNewGoal, setShowNewGoal] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Form fields
  const [goalName, setGoalName] = useState('')
  const [category, setCategory] = useState('Education')
  const [targetAmount, setTargetAmount] = useState('')
  const [targetYear, setTargetYear] = useState('')
  const [currentSavings, setCurrentSavings] = useState('')
  const [monthlyContribution, setMonthlyContribution] = useState('')

  const formatRM = (val) => {
    return `RM ${Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  }

  const handleSaveGoal = async (e) => {
    e.preventDefault()
    if (!goalName || !targetAmount || !targetYear) return

    setLoading(true)
    const newGoalObj = {
      name: goalName,
      category,
      target_amount: Number(targetAmount),
      target_year: Number(targetYear),
      current_savings: Number(currentSavings) || 0,
      monthly_contribution: Number(monthlyContribution) || 0,
      status: 'On Track', // default state
    }

    try {
      await onAddGoal(newGoalObj)
      setShowNewGoal(false)
      // Reset form
      setGoalName('')
      setCategory('Education')
      setTargetAmount('')
      setTargetYear('')
      setCurrentSavings('')
      setMonthlyContribution('')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Helper icon lookup
  const getGoalIcon = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'education': return 'fa-graduation-cap bg-sky-100 text-sky-600'
      case 'property': return 'fa-home bg-purple-100 text-purple-600'
      case 'travel': return 'fa-plane bg-amber-100 text-amber-600'
      case 'wealth': return 'fa-chart-line bg-emerald-100 text-emerald-600'
      default: return 'fa-bullseye bg-slate-100 text-slate-600'
    }
  }

  if (showNewGoal) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowNewGoal(false)}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Create New Goal</h1>
            <p className="text-slate-500 text-sm mt-1">Set a new financial milestone to track.</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <form onSubmit={handleSaveGoal} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Goal Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Vacation to Japan, Emergency Fund"
                className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Goal Category</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Education', 'Property', 'Travel', 'Wealth'].map(cat => (
                  <div
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`border rounded-xl p-3 text-center cursor-pointer transition-all ${
                      category === cat
                        ? 'border-primary bg-sky-50 text-primary font-semibold shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-sm">{cat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Amount (RM)</label>
                <input
                  type="number"
                  required
                  placeholder="50000"
                  className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Year</label>
                <input
                  type="number"
                  required
                  placeholder="2030"
                  className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Savings (RM)</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Contribution (RM)</label>
                <input
                  type="number"
                  placeholder="500"
                  className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowNewGoal(false)}
                className="px-6 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-sky-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all text-sm shadow-md shadow-sky-100 flex items-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  'Save Goal'
                )}
              </button>
            </div>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Goal Planning</h1>
          <p className="text-slate-500 text-sm mt-1">Track and manage your life milestones.</p>
        </div>
        <button
          onClick={() => setShowNewGoal(true)}
          className="bg-primary hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md shadow-sky-100 transition-all"
        >
          <i className="fas fa-plus text-xs"></i> New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progressPct = goal.target_amount > 0
            ? Math.round((goal.current_savings / goal.target_amount) * 100)
            : 0

          const isWarning = goal.status === 'Needs Attention'
          const badgeClass = isWarning
            ? 'bg-amber-100 text-amber-700'
            : 'bg-green-100 text-green-700'

          return (
            <Card key={goal.id}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getGoalIcon(goal.category)}`}>
                    <i className="fas"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{goal.name}</h3>
                    <p className="text-xs text-slate-500">Target Year: {goal.target_year}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${badgeClass}`}>
                  {goal.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Current: {formatRM(goal.current_savings)}</span>
                  <span className="font-bold text-slate-800">Target: {formatRM(goal.target_amount)}</span>
                </div>
                <ProgressBar
                  progress={progressPct}
                  color={isWarning ? 'bg-amber-500' : 'bg-primary'}
                />
              </div>
            </Card>
          )
        })}
        {goals.length === 0 && (
          <div className="col-span-2 text-center py-12 text-slate-400">
            <i className="fas fa-bullseye text-4xl mb-3"></i>
            <p className="text-sm">No goals planned yet. Set your first financial milestone!</p>
          </div>
        )}
      </div>
    </div>
  )
}
