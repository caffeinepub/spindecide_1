import {
  FOOD_RESPONSES,
  STUDY_CHILL_RESPONSES,
  WATCH_RESPONSES,
  YES_NO_RESPONSES,
  pickRandom,
} from "../utils/responses";

interface DecisionCard {
  id: string;
  label: string;
  emoji: string;
  description: string;
  pool: string[];
  gradient: string;
  borderColor: string;
  ocid: string;
}

const CARDS: DecisionCard[] = [
  {
    id: "yes-no",
    label: "Yes or No?",
    emoji: "🎲",
    description: "Can't decide? Let fate choose.",
    pool: YES_NO_RESPONSES,
    gradient: "linear-gradient(135deg, #F7D34A22, #F28B3C18)",
    borderColor: "#F7D34A44",
    ocid: "quick.yes_no.button",
  },
  {
    id: "food",
    label: "What to Eat?",
    emoji: "🍽️",
    description: "Your stomach is confused. We get it.",
    pool: FOOD_RESPONSES,
    gradient: "linear-gradient(135deg, #F28B3C22, #EF5A5A18)",
    borderColor: "#F28B3C44",
    ocid: "quick.food.button",
  },
  {
    id: "watch",
    label: "What to Watch?",
    emoji: "📺",
    description: "Scroll paralysis? We know the cure.",
    pool: WATCH_RESPONSES,
    gradient: "linear-gradient(135deg, #7B4DE622, #D44DA718)",
    borderColor: "#7B4DE644",
    ocid: "quick.watch.button",
  },
  {
    id: "study",
    label: "Study or Chill?",
    emoji: "📚",
    description: "The eternal dilemma.",
    pool: STUDY_CHILL_RESPONSES,
    gradient: "linear-gradient(135deg, #3B82F622, #2DD4BF18)",
    borderColor: "#3B82F644",
    ocid: "quick.study.button",
  },
];

interface QuickDecisionsProps {
  onResult: (result: string, category: string) => void;
}

export function QuickDecisions({ onResult }: QuickDecisionsProps) {
  return (
    <section
      className="w-full"
      aria-labelledby="quick-heading"
      data-ocid="quick.section"
    >
      <h2
        id="quick-heading"
        className="mb-6 text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
      >
        Quick Picks
      </h2>
      <p
        className="mb-8 text-center text-sm"
        style={{ color: "oklch(var(--muted-foreground))" }}
      >
        One tap. Instant answer. No overthinking.
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => (
          <div
            key={card.id}
            className="quick-card flex flex-col items-center gap-4 p-5 text-center"
            style={{
              background: card.gradient,
              borderColor: card.borderColor,
            }}
          >
            <div className="text-4xl" role="img" aria-label={card.label}>
              {card.emoji}
            </div>

            <div>
              <h3 className="text-base font-bold text-foreground sm:text-lg">
                {card.label}
              </h3>
              <p
                className="mt-1 text-xs"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                {card.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onResult(pickRandom(card.pool), card.label)}
              className="spin-btn mt-auto w-full py-2.5 text-sm"
              data-ocid={card.ocid}
            >
              Decide!
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
