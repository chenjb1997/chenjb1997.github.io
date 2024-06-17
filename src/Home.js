import React from 'react';
import profilePic from './chenjbteacher.JPG';  // Update the path to where your image is stored

const Home = () => {
    const publications = [
        {
            title: "Exponential Convergence of Sinkhorn Under Regularization Scheduling",
            authors: "Jingbang Chen, Li Chen, Yang P Liu, Richard Peng, Arvind Ramaswami",
            year: "SIAM Conference on Applied and Computational Discrete Algorithms (ACDA23)",
            abstract: "Abstract In 2013, Cuturi [9] introduced the SINKHORN algorithm for matrix scaling as a method to compute solutions to regularized optimal transport problems. In this paper, aiming at a better convergence rate for a high accuracy solution, we work on understanding the SINKHORN algorithm under regularization scheduling, and thus modify it with a mechanism that adaptively doubles the regularization parameter η periodically. We prove that such modified version of SINKHORN has an exponential convergence rate as iteration complexity depending on log(l/ɛ) instead of ɛ-o(1) from previous analyses [1, 9] in the optimal transport problems with integral supply and demand. Furthermore, with cost and capacity scaling procedures, the general optimal transport problem can be solved with a logarithmic dependence on 1/ɛ as well."
        },
        {
            title: "Hardness of Graph-Structured Algebraic and Symbolic Problems",
            authors: "Jingbang Chen, Yu Gao, Yufan Huang, Richard Peng, Runze Wang",
            year: "In Algorithms and Data Structures 2023",
            abstract: "In this paper (A full version can be found at https://arxiv.org/abs/2109.12736v3.), we study the hardness of solving graph structured linear systems with coefficients over a finite field Z_p and over a polynomial ring F[x_1,...,x_t]. We reduce solving general linear systems in Z_p to solving unit-weight low-degree graph Laplacians over Z_p with a polylogarithmic overhead on the number of non-zeros. Under the by now common assumption of hardness of solving general linear systems in Z_p, this result shows that ideas for solving graph-structured linear systems over reals are unlikely to transfer to finite-field settings. We also reduce solving general linear systems over Z_p to solving linear systems whose coefficient matrices are walk matrices (matrices with all ones on the diagonal) and normalized Laplacians (Laplacians that are also walk matrices) over Z_p. Furthermore, motivated by applications that choose entries of such systems over finite fields randomly, we provide some generalizations of our reductions to symbolic settings."
        }
    ];

    const renderSection = (items, section) => (
        <div style={styles.sectionContainer}>
            <h1 style={styles.heading}>{section}</h1>
            {items.map((item, index) => (
                <div key={`${section}-${index}`} style={styles.publication}>
                    <h2 style={styles.title}><a href="#" style={styles.titleLink}>{item.title}</a></h2>
                    <p style={styles.authors}>
                        {item.authors.split(', ').map((author, idx, arr) => {
                            const isJingbang = author.includes("Jingbang Chen");
                            const authorStyle = isJingbang ? styles.boldAuthor : styles.authorLink;
                            return (
                                <span key={idx}>
                                    <a href="#" style={authorStyle}>{author}</a>
                                    {idx < arr.length - 1 ? ', ' : ''}
                                </span>
                            );
                        })}
                    </p>
                    <p style={styles.year}>{item.year}</p>
                    <p style={styles.abstract}>{item.abstract}</p>
                </div>
            ))}
        </div>
    );

    return (
        <div style={styles.homeContainer}>
            <div style={styles.content}>
                <div style={styles.textContent}>
                    <h1 style={styles.heading}>Jingbang Chen</h1>
                    <p style={styles.text}>
                        I am a second year PhD student in the Algorithms & Complexity Group of University of Waterloo starting in Winter 2023. I am fortunate to be advised by Richard Peng. Prior to this, I received my Master at Georgia Institute of Technology and B.Eng (Honors) at Zhejiang University under supervision of Can Wang.
                        <br /><br />
                        I have a broad interest in theoretical computer science, with special interests in developing efficient algorithms to solve problems on graphs with certain structured, balancing between theoretical analysis and practical applications.
                        <br /><br />
                        I am highly involved with Competitive Programming. Starting from season 2022 - 2023, I work as the coach of GT programming team. Prior to this, I competed representing Zhejiang University and Georgia Tech in 2017 - 2021, participating in ICPC World Finals 2018 (Beijing), 2022 (Egypt). I also worked as the problem setter, the judge for over 10 contests including ICPC Nanjing Regional 2020, 2021 and the coach of training camps including ByteDance Winter Training Camp. I am also the founder and committee member of Universal Cup, which is a non-profit organization dedicated to providing trainings for competitive programming teams. All related experience are listed in Competitive Programming.
                    </p>
                    <p style={{ ...styles.cvLink, fontSize: '18px' }}><a href="CV.pdf" download="CV.pdf">[CV]</a> (Last updated June. 2024)</p>

                    <h2 style={styles.subHeading}>Education</h2>
                    <ul style={styles.list}>
                        <li>Ph.D., Computer Science, University of Waterloo, Waterloo, 2023 - Current</li>
                        <li>M.S., Computer Science, Georgia Institute of Technology, Atlanta, 2020 - 2022</li>
                        <li>B.Eng. (Honors), Pursuit Science Class, Chu Kochen Honors College (Joint Program with College of Computer Science and Technology), Zhejiang University, Hangzhou, 2016 - 2020</li>
                        <li>Guangzhou No.2 High School, Guangzhou, 2010 - 2016</li>
                    </ul>
                </div>
                <img src={profilePic} alt="Jingbang Chen" style={styles.profilePic} />
            </div>
            {renderSection(publications, "Publications")}
        </div>
    );
};

const styles = {
    homeContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    },
    content: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        maxWidth: '1200px',
    },
    textContent: {
        flex: 0.6,
        paddingRight: '20px'
    },
    profilePic: {
        width: '200px',
        height: '200px',
        borderRadius: '8px',
        marginBottom: '20px',
    },
    heading: {
        fontSize: '30px',
        fontWeight: 'normal',
        color: '#333'
    },
    text: {
        color: '#666',
        fontSize: '16px',
        lineHeight: '1.6',
    },
    cvLink: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    subHeading: {
        fontSize: '20px',
        fontWeight: 'normal',
        fontStyle: 'italic',
        color: '#333'
    },
    list: {
        listStyleType: 'circle',
        color: '#666',
        fontSize: '16px',
        lineHeight: '1.6',
        paddingLeft: '20px'
    },
    sectionContainer: {
        width: '100%',
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: '20px'
    },
    publication: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: '15px',
        paddingBottom: '10px',
        borderBottom: '1px solid #eee',
        maxWidth: '800px'
    },
    title: {
        fontSize: '20px',
        fontWeight: 'normal',
        fontStyle: 'italic',
        color: '#333'
    },
    titleLink: {
        textDecoration: 'none',
        color: '#333'
    },
    authors: {
        fontSize: '16px',
        color: '#666'
    },
    boldAuthor: {
        fontWeight: 'bold',
        color: 'black'
    },
    authorLink: {
        color: '#0066cc',
        textDecoration: 'none'
    },
    year: {
        fontSize: '16px',
        color: '#666',
        fontStyle: 'italic'
    },
    abstract: {
        color: '#444',
        fontSize: '15px',
        marginTop: '5px',
        fontStyle: 'italic'
    }
};

export default Home;
