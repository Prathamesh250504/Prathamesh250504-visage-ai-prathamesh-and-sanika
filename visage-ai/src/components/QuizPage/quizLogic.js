// quizLogic.js
export const questions = [
    {
      title: "1. What is your skin type?",
      desc: "Understanding your skin type helps choose the right products.",
      explanation: `There are four common skin types:<br><br>
        <strong>Oily</strong>: Shiny, greasy, prone to acne.<br>
        <strong>Dry</strong>: Flaky, rough, dull appearance.<br>
        <strong>Combination</strong>: Oily in the T-zone, dry on cheeks.<br>
        <strong>Sensitive</strong>: Easily irritated, reacts to products.<br><br>
        To test: Wash your face, wait an hour, press a tissue. If oil appears only on T-zone, you may have combination skin.`,
      input: ["Oily", "Dry", "Combination", "Sensitive"],
      name: "skinType",
      images: [
        require("../../assets/quiz-icons/oily-skin.png"),
        require("../../assets/quiz-icons/dry.png"),
        require("../../assets/quiz-icons/combination-skin.png")
      ]
    },
    {
      title: "2. What is your gender?",
      desc: "Skin needs vary slightly between males and females.",
      explanation: `Skincare products can be tailored based on gender-specific needs.<br>
        <strong>Female</strong>: Often focuses on hydration, glow, anti-aging.<br>
        <strong>Male</strong>: Often focuses on oil control, shaving care, minimal routines.`,
      input: ["Male", "Female"],
      name: "gender",
      images: [
        require("../../assets/quiz-icons/man.png"),
        require("../../assets/quiz-icons/woman.png")
      ]
    },
    {
      title: "3. How old are you?",
      desc: "Your age helps identify skin aging concerns and preventions.",
      explanation: `Younger skin often focuses on acne and hydration, while mature skin may require anti-aging care like retinols and antioxidants.`,
      input: "age",
      name: "age",
      type: "number",
      images: [
        require("../../assets/quiz-icons/growth.png")
      ]
    },
    {
        title: "4. How often do you experience breakouts?",
        desc: "Frequency of breakouts helps tailor acne treatment.",
        explanation: `Breakouts can be caused by hormones, diet, stress, or improper skincare.<br><br>
          Options:<br>
          <strong>Never</strong>: Rarely get pimples.<br>
          <strong>Occasionally</strong>: Few pimples now and then.<br>
          <strong>Frequently</strong>: Regular acne issues.<br>
          <strong>Severe</strong>: Persistent and severe acne.`,
        input: ["Never", "Occasionally", "Frequently", "Severe"],
        name: "breakouts",
        images: [
            require("../../assets/quiz-icons/acne.png"),
            require("../../assets/quiz-icons/pigment.png"),
            require("../../assets/quiz-icons/acne (1).png")
        ]
      },
      {
        title: "5. How sensitive is your skin to new products?",
        desc: "Sensitivity affects how you choose skincare products.",
        explanation: `Sensitive skin reacts easily causing redness, itching, or burning.<br><br>
          <strong>Not sensitive</strong>: No reactions.<br>
          <strong>Mildly sensitive</strong>: Slight irritation sometimes.<br>
          <strong>Very sensitive</strong>: Often reacts negatively.`,
        input: ["Not sensitive", "Mildly sensitive", "Very sensitive"],
        name: "sensitivity",
        images: [
            require("../../assets/quiz-icons/hypoallergenic.png"),
            require("../../assets/quiz-icons/sensitive.png"),
            require("../../assets/quiz-icons/dermis.png")
        ]
      },
      {
        title: "6. What is your primary skin concern?",
        desc: "Identifying concerns helps focus the treatment plan.",
        explanation: `Common skin concerns include:<br>
          <strong>Acne</strong>, <strong>Wrinkles</strong>, <strong>Dryness</strong>, <strong>Dullness</strong>, <strong>Dark Spots</strong>, <strong>Redness</strong>.`,
        input: ["Acne", "Wrinkles", "Dryness", "Dullness", "Dark Spots", "Redness"],
        name: "concern",
        images: []
      },
      {
        title: "7. How much water do you drink daily?",
        desc: "Hydration plays a big role in skin health.",
        explanation: `Drinking enough water helps maintain skin moisture and elasticity.<br><br>
          Recommended: 8 glasses (about 2 liters) per day.`,
        input: ["Less than 4 glasses", "4-6 glasses", "6-8 glasses", "More than 8 glasses"],
        name: "waterIntake",
        images: [
            require("../../assets/quiz-icons/water.png")
        ]
      },
      {
        title: "8. How many hours do you sleep on average?",
        desc: "Sleep affects skin regeneration and appearance.",
        explanation: `Adequate sleep (7-9 hours) promotes healthy glowing skin. Lack of sleep can cause dark circles, dullness, and premature aging.`,
        input: ["Less than 5 hours", "5-6 hours", "7-8 hours", "More than 8 hours"],
        name: "sleep",
        images: [
            require("../../assets/quiz-icons/sleep.png")
        ]
      },
      {
        title: "9. How often do you use sunscreen?",
        desc: "Sunscreen protects skin from UV damage and aging.",
        explanation: `UV rays cause wrinkles, pigmentation, and skin cancer.<br><br>
          Use sunscreen daily, even indoors or on cloudy days.`,
        input: ["Never", "Sometimes", "Most days", "Every day"],
        name: "sunscreen",
        images: [
            require("../../assets/quiz-icons/sunscreen.png"),
            require("../../assets/quiz-icons/uv-protection.png")
        ]
      },
      {
        title: "10. What kind of cleanser do you use?",
        desc: "Cleansers help maintain skin balance and hygiene.",
        explanation: `Choose cleansers based on skin type:<br>
          <strong>Gel</strong> or foaming cleansers for oily skin.<br>
          <strong>Cream</strong> or hydrating cleansers for dry/sensitive skin.`,
        input: ["Gel", "Foaming", "Cream", "None"],
        name: "cleanser",
        images: [
            require("../../assets/quiz-icons/face-cleanser.png"),
            require("../../assets/quiz-icons/cream.png")
        ]
      },
      {
        title: "11. How often do you exfoliate?",
        desc: "Exfoliation removes dead skin cells and brightens skin.",
        explanation: `Exfoliate 1-2 times a week for most skin types.<br>
          Avoid over-exfoliation to prevent irritation.`,
        input: ["Never", "Once a week", "Twice a week", "More than twice"],
        name: "exfoliate",
        images: [
            require("../../assets/quiz-icons/face-scrub.png"),
            require("../../assets/quiz-icons/exfoliation.png"),
        ]
      }
  ];
  
  export const generateAnalysis = (answers) => {
    let analysis = "";
  
    if (answers.skinType === "Oily") {
      analysis += "<h3>🌟 Skin Type: Oily</h3><p>Your skin produces excess oil. Use gel-based or foaming cleansers and non-comedogenic moisturizers. Clay masks and salicylic acid help control acne.</p>";
    } else if (answers.skinType === "Dry") {
      analysis += "<h3>🌟 Skin Type: Dry</h3><p>Your skin lacks moisture. Use hydrating cleansers, avoid hot water, and apply thick moisturizers with ingredients like hyaluronic acid and ceramides.</p>";
    } else if (answers.skinType === "Combination") {
      analysis += "<h3>🌟 Skin Type: Combination</h3><p>You have both oily and dry areas. Use gentle, balancing products and treat zones separately when needed.</p>";
    } else if (answers.skinType === "Sensitive") {
      analysis += "<h3>🌟 Skin Type: Sensitive</h3><p>Your skin is prone to irritation. Choose fragrance-free and hypoallergenic products. Always patch test new items.</p>";
    }
  
    const age = parseInt(answers.age);
    if (age < 20) {
      analysis += "<h3>👶 Age Group: Teen</h3><p>Focus on acne prevention, gentle cleansing, and SPF usage. Avoid harsh treatments.</p>";
    } else if (age <= 30) {
      analysis += "<h3>💁 Age Group: 20s</h3><p>Hydration and sun protection are key. Start using antioxidants like Vitamin C.</p>";
    } else if (age <= 40) {
      analysis += "<h3>🧖 Age Group: 30s</h3><p>Introduce retinols, AHAs, and firming treatments. Hydration and SPF are still essential.</p>";
    } else {
      analysis += "<h3>🧓 Age Group: 40+</h3><p>Use products with peptides, retinoids, and deep hydration. Focus on elasticity and dark spot correction.</p>";
    }
  
    if (answers.breakouts === "Frequently" || answers.breakouts === "Severe") {
      analysis += "<h3>🔴 Breakouts</h3><p>You may benefit from salicylic acid, benzoyl peroxide, or niacinamide. Cleanse twice daily and avoid pore-clogging ingredients.</p>";
    }
  
    if (answers.sensitivity === "Very sensitive") {
      analysis += "<h3>😣 Sensitivity</h3><p>Your skin is reactive. Avoid alcohol, fragrance, and exfoliating more than once a week.</p>";
    }
  
    if (answers.concern === "Acne") {
      analysis += "<h3>💥 Concern: Acne</h3><p>Try products with salicylic acid, tea tree oil, and niacinamide. Keep your skin clean and avoid touching your face often.</p>";
    } else if (answers.concern === "Wrinkles") {
      analysis += "<h3>🕳️ Concern: Wrinkles</h3><p>Include retinoids, peptides, and Vitamin C. Regular moisturizing and SPF are key to prevention.</p>";
    } else if (answers.concern === "Dryness") {
      analysis += "<h3>💧 Concern: Dryness</h3><p>Look for rich moisturizers, hydrating serums with hyaluronic acid, and avoid harsh cleansers.</p>";
    } else if (answers.concern === "Dullness") {
      analysis += "<h3>✨ Concern: Dullness</h3><p>Exfoliate 1-2 times a week. Use products with Vitamin C or glycolic acid to boost glow.</p>";
    } else if (answers.concern === "Dark Spots") {
      analysis += "<h3>🌑 Concern: Dark Spots</h3><p>Use niacinamide, Vitamin C, and SPF daily. Consider mild peels under dermatologist supervision.</p>";
    } else if (answers.concern === "Redness") {
      analysis += "<h3>🌸 Concern: Redness</h3><p>Use calming ingredients like Centella Asiatica and chamomile. Avoid hot water and spicy foods.</p>";
    }
  
    if (answers.waterIntake === "Less than 4 glasses") {
      analysis += "<h3>🚰 Hydration</h3><p>Your water intake is low. Increase to at least 6–8 glasses per day to keep skin plump and healthy.</p>";
    }
  
    if (answers.sleep === "Less than 5 hours") {
      analysis += "<h3>🛌 Sleep</h3><p>Try to sleep at least 7–8 hours. Rest is essential for glowing, healthy skin and faster healing.</p>";
    }
  
    if (answers.sunscreen === "Never" || answers.sunscreen === "Sometimes") {
      analysis += "<h3>🌞 Sunscreen</h3><p>Please wear sunscreen daily to protect against premature aging and skin damage—even indoors!</p>";
    }
  
    if (answers.cleanser === "None") {
      analysis += "<h3>🧼 Cleansing</h3><p>Start cleansing daily with a suitable product based on your skin type.</p>";
    }
  
    if (answers.exfoliate === "More than twice") {
      analysis += "<h3>🧽 Exfoliation</h3><p>Be cautious! Over-exfoliating can damage the skin barrier. Limit it to 1–2 times per week.</p>";
    }
  
    return analysis;
  };
  