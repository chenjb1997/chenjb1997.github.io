import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import profilePic from './chenjb.jpg';

const Home = () => {
  const [isNewsExpanded, setIsNewsExpanded] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-2">陈靖邦 Jingbang Chen</h1>
      
      <div className="flex items-center gap-4 text-base mb-8">
        <a href="/chenjb_cv.pdf" download className="inline-flex items-center gap-2 text-blue-600 hover:text-yellow-500">
          <FileText className="w-4 h-4" />
          <span>[CV]</span>
        </a>
        <span className="text-gray-500">Last updated Mar. 2025</span>
      </div>

      <div className="prose max-w-none text-lg">
        <div className="mb-10">
          <img
            src={profilePic}
            alt="Jingbang Chen at The 2025 Universal Cup Finals"
            className="float-right w-48 max-w-[45%] rounded-lg shadow-md ml-4 mb-2"
          />
          <p className="text-gray-900 leading-relaxed">
            I am a last-year PhD student in the{' '}
            <a href="https://algcomp.uwaterloo.ca/" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">
              Algorithms &amp; Complexity Group
            </a>{' '}
            of{' '}
            <a href="https://uwaterloo.ca" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">
              University of Waterloo
            </a>{' '}starting in Winter 2023. I am fortunate to be advised by{' '}
            <a href="https://www.cs.cmu.edu/~yangp/" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">
              Richard Peng
            </a>
            . Prior to this, I received my Master at{' '}
            <a href="https://www.gatech.edu/" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">
              Georgia Institute of Technology
            </a>{' '}and B.Eng (Honors) at{' '}
            <a href="https://www.zju.edu.cn/" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">
              Zhejiang University
            </a>{' '}under supervision of{' '}
            <a href="https://person.zju.edu.cn/wangcan" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">
              Can Wang
            </a>
            .
          </p>

          <p className="text-gray-900 leading-relaxed mt-6">
            My research revolves around the design, analysis, and implementation of provably efficient algorithms and data structures, with a focus on graphs.
          </p>

          <p className="text-gray-900 leading-relaxed mt-6">
            I am highly involved with Competitive Programming activities. Previously, I competed representing Zhejiang University and Georgia Tech in 2017&nbsp;-&nbsp;2021, participating in ICPC World Finals 2018 (Beijing), 2022 (Egypt), winning ICPC regional champion titles along with several gold medals. I started helping Egyptian Olympiad in Informatics (EOI) since 2023. And I also have served as the chief judge for several ICPC Asia regionals and the coach of training camps including{' '}
            <a href="https://www.cecs.ucf.edu/NAC-NAPC/" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">
              North American Programming Camp (NAPC)
            </a>. I am also the founder and co-president of the{' '}
            <a href="https://ucup.ac/" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">
              Universal Cup
            </a>.
          </p>

          <p className="text-gray-900 leading-relaxed mt-6">
            When not thinking about problems, I enjoy playing table tennis. Currently, I am using Fan Zhendong Super ALC with Dignics&nbsp;09C on front and Dignics&nbsp;64 on back.
          </p>
        </div>

        {/* Education */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-4">Education</h2>
          <ul className="space-y-4 text-lg">
            <li className="flex flex-col md:flex-row md:justify-between">
              <div>
                <div className="font-medium text-gray-900">Ph.D., Computer Science</div>
                <div className="text-gray-600">
                  <a href="https://uwaterloo.ca" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">
                    University of Waterloo
                  </a>, Waterloo
                </div>
              </div>
              <div className="text-gray-600 whitespace-nowrap">2023&nbsp;-&nbsp;Current</div>
            </li>
            <li className="flex flex-col md:flex-row md:justify-between">
              <div>
                <div className="font-medium text-gray-900">M.S., Computer Science</div>
                <div className="text-gray-600">
                  <a href="https://www.gatech.edu/" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">
                    Georgia Institute of Technology
                  </a>, Atlanta
                </div>
              </div>
              <div className="text-gray-600 whitespace-nowrap">2020&nbsp;-&nbsp;2022</div>
            </li>
            <li className="flex flex-col md:flex-row md:justify-between">
              <div>
                <div className="font-medium text-gray-900">B.Eng. (Honors), Pursuit Science Class</div>
                <div className="text-gray-600">
                  <a href="http://ckc.zju.edu.cn/" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">
                    Chu Kochen Honors College
                  </a>{' '}(Joint Program with{' '}
                  <a href="http://www.cs.zju.edu.cn/" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">
                    College of Computer Science and Technology
                  </a>),{' '}
                  <a href="https://www.zju.edu.cn/" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">
                    Zhejiang University
                  </a>, Hangzhou
                </div>
              </div>
              <div className="text-gray-600 whitespace-nowrap">2016&nbsp;-&nbsp;2020</div>
            </li>
            <li className="flex flex-col md:flex-row md:justify-between">
              <div>
                <div className="font-medium text-gray-900">High School</div>
                <div className="text-gray-600">
                  <a href="https://www.gdgzez.com.cn/" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">
                    Guangzhou No.2 High School
                  </a>, Guangzhou
                </div>
              </div>
              <div className="text-gray-600 whitespace-nowrap">2010&nbsp;-&nbsp;2016</div>
            </li>
          </ul>
        </div>

        {/* News */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-4">News</h2>
          <div className="md:hidden">
            <button
              onClick={() => setIsNewsExpanded(!isNewsExpanded)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow mb-4"
            >
              <span className="font-medium text-gray-900">
                {isNewsExpanded ? 'Show Less' : 'View All News'}
              </span>
              {isNewsExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
          <ul className={`list-disc pl-6 space-y-3 text-lg text-gray-900 ${!isNewsExpanded ? 'md:block hidden' : ''}`}>
            <li>
              <span className="font-medium">Mar. 2025:</span> Prof.&nbsp;
              <a href="https://chenhao-ma.github.io/" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">
                Chenhao Ma
              </a>{' '}
              and I are looking for 1&nbsp;-&nbsp;2 highly self‑motivated PhD students with strong background in competitive programming (e.g., ICPC World Finalist, ICPC Regional Top&nbsp;10, China NOI Medalist, Codeforces Rating&nbsp;&ge;&nbsp;2400, …) and have great interests in research. Preferably, we hope candidates can also have research experience but this is not necessary. If you are interested in working with us, please feel free to contact either of us through email or WeChat. Please also check the{' '}
              <a href="https://chenhao-ma.github.io/recruit.html" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">
                recruit
              </a>{' '}page for possible related algorithm‑design topics.
            </li>
            <li>
              <span className="font-medium">Feb. 2025:</span> Our paper "Efficient Historical Butterfly Counting in Large Temporal Bipartite Networks via Graph Structure‑aware Index" is accepted by the 51st International Conference on Very Large Data Bases (VLDB&nbsp;2025).
            </li>
            <li>
              <span className="font-medium">Jan. 2025:</span> Although many things are still under processing, if everything goes through (I really hope so), I will be joining the{' '}
              <a href="https://sds.cuhk.edu.cn/" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">
                School of Data Science (SDS)
              </a>{' '}at{' '}
              <a href="https://www.cuhk.edu.cn/" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">
                The Chinese University of Hong Kong, Shenzhen
              </a>{' '}after my graduation. I will be working as a research assistant professor in the first one or many terms.
            </li>
          </ul>
        </div>

        {/* Selected Publications */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-4">Selected Publications</h2>
          <ul className="space-y-6 text-lg">
            {/* Publication 1 */}
            <li>
              <div className="font-medium mb-1">Efficient Historical Butterfly Counting in Large Temporal Bipartite Networks via Graph Structure‑aware Index</div>
              <div className="text-gray-700"><a href="https://joyemang33.github.io/" className="text-blue-600 hover:text-yellow-500 no-underline">Qiuyang Mang</a>*, <span className="font-bold">Jingbang Chen</span>*, <a href="https://hehezhou.github.io/" className="text-blue-600 hover:text-yellow-500 no-underline">Hangrui Zhou</a>*, <a href="https://sites.google.com/view/ygao2606/home" className="text-blue-600 hover:text-yellow-500 no-underline">Yu Gao</a>, <a href="https://jaylzhou.github.io/" className="text-blue-600 hover:text-yellow-500 no-underline">Yingli Zhou</a>, <a href="https://qoj.ac/" className="text-blue-600 hover:text-yellow-500 no-underline">Qingyu Shi</a>, <a href="https://www.cs.cmu.edu/~yangp/" className="text-blue-600 hover:text-yellow-500 no-underline">Richard Peng</a>, <a href="https://fangyixiang.github.io/" className="text-blue-600 hover:text-yellow-500 no-underline">Yixiang Fang</a>, <a href="https://chenhao-ma.github.io/" className="text-blue-600 hover:text-yellow-500 no-underline">Chenhao Ma</a></div>
              <div className="text-gray-600 mt-1">International Conference on Very Large Data Bases (VLDB&nbsp;2025)</div>
              <div className="mt-1">
                <a href="https://arxiv.org/abs/2406.00344" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">arXiv</a>
              </div>
            </li>
            {/* Publication 2 */}
            <li>
              <div className="font-medium mb-1">Scalable Algorithm for Finding Balanced Subgraphs with Tolerance in Signed Networks</div>
              <div className="text-gray-700"><span className="font-bold">Jingbang Chen</span>*, <a href="https://joyemang33.github.io/" className="text-blue-600 hover:text-yellow-500 no-underline">Qiuyang Mang</a>*, <a href="https://hehezhou.github.io/" className="text-blue-600 hover:text-yellow-500 no-underline">Hangrui Zhou</a>*, <a href="https://www.cs.cmu.edu/~yangp/" className="text-blue-600 hover:text-yellow-500 no-underline">Richard Peng</a>, <a href="https://sites.google.com/view/ygao2606/home" className="text-blue-600 hover:text-yellow-500 no-underline">Yu Gao</a>, <a href="https://chenhao-ma.github.io/" className="text-blue-600 hover:text-yellow-500 no-underline">Chenhao Ma</a></div>
              <div className="text-gray-600 mt-1">ACM SIGKDD Conference on Knowledge Discovery and Data Mining (KDD&nbsp;2024)</div>
              <div className="mt-1">
                <a href="https://arxiv.org/abs/2402.05006" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">arXiv</a>
              </div>
            </li>
            {/* Publication 3 */}
            <li>
              <div className="font-medium mb-1">Distance Queries over Dynamic Interval Graphs</div>
              <div className="text-gray-700"><span className="font-bold">Jingbang Chen</span>, <a href="https://web.cs.dal.ca/~mhe/" className="text-blue-600 hover:text-yellow-500 no-underline">Meng He</a>, <a href="https://cs.uwaterloo.ca/~imunro/" className="text-blue-600 hover:text-yellow-500 no-underline">J. Ian Munro</a>, <a href="https://www.cs.cmu.edu/~yangp/" className="text-blue-600 hover:text-yellow-500 no-underline">Richard Peng</a>, <a href="#" className="text-blue-600 hover:text-yellow-500 no-underline">Kaiyu Wu</a>, <a href="https://scholar.google.com/citations?user=0ZF-JdcAAAAJ&hl=en" className="text-blue-600 hover:text-yellow-500 no-underline">Daniel J. Zhang</a></div>
              <div className="text-gray-600 mt-1">International Symposium on Algorithms and Computation (ISAAC&nbsp;2023) and Computational Geometry: Theory and Applications (Volume&nbsp;122)</div>
              <div className="mt-1">
                <a href="https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ISAAC.2023.18" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">Proceeding</a>{' · '}
                <a href="https://www.sciencedirect.com/science/article/pii/S0925772124000257" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">Journal</a>
              </div>
            </li>
            {/* Publication 4 */}
            <li>
              <div className="font-medium mb-1">Exponential Convergence of Sinkhorn Under Regularization Scheduling</div>
              <div className="text-gray-700"><span className="font-bold">Jingbang Chen</span>, <a href="https://lic225.github.io/" className="text-blue-600 hover:text-yellow-500 no-underline">Li Chen</a>, <a href="https://yangpliu.github.io/index.html" className="text-blue-600 hover:text-yellow-500 no-underline">Yang P. Liu</a>, <a href="https://www.cs.cmu.edu/~yangp/" className="text-blue-600 hover:text-yellow-500 no-underline">Richard Peng</a>, <a href="https://arvindr9.github.io/" className="text-blue-600 hover:text-yellow-500 no-underline">Arvind Ramaswami</a></div>
              <div className="text-gray-600 mt-1">SIAM Conference on Applied and Computational Discrete Algorithms (ACDA&nbsp;2023)</div>
              <div className="mt-1">
                <a href="https://arxiv.org/abs/2207.00736" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">arXiv</a>{' · '}
                <a href="https://epubs.siam.org/doi/10.1137/1.9781611977714.16" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">Proceeding</a>
              </div>
            </li>
            {/* Publication 5 */}
            <li>
              <div className="font-medium mb-1">Hardness of Graph‑Structured Algebraic and Symbolic Problems</div>
              <div className="text-gray-700"><span className="font-bold">Jingbang Chen</span>, <a href="https://sites.google.com/view/ygao2606/home" className="text-blue-600 hover:text-yellow-500 no-underline">Yu Gao</a>, <a href="https://luotuoqingshan.github.io/" className="text-blue-600 hover:text-yellow-500 no-underline">Yufan Huang</a>, <a href="https://www.cs.cmu.edu/~yangp/" className="text-blue-600 hover:text-yellow-500 no-underline">Richard Peng</a>, <a href="#" className="text-blue-600 hover:text-yellow-500 no-underline">Runze Wang</a></div>
              <div className="text-gray-600 mt-1">Algorithms and Data Structures (WADS&nbsp;2023)</div>
              <div className="mt-1">
                <a href="https://arxiv.org/abs/2109.12736" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">arXiv</a>{' · '}
                <a href="https://link.springer.com/chapter/10.1007/978-3-031-38906-1_16" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">Proceeding</a>
              </div>
            </li>
            {/* Publication 6 */}
            <li>
              <div className="font-medium mb-1">Fast Adaptively Weighted Matrix Factorization for Recommendation with Implicit Feedback</div>
              <div className="text-gray-700"><a href="https://jiawei-chen.github.io/" className="text-blue-600 hover:text-yellow-500 no-underline">Jiawei Chen</a>, <a href="https://person.zju.edu.cn/wangcan" className="text-blue-600 hover:text-yellow-500 no-underline">Can Wang</a>, <a href="" className="text-blue-600 hover:text-yellow-500 no-underline">Sheng Zhou</a>, <a href="https://scholar.google.com/citations?user=0bAHR_QAAAAJ&hl=en" className="text-blue-600 hover:text-yellow-500 no-underline">Qihao Shi</a>, <span className="font-bold">Jingbang Chen</span>, <a href="https://openreview.net/profile?id=~Yan_Feng1" className="text-blue-600 hover:text-yellow-500 no-underline">Yan Feng</a>, <a href="" className="text-blue-600 hover:text-yellow-500 no-underline">Chun Chen</a></div>
              <div className="text-gray-600 mt-1">AAAI Conference on Artificial Intelligence (AAAI&nbsp;2020)</div>
              <div className="mt-1">
                <a href="https://arxiv.org/abs/2003.01892" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">arXiv</a>{' · '}
                <a href="https://ojs.aaai.org/index.php/AAAI/article/view/5751" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">Proceeding</a>
              </div>
            </li>
          </ul>
        </div>

        {/* Manuscripts */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-4">Manuscripts</h2>
          <ul className="space-y-6 text-lg">
            <li>
              <div className="font-medium mb-1">Nearly Optimal Internal Dictionary Matching</div>
              <div className="text-gray-700"><span className="font-bold">Jingbang Chen</span>, <a href="https://dblp.org/pid/365/4525.html" className="text-blue-600 hover:text-yellow-500 no-underline">Jiangqi Dai</a>, <a href="https://joyemang33.github.io/" className="text-blue-600 hover:text-yellow-500 no-underline">Qiuyang Mang</a>, <a href="https://qoj.ac/" className="text-blue-600 hover:text-yellow-500 no-underline">Qingyu Shi</a>, <a href="https://scholar.google.com/citations?user=HGTHVUgAAAAJ&hl" className="text-blue-600 hover:text-yellow-500 no-underline">Tingqiang Xu</a></div>
              <div className="text-gray-600 mt-1">2024</div>
              <div className="mt-1">
                <a href="https://arxiv.org/abs/2312.11873" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">arXiv</a>
              </div>
            </li>
            <li>
              <div className="font-medium mb-1">Scalable Algorithm for Sandpile Prediction</div>
              <div className="text-gray-700"><span className="font-bold">Jingbang Chen</span>*, <a href="#" className="text-blue-600 hover:text-yellow-500 no-underline">Ruinian Chang</a>*, <a href="https://scholar.google.com/citations?user=sNENLo8AAAAJ&hl=en" className="text-blue-600 hover:text-yellow-500 no-underline">Zeyu Zheng</a>*, <a href="https://qoj.ac/" className="text-blue-600 hover:text-yellow-500 no-underline">Qingyu Shi</a>, <a href="https://cs.uwaterloo.ca/~imunro/" className="text-blue-600 hover:text-yellow-500 no-underline">J. Ian Munro</a>, <a href="https://www.cs.cmu.edu/~yangp/" className="text-blue-600 hover:text-yellow-500 no-underline">Richard Peng</a></div>
              <div className="text-gray-600 mt-1">2023</div>
              <div className="mt-1">
                <a href="https://arxiv.org/abs/2307.07711" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">arXiv</a>
              </div>
            </li>
            <li>
              <div className="font-medium mb-1">On the Power of Learning‑Augmented Search Trees</div>
              <div className="text-gray-700"><span className="font-bold">Jingbang Chen</span>*, <a href="https://youki-cao.github.io/" className="text-blue-600 hover:text-yellow-500 no-underline">Xinyuan Cao</a>*, <a href="https://csd.cmu.edu/people/doctoral-student/alicia-stepin" className="text-blue-600 hover:text-yellow-500 no-underline">Alicia Stepin</a>, <a href="https://lic225.github.io/" className="text-blue-600 hover:text-yellow-500 no-underline">Li Chen</a></div>
              <div className="text-gray-600 mt-1">2022</div>
              <div className="mt-1">
                <a href="https://arxiv.org/abs/2211.09251" className="text-blue-600 hover:text-yellow-500 no-underline" target="_blank" rel="noopener noreferrer">arXiv</a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
