import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Chatbot from './Chatbot';
import Footer from './Footer';
import Modals from './Modals';
import './HomePage.css';


const HomePage = () => {
  return (
    <div className="homepage">
      <Navbar />
      <Hero />
      <Chatbot />
      <Footer />
      <Modals />
    </div>
  );
};

export default HomePage; 