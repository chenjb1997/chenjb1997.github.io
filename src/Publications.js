import React, { useState } from 'react';
import './publications.css';

const Publications = () => {
    const [visibleAbstractIndex, setVisibleAbstractIndex] = useState(null);

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

    const preprints = [
        {
            title: "Sandpile Prediction on Structured Undirected Graphs",
            authors: "Jingbang Chen, Ruinian Chang, Qingyu Shi",
            year: "arXiv preprint arXiv:2307.07711 2023",
            abstract: ""
        },
        {
            title: "Learning-Augmented B-Trees",
            authors: "Xinyuan Cao, Jingbang Chen, Li Chen, Chris Lambert, Richard Peng, Daniel Sleator",
            year: "arXiv preprint arXiv:2211.09251 2022",
            abstract: ""
        }
    ];

    const toggleAbstract = index => {
        setVisibleAbstractIndex(visibleAbstractIndex === index ? null : index);
    };

    const renderSection = (items, section) => (
        <div style={styles.sectionContainer}>
            <h1 style={styles.heading}>{section}</h1>
            {items.map((item, index) => (
                <div key={`${section}-${index}`} style={styles.publication}>
                    <h2 style={styles.title}><a href="#" style={styles.titleLink}>{item.title}</a></h2>
                    <p style={styles.authors}>
                        {item.authors.split(', ').map((author, idx, arr) => {
                            const isJingbang = author.includes("Jingbang Chen");

                            const authorClass = isJingbang ? 'bold-author' : 'author-link';
                            return (
                                <span key={idx}>
                                    <a href="#" className={authorClass}>{author}</a>
                                    {idx < arr.length - 1 ? ', ' : ''}
                                </span>
                            );
                        })}
                    </p>
                    <p style={styles.year}>{item.year}</p>
                    <button onClick={() => toggleAbstract(index)} style={styles.button}>
                        {visibleAbstractIndex === index ? 'Hide Abstract' : 'Show Abstract'}
                    </button>
                    {visibleAbstractIndex === index && <p style={styles.abstract}>{item.abstract}</p>}
                </div>
            ))}
        </div>
    );

    return (
        <div style={styles.container}>
            {renderSection(publications, "Publications")}
            {renderSection(preprints, "Preprints")}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    sectionContainer: {
        width: '100%',
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: '20px'
    },
    heading: {
        fontSize: '30px',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#333'
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
    },
    button: {
        marginTop: '10px',
        marginBottom: '10px',
        background: 'none',
        color: 'dodgerblue',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'underline'
    }
};

export default Publications;
