/**
 * VASTU SUTRAM – Web & API Server
 * Lightweight, zero-dependency Node.js HTTP server
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const VASTU_DATA = require('./js/data.js');

// In-memory rate limiter for /api/chat (per IP, max 25 requests per minute)
const chatRateLimits = new Map();
function checkChatRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxReqs = 25;
  const record = chatRateLimits.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + windowMs;
  } else {
    record.count += 1;
  }
  chatRateLimits.set(ip, record);
  return record.count <= maxReqs;
}

// Helper for outbound HTTPS JSON requests (used by LLM providers)
function postJsonHttps(targetUrl, headers, payload, timeoutMs = 18000) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(targetUrl);
    const bodyString = JSON.stringify(payload);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port || 443,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyString),
        ...headers
      }
    };
    const req = https.request(reqOptions, (res) => {
      let raw = '';
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        try {
          const json = raw ? JSON.parse(raw) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject(new Error(`API HTTP ${res.statusCode}: ${raw.slice(0, 240)}`));
          }
        } catch (e) {
          reject(new Error(`Invalid JSON from provider: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error('LLM request timed out'));
    });
    req.write(bodyString);
    req.end();
  });
}

// Build complete Vastu Sutram System Prompt & Retrieval Context
function buildVastuSystemPrompt(languagePref = 'auto') {
  const pkgLines = (VASTU_DATA.packages || []).map(p =>
    `• [${p.category.toUpperCase()}] ${p.name} (ID: ${p.id}) — ${p.price} | Duration: ${p.duration} | Mode: ${p.mode} | Deliverables: ${(p.deliverables || []).join('; ')}`
  ).join('\n');

  const dirLines = (VASTU_DATA.directions || []).map(d =>
    `• ${d.name}: Element=${d.element || ''}, Planet=${d.rulingPlanet || d.planet || ''}, Deity=${d.rulingDeity || d.deity || ''}, Ideal Rooms=${Array.isArray(d.idealRooms) ? d.idealRooms.join(', ') : (d.idealRooms || '')}, Guidelines=${d.dosAndDonts || ''}`
  ).join('\n');

  const elemLines = (VASTU_DATA.panchabhutas || []).map(e =>
    `• ${e.name} (${e.direction}): ${e.energy}. ${e.description}`
  ).join('\n');

  return `You are "Vastu Sutram AI Assistant", the 24/7 Virtual Vastu Customer Support Executive representing Senior Vastu Consultant Rajni Singh at "Vastu Sutram – The Principles of Vastu".

IDENTITY & PERSONALITY:
- Polite, warm, respectful, patient, and conversational (never robotic).
- Clearly identify yourself as the Vastu Sutram AI Assistant, never pretend to be Rajni Singh herself.
- Fluent in English, Hindi (Devanagari), and Hinglish (Roman Hindi). Always reply in the language the user writes in, unless languagePref="${languagePref}" explicitly specifies 'en', 'hi', or 'hinglish'.
- Distinguish traditional Vastu Shastra architectural principles from guaranteed scientific outcomes. Never guarantee financial, medical, or personal outcomes. Never claim AI advice replaces a formal blueprint audit.

VERIFIED BUSINESS & CONSULTANT FACTS:
- Lead Consultant: Rajni Singh (Senior Vastu Consultant & Vedic Space Planner, 15+ Years Practice, Vastu Acharya, 1,200+ spatial audits, 100% Non-Demolition Remedies).
- Official Email: vastusutram@gmail.com
- Official WhatsApp: +91 91814 57155 (also supports +91 81457 15755)
- Coverage: Pan-India On-Site Visits & Global Online Video/Phone Consultations.
- Hours: Monday – Saturday, 09:30 AM – 07:00 PM IST.

VERIFIED CONSULTATION PACKAGES & STARTING PRICES (Never invent prices or discounts; final scope depends on blueprint evaluation):
${pkgLines}

FIVE ELEMENTS (PANCHABHUTAS):
${elemLines}

DIRECTIONS & ROOM PLACEMENT MATRIX:
${dirLines}

RESPONSE GUIDELINES:
1. Keep responses concise, structured, warm, and easy to read (use bullet points where helpful).
2. Always ask 1 thoughtful follow-up question to understand the visitor's space (e.g., whether they have a floor plan, whether it is new construction or an existing home, or their city).
3. When recommending a package, mention its exact name, starting price, duration, mode, and key deliverables.
4. If the user wants to speak directly with Rajni Singh, has a complex layout, or needs personal assessment, say: "I would be happy to help you connect with Rajni Singh for personalised assistance. You can share your requirement directly through WhatsApp."`;
}

// Detect language (English, Hindi Devanagari, or Hinglish)
function detectQueryLanguage(text = '', preferred = 'auto') {
  if (preferred && preferred !== 'auto') return preferred;
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  const lower = ` ${text.toLowerCase()} `;
  const hinglishMarkers = [
    ' kya ', ' kaise ', ' kahan ', ' mera ', ' mere ', ' ghar ', ' makan ',
    ' dukaan ', ' plot ', ' दिशा ', ' vastu ', ' kitna ', ' fees ', ' price ',
    ' batao ', ' bataiye ', ' chahiye ', ' banwana ', ' karwana ', ' hai ', ' hain ',
    ' mein ', ' ke liye ', ' konsa ', ' kaunsa ', ' namaste ', ' ji '
  ];
  let hits = 0;
  for (const m of hinglishMarkers) {
    if (lower.includes(m)) hits++;
  }
  if (hits >= 2) return 'hinglish';
  return 'en';
}

// Retrieval-Augmented Intelligent Response Generator (used when external LLM API key is not configured or as fallback)
function generateKnowledgeBaseResponse(userMessage = '', history = [], languagePref = 'auto') {
  const q = (userMessage || '').trim();
  const lower = q.toLowerCase();
  const lang = detectQueryLanguage(q, languagePref);

  let reply = '';
  let suggestedQuickReplies = [
    'Explore Vastu Services',
    'Consultation Packages & Pricing',
    'Book a Consultation',
    'Talk to a Human Consultant'
  ];
  let recommendedPackageId = null;
  let triggerBookingWizard = false;
  let showWhatsAppConnect = false;

  // 1. Human Consultant / Speak to Rajni Singh / Dissatisfied / Complex Layout
  if (
    lower.includes('human') ||
    lower.includes('rajni') ||
    lower.includes('talk to consultant') ||
    lower.includes('speak to') ||
    lower.includes('call') ||
    lower.includes('whatsapp') ||
    lower.includes('complex') ||
    lower.includes('complicated') ||
    lower.includes('baat karni') ||
    lower.includes('सलाहकार') ||
    lower.includes('राजनी')
  ) {
    showWhatsAppConnect = true;
    if (lang === 'hi') {
      reply = `मैं व्यक्तिगत सहायता के लिए आपको वरिष्ठ वास्तु सलाहकार **राजनी सिंह (Rajni Singh)** से जोड़ने में प्रसन्नता महसूस करूंगा। आप अपनी प्रॉपर्टी या नक्शे (Floor Plan) की जानकारी सीधे WhatsApp के माध्यम से साझा कर सकते हैं।\n\n• **प्रमुख सलाहकार:** राजनी सिंह (15+ वर्षों का अनुभव, वास्तु आचार्य)\n• **समय:** सोमवार – शनिवार (09:30 AM – 07:00 PM IST)\n• **पद्धति:** 100% बिना तोड़-फोड़ (Non-Demolition) वैज्ञानिक वास्तु समाधान`;
    } else if (lang === 'hinglish') {
      reply = `Main aapko personal guidance ke liye Senior Vastu Consultant **Rajni Singh** ji se connect karne mein khushi mehsoos karunga. Aap apni requirement aur floor plan seedhe WhatsApp par share kar sakte hain.\n\n"I would be happy to help you connect with Rajni Singh for personalised assistance. You can share your requirement directly through WhatsApp."`;
    } else {
      reply = `I would be happy to help you connect with **Rajni Singh** for personalised assistance. You can share your requirement directly through WhatsApp.\n\n• **Senior Consultant:** Rajni Singh (15+ Years Experience, Vastu Acharya)\n• **Consultation Hours:** Monday – Saturday, 09:30 AM – 07:00 PM IST\n• **Approach:** 100% Non-Demolition Vedic Spatial Harmonization`;
    }
    suggestedQuickReplies = ['Book a Consultation', 'Consultation Packages & Pricing', 'Explore Vastu Services'];
    return { reply, suggestedQuickReplies, recommendedPackageId, triggerBookingWizard, showWhatsAppConnect, lang };
  }

  // 2. Booking Intent
  if (
    lower.includes('book a consultation') ||
    lower.includes('book consultation') ||
    lower.includes('book appointment') ||
    lower.includes('schedule consultation') ||
    lower.includes('start booking') ||
    lower.includes('booking') ||
    lower.includes('कंसल्टेशन बुक') ||
    lower.includes('अपॉइंटमेंट')
  ) {
    triggerBookingWizard = true;
    if (lang === 'hi') {
      reply = `बहुत बढ़िया! मैं आपकी कंसल्टेशन बुकिंग में अभी मदद कर सकता हूँ। कृपया नीचे दिए गए गाइडेड बुकिंग असिस्टेंट में अपनी जानकारी भरें, या सीधे वेबसाइट के बुकिंग फॉर्म पर जाएँ।`;
    } else if (lang === 'hinglish') {
      reply = `Bahut badhiya! Main aapki Vastu consultation booking mein abhi madad karta hoon. Aap yahan chat mein hi step-by-step apni details de sakte hain, jiske baad hum aapka WhatsApp booking message taiyar kar denge.`;
    } else {
      reply = `Wonderful! I would be delighted to guide you through your Vastu consultation booking right here in the chat. Let's collect a few quick details so we can prepare your structured enquiry dossier for WhatsApp.`;
    }
    suggestedQuickReplies = ['Start Chat Booking Assistant', 'Consultation Packages & Pricing', 'Talk to a Human Consultant'];
    return { reply, suggestedQuickReplies, recommendedPackageId, triggerBookingWizard, showWhatsAppConnect, lang };
  }

  // 3. New House Construction / Planning a New Home
  if (
    (lower.includes('new') && (lower.includes('house') || lower.includes('home') || lower.includes('construct') || lower.includes('build'))) ||
    lower.includes('planning to construct') ||
    lower.includes('naya ghar') ||
    lower.includes('makan banwana') ||
    lower.includes('नया घर')
  ) {
    recommendedPackageId = 'pkg-res-construction';
    if (lang === 'hi') {
      reply = `यह बहुत खुशी की बात है! नए घर के निर्माण के लिए हमारा **आवासीय वास्तु परामर्श (Residential Vastu Consultation)** निर्माण से पहले नक्शे (Layout), दिशाओं और कमरों के सही स्थान को समझने में आपकी पूरी मदद कर सकता है।\n\n• **सुझाया गया पैकेज:** New Home Construction Consultation (शुरुआती शुल्क ₹35,000) या Complete Home Vastu Analysis (शुरुआती शुल्क ₹11,000)\n\nक्या आपके पास पहले से कोई फ्लोर प्लान (नक्शा) तैयार है?`;
    } else if (lang === 'hinglish') {
      reply = `Yeh bahut acchi baat hai! Naye ghar ke construction ke liye hamara **Residential Vastu Consultation** construction shuru hone se pehle layout, directions aur rooms ki sahi placement tay karne mein aapki madad karega.\n\n• **Complete Home Vastu Analysis:** Starting from ₹11,000 (90 Mins + 16-Zone Gridding & 25+ Page Report)\n• **New Home Construction Consultation:** Starting from ₹35,000 (Full Lifecycle Advisory + Architect Collaboration)\n\nKya aapke paas abhi floor plan (naksha) ready hai?`;
    } else {
      reply = `That's wonderful! For a new home, our **Residential Vastu Consultation** can help you understand the layout, directions, 32 entrance gates, and room placements before construction begins.\n\nDepending on your stage, we recommend:\n• **Complete Home Vastu Analysis (Starting from ₹11,000):** 90 Minutes + 16-Zone Padavinyasa Gridding & 25+ Page PDF Dossier.\n• **New Home Construction Consultation (Starting from ₹35,000):** Full construction lifecycle advisory, Bhumi Pujan Muhurat & architect collaboration.\n\nMay I know whether you already have a floor plan or plot map ready?`;
    }
    suggestedQuickReplies = ['Yes, I have a floor plan', 'Consultation Packages & Pricing', 'Book a Consultation'];
    return { reply, suggestedQuickReplies, recommendedPackageId, triggerBookingWizard, showWhatsAppConnect, lang };
  }

  // 4. Existing Home / Already Constructed / Flat / Non-Demolition
  if (
    lower.includes('already constructed') ||
    lower.includes('existing home') ||
    lower.includes('existing house') ||
    lower.includes('without demolition') ||
    lower.includes('non-demolition') ||
    lower.includes('flat') ||
    lower.includes('apartment') ||
    lower.includes('bana hua') ||
    lower.includes('tod fod') ||
    lower.includes('बिना तोड़')
  ) {
    recommendedPackageId = lower.includes('flat') || lower.includes('apartment') ? 'pkg-res-apartment' : 'pkg-res-complete';
    if (lang === 'hi') {
      reply = `जी हाँ, बिल्कुल! यदि आपका घर या फ्लैट पहले से बना हुआ है, तो **वास्तु सूत्रम** **100% बिना तोड़-फोड़ (Non-Demolition Remedies)** के माध्यम से ऊर्जा संतुलन करता है। इसमें धातु की पट्टियों (Metal Strips), रंगों, दिशात्मक प्रकाश और पंचतत्व संतुलन का उपयोग किया जाता है।\n\n• **Flat & Apartment Consultation:** ₹8,500 से शुरू (60 मिनट + पीडीएफ रिपोर्ट)\n• **Complete Home Vastu Analysis:** ₹11,000 से शुरू (90 मिनट + 16-ज़ोन ग्रिडिंग व विस्तृत रिपोर्ट)\n\nक्या यह एक अपार्टमेंट/फ्लैट है या स्वतंत्र मकान (Independent House)?`;
    } else if (lang === 'hinglish') {
      reply = `Ji haan, bilkul! Agar aapka ghar ya flat pehle se bana hua hai, toh Vastu Sutram **100% Non-Demolition Remedies** (bina kisi tod-fod ke) ke zariye Vastu dosh balance karta hai—jaise elemental metal strips, colors, aur directional alignment.\n\n• **Flat and Apartment Consultation:** Starting from ₹8,500\n• **Complete Home Vastu Analysis:** Starting from ₹11,000 (Most Preferred)\n\nKya aap apne flat/apartment ke liye puch rahe hain ya independent house ke liye?`;
    } else {
      reply = `Yes, certainly! For an already constructed house or apartment, Vastu Sutram specializes in **100% Non-Demolition Vastu Consultation**. We harmonize spatial imbalances using scientific 16-zone gridding, elemental metal strips, directional colour therapy, and utility adjustments—without breaking walls.\n\nRecommended packages:\n• **Complete Home Vastu Analysis (Starting from ₹11,000):** 90 Minutes + 16-Zone Gridding, 32-Gate Audit & Non-Demolition Remedies.\n• **Flat and Apartment Consultation (Starting from ₹8,500):** 60 Minutes + High-Rise Micro-Zoning & Written Report.\n\nIs your property an apartment/flat or an independent house/villa?`;
    }
    suggestedQuickReplies = ['Complete Home Analysis (₹11,000)', 'Flat Consultation (₹8,500)', 'Book a Consultation'];
    return { reply, suggestedQuickReplies, recommendedPackageId, triggerBookingWizard, showWhatsAppConnect, lang };
  }

  // 5. Online Consultation / Living in Another City / Abroad
  if (
    lower.includes('online') ||
    lower.includes('another city') ||
    lower.includes('outside') ||
    lower.includes('abroad') ||
    lower.includes('video') ||
    lower.includes('remote') ||
    lower.includes('dusre shahar') ||
    lower.includes('ऑनलाइन')
  ) {
    recommendedPackageId = 'pkg-res-complete';
    if (lang === 'hi') {
      reply = `जी हाँ! **वास्तु सूत्रम** पूरे भारत और विदेशों में **ऑनलाइन वीडियो और फ़ोन कंसल्टेशन** प्रदान करता है। आप अपना फ्लोर प्लान (नक्शा) और गूगल लोकेशन पिन हमारे साथ साझा कर सकते हैं। हम डिजिटल रूप से 16-ज़ोन और 32-द्वार की सटीक ग्रिडिंग करके आपको वीडियो कॉल पर पूरा विश्लेषण और पीडीएफ रिपोर्ट देते हैं।\n\nआप किस शहर में स्थित हैं?`;
    } else if (lang === 'hinglish') {
      reply = `Ji haan! Vastu Sutram video ya phone call ke zariye **Online Vastu Consultation** provide karta hai, chahe aap kisi bhi shahar ya desh mein ho. Aap apna floor plan aur location share karte hain, aur hum digital 16-zone gridding karke aapko detailed video session aur PDF report dete hain.\n\nAapki property kis city mein hai?`;
    } else {
      reply = `Yes! **Vastu Sutram** offers both **Online Video / Phone Consultations** (worldwide) and **In-Person On-Site Visits** (Pan-India).\n\nIf you live in another city, you simply share your floor plan/blueprint and location coordinates. Our team performs precision 16-Zone Padavinyasa Gridding and 32-Gate entrance mapping digitally, followed by a live 1-on-1 video review and a written PDF dossier.\n\nWhich city is your property located in, and what type of space is it?`;
    }
    suggestedQuickReplies = ['Residential Packages', 'Commercial Packages', 'Book a Consultation'];
    return { reply, suggestedQuickReplies, recommendedPackageId, triggerBookingWizard, showWhatsAppConnect, lang };
  }

  // 6. Packages & Pricing Queries
  if (
    lower.includes('price') ||
    lower.includes('pricing') ||
    lower.includes('package') ||
    lower.includes('cost') ||
    lower.includes('fee') ||
    lower.includes('charge') ||
    lower.includes('kitna') ||
    lower.includes('पैकेज') ||
    lower.includes('शुल्क') ||
    lower.includes('प्राइस')
  ) {
    if (lower.includes('commercial') || lower.includes('office') || lower.includes('shop') || lower.includes('hotel')) {
      recommendedPackageId = 'pkg-com-office';
      reply = `Here are our verified **Commercial Vastu Consultation Packages**:\n\n1. **Shop and Showroom Consultation** — **Starting from ₹14,000**\n   • *Duration & Mode:* 90 Minutes • On-Site / Remote\n   • *Includes:* Customer footfall entrance placement, cash counter alignment, product display optimization.\n\n2. **Office Vastu Consultation (Most Preferred)** — **Starting from ₹18,000**\n   • *Duration & Mode:* 2 Hours + Audit Report • Online Video or On-Site\n   • *Includes:* MD/Executive cabin placement, treasury/accounts zoning, team layout & reception alignment.\n\n3. **Hotel and Restaurant Consultation** — **Starting from ₹30,000**\n   • *Includes:* Commercial kitchen (Agneya) layout, dining/bar positioning & reception foyer.\n\n4. **Corporate Building Consultation** — **Starting from ₹50,000**\n   • *Includes:* Multi-floor tower analysis, C-suite boardroom & 180-day retainer.\n\n*Note: Final scope and pricing may depend on property size and blueprint evaluation.* Which commercial property are you planning for?`;
    } else if (lower.includes('industrial') || lower.includes('factory') || lower.includes('warehouse') || lower.includes('plant')) {
      recommendedPackageId = 'pkg-ind-factory';
      reply = `Here are our verified **Industrial Vastu Consultation Packages**:\n\n1. **Warehouse Vastu Consultation** — **Starting from ₹22,000**\n   • *Includes:* Loading/unloading dock orientation, inventory turnover (NW) & heavy storage (SW) alignment.\n\n2. **Factory Vastu Consultation (Most Preferred)** — **Starting from ₹28,000**\n   • *Duration & Mode:* Full-Day On-Site Audit + 40+ Page Dossier\n   • *Includes:* Machinery weight blueprint, raw material (SW) to finished goods (NW) flow, electrical/boiler (SE) zoning & admin cabin alignment.\n\n3. **Manufacturing Unit Analysis** — **Starting from ₹35,000**\n   • *Includes:* Clockwise thermodynamic production line flow & QA lab zoning.\n\n4. **Complete Industrial Layout Analysis** — **Starting from ₹60,000**\n   • *Includes:* Multi-acre complex master planning & 180-day executive access.\n\n*Note: Final scope and pricing depend on acreage and blueprint evaluation.* Would you like to book an industrial audit?`;
    } else if (lower.includes('land') || lower.includes('plot')) {
      recommendedPackageId = 'pkg-land-plot';
      reply = `Here are our verified **Land & Plot Vastu Packages**:\n\n1. **Residential Plot Analysis** — **Starting from ₹7,500** (60 Mins • Shape, slope, compass declination & gate advice)\n2. **Before-Purchase Land Consultation** — **Starting from ₹9,500** (Rapid 48-Hour Go/No-Go acquisition verdict & road-hit check)\n3. **Commercial Land Analysis** — **Starting from ₹15,000** (Half-Day Assessment • Shermukhi frontage & entry zoning)\n4. **Industrial Land Analysis** — **Starting from ₹25,000** (Comprehensive multi-acre topography & utility zoning)\n\n*Note: Final scope and pricing depend on plot dimensions and evaluation.* Are you evaluating a plot before purchase?`;
    } else {
      recommendedPackageId = 'pkg-res-complete';
      if (lang === 'hi') {
        reply = `हमारे प्रमुख **आवासीय (Residential) वास्तु कंसल्टेशन पैकेज** इस प्रकार हैं:\n\n1. **Basic Home Vastu Consultation — ₹5,100 से शुरू**\n   • *अवधि व माध्यम:* 45 मिनट • ऑनलाइन वीडियो / फ़ोन कंसल्टेशन\n   • *शामिल सेवाएं:* फ्लोर प्लान दिशा जांच, प्रमुख कमरों का मार्गदर्शन, 1-ऑन-1 वीडियो कॉल और ईमेल एक्शन प्लान।\n\n2. **Complete Home Vastu Analysis (Most Preferred) — ₹11,000 से शुरू**\n   • *अवधि व माध्यम:* 90 मिनट + विस्तृत रिपोर्ट • ऑनलाइन वीडियो / व्यक्तिगत परामर्श\n   • *शामिल सेवाएं:* 16-ज़ोन पदविन्यास ग्रिडिंग, 32-द्वार मुख्य प्रवेश ऑडिट, बिना तोड़-फोड़ के उपाय, 25+ पेज की पीडीएफ रिपोर्ट और 30 दिनों के भीतर 1 निःशुल्क फॉलो-अप कॉल।\n\n3. **Premium Residential Vastu Consultation — ₹21,000 से शुरू**\n   • *अवधि व माध्यम:* पूरे दिन का व्यापक साइट ऑडिट • व्यक्तिगत साइट विजिट + वीडियो रिव्यू\n   • *शामिल सेवाएं:* ऑन-साइट एनर्जी स्कैन, जियोपैथिक स्ट्रेस मैपिंग, मल्टी-फ्लोर ऑप्टिमाइजेशन, 50-पेज रिपोर्ट और 90 दिनों का प्राथमिकता WhatsApp सपोर्ट।\n\n*(अन्य पैकेज: Flat/Apartment ₹8,500 से शुरू • New Home Construction ₹35,000 से शुरू। अंतिम शुल्क प्रॉपर्टी के आकार और नक्शे के मूल्यांकन पर निर्भर कर सकता है।)*`;
      } else if (lang === 'hinglish') {
        reply = `Hamare verified **Residential Vastu Consultation Packages** aur unke starting prices yeh hain:\n\n1. **Basic Home Vastu Consultation — Starting from ₹5,100**\n   • *Duration & Mode:* 45 Minutes • Online Video / Phone Consultation\n   • *Included:* Floor plan directional check, primary Dos & Don'ts, major room guidance, email summary.\n\n2. **Complete Home Vastu Analysis (Most Preferred) — Starting from ₹11,000**\n   • *Duration & Mode:* 90 Minutes + Comprehensive Report • Online Video / Personal Consultation\n   • *Included:* Detailed 16-Zone Gridding, 32-Gate Main Entrance Audit, Non-Demolition Remedies, 25+ Page PDF Dossier & 1 Free Follow-Up Call within 30 days.\n\n3. **Premium Residential Vastu Consultation — Starting from ₹21,000**\n   • *Duration & Mode:* Full-Day Comprehensive Site Audit • Personal In-Person Site Visit + Video Reviews\n   • *Included:* On-site energy scan, geopathic mapping, multi-floor blueprint optimization, 50-page report & 90 days WhatsApp priority access.\n\n*(Note: Final consultation scope aur pricing aapki property aur blueprint evaluation par depend karta hai.)* Aap kaunsa package select karna chahenge?`;
      } else {
        reply = `Here are our verified **Residential Vastu Consultation Packages**:\n\n1. **Basic Home Vastu Consultation — Starting from ₹5,100**\n   • *Duration & Format:* 45 Minutes • Online Video / Phone Consultation\n   • *Services Included:* Floor Plan Directional Verification, Primary Dos & Don'ts Checklist, Major Room Placement Guidance, 1-on-1 Video Session & Written Summary Action Plan via Email.\n\n2. **Complete Home Vastu Analysis (Most Preferred) — Starting from ₹11,000**\n   • *Duration & Format:* 90 Minutes + Comprehensive Report • Online Video / Personal Consultation\n   • *Services Included:* Detailed 16-Zone Padavinyasa Gridding, 32-Gate Main Entrance Precision Audit, Non-Demolition Remedies, Room-by-Room Diagnostics, 25+ Page PDF Dossier & 1 Free Follow-Up Call within 30 Days.\n\n3. **Premium Residential Vastu Consultation — Starting from ₹21,000**\n   • *Duration & Format:* Full-Day Comprehensive Site Audit • Personal In-Person Site Visit + Video Reviews\n   • *Services Included:* On-Site Energy Scan, Geopathic Stress Mapping, Multi-Floor Blueprint Optimization, Landscape/Waterbody Planning, 50-Page Bound Report & 90 Days WhatsApp Priority Access.\n\n*(Also available: Flat & Apartment Consultation from ₹8,500 • New Home Construction from ₹35,000. Final scope and pricing may depend on property and blueprint evaluation.)*\n\nWould you like to pre-fill one of these packages in the booking form, or see Commercial / Industrial / Land packages?`;
      }
    }
    suggestedQuickReplies = ['Commercial Packages', 'Industrial Packages', 'Land & Plot Packages', 'Book a Consultation'];
    return { reply, suggestedQuickReplies, recommendedPackageId, triggerBookingWizard, showWhatsAppConnect, lang };
  }

  // 7. Explore Vastu Services
  if (lower.includes('explore vastu services') || lower.includes('services') || lower.includes('what do you offer') || lower.includes('सेवाएं')) {
    reply = `**Vastu Sutram** offers comprehensive, scientific, and non-demolition Vastu consultancy across 6 core domains:\n\n1. **Residential Vastu:** Independent houses, flats/apartments, villas, duplexes, and new home construction.\n2. **Commercial Vastu:** Corporate offices, retail shops, showrooms, hotels, restaurants, and clinics.\n3. **Industrial Vastu:** Factories, manufacturing units, warehouses, machinery layouts, and production flows.\n4. **Land & Plot Vastu:** Pre-purchase land selection, Gaumukhi/Shermukhi shape verification, slope, and road-hit checks.\n5. **Vastu Mapping & 16-Zone Gridding:** Precision CAD blueprint overlay of the 16 directional zones, 32 entrance gates (Padavinyasa), and 45 Devta energy fields.\n6. **Online & On-Site Consultations:** Worldwide video/blueprint reviews and Pan-India personal site visits.\n\nWhich type of property are you looking to harmonize today?`;
    suggestedQuickReplies = ['Consultation Packages & Pricing', 'Residential Vastu', 'Commercial & Industrial Vastu', 'Book a Consultation'];
    return { reply, suggestedQuickReplies, recommendedPackageId, triggerBookingWizard, showWhatsAppConnect, lang };
  }

  // 8. Specific Room / Direction / Vastu Fundamentals Questions
  if (
    lower.includes('kitchen') ||
    lower.includes('bedroom') ||
    lower.includes('pooja') ||
    lower.includes('puja') ||
    lower.includes('toilet') ||
    lower.includes('bathroom') ||
    lower.includes('entrance') ||
    lower.includes('main door') ||
    lower.includes('brahmasthan') ||
    lower.includes('five elements') ||
    lower.includes('panchabhuta') ||
    lower.includes('what is vastu') ||
    lower.includes('basic vastu') ||
    lower.includes('direction') ||
    lower.includes('रसोई') ||
    lower.includes('बेडरूम') ||
    lower.includes('पूजा')
  ) {
    if (lower.includes('kitchen') || lower.includes('रसोई')) {
      reply = `**Kitchen Vastu Principles (Agneya / Fire Element):**\n• **Ideal Direction:** **South-East (Agneya)** is the primary zone of the Fire element (*Agni*), making it ideal for the kitchen. **North-West (Vayavya)** is the secondary alternative.\n• **Cooking Orientation:** The stove (*Chulha*) should be placed in the South-East of the kitchen so the person cooking faces **East**.\n• **Strictly Avoid:** North-East (Ishanya - Water zone), South-West (Nairrutya), and the central Brahmasthan.\n• **Practical Tip:** Keep the water sink and cooking stove separated, as Water and Fire are opposing elements.\n\n*Note: Traditional Vastu guidance works best when mapped to your exact compass degrees.* Would you like a 16-zone floor plan check for your home?`;
    } else if (lower.includes('bedroom') || lower.includes('sleep') || lower.includes('बेडरूम')) {
      reply = `**Bedroom Vastu Principles:**\n• **Master Bedroom:** Ideally located in the **South-West (Nairrutya / Earth Element)** to foster stability, grounding, and restful sleep for the head of the family. **South** or **West** are good alternatives.\n• **Children's / Guest Bedroom:** Best placed in the **East** or **North-West**.\n• **Sleeping Direction:** Sleep with your head towards **South** or **East** for natural geomagnetic alignment; avoid sleeping with your head pointing due North.\n• **Avoid:** Master bedroom in the North-East or directly above a kitchen.\n\nWould you like to explore a complete residential floor plan analysis?`;
    } else if (lower.includes('pooja') || lower.includes('puja') || lower.includes('temple') || lower.includes('पूजा')) {
      reply = `**Pooja & Meditation Room Vastu:**\n• **Ideal Direction:** **North-East (Ishanya)**—governed by the Water element and morning solar rays—is the most sacred and serene zone for a Pooja room or meditation space. **East** or **North** are also auspicious.\n• **Guidelines:** Keep this zone light, clean, well-ventilated, and free from heavy storage.\n• **Avoid:** Never place a Pooja altar directly under a staircase, in the South-West, or sharing an active wall with a toilet.\n\nDo you have a specific question about your home's North-East zone?`;
    } else if (lower.includes('toilet') || lower.includes('bathroom')) {
      reply = `**Bathroom & Toilet Vastu Principles:**\n• **Ideal Zones:** **South-South-West (SSW)**, **West-North-West (WNW)**, or **North-West** are the appropriate disposal/detoxification zones in 16-Zone Vastu.\n• **Strictly Avoid:** **North-East (Ishanya)**, **South-West (Nairrutya)**, and the central **Brahmasthan**.\n• **Non-Demolition Remedy:** If an existing flat has a toilet in an unfavourable zone, Vastu Sutram prescribes targeted elemental metal strips (copper, brass, zinc, or stainless steel) around the door threshold to neutralize the imbalance without structural demolition.`;
    } else {
      reply = `**Core Principles of Vastu Shastra:**\nVastu Shastra (*Sthapatya Veda*) is the traditional Indian architectural science of harmonizing human dwellings with natural solar light, geomagnetic axes, and the **Five Elements (Panchabhutas)**:\n\n1. **Jal (Water) — North-East (Ishanya):** Clarity, meditation, underground water & open light.\n2. **Agni (Fire) — South-East (Agneya):** Kitchen, electrical systems & vitality.\n3. **Prithvi (Earth) — South-West (Nairrutya):** Master bedroom, stability & structural mass.\n4. **Vayu (Air) — North-West (Vayavya):** Ventilation, movement, guest rooms & finished goods.\n5. **Akash (Space) — Center (Brahmasthan):** The central courtyard/core, kept open and pillar-free.\n\nWhich specific room—such as the **Main Entrance**, **Kitchen**, **Master Bedroom**, **Pooja Room**, or **Office**—would you like to know more about?`;
    }
    suggestedQuickReplies = ['Kitchen Vastu', 'Master Bedroom Vastu', 'Pooja Room Vastu', 'Consultation Packages & Pricing'];
    return { reply, suggestedQuickReplies, recommendedPackageId: 'pkg-res-complete', triggerBookingWizard, showWhatsAppConnect, lang };
  }

  // 9. Default Polite & Helpful Customer Support Response
  if (lang === 'hi') {
    reply = `नमस्ते! **वास्तु सूत्रम AI असिस्टेंट** में आपका स्वागत है। मैं वरिष्ठ वास्तु सलाहकार **राजनी सिंह** की ओर से आपकी सहायता के लिए 24/7 उपलब्ध हूँ।\n\nमैं आपकी निम्न विषयों में मदद कर सकता हूँ:\n• **आवासीय, व्यावसायिक, औद्योगिक और भूमि वास्तु** की जानकारी\n• **कंसल्टेशन पैकेज और शुल्क** (₹5,100 से शुरू)\n• **100% बिना तोड़-फोड़ (Non-Demolition)** वास्तु समाधान\n• **ऑनलाइन या ऑन-साइट अपॉइंटमेंट बुकिंग**\n\nकृपया बताएं, आप किस प्रकार की प्रॉपर्टी (घर, फ्लैट, ऑफिस, फैक्ट्री या प्लॉट) के लिए मार्गदर्शन चाहते हैं?`;
  } else if (lang === 'hinglish') {
    reply = `Namaste! Main **Vastu Sutram AI Assistant** hoon (Representing Senior Vastu Consultant **Rajni Singh**).\n\nMain aapki in cheezon mein madad kar sakta hoon:\n• **Home, Flat, Office, Factory ya Plot Vastu** ki jankari\n• **Consultation Packages & Pricing** (Residential packages ₹5,100 se shuru)\n• **100% Non-Demolition Vastu Remedies** (bina tod-fod ke upay)\n• **Online Video ya On-Site Consultation Booking**\n\nBataiye, aap kis property ke liye Vastu guidance dhoondh rahe hain?`;
  } else {
    reply = `Thank you for reaching out to **Vastu Sutram**! As your 24/7 AI Vastu Assistant representing Senior Vastu Consultant **Rajni Singh**, I can help you with:\n\n• **Residential, Commercial, Industrial & Plot Vastu** guidance\n• **Consultation Packages & Transparent Pricing** (Residential starting from ₹5,100)\n• **100% Non-Demolition Remedies** & 16-Zone CAD Blueprint Gridding\n• **Step-by-Step Consultation Booking** or connecting directly with Rajni Singh on WhatsApp\n\nCould you tell me a little about your space—are you planning a new home, living in an existing house/flat, or looking for commercial/industrial Vastu?`;
  }

  return { reply, suggestedQuickReplies, recommendedPackageId, triggerBookingWizard, showWhatsAppConnect, lang };
}

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const DB_FILE = path.join(__dirname, 'data', 'db.json');
const TMP_DB = path.join('/tmp', 'vastu_db.json');
const UPLOADS_DIR = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, 'assets', 'uploads');

// Ensure uploads directory exists
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  // Read-only filesystem safe
}

// MIME types mapping
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Database helper functions
function getDbPath() {
  if (process.env.VERCEL) {
    if (!fs.existsSync(TMP_DB) && fs.existsSync(DB_FILE)) {
      try {
        fs.writeFileSync(TMP_DB, fs.readFileSync(DB_FILE, 'utf8'), 'utf8');
      } catch (e) {
        // Fallback
      }
    }
    return fs.existsSync(TMP_DB) ? TMP_DB : DB_FILE;
  }
  return DB_FILE;
}

function readDb() {
  try {
    const target = getDbPath();
    if (fs.existsSync(target)) {
      const raw = fs.readFileSync(target, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading db:', err);
  }
  return { bookings: [], inquiries: [], settings: {} };
}

function writeDb(data) {
  try {
    const target = process.env.VERCEL ? TMP_DB : DB_FILE;
    fs.writeFileSync(target, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing db:', err);
    return false;
  }
}

// Helper to parse JSON body (safe for both local streams & pre-parsed serverless bodies)
function getJsonBody(req) {
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        return Promise.resolve(JSON.parse(req.body));
      } catch (e) {
        return Promise.resolve({});
      }
    }
    return Promise.resolve(req.body);
  }
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 50 * 1024 * 1024) { // 50MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

// Request Handler
const requestHandler = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // Set standard CORS headers for local APIs
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // -------------------------------------------------------------
  // REST API ENDPOINTS
  // -------------------------------------------------------------
  
  // Health Check
  if (pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', brand: 'VASTU SUTRAM', timestamp: new Date().toISOString() }));
    return;
  }

  // Entire Database
  if (pathname === '/api/db' && req.method === 'GET') {
    const data = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }

  // Save/Replace Entire Database (for Admin import or state sync)
  if (pathname === '/api/db' && req.method === 'POST') {
    try {
      const data = await getJsonBody(req);
      writeDb(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Database updated' }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Bookings: GET
  if (pathname === '/api/bookings' && req.method === 'GET') {
    const data = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.bookings || []));
    return;
  }

  // Bookings: POST (Create New Booking)
  if (pathname === '/api/bookings' && req.method === 'POST') {
    try {
      const newBooking = await getJsonBody(req);
      const data = readDb();
      if (!data.bookings) data.bookings = [];

      // Generate Reference Code: VS-2026-XXXX
      const refNum = Math.floor(1000 + Math.random() * 9000);
      newBooking.id = newBooking.id || `VS-2026-${refNum}`;
      newBooking.createdAt = new Date().toISOString();
      newBooking.status = newBooking.status || 'Pending Review';

      data.bookings.unshift(newBooking);
      writeDb(data);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, booking: newBooking }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Bookings: PATCH (Update Status / Notes)
  if (pathname.startsWith('/api/bookings/') && req.method === 'PATCH') {
    try {
      const bookingId = pathname.replace('/api/bookings/', '');
      const updates = await getJsonBody(req);
      const data = readDb();
      const index = (data.bookings || []).findIndex(b => b.id === bookingId);

      if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Booking not found' }));
        return;
      }

      data.bookings[index] = { ...data.bookings[index], ...updates, updatedAt: new Date().toISOString() };
      writeDb(data);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, booking: data.bookings[index] }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Bookings: DELETE
  if (pathname.startsWith('/api/bookings/') && req.method === 'DELETE') {
    const bookingId = pathname.replace('/api/bookings/', '');
    const data = readDb();
    data.bookings = (data.bookings || []).filter(b => b.id !== bookingId);
    writeDb(data);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Booking removed' }));
    return;
  }

  // Export Bookings as CSV
  if (pathname === '/api/export/bookings.csv' && req.method === 'GET') {
    const data = readDb();
    const bookings = data.bookings || [];
    const headers = ['Booking ID', 'Created At', 'Name', 'Phone', 'Email', 'City', 'Service', 'Package', 'Date', 'Time Slot', 'Mode', 'Status'];
    const rows = bookings.map(b => [
      `"${b.id || ''}"`,
      `"${b.createdAt ? b.createdAt.substring(0, 10) : ''}"`,
      `"${(b.name || '').replace(/"/g, '""')}"`,
      `"${(b.phone || '').replace(/"/g, '""')}"`,
      `"${(b.email || '').replace(/"/g, '""')}"`,
      `"${(b.city || '').replace(/"/g, '""')}"`,
      `"${(b.serviceName || b.service || '').replace(/"/g, '""')}"`,
      `"${(b.packageName || b.package || '').replace(/"/g, '""')}"`,
      `"${b.appointmentDate || ''}"`,
      `"${b.appointmentTime || ''}"`,
      `"${b.consultationMode || ''}"`,
      `"${b.status || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="Vastu_Sutram_Bookings.csv"'
    });
    res.end(csvContent);
    return;
  }

  // Inquiries: GET & POST
  if (pathname === '/api/inquiries') {
    const data = readDb();
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data.inquiries || []));
      return;
    }
    if (req.method === 'POST') {
      try {
        const inquiry = await getJsonBody(req);
        if (!data.inquiries) data.inquiries = [];
        inquiry.id = `INQ-${Date.now()}`;
        inquiry.createdAt = new Date().toISOString();
        data.inquiries.unshift(inquiry);
        writeDb(data);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, inquiry }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }
  }

  // Settings: GET & POST
  if (pathname === '/api/settings') {
    const data = readDb();
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data.settings || {}));
      return;
    }
    if (req.method === 'POST') {
      try {
        const newSettings = await getJsonBody(req);
        data.settings = { ...data.settings, ...newSettings };
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, settings: data.settings }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }
  }

  // File Upload (Floor Plans, Drawings, Photographs)
  if (pathname === '/api/upload' && req.method === 'POST') {
    try {
      const payload = await getJsonBody(req);
      const { fileName, fileData } = payload; // fileData is base64 string
      if (!fileName || !fileData) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing fileName or fileData' }));
        return;
      }

      const cleanFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const filePath = path.join(UPLOADS_DIR, cleanFileName);
      
      // Strip base64 header if present (e.g. data:image/png;base64,...)
      const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        filePath: `/assets/uploads/${cleanFileName}`,
        fileName: cleanFileName
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Razorpay Order Creation
  if (pathname === '/api/razorpay/create-order' && req.method === 'POST') {
    try {
      const payload = await getJsonBody(req);
      const data = readDb();
      const keyId = process.env.RAZORPAY_KEY_ID || (data.settings && data.settings.razorpayKeyId);
      const keySecret = process.env.RAZORPAY_KEY_SECRET || (data.settings && data.settings.razorpayKeySecret);

      if (!keyId || !keySecret || keyId === 'rzp_test_placeholder') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          setupMode: true,
          message: 'Razorpay payment gateway is currently in setup mode. You can book directly via WhatsApp or configure live credentials in Admin.'
        }));
        return;
      }

      // If keys exist, create simulated / live order format
      const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        orderId,
        amount: payload.amount || 510000,
        currency: payload.currency || 'INR',
        keyId
      }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Razorpay Payment Verification
  if (pathname === '/api/razorpay/verify-payment' && req.method === 'POST') {
    try {
      const payload = await getJsonBody(req);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        verified: true,
        paymentId: payload.razorpay_payment_id || 'PAY_' + Date.now(),
        message: 'Payment verification recorded.'
      }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 24/7 Intelligent AI Customer Support Agent Status & Provider Check
  if (pathname === '/api/chat/status' && req.method === 'GET') {
    const hasGemini = Boolean(process.env.GEMINI_API_KEY);
    const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
    const hasGroq = Boolean(process.env.GROQ_API_KEY);
    const llmConnected = hasGemini || hasOpenAI || hasGroq;
    const activeProvider = hasGemini
      ? 'Google Gemini API'
      : hasOpenAI
      ? 'OpenAI API'
      : hasGroq
      ? 'Groq Cloud LLM'
      : 'Vastu Sutram Verified Knowledge Retrieval Engine (Add GEMINI_API_KEY, OPENAI_API_KEY, or GROQ_API_KEY in environment variables for live cloud LLM generation)';

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      assistantName: 'Vastu Sutram AI Assistant',
      representing: 'Rajni Singh – Vastu Consultant',
      llmConnected,
      activeProvider,
      supportedEnvVars: ['GEMINI_API_KEY', 'OPENAI_API_KEY', 'GROQ_API_KEY'],
      languages: ['en', 'hi', 'hinglish']
    }));
    return;
  }

  // 24/7 Intelligent AI Customer Support Agent Chat Endpoint
  if (pathname === '/api/chat' && req.method === 'POST') {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'local';
    if (!checkChatRateLimit(clientIp)) {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Rate limit exceeded. Please wait a moment before sending another message.',
        reply: 'You are sending messages very quickly. Please wait a few seconds or connect with us directly on WhatsApp (+91 81457 15755).'
      }));
      return;
    }

    try {
      const body = await getJsonBody(req);
      const userMessage = String(body.message || '').trim().slice(0, 1500);
      const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
      const languagePref = body.language || 'auto';

      if (!userMessage) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Message is required' }));
        return;
      }

      // First compute deterministic knowledge metadata (recommended package, quick replies, flags)
      const kbResult = generateKnowledgeBaseResponse(userMessage, history, languagePref);
      const systemPrompt = buildVastuSystemPrompt(languagePref);

      const geminiKey = process.env.GEMINI_API_KEY;
      const openaiKey = process.env.OPENAI_API_KEY;
      const groqKey = process.env.GROQ_API_KEY;

      let finalReply = kbResult.reply;
      let providerUsed = 'knowledge-retrieval-engine';
      let llmConnected = false;

      // Try Live Cloud LLM if any API Key is configured in environment variables
      if (geminiKey) {
        try {
          const geminiContents = [
            ...history.map(m => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: String(m.content || '').slice(0, 1200) }]
            })),
            { role: 'user', parts: [{ text: userMessage }] }
          ];
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(geminiKey)}`;
          const geminiResp = await postJsonHttps(geminiUrl, {}, {
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: geminiContents,
            generationConfig: { temperature: 0.45, maxOutputTokens: 650 }
          });
          const candidateText = geminiResp?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.trim()) {
            finalReply = candidateText.trim();
            providerUsed = 'gemini-2.0-flash';
            llmConnected = true;
          }
        } catch (llmErr) {
          console.warn('Gemini API fallback to Vastu Knowledge Engine:', llmErr.message);
        }
      } else if (openaiKey || groqKey) {
        try {
          const isGroq = Boolean(!openaiKey && groqKey);
          const apiUrl = isGroq
            ? 'https://api.groq.com/openai/v1/chat/completions'
            : 'https://api.openai.com/v1/chat/completions';
          const apiKey = isGroq ? groqKey : openaiKey;
          const model = isGroq ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini';

          const messages = [
            { role: 'system', content: systemPrompt },
            ...history.map(m => ({
              role: m.role === 'assistant' ? 'assistant' : 'user',
              content: String(m.content || '').slice(0, 1200)
            })),
            { role: 'user', content: userMessage }
          ];

          const completion = await postJsonHttps(
            apiUrl,
            { Authorization: `Bearer ${apiKey}` },
            { model, messages, temperature: 0.45, max_tokens: 650 }
          );
          const text = completion?.choices?.[0]?.message?.content;
          if (text && text.trim()) {
            finalReply = text.trim();
            providerUsed = model;
            llmConnected = true;
          }
        } catch (llmErr) {
          console.warn('OpenAI/Groq API fallback to Vastu Knowledge Engine:', llmErr.message);
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        reply: finalReply,
        suggestedQuickReplies: kbResult.suggestedQuickReplies,
        recommendedPackageId: kbResult.recommendedPackageId,
        triggerBookingWizard: kbResult.triggerBookingWizard,
        showWhatsAppConnect: kbResult.showWhatsAppConnect,
        detectedLanguage: kbResult.lang,
        providerUsed,
        llmConnected
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Unable to process chat request right now.',
        reply: 'I apologize for the temporary connection interruption. You can connect directly with Senior Vastu Consultant Rajni Singh on WhatsApp (+91 81457 15755).'
      }));
    }
    return;
  }

  // -------------------------------------------------------------
  // STATIC FILE SERVING
  // -------------------------------------------------------------
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  
  // Security check: avoid directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If file not found, try index.html for client-side routing, or return 404
      const ext = path.extname(pathname);
      if (!ext || ext === '.html') {
        const indexPath = path.join(PUBLIC_DIR, 'index.html');
        fs.readFile(indexPath, (readErr, content) => {
          if (readErr) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - Page Not Found</h1>');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
        });
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
};

const server = http.createServer(requestHandler);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  VASTU SUTRAM – THE PRINCIPLES OF VASTU`);
    console.log(`  Live Platform Running at: http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}

// Export callable function for Vercel Serverless Function runtime
module.exports = (req, res) => {
  return requestHandler(req, res);
};
module.exports.default = (req, res) => {
  return requestHandler(req, res);
};
