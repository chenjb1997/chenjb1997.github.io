import { useTranslation } from "react-i18next";
const Bio = () => {
  const { t } = useTranslation();
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
      <p className="text-gray-900 leading-relaxed text-[16px]">
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

      <p className="text-gray-900 leading-relaxed mt-6 text-[16px]">
        {t("bio-second-paragraph")}
      </p>

      <p className="text-gray-900 leading-relaxed mt-6 text-[16px]">
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

      <p className="text-gray-900 leading-relaxed mt-6 text-[16px]">
        {t("bio-fourth-paragraph")}
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">{t("Student")}</h2>
        <ul className="list-disc pl-5 space-y-2  text-[16px]">
          <li>Tianran Zhu, Ph.D., Fall 2026 - present @ CUHK-Shenzhen (B.S. at Peking University).</li>
          <li>Yuanjin Zheng, Ph.D., Fall 2026 - present @ CUHK-Shenzhen+SLAI (B.S. at Zhejiang University).</li>
          <li>Minghao Li, Ph.D., Fall 2026 - present @ CUHK-Shenzhen+SLAI  (B.S. at Nankai University).</li>
          <li>Yuyang Zhao, Ph.D., Fall 2025 - present @ CUHK-Shenzhen+SLAI (B.S. at Huaqiao University, Co-advice with Prof. Zhi-Quan (Tom) Luo).</li>
          <li>Zeyu Wang, Ph.D., Fall 2025 - present @ Zhejiang University (Co-advice with Prof. Can Wang).</li>
          <li>Junyang Chen, M.Phil., Fall 2026 - present @ CUHK-Shenzhen.</li>
          <li>Jiajun Hou, M.Phil., Fall 2026 - present @ CUHK-Shenzhen.</li>
          <li>Zixuan Yu, M.Phil., Fall 2026 - present @ CUHK-Shenzhen.</li>
          <li>Hao Wu, Research Assistant, Fall 2025 - present @ Zhejiang University.</li>
          <li>Daniel Skachkov, Research Assistant, Spring 2026 - present @ Moscos State University.</li>
        </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-4">{t("Teaching")}</h2>
        <ul className="list-disc pl-5 space-y-2  text-[16px]">
          <li>CSC 5001 Design and Analysis of Computer Algorithms, Fall 2025 @ CUHK-Shenzhen.</li>
          <li>CSC 5003 Algorithm Art and Programming Practice, Spring 2026 @ CUHK-Shenzhen.</li>
          <li>MF 0005 Analysis of Algorithms, Spring 2026 @ SLAI (Co-teaching with Prof. Konstantinos Courcoubetis).</li>
        </ul>
    </div>

    
  );
};
export default Bio;
