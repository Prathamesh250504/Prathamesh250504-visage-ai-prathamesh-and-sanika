import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";
import heroImg from "../../assets/h.jpg";

const Hero = () => {
  const navigate = useNavigate();

  const handleQuizClick = () => {
    navigate("/quiz");
  };

  const handleFacialAnalysisClick = () => {
    navigate("/facial-analysis");
  };

  return (
    <section className="hero">
      <div className="hero-text">
        <h1>WELCOME:<br />VisageAI Skincare Expert</h1>
        <p>
          Experience personalized skincare analysis powered by AI – real-time
          detection, expert advice, and product suggestions just for you!
        </p>
        <div className="buttons">
          <button className="btn-light" onClick={handleFacialAnalysisClick}>Analyze my face using AI</button>
          <button className="btn-yellow" onClick={handleQuizClick}>Analyze my face using questions</button>
        </div>
      </div>
      <div className="hero-img">
        <img src={heroImg} alt="AI Skincare Face" />
      </div>
    </section>
  );
};

export default Hero;
