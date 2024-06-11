import React from 'react';
import { FaGithub, FaEnvelope, FaBook, FaFilePdf } from 'react-icons/fa';

const Contact = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Contact</h1>
            <p style={styles.text}>
                If you have any questions, would like to discuss my research, or are interested in collaboration opportunities, please don't hesitate to reach out. Below, you can find the best ways to contact me.
            </p>
            <h2 style={styles.subHeading}>Contact Information</h2>
            <ul style={styles.list}>
                <li>Email: <a href="mailto:j293chen@uwaterloo.ca" style={styles.link}>j293chen@uwaterloo.ca</a></li>
                <li>Download my CV: <a href="your_cv_link.pdf" style={styles.link} download>Here</a></li>
            </ul>
            <div style={styles.iconLinks}>
                <a href="mailto:j293chen@uwaterloo.ca" style={styles.iconLink}>
                    <FaEnvelope style={styles.icon} /> Email
                </a>
                <a href="https://scholar.google.com/citations?user=UQfmkJUAAAAJ" style={styles.iconLink}>
                    <FaBook style={styles.icon} /> Google Scholar
                </a>
                <a href="your_cv_link.pdf" style={styles.iconLink} download>
                    <FaFilePdf style={styles.icon} /> Download CV
                </a>
                <a href="https://github.com/chenjb1997" style={styles.iconLink}>
                    <FaGithub style={styles.icon} /> GitHub
                </a>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        maxWidth: '800px',
        margin: 'auto'
    },
    heading: {
        fontSize: '30px',
        fontWeight: 'normal',
        color: '#333'
    },
    subHeading: {
        fontSize: '20px',
        fontWeight: 'normal',
        fontStyle: 'italic',
        color: '#333'
    },
    text: {
        color: '#666',
        fontSize: '16px',
        lineHeight: '1.6',
    },
    list: {
        listStyleType: 'none',
        paddingLeft: '0',
        lineHeight: '2',
        marginBottom: '20px'
    },
    link: {
        color: '#0066cc',
        textDecoration: 'none',
    },
    iconLinks: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: '20px'
    },
    iconLink: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textDecoration: 'none',
        color: '#666',
        margin: '10px',
        textAlign: 'center'
    },
    icon: {
        marginBottom: '5px'
    }
};

export default Contact;
