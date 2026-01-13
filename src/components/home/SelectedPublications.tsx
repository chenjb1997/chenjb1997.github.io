import React from "react";
import { useTranslation } from "react-i18next";

interface Author {
  name: string;
  href: string;
}

interface Publication {
  title: string;
  authors: Author[];
  venue: string;
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
    <div className="border-[1px] border-solid border-[#e5e7eb] rounded-md mb-5 overflow-hidden">
      <h3 className="text-[18px] font-bold p-2 bg-[#e5e7eb]">
        {publications.year}
      </h3>
      <div className="gap-4 p-2">
        {publications.publications.map((pub, index) => (
          <div
            key={index}
            className="mb-4 border-b-[1px] border-[#e5e7eb] last:border-b-0"
          >
            <div className="text-[16px] font-bold">{pub.title}</div>
            <div className="text-[14px] text-gray-600">
              {pub.authors.map(({ name, href }, index) => (
                <span key={index} className="text-[14px] inline-block mr-2">
                  {name.includes("Jingbang Chen") ? (
                    <span className="font-bold text-black cursor-pointer">
                      {name}
                    </span>
                  ) : (
                    <a
                      className="text-[#1a73e8] hover:text-[#eab308] cursor-pointer"
                      href={href}
                      target="_blank"
                    >
                      {name}
                    </a>
                  )}
                  <span>{index === pub.authors.length - 1 ? "" : ","}</span>
                </span>
              ))}
            </div>
            <span className="text-[14px]  rounded-md inline-block my-1">
              {pub.venue}
            </span>
            <div className="text-[14px]">
              {pub.arXiv.map(({ name, href }, index) => (
                <>
                  <a
                    key={index}
                    className="text-[#1a73e8] hover:text-[#eab308] cursor-pointer"
                    href={href}
                    target="_blank"
                  >
                    {name}
                  </a> 
                  <span>{index === pub.arXiv.length - 1 ? "" : " · "}</span>
                </>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SelectedPublications = () => {
  const { t } = useTranslation();
  const SelectedPublicationsList: SelectedPublicationsItem[] = [
    {
      year: t("year-2026"),
      publications: [
        {
          title: t("SelectedPublications-2026-publications-1-title"),
          authors: [
            { name: "Jingbang Chen*", href: "" },
            { name: "Weinuo Li", href: "#" },
            { name: "Yingli Zhou", href: "https://jaylzhou.github.io/" },
            { name: "Hangrui Zhou", href: "https://hehezhou.github.io/" },
            { name: "Qiuyang Mang", href: "https://joyemang33.github.io/" },
            { name: "Can Wang", href: "https://person.zju.edu.cn/wangcan" },
            { name: "Yixiang Fang", href: "https://fangyixiang.github.io/" },
            { name: "Chenhao Ma", href: "https://chenhao-ma.github.io/" },
          ],
          venue: t("SelectedPublications-2026-publications-1-venue"),
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2505.10471",
            },
          ],
        },
        {
          title: t("TopKGAT: A Top-K Objective-Driven Architecture for Recommendation"),
          authors: [
            { name: "Sirui Chen", href: "" }, // :contentReference[oaicite:0]{index=0}
            { name: "Jiawei Chen", href: "https://jiawei-chen.github.io/" }, // :contentReference[oaicite:1]{index=1}
            { name: "Canghong Jin", href: "" }, // (no clear personal homepage found; ResearchGate exists) :contentReference[oaicite:2]{index=2}
            { name: "Sheng Zhou", href: "https://zhoushengisnoob.github.io/" }, // :contentReference[oaicite:3]{index=3}
            { name: "Jingbang Chen", href: "" },
            { name: "Wujie Sun", href: "https://zju-swj.github.io/" }, // :contentReference[oaicite:4]{index=4}
            { name: "Can Wang", href: "https://person.zju.edu.cn/wangcan" }, // :contentReference[oaicite:5]{index=5}
          ],
          venue: t("The Web Conference 2026 (WWW 2026)"),
          arXiv: [
            
          ],
        },
      ],
    },
    {
      year: t("year-2025"),
      publications: [
        {
          title: t("SelectedPublications-2025-publications-1-title"),
          authors: [
            { name: "Jingbang Chen*", href: "" },
            { name: "Xinyuan Cao", href: "https://youki-cao.github.io/" },
            {
              name: "Alicia Stepin",
              href: "https://csd.cmu.edu/people/doctoral-student/alicia-stepin",
            },
            { name: "Li Chen", href: "https://lic225.github.io/" },
          ],
          venue: t("SelectedPublications-2025-publications-1-venue"),
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2211.09251",
            },
          ],
        },
        {
          title: t("SelectedPublications-2025-publications-2-title"),
          authors: [
            { name: "Qiuyang Mang", href: "https://joyemang33.github.io/" },
            { name: "Jingbang Chen*", href: "" },
            { name: "Hangrui Zhou", href: "https://hehezhou.github.io/" },
            {
              name: "Yu Gao",
              href: "https://sites.google.com/view/ygao2606/home",
            },
            { name: "Yingli Zhou", href: "https://jaylzhou.github.io/" },
            { name: "Qingyu Shi", href: "https://qoj.ac/" },
            { name: "Richard Peng", href: "https://www.cs.cmu.edu/~yangp/" },
            { name: "Yixiang Fang", href: "https://fangyixiang.github.io/" },
            { name: "Chenhao Ma", href: "https://chenhao-ma.github.io/" },
          ],
          venue: t("SelectedPublications-2025-publications-2-venue"),
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2406.00344",
            },
          ],
        },
      ],
    },
    {
      year: t("year-2024"),
      publications: [
        {
          title: t("SelectedPublications-2024-publications-1-title"),
          authors: [
            { name: "Jingbang Chen*", href: "" },
            { name: "Qiuyang Mang", href: "https://joyemang33.github.io/" },
            { name: "Hangrui Zhou", href: "https://hehezhou.github.io/" },
            { name: "Richard Peng", href: "https://www.cs.cmu.edu/~yangp/" },
            {
              name: "Yu Gao",
              href: "https://sites.google.com/view/ygao2606/home",
            },
            { name: "Chenhao Ma", href: "https://chenhao-ma.github.io/" },
          ],
          venue: t("SelectedPublications-2024-publications-1-venue"),
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2402.05006",
            },
          ],
        },
      ],
    },
    {
      year: t("year-2023"),
      publications: [
        {
          title: t("SelectedPublications-2023-publications-1-title"),
          authors: [
            { name: "Jingbang Chen*", href: "" },
            { name: "Meng He", href: "https://web.cs.dal.ca/~mhe/" },
            { name: "J. Ian Munro", href: "https://cs.uwaterloo.ca/~imunro/" },
            { name: "Richard Peng", href: "https://www.cs.cmu.edu/~yangp/" },
            { name: "Kaiyu Wu", href: "#" },
            {
              name: "Daniel J. Zhang",
              href: "https://scholar.google.com/citations?user=0ZF-JdcAAAAJ&hl=en",
            },
          ],
          venue: t("SelectedPublications-2023-publications-1-venue"),
          // arXiv: ["Proceeding","Journal"],
          arXiv: [
            {
              name: "Proceeding",
              href: "https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ISAAC.2023.18",
            },
            {
              name: "Journal",
              href: "https://www.sciencedirect.com/science/article/pii/S0925772124000257",
            },
          ],
        },
        {
          title: t("SelectedPublications-2023-publications-2-title"),
          authors: [
            { name: "Jingbang Chen*", href: "" },
            { name: "Li Chen", href: "https://lic225.github.io/" },
            { name: "Yang P. Liu", href: "https://yangpliu.github.io/index.html" },
            { name: "Richard Peng", href: "https://www.cs.cmu.edu/~yangp/" },
            { name: "Arvind Ramaswami", href: "https://arvindr9.github.io/" },
          ],
          venue: t("SelectedPublications-2023-publications-2-venue"),
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2207.00736",
            },
            {
              name: "Proceeding",
              href: "https://epubs.siam.org/doi/10.1137/1.9781611977714.16",
            },
          ],
        },
        {
          title: t("SelectedPublications-2023-publications-3-title"),
          authors: [
            { name: "Jingbang Chen*", href: "" },
            {
              name: "Yu Gao",
              href: "https://sites.google.com/view/ygao2606/home",
            },
            { name: "Yufan Huang", href: "https://luotuoqingshan.github.io/" },
            { name: "Richard Peng", href: "https://www.cs.cmu.edu/~yangp/" },
            { name: "Runze Wang", href: "#" },
          ],
          venue: t("SelectedPublications-2023-publications-3-venue"),
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2109.12736",
            },
            {
              name: "Proceeding",
              href: "https://link.springer.com/chapter/10.1007/978-3-031-38906-1_16",
            },
          ],
        },
      ],
    },
    {
      year: t("year-2020"),
      publications: [
        {
          title: t("SelectedPublications-2020-publications-1-title"),
          authors: [
            { name: "Jiawei Chen", href: "https://jiawei-chen.github.io/" },
            { name: "Can Wang", href: "https://person.zju.edu.cn/wangcan" },
            { name: "Sheng Zhou", href: "#" },
            {
              name: "Qihao Shi",
              href: "https://scholar.google.com/citations?user=0bAHR_QAAAAJ&hl=en",
            },
            { name: "Jingbang Chen", href: "" },
            {
              name: "Yan Feng",
              href: "https://openreview.net/profile?id=~Yan_Feng1",
            },
            { name: "Chun Chen", href: "#" },
          ],
          venue: t("SelectedPublications-2020-publications-1-venue"),
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2003.01892",
            },
            {
              name: "Proceeding",
              href: "https://ojs.aaai.org/index.php/AAAI/article/view/5751",
            },
          ],
        },
      ],
    },
  ];

  return (
    <div className="mb-10">
      <h2 className="border-b-[1px] border-gray-300 pb-2 text-[24px] font-bold mb-3">
        {t("SelectedPublications")}
      </h2>
      <span className="text-[13px] text-gray-600  block mb-3 ">
        {t("SelectedPublications-1")}
      </span>

      <div>
        {SelectedPublicationsList.map((item, index) => (
          <Publications key={index} publications={item} />
        ))}
      </div>
    </div>
  );
};

export default SelectedPublications;
