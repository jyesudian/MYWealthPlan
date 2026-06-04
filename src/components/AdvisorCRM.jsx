'use client'

import { useState } from 'react'
import Card from './Card'

export default function AdvisorCRM() {
  const [syncing, setSyncing] = useState(false)
  const [synced, setSynced] = useState(false)

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => {
      setSyncing(false)
      setSynced(true)
      setTimeout(() => setSynced(false), 3000)
    }, 1500)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Advisor & CRM Portal</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your clients and synchronize with Salesforce/HubSpot.</p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
        >
          {syncing ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Syncing...
            </>
          ) : synced ? (
            <>
              <i className="fas fa-check text-green-400"></i>
              Synced
            </>
          ) : (
            <>
              <i className="fas fa-sync text-xs"></i>
              Sync CRM
            </>
          )}
        </button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 pl-6">Client Name</th>
                <th className="p-4">Health Score</th>
                <th className="p-4">Last Review</th>
                <th className="p-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4 pl-6 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-sm shadow-sky-100">
                    AR
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block">Ahmad Razali</span>
                    <span className="text-xs text-slate-400">ahmad.razali@domain.my</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-green-50 text-green-700 border border-green-100 px-2 py-1 rounded text-xs font-bold">
                    78 - Good
                  </span>
                </td>
                <td className="p-4 text-slate-500 text-xs">2 days ago</td>
                <td className="p-4 text-right pr-6">
                  <button className="text-primary hover:text-sky-700 font-semibold text-xs transition-colors">
                    View Plan
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4 pl-6 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold shadow-sm shadow-purple-100">
                    SL
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block">Sarah Lim</span>
                    <span className="text-xs text-slate-400">sarah.lim@domain.my</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-amber-50 text-amber-700 border border-amber-100 px-2 py-1 rounded text-xs font-bold">
                    45 - Fair
                  </span>
                </td>
                <td className="p-4 text-slate-500 text-xs">1 month ago</td>
                <td className="p-4 text-right pr-6">
                  <button className="text-primary hover:text-sky-700 font-semibold text-xs transition-colors">
                    View Plan
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
