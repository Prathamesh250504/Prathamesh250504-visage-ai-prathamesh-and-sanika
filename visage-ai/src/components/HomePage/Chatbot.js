import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Chatbot.css";

// Dermatologist system prompt for AI (moved outside component to avoid dependency issues)
const DERMATOLOGIST_PROMPT = `You are Dr. VisageAI, an expert dermatologist with over 15 years of experience in clinical dermatology. You specialize in:

- Skin conditions (acne, eczema, psoriasis, rosacea, etc.)
- Skincare routines and product recommendations
- Skin cancer prevention and early detection
- Anti-aging treatments and procedures
- Cosmetic dermatology
- Skin health and nutrition
- Treatment options and when to see a dermatologist

Guidelines for responses:
- Always be professional, empathetic, and informative
- Provide evidence-based advice
- Include practical tips and recommendations
- Mention when professional consultation is needed
- Use emojis sparingly but appropriately
- Keep responses concise but comprehensive
- Always emphasize sun protection and proper skincare
- If asked about serious conditions, recommend seeing a dermatologist in person

Remember: You provide educational information but cannot replace in-person medical consultation for diagnosis or treatment.`;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm Dr. VisageAI, your expert dermatologist assistant 👨‍⚕️ Ask me anything about skincare, skin conditions, or dermatology!" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);
  const recognitionRef = useRef(null);

  // Enhanced fallback responses with dermatologist expertise
  const getFallbackResponse = useCallback((userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Dermatologist-level responses
    const expertResponses = {
      'acne': '👨‍⚕️ Acne is primarily caused by hormonal fluctuations, excess sebum production, and bacterial overgrowth (P. acnes). Treatment approach: 1) Gentle cleansing with salicylic acid, 2) Topical retinoids (tretinoin/adapalene), 3) Benzoyl peroxide for bacterial control. Avoid over-cleansing which can worsen inflammation. For persistent cases, consider professional consultation for oral medications.',
      
      'dry skin': '👨‍⚕️ Xerosis (dry skin) occurs due to impaired barrier function and reduced ceramide production. Management: 1) Use gentle, fragrance-free cleansers, 2) Apply moisturizer with ceramides/hyaluronic acid within 3 minutes of bathing, 3) Consider humidifier in dry environments, 4) Avoid hot water and harsh soaps. If severe or persistent, rule out underlying conditions like hypothyroidism.',
      
      'oily skin': '👨‍⚕️ Seborrhea results from overactive sebaceous glands, often influenced by genetics and hormones. Approach: 1) Use oil-free, non-comedogenic products, 2) Gentle cleansing twice daily with salicylic acid, 3) Clay masks 1-2x weekly, 4) Niacinamide serum to regulate sebum. Avoid over-cleansing which triggers rebound oil production.',
      
      'dark spots': '👨‍⚕️ Post-inflammatory hyperpigmentation (PIH) and melasma require targeted treatment. Evidence-based options: 1) Hydroquinone 2% (gold standard), 2) Vitamin C serum (L-ascorbic acid), 3) Retinoids for cellular turnover, 4) Chemical peels (glycolic/lactic acid). CRUCIAL: Daily broad-spectrum SPF 30+ to prevent worsening. Professional treatments include laser therapy.',
      
      'sensitive skin': '👨‍⚕️ Sensitive skin often indicates compromised barrier function or underlying conditions like rosacea. Management: 1) Identify and avoid triggers, 2) Use fragrance-free, hypoallergenic products, 3) Gentle cleansing with lukewarm water, 4) Barrier repair with ceramides/niacinamide. Consider patch testing new products. If persistent redness/burning, evaluate for rosacea or contact dermatitis.',
      
      'anti-aging': '👨‍⚕️ Evidence-based anti-aging approach: 1) Daily broad-spectrum SPF (most important!), 2) Retinoids (gold standard - start with retinol, progress to tretinoin), 3) Vitamin C antioxidant serum, 4) Moisturizer with peptides/hyaluronic acid. Professional options: chemical peels, microneedling, laser treatments. Consistency is key - results take 3-6 months.',
      
      'wrinkles': '👨‍⚕️ Fine lines result from collagen breakdown and repetitive muscle movements. Treatment hierarchy: 1) Prevention with SPF and retinoids, 2) Topical retinoids + peptides, 3) Professional treatments (Botox for dynamic wrinkles, fillers for volume loss, laser resurfacing). Start early with prevention - easier than correction.',

      'eczema': '👨‍⚕️ Atopic dermatitis requires comprehensive management: 1) Identify triggers (allergens, stress, weather), 2) Gentle skincare routine with ceramide-rich moisturizers, 3) Topical corticosteroids for flares (use as directed), 4) Consider wet wrap therapy for severe cases. Maintain skin barrier even when clear. Severe cases may need systemic therapy.',
      
      'sunscreen': '👨‍⚕️ Proper sun protection is the #1 anti-aging and cancer prevention strategy. Requirements: 1) Broad-spectrum SPF 30+ daily, 2) Reapply every 2 hours, 3) Use 1/4 teaspoon for face/neck, 4) Don\'t forget ears, lips, hands. Zinc oxide/titanium dioxide are gentlest for sensitive skin. UV damage is cumulative and irreversible.',
      
      'rosacea': '👨‍⚕️ Rosacea is a chronic inflammatory condition requiring gentle management: 1) Identify personal triggers (spicy foods, alcohol, heat, stress), 2) Use gentle, fragrance-free products, 3) Daily SPF is crucial, 4) Consider metronidazole gel or azelaic acid. Avoid harsh scrubs and alcohol-based products. Professional diagnosis important to rule out other conditions.'
    };

    // Check for keyword matches
    for (const [keyword, response] of Object.entries(expertResponses)) {
      if (message.includes(keyword)) {
        return response;
      }
    }

    // General responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return '👨‍⚕️ Hello! I\'m Dr. VisageAI, your dermatology expert. I\'m here to help with any skin concerns, skincare questions, or dermatological advice you need. What can I assist you with today?';
    }

    if (message.includes('product') || message.includes('recommend')) {
      return '👨‍⚕️ I\'d be happy to recommend products! For personalized recommendations, I need to know: 1) Your skin type (oily, dry, combination, sensitive), 2) Specific concerns (acne, aging, hyperpigmentation), 3) Current routine, 4) Any known allergies. What\'s your main skin concern?';
    }

    if (message.includes('doctor') || message.includes('dermatologist')) {
      return '👨‍⚕️ You should see a dermatologist in person for: suspicious moles/growths, persistent rashes, severe acne not responding to OTC treatments, hair loss, nail changes, or any concerning skin changes. I can provide guidance, but professional examination is irreplaceable for diagnosis and prescription treatments.';
    }

    // Default response
    return '👨‍⚕️ I\'d be happy to help with your dermatology question! I can assist with skincare routines, product recommendations, skin conditions, and general dermatological advice. Could you please provide more details about your specific concern?';
  }, []);

  // Function to call OpenRouter AI API
  const getAIResponse = useCallback(async (userMessage) => {
    console.log('=== OpenRouter API Call Debug ===');
    console.log('API Key exists:', !!process.env.REACT_APP_OPENROUTER_API_KEY);
    console.log('API Key prefix:', process.env.REACT_APP_OPENROUTER_API_KEY?.substring(0, 15));
    console.log('User message:', userMessage);
    console.log('Window origin:', window.location.origin);
    
    try {
      const requestBody = {
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [
          {
            role: 'system',
            content: DERMATOLOGIST_PROMPT
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      };
      
      console.log('Request URL:', 'https://openrouter.ai/api/v1/chat/completions');
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'VisageAI Dermatologist Chatbot',
      };
      
      console.log('Request headers:', headers);
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Raw response text:', responseText);

      if (!response.ok) {
        console.error('API Error - Status:', response.status);
        console.error('API Error - Response:', responseText);
        throw new Error(`API Error: ${response.status} - ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error('Invalid JSON response');
      }
      
      console.log('Parsed API Response:', data);
      
      if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        console.log('Success! Got response:', data.choices[0].message.content);
        return data.choices[0].message.content;
      } else {
        console.error('Unexpected response format:', data);
        throw new Error('Unexpected response format - no content found');
      }
    } catch (error) {
      console.error('=== OpenRouter API Error ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      
      // Fallback to local dermatologist responses if API fails
      console.log('=== Falling back to local responses ===');
      return getFallbackResponse(userMessage);
    }
  }, [getFallbackResponse]);

  const handleSend = useCallback(async (msg) => {
    const text = msg || input;
    if (!text.trim()) return;
    
    console.log('Sending message:', text);
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setIsTyping(true);

    try {
      // Get AI response
      console.log('Calling getAIResponse...');
      const response = await getAIResponse(text);
      console.log('Got response:', response);
      
      // Simulate typing delay for better UX
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { sender: "bot", text: response }]);
      }, 1500);
    } catch (error) {
      console.error('Error in handleSend:', error);
      setIsTyping(false);
      setMessages((prev) => [...prev, { 
        sender: "bot", 
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or feel free to ask about common skin concerns!" 
      }]);
    }
  }, [input, getAIResponse]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Voice recognition error:", event.error);
      };

      recognitionRef.current = recognition;
    }
  }, [handleSend]);

  const scrollToBottom = () => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  };

  useEffect(() => scrollToBottom(), [messages]);

  const startVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    } else {
      alert("Voice recognition not supported in your browser");
    }
  };

  return (
    <>
      <button
        id="chatToggleBtn"
        onClick={() => setIsOpen(!isOpen)}
      >
        👨‍⚕️
      </button>
      
      {isOpen && (
        <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
          <div className="chat-header">
            Dr. VisageAI - Expert Dermatologist <span>👨‍⚕️</span>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ 
                background: "none", 
                border: "none", 
                fontSize: "20px", 
                cursor: "pointer" 
              }}
            >
              &times;
            </button>
          </div>
          
          <div className="chat-box" ref={chatRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.sender}`}>
                <div className="avatar">
                  {msg.sender === "bot" ? "👨‍⚕️" : "🧑"}
                </div>
                <div className="text">{msg.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-message bot">
                <div className="avatar">👨‍⚕️</div>
                <div className="text typing">Dr. VisageAI is analyzing your question...</div>
              </div>
            )}
          </div>
          
          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask Dr. VisageAI about your skin concerns..."
            />
            <button onClick={() => handleSend()}>➡️</button>
            <button onClick={startVoiceInput}>🎤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;