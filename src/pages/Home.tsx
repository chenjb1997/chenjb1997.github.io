import React from "react";
import PersonalProfile from "../components/home/PersonalProfile";
import Bio from "../components/home/bio";
import Education from "../components/home/Education";
import SelectedPublications from "../components/home/SelectedPublications";
import Manuscripts from "../components/home/Manuscripts";
import {
  HeroAmbientGlow,
  Reveal,
} from "../components/home/HomeMotion";

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="prose max-w-none text-lg">
        {/* 个人简介 */}
        <div className="home-hero-shell">
          <HeroAmbientGlow />
          <div className="home-hero-content">
            <PersonalProfile />
          </div>
        </div>
        {/* 个人介绍 */}
        <Reveal delay={30}>
          <Bio />
        </Reveal>
        {/* Education */}
        <Reveal delay={45}>
          <Education />
        </Reveal>
        {/* Selected Publications */}
        <Reveal delay={45}>
          <SelectedPublications />
        </Reveal>
        {/* Manuscripts */}
        <Reveal delay={45}>
          <Manuscripts />
        </Reveal>
      </div>
    </div>
  );
};

export default Home;
