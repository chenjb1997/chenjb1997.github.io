import React from "react";
import PersonalProfile from "../components/home/PersonalProfile";
import Bio from "../components/home/bio";
import Education from "../components/home/Education";
import SelectedPublications from "../components/home/SelectedPublications";
import Manuscripts from "../components/home/Manuscripts";
const Home = () => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="prose max-w-none text-lg">
        {/* 个人简介 */}
        <div className="site-section-motion">
          <PersonalProfile />
        </div>
        {/* 个人介绍 */}
        <div className="site-section-motion">
          <Bio />
        </div>
        {/* Education */}
        <div className="site-section-motion">
          <Education />
        </div>
        {/* Selected Publications */}
        <div className="site-section-motion">
          <SelectedPublications />
        </div>
        {/* Manuscripts */}
        <div className="site-section-motion">
          <Manuscripts />
        </div>
      </div>
    </div>
  );
};

export default Home;
