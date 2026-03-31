import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useRef, useState } from "react";
import { Confetti } from "./components/Confetti";
import { NavBar } from "./components/NavBar";
import { QuickDecisions } from "./components/QuickDecisions";
import { ResultCard } from "./components/ResultCard";
import { SpinWheel } from "./components/SpinWheel";
import { useDailyCount } from "./hooks/useDailyCount";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { DEFAULT_WHEEL_OPTIONS } from "./utils/responses";
import { playResultSound, playSpinSound } from "./utils/sounds";

export default function App() {
  // Theme
  const [theme, setTheme] = useLocalStorage<"dark" | "light">(
    "spinDecide_theme",
    "dark",
  );

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // Wheel options (persisted)
  const [savedOptions, setSavedOptions] = useLocalStorage<string>(
    "spinDecide_options",
    DEFAULT_WHEEL_OPTIONS.join(", "),
  );
  const [optionsInput, setOptionsInput] = useState(savedOptions);

  // Parse options from input
  const parsedOptions = optionsInput
    .split(",")
    .map((o) => o.trim())
    .filter((o) => o.length > 0);

  const wheelOptions =
    parsedOptions.length >= 2 ? parsedOptions : DEFAULT_WHEEL_OPTIONS;

  // Result state
  const [result, setResult] = useState<string | null>(null);
  const [resultCategory, setResultCategory] = useState("The wheel has spoken");
  const [confettiActive, setConfettiActive] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  // Daily count
  const { count: dailyCount, increment } = useDailyCount();

  // Section refs for scroll-to
  const wheelSectionRef = useRef<HTMLElement>(null);
  const quickSectionRef = useRef<HTMLElement>(null);
  const resultSectionRef = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback((id: string) => {
    const el =
      id === "wheel" ? wheelSectionRef.current : quickSectionRef.current;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleResult = useCallback(
    (res: string, category = "The wheel has spoken") => {
      setResult(res);
      setResultCategory(category);
      setIsSpinning(false);
      setConfettiActive(false);
      // Small delay so confetti re-initialises cleanly
      setTimeout(() => {
        setConfettiActive(true);
        playResultSound();
        increment();
      }, 50);
      setTimeout(() => setConfettiActive(false), 3600);

      // Scroll to result after animation begins
      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 200);
    },
    [increment],
  );

  const handleSpinStart = useCallback(() => {
    setIsSpinning(true);
    setResult(null);
    playSpinSound(4);
  }, []);

  const handleReset = () => {
    setResult(null);
    setConfettiActive(false);
  };

  const handleOptionsChange = (val: string) => {
    setOptionsInput(val);
    setSavedOptions(val);
  };

  // Trigger spin via the canvas element
  const triggerSpin = () => {
    const canvas = document.querySelector(
      "[data-ocid='wheel.canvas_target']",
    ) as HTMLCanvasElement | null;
    canvas?.click();
  };

  return (
    <div className="bg-app-gradient min-h-dvh">
      <Confetti active={confettiActive} />
      <Toaster richColors position="top-center" />

      <NavBar
        theme={theme}
        onToggleTheme={toggleTheme}
        dailyCount={dailyCount}
        onScrollTo={scrollTo}
      />

      <main className="mx-auto max-w-5xl px-5 pb-20 pt-10">
        {/* Hero / Wheel section */}
        <section
          ref={wheelSectionRef}
          id="wheel"
          className="mb-20 flex flex-col items-center gap-8"
          aria-labelledby="wheel-heading"
        >
          {/* Heading */}
          <div className="text-center">
            <h1
              id="wheel-heading"
              className="mb-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl"
            >
              Can&apos;t Decide?{" "}
              <span style={{ color: "oklch(var(--primary))" }}>Spin it.</span>
            </h1>
            <p
              className="text-base"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              The most scientific decision-making tool known to humankind.
            </p>
          </div>

          {/* Wheel */}
          <div className="pulse-glow-anim relative rounded-full">
            <SpinWheel
              options={wheelOptions}
              onResult={(res) => handleResult(res, "The wheel has spoken")}
              isSpinning={isSpinning}
              onSpinStart={handleSpinStart}
            />
          </div>

          {/* Spin CTA button */}
          <button
            type="button"
            onClick={triggerSpin}
            disabled={isSpinning}
            className="spin-btn px-10 py-3.5 text-base"
            data-ocid="wheel.primary_button"
          >
            {isSpinning ? "Spinning... 🔄" : "Spin the Wheel! 🎰"}
          </button>

          {/* Options input */}
          <div
            className="card-glass w-full max-w-lg rounded-2xl p-5"
            data-ocid="wheel.options.card"
          >
            <label
              htmlFor="options-input"
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              Customize options
            </label>
            <p
              className="mb-3 text-xs"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Enter comma-separated options (min 2)
            </p>
            <textarea
              id="options-input"
              value={optionsInput}
              onChange={(e) => handleOptionsChange(e.target.value)}
              rows={3}
              placeholder="Option A, Option B, Option C..."
              className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
              style={{
                background: "oklch(var(--input))",
                color: "oklch(var(--foreground))",
                border: "1px solid oklch(var(--card-border))",
              }}
              data-ocid="wheel.options.textarea"
            />
            <p
              className="mt-2 text-xs"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              {wheelOptions.length} option{wheelOptions.length !== 1 ? "s" : ""}{" "}
              on wheel
              {wheelOptions.length < 2 && " — add at least 2"}
            </p>
          </div>
        </section>

        {/* Result card */}
        {result && (
          <div
            ref={resultSectionRef}
            className="mb-16"
            data-ocid="result.section"
          >
            <ResultCard
              result={result}
              category={resultCategory}
              onReset={handleReset}
            />
          </div>
        )}

        {/* Quick decisions */}
        <section ref={quickSectionRef} id="quick">
          <QuickDecisions onResult={(res, cat) => handleResult(res, cat)} />
        </section>
      </main>

      {/* Footer */}
      <footer
        className="border-t py-6 text-center text-xs"
        style={{
          borderColor: "oklch(var(--card-border))",
          color: "oklch(var(--muted-foreground))",
        }}
      >
        <p>
          &copy; {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold transition-colors hover:text-primary"
            style={{ color: "oklch(var(--primary))" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
