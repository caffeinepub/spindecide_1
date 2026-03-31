import { Moon, Sun, Zap } from "lucide-react";

interface NavBarProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  dailyCount: number;
  onScrollTo: (id: string) => void;
}

export function NavBar({
  theme,
  onToggleTheme,
  dailyCount,
  onScrollTo,
}: NavBarProps) {
  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background: "oklch(var(--card) / 0.85)",
        borderBottom: "1px solid oklch(var(--card-border))",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <nav
        className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-foreground transition-opacity hover:opacity-80"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          data-ocid="nav.link"
        >
          <Zap size={20} className="text-primary" fill="currentColor" />
          <span>SpinDecide</span>
        </button>

        {/* Nav links */}
        <div className="hidden items-center gap-6 sm:flex">
          <button
            type="button"
            onClick={() => onScrollTo("wheel")}
            className="text-sm font-medium transition-colors hover:text-primary"
            style={{ color: "oklch(var(--muted-foreground))" }}
            data-ocid="nav.wheel.link"
          >
            Wheel
          </button>
          <button
            type="button"
            onClick={() => onScrollTo("quick")}
            className="text-sm font-medium transition-colors hover:text-primary"
            style={{ color: "oklch(var(--muted-foreground))" }}
            data-ocid="nav.quick.link"
          >
            Quick Picks
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Daily count badge */}
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{
              background: "oklch(var(--primary) / 0.15)",
              color: "oklch(var(--primary))",
              border: "1px solid oklch(var(--primary) / 0.25)",
            }}
            title="Decisions made today"
            data-ocid="nav.daily_count.card"
          >
            <Zap size={11} />
            <span>{dailyCount} today</span>
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
            style={{
              background: "oklch(var(--muted) / 0.5)",
              border: "1px solid oklch(var(--card-border))",
              color: "oklch(var(--foreground))",
            }}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            data-ocid="nav.toggle"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
