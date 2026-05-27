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
            className="border-l-[3px] border-sky-500 bg-white px-3 py-2 shadow-sm"
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
          title: t("Manuscripts-2026-quasi-clique-title"),
          authors: [
            { name: "Jingbang Chen*", href: "" },
            { name: "Weinuo Li", href: "#" },
            { name: "Yingli Zhou", href: "https://jaylzhou.github.io/" },
            { name: "Hao Wu", href: "" },
            { name: "Can Wang", href: "https://person.zju.edu.cn/wangcan" },
            { name: "Yixiang Fang", href: "https://fangyixiang.github.io/" },
            { name: "Chenhao Ma", href: "https://chenhao-ma.github.io/" },
          ],
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2605.26235",
            },
          ],
        },
        {
          title: t("Manuscripts-2026-title"),
          authors: [
            { name: "Zeyu Wang", href: "" },
            { name: "Kudria Sergei", href: "https://sds.cuhk.edu.cn/en/node/686" },
            { name: "Jingbang Chen\u2020", href: "" },
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
      year: "2024",
      publications: [
        {
          title: t("Manuscripts-2024-title"),
          authors: [
            { name: "Jingbang Chen*", href: "" },
            { name: "Jiangqi Dai", href: "https://dblp.org/pid/365/4525.html" },
            { name: "Qiuyang Mang", href: "https://joyemang33.github.io/" },
            { name: "Qingyu Shi", href: "https://qoj.ac/" },
            {
              name: "Tingqiang Xu",
              href: "https://scholar.google.com/citations?user=HGTHVUgAAAAJ&hl",
            },
          ],
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2312.11873",
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
            { name: "Jingbang Chen*", href: "" },
            { name: "J. Ian Munro", href: "https://cs.uwaterloo.ca/~imunro/" },
            { name: "Richard Peng", href: "https://www.cs.cmu.edu/~yangp/" },
            { name: "Qingyu Shi", href: "https://qoj.ac/" },
            {
              name: "Zeyu Zheng",
              href: "https://scholar.google.com/citations?user=sNENLo8AAAAJ&hl=en",
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
      <div>
        {SelectedPublicationsList.map((item, index) => (
          <Publications key={index} publications={item} />
        ))}
      </div>
    </div>
  );
};

export default Manuscripts;
