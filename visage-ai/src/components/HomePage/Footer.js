import React from "react";
import "./Footer.css";

// Import all the photos for the banner
import bannerPhoto from '../../assets/banner.jpeg';
import coverPhoto from '../../assets/cover.jpeg';
import faceCleanserPhoto from '../../assets/face cleanser.jpeg';
import lipNurshingPhoto from '../../assets/lip nurshing.jpeg';
import lipPhoto from '../../assets/lip.jpeg';
import lipbalmPhoto from '../../assets/lipbalm.jpeg';
import liptintPhoto from '../../assets/liptint.jpeg';
import moisturizerPhoto from '../../assets/moisturizer.jpeg';
import nightCreamPhoto from '../../assets/night cream.jpeg';
import productPhoto from '../../assets/product.jpeg';
import rosePhoto from '../../assets/rose.jpeg';
import serumPhoto from '../../assets/serum.jpeg';
import serum2Photo from '../../assets/serum2.jpeg';
import tonerPhoto from '../../assets/toner.jpeg';
import visageCoverPhoto from '../../assets/visage cover.jpeg';
import sunscreenPhoto from '../../assets/sunscreen.jpeg';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Background Photo Banner */}
      <div className="photo-banner-background">
        <div className="photo-banner-track">
          {/* First set of photos */}
          <div className="photo-banner-item">
            <img src={bannerPhoto} alt="Banner" />
          </div>
          <div className="photo-banner-item">
            <img src={coverPhoto} alt="Cover" />
          </div>
          <div className="photo-banner-item">
            <img src={faceCleanserPhoto} alt="Face Cleanser" />
          </div>
          <div className="photo-banner-item">
            <img src={lipNurshingPhoto} alt="Lip Nourishing" />
          </div>
          <div className="photo-banner-item">
            <img src={lipPhoto} alt="Lip" />
          </div>
          <div className="photo-banner-item">
            <img src={lipbalmPhoto} alt="Lip Balm" />
          </div>
          <div className="photo-banner-item">
            <img src={liptintPhoto} alt="Lip Tint" />
          </div>
          <div className="photo-banner-item">
            <img src={moisturizerPhoto} alt="Moisturizer" />
          </div>
          <div className="photo-banner-item">
            <img src={nightCreamPhoto} alt="Night Cream" />
          </div>
          <div className="photo-banner-item">
            <img src={productPhoto} alt="Product" />
          </div>
          <div className="photo-banner-item">
            <img src={rosePhoto} alt="Rose" />
          </div>
          <div className="photo-banner-item">
            <img src={serumPhoto} alt="Serum" />
          </div>
          <div className="photo-banner-item">
            <img src={serum2Photo} alt="Serum 2" />
          </div>
          <div className="photo-banner-item">
            <img src={tonerPhoto} alt="Toner" />
          </div>
          <div className="photo-banner-item">
            <img src={visageCoverPhoto} alt="Visage Cover" />
          </div>
          <div className="photo-banner-item">
            <img src={sunscreenPhoto} alt="Sunscreen" />
          </div>
          
          {/* Duplicate set for seamless loop */}
          <div className="photo-banner-item">
            <img src={bannerPhoto} alt="Banner" />
          </div>
          <div className="photo-banner-item">
            <img src={coverPhoto} alt="Cover" />
          </div>
          <div className="photo-banner-item">
            <img src={faceCleanserPhoto} alt="Face Cleanser" />
          </div>
          <div className="photo-banner-item">
            <img src={lipNurshingPhoto} alt="Lip Nourishing" />
          </div>
          <div className="photo-banner-item">
            <img src={lipPhoto} alt="Lip" />
          </div>
          <div className="photo-banner-item">
            <img src={lipbalmPhoto} alt="Lip Balm" />
          </div>
          <div className="photo-banner-item">
            <img src={liptintPhoto} alt="Lip Tint" />
          </div>
          <div className="photo-banner-item">
            <img src={moisturizerPhoto} alt="Moisturizer" />
          </div>
          <div className="photo-banner-item">
            <img src={nightCreamPhoto} alt="Night Cream" />
          </div>
          <div className="photo-banner-item">
            <img src={productPhoto} alt="Product" />
          </div>
          <div className="photo-banner-item">
            <img src={rosePhoto} alt="Rose" />
          </div>
          <div className="photo-banner-item">
            <img src={serumPhoto} alt="Serum" />
          </div>
          <div className="photo-banner-item">
            <img src={serum2Photo} alt="Serum 2" />
          </div>
          <div className="photo-banner-item">
            <img src={tonerPhoto} alt="Toner" />
          </div>
          <div className="photo-banner-item">
            <img src={visageCoverPhoto} alt="Visage Cover" />
          </div>
          <div className="photo-banner-item">
            <img src={sunscreenPhoto} alt="Sunscreen" />
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="footer-content">
        <div className="footer-main">
          &copy; 2025 <strong>VisageAI</strong>. Built with <span className="heart">❤️</span> by
          <button onClick={() => openModal("prathmeshModal")} className="modal-link">Prathamesh Pabe</button>
          and
          <button onClick={() => openModal("sanikaModal")} className="modal-link">Sanika Nayakal</button>.
          All rights reserved.
        </div>
        <div className="footer-note">
          <strong>
            <small>
              This website and its contents are the result of a collaborative project by Sanika Nayakal and Prathamesh Pabe. VisageAI is dedicated to providing innovative AI-powered skincare solutions. Unauthorized use or reproduction of the content is prohibited.
            </small>
          </strong>
        </div>
        <div className="footer-educational-disclaimer">
          <strong>
            <small>
              This application is developed exclusively for educational purposes and shall not be used for commercial purposes.
            </small>
          </strong>
        </div>
      </div>
    </footer>
  );
};

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "block";
}

export default Footer;