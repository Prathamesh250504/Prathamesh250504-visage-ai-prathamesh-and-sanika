import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Blog.module.css";

// Image imports from src/assets
import img14 from "../../assets/14.jpg";
import img15 from "../../assets/15.avif";
import img16 from "../../assets/16.webp";
import img17 from "../../assets/17.jpg";
import img18 from "../../assets/18.avif";
import img19 from "../../assets/19.jpg";

import img20 from "../../assets/20.jpg";
import img21 from "../../assets/21.avif";
import img22 from "../../assets/22.jpg";
import img24 from "../../assets/24.png";
import img25 from "../../assets/25.png";
import img26 from "../../assets/26.jpg";

const blogData = [
  {
    title: "Daily Ayurvedic Skincare Rituals",
    thumbnail: img14,
    img: img20,
    desc: "Discover how simple habits like oil massage and natural cleansers can revitalize your skin and calm your doshas daily.",
    content: `
      <p><strong>Introduction:</strong> Ayurveda teaches us that healthy skin is a reflection of inner balance. Following daily rituals can harmonize your body's energies (doshas) and naturally enhance your skin's radiance.</p>
      <h3>1. Abhyanga - The Daily Oil Massage</h3>
      <p>Gently massaging warm herbal oils like sesame, coconut, or almond oil all over the body stimulates circulation, detoxifies tissues, and nourishes the skin deeply. It also calms the nervous system and promotes restful sleep.</p>
      <h3>2. Gentle Cleansing with Natural Ingredients</h3>
      <p>Instead of harsh chemical cleansers, Ayurveda recommends natural cleansers such as chickpea flour (besan) mixed with turmeric and milk or rose water. These maintain the skin's natural oils and pH balance.</p>
      <h3>3. Herbal Steam and Facial Care</h3>
      <p>Steaming the face with aromatic herbs like neem, tulsi, or mint opens the pores and flushes out impurities. Follow it up with a cooling face pack suitable for your dosha type.</p>
      <h3>4. Balanced Diet and Hydration</h3>
      <p>Drinking warm water throughout the day and eating fresh, seasonal fruits and vegetables supports skin health from within. Avoiding processed and overly spicy foods helps maintain clear skin.</p>
      <h3>5. Mindful Rest and Stress Management</h3>
      <p>Restorative sleep and practices like meditation or yoga reduce stress hormones that can trigger skin inflammation and premature aging.</p>
      <p><strong>Conclusion:</strong> By adopting these simple Ayurvedic skincare rituals daily, you invite natural glow, calm, and balance into your skin and life.</p>
    `
  },
  {
    title: "Top 5 Herbal Oils for Radiant Skin",
    thumbnail: img15,
    img: img21,
    desc: "Explore the benefits of sesame, almond, neem, and more oils that are deeply nourishing and perfect for your skin type.",
    content: `
      <p>Herbal oils have been the cornerstone of Ayurvedic skincare for centuries. Here are the top 5 oils you should consider adding to your routine:</p>
      <h3>1. Sesame Oil</h3>
      <p>Rich in antioxidants and natural sun protection, sesame oil nourishes dry skin and helps detoxify the body.</p>
      <h3>2. Almond Oil</h3>
      <p>High in Vitamin E, almond oil softens skin and reduces dark circles and pigmentation.</p>
      <h3>3. Neem Oil</h3>
      <p>With antibacterial properties, neem oil is excellent for acne-prone and oily skin types.</p>
      <h3>4. Coconut Oil</h3>
      <p>Moisturizing and antimicrobial, coconut oil is perfect for soothing irritated or sensitive skin.</p>
      <h3>5. Rosehip Oil</h3>
      <p>Loaded with essential fatty acids, rosehip oil promotes skin regeneration and reduces scars and wrinkles.</p>
    `
  },
  {
    title: "DIY Face Packs for Every Skin Type",
    thumbnail: img16,
    img: img22,
    desc: "Make your own Vata, Pitta, or Kapha balancing face masks using ingredients from your kitchen and Ayurvedic wisdom.",
    content: `
      <p>Making your own Ayurvedic face packs is a great way to customize skincare for your dosha.</p>
      <h3>Vata Skin Pack</h3>
      <p>Mix mashed avocado with honey and a pinch of turmeric for hydration and nourishment.</p>
      <h3>Pitta Skin Pack</h3>
      <p>Use sandalwood powder with rose water and aloe vera gel to cool and soothe irritated skin.</p>
      <h3>Kapha Skin Pack</h3>
      <p>Combine chickpea flour with turmeric and lemon juice to control oiliness and brighten the skin.</p>
    `
  },
  {
    title: "Benefits of Honey in Ayurveda",
    thumbnail: img17,
    img: img24,
    desc: "Learn how raw honey acts as a natural humectant and antibacterial agent for glowing and healthy skin.",
    content: `
      <p>Raw honey is a revered ingredient in Ayurveda for its natural humectant and antibacterial properties.</p>
      <h3>Moisturizing Effects</h3>
      <p>Honey helps retain moisture in the skin, keeping it soft and supple.</p>
      <h3>Antibacterial Properties</h3>
      <p>It can help reduce acne-causing bacteria and soothe inflammation.</p>
      <h3>Healing and Regeneration</h3>
      <p>Honey supports skin repair and can speed up wound healing.</p>
      <p>Use raw honey directly as a mask or mix it with other natural ingredients for enhanced benefits.</p>
    `
  },
  {
    title: "Ayurvedic Bath Rituals to Rejuvenate You",
    thumbnail: img18,
    img: img25,
    desc: "Step into the world of herbal baths, steam treatments, and traditional scrubs to deeply cleanse and energize.",
    content: `
      <p>Ayurvedic bath rituals offer a luxurious way to cleanse, detoxify, and relax the body and mind.</p>
      <h3>Herbal Baths</h3>
      <p>Soaking in water infused with herbs like neem, turmeric, and rose petals purifies the skin and balances doshas.</p>
      <h3>Steam Treatments</h3>
      <p>Steam infused with medicinal herbs opens pores and helps eliminate toxins through sweating.</p>
      <h3>Traditional Scrubs</h3>
      <p>Using natural scrubs like chickpea flour or rice powder exfoliates dead skin cells and stimulates circulation.</p>
      <p>Incorporating these rituals weekly leaves your skin glowing and your spirit refreshed.</p>
    `
  },
  {
    title: "Eating for Glowing Skin – Ayurvedic Diet Tips",
    thumbnail: img19,
    img: img26,
    desc: "Your skin reflects your digestion. Find out how to eat according to your dosha for inner and outer radiance.",
    content: `
      <p>Your skin's health is deeply connected to your digestion and diet in Ayurveda.</p>
      <h3>Eat According to Your Dosha</h3>
      <ul>
        <li><strong>Vata:</strong> Warm, oily, and nourishing foods like cooked grains, nuts, and warm milk.</li>
        <li><strong>Pitta:</strong> Cooling, mildly spiced foods such as cucumbers, melons, and leafy greens.</li>
        <li><strong>Kapha:</strong> Light, dry, and warming foods like legumes, bitter greens, and spices like ginger.</li>
      </ul>
      <h3>Stay Hydrated</h3>
      <p>Drink warm water throughout the day to help flush toxins and maintain moisture balance.</p>
      <h3>Avoid Processed Foods</h3>
      <p>Highly processed, oily, or sugary foods can imbalance doshas and manifest as skin issues.</p>
      <p>Following these diet tips helps you achieve inner harmony and radiant skin from within.</p>
    `
  }
];

const Blog = () => {
  const [modalData, setModalData] = useState(null);
  const navigate = useNavigate();

  const openModal = (index) => setModalData(blogData[index]);
  const closeModal = () => setModalData(null);

  return (
    <div className={styles.blogPage}>
      <header className={styles.header}>
        <h1>🌸 Ayurveda Beauty Blog 🌸</h1>
        <p>Explore the secrets of timeless natural beauty</p>
        <div className={styles.backButtonWrapper}>
          <button
            onClick={() => navigate('/home')}
            className={styles.backToHomeButton}
          >
            <span className={styles.backArrow}>←</span>
            Back to Home
          </button>
        </div>
      </header>

      <div className={styles.blogContainer}>
        {blogData.map((post, index) => (
          <div key={index} className={styles.blogPost} onClick={() => openModal(index)}>
            <img src={post.thumbnail} alt={post.title} />
            <div className={styles.blogContent}>
              <h2>{post.title}</h2>
              <p>{post.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {modalData && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span className={styles.close} onClick={closeModal}>
              &times;
            </span>
            <h1>{modalData.title}</h1>
            <img src={modalData.img} alt={modalData.title} />
            <div dangerouslySetInnerHTML={{ __html: modalData.content }} />
          </div>
        </div>
      )}

      <footer className={styles.footer} style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
        padding: '50px 20px',
        borderTop: '3px solid #ec4899'
      }}>
        {/* Background with beauty/blog images */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 1,
          opacity: 0.25
        }}>
          <div style={{
            display: 'flex',
            gap: '1.2rem',
            animation: 'scrollRight 85s linear infinite',
            width: 'calc(200% + 1.2rem)',
            height: '100%',
            alignItems: 'center'
          }}>
            {/* Blog/beauty images */}
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img14} alt="Beauty 1" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img15} alt="Beauty 2" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img16} alt="Beauty 3" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img17} alt="Beauty 4" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img18} alt="Beauty 5" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img19} alt="Beauty 6" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img20} alt="Beauty 7" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img21} alt="Beauty 8" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img22} alt="Beauty 9" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img24} alt="Beauty 10" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img25} alt="Beauty 11" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img26} alt="Beauty 12" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            
            {/* Duplicate set for seamless loop */}
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img14} alt="Beauty 1" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img15} alt="Beauty 2" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img16} alt="Beauty 3" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img17} alt="Beauty 4" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img18} alt="Beauty 5" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img19} alt="Beauty 6" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img20} alt="Beauty 7" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img21} alt="Beauty 8" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img22} alt="Beauty 9" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img24} alt="Beauty 10" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img25} alt="Beauty 11" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={img26} alt="Beauty 12" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(1.1)' }} />
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <p style={{ 
            margin: 0, 
            fontSize: '18px', 
            fontWeight: '700',
            color: '#be185d',
            textShadow: '1px 1px 3px rgba(255,255,255,0.9)'
          }}>
            &copy; 2025 VisageAI. All rights reserved.
          </p>
          <p style={{ 
            margin: '10px 0 0 0', 
            fontSize: '15px', 
            color: '#be185d',
            textShadow: '1px 1px 3px rgba(255,255,255,0.9)'
          }}>
            Designed with ❤️ by <strong>Sanika Nayakal</strong> & <strong>Prathamesh Pabe</strong>
          </p>
          <p style={{ 
            margin: '15px 0 0 0', 
            fontSize: '13px', 
            color: '#db2777',
            fontStyle: 'italic',
            textShadow: '1px 1px 3px rgba(255,255,255,0.9)'
          }}>
            🌸 Timeless beauty through Ayurvedic wisdom 🌸
          </p>
        </div>

        <style jsx>{`
          @keyframes scrollRight {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </footer>
    </div>
  );
};

export default Blog;
