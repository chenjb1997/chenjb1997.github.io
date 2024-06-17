import React from 'react';
import { FaGithub, FaEnvelope, FaBook, FaFilePdf } from 'react-icons/fa';
import profilePic from './chenjbteacher.JPG';

const Sidebar = () => {
    return (
        <div style={styles.sidebar}>
            <div style={styles.profileSection}>
                <img src={profilePic} alt="Profile" style={styles.profilePic} />
            </div>
            <div style={styles.links}>
                <a href="mailto:j293chen@uwaterloo.ca" style={styles.link}>
                    <FaEnvelope style={styles.icon} /> Email
                </a>
                <a href="https://scholar.google.com/citations?user=UQfmkJUAAAAJ" style={styles.link}>
                    <FaBook style={styles.icon} /> Google Scholar
                </a>
                <a href="your_cv_link.pdf" style={styles.link} download>
                    <FaFilePdf style={styles.icon} /> Download CV
                </a>
                <a href="https://github.com/chenjb1997" style={styles.link}>
                    <FaGithub style={styles.icon} /> GitHub
                </a>
            </div>
        </div>
    );
};

const styles = {
    sidebar: {
        width: '200px',
        position: 'fixed',
        top: '0',
        left: '0',
        height: '100%',
        backgroundColor: 'white',
        color: '#333',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 0',
        borderRight: '1px solid #ccc'
    },
    profileSection: {
        textAlign: 'center',
        marginBottom: '30px' // Increased to give more space between the profile and links
    },
    profilePic: {
        width: '175px',  // Adjusted width
        height: '210px', // New height, making the picture a rectangle
        borderRadius: '8px', // Mildly rounded corners for a softer look
        marginBottom: '20px' // Adjusted spacing
    },
    links: {
        width: '100%',
        textAlign: 'center'
    },
    link: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textDecoration: 'none',
        color: '#666',
        margin: '12px 0' // Adjusted for spacing
    },
    icon: {
        marginBottom: '5px'
    }
};

export default Sidebar;
