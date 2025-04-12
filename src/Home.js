import profilePic from './chenjb.jpg';  // Update the path to where your image is stored
import React, { useState } from 'react';
import './Home.css';  // Import the CSS file

const Home = () => {
    const [visibleAbstractIndex, setVisibleAbstractIndex] = useState(null);

    const publications = [
        {
            title: "Efficient Historical Butterfly Counting in Large Temporal Bipartite Networks via Graph Structure-aware Index",
            authors: "Qiuyang Mang*, Jingbang Chen*, Hangrui Zhou*, Yu Gao, Yingli Zhou, Qingyu Shi, Richard Peng, Yixiang Fang, Chenhao Ma",
            year: "International Conference on Very Large Data Bases (VLDB 2025)",
            links: [
                { text: "arXiv", url: "https://arxiv.org/abs/2406.00344" }
            ]
        },
        {
            title: "Scalable Algorithm for Finding Balanced Subgraphs with Tolerance in Signed Networks",
            authors: "Jingbang Chen*, Qiuyang Mang*, Hangrui Zhou*, Richard Peng, Yu Gao, Chenhao Ma",
            year: "ACM SIGKDD Conference on Knowledge Discovery and Data Mining (KDD 2024)",
            links: [
                { text: "arXiv", url: "https://arxiv.org/abs/2402.05006" }
            ]
        },
        {
            title: "Distance Queries over Dynamic Interval Graphs",
            authors: "Jingbang Chen, Meng He, J. Ian Munro, Richard Peng, Kaiyu Wu, Daniel J. Zhang",
            year: "International Symposium on Algorithms and Computation (ISAAC 2023) and Computational Geometry: Theory and Applications (Volume 122)",
            links: [
                { text: "Proceeding", url: "https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ISAAC.2023.18" },
                { text: "Journal", url: "https://www.sciencedirect.com/science/article/pii/S0925772124000257" }
            ]
        },
        {
            title: "Exponential Convergence of Sinkhorn Under Regularization Scheduling",
            authors: "Jingbang Chen, Li Chen, Yang P. Liu, Richard Peng, Arvind Ramaswami",
            year: "SIAM Conference on Applied and Computational Discrete Algorithms (ACDA 2023)",
            links: [
                { text: "arXiv", url: "https://arxiv.org/abs/2207.00736" },
                { text: "Proceeding", url: "https://epubs.siam.org/doi/10.1137/1.9781611977714.16" }
            ]
        },
        {
            title: "Hardness of Graph-Structured Algebraic and Symbolic Problems",
            authors: "Jingbang Chen, Yu Gao, Yufan Huang, Richard Peng, Runze Wang",
            year: "Algorithms and Data Structures (WADS 2023)",
            links: [
                { text: "arXiv", url: "https://arxiv.org/abs/2109.12736" },
                { text: "Proceeding", url: "https://link.springer.com/chapter/10.1007/978-3-031-38906-1_16" }
            ]
        },
        {
            title: "Fast Adaptively Weighted Matrix Factorization for Recommendation with Implicit Feedback",
            authors: "Jiawei Chen, Can Wang, Sheng Zhou, Qihao Shi, Jingbang Chen, Yan Feng, Chun Chen",
            year: "AAAI Conference on Artificial Intelligence (AAAI 2020)",
            links: [
                { text: "arXiv", url: "https://arxiv.org/abs/2003.01892" },
                { text: "Proceeding", url: "https://ojs.aaai.org/index.php/AAAI/article/view/5751" }
            ]
        },
    ];

    const preprints = [
        {
            title: "Nearly Optimal Internal Dictionary Matching",
            authors: "Jingbang Chen, Jiangqi Dai, Qiuyang Mang, Qingyu Shi, Tingqiang Xu",
            year: "2024",
            links: [
                { text: "arXiv", url: "https://arxiv.org/abs/2312.11873" }
            ]
        },
        {
            title: "Scalable Algorithm for Sandpile Prediction",
            authors: "Jingbang Chen*, Ruinian Chang*, Zeyu Zheng*, Qingyu Shi, J. Ian Munro, Richard Peng",
            year: "2023",
            links: [
                { text: "arXiv", url: "https://arxiv.org/abs/2307.07711" }
            ]
        },
        {
            title: "On the Power of Learning-Augmented Search Trees",
            authors: "Jingbang Chen*, Xinyuan Cao*, Alicia Stepin, Li Chen",
            year: "2022",
            links: [
                { text: "arXiv", url: "https://arxiv.org/abs/2211.09251" }
            ]
        }
    ];

    const news = [
        {
            title: (
                <span>
                    Mar, 2025: Prof. {' '}
                    <a
                        href="https://chenhao-ma.github.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Chenhao Ma
                    </a>{' '}
                    and I are looking for 1-2 highly self-motivated PhD students with strong background in competitive programming (e.g. ICPC World Finalist, ICPC Regional Top 10, China NOI Medalist, Codeforces Rating>=2400......) and have great interests in research. Preferably, we hope candidates can also have research experience but this is not necessary. If you are interested in working with us, please feel free to contact either of us through email, wechat. Please also check the {' '}
                    <a
                        href="https://chenhao-ma.github.io/recruit.html"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        recruit
                    </a>{' '}  page for possible related algorithm design topics.
                </span>
            ),
        },
        {
            title: 'Feb, 2025: Our paper "Efficient Historical Butterfly Counting in Large Temporal Bipartite Networks via Graph Structure-aware Index" is accepted by the 51st International Conference on Very Large Data Bases (VLDB 2025).',
        },
        {
            title: (
                <span>
                    Jan, 2025: Although many things are still under processing, if
                    everything goes through (I really hope so), I will be joining
                    the{' '}
                    <a
                        href="https://sds.cuhk.edu.cn/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        School of Data Science (SDS)
                    </a>{' '}
                    at{' '}
                    <a
                        href="https://www.cuhk.edu.cn/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        The Chinese University of Hong Kong, Shenzhen
                    </a>{' '}
                    after my graduation. I will be working as a research assistant professor
                    in the first one or many terms.
                </span>
            ),
        },
    ];

    // Render in your component:
    news.map((item, index) => (
        <div key={index}>{item.title}</div>
    ));

    const renderSection = (items, section) => (
        <div className="sectionContainer">
            <h1 className="heading">{section}</h1>
            {items.map((item, index) => (
                <div key={`${section}-${index}`} className="publication">
                    <h2 className={section === "News" ? "news" : "title"}>
                        <a href="#" className={section === "news" ? "newsText" : "titleLink"}>{item.title}</a>
                    </h2>
                    {item.authors && (
                        <p className="authors">
                            {item.authors.split(', ').map((author, idx, arr) => {
                                const isJingbang = author.includes("Jingbang Chen");
                                const authorStyle = isJingbang ? "boldAuthor" : "authorLink";
                                return (
                                    <span key={idx}>
                                        <a href="#" className={authorStyle}>{author}</a>
                                        {idx < arr.length - 1 ? ', ' : ''}
                                    </span>
                                );
                            })}
                        </p>
                    )}
                    {item.year && <p className="year">{item.year}</p>}
                    {item.links && item.links.length > 0 && (
                        <div className="links">
                            {item.links.map((link, idx) => (
                                <span key={idx} className="linkContainer">
                                    <a href={link.url} className="link" target="_blank" rel="noopener noreferrer">
                                        {link.text}
                                    </a>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="homeContainer">
            <div className="content">
                <div className="textContent">
                    <h1 className="heading">陈靖邦 Jingbang Chen</h1>
                    <p className="cvLink"><a href="/CV.pdf">[CV]</a> (Last updated Mar. 2025)</p>
                    <p className="text">
                        I am a last-year PhD student in the <a href = "https://algcomp.uwaterloo.ca/" target = "_blank">Algorithms & Complexity Group</a> of University of Waterloo starting in Winter 2023. I am fortunate to be advised by <a href = "https://www.cs.cmu.edu/~yangp/" target = "_blank">Richard Peng</a>. Prior to this, I received my Master at Georgia Institute of Technology and B.Eng (Honors) at Zhejiang University under supervision of <a href = "https://person.zju.edu.cn/wangcan" target = "_blank">Can Wang</a>.
                        <br /><br />
                        My research revolves around the design, analysis, and implementation of provably efficient algorithms and data structures, with a focus on graphs.
                        <br /><br />
                        I am highly involved with Competitive Programming activities. Previously, I competed representing Zhejiang University and Georgia Tech in 2017 - 2021, participating in ICPC World Finals 2018 (Beijing), 2022 (Egypt), winning ICPC regional champion titles along with several gold medals. I started helping Egyptian Olympiad in Informatics (EOI) since 2023. And I also have served as the chief judge for several ICPC Asia regionals and the coach of training camps including <a href = "https://www.cecs.ucf.edu/NAC-NAPC/" target = "_blank">North American Programming Camp (NAPC)</a>. I am also the founder and co-president of the <a href="https://ucup.ac/" target="_blank">Universal Cup</a>.
                        <br /><br />
                        When not thinking about problems, I enjoy playing table tennis. Currently, I am using Fan Zhendong Super ALC with Dignics 09C on front and Dignics 64 on back.
                    </p>

                    <h2 className="subHeading">Education</h2>
                    <ul className="list">
                        <li>Ph.D., Computer Science, <a href = 'https://uwaterloo.ca' target = '_blank'>University of Waterloo</a>, Waterloo, 2023 - Current</li>
                        <li>M.S., Computer Science, <a href = 'https://www.gatech.edu/' target = '_blank'>Georgia Institute of Technology</a>, Atlanta, 2020 - 2022</li>
                        <li>B.Eng. (Honors), Pursuit Science Class, <a href="http://ckc.zju.edu.cn/" target="_blank">Chu Kochen Honors College</a> (Joint Program with <a href="http://www.cs.zju.edu.cn/" target="_blank">College of Computer Science and Technology</a>), <a href="https://www.zju.edu.cn/" target="_blank">Zhejiang University</a>, Hangzhou, 2016 - 2020</li>
                        <li><a href="https://www.gdgzez.com.cn/" target="_blank">Guangzhou No.2 High School</a>, Guangzhou, 2010 - 2016</li>
                    </ul>
                </div>
                <img src={profilePic} alt="Jingbang Chen" className="profilePic" />
            </div>
            {renderSection(news, "News")}
            {renderSection(publications, "Selected Publications")}
            {renderSection(preprints, "Manuscripts")}
        </div>
    );
};

export default Home;
