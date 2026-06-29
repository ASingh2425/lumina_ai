interface HeaderProps {
  xp: number
  streak: number
  onHome: () => void
}

export function Header({ xp, streak, onHome }: HeaderProps) {
  const isAdmin = (() => {
    try {
      const raw = localStorage.getItem('user')
      return raw ? JSON.parse(raw).is_admin : false
    } catch {
      return false
    }
  })()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('lumina-progress')
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={onHome}
          className="flex items-center gap-2 text-left transition-opacity hover:opacity-80"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)] text-sm font-bold text-white">
            L
          </span>
          <span className="text-lg font-semibold tracking-tight">Lumina AI</span>
        </button>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-surface-raised)] px-3 py-1.5">
            <span className="text-[var(--color-warning)]">⚡</span>
            <span className="font-semibold tabular-nums">{xp}</span>
            <span className="text-[#8b93a7]">XP</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-surface-raised)] px-3 py-1.5">
            <span className="text-[var(--color-danger)]">🔥</span>
            <span className="font-semibold tabular-nums">{streak}</span>
            <span className="text-[#8b93a7]">day</span>
          </div>
          
          {isAdmin && (
            <button
              type="button"
              onClick={() => window.location.href = '/admin'}
              className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500 hover:text-black hover:border-transparent transition-all"
            >
              Admin Portal
            </button>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-[var(--color-border)] hover:border-[var(--color-danger)]/50 hover:bg-[var(--color-danger)]/5 px-3 py-1.5 text-xs font-medium text-[#8b93a7] hover:text-[var(--color-danger)] transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}
