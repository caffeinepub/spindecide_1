import { Copy, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface ResultCardProps {
  result: string | null;
  category: string;
  onReset: () => void;
}

function getEmoji(result: string): string {
  const lower = result.toLowerCase();
  if (
    lower.includes("pizza") ||
    lower.includes("food") ||
    lower.includes("eat")
  )
    return "🍕";
  if (lower.includes("yes")) return "✅";
  if (lower.includes("no")) return "❌";
  if (lower.includes("study")) return "📚";
  if (lower.includes("chill")) return "🛋️";
  if (
    lower.includes("movie") ||
    lower.includes("watch") ||
    lower.includes("netflix")
  )
    return "🎬";
  if (lower.includes("ramen") || lower.includes("noodle")) return "🍜";
  if (lower.includes("taco")) return "🌮";
  if (lower.includes("burger")) return "🍔";
  if (lower.includes("sushi")) return "🍣";
  if (lower.includes("anime")) return "🗡️";
  return "🎯";
}

export function ResultCard({ result, category, onReset }: ResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [result]);

  if (!result) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast.success("📋 Copied to clipboard!");
    } catch {
      toast.error("Couldn't copy 😅");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "SpinDecide says...",
      text: `SpinDecide helped me choose: ${result} 🎯`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled — no action needed
      }
    } else {
      await handleCopy();
    }
  };

  const emoji = getEmoji(result);

  return (
    <div
      ref={cardRef}
      className="result-card-enter mx-auto w-full max-w-lg"
      data-ocid="result.card"
    >
      <div
        className="relative overflow-hidden rounded-2xl p-7 text-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.80 0.09 183), oklch(0.72 0.12 189))",
          boxShadow:
            "0 20px 60px oklch(0.70 0.11 189 / 0.3), 0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        {/* Decorative bg circles */}
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full"
          style={{ background: "rgba(255,255,255,0.1)" }}
          role="presentation"
        />
        <div
          className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full"
          style={{ background: "rgba(255,255,255,0.08)" }}
          role="presentation"
        />

        <div className="relative">
          {/* Category label */}
          <p
            className="mb-3 text-sm font-semibold uppercase tracking-widest"
            style={{ color: "rgba(20,30,50,0.65)" }}
          >
            {category}
          </p>

          {/* Emoji */}
          <div className="mb-3 text-5xl" role="img" aria-label={result}>
            {emoji}
          </div>

          {/* Result text */}
          <p
            className="mb-6 text-xl font-bold leading-snug sm:text-2xl"
            style={{ color: "#0d1a26" }}
          >
            {result}
          </p>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
              style={{
                background: "rgba(0,0,0,0.15)",
                color: "#0d1a26",
                backdropFilter: "blur(8px)",
              }}
              data-ocid="result.secondary_button"
            >
              <Copy size={15} />
              Copy
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
              style={{
                background: "rgba(0,0,0,0.15)",
                color: "#0d1a26",
                backdropFilter: "blur(8px)",
              }}
              data-ocid="result.primary_button"
            >
              <Share2 size={15} />
              Share
            </button>

            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "#0d1a26",
              }}
              data-ocid="result.close_button"
            >
              <RotateCcw size={15} />
              Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
