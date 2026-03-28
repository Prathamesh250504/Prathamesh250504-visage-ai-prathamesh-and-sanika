import React, { useState } from 'react';

const skinTypes = [
  {
    id: "oily",
    label: "Oily Skin",
    icon: "💧",
    color: "var(--mint)",
    description: "Characterized by excess sebum production, enlarged pores, and a shiny appearance, especially in the T-zone. Prone to blackheads and breakouts.",
    characteristics: [
      "Shiny appearance, especially by midday",
      "Visible, enlarged pores",
      "Prone to blackheads and acne",
      "Makeup tends to slide off"
    ],
    essentials: [
      { product: "Cleanser", tip: "Gel or foam cleanser with salicylic acid or niacinamide" },
      { product: "Moisturizer", tip: "Lightweight, oil-free gel or water-based moisturizer" },
      { product: "Sunscreen", tip: "Matte-finish, non-comedogenic, oil-free formula" },
      { product: "Serum", tip: "Niacinamide serum to control oil and minimize pores" },
    ],
    tips: [
      "Cleanse twice daily but avoid over-washing",
      "Use clay masks weekly for deep pore cleansing",
      "Never skip moisturizer – dehydration triggers more oil",
      "Look for 'non-comedogenic' and 'oil-free' on labels",
      "Blotting papers help control midday shine"
    ],
  },
  {
    id: "dry",
    label: "Dry Skin",
    icon: "☀️",
    color: "var(--blush)",
    description: "Lacks natural oils and moisture, resulting in a tight, uncomfortable feeling. May appear dull with visible flakiness and fine lines.",
    characteristics: [
      "Tight, uncomfortable feeling after cleansing",
      "Visible flakiness or dry patches",
      "Dull, lackluster complexion",
      "Fine lines appear more prominent"
    ],
    essentials: [
      { product: "Cleanser", tip: "Cream, milk, or oil-based cleanser with ceramides" },
      { product: "Moisturizer", tip: "Rich cream with hyaluronic acid, shea butter, and ceramides" },
      { product: "Sunscreen", tip: "Hydrating formula with added moisturizing ingredients" },
      { product: "Serum", tip: "Hyaluronic acid serum for deep hydration boost" },
    ],
    tips: [
      "Apply moisturizer on damp skin to lock in water",
      "Use a humidifier in dry or air-conditioned environments",
      "Avoid hot water – it strips natural oils",
      "Layer products from thinnest to thickest consistency",
      "Consider facial oils as the last step at night"
    ],
  },
  {
    id: "sensitive",
    label: "Sensitive Skin",
    icon: "💖",
    color: "var(--lavender)",
    description: "Easily irritated and reactive to products, weather, or stress. May experience redness, stinging, burning, or itching sensations.",
    characteristics: [
      "Easily irritated by products or environment",
      "Prone to redness and flushing",
      "May experience stinging or burning",
      "Reacts to fragrance and harsh ingredients"
    ],
    essentials: [
      { product: "Cleanser", tip: "Fragrance-free micellar water or gentle cream cleanser" },
      { product: "Moisturizer", tip: "Minimal ingredients, fragrance-free, ceramide-rich" },
      { product: "Sunscreen", tip: "Mineral sunscreen with zinc oxide (gentler than chemical)" },
      { product: "Serum", tip: "Centella asiatica (cica) or aloe-based calming serum" },
    ],
    tips: [
      "Patch test every new product for 48-72 hours",
      "Avoid fragrance, alcohol, and essential oils",
      "Introduce only one new product at a time",
      "Keep your routine simple with fewer products",
      "Look for 'hypoallergenic' and 'dermatologist-tested'"
    ],
  },
  {
    id: "acne",
    label: "Acne-Prone",
    icon: "⚡",
    color: "var(--gold)",
    description: "Experiences frequent breakouts including blackheads, whiteheads, pustules, or cystic acne. Requires careful product selection to avoid clogging pores.",
    characteristics: [
      "Frequent breakouts and blemishes",
      "Blackheads and whiteheads",
      "May have post-acne marks or scarring",
      "Skin may be oily or combination"
    ],
    essentials: [
      { product: "Cleanser", tip: "BHA/salicylic acid gel cleanser for pore penetration" },
      { product: "Moisturizer", tip: "Oil-free, non-comedogenic gel moisturizer" },
      { product: "Sunscreen", tip: "Lightweight, non-comedogenic, won't clog pores" },
      { product: "Treatment", tip: "Benzoyl peroxide, retinoid, or adapalene as spot treatment" },
    ],
    tips: [
      "Never pick or pop – it causes scarring and spreads bacteria",
      "Change pillowcases 2-3 times per week",
      "Be patient – acne treatments take 6-8 weeks to show results",
      "Consult a dermatologist for persistent or severe acne",
      "Keep hair and hands away from your face"
    ],
  },
  {
    id: "combination",
    label: "Combination",
    icon: "🔄",
    color: "var(--secondary)",
    description: "Features both oily and dry areas. Typically oily in the T-zone (forehead, nose, chin) with normal to dry cheeks. Requires a balanced approach.",
    characteristics: [
      "Oily T-zone (forehead, nose, chin)",
      "Normal to dry cheeks",
      "May have visible pores on nose",
      "Skin needs different care in different areas"
    ],
    essentials: [
      { product: "Cleanser", tip: "Gentle gel cleanser that balances without stripping" },
      { product: "Moisturizer", tip: "Lightweight lotion, apply more on dry areas" },
      { product: "Sunscreen", tip: "Fluid or gel-cream texture that works for both zones" },
      { product: "Serum", tip: "Niacinamide to balance sebum across all zones" },
    ],
    tips: [
      "Multi-mask: use clay on T-zone, hydrating mask on cheeks",
      "Adjust your routine by season (heavier in winter)",
      "Apply targeted treatments only where needed",
      "Don't over-treat oily areas – balance is key",
      "Use lighter products overall, layer on dry spots"
    ],
  },
];

const SkinTypeTabs = () => {
  const [activeType, setActiveType] = useState("oily");
  const activeSkin = skinTypes.find((type) => type.id === activeType);

  return (
    <section className="section-padding" id="skin-types" style={{
      background: 'var(--card)',
      position: 'relative'
    }}>
      <div className="container-tight">
        <div style={{
          textAlign: 'center',
          maxWidth: '768px',
          margin: '0 auto 48px'
        }}>
          <span style={{
            display: 'inline-block',
            padding: '4px 16px',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--primary)',
            background: 'rgba(217, 115, 152, 0.1)',
            borderRadius: '9999px'
          }}>
            Know Your Skin
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontFamily: 'Playfair Display, serif',
            fontWeight: '500',
            marginBottom: '24px'
          }}>
            Skincare by Skin Type
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'var(--muted-foreground)',
            lineHeight: '1.6'
          }}>
            Understanding your skin type is the first step to building an effective routine. 
            Find products and tips tailored specifically for your skin's unique needs.
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '48px'
        }}>
          {skinTypes.map((type) => {
            const isActive = type.id === activeType;
            return (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '9999px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive ? 'var(--primary)' : 'var(--muted)',
                  color: isActive ? 'white' : 'var(--muted-foreground)',
                  boxShadow: isActive ? '0 4px 12px rgba(217, 115, 152, 0.3)' : 'none'
                }}
              >
                <span style={{ fontSize: '16px' }}>{type.icon}</span>
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Active content */}
        <div className="glass-card animate-fade-in" key={activeType} style={{
          padding: '48px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '48px'
        }}>
          {/* Left - Description & Essentials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '9999px',
                background: `${activeSkin.color}20`,
                marginBottom: '16px'
              }}>
                <span style={{ fontSize: '20px' }}>{activeSkin.icon}</span>
                <span style={{ fontWeight: '500' }}>{activeSkin.label}</span>
              </div>
              <p style={{
                color: 'var(--muted-foreground)',
                lineHeight: '1.6'
              }}>{activeSkin.description}</p>
            </div>

            <div>
              <h3 style={{
                fontSize: '18px',
                fontFamily: 'Playfair Display, serif',
                fontWeight: '500',
                marginBottom: '16px'
              }}>Common Characteristics</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeSkin.characteristics.map((char, idx) => (
                  <li key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    fontSize: '14px',
                    color: 'var(--muted-foreground)'
                  }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      marginTop: '8px',
                      flexShrink: 0
                    }} />
                    {char}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{
                fontSize: '18px',
                fontFamily: 'Playfair Display, serif',
                fontWeight: '500',
                marginBottom: '16px'
              }}>Recommended Products</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeSkin.essentials.map((item) => (
                  <div
                    key={item.product}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      padding: '16px',
                      background: 'rgba(245, 242, 240, 0.5)',
                      borderRadius: '12px'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: `${activeSkin.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <span style={{
                        fontFamily: 'Playfair Display, serif',
                        fontWeight: '500',
                        fontSize: '14px'
                      }}>{item.product[0]}</span>
                    </div>
                    <div>
                      <div style={{ fontWeight: '500' }}>{item.product}</div>
                      <div style={{
                        fontSize: '14px',
                        color: 'var(--muted-foreground)'
                      }}>{item.tip}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Tips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{
              fontSize: '18px',
              fontFamily: 'Playfair Display, serif',
              fontWeight: '500'
            }}>Expert Tips for {activeSkin.label}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeSkin.tips.map((tip, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '16px',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    transition: 'border-color 0.3s ease'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(217, 115, 152, 0.1)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontFamily: 'Playfair Display, serif'
                  }}>
                    {index + 1}
                  </div>
                  <p style={{
                    color: 'var(--muted-foreground)',
                    paddingTop: '4px'
                  }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkinTypeTabs;