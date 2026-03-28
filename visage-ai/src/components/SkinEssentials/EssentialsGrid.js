import React from 'react';
import faceCleanserImage from '../../assets/face cleanser.jpeg';
import moisturizerImage from '../../assets/moisturizer.jpeg';
import sunscreenImage from '../../assets/sunscreen.jpeg';
import serumImage from '../../assets/serum.jpeg';
import nightCreamImage from '../../assets/night cream.jpeg';

const ProductCard = ({
  image,
  title,
  purpose,
  suitable,
  ingredients,
  usage,
  types,
  benefits,
  howToUse,
  gradient,
  accentColor,
}) => {
  return (
    <div className="glass-card-hover" style={{ overflow: 'hidden' }}>
      {/* Image area */}
      <div style={{
        aspectRatio: '9/12',
        background: gradient,
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative circles - adjusted for better image visibility */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20px',
          left: '-20px',
          width: '60px',
          height: '60px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%'
        }} />
        
        {/* Product image */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.1))'
        }}>
          {typeof image === 'string' && (image.includes('.') || image.startsWith('data:') || image.startsWith('http') || image.startsWith('/')) ? (
            <img 
              src={image} 
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              onLoad={() => console.log('Image loaded successfully:', title)}
              onError={(e) => {
                console.log('Image failed to load:', image);
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <span style={{ fontSize: '48px' }}>
              {image}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <h3 style={{
            fontSize: '20px',
            fontFamily: 'Playfair Display, serif',
            fontWeight: '500'
          }}>{title}</h3>
          <span style={{
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: '500',
            borderRadius: '9999px',
            background: accentColor,
            color: 'white'
          }}>
            {usage}
          </span>
        </div>

        <p style={{
          color: 'var(--muted-foreground)',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          {purpose}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px' }}>
          <div>
            <span style={{
              fontSize: '12px',
              fontWeight: '500',
              color: 'var(--muted-foreground)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Suitable For
            </span>
            <p style={{ fontSize: '14px', marginTop: '4px' }}>{suitable}</p>
          </div>

          {types && types.length > 0 && (
            <div>
              <span style={{
                fontSize: '12px',
                fontWeight: '500',
                color: 'var(--muted-foreground)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Types Available
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {types.map((type) => (
                  <span
                    key={type}
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      background: 'var(--muted)',
                      borderRadius: '8px'
                    }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <span style={{
              fontSize: '12px',
              fontWeight: '500',
              color: 'var(--muted-foreground)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Key Ingredients
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {ingredients.map((ingredient) => (
                <span
                  key={ingredient}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    background: 'rgba(217, 115, 152, 0.1)',
                    color: 'var(--primary)',
                    borderRadius: '8px'
                  }}
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          {benefits && benefits.length > 0 && (
            <div>
              <span style={{
                fontSize: '12px',
                fontWeight: '500',
                color: 'var(--muted-foreground)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Benefits
              </span>
              <ul style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {benefits.map((benefit) => (
                  <li key={benefit} style={{
                    fontSize: '14px',
                    color: 'var(--muted-foreground)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: 'var(--primary)'
                    }} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <span style={{
              fontSize: '12px',
              fontWeight: '500',
              color: 'var(--muted-foreground)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              How to Use
            </span>
            <p style={{
              fontSize: '14px',
              marginTop: '4px',
              color: 'var(--muted-foreground)'
            }}>{howToUse}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const products = [
  {
    image: faceCleanserImage,
    title: "Face Cleanser",
    purpose: "Removes dirt, oil, makeup, and pollution without stripping your skin's natural moisture barrier. The foundation of any good skincare routine.",
    suitable: "All skin types – oily, dry, sensitive, acne-prone",
    ingredients: ["Salicylic Acid", "Glycerin", "Ceramides", "Niacinamide"],
    usage: "AM & PM",
    types: ["Gel Cleanser", "Foam Cleanser", "Cream Cleanser", "Oil Cleanser"],
    howToUse: "Apply to damp skin, massage gently in circular motions for 60 seconds, then rinse with lukewarm water.",
    gradient: "linear-gradient(135deg, var(--mint-light), var(--mint))",
    accentColor: "var(--mint)",
  },
  {
    image: moisturizerImage,
    title: "Moisturizer",
    purpose: "Hydrates deeply and repairs the skin barrier, locking in moisture for soft, supple skin. Essential for maintaining skin health and preventing dryness.",
    suitable: "Essential for all skin types",
    ingredients: ["Hyaluronic Acid", "Ceramides", "Niacinamide", "Squalane"],
    usage: "AM & PM",
    types: ["Gel (Oily)", "Cream (Dry)", "Lotion (Normal)", "Balm (Very Dry)"],
    howToUse: "Apply to clean, slightly damp skin. Gently press into skin rather than rubbing for better absorption.",
    gradient: "linear-gradient(135deg, var(--lavender-light), var(--lavender))",
    accentColor: "var(--lavender)",
  },
  {
    image: sunscreenImage,
    title: "Sunscreen SPF 50",
    purpose: "The most important anti-aging product. Protects against UV damage, prevents premature aging, dark spots, and reduces skin cancer risk.",
    suitable: "Non-negotiable for everyone, everyday",
    ingredients: ["Zinc Oxide", "Titanium Dioxide", "Vitamin E", "Niacinamide"],
    usage: "Every AM",
    types: ["Mineral (Physical)", "Chemical", "Hybrid"],
    benefits: ["Prevents sun damage", "Anti-aging protection", "Reduces hyperpigmentation", "Prevents skin cancer"],
    howToUse: "Apply generously (2 finger lengths for face) 15 mins before sun exposure. Reapply every 2 hours.",
    gradient: "linear-gradient(135deg, var(--cream), var(--gold))",
    accentColor: "var(--gold)",
  },
  {
    image: serumImage,
    title: "Face Serum",
    purpose: "Concentrated active ingredients that penetrate deeply for targeted treatment. Addresses specific concerns like dullness, aging, acne, or dehydration.",
    suitable: "Choose based on your specific skin concerns",
    ingredients: ["Vitamin C", "Niacinamide", "Hyaluronic Acid", "Retinol"],
    usage: "AM or PM",
    types: ["Vitamin C – Brightening", "Niacinamide – Oil Control", "Hyaluronic Acid – Hydration", "Retinol – Anti-aging"],
    howToUse: "Apply 3-4 drops to clean skin before moisturizer. Pat gently, don't rub. Wait 1-2 mins before next step.",
    gradient: "linear-gradient(135deg, var(--blush-light), var(--blush))",
    accentColor: "var(--primary)",
  },
  {
    image: nightCreamImage,
    title: "Night Cream",
    purpose: "Intensive overnight repair while you sleep. Your skin regenerates at night, making this the perfect time for active treatments and deep nourishment.",
    suitable: "Anti-aging, dullness, texture concerns",
    ingredients: ["Retinol", "Peptides", "Bakuchiol", "Ceramides"],
    usage: "PM Only",
    types: ["Night Cream", "Retinol Treatment", "Sleeping Mask"],
    benefits: ["Accelerates cell renewal", "Reduces fine lines", "Improves skin texture", "Deep hydration"],
    howToUse: "Apply as the last step of your PM routine. Use retinol products 2-3 times per week initially.",
    gradient: "linear-gradient(135deg, var(--secondary), var(--lavender))",
    accentColor: "var(--secondary-foreground)",
  },
];

const EssentialsGrid = () => {
  return (
    <section className="section-padding" id="products" style={{
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--gradient-hero)',
        opacity: 0.5
      }} />
      <div style={{
        position: 'absolute',
        top: '25%',
        left: 0,
        width: '384px',
        height: '384px',
        background: 'rgba(217, 115, 152, 0.05)',
        borderRadius: '50%',
        filter: 'blur(48px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '25%',
        right: 0,
        width: '384px',
        height: '384px',
        background: 'rgba(212, 196, 224, 0.1)',
        borderRadius: '50%',
        filter: 'blur(48px)'
      }} />

      <div className="container-tight" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '768px',
          margin: '0 auto 64px'
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
            The 5 Essentials
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontFamily: 'Playfair Display, serif',
            fontWeight: '500',
            marginBottom: '24px'
          }}>
            Your Complete Skincare Arsenal
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'var(--muted-foreground)',
            lineHeight: '1.6'
          }}>
            Every effective skincare routine is built on these five essential products. 
            Master these basics, and you're on your way to your healthiest skin ever.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '32px'
        }}>
          {products.map((product, index) => (
            <div
              key={product.title}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EssentialsGrid;