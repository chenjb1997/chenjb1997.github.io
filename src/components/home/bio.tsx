import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import News from "./News";
const Bio = () => {
  const { t, i18n } = useTranslation();
  const [openResearchGroups, setOpenResearchGroups] = useState<Record<string, boolean>>({});
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
        {
          name: "Yichun Wang",
          zhName: "王伊淳",
          period: "Fall 2026 - present",
          affiliation: "CUHK-Shenzhen",
          background: ["B.S. at CUHK-Shenzhen"],
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
      note: "Initiated Instructor",
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
      note: "Initiated Instructor; Co-teaching with Prof. Konstantinos Courcoubetis",
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
  const getPeople = (group: string, names: string[]) => {
    const section = students.find((item) => item.group === group);
    if (!section) return [];
    return names
      .map((name) => section.people.find((person) => person.name === name))
      .filter((person): person is (typeof section.people)[number] => Boolean(person));
  };
  const studentResearchGroups = [
    {
      group: "Algo Branch",
      zhGroup: "算法理论部",
      directions: [
        {
          title: "Classical Algorithms and Data Structures",
          body: "dynamic graph algorithms, online algorithms, linear system solvers, and other related topics in theoretical computer science",
        },
        {
          title: "Graph Databases and Graph Data Mining",
          body: "temporal and dynamic graph analysis, higher-order structure counting in bipartite graphs, signed network analysis, dense subgraph and graph pattern mining, and large-scale graph query and indexing",
        },
        {
          title: "Learning-Augmented Algorithms",
          body: "prediction-enhanced data structures and algorithms with both theoretical guarantees and practical performance, such as binary search trees and B-trees",
        },
      ],
      zhDirections: [
        {
          title: "传统算法与数据结构",
          body: "动态图算法、在线算法、线性方程组求解等理论计算机科学等相关问题",
        },
        {
          title: "图数据库与图数据挖掘",
          body: "时序图与动态图分析、二部图高阶结构计数、符号网络分析、稠密子图与图模式挖掘、大规模图查询与索引等",
        },
        {
          title: "学习增强算法",
          body: "兼具理论保证和实际表现的由预测强化的数据结构、算法，如二叉搜索树、B树等",
        },
      ],
      moreLabel: "...",
      zhMoreLabel: "……",
      accent: "algo",
      sections: [
        {
          group: "Ph.D. Students",
          people: getPeople("Ph.D. Students", [
            "Tianran Zhu",
            "Zeyu Wang",
            "Daniel Skachkov",
          ]),
        },
        {
          group: "Research Assistants",
          people: getPeople("Research Assistants", [
            "Hao Wu",
            "Sichen Wang",
            "Weinuo Li",
          ]),
        },
      ],
    },
    {
      group: "AI Branch",
      zhGroup: "人工智能部",
      directions: [
        {
          title: "General AI and Learning Theory",
          body: "training and inference of large models, reinforcement learning, deep learning, online learning, and theoretical foundations of artificial intelligence",
        },
        {
          title: "Trustworthy and Verifiable AI Analysis",
          body: "verifiable AI, mathematical reasoning and theorem proving benchmarks, reliability evaluation for large-model reasoning, AI-generated content analysis, and agent safety",
        },
        {
          title: "AI + Databases and Data Mining",
          body: "AI techniques for database systems, data mining, knowledge graphs, retrieval-augmented generation, and large-scale data analysis",
        },
        {
          title: "AI Systems and Industrial Collaboration",
          body: "algorithm adaptation for domestic chips and AI infrastructure, operator optimization, and industry-oriented AI system design",
        },
      ],
      zhDirections: [
        {
          title: "通用人工智能与学习理论",
          body: "大模型训练与推理、强化学习、深度学习、在线学习、人工智能理论基础等",
        },
        {
          title: "可信、可验证人工智能分析",
          body: "可验证 AI、数学推理与定理证明 benchmark、大模型推理可靠性评测、AI 生成内容分析、智能体安全等",
        },
        {
          title: "人工智能 + 数据库、数据挖掘",
          body: "面向数据库系统、数据挖掘、知识图谱、检索增强生成与大规模数据分析的人工智能方法等",
        },
        {
          title: "人工智能系统与产业合作",
          body: "面向国产芯片和 AI 基础设施的算法适配、算子优化、面向产业场景的人工智能系统设计等",
        },
      ],
      moreLabel: "...",
      zhMoreLabel: "……",
      accent: "ai",
      sections: [
        {
          group: "Ph.D. Students",
          people: getPeople("Ph.D. Students", [
            "Yuanjin Zheng",
            "Minghao Li",
            "Yuyang Zhao",
          ]),
        },
        {
          group: "M.Phil. Students",
          people: getPeople("M.Phil. Students", [
            "Junyang Chen",
            "Jiajun Hou",
            "Zixuan Yu",
            "Yichun Wang",
          ]),
        },
      ],
    },
  ];
  const researchGroupClassName = (accent: string) =>
    accent === "algo"
      ? "student-group-card student-group-card-algo border-l-[3px] border-blue-500 bg-blue-50/25 px-3 py-2 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
      : "student-group-card student-group-card-ai border-l-[3px] border-rose-500 bg-rose-50/25 px-3 py-2 shadow-sm transition-transform duration-200 hover:-translate-y-0.5";
  const researchGroupLabelClassName = () =>
    "text-[15px] font-semibold leading-snug text-gray-900";
  const researchGroupHeaderClassName = (accent: string) =>
    accent === "algo"
      ? "student-group-header student-group-header-algo mb-2 flex items-center justify-between gap-3 rounded-sm border border-blue-100 bg-white/80 px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
      : "student-group-header student-group-header-ai mb-2 flex items-center justify-between gap-3 rounded-sm border border-rose-100 bg-white/80 px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]";
  const researchGroupToggleClassName = (accent: string) =>
    accent === "algo"
      ? "inline-flex h-8 items-center gap-1.5 rounded-full border border-blue-200/80 bg-white px-2.5 text-[12px] font-semibold leading-none text-blue-700 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50"
      : "inline-flex h-8 items-center gap-1.5 rounded-full border border-rose-200/80 bg-white px-2.5 text-[12px] font-semibold leading-none text-rose-700 shadow-sm transition-colors hover:border-rose-300 hover:bg-rose-50";
  const researchDirectionPanelClassName = (accent: string) =>
    accent === "algo"
      ? "border-blue-100 bg-white/85 text-blue-900"
      : "border-rose-100 bg-white/85 text-rose-900";
  const researchDirectionBulletClassName = (accent: string) =>
    accent === "algo"
      ? "bg-blue-500"
      : "bg-rose-500";
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
              const isInternalLink = href?.startsWith("/");
              newElements.push(
                isInternalLink ? (
                  <Link
                    key={`${index}-${partIndex}-${segIndex}`}
                    to={href}
                    className="text-blue-600 hover:text-[#FFA500] "
                  >
                    {text}
                  </Link>
                ) : (
                  <a
                    key={`${index}-${partIndex}-${segIndex}`}
                    href={href}
                    target="_blank"
                    className="text-blue-600 hover:text-[#FFA500] "
                  >
                    {text}
                  </a>
                )
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
        <ContentWrapper
          tkey="bio-second-paragraph"
          texts={[
            {
              text: t("SDS-CS-Theory-Group"),
              href: "https://sds-theory.github.io/",
            },
          ]}
        />
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
        <ContentWrapper
          tkey="bio-fourth-paragraph"
          texts={[
            {
              text: t("footprint-page-link"),
              href: "/footprint",
            },
            {
              text: t("xiaohongshu-link"),
              href: "https://www.xiaohongshu.com/user/profile/6136f2ad000000000201c8d7",
            },
          ]}
        />
      </p>

      <News />

      <h2 className="text-2xl font-semibold mt-8 mb-4">{t("Student")}</h2>
      <div className="grid gap-2">
        {studentResearchGroups.map((researchGroup) => {
          const isOpen = Boolean(openResearchGroups[researchGroup.group]);
          const directions = i18n.language.startsWith("zh")
            ? researchGroup.zhDirections
            : researchGroup.directions;
          const moreLabel = i18n.language.startsWith("zh")
            ? researchGroup.zhMoreLabel
            : researchGroup.moreLabel;

          return (
          <div
            key={researchGroup.group}
            className={researchGroupClassName(researchGroup.accent)}
          >
            <div className={researchGroupHeaderClassName(researchGroup.accent)}>
              <div className={researchGroupLabelClassName()}>
                {i18n.language.startsWith("zh")
                  ? researchGroup.zhGroup
                  : researchGroup.group}
              </div>
              <button
                type="button"
                className={researchGroupToggleClassName(researchGroup.accent)}
                aria-expanded={isOpen}
                onClick={() =>
                  setOpenResearchGroups((current) => ({
                    ...current,
                    [researchGroup.group]: !isOpen,
                  }))
                }
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  strokeWidth={2.4}
                />
                {i18n.language.startsWith("zh") ? "研究方向" : "Research"}
              </button>
            </div>
            <div
              className={`overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-out ${
                isOpen ? "mb-2 max-h-[26rem] opacity-100" : "mb-0 max-h-0 opacity-0"
              }`}
            >
              <div
                className={`rounded-sm border px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] ${researchDirectionPanelClassName(researchGroup.accent)}`}
              >
                <ul className="grid gap-1.5">
                  {directions.map((direction) => (
                    <li
                      key={direction.title}
                      className="grid grid-cols-[10px_1fr] gap-2 text-[13px] leading-relaxed text-gray-700"
                    >
                      <span
                        className={`mt-[0.55rem] h-2 w-2 rounded-full ${researchDirectionBulletClassName(researchGroup.accent)}`}
                      />
                      <span>
                        <span className="font-semibold text-gray-900">
                          {direction.title}
                        </span>
                        <span className="text-gray-500">: </span>
                        {direction.body}
                      </span>
                    </li>
                  ))}
                  <li className="grid grid-cols-[10px_1fr] gap-2 text-[13px] leading-relaxed text-gray-400">
                    <span
                      className={`mt-[0.55rem] h-2 w-2 rounded-full opacity-45 ${researchDirectionBulletClassName(researchGroup.accent)}`}
                    />
                    <span className="font-semibold tracking-[0.12em]">
                      {moreLabel}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid gap-2">
              {researchGroup.sections
                .filter((section) => section.people.length > 0)
                .map((section) => (
                  <div key={`${researchGroup.group}-${section.group}`}>
                    <div className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
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
          </div>
          );
        })}
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
