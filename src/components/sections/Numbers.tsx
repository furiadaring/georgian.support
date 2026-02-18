import { type Locale, type Dictionary } from "@/lib/i18n";

interface NumbersProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Numbers({ locale, dict }: NumbersProps) {
  const t = dict.testimonials.stats;

  /* Figma: 4 cards, each 330×230, staggered vertically
     Section: 1920×480, cards start at x=390
     Card positions (y from section top): 80, 170, 100, 130
     Cards overlap horizontally: spacing = 270px between starts (330 wide, so 60px overlap)
     We translate these y-values into relative offsets from a baseline */
  const cards = [
    {
      value: "5000+",
      label: t.clients,
      bg: "#DE643B",
      valueColor: "#FAFAFA",
      labelColor: "#FAFAFA",
      offsetY: 0,       // y=80 (baseline)
    },
    {
      value: "4.9",
      label: t.rating,
      bg: "#F6F6CD",
      valueColor: "#2D1D38",
      labelColor: "#2D1D38",
      offsetY: 90,      // y=170 (170-80=90)
    },
    {
      value: t.processingTime || "15 мин",
      label: t.processing,
      bg: "#E6CFE3",
      valueColor: "#DE643B",
      labelColor: "#2D1D38",
      offsetY: 20,      // y=100 (100-80=20)
    },
    {
      value: "24/7",
      label: t.support,
      bg: "#2D1D38",
      valueColor: "#E6CFE3",
      labelColor: "#FAFAFA",
      offsetY: 50,      // y=130 (130-80=50)
    },
  ];

  return (
    <section className="w-full bg-[#FAFAFA] overflow-hidden" style={{ height: 480 }}>
      {/* Figma: cards start at x=390, each 330px wide with ~270px horizontal spacing (60px overlap)
          Using flex with negative margin to achieve the overlap on desktop */}
      <div
        className="mx-auto hidden lg:flex items-start justify-center"
        style={{ paddingTop: 80, paddingLeft: 390, paddingRight: 390 }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col items-start justify-between shrink-0"
            style={{
              width: 330,
              height: 230,
              padding: '20px 15px',
              backgroundColor: card.bg,
              marginTop: card.offsetY,
              marginLeft: index > 0 ? -60 : 0,
            }}
          >
            <p
              className="text-[55px] font-bold leading-[0.9] whitespace-nowrap"
              style={{ color: card.valueColor }}
            >
              {card.value}
            </p>
            <p
              className="text-[20px] font-bold leading-[1.3] whitespace-nowrap"
              style={{ color: card.labelColor }}
            >
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile layout: 2×2 grid */}
      <div
        className="lg:hidden grid grid-cols-2 mx-auto px-5"
        style={{ gap: 10, paddingTop: 40, paddingBottom: 40, maxWidth: 700 }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col items-start justify-between"
            style={{
              padding: '20px 15px',
              backgroundColor: card.bg,
              minHeight: 160,
            }}
          >
            <p
              className="text-[32px] sm:text-[40px] font-bold leading-[0.9] whitespace-nowrap"
              style={{ color: card.valueColor }}
            >
              {card.value}
            </p>
            <p
              className="text-[16px] sm:text-[18px] font-bold leading-[1.3]"
              style={{ color: card.labelColor }}
            >
              {card.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
