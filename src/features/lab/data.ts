const institutions = {
  "CUHK-Shenzhen": "香港中文大学（深圳）",
  "CUHK-Shenzhen + SLAI": "香港中文大学（深圳）＋深圳河套学院",
  "Peking University": "北京大学",
  "Zhejiang University": "浙江大学",
  "Nankai University": "南开大学",
  "The University of Hong Kong": "香港大学",
  "Huaqiao University": "华侨大学",
  "South China Normal University": "华南师范大学",
  "Beijing Normal-Hong Kong Baptist University": "北师香港浸会大学",
  "Sun Yat-sen University": "中山大学",
  "University of Electronic Science and Technology of China": "电子科技大学",
  "Shenzhen MSU-BIT University": "深圳北理莫斯科大学",
  "Central South University": "中南大学",
  "Southern University of Science and Technology": "南方科技大学",
  "Tsinghua University": "清华大学",
} as const;

type Institution = keyof typeof institutions;
type Education = [degree: "UG" | "B.S." | "M.S.", school: Institution];

export interface LabPerson {
  name: string;
  zhName: string;
  period: string;
  affiliation: Institution;
  affiliationLabel?: string;
  zhAffiliationLabel?: string;
  background?: Education[];
  highlight?: string[];
  coadvisor?: string;
  zhCoadvisor?: string;
}

export function institutionName(institution: Institution, isChinese: boolean) {
  return isChinese ? institutions[institution] : institution;
}

export function educationLabel([degree, school]: Education, isChinese: boolean) {
  if (isChinese) {
    const prefix = { UG: "本科就读于", "B.S.": "本科毕业于", "M.S.": "硕士毕业于" };
    return prefix[degree] + institutionName(school, true);
  }
  return `${degree === "UG" ? "Undergraduate" : degree} at ${school}`;
}

type LabRole = "Ph.D. Students" | "M.Phil. Students" | "Research Assistants";

const students: { group: LabRole; people: LabPerson[] }[] = [
  {
    group: "Ph.D. Students",
    people: [
      {
        name: "Tianran Zhu",
        zhName: "祝天然",
        period: "Fall 2026 - present",
        affiliation: "CUHK-Shenzhen",
        background: [["B.S.", "Peking University"]],
        highlight: ["ICPC Gold", "NOI Silver"],
      },
      {
        name: "Yuanjin Zheng",
        zhName: "郑远金",
        period: "Fall 2026 - present",
        affiliation: "CUHK-Shenzhen + SLAI",
        background: [["B.S.", "Zhejiang University"]],
      },
      {
        name: "Minghao Li",
        zhName: "黎明昊",
        period: "Fall 2026 - present",
        affiliation: "CUHK-Shenzhen + SLAI",
        background: [
          ["B.S.", "Nankai University"],
          ["M.S.", "The University of Hong Kong"],
        ],
      },
      {
        name: "Yuyang Zhao",
        zhName: "赵雨扬",
        period: "Fall 2025 - present",
        affiliation: "CUHK-Shenzhen + SLAI",
        background: [["B.S.", "Huaqiao University"]],
        coadvisor: "Prof. Zhi-Quan (Tom) Luo",
        zhCoadvisor: "罗智泉教授",
        highlight: ["ICPC Gold", "NOI Silver"],
      },
      {
        name: "Zeyu Wang",
        zhName: "王泽宇",
        period: "Fall 2025 - present",
        affiliation: "Zhejiang University",
        coadvisor: "Prof. Can Wang",
        zhCoadvisor: "王灿教授",
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
        background: [["B.S.", "South China Normal University"]],
      },
      {
        name: "Jiajun Hou",
        zhName: "侯嘉俊",
        period: "Fall 2026 - present",
        affiliation: "CUHK-Shenzhen",
        background: [["B.S.", "Beijing Normal-Hong Kong Baptist University"]],
      },
      {
        name: "Zixuan Yu",
        zhName: "喻梓轩",
        period: "Fall 2026 - present",
        affiliation: "CUHK-Shenzhen",
        background: [["B.S.", "Sun Yat-sen University"]],
      },
      {
        name: "Yichun Wang",
        zhName: "王伊淳",
        period: "Fall 2026 - present",
        affiliation: "CUHK-Shenzhen",
        background: [["B.S.", "CUHK-Shenzhen"]],
      },
      {
        name: "Xinle Yang",
        zhName: "杨心乐",
        period: "Fall 2026 - present",
        affiliation: "CUHK-Shenzhen",
        background: [
          ["B.S.", "University of Electronic Science and Technology of China"],
        ],
      },
    ],
  },
  {
    group: "Research Assistants",
    people: [
      {
        name: "Mofei Zhou",
        zhName: "周莫非",
        period: "Spring 2027 - present",
        affiliation: "CUHK-Shenzhen",
        affiliationLabel: "",
        background: [["UG", "CUHK-Shenzhen"]],
        highlight: ["ICPC Gold", "ICPC WF Finalist"],
      },
      {
        name: "Jingtai Chen",
        zhName: "陈景泰",
        period: "Spring 2027 - present",
        affiliation: "Sun Yat-sen University",
        affiliationLabel: "",
        background: [["UG", "Sun Yat-sen University"]],
        highlight: [
          "CCPC Champion",
          "CCSP Champion × 2",
          "ICPC Gold",
          "ICPC WF Finalist",
        ],
      },
      {
        name: "Hao Wu",
        zhName: "吴浩",
        period: "Fall 2025 - Fall 2026",
        affiliation: "Zhejiang University",
        affiliationLabel: "Now incoming Ph.D. at Zhejiang University",
        zhAffiliationLabel: "即将赴浙江大学攻读博士学位",
        background: [["UG", "Zhejiang University"]],
        highlight: ["ICPC Gold"],
      },
      {
        name: "Sichen Wang",
        zhName: "王司晨",
        period: "Fall 2025 - present",
        affiliation: "Shenzhen MSU-BIT University",
        affiliationLabel: "",
        background: [["UG", "Shenzhen MSU-BIT University"]],
      },
      {
        name: "Jianian Chen",
        zhName: "陈嘉年",
        period: "Spring 2027 - present",
        affiliation: "CUHK-Shenzhen",
        affiliationLabel: "",
        background: [["UG", "CUHK-Shenzhen"]],
        highlight: ["ICPC Gold", "ICPC WF Finalist", "NOI Bronze"],
      },
      {
        name: "Jinrong Lai",
        zhName: "赖锦镕",
        period: "Fall 2026 - present",
        affiliation: "Central South University",
        affiliationLabel: "",
        background: [["UG", "Central South University"]],
        highlight: ["ICPC Gold", "NOI Silver"],
      },
      {
        name: "Zihao Xiong",
        zhName: "熊子豪",
        period: "Fall 2026 - present",
        affiliation: "Southern University of Science and Technology",
        affiliationLabel: "",
        background: [["UG", "Southern University of Science and Technology"]],
        highlight: ["NOI Silver"],
      },
      {
        name: "Shicheng Xiao",
        zhName: "肖士程",
        period: "Fall 2026 - present",
        affiliation: "CUHK-Shenzhen",
        affiliationLabel: "",
        background: [["B.S.", "Tsinghua University"], ["M.S.", "CUHK-Shenzhen"]],
        highlight: ["ICPC Gold", "NOI Silver"],
      },
      {
        name: "Weinuo Li",
        zhName: "黎伟诺",
        period: "Fall 2024 - Spring 2026",
        affiliation: "Zhejiang University",
        affiliationLabel: "Now at Yanfu Investments",
        zhAffiliationLabel: "现就职于衍复投资",
        background: [
          ["B.S.", "Zhejiang University"],
          ["M.S.", "Zhejiang University"],
        ],
        highlight: [
          "ICPC Champion",
          "ICPC Gold",
          "ICPC WF 10th",
        ],
      },
    ],
  },
];

const getPeople = (group: LabRole, names: string[]) => {
  const section = students.find((item) => item.group === group);
  if (!section) return [];
  return names
    .map((name) => section.people.find((person) => person.name === name))
    .filter((person): person is LabPerson => Boolean(person));
};

export const labAlumni = getPeople("Research Assistants", ["Weinuo Li", "Hao Wu"]);

export const labBranches = [
  {
    group: "Algo Branch",
    zhGroup: "算法理论部",
    directions: [
      {
        title: "Classical Algorithms and Data Structures",
        body: "Dynamic graph algorithms, online algorithms, linear system solvers, and other related topics in theoretical computer science.",
      },
      {
        title: "Graph Databases and Graph Data Mining",
        body: "Maintaining and querying large graphs as they change, from counting patterns in temporal and bipartite networks to mining dense subgraphs and subhypergraphs, analyzing signed networks, and controlling influence spread. Applications include recommendation, community discovery, and graph search.",
      },
      {
        title: "Learning-Augmented Algorithms",
        body: "Prediction-enhanced data structures and algorithms with both theoretical guarantees and practical performance, such as binary search trees and B-trees.",
      },
    ],
    zhDirections: [
      {
        title: "传统算法与数据结构",
        body: "动态图算法、在线算法、线性方程组求解等理论计算机科学问题。",
      },
      {
        title: "图数据库与图数据挖掘",
        body: "面向持续更新的大规模网络，研究动态图维护与索引、时序图和二部图中的模式计数、稠密子图与超图挖掘，以及有符号网络分析和传播干预。应用包括推荐系统、社区发现和图查询。",
      },
      {
        title: "学习增强算法",
        body: "兼具理论保证和实际表现的由预测强化的数据结构、算法，如二叉搜索树、B树等。",
      },
    ],
    id: "algo",
    sections: [
      {
        group: "Ph.D. Students",
        people: getPeople("Ph.D. Students", [
          "Tianran Zhu",
          "Zeyu Wang",
        ]),
      },
      {
        group: "Research Assistants",
        people: getPeople("Research Assistants", [
          "Mofei Zhou",
          "Jingtai Chen",
          "Shicheng Xiao",
          "Zihao Xiong",
          "Sichen Wang",
        ]),
      },
    ],
  },
  {
    group: "AI Branch",
    zhGroup: "人工智能部",
    directions: [
      {
        title: "Model Training and Learning Theory",
        body: "Studying large-model training and post-training, reinforcement and online learning, and feedback-driven prompt optimization. We investigate how code and training data shape reasoning and performance across tasks.",
      },
      {
        title: "Verifiable Reasoning and Agent Evaluation",
        body: "Building evaluation benchmarks for mathematical reasoning, formal theorem proving, and coding agents. We study reasoning reliability, analysis of AI-generated content, and safety risks from agent tools and skills.",
      },
      {
        title: "AI for Retrieval and Data Systems",
        body: "Making large document collections easier to search through contextual indexing, retrieval, and reranking. We also study retrieval-augmented generation, knowledge graphs, and AI methods for databases and data mining.",
      },
      {
        title: "AI Systems and Industrial Collaboration",
        body: "Exploring lightweight models, efficient inference, and kernel optimization on domestic hardware, with attention to throughput and cost in practical deployments.",
      },
    ],
    zhDirections: [
      {
        title: "模型训练与学习理论",
        body: "研究大模型训练与后训练、强化学习、在线学习和反馈驱动的提示优化，分析代码与训练数据如何影响模型推理及其在不同任务中的表现。",
      },
      {
        title: "可验证推理与智能体评测",
        body: "构建面向数学推理、形式化定理证明和编程智能体的评测基准，研究大模型推理的可靠性、人工智能生成内容的分析，以及智能体使用工具与技能时的安全风险。",
      },
      {
        title: "人工智能检索与数据系统",
        body: "面向大规模文档集合，研究保留上下文的索引、检索与重排序，也探索检索增强生成、知识图谱，以及人工智能在数据库与数据挖掘中的应用。",
      },
      {
        title: "人工智能系统与产业合作",
        body: "研究轻量模型与高效推理，探索国产芯片上的算法适配和算子优化，关注实际部署中的吞吐与成本。",
      },
    ],
    id: "ai",
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
          "Xinle Yang",
        ]),
      },
      {
        group: "Research Assistants",
        people: getPeople("Research Assistants", [
          "Jianian Chen",
          "Jinrong Lai",
        ]),
      },
    ],
  },
] as const;

export type LabBranchId = (typeof labBranches)[number]["id"];
