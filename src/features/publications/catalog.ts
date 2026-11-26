import type { TFunction } from "i18next";

interface Author {
  name: string;
  href: string;
}

export interface ResearchWork {
  title: string;
  authors: Author[];
  arXiv: { name: string; href: string }[];
  venue?: string;
  venueLabel?: string;
  coFirstAuthors?: string[];
}

export interface SelectedPublicationsItem {
  year: string;
  publications: (ResearchWork & { venue: string })[];
}

export interface ManuscriptGroup {
  year: string;
  publications: ResearchWork[];
}

export function getSelectedPublications(t: TFunction): SelectedPublicationsItem[] {
  return [
    {
      year: t("year-2027"),
      publications: [
        {
          title: t("SelectedPublications-2027-publications-1-title"),
          authors: [
            { name: "Jingbang Chen", href: "" },
            { name: "Weinuo Li", href: "#" },
            { name: "Yingli Zhou", href: "https://jaylzhou.github.io/" },
            { name: "Hao Wu", href: "" },
            { name: "Can Wang", href: "https://person.zju.edu.cn/wangcan" },
            { name: "Yixiang Fang", href: "https://fangyixiang.github.io/" },
            { name: "Chenhao Ma", href: "https://chenhao-ma.github.io/" },
          ],
          venue: t("SelectedPublications-2027-publications-1-venue"),
          venueLabel: "ICDE 2027",
          coFirstAuthors: ["Jingbang Chen", "Weinuo Li"],
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2605.26235",
            },
          ],
        },
        {
          title: t("SelectedPublications-2027-lbr-title"),
          authors: [
            { name: "Hongchen Li", href: "https://zlstwebsite.github.io/Zlst/author/hongchen-li/" },
            { name: "Bohao Wang", href: "https://zlstwebsite.github.io/Zlst/author/bohao-wang/" },
            { name: "Jingbang Chen", href: "" },
            { name: "Weiqin Yang", href: "https://tiny-snow.github.io/" },
            { name: "Hang Pan", href: "https://github.com/HungPaan" },
            { name: "Bingde Hu", href: "" },
            { name: "Can Wang", href: "https://person.zju.edu.cn/wangcan" },
            { name: "Jiawei Chen", href: "https://jiawei-chen.github.io/" },
          ],
          venue: t("SelectedPublications-2027-lbr-venue"),
          arXiv: [
            { name: "arXiv", href: "https://arxiv.org/abs/2607.04270" },
          ],
        },
      ],
    },
    {
      year: t("year-2026"),
      publications: [
        {
          title: t("SelectedPublications-2026-publications-1-title"),
          authors: [
            { name: "Jingbang Chen", href: "" },
            { name: "Weinuo Li", href: "#" },
            { name: "Yingli Zhou", href: "https://jaylzhou.github.io/" },
            { name: "Hangrui Zhou", href: "https://hehezhou.github.io/" },
            { name: "Qiuyang Mang", href: "https://joyemang33.github.io/" },
            { name: "Can Wang", href: "https://person.zju.edu.cn/wangcan" },
            { name: "Yixiang Fang", href: "https://fangyixiang.github.io/" },
            { name: "Chenhao Ma", href: "https://chenhao-ma.github.io/" },
          ],
          venue: t("SelectedPublications-2026-publications-1-venue"),
          venueLabel: "VLDB 2026",
          coFirstAuthors: ["Jingbang Chen", "Weinuo Li", "Yingli Zhou"],
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2505.10471",
            },
            {
              name: "Proceeding",
              href: "https://doi.org/10.14778/3785297.3785301",
            },
          ],
        },
        {
          title: t("Manuscripts-2024-title"),
          authors: [
            { name: "Jingbang Chen", href: "" },
            { name: "Jiangqi Dai", href: "https://dblp.org/pid/365/4525.html" },
            { name: "Qiuyang Mang", href: "https://joyemang33.github.io/" },
            { name: "Qingyu Shi", href: "https://qoj.ac/" },
            {
              name: "Tingqiang Xu",
              href: "https://scholar.google.com/citations?user=HGTHVUgAAAAJ&hl",
            },
          ],
          venue: t("European Symposium on Algorithms (ESA 2026)"),
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2312.11873",
            },
            {
              name: "Proceeding",
              href: "https://doi.org/10.4230/LIPIcs.ESA.2026.58",
            },
          ],
        },
        {
          title: t("SelectedPublications-2026-publications-isaac-title"),
          authors: [
            { name: "Ryan Bai", href: "" },
            { name: "Jingbang Chen (Alphabetical Order)", href: "" },
            { name: "Meng He", href: "https://web.cs.dal.ca/~mhe/" },
            { name: "Richard Peng", href: "https://www.cs.cmu.edu/~yangp/" },
            { name: "Kaiyu Wu", href: "#" },
          ],
          venue: t("SelectedPublications-2026-publications-isaac-venue"),
          arXiv: [],
        },
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
          venue: t("Annual Meeting of the Association for Computational Linguistics - Main Conference (ACL 2026)"),
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2510.07774",
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
          venue: t("The Web Conference (WWW 2026)"),
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2601.18432",
            },
            {
              name: "Proceeding",
              href: "https://doi.org/10.1145/3774904.3792717",
            },
          ],
        },
        {
          title: t("BEAR: Towards Beam-Search-Aware Optimization for Recommendation with Large Language Models"),
          authors: [
            { name: "Weiqin Yang", href: "https://tiny-snow.github.io/" }, // personal homepage :contentReference[oaicite:1]{index=1}
            { name: "Bohao Wang", href: "" }, // no clear personal homepage found; Google Scholar available :contentReference[oaicite:2]{index=2}
            { name: "Zhenxiang Xu", href: "" }, // no clear personal homepage found; author info on paper / ResearchGate available :contentReference[oaicite:3]{index=3}
            { name: "Jiawei Chen", href: "https://jiawei-chen.github.io/" }, // personal homepage :contentReference[oaicite:4]{index=4}
            { name: "Shengjia Zhang", href: "" }, // no clear personal homepage found; ACM / ResearchGate profile available :contentReference[oaicite:5]{index=5}
            { name: "Jingbang Chen", href: "" },
            { name: "Canghong Jin", href: "" }, // no clear personal homepage found; ResearchGate available :contentReference[oaicite:6]{index=6}
            { name: "Can Wang", href: "https://person.zju.edu.cn/wangcan" }, // personal homepage / institutional page :contentReference[oaicite:7]{index=7}
          ],
          venue: t("International ACM SIGIR Conference on Research and Development in Information Retrieval (SIGIR 2026)"),
          arXiv: [
            {
              name: "arXiv",
              href: "https://arxiv.org/abs/2601.22925",
            },
          ],
        },
        {
          title: t("FrontierCS: Evolving Challenges for Evolving Intelligence"),
          authors: [
            { name: "Qiuyang Mang", href: "https://joyemang33.github.io/" },
            { name: "...", href: "" },
            { name: "Jingbang Chen", href: "" },
            { name: "Aleksandra Korolova", href: "" },
            { name: "Peter Henderson", href: "https://www.peterhenderson.co/" },
            { name: "Pramod Viswanath", href: "" },
            { name: "Vijay Ganesh", href: "" },
            { name: "Saining Xie", href: "" },
            { name: "Zhuang Liu", href: "" },
            { name: "Dawn Song", href: "https://dawnsong.io/" },
            { name: "Sewon Min", href: "https://www.sewonmin.com/" },
            { name: "Ion Stoica", href: "https://people.eecs.berkeley.edu/~istoica/" },
            { name: "Joseph E. Gonzalez", href: "https://people.eecs.berkeley.edu/~jegonzal/" },
            { name: "Jingbo Shang", href: "https://shangjingbo1226.github.io/" },
            { name: "Alvin Cheung", href: "https://people.eecs.berkeley.edu/~akcheung/" },
          ],
          venue: t("International Conference on Machine Learning (ICML 2026)"),
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
      year: t("year-2025"),
      publications: [
        {
          title: t("SelectedPublications-2025-publications-1-title"),
          authors: [
            { name: "Jingbang Chen", href: "" },
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
            {
              name: "Proceeding",
              href: "https://proceedings.mlr.press/v267/chen25e.html",
            },
          ],
        },
        {
          title: t("SelectedPublications-2025-publications-2-title"),
          authors: [
            { name: "Qiuyang Mang", href: "https://joyemang33.github.io/" },
            { name: "Jingbang Chen (Co-first Author)", href: "" },
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
            {
              name: "Proceeding",
              href: "https://doi.org/10.14778/3725688.3725693",
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
            { name: "Jingbang Chen", href: "" },
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
            {
              name: "Proceeding",
              href: "https://doi.org/10.1145/3637528.3671674",
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
            { name: "Jingbang Chen", href: "" },
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
            { name: "Jingbang Chen", href: "" },
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
            { name: "Jingbang Chen", href: "" },
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
}

export function getManuscripts(t: TFunction): ManuscriptGroup[] {
  return [
    {
      year: "2026",
      publications: [
        {
          title: t("Manuscripts-2026-contra-title"),
          authors: [
            { name: "Jiajun Hou", href: "" },
            { name: "Jingbang Chen*", href: "" },
          ],
          arXiv: [
            { name: "arXiv", href: "https://arxiv.org/abs/2611.34366" },
            { name: "GitHub", href: "https://github.com/SStan1/ConTra-Context-That-Travels" },
          ],
        },
        {
          title: t("Manuscripts-2026-influence-minimization-title"),
          authors: [
            { name: "Jingbang Chen*", href: "" },
            { name: "Junyao Wang", href: "https://juny.wang/" },
          ],
          arXiv: [
            { name: "arXiv", href: "https://arxiv.org/abs/2611.15949" },
          ],
        },
        {
          title: t("Manuscripts-2026-reuf2f-title"),
          authors: [
            {
              name: "Zeyu Zheng",
              href: "https://zeyu-zheng.github.io/",
            },
            { name: "Yiyang Liu", href: "https://deep0thinking.com/" },
            { name: "Yuyang Zhao", href: "https://github.com/astrainfinita" },
            { name: "...", href: "" },
            { name: "Prasad Tetali", href: "https://tetali.github.io/" },
            { name: "Jingbang Chen*", href: "" },
            { name: "Sean Welleck", href: "https://wellecks.com/" },
          ],
          arXiv: [
            { name: "arXiv", href: "https://arxiv.org/abs/2610.27046" },
            { name: "GitHub", href: "https://github.com/cmu-l3/reuF2F" },
          ],
        },
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
}
