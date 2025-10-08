import React from "react";
import PersonalProfile from "../components/home/PersonalProfile";
import Bio from "../components/home/bio";
import Education from "../components/home/Education";
import News from "../components/home/News";
import SelectedPublications from "../components/home/SelectedPublications";
import Manuscripts from "../components/home/Manuscripts";
const Home = () => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="prose max-w-none text-lg">
        {/* 个人简介 */}
        <PersonalProfile />
        {/* 个人介绍 */}
        <Bio />
        {/* News */}
        <News />
        {/* Education */}
        <Education />
        {/* Selected Publications */}
        <SelectedPublications />
        {/* Manuscripts */}
        <Manuscripts />
      </div>
    </div>
  );
};

export default Home;
