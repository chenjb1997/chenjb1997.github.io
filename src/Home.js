import React from 'react';
import profilePic from './chenjbteacher.JPG';  // Update the path to where your image is stored

const Home = () => {
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
        </div>
    );
};

const styles = {
    homeContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '20px',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    },
    content: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        maxWidth: '1200px',  // Limiting the max width for better control
    },
    textContent: {
        flex: 0.6,
        paddingRight: '20px'  // Space between text and image
    },
    profilePic: {
        width: '200px',  // Larger width
        height: '275px',  // Adjust height to maintain aspect ratio
        borderRadius: '8px',
        marginBottom: '20px',
          // Ensuring it complements the text content
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
    }
};

export default Home;
