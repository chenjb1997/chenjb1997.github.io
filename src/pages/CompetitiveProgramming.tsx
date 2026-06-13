import { useTranslation } from "react-i18next";

type TimedEntry = {
  body: string;
  time: string;
  href?: string;
};

type AwardEntry = {
  award: string;
  body: string;
  time: string;
};

type HallOfFameEntry = {
  name: string;
  zhName?: string;
  affiliation?: string;
  zhAffiliation?: string;
  destination?: string;
  zhDestination?: string;
  period?: string;
  honors?: TimedEntry[];
};

type HallOfFameTeam = {
  name: string;
  zhName?: string;
  period: string;
  affiliation: string;
  zhAffiliation?: string;
  members: HallOfFameEntry[];
  honors: TimedEntry[];
};

const CompetitiveProgramming = () => {
  const { t, i18n } = useTranslation();

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
  const photos = [
    {
      src: "/competitive/qingdao_champion.jpg",
      alt: "ICPC Qingdao Regional Champion, 2017",
      caption: t("photo-qingdao-champion"),
      position: "object-center",
    },
    {
      src: "/competitive/wf2018.jpg",
      alt: "ICPC World Finals 2018, Beijing",
      caption: t("photo-wf2018"),
      position: "object-center",
    },
    {
      src: "/competitive/wf2022.jpg",
      alt: "ICPC World Finals 2022, Luxor",
      caption: t("photo-wf2022"),
      position: "object-[50%_38%]",
    },
  ];
  const hallOfFameTeams: HallOfFameTeam[] = [
    {
      name: "Afterlife",
      zhName: "来生",
      period: "2024 - 2026",
      affiliation: "Zhejiang University",
      zhAffiliation: "浙江大学",
      members: [
        {
          name: "Bo Peng",
          zhName: "彭博",
        },
        {
          name: "Zixuan Yan",
          zhName: "严子轩",
        },
        {
          name: "Qiuyang Zhang",
          zhName: "张湫阳",
        },
      ],
      honors: [
        {
          ...parseTimedEntry(t("hall-of-fame-afterlife-honor-1")),
          href: "https://www.cphof.org/standings/icpc/2025",
        },
        {
          ...parseTimedEntry(t("hall-of-fame-afterlife-honor-2")),
          href: "https://www.cphof.org/standings/ucup/2026",
        },
        {
          ...parseTimedEntry(t("hall-of-fame-afterlife-honor-3")),
          href: "https://board.xcpcio.com/icpc/49th/nanjing",
        },
      ],
    },
    {
      name: "Acceptable",
      period: "2021 - 2022",
      affiliation: "Georgia Institute of Technology",
      zhAffiliation: "佐治亚理工学院",
      members: [
        {
          name: "Jeffrey Chang",
        },
        {
          name: "Arvind Ramaswami",
        },
        {
          name: "Maxwell Zhang",
        },
      ],
      honors: [
        {
          ...parseTimedEntry(t("hall-of-fame-acceptable-honor-1")),
          href: "https://nac22.kattis.com/contests/nac22/standings",
        },
        {
          ...parseTimedEntry(t("hall-of-fame-acceptable-honor-2")),
          href: "https://www.cphof.org/standings/icpc/2021",
        },
      ],
    },
    {
      name: "Phantom Ensemble",
      zhName: "幽灵乐团",
      period: "2020 - 2024",
      affiliation: "Zhejiang University",
      zhAffiliation: "浙江大学",
      members: [
        {
          name: "Changdong Li",
          zhName: "李昌栋",
        },
        {
          name: "Weinuo Li",
          zhName: "黎伟诺",
        },
        {
          name: "Jiachen Tang",
          zhName: "唐嘉辰",
        },
      ],
      honors: [
        {
          ...parseTimedEntry(t("hall-of-fame-phantom-honor-2")),
          href: "https://www.cphof.org/standings/icpc/2024",
        },
        {
          ...parseTimedEntry(t("hall-of-fame-phantom-honor-1")),
          href: "https://board.xcpcio.com/icpc/47th/shenyang",
        },
        {
          ...parseTimedEntry(t("hall-of-fame-phantom-honor-3")),
          href: "https://board.xcpcio.com/provincial-contest/2020/zjcpc",
        },
      ],
    },
    {
      name: "Wheatfield with Crows",
      period: "2019",
      affiliation: "Zhejiang University",
      zhAffiliation: "浙江大学",
      members: [
        {
          name: "Yuwen Chen",
          zhName: "陈昱文",
        },
        {
          name: "Haoran Deng",
          zhName: "邓浩然",
        },
        {
          name: "Siyi Lin",
          zhName: "林思仪",
        },
      ],
      honors: [
        {
          ...parseTimedEntry(t("hall-of-fame-wheatfield-honor-1")),
          href: "https://rl.algoux.org/collection/official?rankId=ccpc2019xiamen",
        },
      ],
    },
  ];
  const hallOfFameIndividuals: HallOfFameEntry[] = [
    {
      name: "Bing-Dong Liu",
      period: "2022 - 2025",
      destination: "Massachusetts Institute of Technology",
      zhDestination: "麻省理工学院",
      honors: [
        {
          ...parseTimedEntry(t("hall-of-fame-dong-honor-1")),
          href: "https://stats.ioinformatics.org/people/8805",
        },
      ],
    },
    {
      name: "Brian Xue",
      period: "2021 - 2025",
      destination: "Massachusetts Institute of Technology",
      zhDestination: "麻省理工学院",
      honors: [
        {
          ...parseTimedEntry(t("hall-of-fame-brian-honor-1")),
          href: "https://stats.ioinformatics.org/people/8462",
        },
        {
          ...parseTimedEntry(t("hall-of-fame-brian-honor-2")),
          href: "https://stats.ioinformatics.org/people/8462",
        },
      ],
    },
    {
      name: "Alex Chen",
      period: "2021 - 2025",
      destination: "The University of Texas at Austin",
      zhDestination: "德克萨斯大学奥斯汀分校",
      honors: [
        {
          ...parseTimedEntry(t("hall-of-fame-alex-honor-1")),
          href: "https://stats.ioinformatics.org/people/8806",
        },
      ],
    },
  ];

  const periodEndYear = (period?: string) => {
    if (!period) return Number.NEGATIVE_INFINITY;
    const matches = period.match(/\d{4}/g);
    if (!matches?.length) return Number.NEGATIVE_INFINITY;
    return Number.parseInt(matches[matches.length - 1], 10);
  };

  const sortedHallOfFameTeams = [...hallOfFameTeams].sort(
    (a, b) => periodEndYear(b.period) - periodEndYear(a.period)
  );
  const sortedHallOfFameIndividuals = [...hallOfFameIndividuals].sort(
    (a, b) => periodEndYear(b.period) - periodEndYear(a.period)
  );
  const awardItems = Array.from({ length: 18 }, (_, index) =>
    parseAwardEntry(t(`Awards-${index + 1}`))
  );
  const problemSettingKeys = [
    29, 27, 1, 2, 3, 4, 5, 6, 28, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
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
    variant = "default",
  }: {
    title: string;
    children: JSX.Element;
    variant?: "default" | "fame";
  }) => (
    <section
      className={`site-section-motion px-3 py-2 shadow-sm ${
        variant === "fame"
          ? "hall-fame-section border border-amber-100 bg-gradient-to-br from-white via-amber-50/35 to-white"
          : "bg-white"
      }`}
    >
      <h2 className="mb-2 flex items-center gap-2 border-b border-gray-200 pb-1 text-[24px] font-bold leading-snug text-gray-900">
        {variant === "fame" && (
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_0_3px_rgba(251,191,36,0.18)]" />
        )}
        <span>{title}</span>
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

  const displayHallName = (entry: HallOfFameEntry) =>
    i18n.language.startsWith("zh") && entry.zhName ? entry.zhName : entry.name;

  const displayTeamName = (team: HallOfFameTeam) =>
    i18n.language.startsWith("zh") && team.zhName ? team.zhName : team.name;

  const displayTeamAffiliation = (team: HallOfFameTeam) =>
    i18n.language.startsWith("zh") && team.zhAffiliation
      ? team.zhAffiliation
      : team.affiliation;

  const displayDestination = (entry: HallOfFameEntry) =>
    i18n.language.startsWith("zh") && entry.zhDestination
      ? entry.zhDestination
      : entry.destination;

  const sortHonorsByYearDesc = (honors: TimedEntry[]) =>
    [...honors].sort(
      (a, b) => Number.parseInt(b.time, 10) - Number.parseInt(a.time, 10)
    );

  const PersonList = ({
    entries,
    columns = false,
  }: {
    entries: HallOfFameEntry[];
    columns?: boolean;
  }) => (
    <div className={`grid gap-1 ${columns ? "md:grid-cols-3" : ""}`}>
      {entries.map((entry) => (
        <div
          key={entry.name}
          className="hall-fame-person border-l-[2px] border-amber-300 bg-white/80 px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
        >
          <div className="flex flex-col gap-0.5 md:flex-row md:items-baseline md:justify-between md:gap-3">
            <div className="text-[14px] font-semibold leading-snug text-gray-900">
              {displayHallName(entry)}
            </div>
            {entry.period && (
              <div className="text-[12px] font-medium leading-snug text-amber-700">
                {entry.period}
              </div>
            )}
          </div>
          {entry.affiliation && (
            <div className="mt-0.5 text-[12px] leading-snug text-gray-600">
              {entry.affiliation}
            </div>
          )}
          {entry.destination && (
            <div className="mt-0.5 text-[12px] leading-snug text-gray-600">
              {displayDestination(entry)}
            </div>
          )}
          {entry.honors && entry.honors.length > 0 && (
            <ul className="mt-2 space-y-1 text-[13px] leading-snug text-gray-800">
              {entry.honors.map((honor) => (
                <li
                  key={`${entry.name}-${honor.body}-${honor.time}`}
                  className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-l-[2px] border-amber-200 bg-white/75 px-2 py-1"
                >
                  <span className="min-w-0">
                    {honor.href ? (
                      <a href={honor.href} className="hall-fame-link underline decoration-amber-300 underline-offset-2 hover:text-amber-700">
                        {honor.body}
                      </a>
                    ) : (
                      honor.body
                    )}
                  </span>
                  <span className="shrink-0 text-[12px] font-medium text-gray-500">
                    {honor.time}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );

  const HallOfFameTeamList = ({ teams }: { teams: HallOfFameTeam[] }) => (
    <div className="space-y-2">
      {teams.map((team) => (
        <article
          key={team.name}
          className="hall-fame-team border-l-[3px] border-amber-500 bg-amber-50/45 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
        >
          <div className="flex flex-col gap-0.5 md:flex-row md:items-baseline md:justify-between md:gap-3">
            <div>
              <h3 className="text-[15px] font-semibold leading-snug text-gray-900">
                {displayTeamName(team)}
              </h3>
              <div className="mt-0.5 text-[12px] leading-snug text-gray-600">
                {displayTeamAffiliation(team)}
              </div>
            </div>
            <div className="text-[12px] font-medium leading-snug text-amber-700">
              {team.period}
            </div>
          </div>
          {team.members.length > 0 && (
            <div className="mt-2">
              <PersonList entries={team.members} columns />
            </div>
          )}
          <ul className="mt-2 space-y-1 text-[13px] leading-snug text-gray-800">
            {sortHonorsByYearDesc(team.honors).map((honor) => (
              <li
                key={`${honor.body}-${honor.time}`}
                  className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-l-[2px] border-amber-300 bg-white/80 px-2 py-1"
              >
                <span className="min-w-0">
                  {honor.href ? (
                    <a href={honor.href} className="hall-fame-link underline decoration-amber-300 underline-offset-2 hover:text-amber-700">
                      {honor.body}
                    </a>
                  ) : (
                    honor.body
                  )}
                </span>
                <span className="shrink-0 text-[12px] font-medium text-gray-500">
                  {honor.time}
                </span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl">
      <div className="site-section-motion px-3">
        <h1 className="mb-5 text-3xl font-bold">
          {t("Competitive-Programming")}
        </h1>
      </div>

      <div className="space-y-4">
        <section className="site-section-motion px-3">
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

        <section className="site-section-motion grid gap-2 md:grid-cols-3">
          {photos.map((photo) => (
            <figure key={photo.src} className="overflow-hidden bg-white shadow-sm">
              <img
                src={photo.src}
                alt={photo.alt}
                className={`h-52 w-full object-cover md:h-48 ${photo.position}`}
                loading="lazy"
              />
              <figcaption className="px-2 py-1.5 text-center text-[12px] leading-snug text-gray-600">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </section>

        <Section title={t("HallOfFame")} variant="fame">
          <div className="space-y-3">
            <p className="text-[14px] leading-relaxed text-gray-900">
              {t("hall-of-fame-intro")}
            </p>
            <div className="space-y-3">
              <div>
                <div className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-gray-500">
                  {t("hall-of-fame-teams")}
                </div>
                <HallOfFameTeamList teams={sortedHallOfFameTeams} />
              </div>
              <div>
                <div className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-gray-500">
                  {t("hall-of-fame-individuals")}
                </div>
                <PersonList entries={sortedHallOfFameIndividuals} />
              </div>
            </div>
          </div>
        </Section>

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
