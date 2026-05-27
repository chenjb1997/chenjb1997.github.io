import { useTranslation } from "react-i18next";
const Bio = () => {
  const { t, i18n } = useTranslation();
  const students = [
    {
      group: "Ph.D. Students",
      people: [
        {
          name: "Tianran Zhu",
          zhName: "祝天然",
          period: "Fall 2026 - present",
          affiliation: "CUHK-Shenzhen",
          background: ["B.S. at Peking University"],
          highlight: ["ICPC Gold", "NOI Silver"],
        },
        {
          name: "Yuanjin Zheng",
          zhName: "郑远金",
          period: "Fall 2026 - present",
          affiliation: "CUHK-Shenzhen + SLAI",
          background: ["B.S. at Zhejiang University"],
        },
        {
          name: "Minghao Li",
          zhName: "黎明昊",
          period: "Fall 2026 - present",
          affiliation: "CUHK-Shenzhen + SLAI",
          background: [
            "B.S. at Nankai University",
            "M.S. at The University of Hong Kong",
          ],
        },
        {
          name: "Yuyang Zhao",
          zhName: "赵雨扬",
          period: "Fall 2025 - present",
          affiliation: "CUHK-Shenzhen + SLAI",
          background: ["B.S. at Huaqiao University"],
          coadvisor: "Prof. Zhi-Quan (Tom) Luo",
          highlight: ["ICPC Gold", "NOI Silver"],
        },
        {
          name: "Zeyu Wang",
          zhName: "王泽宇",
          period: "Fall 2025 - present",
          affiliation: "Zhejiang University",
          coadvisor: "Prof. Can Wang",
        },
        {
          name: "Daniel Skachkov",
          period: "Spring 2026 - present",
          affiliation: "Moscow State University",
          coadvisor: "Prof. Yuriy Dorn",
        },
      ],
    },
    {
      group: "M.Phil. Students",
      people: [
        {
          name: "Junyang Chen",
          zhName: "陈俊扬",
          period: "Fall 2026 - present",
          affiliation: "CUHK-Shenzhen",
          background: ["B.S. at South China Normal University"],
        },
        {
          name: "Jiajun Hou",
          zhName: "侯嘉俊",
          period: "Fall 2026 - present",
          affiliation: "CUHK-Shenzhen",
          background: ["B.S. at Beijing Normal-Hong Kong Baptist University"],
        },
        {
          name: "Zixuan Yu",
          zhName: "喻梓轩",
          period: "Fall 2026 - present",
          affiliation: "CUHK-Shenzhen",
          background: ["B.S. at Sun Yat-sen University"],
        },
      ],
    },
    {
      group: "Research Assistants",
      people: [
        {
          name: "Hao Wu",
          zhName: "吴浩",
          period: "Fall 2025 - present",
          affiliation: "Zhejiang University",
          affiliationLabel: "",
          background: ["UG at Zhejiang University"],
          highlight: ["ICPC Gold"],
        },
        {
          name: "Sichen Wang",
          zhName: "王司晨",
          period: "Fall 2025 - present",
          affiliation: "Shenzhen MSU-BIT University",
          affiliationLabel: "",
          background: ["UG at Shenzhen MSU-BIT University"],
        },
        {
          name: "Weinuo Li",
          zhName: "黎伟诺",
          period: "Fall 2024 - Spring 2026",
          affiliation: "Zhejiang University",
          affiliationLabel: "Now at Yanfu Investments",
          background: [
            "B.S. at Zhejiang University",
            "M.S. at Zhejiang University",
          ],
          highlight: ["VLDB 2026", "ICPC Gold", "ICPC Champion", "ICPC WF 10th"],
        },
      ],
    },
  ];
  const courses = [
    {
      code: "CSC 5001",
      title: "Design and Analysis of Computer Algorithms",
      zhTitle: "计算机算法设计与分析",
      offerings: [{ term: "Fall 2025", place: "CUHK-Shenzhen" }],
    },
    {
      code: "CSC 5003",
      title: "Algorithm Art and Programming Practice",
      zhTitle: "算法艺术与编程实战",
      offerings: [
        { term: "Spring 2026", place: "CUHK-Shenzhen" },
        { term: "Spring 2027", place: "CUHK-Shenzhen" },
      ],
    },
    {
      code: "CSC 3200",
      title: "Data Structures and Advanced Programming",
      zhTitle: "数据结构与高级程序设计",
      offerings: [{ term: "Fall 2026", place: "CUHK-Shenzhen" }],
    },
    {
      code: "MF 0005",
      title: "Analysis of Algorithms",
      zhTitle: "算法分析",
      offerings: [{ term: "Spring 2026", place: "SLAI" }],
      note: "Co-teaching with Prof. Konstantinos Courcoubetis",
    },
  ];
  const highlightClassName = (item: string) => {
    if (item === "NOI Silver") {
      return "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-300";
    }
    if (item === "ICPC WF 10th") {
      return "bg-orange-100 text-orange-800 ring-1 ring-inset ring-orange-300";
    }
    if (item === "VLDB 2026") {
      return "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200";
    }
    return "bg-amber-100 text-amber-800";
  };
  interface TextItem {
    text: string;
    href?: string;
  }
  const ContentWrapper = ({
    tkey,
    texts,
  }: {
    tkey: string;
    texts: TextItem[];
  }) => {
    const content = t(tkey);

    // 初始化结果数组
    let elements: (string | JSX.Element)[] = [content];

    texts.forEach(({ text, href }, index) => {
      const newElements: (string | JSX.Element)[] = [];
      elements.forEach((part, partIndex) => {
        if (typeof part === "string" && part.includes(text)) {
          const parts = part.split(text);
          parts.forEach((seg, segIndex) => {
            newElements.push(seg);
            if (segIndex < parts.length - 1) {
              newElements.push(
                <a
                  key={`${index}-${partIndex}-${segIndex}`}
                  href={href}
                  target="_blank"
                  className="text-blue-600 hover:text-[#FFA500] "
                >
                  {text}
                </a>
              );
            }
          });
        } else {
          newElements.push(part);
        }
      });
      elements = newElements;
    });

    return <>{elements}</>;
  };

  return (
    <div className="mb-10">
      <p className="text-[15px] leading-relaxed text-gray-900">
        <ContentWrapper
          tkey="bio-first-paragraph"
          texts={[
            {
              text: t("Algorithms-ComplexityGroup"),
              href: "https://algcomp.uwaterloo.ca/",
            },
            {
              text: t("University-of-Waterloo"),
              href: "https://uwaterloo.ca",
            },
            {
              text: "Richard Peng",
              href: "https://www.cs.cmu.edu/~yangp/",
            },
            {
              text: t("Georgia-Institute-of-Technology"),
              href: "https://www.gatech.edu/",
            },
            {
              text: t("Zhejiang-University"),
              href: "https://www.zju.edu.cn/",
            },
            {
              text: t("CanWang"),
              href: "https://person.zju.edu.cn/wangcan",
            },
          ]}
        />
      </p>

      <p className="mt-4 text-[15px] leading-relaxed text-gray-900">
        {t("bio-second-paragraph")}
      </p>

      <p className="mt-4 text-[15px] leading-relaxed text-gray-900">
        <ContentWrapper
          tkey="bio-third-paragraph"
          texts={[
            {
              text: t("North-American-Programming-Camp"),
              href: "https://www.cecs.ucf.edu/NAC-NAPC/",
            },
            {
              text: "Universal Cup",
              href: "https://ucup.ac/",
            },
          ]}
        />
      </p>

      <p className="mt-4 text-[15px] leading-relaxed text-gray-900">
        {t("bio-fourth-paragraph")}
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">{t("Student")}</h2>
      <div className="grid gap-2">
        {students.map((section) => (
          <div
            key={section.group}
            className="border-l-[3px] border-blue-500 bg-white px-3 py-2 shadow-sm"
          >
            <div className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-gray-500">
              {section.group}
            </div>
            <ul className="divide-y divide-gray-100 text-[14px] text-gray-900">
              {section.people.map((person) => (
                <li
                  key={person.name}
                  className="py-1 first:pt-0 last:pb-0"
                >
                  <div className="grid gap-0.5 md:grid-cols-[120px_minmax(115px,0.75fr)_minmax(170px,1.3fr)] md:items-baseline md:gap-x-3">
                    <div className="font-semibold leading-snug text-gray-900">
                      {i18n.language.startsWith("zh") && person.zhName
                        ? person.zhName
                        : person.name}
                    </div>
                    <div className="text-[12px] leading-snug text-gray-500">
                      {person.period}
                    </div>
                    <div className="text-[14px] leading-snug text-gray-700 md:text-[13px]">
                      {person.affiliationLabel ?? `@ ${person.affiliation}`}
                    </div>
                  </div>
                  <div className="mt-0.5 flex min-h-[20px] flex-wrap items-center gap-1 md:ml-[calc(120px+0.75rem)]">
                      {person.highlight?.map((item) => (
                        <span
                          key={item}
                          className={`inline-flex rounded-sm px-1.5 py-0.5 text-[12px] font-semibold leading-tight md:text-[11px] ${highlightClassName(item)}`}
                        >
                          {item}
                        </span>
                      ))}
                      {person.background?.map((item) => (
                        <span
                          key={item}
                          className="inline-flex rounded-sm bg-gray-100 px-1.5 py-0.5 text-[12px] leading-tight text-gray-700 md:text-[11px]"
                        >
                          {item}
                        </span>
                      ))}
                      {person.coadvisor && (
                        <span className="inline-flex rounded-sm bg-blue-50 px-1.5 py-0.5 text-[12px] leading-tight text-blue-700 md:text-[11px]">
                          Co-advised with {person.coadvisor}
                        </span>
                      )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">{t("Teaching")}</h2>
      <div className="space-y-2">
        {courses.map((course) => (
          <div
            key={course.code}
            className="flex flex-col gap-0.5 border-l-[3px] border-emerald-500 bg-white px-3 py-2 shadow-sm md:flex-row md:items-baseline md:justify-between md:gap-3"
          >
            <div>
              <div className="text-[14px] font-semibold leading-snug text-gray-900">
                <span className="text-gray-500">{course.code}</span>{" "}
                {i18n.language.startsWith("zh") ? course.zhTitle : course.title}
              </div>
              {course.note && (
                <div className="mt-0.5 text-[12px] leading-snug text-gray-600">
                  {course.note}
                </div>
              )}
            </div>
            <div className="flex shrink-0 flex-wrap gap-1 text-[12px] leading-snug text-gray-600 md:justify-end md:text-right">
              {course.offerings.map((offering) => (
                <span
                  key={`${course.code}-${offering.term}-${offering.place}`}
                  className="inline-flex rounded-sm bg-gray-100 px-1.5 py-0.5 leading-tight"
                >
                  {offering.term} @ {offering.place}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    
  );
};
export default Bio;
