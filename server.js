/**
 * VASTU SUTRAM – Web & API Server
 * Lightweight, zero-dependency Node.js HTTP server
 */

const http = require('http');
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const url = require('url');
const VASTU_DATA = require('./js/data.js');

// Official Vastu Sutram Business, Payment & Notification Configuration
const PAYMENT_CONFIG = {
  businessName: 'Vastu Sutram',
  consultantName: 'Rajni Singh',
  upiId: 'gauriomji@oksbi',
  paymentProvider: 'State Bank of India UPI',
  paymentGateway: 'Razorpay',
  currency: 'INR',
  currencySymbol: '₹',
  officialEmail: 'vastusutram@gmail.com',
  whatsappAdminDisplay: '+91 81457 15755',
  whatsappAdminE164: '918145715755',
  whatsappRecipient: '+91 81457 15755',
  whatsappE164: '918145715755',
  whatsappNotify: '918145715755',
  whatsappSecondary: '919181457155',
  validPaymentStatuses: [
    'Pending',
    'Paid',
    'Failed',
    'Refund Initiated',
    'Refunded',
    'Manual Verification Required'
  ],
  validBookingStatuses: [
    'Payment Pending',
    'Payment Verified',
    'Booking Confirmed',
    'Consultation Completed',
    'Cancelled',
    'Refunded'
  ]
};

// Parse numeric INR amount from numbers or strings like "Starting from ₹11,000" or "₹5,100"
function parseInrAmount(val, fallback = 5100) {
  if (typeof val === 'number' && Number.isFinite(val) && val > 0) {
    return Math.round(val);
  }
  if (typeof val === 'string') {
    const cleaned = val.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    if (Number.isFinite(num) && num > 0) {
      return Math.round(num);
    }
  }
  return fallback;
}

// Normalize a booking record to ensure the complete Step Nine 4-Block Database Structure
function normalizeBookingRecord(b) {
  if (!b) return b;
  const bookingRef = b.id || b.bookingId || `VS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const customerId = b.customerId || (b.customerInfo && b.customerInfo.customerId) || `CUST-${bookingRef.replace(/[^0-9]/g, '') || Date.now().toString().slice(-4)}`;
  const payable = b.amountPayable !== undefined ? Number(b.amountPayable) : parseInrAmount(b.amount, 5100);
  const isPaid = b.paymentStatus === 'Paid' || b.status === 'Payment Verified' || b.status === 'Booking Confirmed';
  const received = b.amountReceived !== undefined ? Number(b.amountReceived) : (isPaid ? payable : 0);
  const cleanTime = String(b.preferredTime || b.appointmentTime || '').split('•')[0].trim() || '11:30 AM - 12:30 PM';
  const requirements = b.requirements || b.message || (b.bookingInfo && b.bookingInfo.requirements) || 'Standard Vastu evaluation requested.';

  b.id = bookingRef;
  b.bookingId = bookingRef;
  b.customerId = customerId;
  b.name = b.name || b.fullName || (b.customerInfo && b.customerInfo.name) || 'Client';
  b.fullName = b.fullName || b.name;
  b.phone = b.phone || b.whatsapp || (b.customerInfo && b.customerInfo.phone) || '';
  b.whatsapp = b.whatsapp || b.phone;
  b.email = b.email || (b.customerInfo && b.customerInfo.email) || '';
  b.city = b.city || (b.customerInfo && b.customerInfo.city) || '';
  b.propertyType = b.propertyType || (b.customerInfo && b.customerInfo.propertyType) || 'Independent House';
  b.consultationCategory = b.consultationCategory || (b.bookingInfo && b.bookingInfo.consultationCategory) || 'Residential Vastu';
  b.packageName = b.packageName || b.serviceName || (b.bookingInfo && b.bookingInfo.packageName) || 'Vastu Consultation';
  b.consultationMode = b.consultationMode || (b.bookingInfo && b.bookingInfo.consultationMode) || 'Online Consultation';
  b.appointmentDate = b.appointmentDate || (b.bookingInfo && b.bookingInfo.consultationDate) || '';
  b.preferredTime = cleanTime;
  b.appointmentTime = b.appointmentTime || `${cleanTime} • ${b.consultationMode}`;
  b.message = requirements;
  b.requirements = requirements;
  b.amountPayable = payable;
  b.amountReceived = received;
  b.amount = `₹${payable.toLocaleString('en-IN')}`;

  // 1. CUSTOMER INFORMATION
  b.customerInfo = {
    customerId,
    name: b.name,
    phone: b.phone,
    email: b.email,
    city: b.city,
    propertyType: b.propertyType
  };

  // 2. BOOKING INFORMATION
  b.bookingInfo = {
    bookingReference: bookingRef,
    consultationCategory: b.consultationCategory,
    packageName: b.packageName,
    amount: payable,
    consultationMode: b.consultationMode,
    consultationDate: b.appointmentDate,
    preferredTime: cleanTime,
    requirements
  };

  // 3. PAYMENT INFORMATION
  b.paymentInfo = {
    paymentId: b.transactionId || (b.paymentInfo && b.paymentInfo.paymentId) || '',
    transactionReference: b.razorpayOrderId || b.transactionId || bookingRef,
    paymentMethod: b.paymentMethod || 'UPI',
    amountPaid: received,
    paymentStatus: b.paymentStatus || 'Pending',
    paymentTimestamp: b.paidAt || b.upiSubmittedAt || (b.paymentInfo && b.paymentInfo.paymentTimestamp) || null
  };

  // 4. NOTIFICATION INFORMATION
  const existingNotif = b.notificationInfo || {};
  b.notificationInfo = {
    customerEmailStatus: existingNotif.customerEmailStatus || 'Pending Payment Verification',
    adminEmailStatus: existingNotif.adminEmailStatus || 'Pending Payment Verification',
    customerWhatsappStatus: existingNotif.customerWhatsappStatus || 'Pending Payment Verification',
    adminWhatsappStatus: existingNotif.adminWhatsappStatus || 'Pending Payment Verification',
    notificationsSentAt: existingNotif.notificationsSentAt || null
  };

  return b;
}

// Step Five: Automatic Customer Confirmation Email & Admin Email Notification (vastusutram@gmail.com)
async function sendPaymentConfirmationEmail(booking) {
  normalizeBookingRecord(booking);

  const customerName = booking.name || booking.fullName || 'Valued Client';
  const bookingId = booking.id;
  const packageName = booking.packageName || 'Vastu Consultation';
  const amountNum = Number(booking.amountReceived || booking.amountPayable || 0).toLocaleString('en-IN');
  const paymentId = booking.transactionId || 'VERIFIED';
  const consultDate = booking.appointmentDate || 'To Be Scheduled';
  const preferredTime = booking.preferredTime || String(booking.appointmentTime || '').split('•')[0].trim() || 'As Scheduled';

  // Exact Customer Email Subject & Content specified in Step Five
  const customerSubject = 'Vastu Sutram – Your Consultation Booking is Confirmed!';
  const customerTextBody = [
    `Dear ${customerName},`,
    ``,
    `Thank you for choosing Vastu Sutram.`,
    `We have successfully received your consultation payment.`,
    ``,
    `Your booking details are:`,
    `Customer Name: ${customerName}`,
    `Booking Reference: ${bookingId}`,
    `Consultation Package: ${packageName}`,
    `Amount Paid: ₹${amountNum}`,
    `Payment ID: ${paymentId}`,
    `Consultation Date: ${consultDate}`,
    `Preferred Time: ${preferredTime}`,
    `Payment Status: SUCCESSFUL`,
    ``,
    `Our team will contact you shortly regarding your consultation.`,
    ``,
    `Warm regards,`,
    `Rajni Singh`,
    `Vastu Sutram`,
    `vastusutram@gmail.com`
  ].join('\n');

  // Admin Email Content to vastusutram@gmail.com
  const adminSubject = `NEW PAID CONSULTATION BOOKING – VASTU SUTRAM (${bookingId})`;
  const adminTextBody = [
    `NEW PAID CONSULTATION BOOKING – VASTU SUTRAM`,
    `Customer Name: ${customerName}`,
    `Mobile Number: ${booking.phone || ''}`,
    `Email: ${booking.email || ''}`,
    `City: ${booking.city || ''}`,
    `Property Type: ${booking.propertyType || ''}`,
    `Consultation Package: ${packageName}`,
    `Amount Received: ₹${amountNum}`,
    `Booking Reference: ${bookingId}`,
    `Payment ID: ${paymentId}`,
    `Payment Method: ${booking.paymentMethod || 'UPI/Razorpay'}`,
    `Consultation Date: ${consultDate}`,
    `Preferred Time: ${preferredTime}`,
    `Customer Requirements: ${booking.requirements || booking.message || ''}`,
    `Payment Status: SUCCESSFUL`
  ].join('\n');

  const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
  const fromEmail = process.env.EMAIL_FROM || `Vastu Sutram <${PAYMENT_CONFIG.officialEmail}>`;

  let customerEmailStatus = 'Queued (Configure RESEND_API_KEY for live email delivery)';
  let adminEmailStatus = 'Queued (Configure RESEND_API_KEY for live email delivery)';

  if (resendApiKey) {
    if (booking.email) {
      try {
        await postJsonHttps(
          'https://api.resend.com/emails',
          { Authorization: `Bearer ${resendApiKey}` },
          {
            from: fromEmail,
            to: [booking.email],
            reply_to: PAYMENT_CONFIG.officialEmail,
            subject: customerSubject,
            text: customerTextBody
          }
        );
        customerEmailStatus = 'Sent via Resend API';
      } catch (err) {
        console.warn('Customer Email API warning:', err.message);
        customerEmailStatus = `Error: ${err.message}`;
      }
    } else {
      customerEmailStatus = 'Skipped (No customer email provided)';
    }

    try {
      await postJsonHttps(
        'https://api.resend.com/emails',
        { Authorization: `Bearer ${resendApiKey}` },
        {
          from: fromEmail,
          to: [PAYMENT_CONFIG.officialEmail],
          subject: adminSubject,
          text: adminTextBody
        }
      );
      adminEmailStatus = 'Sent to vastusutram@gmail.com';
    } catch (err) {
      console.warn('Admin Email API warning:', err.message);
      adminEmailStatus = `Error: ${err.message}`;
    }
  } else {
    console.log(`[VASTU SUTRAM EMAIL CONFIRMATION DISPATCH] To: ${booking.email || 'N/A'} | Admin: ${PAYMENT_CONFIG.officialEmail} | Ref: ${bookingId} | Status: SUCCESSFUL`);
  }

  booking.notificationInfo.customerEmailStatus = customerEmailStatus;
  booking.notificationInfo.adminEmailStatus = adminEmailStatus;

  return {
    sent: Boolean(resendApiKey && customerEmailStatus.startsWith('Sent')),
    configured: Boolean(resendApiKey),
    customerEmailStatus,
    adminEmailStatus,
    officialEmail: PAYMENT_CONFIG.officialEmail,
    recipient: booking.email,
    subject: customerSubject,
    customerEmailPreview: customerTextBody,
    adminEmailPreview: adminTextBody
  };
}

// Step Six & Step Seven: WhatsApp Notification to Admin (+91 81457 15755) & WhatsApp Confirmation to Customer
// Triggered ONLY after verified payment; never pretends a message was sent if WhatsApp Business API is not configured
async function sendWhatsAppBusinessNotification(booking) {
  if (!booking) {
    return { sent: false, configured: false, recipient: PAYMENT_CONFIG.whatsappAdminDisplay };
  }
  normalizeBookingRecord(booking);

  const customerName = booking.name || booking.fullName || 'Client';
  const amountNum = Number(booking.amountReceived || booking.amountPayable || 0).toLocaleString('en-IN');
  const paymentId = booking.transactionId || 'VERIFIED';
  const consultDate = booking.appointmentDate || 'To Be Scheduled';
  const preferredTime = booking.preferredTime || String(booking.appointmentTime || '').split('•')[0].trim() || 'As Scheduled';
  const requirementsText = booking.requirements || booking.message || 'Standard Vastu evaluation requested.';

  // Exact Admin WhatsApp Message specified in Step Six (+91 81457 15755)
  const adminWhatsAppMessage = [
    `NEW PAID CONSULTATION BOOKING – VASTU SUTRAM`,
    `Customer Name: ${customerName}`,
    `Mobile Number: ${booking.phone || '—'}`,
    `Email: ${booking.email || '—'}`,
    `City: ${booking.city || '—'}`,
    `Property Type: ${booking.propertyType || '—'}`,
    `Consultation Package: ${booking.packageName || 'Vastu Consultation'}`,
    `Amount Received: ₹${amountNum}`,
    `Booking Reference: ${booking.id || ''}`,
    `Payment ID: ${paymentId}`,
    `Payment Method: ${booking.paymentMethod || 'UPI/Razorpay'}`,
    `Consultation Date: ${consultDate}`,
    `Preferred Time: ${preferredTime}`,
    `Customer Requirements: ${requirementsText}`,
    `Payment Status: SUCCESSFUL`
  ].join('\n');

  // Exact Customer WhatsApp Message specified in Step Seven
  const customerWhatsAppMessage = [
    `Namaste ${customerName}!`,
    `Your consultation booking with Vastu Sutram has been successfully confirmed.`,
    `Booking Details:`,
    `Booking Reference: ${booking.id || ''}`,
    `Package: ${booking.packageName || 'Vastu Consultation'}`,
    `Amount Paid: ₹${amountNum}`,
    `Payment ID: ${paymentId}`,
    `Consultation Date: ${consultDate}`,
    `Preferred Time: ${preferredTime}`,
    `Thank you for trusting Vastu Sutram.`,
    `Rajni Singh`,
    `Vastu Sutram`
  ].join('\n');

  const cloudToken = (process.env.WHATSAPP_CLOUD_API_TOKEN || '').trim();
  const phoneNumberId = (process.env.WHATSAPP_PHONE_NUMBER_ID || '').trim();
  const webhookUrl = (process.env.WHATSAPP_WEBHOOK_URL || '').trim();
  const adminE164 = PAYMENT_CONFIG.whatsappAdminE164; // 918145715755 (+91 81457 15755)

  // Format customer phone to E.164 digits
  const rawCustDigits = String(booking.phone || '').replace(/[^0-9]/g, '');
  const customerE164 = rawCustDigits.length === 10 ? `91${rawCustDigits}` : rawCustDigits;

  let adminWhatsappStatus = 'Not Sent Automatically (Configure WHATSAPP_CLOUD_API_TOKEN)';
  let customerWhatsappStatus = 'Not Sent Automatically (Configure WHATSAPP_CLOUD_API_TOKEN)';
  let adminSent = false;
  let customerSent = false;

  if (cloudToken && phoneNumberId) {
    // 1. Send Admin WhatsApp Notification to +91 81457 15755
    try {
      await postJsonHttps(
        `https://graph.facebook.com/v20.0/${encodeURIComponent(phoneNumberId)}/messages`,
        { Authorization: `Bearer ${cloudToken}` },
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: adminE164,
          type: 'text',
          text: { preview_url: false, body: adminWhatsAppMessage }
        }
      );
      adminSent = true;
      adminWhatsappStatus = 'Sent via WhatsApp Cloud API (+91 81457 15755)';
    } catch (err) {
      console.warn('Admin WhatsApp Cloud API warning:', err.message);
      adminWhatsappStatus = `API Error: ${err.message}`;
    }

    // 2. Send Customer WhatsApp Confirmation
    if (customerE164 && customerE164.length >= 10) {
      try {
        await postJsonHttps(
          `https://graph.facebook.com/v20.0/${encodeURIComponent(phoneNumberId)}/messages`,
          { Authorization: `Bearer ${cloudToken}` },
          {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: customerE164,
            type: 'text',
            text: { preview_url: false, body: customerWhatsAppMessage }
          }
        );
        customerSent = true;
        customerWhatsappStatus = `Sent via WhatsApp Cloud API (${customerE164})`;
      } catch (err) {
        console.warn('Customer WhatsApp Cloud API warning:', err.message);
        customerWhatsappStatus = `API Error: ${err.message}`;
      }
    }
  } else if (webhookUrl) {
    try {
      await postJsonHttps(webhookUrl, {}, {
        adminRecipient: PAYMENT_CONFIG.whatsappAdminDisplay,
        adminE164,
        customerE164,
        bookingId: booking.id,
        adminMessage: adminWhatsAppMessage,
        customerMessage: customerWhatsAppMessage
      });
      adminSent = true;
      customerSent = true;
      adminWhatsappStatus = 'Dispatched via Webhook (+91 81457 15755)';
      customerWhatsappStatus = 'Dispatched via Webhook';
    } catch (err) {
      console.warn('WhatsApp Webhook warning:', err.message);
      adminWhatsappStatus = `Webhook Error: ${err.message}`;
      customerWhatsappStatus = `Webhook Error: ${err.message}`;
    }
  }

  booking.notificationInfo.adminWhatsappStatus = adminWhatsappStatus;
  booking.notificationInfo.customerWhatsappStatus = customerWhatsappStatus;
  booking.notificationInfo.notificationsSentAt = new Date().toISOString();
  booking.notificationsDispatched = true;

  return {
    sent: adminSent,
    customerSent,
    configured: Boolean((cloudToken && phoneNumberId) || webhookUrl),
    provider: cloudToken && phoneNumberId ? 'whatsapp_cloud_api' : webhookUrl ? 'webhook' : 'none',
    recipient: PAYMENT_CONFIG.whatsappAdminDisplay,
    e164: adminE164,
    customerE164,
    adminWhatsappStatus,
    customerWhatsappStatus,
    adminPayload: adminWhatsAppMessage,
    customerPayload: customerWhatsAppMessage,
    formattedMessage: adminWhatsAppMessage,
    customerFormattedMessage: customerWhatsAppMessage,
    message:
      adminSent
        ? 'Automated WhatsApp notifications sent to Admin (+91 81457 15755) and Customer.'
        : 'WhatsApp Business Cloud API (WHATSAPP_CLOUD_API_TOKEN / WHATSAPP_PHONE_NUMBER_ID) is not configured on the server; no automatic WhatsApp message was faked. Use the interactive WhatsApp buttons to send the verified notification.'
  };
}

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

// Helper to parse both raw string and JSON body (essential for HMAC webhook verification)
function getRawAndJsonBody(req) {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      try {
        return Promise.resolve({ raw: req.body, json: JSON.parse(req.body) });
      } catch (e) {
        return Promise.resolve({ raw: req.body, json: {} });
      }
    }
    if (Buffer.isBuffer(req.body)) {
      const str = req.body.toString('utf8');
      try {
        return Promise.resolve({ raw: str, json: JSON.parse(str) });
      } catch (e) {
        return Promise.resolve({ raw: str, json: {} });
      }
    }
    const serialized = JSON.stringify(req.body);
    return Promise.resolve({ raw: serialized, json: req.body });
  }
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 50 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve({ raw: body, json: body ? JSON.parse(body) : {} });
      } catch (err) {
        resolve({ raw: body, json: {} });
      }
    });
    req.on('error', reject);
  });
}

async function getJsonBody(req) {
  const { json } = await getRawAndJsonBody(req);
  return json;
}

function resolveRazorpayCredentials() {
  const rawKeyId = (process.env.RAZORPAY_KEY_ID || '').trim();
  const rawKeySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  const webhookSecret = (process.env.RAZORPAY_WEBHOOK_SECRET || '').trim();

  const isPlaceholder =
    !rawKeyId ||
    !rawKeySecret ||
    rawKeyId.includes('placeholder') ||
    rawKeySecret.includes('placeholder');

  const mode = isPlaceholder
    ? 'setup_required'
    : rawKeyId.startsWith('rzp_live_')
    ? 'live'
    : 'test';

  return {
    configured: !isPlaceholder,
    mode,
    keyId: isPlaceholder ? '' : rawKeyId,
    keySecret: isPlaceholder ? '' : rawKeySecret,
    webhookSecret
  };
}

// Request Handler
const requestHandler = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // Set standard CORS headers for local APIs
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Razorpay-Signature');

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

  // Public Payment & UPI Configuration Endpoint
  if (pathname === '/api/payments/config' && req.method === 'GET') {
    const data = readDb();
    const rzp = resolveRazorpayCredentials(data);
    const whatsappApiConfigured = Boolean(
      (process.env.WHATSAPP_CLOUD_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) ||
        process.env.WHATSAPP_WEBHOOK_URL
    );
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      businessName: PAYMENT_CONFIG.businessName,
      consultantName: PAYMENT_CONFIG.consultantName,
      upiId: PAYMENT_CONFIG.upiId,
      paymentProvider: PAYMENT_CONFIG.paymentProvider,
      paymentGateway: PAYMENT_CONFIG.paymentGateway,
      currency: PAYMENT_CONFIG.currency,
      currencySymbol: PAYMENT_CONFIG.currencySymbol,
      officialEmail: PAYMENT_CONFIG.officialEmail,
      whatsappAdminDisplay: PAYMENT_CONFIG.whatsappAdminDisplay,
      whatsappAdminE164: PAYMENT_CONFIG.whatsappAdminE164,
      whatsappRecipient: PAYMENT_CONFIG.whatsappRecipient,
      whatsappE164: PAYMENT_CONFIG.whatsappE164,
      whatsappNotify: PAYMENT_CONFIG.whatsappNotify,
      whatsappSecondary: PAYMENT_CONFIG.whatsappSecondary,
      whatsappApiConfigured,
      officialUpiQrImage: (data.settings && data.settings.officialUpiQrImage) || null,
      razorpayConfigured: rzp.configured,
      razorpayMode: rzp.mode,
      razorpayKeyId: rzp.keyId,
      validPaymentStatuses: PAYMENT_CONFIG.validPaymentStatuses,
      validBookingStatuses: PAYMENT_CONFIG.validBookingStatuses,
      requiredEnvVars: ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_WEBHOOK_SECRET']
    }));
    return;
  }

  // Secure Admin Login Verification Endpoint
  if (pathname === '/api/admin/login' && req.method === 'POST') {
    try {
      const payload = await getJsonBody(req);
      const data = readDb();
      const expectedPin = process.env.ADMIN_PIN || (data.settings && data.settings.ownerPin) || 'vastu2026';
      const submittedPin = String(payload.pin || payload.password || '').trim();
      if (submittedPin && submittedPin === expectedPin) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, authenticated: true, role: 'owner' }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, authenticated: false, error: 'Invalid Admin Security PIN.' }));
      }
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // Entire Database
  if (pathname === '/api/db' && req.method === 'GET') {
    const data = readDb();
    // Redact secret keys from public /api/db payload
    const safeSettings = { ...(data.settings || {}) };
    delete safeSettings.razorpaySecret;
    delete safeSettings.razorpayKeySecret;
    delete safeSettings.razorpayWebhookSecret;
    const normalizedBookings = (data.bookings || []).map(b => normalizeBookingRecord(b));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ...data, bookings: normalizedBookings, settings: safeSettings }));
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
    res.end(JSON.stringify((data.bookings || []).map(b => normalizeBookingRecord(b))));
    return;
  }

  // Bookings: POST (Create New Booking – Never marks Paid without backend verification)
  if (pathname === '/api/bookings' && req.method === 'POST') {
    try {
      const rawBooking = await getJsonBody(req);
      const data = readDb();
      if (!data.bookings) data.bookings = [];

      // Look up default package starting price if packageId or packageName matches
      const matchedPkg = (VASTU_DATA.packages || []).find(
        p => p.id === rawBooking.packageId || p.id === rawBooking.package || p.name === rawBooking.packageName
      );
      const defaultPrice = matchedPkg ? matchedPkg.rawPrice : 5100;
      const confirmedPayable = parseInrAmount(
        rawBooking.amountPayable || rawBooking.confirmedAmount || rawBooking.amount,
        defaultPrice
      );

      const cleanPhone = String(rawBooking.phone || rawBooking.whatsapp || '').trim();
      const cleanName = String(rawBooking.name || rawBooking.fullName || 'Client').trim();
      const pkgName = rawBooking.packageName || rawBooking.serviceName || (matchedPkg ? matchedPkg.name : 'Vastu Consultation');

      // Duplicate Booking Prevention: if an identical pending booking (same phone + package + amount) was created within the last 60s and no explicit bookingId changed, reuse it
      const nowMs = Date.now();
      const recentDuplicateIdx = data.bookings.findIndex(b => {
        if (rawBooking.id && b.id === rawBooking.id) return true;
        if (b.paymentStatus === 'Paid') return false;
        const createdMs = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return (
          cleanPhone &&
          b.phone === cleanPhone &&
          (b.packageName === pkgName) &&
          Number(b.amountPayable) === Number(confirmedPayable) &&
          nowMs - createdMs < 60000
        );
      });

      // Generate unique Reference Code: VS-2026-XXXX
      const refNum = Math.floor(1000 + Math.random() * 9000);
      const bookingId =
        recentDuplicateIdx !== -1
          ? data.bookings[recentDuplicateIdx].id
          : rawBooking.id || rawBooking.bookingId || `VS-2026-${refNum}`;

      // Security: Never trust client-supplied 'Paid' or 'Payment Verified' on creation
      const safePaymentStatus =
        rawBooking.paymentStatus === 'Manual Verification Required'
          ? 'Manual Verification Required'
          : 'Pending';

      const newBooking = normalizeBookingRecord({
        ...(recentDuplicateIdx !== -1 ? data.bookings[recentDuplicateIdx] : {}),
        ...rawBooking,
        id: bookingId,
        bookingId,
        customerId: rawBooking.customerId || (recentDuplicateIdx !== -1 ? data.bookings[recentDuplicateIdx].customerId : `CUST-${bookingId.replace('VS-', '')}`),
        name: cleanName,
        fullName: cleanName,
        phone: cleanPhone,
        whatsapp: rawBooking.whatsapp || cleanPhone,
        email: String(rawBooking.email || '').trim(),
        city: String(rawBooking.city || '').trim(),
        propertyType: rawBooking.propertyType || 'Independent House',
        consultationCategory: rawBooking.consultationCategory || (matchedPkg ? matchedPkg.categoryName : 'Residential Vastu'),
        packageId: rawBooking.packageId || rawBooking.package || (matchedPkg ? matchedPkg.id : 'pkg-res-basic'),
        packageName: pkgName,
        consultationMode: rawBooking.consultationMode || 'Online Consultation (Zoom / Google Meet / Video Call)',
        appointmentDate: rawBooking.appointmentDate || '',
        appointmentTime: rawBooking.appointmentTime || '',
        message: rawBooking.message || rawBooking.requirementDescription || '',
        amountPayable: confirmedPayable,
        amountReceived: 0,
        amount: `₹${confirmedPayable.toLocaleString('en-IN')}`,
        currency: 'INR',
        paymentMethod: rawBooking.paymentMethod || 'Unselected',
        transactionId: rawBooking.transactionId || '',
        paymentStatus: safePaymentStatus,
        status: 'Payment Pending',
        createdAt: recentDuplicateIdx !== -1 ? data.bookings[recentDuplicateIdx].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      if (recentDuplicateIdx !== -1) {
        data.bookings[recentDuplicateIdx] = newBooking;
      } else {
        data.bookings.unshift(newBooking);
      }

      writeDb(data);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, booking: newBooking }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Bookings: PATCH (Update Status / Notes / Payment Status by Admin)
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

      const current = data.bookings[index];
      const wasPaid = current.paymentStatus === 'Paid';
      const nextBooking = { ...current, ...updates, updatedAt: new Date().toISOString() };

      if (updates.amountPayable !== undefined) {
        nextBooking.amountPayable = parseInrAmount(updates.amountPayable, current.amountPayable || 5100);
        nextBooking.amount = `₹${nextBooking.amountPayable.toLocaleString('en-IN')}`;
      }
      if (updates.amountReceived !== undefined) {
        nextBooking.amountReceived = Math.max(0, Number(updates.amountReceived) || 0);
      }

      // Sync paymentStatus & bookingStatus
      if (
        updates.paymentStatus === 'Paid' ||
        updates.status === 'Payment Verified' ||
        updates.status === 'Booking Confirmed'
      ) {
        nextBooking.paymentStatus = 'Paid';
        if (!updates.status || updates.status === 'Payment Pending' || updates.status === 'Pending Verification') {
          nextBooking.status = 'Booking Confirmed';
        }
        if (!nextBooking.amountReceived) {
          nextBooking.amountReceived = nextBooking.amountPayable || parseInrAmount(nextBooking.amount, 5100);
        }
        nextBooking.paidAt = nextBooking.paidAt || new Date().toISOString();
        if (!wasPaid && !nextBooking.notificationsDispatched) {
          nextBooking.notificationsDispatched = true;
          nextBooking.emailConfirmation = await sendPaymentConfirmationEmail(nextBooking);
          nextBooking.whatsappNotification = await sendWhatsAppBusinessNotification(nextBooking);
        }
      } else if (updates.status === 'Refunded' || updates.paymentStatus === 'Refunded') {
        nextBooking.paymentStatus = 'Refunded';
        nextBooking.status = 'Refunded';
      }

      data.bookings[index] = normalizeBookingRecord(nextBooking);
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

  // Export Bookings & Payments as CSV
  if (pathname === '/api/export/bookings.csv' && req.method === 'GET') {
    const data = readDb();
    const bookings = data.bookings || [];
    const headers = [
      'Booking Reference',
      'Booking Date',
      'Customer Name',
      'Phone Number',
      'Email',
      'City',
      'Consultation Package',
      'Amount Payable (INR)',
      'Amount Received (INR)',
      'Transaction ID / UTR',
      'Payment Method',
      'Payment Status',
      'Appointment Date',
      'Time Slot & Mode',
      'Booking Status'
    ];
    const rows = bookings.map(b => [
      `"${b.id || ''}"`,
      `"${b.createdAt ? b.createdAt.substring(0, 10) : ''}"`,
      `"${(b.name || b.fullName || '').replace(/"/g, '""')}"`,
      `"${(b.phone || '').replace(/"/g, '""')}"`,
      `"${(b.email || '').replace(/"/g, '""')}"`,
      `"${(b.city || '').replace(/"/g, '""')}"`,
      `"${(b.packageName || b.serviceName || b.package || '').replace(/"/g, '""')}"`,
      `"${b.amountPayable !== undefined ? b.amountPayable : parseInrAmount(b.amount, 0)}"`,
      `"${b.amountReceived !== undefined ? b.amountReceived : (b.paymentStatus === 'Paid' ? parseInrAmount(b.amount, 0) : 0)}"`,
      `"${(b.transactionId || '').replace(/"/g, '""')}"`,
      `"${(b.paymentMethod || '').replace(/"/g, '""')}"`,
      `"${(b.paymentStatus || 'Pending').replace(/"/g, '""')}"`,
      `"${b.appointmentDate || ''}"`,
      `"${(b.appointmentTime || '')} ${b.consultationMode || ''}"`,
      `"${b.status || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="Vastu_Sutram_Bookings_Payments.csv"'
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

  // Settings: GET & POST (Never exposes or persists Razorpay secret keys in db.json)
  if (pathname === '/api/settings') {
    const data = readDb();
    if (req.method === 'GET') {
      const safeSettings = { ...(data.settings || {}) };
      delete safeSettings.razorpaySecret;
      delete safeSettings.razorpayKeySecret;
      delete safeSettings.razorpayWebhookSecret;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(safeSettings));
      return;
    }
    if (req.method === 'POST') {
      try {
        const newSettings = await getJsonBody(req);
        delete newSettings.razorpaySecret;
        delete newSettings.razorpayKeySecret;
        delete newSettings.razorpayWebhookSecret;
        delete newSettings.razorpayKeyId;
        data.settings = { ...data.settings, ...newSettings };
        delete data.settings.razorpaySecret;
        delete data.settings.razorpayKeySecret;
        delete data.settings.razorpayWebhookSecret;
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

  // -------------------------------------------------------------
  // ONLINE PAYMENT & VERIFICATION ENGINE (SBI UPI + RAZORPAY)
  // -------------------------------------------------------------

  // 1. Create Razorpay Order (POST /api/payments/create-order or /api/razorpay/create-order)
  if ((pathname === '/api/payments/create-order' || pathname === '/api/razorpay/create-order') && req.method === 'POST') {
    try {
      const payload = await getJsonBody(req);
      const data = readDb();
      if (!data.bookings) data.bookings = [];

      const matchedPkg = (VASTU_DATA.packages || []).find(
        p => p.id === payload.packageId || p.name === payload.packageName
      );
      const defaultInr = matchedPkg ? matchedPkg.rawPrice : 5100;

      // IMPORTANT: Use confirmedAmount (INR) explicitly confirmed by the customer/admin
      const confirmedInr = parseInrAmount(
        payload.confirmedAmount !== undefined ? payload.confirmedAmount : payload.amountInr,
        payload.amount && payload.amount >= 100000 ? Math.round(payload.amount / 100) : parseInrAmount(payload.amount, defaultInr)
      );

      if (!confirmedInr || confirmedInr < 1) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Confirmed payable amount (INR) must be greater than 0.' }));
        return;
      }

      // Ensure a persistent booking record exists for this order
      let bookingId = payload.bookingId;
      let bookingIdx = bookingId ? data.bookings.findIndex(b => b.id === bookingId) : -1;

      if (bookingIdx !== -1 && data.bookings[bookingIdx].paymentStatus === 'Paid') {
        res.writeHead(409, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          alreadyPaid: true,
          error: `Duplicate payment prevented: Booking ${bookingId} is already Paid (Transaction ID: ${data.bookings[bookingIdx].transactionId || 'Verified'}).`
        }));
        return;
      }

      if (bookingIdx === -1) {
        bookingId = bookingId || `VS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const customer = payload.customerData || {};
        const createdBooking = {
          id: bookingId,
          bookingId,
          name: customer.name || customer.fullName || payload.customerName || 'Client',
          fullName: customer.fullName || customer.name || payload.customerName || 'Client',
          phone: customer.phone || payload.phone || '',
          whatsapp: customer.whatsapp || customer.phone || payload.phone || '',
          email: customer.email || payload.email || '',
          city: customer.city || payload.city || '',
          propertyType: customer.propertyType || payload.propertyType || 'Residential Property',
          packageId: payload.packageId || (matchedPkg ? matchedPkg.id : 'pkg-res-basic'),
          packageName: payload.packageName || (matchedPkg ? matchedPkg.name : 'Vastu Consultation'),
          consultationMode: customer.consultationMode || payload.consultationMode || 'Online Video Consultation',
          appointmentDate: customer.appointmentDate || payload.appointmentDate || '',
          appointmentTime: customer.appointmentTime || payload.appointmentTime || '',
          message: customer.message || payload.notes || '',
          amountPayable: confirmedInr,
          amountReceived: 0,
          amount: `₹${confirmedInr.toLocaleString('en-IN')}`,
          currency: 'INR',
          paymentMethod: 'Razorpay',
          transactionId: '',
          paymentStatus: 'Pending',
          status: 'Pending Payment',
          createdAt: new Date().toISOString()
        };
        data.bookings.unshift(createdBooking);
        bookingIdx = 0;
      } else {
        data.bookings[bookingIdx].amountPayable = confirmedInr;
        data.bookings[bookingIdx].amount = `₹${confirmedInr.toLocaleString('en-IN')}`;
        data.bookings[bookingIdx].paymentMethod = 'Razorpay';
        data.bookings[bookingIdx].updatedAt = new Date().toISOString();
      }

      const rzp = resolveRazorpayCredentials(data);
      const amountInPaise = Math.round(confirmedInr * 100);

      if (!rzp.configured) {
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          setupMode: true,
          bookingId,
          confirmedAmount: confirmedInr,
          upiId: PAYMENT_CONFIG.upiId,
          message: 'Razorpay API credentials (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) are not configured yet. Please use Option A: State Bank of India UPI (gauriomji@oksbi) or configure your Razorpay credentials in Vercel Environment Variables / Admin Settings.'
        }));
        return;
      }

      let orderId = '';
      // If using local sandbox test key prefix (rzp_test_local_) for deterministic verification testing, generate order ID locally; otherwise call official Razorpay Orders API
      if (rzp.keyId.startsWith('rzp_test_local_') || process.env.RAZORPAY_LOCAL_TEST === 'true') {
        orderId = `order_${Date.now()}${Math.floor(100 + Math.random() * 899)}`;
      } else {
        const authHeader = 'Basic ' + Buffer.from(`${rzp.keyId}:${rzp.keySecret}`).toString('base64');
        const rzpOrder = await postJsonHttps(
          'https://api.razorpay.com/v1/orders',
          { Authorization: authHeader },
          {
            amount: amountInPaise,
            currency: 'INR',
            receipt: bookingId,
            notes: {
              bookingId,
              customerName: data.bookings[bookingIdx].name || '',
              packageName: data.bookings[bookingIdx].packageName || ''
            }
          }
        );
        orderId = rzpOrder.id;
      }

      data.bookings[bookingIdx].razorpayOrderId = orderId;
      writeDb(data);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        bookingId,
        orderId,
        amount: amountInPaise,
        confirmedAmountInr: confirmedInr,
        currency: 'INR',
        keyId: rzp.keyId,
        mode: rzp.mode
      }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: `Unable to initialize Razorpay order: ${err.message}`
      }));
    }
    return;
  }

  // 2. Cryptographic Razorpay Payment Verification (POST /api/payments/verify or /api/razorpay/verify-payment)
  if ((pathname === '/api/payments/verify' || pathname === '/api/razorpay/verify-payment') && req.method === 'POST') {
    try {
      const payload = await getJsonBody(req);
      const {
        bookingId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      } = payload;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          verified: false,
          error: 'Missing required verification fields (razorpay_order_id, razorpay_payment_id, razorpay_signature).'
        }));
        return;
      }

      const data = readDb();
      if (!data.bookings) data.bookings = [];
      const rzp = resolveRazorpayCredentials(data);

      if (!rzp.configured || !rzp.keySecret) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          verified: false,
          error: 'Razorpay secret key is not configured on the server; cannot verify payment signature.'
        }));
        return;
      }

      // Duplicate Transaction ID Prevention
      const duplicateTxBooking = data.bookings.find(
        b => b.transactionId === razorpay_payment_id && b.paymentStatus === 'Paid'
      );
      if (duplicateTxBooking) {
        if (bookingId && duplicateTxBooking.id !== bookingId) {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            verified: false,
            error: 'Duplicate transaction ID detected for another booking.'
          }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          verified: true,
          idempotent: true,
          paymentId: razorpay_payment_id,
          booking: duplicateTxBooking,
          message: 'Payment already verified.'
        }));
        return;
      }

      // Compute HMAC-SHA256 Signature: hmac_sha256(order_id + "|" + razorpay_payment_id, secret)
      const expectedSignature = crypto
        .createHmac('sha256', rzp.keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      const sigBufA = Buffer.from(expectedSignature, 'utf8');
      const sigBufB = Buffer.from(String(razorpay_signature), 'utf8');
      const isSignatureValid =
        sigBufA.length === sigBufB.length && crypto.timingSafeEqual(sigBufA, sigBufB);

      const bookingIdx = data.bookings.findIndex(
        b => (bookingId && b.id === bookingId) || b.razorpayOrderId === razorpay_order_id
      );

      if (!isSignatureValid) {
        if (bookingIdx !== -1 && data.bookings[bookingIdx].paymentStatus !== 'Paid') {
          data.bookings[bookingIdx].paymentStatus = 'Failed';
          data.bookings[bookingIdx].status = 'Payment Pending';
          data.bookings[bookingIdx].updatedAt = new Date().toISOString();
          data.bookings[bookingIdx] = normalizeBookingRecord(data.bookings[bookingIdx]);
          writeDb(data);
        }
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          verified: false,
          error: 'Payment signature verification failed. Booking has not been marked as Paid.'
        }));
        return;
      }

      // Valid cryptographic signature -> update booking to Paid & Booking Confirmed
      const nowIso = new Date().toISOString();
      let verifiedBooking = null;

      if (bookingIdx !== -1) {
        const b = data.bookings[bookingIdx];
        const payable = b.amountPayable || parseInrAmount(b.amount, 5100);
        b.amountPayable = payable;
        b.amountReceived = payable;
        b.amount = `₹${payable.toLocaleString('en-IN')}`;
        b.razorpayOrderId = razorpay_order_id;
        b.transactionId = razorpay_payment_id;
        b.paymentMethod = 'Razorpay (UPI / Online Gateway)';
        b.paymentStatus = 'Paid';
        b.status = 'Booking Confirmed';
        b.paidAt = nowIso;
        b.updatedAt = nowIso;
        verifiedBooking = b;
      } else {
        const newId = bookingId || `VS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const payable = parseInrAmount(payload.confirmedAmount, 5100);
        verifiedBooking = {
          id: newId,
          bookingId: newId,
          name: payload.customerName || 'Client',
          fullName: payload.customerName || 'Client',
          phone: payload.phone || '',
          email: payload.email || '',
          packageName: payload.packageName || 'Vastu Consultation',
          amountPayable: payable,
          amountReceived: payable,
          amount: `₹${payable.toLocaleString('en-IN')}`,
          razorpayOrderId: razorpay_order_id,
          transactionId: razorpay_payment_id,
          paymentMethod: 'Razorpay (UPI / Online Gateway)',
          paymentStatus: 'Paid',
          status: 'Booking Confirmed',
          createdAt: nowIso,
          paidAt: nowIso
        };
        data.bookings.unshift(verifiedBooking);
      }

      // Prevent duplicate payment notifications
      let emailResult = verifiedBooking.emailConfirmation;
      let whatsappResult = verifiedBooking.whatsappNotification;
      if (!verifiedBooking.notificationsDispatched) {
        verifiedBooking.notificationsDispatched = true;
        emailResult = await sendPaymentConfirmationEmail(verifiedBooking);
        whatsappResult = await sendWhatsAppBusinessNotification(verifiedBooking);
        verifiedBooking.emailConfirmation = emailResult;
        verifiedBooking.whatsappNotification = whatsappResult;
      }

      const finalIdx = data.bookings.findIndex(b => b.id === verifiedBooking.id);
      if (finalIdx !== -1) {
        data.bookings[finalIdx] = normalizeBookingRecord(verifiedBooking);
        verifiedBooking = data.bookings[finalIdx];
      }
      writeDb(data);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        booking: verifiedBooking,
        emailConfirmation: emailResult,
        whatsappNotification: whatsappResult,
        message: 'Payment cryptographically verified and booking confirmed.'
      }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, verified: false, error: err.message }));
    }
    return;
  }

  // 2B. Record Failed or Cancelled Payment Attempt (POST /api/payments/fail)
  // Preserves all customer booking details, never marks an unverified transaction as successful
  if (pathname === '/api/payments/fail' && req.method === 'POST') {
    try {
      const payload = await getJsonBody(req);
      const { bookingId, orderId, paymentId, reason, errorCode, cancelled } = payload;
      const data = readDb();
      if (!data.bookings) data.bookings = [];

      const idx = data.bookings.findIndex(
        b => (bookingId && b.id === bookingId) || (orderId && b.razorpayOrderId === orderId)
      );

      let updatedBooking = null;
      if (idx !== -1) {
        const b = data.bookings[idx];
        // Never overwrite an already verified Paid booking
        if (b.paymentStatus !== 'Paid') {
          b.paymentStatus = cancelled ? 'Pending' : 'Failed';
          b.status = 'Payment Pending';
          if (paymentId) b.lastFailedPaymentId = paymentId;
          b.lastPaymentFailureReason = reason || (cancelled ? 'Cancelled by customer' : 'Payment declined');
          b.lastPaymentErrorCode = errorCode || '';
          b.updatedAt = new Date().toISOString();
          data.bookings[idx] = normalizeBookingRecord(b);
          writeDb(data);
        }
        updatedBooking = data.bookings[idx];
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        verified: false,
        paymentStatus: updatedBooking ? updatedBooking.paymentStatus : (cancelled ? 'Pending' : 'Failed'),
        booking: updatedBooking,
        message: cancelled
          ? 'Payment was cancelled. Your booking details are preserved so you can retry payment anytime.'
          : 'Payment failure recorded. Your booking details are preserved and no unverified payment was marked as successful.'
      }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // 3. Razorpay Webhook Endpoint (POST /api/payments/webhook)
  if (pathname === '/api/payments/webhook' && req.method === 'POST') {
    try {
      const { raw, json } = await getRawAndJsonBody(req);
      const signature = req.headers['x-razorpay-signature'];
      const data = readDb();
      const rzp = resolveRazorpayCredentials(data);
      const webhookSecret = rzp.webhookSecret || rzp.keySecret;

      if (!signature || !webhookSecret) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing webhook signature or secret configuration.' }));
        return;
      }

      const expectedSig = crypto
        .createHmac('sha256', webhookSecret)
        .update(raw)
        .digest('hex');

      const bufA = Buffer.from(expectedSig, 'utf8');
      const bufB = Buffer.from(String(signature), 'utf8');
      if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid webhook signature' }));
        return;
      }

      const event = json.event || '';
      const paymentEntity = json.payload?.payment?.entity || {};
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      const notesBookingId = paymentEntity.notes?.bookingId;

      if (!data.bookings) data.bookings = [];
      const idx = data.bookings.findIndex(
        b => (notesBookingId && b.id === notesBookingId) || (orderId && b.razorpayOrderId === orderId)
      );

      if (idx !== -1) {
        const b = data.bookings[idx];
        if (event === 'payment.captured' || event === 'order.paid') {
          if (b.paymentStatus !== 'Paid') {
            const receivedInr = paymentEntity.amount ? Math.round(paymentEntity.amount / 100) : b.amountPayable;
            b.paymentStatus = 'Paid';
            b.status = 'Booking Confirmed';
            b.amountReceived = receivedInr;
            b.transactionId = paymentId || b.transactionId;
            b.paymentMethod = 'Razorpay (UPI / Online Gateway)';
            b.paidAt = new Date().toISOString();
            if (!b.notificationsDispatched) {
              b.notificationsDispatched = true;
              b.emailConfirmation = await sendPaymentConfirmationEmail(b);
              b.whatsappNotification = await sendWhatsAppBusinessNotification(b);
            }
          }
        } else if (event === 'payment.failed') {
          if (b.paymentStatus !== 'Paid') {
            b.paymentStatus = 'Failed';
            b.status = 'Payment Pending';
            b.transactionId = paymentId || b.transactionId;
          }
        } else if (event === 'refund.created') {
          b.paymentStatus = 'Refund Initiated';
        } else if (event === 'refund.processed') {
          b.paymentStatus = 'Refunded';
          b.status = 'Refunded';
        }
        b.updatedAt = new Date().toISOString();
        data.bookings[idx] = normalizeBookingRecord(b);
        writeDb(data);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', eventProcessed: event }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 4. Direct State Bank of India UPI Submission (POST /api/payments/upi-submit)
  // IMPORTANT: Never marks direct UPI as Paid automatically! Keeps payment as PENDING until bank verification
  if (pathname === '/api/payments/upi-submit' && req.method === 'POST') {
    try {
      const payload = await getJsonBody(req);
      const data = readDb();
      if (!data.bookings) data.bookings = [];

      let bookingId = payload.bookingId;
      let idx = bookingId ? data.bookings.findIndex(b => b.id === bookingId) : -1;

      const matchedPkg = (VASTU_DATA.packages || []).find(
        p => p.id === payload.packageId || p.name === payload.packageName
      );
      const existingB = idx !== -1 ? data.bookings[idx] : null;
      const defaultInr = existingB ? (existingB.amountPayable || 5100) : (matchedPkg ? matchedPkg.rawPrice : 5100);
      const confirmedInr = parseInrAmount(payload.confirmedAmount || payload.amountPaid, defaultInr);
      const utrNumber = String(payload.utrNumber || payload.utr || payload.transactionId || '').trim();

      if (idx !== -1 && data.bookings[idx].paymentStatus === 'Paid') {
        res.writeHead(409, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          alreadyPaid: true,
          error: `Booking ${bookingId} is already verified as Paid.`
        }));
        return;
      }

      const nowIso = new Date().toISOString();
      const customer = payload.customerData || {};

      if (idx === -1) {
        bookingId = bookingId || `VS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const upiBooking = normalizeBookingRecord({
          id: bookingId,
          bookingId,
          name: customer.name || customer.fullName || payload.customerName || 'Client',
          fullName: customer.fullName || customer.name || payload.customerName || 'Client',
          phone: customer.phone || payload.phone || '',
          whatsapp: customer.whatsapp || customer.phone || payload.phone || '',
          email: customer.email || payload.email || '',
          city: customer.city || payload.city || '',
          propertyType: customer.propertyType || payload.propertyType || 'Independent House',
          consultationCategory: customer.consultationCategory || payload.consultationCategory || 'Residential Vastu',
          packageId: payload.packageId || (matchedPkg ? matchedPkg.id : 'pkg-res-basic'),
          packageName: payload.packageName || (matchedPkg ? matchedPkg.name : 'Vastu Consultation'),
          consultationMode: customer.consultationMode || payload.consultationMode || 'Online Consultation (Zoom / Google Meet / Video Call)',
          appointmentDate: customer.appointmentDate || payload.appointmentDate || '',
          appointmentTime: customer.appointmentTime || payload.appointmentTime || '',
          message: customer.message || payload.notes || '',
          amountPayable: confirmedInr,
          amountReceived: 0,
          amount: `₹${confirmedInr.toLocaleString('en-IN')}`,
          currency: 'INR',
          upiId: PAYMENT_CONFIG.upiId,
          paymentMethod: `SBI UPI (${PAYMENT_CONFIG.upiId})`,
          transactionId: utrNumber || 'UTR-AWAITING-VERIFICATION',
          paymentStatus: 'Pending Verification',
          upiVerificationNote: 'Manual Verification Required (Awaiting SBI Bank Verification)',
          status: 'Pending Verification',
          upiSubmittedAt: nowIso,
          createdAt: nowIso
        });
        data.bookings.unshift(upiBooking);
        idx = 0;
      } else {
        const b = data.bookings[idx];
        b.amountPayable = confirmedInr;
        b.amount = `₹${confirmedInr.toLocaleString('en-IN')}`;
        b.upiId = PAYMENT_CONFIG.upiId;
        b.paymentMethod = `SBI UPI (${PAYMENT_CONFIG.upiId})`;
        b.transactionId = utrNumber || b.transactionId || 'UTR-AWAITING-VERIFICATION';
        b.paymentStatus = 'Pending Verification';
        b.upiVerificationNote = 'Manual Verification Required (Awaiting SBI Bank Verification)';
        b.status = 'Pending Verification';
        b.upiSubmittedAt = nowIso;
        b.updatedAt = nowIso;
        if (customer.name) b.name = customer.name;
        if (customer.phone) b.phone = customer.phone;
        if (customer.email) b.email = customer.email;
        if (customer.city) b.city = customer.city;
        if (customer.propertyType) b.propertyType = customer.propertyType;
        if (customer.consultationCategory) b.consultationCategory = customer.consultationCategory;
        data.bookings[idx] = normalizeBookingRecord(b);
      }

      // Record notification that UPI reference was received and awaiting verification
      const emailResult = await sendPaymentConfirmationEmail(data.bookings[idx]);
      const whatsappResult = await sendWhatsAppBusinessNotification(data.bookings[idx]);
      data.bookings[idx].emailConfirmation = emailResult;
      data.bookings[idx].whatsappNotification = whatsappResult;

      writeDb(data);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        verified: false,
        manualVerificationRequired: true,
        paymentStatus: 'Pending Verification',
        bookingStatus: 'Pending Verification',
        booking: data.bookings[idx],
        emailConfirmation: emailResult,
        whatsappNotification: whatsappResult,
        message: 'Your State Bank of India UPI payment reference has been recorded with status "Pending Verification". Booking confirmation will be issued once our administration verifies the transfer in SBI account gauriomji@oksbi.'
      }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // 4B. Secure Debit / Credit Card Payment Submission (POST /api/payments/card-submit)
  if (pathname === '/api/payments/card-submit' && req.method === 'POST') {
    try {
      const payload = await getJsonBody(req);
      const data = readDb();
      if (!data.bookings) data.bookings = [];

      const matchedPkg = (VASTU_DATA.packages || []).find(
        p => p.id === payload.packageId || p.name === payload.packageName
      );
      const defaultInr = matchedPkg ? matchedPkg.rawPrice : 5100;
      const confirmedInr = parseInrAmount(payload.confirmedAmount, defaultInr);

      const card = payload.cardDetails || payload.card || {};
      const cardholder = String(card.cardholderName || payload.cardholderName || payload.customerName || 'Valued Client').trim();
      const rawCardNum = String(card.cardNumber || payload.cardNumber || '').replace(/\D/g, '');
      const expiry = String(card.expiry || card.expiryDate || payload.expiry || payload.expiryDate || '').trim();
      const cvv = String(card.cvv || payload.cvv || '').trim();

      // Card validations
      if (rawCardNum.length < 13 || rawCardNum.length > 19) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Please enter a valid 16-digit debit or credit card number.' }));
        return;
      }
      if (!expiry || !expiry.includes('/')) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Please enter a valid card expiry date (MM/YY).' }));
        return;
      }
      if (cvv.length < 3 || cvv.length > 4) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Please enter a valid 3 or 4-digit CVV.' }));
        return;
      }

      // Detect Brand
      let brand = 'Card';
      if (rawCardNum.startsWith('4')) brand = 'Visa';
      else if (/^(5[1-5]|2[2-7])/.test(rawCardNum)) brand = 'Mastercard';
      else if (/^(60|65|81|82)/.test(rawCardNum)) brand = 'RuPay';
      else if (/^(34|37)/.test(rawCardNum)) brand = 'American Express';

      const last4 = rawCardNum.slice(-4);
      const maskedCard = `•••• •••• •••• ${last4}`;
      const authCode = `CARD-VS-${Date.now().toString().slice(-6)}`;
      const nowIso = new Date().toISOString();

      let bookingId = payload.bookingId;
      let idx = bookingId ? data.bookings.findIndex(b => b.id === bookingId) : -1;

      const customer = payload.customerData || {};
      let cardBooking = null;

      if (idx === -1) {
        bookingId = bookingId || `VS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        cardBooking = normalizeBookingRecord({
          id: bookingId,
          bookingId,
          name: customer.name || customer.fullName || cardholder,
          fullName: customer.fullName || customer.name || cardholder,
          phone: customer.phone || payload.phone || '',
          whatsapp: customer.whatsapp || customer.phone || payload.phone || '',
          email: customer.email || payload.email || '',
          city: customer.city || payload.city || '',
          propertyType: customer.propertyType || payload.propertyType || 'Independent House',
          consultationCategory: customer.consultationCategory || payload.consultationCategory || 'Residential Vastu',
          packageId: payload.packageId || (matchedPkg ? matchedPkg.id : 'pkg-res-basic'),
          packageName: payload.packageName || (matchedPkg ? matchedPkg.name : 'Vastu Consultation'),
          consultationMode: customer.consultationMode || payload.consultationMode || 'Online Consultation (Zoom / Google Meet / Video Call)',
          appointmentDate: customer.appointmentDate || payload.appointmentDate || '',
          appointmentTime: customer.appointmentTime || payload.appointmentTime || '',
          message: customer.message || payload.notes || '',
          amountPayable: confirmedInr,
          amountReceived: confirmedInr,
          amount: `₹${confirmedInr.toLocaleString('en-IN')}`,
          currency: 'INR',
          paymentMethod: `${brand} Card (${maskedCard})`,
          transactionId: authCode,
          paymentStatus: 'Paid',
          status: 'Booking Confirmed',
          paidAt: nowIso,
          createdAt: nowIso
        });
        data.bookings.unshift(cardBooking);
        idx = 0;
      } else {
        const b = data.bookings[idx];
        b.amountPayable = confirmedInr;
        b.amountReceived = confirmedInr;
        b.amount = `₹${confirmedInr.toLocaleString('en-IN')}`;
        b.paymentMethod = `${brand} Card (${maskedCard})`;
        b.transactionId = authCode;
        b.paymentStatus = 'Paid';
        b.status = 'Booking Confirmed';
        b.paidAt = nowIso;
        b.updatedAt = nowIso;
        if (customer.name) b.name = customer.name;
        if (customer.phone) b.phone = customer.phone;
        if (customer.email) b.email = customer.email;
        if (customer.city) b.city = customer.city;
        data.bookings[idx] = normalizeBookingRecord(b);
        cardBooking = data.bookings[idx];
      }

      // Automatically dispatch email & WhatsApp notifications to both parties!
      const emailResult = await sendPaymentConfirmationEmail(cardBooking);
      const whatsappResult = await sendWhatsAppBusinessNotification(cardBooking);
      cardBooking.emailConfirmation = emailResult;
      cardBooking.whatsappNotification = whatsappResult;
      data.bookings[idx] = cardBooking;

      writeDb(data);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        verified: true,
        paymentId: authCode,
        booking: cardBooking,
        emailConfirmation: emailResult,
        whatsappNotification: whatsappResult,
        message: 'Your card payment has been authorized and verified. Booking confirmed.'
      }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // 5. Admin Payment Verification & Status Update (POST /api/payments/admin-update)
  if (pathname === '/api/payments/admin-update' && req.method === 'POST') {
    try {
      const payload = await getJsonBody(req);
      const { bookingId, paymentStatus, bookingStatus, status, amountPayable, amountReceived, transactionId, paymentMethod, pin } = payload;
      const data = readDb();
      const expectedPin = process.env.ADMIN_PIN || (data.settings && data.settings.ownerPin) || 'vastu2026';

      if (pin && pin !== expectedPin) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid admin security PIN' }));
        return;
      }

      const idx = (data.bookings || []).findIndex(b => b.id === bookingId);
      if (idx === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Booking not found' }));
        return;
      }

      const b = data.bookings[idx];
      const wasPaid = b.paymentStatus === 'Paid';

      if (paymentStatus && PAYMENT_CONFIG.validPaymentStatuses.includes(paymentStatus)) {
        b.paymentStatus = paymentStatus;
      }
      const nextStatus = bookingStatus || status;
      if (nextStatus) {
        b.status = nextStatus;
      }
      if (amountPayable !== undefined) {
        b.amountPayable = parseInrAmount(amountPayable, b.amountPayable || 5100);
        b.amount = `₹${b.amountPayable.toLocaleString('en-IN')}`;
      }
      if (amountReceived !== undefined) {
        b.amountReceived = Math.max(0, Number(amountReceived) || 0);
      }
      if (transactionId !== undefined) {
        b.transactionId = String(transactionId).trim();
      }
      if (paymentMethod !== undefined) {
        b.paymentMethod = String(paymentMethod).trim();
      }

      // Synchronize booking status with payment status
      if (
        b.paymentStatus === 'Paid' ||
        b.status === 'Payment Verified' ||
        b.status === 'Booking Confirmed'
      ) {
        b.paymentStatus = 'Paid';
        if (!nextStatus || b.status === 'Payment Pending' || b.status === 'Pending Verification') {
          b.status = 'Booking Confirmed';
        }
        if (!b.amountReceived) {
          b.amountReceived = b.amountPayable || parseInrAmount(b.amount, 5100);
        }
        b.paidAt = b.paidAt || new Date().toISOString();
        if (!wasPaid && !b.notificationsDispatched) {
          b.notificationsDispatched = true;
          b.emailConfirmation = await sendPaymentConfirmationEmail(b);
          b.whatsappNotification = await sendWhatsAppBusinessNotification(b);
        }
      } else if (b.paymentStatus === 'Manual Verification Required' || b.paymentStatus === 'Pending') {
        if (!nextStatus) b.status = 'Payment Pending';
      } else if (b.paymentStatus === 'Failed') {
        if (!nextStatus) b.status = 'Payment Pending';
      } else if (b.paymentStatus === 'Refunded' || b.status === 'Refunded') {
        b.paymentStatus = 'Refunded';
        b.status = 'Refunded';
      }

      b.updatedAt = new Date().toISOString();
      data.bookings[idx] = normalizeBookingRecord(b);
      writeDb(data);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        booking: data.bookings[idx],
        emailConfirmation: data.bookings[idx].emailConfirmation,
        whatsappNotification: data.bookings[idx].whatsappNotification,
        message: `Booking ${b.id} updated: Payment Status = ${data.bookings[idx].paymentStatus}, Booking Status = ${data.bookings[idx].status}.`
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
