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

export function AdminPortal() {
  const [users, setUsers] = useState<AdminUserRow[]>([])
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
      fetchUsers() // reload
    } catch (err: any) {
      alert(err.message)
    }
  }

  useEffect(() => {
    fetchUsers()
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
            <p className="text-xs text-[#8b93a7] mt-1">Manage user verification records and curriculum progress profiles.</p>
          </div>
          <button
            type="button"
            onClick={() => window.location.href = '/'}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-2 text-xs font-semibold hover:bg-[var(--color-surface-overlay)] transition-colors"
          >
            ← Back to App
          </button>
        </div>

        {error ? (
          <div className="rounded-2xl border border-[var(--color-danger)] bg-[var(--color-danger)]/5 p-6 text-sm text-center text-[#f87171]">
            🔒 {error}
          </div>
        ) : loading ? (
          <div className="text-center text-xs text-[#8b93a7] py-20 font-semibold tracking-widest uppercase">
            Loading Admin Database records...
          </div>
        ) : (
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
                            className="rounded-lg bg-amber-500/15 border border-amber-500/20 hover:bg-amber-500 hover:text-black hover:border-transparent px-3 py-1 text-[10px] font-bold text-amber-300 transition-all"
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
        )}

      </div>
    </div>
  )
}
