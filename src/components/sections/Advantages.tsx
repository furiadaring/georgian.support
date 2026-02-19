"use client";

import { type Locale, type Dictionary } from "@/lib/i18n";

interface AdvantagesProps {
  locale: Locale;
  dict: Dictionary;
}

// Advantage Card Component - matches Figma node 119:19002
function AdvantageCard({
  title,
  description,
  value,
  bgColor,
  textColor,
  valueColor,
}: {
  title: string;
  description: string;
  value: string;
  bgColor: string;
  textColor: string;
  valueColor: string;
}) {
  return (
    <div
      className={`${bgColor} flex flex-col items-end`}
      style={{ gap: 55, padding: '25px 30px' }}
    >
      <div className="flex flex-col items-start w-full" style={{ gap: 50 }}>
        <p className={`font-semibold w-full ${textColor}`} style={{ fontSize: 26, lineHeight: 1.3 }}>
          {title}
        </p>
        <p className={`font-medium w-full ${textColor}`} style={{ fontSize: 16, lineHeight: 1.3 }}>
          {description}
        </p>
      </div>
      <p className={`font-bold text-right w-full ${valueColor}`} style={{ fontSize: 55, lineHeight: 0.9 }}>
        {value}
      </p>
    </div>
  );
}

// Mobile Advantage Card
function AdvantageCardMobile({
  title,
  description,
  value,
  bgColor,
  textColor,
  valueColor,
}: {
  title: string;
  description: string;
  value: string;
  bgColor: string;
  textColor: string;
  valueColor: string;
}) {
  return (
    <div
      className={`${bgColor} flex flex-col items-end`}
      style={{ gap: 30, padding: '20px 25px' }}
    >
      <div className="flex flex-col items-start w-full" style={{ gap: 20 }}>
        <p className={`font-semibold w-full ${textColor}`} style={{ fontSize: 20, lineHeight: 1.3 }}>
          {title}
        </p>
        <p className={`font-medium w-full ${textColor}`} style={{ fontSize: 14, lineHeight: 1.3 }}>
          {description}
        </p>
      </div>
      <p className={`font-bold text-right w-full ${valueColor}`} style={{ fontSize: 40, lineHeight: 0.9 }}>
        {value}
      </p>
    </div>
  );
}

// Stat Card Component - matches Figma node 123:19029
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="border border-[#ABA2A5] flex flex-col items-end justify-end"
      style={{ height: 180, padding: 20 }}
    >
      <div className="flex flex-col items-end text-[#2D1D38]" style={{ gap: 10 }}>
        <span className="font-bold" style={{ fontSize: 55, lineHeight: 0.9 }}>{value}</span>
        <span className="font-medium" style={{ fontSize: 16, lineHeight: 1.3 }}>{label}</span>
      </div>
    </div>
  );
}

// Mobile Stat Card
function StatCardMobile({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="border border-[#ABA2A5] flex flex-col items-center justify-center"
      style={{ height: 100, padding: 20 }}
    >
      <div className="flex flex-col items-center text-[#2D1D38]" style={{ gap: 6 }}>
        <span className="font-bold" style={{ fontSize: 36, lineHeight: 0.9 }}>{value}</span>
        <span className="font-medium" style={{ fontSize: 14, lineHeight: 1.3 }}>{label}</span>
      </div>
    </div>
  );
}

export default function Advantages({ locale, dict }: AdvantagesProps) {
  const t = dict.advantages;
  const items = t.items;

  const cardConfigs = [
    { bgColor: "bg-[#DE643B]", textColor: "text-[#FAFAFA]", valueColor: "text-[#FAFAFA]", value: "15 мин" },
    { bgColor: "bg-[#2D1D38]", textColor: "text-[#FAFAFA]", valueColor: "text-[#FAFAFA]", value: "$50K" },
    { bgColor: "bg-[#F6F6CD]", textColor: "text-[#2D1D38]", valueColor: "text-[#DE643B]", value: "24/7" },
    { bgColor: "bg-[#E6CFE3]", textColor: "text-[#2D1D38]", valueColor: "text-[#DE643B]", value: "98%" },
  ];

  const stats = [
    { value: "5000+", label: t.stats?.clients || "clients" },
    { value: "3+", label: t.stats?.experience || "years of experience" },
    { value: "7", label: t.stats?.languages || "languages" },
  ];

  return (
    <section id="advantages" aria-labelledby="advantages-heading" className="relative bg-[#FAFAFA] w-full">
      {/* ===== DESKTOP ===== */}
      <div
        className="hidden lg:flex flex-col max-w-[1920px] mx-auto px-10 xl:px-20 2xl:px-[310px] py-20"
        style={{ gap: 40 }}
      >
        {/* Header */}
        <div className="flex items-end justify-between w-full">
          <div className="flex flex-col flex-1 min-w-0" style={{ gap: 20 }}>
            <span className="font-medium text-[#ABA2A5]" style={{ fontSize: 18, lineHeight: 1.3 }}>
              {t.label}
            </span>
            <h2
              id="advantages-heading"
              className="font-bold text-[#2D1D38] text-4xl xl:text-5xl 2xl:text-[55px]"
              style={{ lineHeight: 0.9 }}
            >
              {t.title} {t.titleHighlight}
            </h2>
          </div>
          <p
            className="font-medium text-[#776667] text-right shrink-0"
            style={{ fontSize: 16, lineHeight: 1.3, maxWidth: 336 }}
          >
            {t.description}
          </p>
        </div>

        {/* Content */}
        <div className="flex" style={{ gap: 20 }}>
          {/* Left - 2x2 Cards Grid */}
          <div className="flex-1 min-w-0 grid grid-cols-2" style={{ gap: 20 }}>
            {items.slice(0, 4).map((item, idx) => (
              <AdvantageCard
                key={idx}
                title={item.title}
                description={item.description}
                value={cardConfigs[idx].value}
                bgColor={cardConfigs[idx].bgColor}
                textColor={cardConfigs[idx].textColor}
                valueColor={cardConfigs[idx].valueColor}
              />
            ))}
          </div>

          {/* Right - 3 Stat Boxes */}
          <div className="flex flex-col shrink-0 w-52 xl:w-64 2xl:w-[310px]" style={{ gap: 20 }}>
            {stats.map((stat, idx) => (
              <StatCard key={idx} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </div>

      {/* ===== MOBILE ===== */}
      <div
        className="flex lg:hidden flex-col"
        style={{ padding: '40px 20px', gap: 30 }}
      >
        {/* Header */}
        <div className="flex flex-col" style={{ gap: 15 }}>
          <span className="font-medium text-[#ABA2A5]" style={{ fontSize: 16, lineHeight: 1.3 }}>
            {t.label}
          </span>
          <h2
            className="font-bold text-[#2D1D38]"
            style={{ fontSize: 32, lineHeight: 0.9 }}
          >
            {t.title} {t.titleHighlight}
          </h2>
          <p
            className="font-medium text-[#776667]"
            style={{ fontSize: 14, lineHeight: 1.3 }}
          >
            {t.description}
          </p>
        </div>

        {/* Cards stacked */}
        <div className="flex flex-col" style={{ gap: 10 }}>
          {items.slice(0, 4).map((item, idx) => (
            <AdvantageCardMobile
              key={idx}
              title={item.title}
              description={item.description}
              value={cardConfigs[idx].value}
              bgColor={cardConfigs[idx].bgColor}
              textColor={cardConfigs[idx].textColor}
              valueColor={cardConfigs[idx].valueColor}
            />
          ))}
        </div>

        {/* Stat Boxes stacked */}
        <div className="flex flex-col" style={{ gap: 10 }}>
          {stats.map((stat, idx) => (
            <StatCardMobile key={idx} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
