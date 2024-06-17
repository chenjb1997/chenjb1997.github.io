import React from 'react';

const CompetitiveProgramming = () => {
    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.heading}>Competitive Programming</h1>
                <p style={styles.text}>
                    I start doing competitive programming since high school. I received a Bronze Medal in National Olympiad in Informatics (NOI) in 2015. Then I joined the Competitive Programming Team of Zhejiang University and competed as the team leader of Team Legilimens (2017-2019) and the student co-coach (2018-2021). During my undergraduate life, I won 12 gold medals in ICPC, CCPC series competitions including the very first Regional Champion of Zhejiang University in 2017 and the Provincial Champion in 2018. On behalf of Zhejiang University, I participated in ICPC World Finals held in Beijing, 2018.
                    <br /><br />
                    During my first year in Georgia Tech, I won the Champion of the 2020 ICPC Southeast USA Regional Contest and Second Runner-up in the 2021 North America Championship. I will participate in ICPC World Finals 2022.
                    <br /><br />
                    I am International Grandmaster at Codeforces (Max Rating 2735).
                </p>
                <h2 style={styles.subHeading}>Coaching</h2>
                <ul style={styles.list}>
                    <li>Coach of Georgia Tech Programming Team, 2021 - Current</li>
                    <li>Student Co-coach of Zhejiang University Competitive Programming Team, 2018 - 2021</li>
                    <li>Coach of CCPC-Wannafly Winter Training Camp, 2020</li>
                    <li>Coach of ByteDance Winter Training Camp, 2020 - 2021</li>
                </ul>
                <h2 style={styles.subHeading}>Awards</h2>
                <ul style={styles.list}>
                    <li>Champion of 42nd International Collegiate Programming Contest Qingdao Regional Contest, 2017</li>
                    <li>Champion of 45th International Collegiate Programming Contest Southeast USA Regional, 2021</li>
                    <li>Champion of 15th Zhejiang Province Collegiate Programming Competition, 2018</li>
                    <li>Second Runner-up of 3rd China Collegiate Programming Contest Jilin Regional Contest, 2018</li>
                    <li>Second Runner-up, Silver Medal of 45th International Collegiate Programming Contest North America Championship, 2021</li>
                    <li>Rank Prize of 42nd International Collegiate Programming Contest World Finals, 2018</li>
                    <li>Gold Medal of 42nd International Collegiate Programming Contest Beijing Regional Contest, 2017</li>
                    <li>Gold Medal of 42nd International Collegiate Programming Contest East-Continent League Finals, 2017</li>
                    <li>Gold Medal of 43rd International Collegiate Programming Contest Xuzhou Regional Contest, 2018</li>
                    <li>Gold Medal of 44th International Collegiate Programming Contest Xuzhou Regional Contest, 2019</li>
                    <li>Gold Medal of 44th International Collegiate Programming Contest Shenyang Regional Contest, 2019</li>
                    <li>Gold Medal of 44th International Collegiate Programming Contest East-Continent Finals, 2019</li>
                    <li>Gold Medal of 2nd China Collegiate Programming Contest Harbin Regional Contest, 2017</li>
                    <li>Gold Medal of 2nd China Collegiate Programming Contest Finals, 2017</li>
                    <li>Gold Medal of 4th China Collegiate Programming Contest Qinhuangdao Regional Contest, 2019</li>
                    <li>Bronze Medal of National Olympiad of Informatics Finals, 2015</li>
                </ul>
                <h2 style={styles.subHeading}>Problem Setting</h2>
                <ul style={styles.list}>
                    <li>Member of SUA Programming Competitions Problems Setter Team</li>
                    <li>Problem Setter of International Collegiate Programming Contest Qingdao Regional Contest, 2018</li>
                    <li>Problem Setter of International Collegiate Programming Contest Nanjing Regional Contest, 2020</li>
                    <li>Problem Setter of International Collegiate Programming Contest Nanjing Regional Contest, 2021</li>
                    <li>Problem Setter of International Collegiate Programming Contest Nanjing Regional Contest, 2022</li>
                    <li>Problem Setter of International Collegiate Programming Contest Macau Regional Contest, 2021</li>
                    <li>Problem Setter of International Collegiate Programming Contest Macau Regional Contest, 2022</li>
                    <li>Problem Setter of Zhejiang University Programming Competition, 2019</li>
                    <li>Problem Setter of Zhejiang Province Collegiate Programming Competition, 2019</li>
                    <li>Problem Setter of Zhejiang Province Collegiate Programming Competition, 2021</li>
                    <li>Problem Setter of Shandong Province Collegiate Programming Competition, 2019</li>
                    <li>Problem Setter of Shaanxi Province Collegiate Programming Competition, 2019</li>
                    <li>Problem Setter of Sichuan Province Collegiate Programming Competition, 2021</li>
                    <li>Problem Setter of Moscow Pre-Finals Workshop, 2020 - 2021</li>
                    <li>Problem Setter of Petrozavodsk Training Camp, 2019 - 2022</li>
                    <li>Problem Setter of Multi-University Training on HDU, 2019 - 2020</li>
                    <li>Problem Setter of Multi-University Training on Nowcoder, 2020 - 2021</li>
                    <li>Problem Setter of OpenCup, 2020 - 2022</li>
                    <li>Problem Setter of ZOJ Monthly, 2018 - 2019</li>
                    <li>Problem Setter of Codeforces, Round #573, 2019</li>
                </ul>
                <h2 style={styles.subHeading}>Others</h2>
                <p style={styles.text}>
                    Founder of Universal Cup
                    <br />
                    Manager of Keystone Wiki (Feel free contact me for the authority)
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',  // Centers the publications vertically in the container
    },
    content: {
        maxWidth: '800px',  // Ensures that the content does not stretch too wide
    },
    textContent: {
        textAlign: 'justify',  // Ensures text is justified for better readability
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
        listStyleType: 'circle',  // Styles the bullet points
        paddingLeft: '20px',  // Indents the list slightly for better alignment
        color: '#666',  // This ensures the text color of the list matches the paragraph
        fontSize: '16px',  // Matching the text font size
        lineHeight: '1.6'  // Ensuring consistent line height with the text
    }
};

export default CompetitiveProgramming;
