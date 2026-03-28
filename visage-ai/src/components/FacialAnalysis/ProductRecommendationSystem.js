import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { products } from '../ProductsPage/productsData';
import './ProductRecommendationSystem.css';

const ProductRecommendationSystem = ({ analysisData }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!analysisData) return null;

  const { skinType, skinTone, acne, pigmentation, darkCircles } = analysisData;

  // Generate product recommendations based on detected conditions using real product data
  const generateProductRecommendations = () => {
    const recommendations = [];

    // Helper function to format product for recommendation
    const formatProduct = (product) => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      type: product.category,
      description: product.description,
      price: `₹${product.price}`,
      originalPrice: product.originalPrice ? `₹${product.originalPrice}` : null,
      rating: product.rating,
      reviews: product.reviews,
      image: product.image,
      store: product.store,
      link: product.link,
      benefits: getProductBenefits(product.category, product.name)
    });

    // Helper function to get benefits based on product category and name
    const getProductBenefits = (category, name) => {
      const benefitsMap = {
        cleanser: {
          default: ['Deep cleansing', 'Removes impurities', 'Gentle on skin'],
          salicylic: ['Unclogs pores', 'Reduces acne', 'Exfoliates gently'],
          gentle: ['Suitable for sensitive skin', 'Maintains skin barrier', 'Non-irritating']
        },
        serum: {
          vitamin: ['Brightens skin tone', 'Antioxidant protection', 'Fades dark spots'],
          niacinamide: ['Controls oil production', 'Minimizes pores', 'Reduces inflammation'],
          hyaluronic: ['Deep hydration', 'Plumps skin', 'Improves texture']
        },
        moisturizer: {
          gel: ['Lightweight hydration', 'Non-greasy formula', 'Quick absorption'],
          cream: ['Rich moisturization', 'Long-lasting hydration', 'Repairs skin barrier'],
          default: ['Daily hydration', 'Soft smooth skin', 'Maintains moisture']
        },
        sunscreen: {
          default: ['Broad spectrum protection', 'Prevents sun damage', 'Anti-aging benefits'],
          matte: ['Oil-free formula', 'Matte finish', 'Perfect for oily skin'],
          watery: ['Lightweight texture', 'No white cast', 'Quick absorption']
        },
        toner: {
          rose: ['Refreshes skin', 'Balances pH', 'Soothes irritation'],
          glycolic: ['Exfoliates dead skin', 'Improves texture', 'Brightens complexion'],
          default: ['Prepares skin', 'Tightens pores', 'Refreshing feel']
        }
      };

      const categoryBenefits = benefitsMap[category] || { default: ['Improves skin health', 'Quality formula', 'Trusted brand'] };
      
      // Match specific product names to benefits
      const lowerName = name.toLowerCase();
      if (lowerName.includes('vitamin c')) return categoryBenefits.vitamin || categoryBenefits.default;
      if (lowerName.includes('niacinamide')) return categoryBenefits.niacinamide || categoryBenefits.default;
      if (lowerName.includes('hyaluronic')) return categoryBenefits.hyaluronic || categoryBenefits.default;
      if (lowerName.includes('salicylic')) return categoryBenefits.salicylic || categoryBenefits.default;
      if (lowerName.includes('gentle')) return categoryBenefits.gentle || categoryBenefits.default;
      if (lowerName.includes('gel')) return categoryBenefits.gel || categoryBenefits.default;
      if (lowerName.includes('cream')) return categoryBenefits.cream || categoryBenefits.default;
      if (lowerName.includes('matte')) return categoryBenefits.matte || categoryBenefits.default;
      if (lowerName.includes('watery')) return categoryBenefits.watery || categoryBenefits.default;
      if (lowerName.includes('rose')) return categoryBenefits.rose || categoryBenefits.default;
      if (lowerName.includes('glycolic')) return categoryBenefits.glycolic || categoryBenefits.default;
      
      return categoryBenefits.default;
    };

    // Acne treatment products
    if (acne.severity !== 'None') {
      const acneProducts = products.filter(product => 
        (product.category === 'cleanser' && (product.name.toLowerCase().includes('salicylic') || product.name.toLowerCase().includes('acne'))) ||
        (product.category === 'serum' && product.name.toLowerCase().includes('niacinamide')) ||
        (product.category === 'cleanser' && product.name.toLowerCase().includes('foaming'))
      );

      if (acneProducts.length > 0) {
        recommendations.push({
          category: 'acne',
          condition: 'Acne Treatment',
          severity: acne.severity,
          products: acneProducts.slice(0, 3).map(formatProduct)
        });
      }
    }

    // Pigmentation treatment products
    if (pigmentation.severity !== 'None') {
      const pigmentationProducts = products.filter(product => 
        (product.category === 'serum' && product.name.toLowerCase().includes('vitamin c')) ||
        (product.category === 'toner' && product.name.toLowerCase().includes('glycolic'))
      );

      if (pigmentationProducts.length > 0) {
        recommendations.push({
          category: 'pigmentation',
          condition: 'Pigmentation Treatment',
          severity: pigmentation.severity,
          products: pigmentationProducts.slice(0, 2).map(formatProduct)
        });
      }
    }

    // Dark circles treatment products (using existing eye care or gentle products)
    if (darkCircles.severity !== 'None') {
      // Since we don't have specific eye care products, recommend gentle cleansers and hydrating products
      const eyeCareProducts = products.filter(product => 
        (product.category === 'cleanser' && product.name.toLowerCase().includes('gentle')) ||
        (product.category === 'serum' && product.name.toLowerCase().includes('hyaluronic'))
      );

      if (eyeCareProducts.length > 0) {
        recommendations.push({
          category: 'dark-circles',
          condition: 'Dark Circles Care',
          severity: darkCircles.severity,
          products: eyeCareProducts.slice(0, 2).map(formatProduct)
        });
      }
    }

    // Skin type specific products
    const skinTypeProducts = [];
    
    if (skinType.skinType === 'Oily') {
      // Oil control products
      const oilyProducts = products.filter(product => 
        (product.category === 'moisturizer' && product.name.toLowerCase().includes('gel')) ||
        (product.category === 'sunscreen' && product.name.toLowerCase().includes('matte')) ||
        (product.category === 'serum' && product.name.toLowerCase().includes('niacinamide'))
      );
      skinTypeProducts.push(...oilyProducts.slice(0, 3));
    } else if (skinType.skinType === 'Dry') {
      // Hydrating products
      const dryProducts = products.filter(product => 
        (product.category === 'moisturizer' && product.name.toLowerCase().includes('cream')) ||
        (product.category === 'serum' && product.name.toLowerCase().includes('hyaluronic')) ||
        (product.category === 'cleanser' && product.name.toLowerCase().includes('gentle'))
      );
      skinTypeProducts.push(...dryProducts.slice(0, 3));
    } else {
      // Normal skin products
      const normalProducts = products.filter(product => 
        product.category === 'moisturizer' || 
        (product.category === 'cleanser' && product.name.toLowerCase().includes('gentle'))
      );
      skinTypeProducts.push(...normalProducts.slice(0, 2));
    }

    if (skinTypeProducts.length > 0) {
      recommendations.push({
        category: 'skin-type',
        condition: `${skinType.skinType} Skin Care`,
        severity: 'Maintenance',
        products: skinTypeProducts.map(formatProduct)
      });
    }

    // Essential skincare routine products
    const essentialProducts = [];
    
    // Add sunscreen (essential for all) - choose based on skin tone
    const sunscreens = products.filter(product => product.category === 'sunscreen');
    if (sunscreens.length > 0) {
      // For darker skin tones, prefer non-matte sunscreens to avoid white cast
      if (skinTone.tone === 'Dark' || skinTone.tone === 'Brown') {
        const nonMatteScreens = sunscreens.filter(s => !s.name.toLowerCase().includes('matte'));
        essentialProducts.push(nonMatteScreens.length > 0 ? nonMatteScreens[0] : sunscreens[0]);
      } else {
        essentialProducts.push(sunscreens[0]); // Add best rated sunscreen
      }
    }

    // Add cleanser if not already recommended
    if (!recommendations.some(rec => rec.products.some(p => p.type === 'cleanser'))) {
      const cleansers = products.filter(product => product.category === 'cleanser');
      if (cleansers.length > 0) {
        essentialProducts.push(cleansers[0]);
      }
    }

    // Add toner for skin tone care
    const toners = products.filter(product => product.category === 'toner');
    if (toners.length > 0) {
      essentialProducts.push(toners[0]);
    }

    if (essentialProducts.length > 0) {
      recommendations.push({
        category: 'essentials',
        condition: 'Essential Skincare',
        severity: 'Daily Care',
        products: essentialProducts.map(formatProduct)
      });
    }

    return recommendations;
  };

  const recommendations = generateProductRecommendations();

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.category === selectedCategory);

  const getSeverityColor = (severity) => {
    const colors = {
      'None': '#10b981',
      'Mild': '#f59e0b',
      'Moderate': '#f97316',
      'Severe': '#ef4444',
      'Maintenance': '#6b7280'
    };
    return colors[severity] || '#6b7280';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="product-recommendation-system"
    >
      <div className="recommendation-header">
        <h2 className="recommendation-title">🛍️ Personalized Product Recommendations</h2>
        <p className="recommendation-subtitle">
          Based on your skin analysis, here are targeted solutions for your specific needs
        </p>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <button
          className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All Products
        </button>
        {recommendations.map((rec) => (
          <button
            key={rec.category}
            className={`filter-btn ${selectedCategory === rec.category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(rec.category)}
          >
            {rec.condition}
          </button>
        ))}
      </div>

      {/* Recommendations */}
      <div className="recommendations-container">
        {filteredRecommendations.map((recommendation, index) => (
          <motion.div
            key={recommendation.category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="recommendation-section"
          >
            <div className="section-header">
              <h3 className="section-title">{recommendation.condition}</h3>
              <span 
                className="severity-badge"
                style={{ backgroundColor: getSeverityColor(recommendation.severity) }}
              >
                {recommendation.severity}
              </span>
            </div>

            <div className="products-grid">
              {recommendation.products.map((product, productIndex) => (
                <motion.div
                  key={product.id || productIndex}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="product-card"
                >
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    <div className="product-rating">
                      <span className="rating-stars">⭐</span>
                      <span className="rating-value">{product.rating}</span>
                    </div>
                    {product.originalPrice && (
                      <div className="discount-badge">
                        {Math.round(((product.originalPrice.replace('₹', '') - product.price.replace('₹', '')) / product.originalPrice.replace('₹', '')) * 100)}% OFF
                      </div>
                    )}
                  </div>

                  <div className="product-info">
                    <div className="product-header">
                      <h4 className="product-name">{product.name}</h4>
                      <span className="product-brand">{product.brand}</span>
                    </div>

                    <p className="product-description">{product.description}</p>

                    <div className="product-benefits">
                      <h5>Benefits:</h5>
                      <ul className="benefits-list">
                        {product.benefits.map((benefit, i) => (
                          <li key={i}>{benefit}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="product-reviews">
                      <span className="reviews-count">{product.reviews} reviews</span>
                      <span className="store-badge">{product.store}</span>
                    </div>

                    <div className="product-footer">
                      <div className="price-section">
                        <span className="product-price">{product.price}</span>
                        {product.originalPrice && (
                          <span className="original-price">{product.originalPrice}</span>
                        )}
                      </div>
                      <a 
                        href={product.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="buy-now-btn"
                      >
                        Buy Now
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="recommendation-footer">
        <p className="disclaimer">
          * These recommendations are based on AI analysis. Consult with a dermatologist for severe skin conditions.
        </p>
      </div>
    </motion.div>
  );
};

export default ProductRecommendationSystem;