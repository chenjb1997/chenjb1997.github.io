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
    </div>
  );
};
export default Bio;
