'use client'

import { useState } from 'react'
import Card from './Card'

export default function DiscoveryWizard({ profile, assets, liabilities, onSaveWizardData }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Pre-extract data helper functions
  const getAssetVal = (categoryName) => {
    const found = assets.find(a => a.category?.toUpperCase() === categoryName.toUpperCase())
    return found ? Number(found.amount) : 0
  }

  const getLiabVal = (categoryName) => {
    const found = liabilities.find(l => l.category?.toUpperCase() === categoryName.toUpperCase())
    return found ? Number(found.amount) : 0
  }

  // Step 1: Personal Info
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [age, setAge] = useState(profile?.age || 38)
  const [maritalStatus, setMaritalStatus] = useState(profile?.marital_status || 'Married')

  // Step 2: Income Sources (Monthly)
  const [salary, setSalary] = useState(Number(profile?.monthly_inflow) ? Number(profile?.monthly_inflow) - 2000 : 10000)
  const [businessIncome, setBusinessIncome] = useState(1500)
  const [rentalIncome, setRentalIncome] = useState(500)
  const [otherIncome, setOtherIncome] = useState(0)

  // Step 3: Expenses (Monthly)
  const [housing, setHousing] = useState(2500)
  const [utilities, setUtilities] = useState(600)
  const [transportation, setTransportation] = useState(1200)
  const [education, setEducation] = useState(1000)

  // Step 4: Assets Overview
  const [cash, setCash] = useState(getAssetVal('CASH') || 75000)
  const [epf, setEpf] = useState(getAssetVal('EPF') || 337500)
  const [investments, setInvestments] = useState(getAssetVal('INVESTMENTS') || 112500)
  const [property, setProperty] = useState(getAssetVal('PROPERTY') || 225000)

  // Step 5: Liabilities Overview
  const [mortgage, setMortgage] = useState(getLiabVal('MORTGAGE') || 200000)
  const [vehicleLoan, setVehicleLoan] = useState(getLiabVal('VEHICLE LOAN') || 8500)
  const [personalLoan, setPersonalLoan] = useState(getLiabVal('PERSONAL LOAN') || 0)
  const [creditCards, setCreditCards] = useState(getLiabVal('CREDIT CARD') || 15000)

  // Step 6: Top Goals
  const [selectedGoals, setSelectedGoals] = useState({
    retirement: true,
    education: true,
    house: true,
    wealth: false,
    estate: false,
  })

  const nextStep = () => setStep(s => Math.min(6, s + 1))
  const prevStep = () => setStep(s => Math.max(1, s - 1))

  const handleComplete = async () => {
    setLoading(true)
    
    // Construct database models to save
    const updatedProfile = {
      full_name: fullName,
      age: Number(age),
      marital_status: maritalStatus,
      monthly_inflow: Number(salary) + Number(businessIncome) + Number(rentalIncome) + Number(otherIncome),
      monthly_outflow: Number(housing) + Number(utilities) + Number(transportation) + Number(education),
    }

    // Recalculating Net Worth & Financial Health dummy math
    const totalAssets = Number(cash) + Number(epf) + Number(investments) + Number(property)
    const totalLiabs = Number(mortgage) + Number(vehicleLoan) + Number(personalLoan) + Number(creditCards)
    updatedProfile.net_worth = totalAssets - totalLiabs
    
    const assetsList = [
      { category: 'CASH', name: 'Cash & Equivalents', amount: Number(cash) },
      { category: 'EPF', name: 'EPF & Retirement', amount: Number(epf) },
      { category: 'INVESTMENTS', name: 'Equities & Investments', amount: Number(investments) },
      { category: 'PROPERTY', name: 'Real Estate (Property)', amount: Number(property) },
    ]

    const liabilitiesList = [
      { category: 'MORTGAGE', name: 'Housing Mortgage Loan', amount: Number(mortgage) },
      { category: 'VEHICLE LOAN', name: 'Car Loan', amount: Number(vehicleLoan) },
      { category: 'PERSONAL LOAN', name: 'Personal Term Loan', amount: Number(personalLoan) },
      { category: 'CREDIT CARD', name: 'Maybank Visa Signature', amount: Number(creditCards) },
    ]

    try {
      await onSaveWizardData(updatedProfile, assetsList, liabilitiesList)
      setSuccess(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-3xl mx-auto shadow-sm">
          <i className="fas fa-check-circle"></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Financial Profile Completed!</h1>
          <p className="text-slate-500 mt-2">
            Your data has been securely saved to the database. Your dashboard statistics and assets breakdowns are now updated.
          </p>
        </div>
        <button
          onClick={() => { setStep(1); setSuccess(false); }}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
        >
          Review Data
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Financial Discovery Journey</h1>
        <p className="text-slate-500 text-sm mt-1">Let's build your financial profile step-by-step.</p>
      </div>

      <Card>
        {/* Navigation Step Indicators */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map(s => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  s === step
                    ? 'bg-primary text-white shadow-md shadow-sky-200'
                    : s < step
                    ? 'bg-sky-100 text-primary'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {s < step ? <i className="fas fa-check text-xs"></i> : s}
              </div>
            ))}
          </div>
          <span className="text-sm font-medium text-slate-500">Step {step} of 6</span>
        </div>

        {/* Wizard Form Sections */}
        <div className="space-y-6 min-h-[280px]">
          {step === 1 && (
            <div className="animate-fade-in space-y-4">
              <h2 className="text-lg font-bold text-slate-800">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                    <input
                      type="number"
                      className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Marital Status</label>
                    <select
                      className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value)}
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in space-y-4">
              <h2 className="text-lg font-bold text-slate-800">Income Sources (Monthly)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Base Salary (RM)</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Business Income (RM)</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                    value={businessIncome}
                    onChange={(e) => setBusinessIncome(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Rental Income (RM)</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                    value={rentalIncome}
                    onChange={(e) => setRentalIncome(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Other Income (RM)</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                    value={otherIncome}
                    onChange={(e) => setOtherIncome(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in space-y-4">
              <h2 className="text-lg font-bold text-slate-800">Expenses (Monthly)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Housing / Rent (RM)</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                    value={housing}
                    onChange={(e) => setHousing(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Utilities & Bills (RM)</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                    value={utilities}
                    onChange={(e) => setUtilities(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Transportation & Fuel (RM)</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                    value={transportation}
                    onChange={(e) => setTransportation(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Education & Childcare (RM)</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                    value={education}
                    onChange={(e) => setEducation(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in space-y-4">
              <h2 className="text-lg font-bold text-slate-800">Assets Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cash & Savings (RM)</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                    value={cash}
                    onChange={(e) => setCash(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">EPF / PRS Account (RM)</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                    value={epf}
                    onChange={(e) => setEpf(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Investments / Unit Trusts (RM)</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                    value={investments}
                    onChange={(e) => setInvestments(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Property Value (RM)</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                    value={property}
                    onChange={(e) => setProperty(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-fade-in space-y-4">
              <h2 className="text-lg font-bold text-slate-800">Liabilities Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Home Mortgages (RM)</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                    value={mortgage}
                    onChange={(e) => setMortgage(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Loans (RM)</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                    value={vehicleLoan}
                    onChange={(e) => setVehicleLoan(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Personal Loans (RM)</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                    value={personalLoan}
                    onChange={(e) => setPersonalLoan(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Credit Card Balances (RM)</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-800"
                    value={creditCards}
                    onChange={(e) => setCreditCards(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="animate-fade-in space-y-4">
              <h2 className="text-lg font-bold text-slate-800">Top Financial Goals</h2>
              <div className="space-y-3">
                {[
                  { key: 'retirement', label: 'Retirement Readiness' },
                  { key: 'education', label: 'Child Education Funding' },
                  { key: 'house', label: 'Property / House Purchase' },
                  { key: 'wealth', label: 'Accelerated Wealth Growth' },
                  { key: 'estate', label: 'Estate & Legacy Security' },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors select-none"
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-primary"
                      checked={selectedGoals[key]}
                      onChange={(e) =>
                        setSelectedGoals({ ...selectedGoals, [key]: e.target.checked })
                      }
                    />
                    <span className="font-medium text-slate-700 text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Buttons footer */}
        <div className="mt-8 flex justify-between pt-4 border-t border-slate-100">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`px-6 py-2.5 rounded-xl font-medium transition-colors text-sm flex items-center gap-2 ${
              step === 1
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <i className="fas fa-arrow-left"></i> Previous
          </button>
          
          <button
            onClick={step === 6 ? handleComplete : nextStep}
            disabled={loading}
            className="bg-primary hover:bg-sky-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all text-sm flex items-center gap-2 shadow-md shadow-sky-100"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : step === 6 ? (
              'Complete Profile'
            ) : (
              <>
                Next Step <i className="fas fa-arrow-right"></i>
              </>
            )}
          </button>
        </div>
      </Card>
    </div>
  )
}
