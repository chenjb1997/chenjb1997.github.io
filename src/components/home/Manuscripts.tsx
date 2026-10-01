import React from "react";
import { useTranslation } from "react-i18next";

interface Author {
  name: string;
  href: string;
}

interface Publication {
  title: string;
  authors: Author[];
  arXiv: {
    name: string;
    href: string;
  }[];
}

interface SelectedPublicationsItem {
  year: string; // 已修正为 string
  publications: Publication[];
}

const Publications: React.FC<{ publications: SelectedPublicationsItem }> = ({
  publications,
}) => {
  return (
    <div className="mb-4">
      <div className="space-y-3">
        {publications.publications.map((pub, index) => (
          <div
            key={index}
            className="home-academic-card border-l-[3px] border-sky-500 bg-white px-3 py-2 shadow-sm"
          >
            <div className="text-[15px] font-semibold leading-snug text-gray-900">
              {pub.title}
            </div>
            <div className="mt-0.5 text-[13px] leading-snug text-gray-600">
              {pub.authors.map(({ name, href }, index) => (
                <span key={index} className="mr-1.5 inline-block">
                  {name.includes("Jingbang Chen") ? (
                    <span className="font-bold text-black">
                      {name}
                    </span>
                  ) : href && href !== "#" ? (
                    <a
                      href={href}
                      target="_blank"
                      className="text-[#1a73e8] hover:text-[#eab308] cursor-pointer"
                    >
                      {name}
                    </a>
                  ) : (
                    <span>{name}</span>
                  )}
                  <span>{index === pub.authors.length - 1 ? "" : ","}</span>
                </span>
              ))}
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {pub.arXiv.map(({ name, href }, index) => (
                <a
                  href={href}
                  key={index}
                  target="_blank"
                  className="inline-flex rounded-sm border border-blue-200 bg-white px-1.5 py-0.5 text-[11px] font-medium leading-tight text-blue-700 hover:border-amber-300 hover:text-amber-700"
                >
                  {name}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Manuscripts = () => {
  const { t } = useTranslation();
  const SelectedPublicationsList: SelectedPublicationsItem[] = [
    {
      year: "2026",
      publications: [
        {
          title: t("Manuscripts-2026-adagepa-title"),
          authors: [
            { name: "Junyang Chen", href: "" },
            { name: "Zecheng Wang", href: "" },
            { name: "Jingbang Chen*", href: "" },
          ],
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2609.39927",
            },
          ],
        },
        {
          title: t("Manuscripts-2026-dynamic-subhypergraphs-title"),
          authors: [
            { name: "Jingbang Chen*", href: "" },
            { name: "Chenhao Ma", href: "https://chenhao-ma.github.io/" },
            { name: "Yingli Zhou", href: "https://jaylzhou.github.io/" },
          ],
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2609.39778",
            },
          ],
        },
        {
          title: t("Manuscripts-2026-code-transfer-title"),
          authors: [
            { name: "Zheng Yu", href: "" },
            { name: "Yiwei Li", href: "https://github.com/William-Li123" },
            { name: "Yishen Chen", href: "" },
            { name: "Xiang Li", href: "" },
            { name: "Jiale Han", href: "https://hanjiale.github.io/" },
            { name: "Benyou Wang", href: "https://wabyking.github.io/old.html" },
            { name: "Jingbang Chen*", href: "" },
          ],
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2609.33845",
            },
          ],
        },
        {
          title: t("Manuscripts-2026-title"),
          authors: [
            { name: "Sichen Wang", href: "https://sichen-wang.github.io/" },
            { name: "Zhipeng Lu", href: "https://www.smbu.edu.cn/info/5741/77301.htm" },
            { name: "Jingbang Chen*", href: "" },
          ],
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2608.06388",
            },
          ],
        },
        {
          title: t("Manuscripts-2026-skillbloat-title"),
          authors: [
            { name: "Yuanjin Zheng", href: "" },
            { name: "Jingbang Chen*", href: "" },
          ],
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2608.21929",
            },
          ],
        },
        {
          title: t("Manuscripts-2026-balance-title"),
          authors: [
            { name: "Zeyu Wang", href: "" },
            { name: "Kudria Sergei", href: "https://sds.cuhk.edu.cn/en/node/686" },
            { name: "Jingbang Chen*", href: "" },
            { name: "Jiawei Chen", href: "https://jiawei-chen.github.io/" },
            { name: "Xinyu Wang", href: "" },
            { name: "Xiaodong Luo", href: "" },
            { name: "Can Wang", href: "https://person.zju.edu.cn/wangcan" },
          ],
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2605.17492",
            },
          ],
        },
      ],
    },
    {
      year: "2023",
      publications: [
        {
          title: t("Manuscripts-2023-title"),
          authors: [
            { name: "Ruinian Chang", href: "#" },
            { name: "Jingbang Chen (Alphabetical Order)", href: "" },
            { name: "J. Ian Munro", href: "https://cs.uwaterloo.ca/~imunro/" },
            { name: "Richard Peng", href: "https://www.cs.cmu.edu/~yangp/" },
            { name: "Qingyu Shi", href: "https://qoj.ac/" },
            {
              name: "Zeyu Zheng",
              href: "https://zeyu-zheng.github.io/",
            },
          ],
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2307.07711",
            },
          ],
        },
      ],
    },
  ];

  return (
    <div className="mb-10">
      <h2 className="border-b-[1px] border-gray-300 pb-2 text-[24px] font-bold mb-3">
        {t("Manuscripts")}
      </h2>
      <p className="mb-3 text-[13px] text-gray-600">
        {t("SelectedPublications-1")}
      </p>
      <div>
        {SelectedPublicationsList.map((item, index) => (
          <Publications key={index} publications={item} />
        ))}
      </div>
    </div>
  );
};

export default Manuscripts;
