'use client'

import Card from './Card'
import ProgressBar from './ProgressBar'

export default function InsurancePlanning({ insurancePolicies }) {
  const formatRM = (val) => {
    return `RM ${Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  }

  // Get policy by type helper
  const getPolicy = (type) => {
    const defaultPolicies = {
      life: { coverage_amount: 500000, need_amount: 1200000, status: 'Underinsured', notes: 'Shortfall of RM 700,000 based on the 10x annual expenses rule. Consider term life for cost-effective coverage.' },
      medical: { coverage_amount: 1500000, need_amount: 1000000, status: 'Adequate', notes: 'Company plus personal standalone plan provides comprehensive coverage against medical inflation.' },
      critical_illness: { coverage_amount: 1000000, need_amount: 360000, status: 'Action Needed', notes: 'Recommended 3 years of income replacement (RM 360k) for recovery period.' },
      disability: { coverage_amount: 500000, need_amount: 500000, status: 'Adequate', notes: 'Current basic life policy includes a matching TPD rider which meets minimum requirements.' },
    }

    const found = insurancePolicies.find(p => p.type === type)
    return found || defaultPolicies[type]
  }

  const lifePolicy = getPolicy('life')
  const medicalPolicy = getPolicy('medical')
  const ciPolicy = getPolicy('critical_illness')
  const disabilityPolicy = getPolicy('disability')

  // Calculate dynamic protection score
  const getRatio = (policy) => {
    if (!policy || !policy.need_amount) return 0
    return Math.min(100, Math.round((Number(policy.coverage_amount) / Number(policy.need_amount)) * 100))
  }

  const lifeRatio = getRatio(lifePolicy)
  const medicalRatio = getRatio(medicalPolicy)
  const ciRatio = getRatio(ciPolicy)
  const disabilityRatio = getRatio(disabilityPolicy)

  const avgScore = Math.round((lifeRatio + medicalRatio + ciRatio + disabilityRatio) / 4)

  const getScoreLabel = (score) => {
    if (score >= 85) return 'Excellent Standing'
    if (score >= 70) return 'Good Standing'
    if (score >= 50) return 'Fair Standing'
    return 'Action Advised'
  }

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-500 bg-emerald-50 border-emerald-100'
    if (score >= 70) return 'text-sky-500 bg-sky-50 border-sky-100'
    if (score >= 50) return 'text-amber-500 bg-amber-50 border-amber-100'
    return 'text-rose-500 bg-rose-50 border-rose-100'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Insurance Needs Analysis</h1>
          <p className="text-slate-500 text-sm mt-1">Evaluate your coverage and identify potential gaps in your safety net.</p>
        </div>
        <div className={`p-3 rounded-xl border shadow-sm flex items-center gap-3 bg-white`}>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-800">
            {avgScore}
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Protection Score</p>
            <p className="text-sm font-bold text-slate-700">{getScoreLabel(avgScore)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Life Insurance Card */}
        <Card className="border-t-4 border-t-rose-400">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-lg">
                <i className="fas fa-heartbeat"></i>
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Life Insurance</h3>
                <p className="text-xs text-slate-500">Income Replacement</p>
              </div>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded ${lifeRatio >= 100 ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
              {lifeRatio >= 100 ? 'Adequate' : 'Underinsured'}
            </span>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Coverage: {formatRM(lifePolicy.coverage_amount)}</span>
              <span className="font-bold text-slate-800">Need: {formatRM(lifePolicy.need_amount)}</span>
            </div>
            <ProgressBar progress={lifeRatio} color="bg-rose-500" />
          </div>
          <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100/50 flex gap-3 items-start">
            <i className="fas fa-info-circle text-rose-400 mt-0.5"></i>
            <p className="text-xs text-rose-700">{lifePolicy.notes}</p>
          </div>
        </Card>

        {/* Medical Card */}
        <Card className="border-t-4 border-t-green-400">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center text-lg">
                <i className="fas fa-hospital"></i>
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Medical Card</h3>
                <p className="text-xs text-slate-500">Hospitalization & Surgery</p>
              </div>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded ${medicalRatio >= 100 ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
              {medicalRatio >= 100 ? 'Adequate' : 'Underinsured'}
            </span>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Limit: {formatRM(medicalPolicy.coverage_amount)} / yr</span>
              <span className="font-bold text-slate-800">Need: {formatRM(medicalPolicy.need_amount)}</span>
            </div>
            <ProgressBar progress={medicalRatio} color="bg-green-500" />
          </div>
          <div className="bg-green-50/50 p-3 rounded-xl border border-green-100/50 flex gap-3 items-start">
            <i className="fas fa-check-circle text-green-500 mt-0.5"></i>
            <p className="text-xs text-green-700">{medicalPolicy.notes}</p>
          </div>
        </Card>

        {/* Critical Illness Card */}
        <Card className="border-t-4 border-t-amber-400">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center text-lg">
                <i className="fas fa-procedures"></i>
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Critical Illness</h3>
                <p className="text-xs text-slate-500">Lump Sum Recovery Payout</p>
              </div>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded ${ciRatio >= 100 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {ciRatio >= 100 ? 'Adequate' : 'Action Needed'}
            </span>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Coverage: {formatRM(ciPolicy.coverage_amount)}</span>
              <span className="font-bold text-slate-800">Need: {formatRM(ciPolicy.need_amount)}</span>
            </div>
            <ProgressBar progress={ciRatio} color="bg-amber-500" />
          </div>
          <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100/50 flex gap-3 items-start">
            <i className="fas fa-exclamation-triangle text-amber-500 mt-0.5"></i>
            <p className="text-xs text-amber-800">{ciPolicy.notes}</p>
          </div>
        </Card>

        {/* Disability Card */}
        <Card className="border-t-4 border-t-sky-400">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center text-lg">
                <i className="fas fa-wheelchair"></i>
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Disability (TPD)</h3>
                <p className="text-xs text-slate-500">Total & Permanent Disability</p>
              </div>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded ${disabilityRatio >= 100 ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
              {disabilityRatio >= 100 ? 'Adequate' : 'Underinsured'}
            </span>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Coverage: {formatRM(disabilityPolicy.coverage_amount)}</span>
              <span className="font-bold text-slate-800">Need: {formatRM(disabilityPolicy.need_amount)}</span>
            </div>
            <ProgressBar progress={disabilityRatio} color="bg-sky-500" />
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex gap-3 items-start">
            <i className="fas fa-shield-alt text-slate-400 mt-0.5"></i>
            <p className="text-xs text-slate-600">{disabilityPolicy.notes}</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
