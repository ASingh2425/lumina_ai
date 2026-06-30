import { useState, useEffect } from 'react'
import { API_URL } from '../config'

interface AdminUserRow {
  id: number
  name: string
  username: string
  email: string
  is_verified: boolean
  is_admin: boolean
  xp: number
}

interface PaymentRequestRow {
  id: number
  user_id: number
  username: string
  utr_number: string
  amount: number
  status: string
}

export function AdminPortal() {
  const [users, setUsers] = useState<AdminUserRow[]>([])
  const [payments, setPayments] = useState<PaymentRequestRow[]>([])
  const [activeTab, setActiveTab] = useState<'users' | 'payments'>('users')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    const token = localStorage.getItem('token')

    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) {
        if (res.status === 403) throw new Error("Forbidden: You must be an administrator to access this page.")
        throw new Error("Failed to load users dashboard.")
      }

      const data = await res.json()
      setUsers(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchPayments = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API_URL}/api/admin/payments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error("Failed to load payment requests.")
      const data = await res.json()
      setPayments(data)
    } catch (err: any) {
      console.error(err.message)
    }
  }

  const promoteUser = async (userId: number) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API_URL}/api/admin/promote/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error("Could not promote user.")
      fetchUsers()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const approvePayment = async (id: number) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API_URL}/api/admin/payments/${id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error("Failed to approve payment verification request.")
      fetchPayments()
      fetchUsers()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const rejectPayment = async (id: number) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API_URL}/api/admin/payments/${id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error("Failed to reject payment verification request.")
      fetchPayments()
    } catch (err: any) {
      alert(err.message)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchPayments()
  }, [])

  return (
    <div className="min-h-screen bg-[#070b12] text-white p-6 select-none font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <span>🛡️</span> Administrative Access Portal
            </h1>
            <p className="text-xs text-[#8b93a7] mt-1">Manage user verification records, payments queue, and curriculum profiles.</p>
          </div>
          <button
            type="button"
            onClick={() => window.location.href = '/'}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-2 text-xs font-semibold hover:bg-[var(--color-surface-overlay)] transition-colors cursor-pointer"
          >
            ← Back to App
          </button>
        </div>

        {/* Tab Selection Navigation bar */}
        {!error && !loading && (
          <div className="flex gap-4 border-b border-[var(--color-border)]/40 pb-1">
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-2 text-sm font-bold border-b-2 px-2 transition-all cursor-pointer ${
                activeTab === 'users' ? 'border-amber-500 text-white' : 'border-transparent text-[#8b93a7] hover:text-white'
              }`}
            >
              👥 User Management ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`pb-2 text-sm font-bold border-b-2 px-2 transition-all cursor-pointer relative ${
                activeTab === 'payments' ? 'border-amber-500 text-white' : 'border-transparent text-[#8b93a7] hover:text-white'
              }`}
            >
              💰 Pending UPI Payments
              {payments.filter(p => p.status === 'pending').length > 0 && (
                <span className="ml-2 bg-amber-500 text-black text-[9px] px-1.5 py-0.5 rounded-full font-black">
                  {payments.filter(p => p.status === 'pending').length}
                </span>
              )}
            </button>
          </div>
        )}

        {error ? (
          <div className="rounded-2xl border border-[var(--color-danger)] bg-[var(--color-danger)]/5 p-6 text-sm text-center text-[#f87171]">
            🔒 {error}
          </div>
        ) : loading ? (
          <div className="text-center text-xs text-[#8b93a7] py-20 font-semibold tracking-widest uppercase">
            Loading Admin Database records...
          </div>
        ) : activeTab === 'users' ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]/20 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[var(--color-surface-raised)] border-b border-[var(--color-border)] text-[#8b93a7] uppercase tracking-wider font-bold">
                    <th className="p-4">User ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Username</th>
                    <th className="p-4">Email</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Role</th>
                    <th className="p-4 text-center">Curriculum XP</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]/40 font-medium">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[var(--color-surface-overlay)]/40 transition-colors">
                      <td className="p-4 font-mono text-[#8b93a7]">#{u.id}</td>
                      <td className="p-4 text-white font-bold">{u.name}</td>
                      <td className="p-4 font-mono text-[#c4cad8]">{u.username}</td>
                      <td className="p-4 text-[#8b93a7]">{u.email}</td>
                      <td className="p-4 text-center">
                        <span className={`rounded-lg px-2.5 py-0.5 text-[10px] font-bold border ${
                          u.is_verified
                            ? 'bg-[var(--color-success)]/10 border-[var(--color-success)]/20 text-emerald-400'
                            : 'bg-[var(--color-danger)]/10 border-[var(--color-danger)]/20 text-red-400'
                        }`}>
                          {u.is_verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`rounded-lg px-2.5 py-0.5 text-[10px] font-bold ${
                          u.is_admin ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20' : 'bg-transparent text-[#8b93a7]'
                        }`}>
                          {u.is_admin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="p-4 text-center font-mono font-bold text-indigo-400">{u.xp} XP</td>
                      <td className="p-4 text-right">
                        {!u.is_admin ? (
                          <button
                            type="button"
                            onClick={() => promoteUser(u.id)}
                            className="rounded-lg bg-amber-500/15 border border-amber-500/20 hover:bg-amber-500 hover:text-black hover:border-transparent px-3 py-1 text-[10px] font-bold text-amber-300 transition-all cursor-pointer"
                          >
                            Make Admin
                          </button>
                        ) : (
                          <span className="text-[10px] text-[#8b93a7] italic">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]/20 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[var(--color-surface-raised)] border-b border-[var(--color-border)] text-[#8b93a7] uppercase tracking-wider font-bold">
                    <th className="p-4">Req ID</th>
                    <th className="p-4">Username</th>
                    <th className="p-4">UTR Ref Number</th>
                    <th className="p-4 text-center">Amount</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]/40 font-medium">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-[#8b93a7] italic">
                        No UPI/Razorpay payment requests found in database logs.
                      </td>
                    </tr>
                  ) : (
                    payments.map((p) => (
                      <tr key={p.id} className="hover:bg-[var(--color-surface-overlay)]/40 transition-colors">
                        <td className="p-4 font-mono text-[#8b93a7]">#{p.id}</td>
                        <td className="p-4 font-bold text-white">{p.username}</td>
                        <td className="p-4 font-mono text-emerald-400 select-all bg-[#0a0c10] px-2 py-1 rounded inline-block my-2">
                          {p.utr_number}
                        </td>
                        <td className="p-4 text-center font-mono text-indigo-400 font-bold">₹{p.amount}</td>
                        <td className="p-4 text-center">
                          <span className={`rounded-lg px-2.5 py-0.5 text-[10px] font-bold border ${
                            p.status === 'approved'
                              ? 'bg-[var(--color-success)]/10 border-[var(--color-success)]/20 text-emerald-400'
                              : p.status === 'rejected'
                              ? 'bg-[var(--color-danger)]/10 border-[var(--color-danger)]/20 text-red-400'
                              : 'bg-amber-400/10 border-amber-400/20 text-amber-300'
                          }`}>
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {p.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => approvePayment(p.id)}
                                className="rounded-lg bg-emerald-500/15 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black px-2.5 py-1 text-[10px] font-bold text-emerald-300 transition-all cursor-pointer"
                              >
                                Approve ✅
                              </button>
                              <button
                                onClick={() => rejectPayment(p.id)}
                                className="rounded-lg bg-red-500/15 border border-red-500/20 hover:bg-red-500 hover:text-white px-2.5 py-1 text-[10px] font-bold text-red-300 transition-all cursor-pointer"
                              >
                                Reject ❌
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-[#8b93a7] italic">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


