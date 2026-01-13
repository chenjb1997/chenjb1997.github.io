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
    <div className="border-[1px] border-solid border-[#e5e7eb] rounded-md mb-5 overflow-hidden">
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
                      href={href}
                      target="_blank"
                      className="text-[#1a73e8] hover:text-[#eab308] cursor-pointer"
                    >
                      {name}
                    </a>
                  )}
                  <span>{index === pub.authors.length - 1 ? "" : ","}</span>
                </span>
              ))}
            </div>
            <div className="text-[14px]">
              {pub.arXiv.map(({ name, href }, index) => (
                <a
                  href={href}
                  key={index}
                  target="_blank"
                  className="text-[#1a73e8] hover:text-[#eab308] cursor-pointer"
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
      year: "2025",
      publications: [
        {
          title: t("Curing ''Miracle Steps'' in LLM Math Reasoning with Rubric Rewards"),
          authors: [
            { name: "Youliang Yuan", href: "https://youliangyuan.github.io/" },
            { name: "Qiuyang Mang", href: "https://joyemang33.github.io/" },
            { name: "Jingbang Chen", href: "" },
            { name: "Hong Wan", href: "" },
            { name: "Xiaoyuan Liu", href: "https://xyliu-cs.github.io/" },
            { name: "Junjielong Xu", href: "https://siyuexi.github.io/" },
            { name: "Jen-tse Huang", href: "" },
            { name: "Wenxuan Wang", href: "" },
            { name: "Wenxiang Jiao", href: "" },
            { name: "Pinjia He", href: "https://pinjiahe.github.io/" },
          ],
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2510.07774",
            },
          ],
        },
        {
        title: t("FrontierCS: Evolving Challenges for Evolving Intelligence"),
        authors: [
          { name: "Qiuyang Mang", href: "https://joyemang33.github.io/" }, // :contentReference[oaicite:1]{index=1}
          { name: "Wenhao Chai", href: "" },
          { name: "Zhifei Li", href: "" },
          { name: "Huanzhi Mao", href: "" },
          { name: "Shang Zhou", href: "" },
          { name: "Alexander Du", href: "" },
          { name: "Hanchen Li", href: "" },
          { name: "Shu Liu", href: "" },
          { name: "Edwin Chen", href: "" },
          { name: "Yichuan Wang", href: "" },
          { name: "Xieting Chu", href: "" },
          { name: "Zerui Cheng", href: "" },
          { name: "Yuan Xu", href: "" },
          { name: "Tian Xia", href: "" },
          { name: "Zirui Wang", href: "" },
          { name: "Tianneng Shi", href: "" },
          { name: "Jianzhu Yao", href: "" },
          { name: "Yilong Zhao", href: "" },
          { name: "Qizheng Zhang", href: "" },
          { name: "Charlie Ruan", href: "" },
          { name: "Zeyu Shen", href: "" },
          { name: "Kaiyuan Liu", href: "" },
          { name: "Runyuan He", href: "" },
          { name: "Dong Xing", href: "" },
          { name: "Zerui Li", href: "" },
          { name: "Zirong Zeng", href: "" },
          { name: "Yige Jiang", href: "" },
          { name: "Lufeng Cheng", href: "" },
          { name: "Ziyi Zhao", href: "" },
          { name: "Youran Sun", href: "" },
          { name: "Wesley Zheng", href: "" },
          { name: "Meiyuwang Zhang", href: "" },
          { name: "Ruyi Ji", href: "" },
          { name: "Xuechang Tu", href: "" },
          { name: "Zihan Zheng", href: "" },
          { name: "Zexing Chen", href: "" },
          { name: "Kangyang Zhou", href: "" },
          { name: "Zhaozi Wang", href: "" },
          { name: "Jingbang Chen", href: "" },

          { name: "Aleksandra Korolova", href: "" },
          { name: "Peter Henderson", href: "https://www.peterhenderson.co/" }, // :contentReference[oaicite:2]{index=2}
          { name: "Pramod Viswanath", href: "" },
          { name: "Vijay Ganesh", href: "" },
          { name: "Saining Xie", href: "" },
          { name: "Zhuang Liu", href: "" },
          { name: "Dawn Song", href: "https://dawnsong.io/" }, // :contentReference[oaicite:3]{index=3}
          { name: "Sewon Min", href: "https://www.sewonmin.com/" }, // :contentReference[oaicite:4]{index=4}
          { name: "Ion Stoica", href: "https://people.eecs.berkeley.edu/~istoica/" }, // :contentReference[oaicite:5]{index=5}
          { name: "Joseph E. Gonzalez", href: "https://people.eecs.berkeley.edu/~jegonzal/" }, // :contentReference[oaicite:6]{index=6}
          { name: "Jingbo Shang", href: "https://shangjingbo1226.github.io/" }, // :contentReference[oaicite:7]{index=7}
          { name: "Alvin Cheung", href: "https://people.eecs.berkeley.edu/~akcheung/" }, // :contentReference[oaicite:8]{index=8}
        ],
        arXiv: [
          {
            name: "arXiv",
            href: "https://arxiv.org/abs/2512.15699",
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
