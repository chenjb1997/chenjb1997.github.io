import { useTranslation } from "react-i18next";

type TimedEntry = {
  body: string;
  time: string;
};

type AwardEntry = {
  award: string;
  body: string;
  time: string;
};

const CompetitiveProgramming = () => {
  const { t } = useTranslation();

  const linkedText = ({
    text,
    tkey,
    href,
  }: {
    text: string;
    tkey: string;
    href: string;
  }) => {
    const content = t(tkey);
    const index = content.indexOf(text);
    if (index < 0) return content;

    return (
      <>
        {content.slice(0, index)}
        <a href={href} className="text-blue-600 hover:text-amber-600">
          {text}
        </a>
        {content.slice(index + text.length)}
      </>
    );
  };

  const splitParts = (text: string) =>
    text.split(/,\s*|，/).map((part) => part.trim());

  const parseTimedEntry = (text: string): TimedEntry => {
    const parts = splitParts(text);
    if (parts.length < 2) return { body: text, time: "" };
    return {
      body: parts.slice(0, -1).join(", "),
      time: parts[parts.length - 1],
    };
  };

  const parseAwardEntry = (text: string): AwardEntry => {
    const parts = splitParts(text);
    if (parts.length < 3) return { award: "", body: text, time: "" };
    return {
      award: parts[0],
      body: parts.slice(1, -1).join(", "),
      time: parts[parts.length - 1],
    };
  };

  const awardGroupLabel = (entry: AwardEntry) => {
    if (/World Finals|世界总决赛/.test(entry.body)) {
      return t("award-group-world-finals");
    }
    if (/Champion|冠军/.test(entry.award)) return t("award-group-champion");
    if (/3rd|季军/.test(entry.award)) return t("award-group-third");
    if (/Gold|金牌/.test(entry.award)) return t("award-group-gold");
    if (/Bronze|铜牌/.test(entry.award)) return t("award-group-bronze");
    return t("award-group-other");
  };

  const coachingItems = [1, 2, 3, 4, 6].map((key) => t(`Coaching-${key}`));
  const awardItems = Array.from({ length: 17 }, (_, index) =>
    parseAwardEntry(t(`Awards-${index + 1}`))
  );
  const problemSettingKeys = [
    27, 1, 2, 3, 4, 5, 6, 28, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24, 25, 26,
  ];
  const problemSettingItems = problemSettingKeys.map((key) =>
    parseTimedEntry(t(`ProblemSettingJudging-${key}`))
  );

  const groupedProblemSettingItems = problemSettingItems.reduce(
    (groups, item) => {
      if (item.time.includes("-")) return groups;
      const year = item.time || "Other";
      if (!groups[year]) groups[year] = [];
      groups[year].push(item.body);
      return groups;
    },
    {} as Record<string, string[]>
  );
  const recurringProblemSettingItems = problemSettingItems.filter((item) =>
    item.time.includes("-")
  );
  const problemSettingYears = Object.keys(groupedProblemSettingItems).sort(
    (a, b) => Number.parseInt(b, 10) - Number.parseInt(a, 10)
  );

  const groupedAwardItems = awardItems.reduce((groups, item) => {
    const group = awardGroupLabel(item);
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, AwardEntry[]>);
  const awardGroups = [
    t("award-group-champion"),
    t("award-group-third"),
    t("award-group-world-finals"),
    t("award-group-gold"),
    t("award-group-bronze"),
  ].filter((group) => groupedAwardItems[group]?.length);

  const codeforcesText = t("programming-third-paragraph");
  const codeforcesTitle = "International Grandmaster";
  const codeforcesIndex = codeforcesText.indexOf(codeforcesTitle);

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: JSX.Element;
  }) => (
    <section className="bg-white px-3 py-2 shadow-sm">
      <h2 className="mb-2 border-b border-gray-200 pb-1 text-[24px] font-bold leading-snug text-gray-900">
        {title}
      </h2>
      {children}
    </section>
  );

  const TimedList = ({ items }: { items: string[] }) => (
    <ul className="space-y-1 text-[13px] leading-snug text-gray-800">
      {items.map((item, index) => {
        const parsed = parseTimedEntry(item);
        return (
          <li
            key={index}
            className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-l-[3px] border-sky-300 bg-sky-50/40 px-2 py-1.5"
          >
            <span className="min-w-0">{parsed.body}</span>
            <span className="shrink-0 text-[12px] font-medium text-sky-700">
              {parsed.time}
            </span>
          </li>
        );
      })}
    </ul>
  );

  const AwardList = () => (
    <div className="space-y-2">
      {awardGroups.map((group) => (
        <div
          key={group}
          className="grid gap-1 border-t border-gray-100 pt-2 first:border-t-0 first:pt-0 md:grid-cols-[112px_1fr] md:gap-3"
        >
          <div
            className={`text-[13px] font-semibold leading-snug ${
              /Gold|金牌|Champion|冠军/.test(group)
                ? "text-amber-700"
                : "text-slate-700"
            }`}
          >
            {group}
          </div>
          <ul className="space-y-1 text-[13px] leading-snug text-gray-800">
            {groupedAwardItems[group].map((item) => (
              <li
                key={`${item.award}-${item.body}-${item.time}`}
                className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-l-[2px] border-gray-200 bg-gray-50/60 px-2 py-1"
              >
                <span className="min-w-0">
                  {group === t("award-group-world-finals")
                    ? `${item.award}, ${item.body}`
                    : item.body}
                </span>
                <span className="shrink-0 text-[12px] font-medium text-gray-500">
                  {item.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const YearGroupedList = ({
    years,
    groups,
  }: {
    years: string[];
    groups: Record<string, string[]>;
  }) => (
    <div className="space-y-2">
      {years.map((year) => (
        <div key={year} className="grid gap-1 md:grid-cols-[64px_1fr] md:gap-3">
          <div className="text-[13px] font-semibold leading-snug text-indigo-700">
            {year}
          </div>
          <ul className="space-y-1 text-[13px] leading-snug text-gray-800">
            {groups[year].map((item) => (
              <li
                key={item}
                className="border-l-[2px] border-indigo-200 bg-indigo-50/40 px-2 py-1"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const RecurringList = ({ items }: { items: TimedEntry[] }) => (
    <div className="grid gap-1 border-t border-gray-100 pt-2 md:grid-cols-[64px_1fr] md:gap-3">
      <div className="text-[13px] font-semibold leading-snug text-slate-700">
        {t("Others")}
      </div>
      <ul className="space-y-1 text-[13px] leading-snug text-gray-800">
        {items.map((item) => (
          <li
            key={`${item.body}-${item.time}`}
            className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-l-[2px] border-slate-200 bg-slate-50/60 px-2 py-1"
          >
            <span className="min-w-0">{item.body}</span>
            <span className="shrink-0 text-[12px] font-medium text-gray-500">
              {item.time}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  const LinkList = ({ items }: { items: JSX.Element[] }) => (
    <ul className="space-y-1 text-[13px] leading-snug text-gray-800">
      {items.map((item, index) => (
        <li
          key={index}
          className="border-l-[2px] border-gray-200 bg-gray-50/60 px-2 py-1"
        >
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="mx-auto max-w-4xl">
      <div className="px-3">
        <h1 className="mb-5 text-3xl font-bold">
          {t("Competitive-Programming")}
        </h1>
      </div>

      <div className="space-y-4">
        <section className="px-3">
          <div className="space-y-3 text-[15px] leading-relaxed text-gray-900">
            <p>{t("programming-first-paragraph")}</p>
            <p>{t("programming-second-paragraph")}</p>
            <p>
              {codeforcesIndex >= 0 ? (
                <>
                  {codeforcesText.slice(0, codeforcesIndex)}
                  <a
                    href="https://codeforces.com/profile/chenjb"
                    style={{ color: "#dc2626", fontWeight: 700 }}
                  >
                    {codeforcesTitle}
                  </a>
                  {codeforcesText.slice(codeforcesIndex + codeforcesTitle.length)}
                </>
              ) : (
                linkedText({
                  text: "Codeforces",
                  tkey: "programming-third-paragraph",
                  href: "https://codeforces.com/profile/chenjb",
                })
              )}
            </p>
            <p>
              {linkedText({
                text: t("SUA"),
                tkey: "programming-fourth-paragraph",
                href: "https://sua.ac/",
              })}
            </p>
            <p>
              {linkedText({
                text: "Universal Cup",
                tkey: "programming-fifth-paragraph",
                href: "https://ucup.ac/",
              })}
            </p>
          </div>
        </section>

        <Section title={t("Coaching")}>
          <TimedList items={coachingItems} />
        </Section>

        <Section title={t("Awards")}>
          <AwardList />
        </Section>

        <Section title={t("ProblemSettingJudging")}>
          <>
            <YearGroupedList
              years={problemSettingYears}
              groups={groupedProblemSettingItems}
            />
            <RecurringList items={recurringProblemSettingItems} />
          </>
        </Section>

        <Section title={t("Wiki")}>
          <LinkList
            items={[
              linkedText({
                text: "Keystone Wiki",
                tkey: "Others-1",
                href: "http://keystone.wiki/",
              }) as JSX.Element,
            ]}
          />
        </Section>
      </div>
    </div>
  );
};

export default CompetitiveProgramming;
