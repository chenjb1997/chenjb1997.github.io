import React from 'react';

const CompetitiveProgramming = () => {
    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.heading}>Competitive Programming</h1>
                <p style={styles.text}>
                    I start doing competitive programming since high school. I received a Bronze Medal in National Olympiad in Informatics (NOI) in 2015. Then I joined the Competitive Programming Team of Zhejiang University and competed as the team leader of Team Legilimens (2017-2019) and the student co-coach (2018-2021). During my undergraduate life, I won 12 gold medals in International Collegiate Programming Contest (ICPC), China Collegiate Programming Contest (CCPC) series competitions including the very first domestic ICPC Regional Champion of Zhejiang University in 2017. On behalf of Zhejiang University, I participated in ICPC World Finals 2018 (Beijing).
                    <br /><br />
                    During my first year in Georgia Tech, I won the Champion of the 2020 ICPC Southeast USA Regional Contest and Second Runner-up in the 2021 North America Championship. I participated in ICPC World Finals 2022 (Luxor) as a two-person team and ranked 13th place.
                    <br /><br />
                    I am an International Grandmaster on <a href = "https://codeforces.com/profile/chenjb" target = "_blank">Codeforces</a> (Max Rating 2735).
                    <br/><br />
                    I am a member of <a href="https://sua.ac/" target="_blank">SUA Programming Competitions Problems Setter Team</a>.
                    <br /><br />
                    I am the co-founder and co-president of the <a href="https://ucup.ac/" target="_blank">Universal Cup</a>, which is an organization dedicated to offering training resources for competitive programming teams. In the previous season, over 900 teams from more than 500 affiliations all over the world, registered and participated in a total of 28 stages, encompassing contests from Asia, Europe, and America. The current season is open for registration now. We will be hosting the 2025 Universal Cup Finals in Dongguan, China, on February 19-24, 2025.
                </p>
                <h2 style={styles.subHeading}>Coaching</h2>
                <ul style={styles.list}>
                    <li>Coach of Georgia Tech Programming Team, 2021 - 2023</li>
                    <li>Coach of Egyptian Olympiad in Informatics (EOI), 2023 - Current</li>
                    <li>Trainer of North America Programming Camp (NAPC), 2024 - Current</li>
                    <li>Student Co-coach of Zhejiang University Competitive Programming Team, 2018 - 2021</li>
                    <li>Coach of CCPC-Wannafly Winter Training Camp, 2020</li>
                    <li>Coach of ByteDance Winter Training Camp, 2020 - 2021</li>
                </ul>
                <h2 style={styles.subHeading}>Awards</h2>
                <ul style={styles.list}>
                    <li>Champion, 42nd International Collegiate Programming Contest Qingdao Regional Contest, 2017</li>
                    <li>Champion, 45th International Collegiate Programming Contest Southeast USA Regional, 2021</li>
                    <li>Champion, 15th Zhejiang Province Collegiate Programming Competition, 2018</li>
                    <li>3rd Place, 3rd China Collegiate Programming Contest Jilin Regional Contest, 2018</li>
                    <li>3rd Place, 45th International Collegiate Programming Contest North America Championship, 2021</li>
                    <li>56th Place, 42nd International Collegiate Programming Contest World Finals, 2018</li>
                    <li>13th Place, 46th International Collegiate Programming Contest World Finals, 2024</li>
                    <li>Gold Medal, 42nd International Collegiate Programming Contest Beijing Regional Contest, 2017</li>
                    <li>Gold Medal, 42nd International Collegiate Programming Contest East-Continent League Finals, 2017</li>
                    <li>Gold Medal, 43rd International Collegiate Programming Contest Xuzhou Regional Contest, 2018</li>
                    <li>Gold Medal, 44th International Collegiate Programming Contest Xuzhou Regional Contest, 2019</li>
                    <li>Gold Medal, 44th International Collegiate Programming Contest Shenyang Regional Contest, 2019</li>
                    <li>Gold Medal, 44th International Collegiate Programming Contest East-Continent Finals, 2019</li>
                    <li>Gold Medal, 2nd China Collegiate Programming Contest Harbin Regional Contest, 2017</li>
                    <li>Gold Medal, 2nd China Collegiate Programming Contest Finals, 2017</li>
                    <li>Gold Medal, 4th China Collegiate Programming Contest Qinhuangdao Regional Contest, 2019</li>
                    <li>Bronze Medal, National Olympiad of Informatics Finals, 2015</li>
                </ul>
                <h2 style={styles.subHeading}>Problem Setting and Judging</h2>
                <ul style={styles.list}>
                    <li>International Collegiate Programming Contest Qingdao Regional Contest, 2018</li>
                    <li>International Collegiate Programming Contest Nanjing Regional Contest, 2020</li>
                    <li>International Collegiate Programming Contest Nanjing Regional Contest, 2021</li>
                    <li>International Collegiate Programming Contest Nanjing Regional Contest, 2022</li>
                    <li>International Collegiate Programming Contest Nanjing Regional Contest, 2023</li>
                    <li>International Collegiate Programming Contest Nanjing Regional Contest, 2024</li>
                     <li>International Collegiate Programming Contest Macau Regional Contest, 2021</li>
                    <li>International Collegiate Programming Contest Macau Regional Contest, 2022</li>
                    <li>International Collegiate Programming Contest Jinan Regional Contest, 2023</li>
                    <li>International Collegiate Programming Contest Hangzhou Regional Contest, 2024</li>
                    <li>Zhejiang University Programming Competition, 2019</li>
                    <li>Zhejiang Province Collegiate Programming Competition, 2019</li>
                    <li>Zhejiang Province Collegiate Programming Competition, 2021</li>
                    <li>Shandong Province Collegiate Programming Competition, 2019</li>
                    <li>Shandong Province Collegiate Programming Competition, 2023</li>
                    <li>Guangdong Province Collegiate Programming Competition, 2023</li>
                    <li>Shaanxi Province Collegiate Programming Competition, 2019</li>
                    <li>Sichuan Province Collegiate Programming Competition, 2021</li>
                    <li>Moscow Pre-Finals Workshop, 2020 - 2021</li>
                    <li>Petrozavodsk Training Camp, 2019 - 2022</li>
                    <li>Multi-University Training on HDU, 2019 - 2020</li>
                    <li>Multi-University Training on Nowcoder, 2020 - 2021</li>
                    <li>Universal Cup, 2023 - Current</li>
                    <li>OpenCup, 2020 - 2022</li>
                    <li>ZOJ Monthly, 2018 - 2019</li>
                    <li>Codeforces, Round #573, 2019</li>
                </ul>
                <h2 style={styles.subHeading}>Others</h2>
                <p style={styles.text}>
                    <a href="http://keystone.wiki/" target="_blank">Keystone Wiki</a> (Feel free contact me for the authority)
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
        alignItems: 'center',
    },
    content: {
        maxWidth: '800px',
    },
    textContent: {
        textAlign: 'justify',
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
        listStyleType: 'circle',
        paddingLeft: '20px',
        color: '#666',
        fontSize: '16px',
        lineHeight: '1.6'
    }
};

export default CompetitiveProgramming;
