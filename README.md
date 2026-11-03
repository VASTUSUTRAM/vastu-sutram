# VASTU SUTRAM – THE PRINCIPLES OF VASTU
### Luxury Vastu Shastra Consultation & Online Booking Platform

> **Brand Name:** VASTU SUTRAM  
> **Brand Tagline:** THE PRINCIPLES OF VASTU  
> **Philosophy:** Where Ancient Wisdom Meets Harmonious Living.

---

## 🌟 Overview

**VASTU SUTRAM** is a complete, luxury, responsive, and fully functional Vastu Shastra consultation and booking platform built with ancient Vedic architectural principles and modern 3D web technology.

---

## 🏛️ Key Features

1. **Cinematic 3D Opening Animation (12–18s)**:
   - **Scene 1 (Cosmic Universe)**: Golden particle nebulae and a 3D rotating Vastu Purusha Mandala with concentric Padavinyasa divisions and glowing directional prongs.
   - **Scene 2 (The House Appears)**: Luxury Indian sanctuary with sandstone plinth and carved teak double doors that open in 3D.
   - **Scene 3 (Energy Inflow)**: Chakra transforms into streams of golden prana entering the house; 9×9 sacred grid illuminates the floor.
   - **Scene 4 (Symbolic Protection Dome)**: Golden translucent geodesic mandala dome encases the residence with pulsating energy waves.
   - **Scene 5 (Logo Reveal)**: Climax revealing the original Vastu Sutram emblem with "Explore Website" and "Book Consultation" actions.
   - *Features Skip Intro and Ambient Vedic Sound Synthesis (Web Audio API).*

2. **Interactive 3D Vastu Chakra & Knowledge Explorer**:
   - 3D interactive Chakra with 360° rotation, zoom in/out, and auto-rotate.
   - Directional selector (North, North-East, East, South-East, South, South-West, West, North-West, and central Brahmasthan).
   - Dynamic inspector displaying Ruling Deity, Planet, Element, Cosmic Influences, Ideal Rooms, and Non-Demolition Remedies.
   - 32 Padavinyasa Entrance Gates with Auspicious/Inauspicious classifications.
   - 45 Devtas of Vastu Purusha Mandala breakdown.
   - Room Placement Matrix (Pooja, Kitchen, Bedroom, Toilet, Staircase, Underground Water Tank).

3. **Complete 8-Step Online Consultation Booking Engine**:
   - **Step 1:** Select Service (Residential, Commercial, Industrial, Land, CAD Review).
   - **Step 2:** Select Package with duration and deliverables.
   - **Step 3:** Client Contact Details (Name, Phone, WhatsApp, Email, City, State).
   - **Step 4:** Property Specifications (Type, Area, Floors, Entrance Direction, Status, Purpose).
   - **Step 5:** Floor Plan & Document Drag-and-Drop Uploader (PDF, CAD, PNG, JPG).
   - **Step 6:** Appointment Date Picker & Dynamic Slot Selection (IST) + Mode (Video Call, Phone, In-Person, On-Site Visit).
   - **Step 7:** Payment Method Selection (Razorpay / UPI / Card / Net Banking) with instant verification.
   - **Step 8:** Confirmation Voucher with reference code (`VS-2026-XXXX`), print/download receipt, and WhatsApp notification prefilled link.
   - *Directly saved to the database (`data/db.json`) and visible in the Admin Portal!*

4. **Floating Interactive Digital Vastu Compass**:
   - 16 Vastu Zones with live degree readings.
   - Device orientation support (mobile compass sensor).
   - Manual dial rotation and quick-select presets (0° N, 45° NE, etc.).

5. **Full Owner Admin Dashboard**:
   - Protected by Security PIN (Default: `vastu2026`, customizable in settings).
   - Bookings Manager: View all appointments, filter by status, search by client/ID, update status (Confirmed, Completed, Cancelled), export to `.csv`.
   - Inquiries Manager: View contact messages and reply via WhatsApp/Email.
   - Time Slots Manager: Add/remove consultation slots.
   - Package & Pricing Editor: Modify package fees and deliverables.
   - Knowledge & Blog Editor: Publish/edit research articles.
   - Owner Profile & API Settings: Update consultant bio, contact details, and Razorpay Merchant keys (`razorpayKeyId`, `razorpaySecret`).

---

## 🎨 Brand Color Palette

- **Deep Royal Burgundy:** `#481C25`
- **Antique Gold:** `#C6A15B` (with `#F9E29B` highlight)
- **Warm Ivory:** `#F8F3E9`
- **Deep Charcoal:** `#171717`
- **Muted Sand:** `#DCCBB0`
- **Subtle Cream:** `#FFFDF8`

---

## 🚀 Running the Platform

The platform includes a built-in Node.js server that runs out of the box with zero external npm dependencies:

```bash
# Prepend portable Node.js to PATH
$env:PATH = "C:\Users\khush\.gemini\antigravity\scratch\nodejs\node-v20.18.0-win-x64;" + $env:PATH

# Navigate to project
cd "C:\Users\khush\.gemini\antigravity\scratch\vastu-sutram"

# Start the server
node server.js
```

Open your browser at:
👉 **`http://localhost:3000`**

---

## 🔑 Owner Configuration

To configure production payment gateways and contact details:
1. Open the website at `http://localhost:3000`.
2. Scroll to the footer and click **"🔒 Owner Admin Portal"** (or press the Admin trigger).
3. Enter PIN: `vastu2026`.
4. Navigate to **"Owner & API Settings"** to insert your live Razorpay Key ID and Secret, update phone numbers, and customize consultant credentials.
