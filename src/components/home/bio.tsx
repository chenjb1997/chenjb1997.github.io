import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LabOverview from "./LabOverview";
import News from "./News";
const Bio = () => {
  const { t, i18n } = useTranslation();
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

      <LabOverview />

      <h2 className="text-2xl font-semibold mt-8 mb-4">{t("Teaching")}</h2>
      <div className="space-y-2">
        {courses.map((course) => (
          <div
            key={course.code}
            className="home-academic-card flex flex-col gap-0.5 border-l-[3px] border-emerald-500 bg-white px-3 py-2 shadow-sm md:flex-row md:items-baseline md:justify-between md:gap-3"
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
