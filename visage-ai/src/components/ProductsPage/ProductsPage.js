import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { products, budgetOptions } from './productsData.js';
import bannerImage from '../../assets/banner.jpeg';
import './ProductsPage.css';

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

// OpenAI Integration Service
class OpenAIProductService {
  constructor() {
    // Note: In production, API key should be stored securely on backend
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1/chat/completions';
  }

  async getProductRecommendations(skinType, concerns, budget, preferences = {}) {
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Using fallback recommendations.');
      return this.getFallbackRecommendations(skinType, concerns, budget);
    }

    try {
      const prompt = this.buildPrompt(skinType, concerns, budget, preferences);
      
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional skincare consultant and product expert. Provide specific, actionable product recommendations with real brand names, prices, and where to buy them.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseAIResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return this.getFallbackRecommendations(skinType, concerns, budget);
    }
  }

  buildPrompt(skinType, concerns, budget, preferences) {
    return `
      I need skincare product recommendations for someone with:
      - Skin Type: ${skinType}
      - Main Concerns: ${concerns.join(', ')}
      - Budget: ₹${budget}
      - Preferences: ${JSON.stringify(preferences)}

      Please provide:
      1. 5-7 specific product recommendations with exact brand names
      2. Price range for each product in Indian Rupees
      3. Where to buy (Amazon India, Nykaa, Flipkart, etc.)
      4. Brief explanation why each product suits their needs
      5. Complete routine order (cleanser, toner, serum, moisturizer, sunscreen)

      Format as JSON with this structure:
      {
        "recommendations": [
          {
            "name": "Product Name",
            "brand": "Brand Name",
            "category": "cleanser/toner/serum/moisturizer/sunscreen",
            "price": "₹XXX-XXX",
            "buyLink": "store name",
            "reason": "why this product",
            "rating": 4.5
          }
        ],
        "routine": ["step1", "step2", ...],
        "totalCost": "₹XXX"
      }
    `;
  }

  parseAIResponse(response) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // If no JSON found, parse manually
      return this.parseTextResponse(response);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return this.getFallbackRecommendations('Normal', ['hydration'], 1000);
    }
  }

  parseTextResponse(text) {
    // Manual parsing for non-JSON responses
    const lines = text.split('\n').filter(line => line.trim());
    const recommendations = [];
    
    lines.forEach(line => {
      if (line.includes('₹') && (line.includes('cleanser') || line.includes('serum') || line.includes('moisturizer'))) {
        const parts = line.split('-');
        if (parts.length >= 2) {
          recommendations.push({
            name: parts[0].trim(),
            brand: 'Various',
            category: 'skincare',
            price: '₹200-500',
            buyLink: 'Amazon India',
            reason: 'AI recommended for your skin type',
            rating: 4.0
          });
        }
      }
    });

    return {
      recommendations: recommendations.slice(0, 6),
      routine: ['Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Sunscreen'],
      totalCost: '₹800-1500'
    };
  }

  getFallbackRecommendations(skinType, concerns, budget) {
    // Fallback recommendations when API is unavailable
    const fallbackProducts = {
      'Oily': [
        { name: 'Cetaphil Oily Skin Cleanser', brand: 'Cetaphil', category: 'cleanser', price: '₹350', buyLink: 'Amazon India', reason: 'Controls oil without over-drying', rating: 4.3 },
        { name: 'The Ordinary Niacinamide 10%', brand: 'The Ordinary', category: 'serum', price: '₹590', buyLink: 'Nykaa', reason: 'Reduces oil production and pores', rating: 4.5 },
        { name: 'Neutrogena Oil-Free Moisturizer', brand: 'Neutrogena', category: 'moisturizer', price: '₹299', buyLink: 'Flipkart', reason: 'Lightweight, non-comedogenic', rating: 4.2 }
      ],
      'Dry': [
        { name: 'CeraVe Hydrating Cleanser', brand: 'CeraVe', category: 'cleanser', price: '₹450', buyLink: 'Amazon India', reason: 'Gentle, maintains moisture barrier', rating: 4.4 },
        { name: 'Hyaluronic Acid Serum', brand: 'Minimalist', category: 'serum', price: '₹399', buyLink: 'Nykaa', reason: 'Deep hydration for dry skin', rating: 4.3 },
        { name: 'Nivea Soft Moisturizer', brand: 'Nivea', category: 'moisturizer', price: '₹199', buyLink: 'Local Stores', reason: 'Rich, long-lasting hydration', rating: 4.1 }
      ],
      'Normal': [
        { name: 'Himalaya Purifying Neem Face Wash', brand: 'Himalaya', category: 'cleanser', price: '₹140', buyLink: 'Amazon India', reason: 'Gentle daily cleanser', rating: 4.0 },
        { name: 'Vitamin C Serum', brand: 'Mamaearth', category: 'serum', price: '₹499', buyLink: 'Mamaearth Store', reason: 'Brightening and antioxidant protection', rating: 4.2 },
        { name: 'Lakme Peach Milk Moisturizer', brand: 'Lakme', category: 'moisturizer', price: '₹225', buyLink: 'Nykaa', reason: 'Balanced hydration for normal skin', rating: 4.0 }
      ]
    };

    const products = fallbackProducts[skinType] || fallbackProducts['Normal'];
    
    return {
      recommendations: products,
      routine: ['Cleanser', 'Serum', 'Moisturizer', 'Sunscreen'],
      totalCost: `₹${products.reduce((sum, p) => sum + parseInt(p.price.replace(/[₹,]/g, '')), 0)}`
    };
  }

  async searchRealTimeProducts(query, category = '') {
    // This would integrate with shopping APIs in production
    // For now, return structured search results
    const searchResults = [
      {
        name: `${query} - Best Seller`,
        price: '₹299-599',
        rating: 4.3,
        reviews: 1250,
        availability: 'In Stock',
        seller: 'Amazon India',
        image: '/api/placeholder/200/200'
      },
      {
        name: `${query} - Premium Choice`,
        price: '₹599-999',
        rating: 4.5,
        reviews: 890,
        availability: 'In Stock',
        seller: 'Nykaa',
        image: '/api/placeholder/200/200'
      }
    ];

    return searchResults;
  }
}

const ProductsPageEnhanced = () => {
  const navigate = useNavigate();

  // Product States
  const [searchQuery, setSearchQuery] = useState('');
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [activeBudget, setActiveBudget] = useState(null);
  const [budget, setBudget] = useState(500);
  const [customBudget, setCustomBudget] = useState('');

  // AI-powered states
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [skinProfile, setSkinProfile] = useState({
    skinType: 'Normal',
    concerns: [],
    budget: 1000,
    preferences: {}
  });
  const [realTimeProducts, setRealTimeProducts] = useState([]);
  const [isSearchingRealTime, setIsSearchingRealTime] = useState(false);

  // Initialize AI service
  const aiService = useMemo(() => new OpenAIProductService(), []);

  const handleApplyBudget = (budgetValue) => {
    setActiveBudget(budgetValue);
    setIsBudgetDialogOpen(false);
  };

  const handleClearBudget = () => {
    setActiveBudget(null);
  };

  const handleQuickSelect = (value) => {
    setBudget(value);
    setCustomBudget('');
  };

  const handleCustomBudgetChange = (value) => {
    setCustomBudget(value);
    const num = parseInt(value);
    if (!isNaN(num) && num > 0) {
      setBudget(num);
    }
  };

  // AI-powered product recommendation functions
  const handleGetAIRecommendations = async () => {
    setIsLoadingAI(true);
    try {
      const recommendations = await aiService.getProductRecommendations(
        skinProfile.skinType,
        skinProfile.concerns,
        skinProfile.budget,
        skinProfile.preferences
      );
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleRealTimeSearch = async (query) => {
    if (!query.trim()) return;
    
    setIsSearchingRealTime(true);
    try {
      const results = await aiService.searchRealTimeProducts(query, '');
      setRealTimeProducts(results);
    } catch (error) {
      console.error('Error searching real-time products:', error);
    } finally {
      setIsSearchingRealTime(false);
    }
  };

  const handleSkinProfileUpdate = (field, value) => {
    setSkinProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConcernToggle = (concern) => {
    setSkinProfile(prev => ({
      ...prev,
      concerns: prev.concerns.includes(concern)
        ? prev.concerns.filter(c => c !== concern)
        : [...prev.concerns, concern]
    }));
  };

  // Calculate budget routine
  const budgetRoutine = useMemo(() => {
    if (!activeBudget) return null;

    const routineOrder = [
      { category: 'cleanser', label: 'Cleanser', emoji: '🧴' },
      { category: 'toner', label: 'Toner', emoji: '💧' },
      { category: 'serum', label: 'Serum', emoji: '💎' },
      { category: 'moisturizer', label: 'Moisturizer', emoji: '🧈' },
      { category: 'sunscreen', label: 'Sunscreen', emoji: '☀️' },
      { category: 'lipbalm', label: 'Lip Balm', emoji: '💋' },
    ];

    const selectedProducts = [];
    let remainingBudget = activeBudget;
    const missing = [];

    for (const { category, label } of routineOrder) {
      const currentBudget = remainingBudget; // Capture current budget value
      const categoryProducts = products
        .filter((p) => p.category === category && p.price <= currentBudget)
        .sort((a, b) => {
          const valueA = a.rating / a.price;
          const valueB = b.rating / b.price;
          return valueB - valueA;
        });

      if (categoryProducts.length > 0) {
        const bestProduct = categoryProducts.reduce((best, current) => {
          if (current.rating >= 4.0 && current.price < best.price) {
            return current;
          }
          return best;
        }, categoryProducts[0]);

        selectedProducts.push(bestProduct);
        remainingBudget -= bestProduct.price;
      } else {
        missing.push(label);
      }
    }

    const total = selectedProducts.reduce((sum, p) => sum + p.price, 0);

    return {
      routine: selectedProducts,
      totalPrice: total,
      missingCategories: missing,
      routineOrder,
    };
  }, [activeBudget]);

  return (
    <div className="visage-ai-page">
      {/* New Banner Section */}
      <section style={{
        position: 'relative',
        height: '600px',
        borderRadius: '20px',
        margin: '20px',
        overflow: 'hidden',
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Search Box - Top Right */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 10
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '20px',
            padding: '8px 16px', // Matching back button exactly
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            width: '300px',
            height: 'auto', // Let height be determined by content
            minHeight: '36px' // Set minimum height to match button
          }}>
            <i className="fas fa-search" style={{
              color: '#666',
              marginRight: '8px',
              fontSize: '14px',
              lineHeight: '1' // Ensure icon doesn't add height
            }}></i>
            <input
              type="text"
              placeholder="Search by product name, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '14px',
                width: '100%',
                color: '#333',
                padding: '0', // Remove any padding from input
                margin: '0', // Remove any margin from input
                lineHeight: '1.6' // Control line height
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  fontSize: '16px',
                  padding: '0 4px'
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Back to Home Button - Top Left */}
        <button
          onClick={() => navigate('/home')}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            padding: '8px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: '#333',
            border: 'none',
            borderRadius: '20px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 10
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
        >
          ← Back to Home
        </button>

        {/* Banner Content */}
        <div style={{
          textAlign: 'center',
          color: 'white',
          zIndex: 5,
          maxWidth: '600px',
          padding: '0 20px'
        }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 'bold',
            marginBottom: '8px',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Build Your Perfect
          </h1>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            fontWeight: '300',
            marginBottom: '16px',
            color: '#ff69b4',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Skincare Routine
          </h2>
          <p style={{
            fontSize: '16px',
            marginBottom: '24px',
            opacity: 0.9,
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
          }}>
            Find the best skincare products within your budget. Get a complete<br />
            routine including cleanser, serum, moisturizer, sunscreen & more!
          </p>
          
          {/* Button Container */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAIDialog(true)}
              style={{
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>🤖</span>
              AI Product Finder
            </motion.button>
          </div>
        </div>
      </section>

      {/* Budget Routine Section */}
      {budgetRoutine && (
        <section className="products-budget-routine">
          <div className="products-container">
            <div className="products-budget-header">
              <div>
                <h2 className="products-budget-title">
                  ✨ Your Complete Routine Under ₹{activeBudget}
                </h2>
                <p className="products-budget-subtitle">
                  We found {budgetRoutine.routine?.length || 0} products for your perfect skincare routine
                </p>
              </div>
              <div className="products-budget-price">
                <p className="products-budget-price-label">Total Price</p>
                <p className="products-budget-price-value">₹{budgetRoutine.totalPrice || 0}</p>
                <p className="products-budget-price-savings">
                  ₹{activeBudget - (budgetRoutine.totalPrice || 0)} under budget!
                </p>
                <button
                  className="products-budget-clear"
                  onClick={handleClearBudget}
                  title="Clear budget filter"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="products-grid products-grid-budget">
              {budgetRoutine.routine && budgetRoutine.routine.length > 0 ? (
                budgetRoutine.routine.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="products-empty">
                  <p>No products found for this budget.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Search with AI */}
      <div className="ai-search-enhancement" style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        padding: '20px',
        margin: '20px 0',
        borderRadius: '15px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: 'white', marginBottom: '15px' }}>🔍 Smart Product Search</h3>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search for any skincare product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '12px 15px',
              borderRadius: '25px',
              border: 'none',
              minWidth: '300px',
              fontSize: '16px'
            }}
          />
          <button
            onClick={() => handleRealTimeSearch(searchQuery)}
            disabled={isSearchingRealTime}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#f5576c',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {isSearchingRealTime ? '🔍 Searching...' : '🔍 AI Search'}
          </button>
        </div>
      </div>

      {/* AI Recommendations Display */}
      {aiRecommendations && (
        <div className="ai-recommendations-section" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '40px 20px',
          margin: '40px 0',
          borderRadius: '20px'
        }}>
          <div className="products-container">
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
              🤖 AI-Powered Recommendations
            </h2>
            
            <div className="ai-routine-summary" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '20px',
              borderRadius: '15px',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              <h3>Recommended Routine Order</h3>
              <p>{aiRecommendations.routine?.join(' → ') || 'Cleanser → Serum → Moisturizer → Sunscreen'}</p>
              <p><strong>Estimated Total: {aiRecommendations.totalCost}</strong></p>
            </div>

            <div className="ai-products-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {aiRecommendations.recommendations?.map((product, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#333',
                  padding: '20px',
                  borderRadius: '15px',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
                }}>
                  <h4 style={{ color: '#667eea', marginBottom: '10px' }}>{product.name}</h4>
                  <p><strong>Brand:</strong> {product.brand}</p>
                  <p><strong>Price:</strong> {product.price}</p>
                  <p><strong>Available at:</strong> {product.buyLink}</p>
                  <p><strong>Rating:</strong> ⭐ {product.rating}/5</p>
                  <p style={{ fontSize: '14px', color: '#666' }}>{product.reason}</p>
                  
                  <button
                    onClick={() => handleRealTimeSearch(product.name)}
                    style={{
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      padding: '10px 15px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      marginTop: '10px',
                      width: '100%'
                    }}
                  >
                    🔍 Find Real-Time Prices
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Real-Time Search Results */}
      {realTimeProducts.length > 0 && (
        <div className="real-time-results" style={{
          background: '#f8f9fa',
          padding: '30px 20px',
          margin: '20px 0',
          borderRadius: '15px'
        }}>
          <div className="products-container">
            <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
              🔍 Real-Time Search Results
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '15px'
            }}>
              {realTimeProducts.map((product, index) => (
                <div key={index} style={{
                  background: 'white',
                  padding: '15px',
                  borderRadius: '10px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}>
                  <h5 style={{ color: '#333', marginBottom: '8px' }}>{product.name}</h5>
                  <p><strong>Price:</strong> {product.price}</p>
                  <p><strong>Rating:</strong> ⭐ {product.rating} ({product.reviews} reviews)</p>
                  <p><strong>Seller:</strong> {product.seller}</p>
                  <p style={{ 
                    color: product.availability === 'In Stock' ? '#10b981' : '#ef4444',
                    fontWeight: 'bold'
                  }}>
                    {product.availability}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="products-footer">
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
        <div className="products-container products-footer-content-wrapper">
          <div className="products-footer-content">
            <div className="products-logo">
              <span className="products-logo-icon">✨</span>
              <span className="products-logo-text">VisageAI</span>
            </div>
            <p className="products-footer-text">
              AI-Powered Skincare Product Recommendations
            </p>
            <p className="products-footer-text">
              Discover your perfect skincare routine with intelligent product matching
            </p>
          </div>

          {/* Enhanced Copyright Section */}
          <div className="products-footer-copyright">
            <div className="products-copyright-main">
              <p>
                &copy; 2025 <strong>VisageAI</strong>. All rights reserved.
              </p>
              <p className="products-copyright-creators">
                Built with <span className="heart">❤️</span> by <strong>Sanika Nayakal</strong> and <strong>Prathamesh Pabe</strong>
              </p>
            </div>
            <div className="products-copyright-links">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Contact Us</span>
            </div>
          </div>

          <div className="products-footer-disclaimer">
            <p>
              <strong>Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional medical advice.
              Product prices and availability are subject to change. We are not affiliated with Amazon or Flipkart.
              Always consult with a dermatologist before starting any new skincare routine.
            </p>
          </div>
        </div>
      </footer>

      {/* AI Product Finder Dialog */}
      {showAIDialog && (
        <div className="products-dialog-overlay" onClick={() => setShowAIDialog(false)}>
          <div className="products-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="products-dialog-header">
              <h3 className="products-dialog-title">🤖 AI Product Finder</h3>
              <p className="products-dialog-description">
                Get personalized product recommendations powered by OpenAI
              </p>
            </div>

            <div className="products-dialog-content">
              <div className="products-dialog-section">
                <label className="products-dialog-label">Skin Type</label>
                <select 
                  value={skinProfile.skinType}
                  onChange={(e) => handleSkinProfileUpdate('skinType', e.target.value)}
                  className="products-budget-input"
                >
                  <option value="Normal">Normal</option>
                  <option value="Oily">Oily</option>
                  <option value="Dry">Dry</option>
                  <option value="Combination">Combination</option>
                  <option value="Sensitive">Sensitive</option>
                </select>
              </div>

              <div className="products-dialog-section">
                <label className="products-dialog-label">Skin Concerns (Select multiple)</label>
                <div className="products-budget-options">
                  {['Acne', 'Dark Spots', 'Wrinkles', 'Dryness', 'Oiliness', 'Sensitivity', 'Dullness'].map((concern) => (
                    <button
                      key={concern}
                      onClick={() => handleConcernToggle(concern)}
                      className={`products-budget-option ${
                        skinProfile.concerns.includes(concern) ? 'products-budget-option-active' : ''
                      }`}
                    >
                      {concern}
                    </button>
                  ))}
                </div>
              </div>

              <div className="products-dialog-section">
                <label className="products-dialog-label">Budget Range</label>
                <div className="products-budget-input-wrapper">
                  <span className="products-budget-input-icon">₹</span>
                  <input
                    type="number"
                    placeholder="Enter budget"
                    value={skinProfile.budget}
                    onChange={(e) => handleSkinProfileUpdate('budget', parseInt(e.target.value) || 1000)}
                    className="products-budget-input"
                  />
                </div>
              </div>

              <div className="products-dialog-info">
                🤖 Our AI will analyze your profile and find the best products from real-time data
              </div>
            </div>

            <div className="products-dialog-actions">
              <button
                className="products-dialog-button products-dialog-button-secondary"
                onClick={() => setShowAIDialog(false)}
              >
                Cancel
              </button>
              <button
                className="products-dialog-button products-dialog-button-primary"
                onClick={handleGetAIRecommendations}
                disabled={isLoadingAI}
              >
                {isLoadingAI ? '🤖 AI Thinking...' : '🤖 Get AI Recommendations'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isBudgetDialogOpen && (
        <div className="products-dialog-overlay" onClick={() => setIsBudgetDialogOpen(false)}>
          <div className="products-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="products-dialog-header">
              <h3 className="products-dialog-title">✨ Set Your Budget</h3>
              <p className="products-dialog-description">
                Tell us your budget and we'll suggest a complete skincare routine that fits!
              </p>
            </div>

            <div className="products-dialog-content">
              <div className="products-dialog-section">
                <label className="products-dialog-label">Quick Select</label>
                <div className="products-budget-options">
                  {budgetOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleQuickSelect(option.value)}
                      className={`products-budget-option ${budget === option.value && customBudget === ''
                        ? 'products-budget-option-active'
                        : ''
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="products-dialog-section">
                <label className="products-dialog-label">Or enter custom budget</label>
                <div className="products-budget-input-wrapper">
                  <span className="products-budget-input-icon">₹</span>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={customBudget}
                    onChange={(e) => handleCustomBudgetChange(e.target.value)}
                    className="products-budget-input"
                  />
                </div>
              </div>

              <div className="products-dialog-section">
                <div className="products-budget-slider-header">
                  <label className="products-dialog-label">Adjust budget</label>
                  <span className="products-budget-slider-value">₹{budget}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="50"
                  value={budget}
                  onChange={(e) => {
                    setBudget(parseInt(e.target.value));
                    setCustomBudget('');
                  }}
                  className="products-budget-slider"
                />
                <div className="products-budget-slider-labels">
                  <span>₹200</span>
                  <span>₹2000</span>
                </div>
              </div>

              <div className="products-dialog-info">
                💡 We'll find you a complete routine including cleanser, serum, moisturizer,
                sunscreen & lip balm within ₹{budget}
              </div>
            </div>

            <div className="products-dialog-actions">
              <button
                className="products-dialog-button products-dialog-button-secondary"
                onClick={() => setIsBudgetDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="products-dialog-button products-dialog-button-primary"
                onClick={() => handleApplyBudget(budget)}
              >
                ✨ Find Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="products-card"
    >
      <div className="products-card-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="products-card-image"
        />

        <div className="products-card-badges">
          {discount > 0 && (
            <span className="products-card-badge products-card-badge-discount">
              {discount}% OFF
            </span>
          )}
          <span
            className={`products-card-badge ${product.store === 'amazon'
              ? 'products-card-badge-amazon'
              : 'products-card-badge-flipkart'
              }`}
          >
            {product.store === 'amazon' ? 'Amazon' : 'Flipkart'}
          </span>
        </div>
      </div>

      <div className="products-card-content">
        <p className="products-card-brand">{product.brand}</p>
        <h3 className="products-card-name">{product.name}</h3>

        <div className="products-card-rating">
          <div className="products-card-rating-badge">
            <span className="products-card-star">★</span>
            <span className="products-card-rating-value">{product.rating}</span>
          </div>
          <span className="products-card-reviews">
            ({product.reviews.toLocaleString()} reviews)
          </span>
        </div>

        <div className="products-card-price">
          <span className="products-card-price-current">₹{product.price}</span>
          {product.originalPrice && (
            <span className="products-card-price-original">₹{product.originalPrice}</span>
          )}
        </div>

        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="products-card-button"
        >
          View on {product.store === 'amazon' ? 'Amazon' : 'Flipkart'}
          <i className="fas fa-external-link-alt"></i>
        </a>
      </div>
    </motion.div>
  );
};

export default ProductsPageEnhanced;
