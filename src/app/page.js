'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

// Core sub-panels
import Dashboard from '@/components/Dashboard'
import DiscoveryWizard from '@/components/DiscoveryWizard'
import GoalPlanner from '@/components/GoalPlanner'
import InsurancePlanning from '@/components/InsurancePlanning'
import RetirementPlanner from '@/components/RetirementPlanner'
import EstatePlanning from '@/components/EstatePlanning'
import FinancialReport from '@/components/FinancialReport'
import AdvisorCRM from '@/components/AdvisorCRM'
import PremiumPlans from '@/components/PremiumPlans'

export default function AppFrame() {
  const router = useRouter()
  const supabase = createClient()

  // State Management
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [assets, setAssets] = useState([])
  const [liabilities, setLiabilities] = useState([])
  const [goals, setGoals] = useState([])
  const [insurancePolicies, setInsurancePolicies] = useState([])
  
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Fetch all user details
  const fetchAllData = async (userId) => {
    try {
      // 1. Profile
      const { data: profData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (profData) setProfile(profData)

      // 2. Assets & Liabilities
      const { data: assetsLiabsData } = await supabase
        .from('assets_liabilities')
        .select('*')
        .eq('profile_id', userId)
      
      if (assetsLiabsData) {
        setAssets(assetsLiabsData.filter(item => item.type === 'asset'))
        setLiabilities(assetsLiabsData.filter(item => item.type === 'liability'))
      }

      // 3. Goals
      const { data: goalsData } = await supabase
        .from('goals')
        .select('*')
        .eq('profile_id', userId)
        .order('created_at', { ascending: true })
      
      if (goalsData) setGoals(goalsData)

      // 4. Insurance
      const { data: insData } = await supabase
        .from('insurance_policies')
        .select('*')
        .eq('profile_id', userId)
      
      if (insData) setInsurancePolicies(insData)

    } catch (e) {
      console.error('Error fetching user data from Supabase:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { user: sessionUser } } = await supabase.auth.getUser()
      if (!sessionUser) {
        router.push('/login')
      } else {
        setUser(sessionUser)
        await fetchAllData(sessionUser.id)
      }
    }

    checkUserSession()
  }, [])

  // Write actions back to Supabase
  const handleSaveWizardData = async (updatedProfile, assetsList, liabilitiesList) => {
    if (!user) return
    setLoading(true)

    try {
      // 1. Update Profile
      const { error: profErr } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.id)

      if (profErr) throw profErr

      // 2. Delete existing assets and liabilities to overwrite
      await supabase
        .from('assets_liabilities')
        .delete()
        .eq('profile_id', user.id)

      // 3. Insert fresh list of assets & liabilities
      const formattedAssets = assetsList.map(a => ({ ...a, profile_id: user.id, type: 'asset' }))
      const formattedLiabs = liabilitiesList.map(l => ({ ...l, profile_id: user.id, type: 'liability' }))
      
      const { error: insertErr } = await supabase
        .from('assets_liabilities')
        .insert([...formattedAssets, ...formattedLiabs])

      if (insertErr) throw insertErr

      // Refetch database states
      await fetchAllData(user.id)
    } catch (e) {
      console.error('Error saving wizard metrics:', e)
      alert('Failed to save profile: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddGoal = async (newGoal) => {
    if (!user) return
    try {
      const { error } = await supabase
        .from('goals')
        .insert({ ...newGoal, profile_id: user.id })

      if (error) throw error
      await fetchAllData(user.id)
    } catch (e) {
      console.error('Error adding new goal:', e)
      alert('Failed to add goal: ' + e.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Sidebar Items
  const navItems = [
    { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
    { id: 'discovery', icon: 'fa-compass', label: 'Financial Discovery' },
    { id: 'goals', icon: 'fa-bullseye', label: 'Goal Planning' },
    { id: 'insurance', icon: 'fa-shield-alt', label: 'Insurance & Protection' },
    { id: 'retirement', icon: 'fa-umbrella-beach', label: 'Retirement Planning' },
    { id: 'estate', icon: 'fa-scroll', label: 'Estate & Legacy' },
    { id: 'report', icon: 'fa-file-invoice-dollar', label: 'Financial Report' },
    { id: 'advisor', icon: 'fa-users', label: 'Advisor & CRM' },
    { id: 'premium', icon: 'fa-crown', label: 'Premium Plans' },
  ]

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            profile={profile}
            assets={assets}
            liabilities={liabilities}
            setActiveTab={setActiveTab}
          />
        )
      case 'discovery':
        return (
          <DiscoveryWizard
            profile={profile}
            assets={assets}
            liabilities={liabilities}
            onSaveWizardData={handleSaveWizardData}
          />
        )
      case 'goals':
        return <GoalPlanner goals={goals} onAddGoal={handleAddGoal} />
      case 'insurance':
        return <InsurancePlanning insurancePolicies={insurancePolicies} />
      case 'retirement':
        return <RetirementPlanner profile={profile} assets={assets} />
      case 'estate':
        return <EstatePlanning />
      case 'report':
        return <FinancialReport profile={profile} assets={assets} liabilities={liabilities} />
      case 'advisor':
        return <AdvisorCRM />
      case 'premium':
        return <PremiumPlans />
      default:
        return <Dashboard profile={profile} assets={assets} liabilities={liabilities} setActiveTab={setActiveTab} />
    }
  }

  // Show a premium loading screen while connection is establishing
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium text-sm animate-pulse">Establishing secure connection...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar Navigation */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 transition duration-200 ease-in-out shadow-xl flex flex-col`}
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="font-bold text-xl flex items-center gap-2">
            <i className="fas fa-leaf text-secondary"></i>
            MY Wealth<span className="text-primary">Plan</span>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === item.id
                      ? 'bg-primary text-white shadow-md shadow-sky-900/50'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <i className={`fas ${item.icon} w-5 text-center ${activeTab === item.id ? 'text-white' : ''}`}></i>
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Profile / Logout Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-primary text-sm uppercase">
                {profile?.full_name ? profile.full_name.substring(0, 2) : 'AR'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate text-slate-200">
                  {profile?.full_name || 'Ahmad Razali'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">Free Plan</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-slate-400 hover:text-rose-400 p-1.5 transition-colors"
            >
              <i className="fas fa-sign-out-alt text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8 shadow-sm relative z-10">
          <button className="lg:hidden text-slate-600 hover:text-slate-900" onClick={() => setMobileMenuOpen(true)}>
            <i className="fas fa-bars text-xl"></i>
          </button>
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <i className="fas fa-lock text-[10px] text-emerald-500"></i> Bank-Grade AES 256 Security
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-primary transition-colors relative">
              <i className="fas fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="text-slate-400 hover:text-primary transition-colors">
              <i className="fas fa-cog text-lg"></i>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto pb-12">
            {renderActiveTab()}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}
    </div>
  )
}
