import { useCallback, useEffect, useRef, useState } from "react";

// Wheel segment colors
const SEGMENT_COLORS = [
  "#F7D34A", // yellow
  "#F28B3C", // orange
  "#EF5A5A", // coral
  "#D44DA7", // pink
  "#7B4DE6", // purple
  "#3B82F6", // blue
  "#2DD4BF", // teal
  "#34D399", // green
];

const TEXT_COLORS: Record<string, string> = {
  "#F7D34A": "#1a1a2e",
  "#F28B3C": "#1a1a2e",
  "#EF5A5A": "#fff",
  "#D44DA7": "#fff",
  "#7B4DE6": "#fff",
  "#3B82F6": "#fff",
  "#2DD4BF": "#1a1a2e",
  "#34D399": "#1a1a2e",
};

interface SpinWheelProps {
  options: string[];
  onResult: (result: string) => void;
  isSpinning: boolean;
  onSpinStart: () => void;
}

export function SpinWheel({
  options,
  onResult,
  isSpinning,
  onSpinStart,
}: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const canSpinRef = useRef<boolean>(true);
  const [size, setSize] = useState(320);

  // Responsive size
  useEffect(() => {
    const update = () => {
      setSize(
        window.innerWidth >= 640 ? 400 : Math.min(320, window.innerWidth - 48),
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const drawWheel = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      angle: number,
      opts: string[],
      highlightIdx: number | null = null,
    ) => {
      const canvas = ctx.canvas;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = cx - 14;
      const n = opts.length;
      const segAngle = (2 * Math.PI) / n;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Outer glow ring
      const gradient = ctx.createRadialGradient(cx, cy, r - 2, cx, cy, r + 12);
      gradient.addColorStop(0, "rgba(47, 182, 176, 0.5)");
      gradient.addColorStop(1, "rgba(47, 182, 176, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      for (let i = 0; i < n; i++) {
        const startA = -Math.PI / 2 + i * segAngle;
        const endA = startA + segAngle;
        const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];

        // Segment fill
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, r, startA, endA);
        ctx.closePath();
        ctx.fillStyle = highlightIdx === i ? "#fff" : color;
        ctx.fill();

        // Segment border
        ctx.strokeStyle = "rgba(0,0,0,0.25)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Text
        ctx.save();
        ctx.rotate(startA + segAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle =
          highlightIdx === i ? "#1a1a2e" : TEXT_COLORS[color] || "#fff";
        const maxLen = r - 28;
        const fontSize = n > 8 ? 11 : n > 6 ? 12 : 13;
        ctx.font = `600 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
        // Truncate text
        let label = opts[i];
        while (ctx.measureText(label).width > maxLen && label.length > 1) {
          label = label.slice(0, -1);
        }
        if (label !== opts[i]) label = `${label.slice(0, -1)}\u2026`;
        ctx.fillText(label, r - 14, 4);
        ctx.restore();
      }

      ctx.restore();

      // Outer border ring
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(47,182,176,0.6)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Center hub
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      const hubGrad = ctx.createRadialGradient(cx - 4, cy - 4, 4, cx, cy, 38);
      hubGrad.addColorStop(0, "#2a3a50");
      hubGrad.addColorStop(1, "#151e30");
      ctx.fillStyle = hubGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(47,182,176,0.7)";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Hub text
      ctx.fillStyle = "#2FB6B0";
      ctx.font = '700 9px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = "center";
      ctx.fillText("TAP TO", cx, cy - 3);
      ctx.fillText("SPIN", cx, cy + 9);
    },
    [],
  );

  // Redraw when options or size changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: size triggers canvas resize via React, drawWheel is stable
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawWheel(
      ctx,
      angleRef.current,
      options.length > 0 ? options : ["Add", "Options", "Below"],
    );
  }, [options, drawWheel, size]);

  const spin = useCallback(() => {
    if (!canSpinRef.current || isSpinning) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const opts =
      options.length >= 2 ? options : ["Option A", "Option B", "Option C"];
    canSpinRef.current = false;
    onSpinStart();

    const startAngle = angleRef.current;
    // At least 5 full rotations + random offset for variety
    const extraSpins = 5 + Math.random() * 3;
    const randomOffset = Math.random() * 2 * Math.PI;
    const totalRotation = 2 * Math.PI * extraSpins + randomOffset;
    const targetAngle = startAngle + totalRotation;

    const duration = 4000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Ease-out cubic: 1 - (1-t)^3
      const eased = 1 - (1 - t) ** 3;
      const currentAngle = startAngle + eased * totalRotation;
      angleRef.current = currentAngle;

      drawWheel(ctx, currentAngle, opts);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        angleRef.current = targetAngle;

        // Determine winner: pointer at top (-π/2) is fixed
        // In wheel local coords, pointer = -targetAngle (since segment 0 starts at -π/2)
        const n = opts.length;
        const segAngle = (2 * Math.PI) / n;
        const pointerInWheel =
          ((-targetAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const winnerIdx = Math.floor(pointerInWheel / segAngle) % n;

        drawWheel(ctx, targetAngle, opts, winnerIdx);
        canSpinRef.current = true;
        onResult(opts[winnerIdx]);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [isSpinning, options, drawWheel, onResult, onSpinStart]);

  // Keyboard support
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        spin();
      }
    },
    [spin],
  );

  // Cleanup animation on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      {/* Pointer triangle at top */}
      <div
        className="absolute z-10"
        style={{
          top: 4,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderTop: "22px solid #2FB6B0",
          filter: "drop-shadow(0 2px 6px rgba(47,182,176,0.6))",
        }}
        role="presentation"
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="cursor-pointer select-none rounded-full"
        style={{
          filter: isSpinning ? "brightness(1.05)" : undefined,
          transition: "filter 0.3s ease",
          outline: "none",
        }}
        onClick={spin}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Spin the wheel"
        data-ocid="wheel.canvas_target"
      />
    </div>
  );
}
