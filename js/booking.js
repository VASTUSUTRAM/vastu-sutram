/**
 * VASTU SUTRAM – 8-Step Consultation Booking Engine
 */

class VastuBookingSystem {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentStep = 1;
    this.totalSteps = 8;
    this.uploadedFiles = [];
    this.availableSlots = VASTU_DATA.defaultSlots || [];

    this.formData = {
      service: "residential",
      serviceName: "Home Vastu",
      packageId: "pkg-res-complete",
      packageName: "Complete Home Vastu Analysis",
      amount: "₹11,000",
      fullName: "",
      phone: "",
      whatsapp: "",
      email: "",
      city: "",
      state: "",
      propertyType: "Independent House",
      propertyArea: "2,500 sq.ft",
      floors: "2 Floors",
      direction: "North-East Facing",
      constructionStatus: "Ready to Move",
      purpose: "",
      documents: [],
      appointmentDate: this.getDefaultDate(),
      appointmentTime: "11:30 AM - 12:30 PM",
      consultationMode: "Online Video Consultation",
      paymentMethod: "UPI / Razorpay",
      paymentStatus: "Payment Verified",
      bookingId: ""
    };

    this.init();
  }

  getDefaultDate() {
    const d = new Date();
    d.setDate(d.getDate() + 2); // Default to 2 days ahead
    return d.toISOString().split('T')[0];
  }

  async init() {
    // Try to fetch latest slots and packages from backend
    try {
      const res = await fetch('/api/db');
      if (res.ok) {
        const data = await res.json();
        if (data.slots && data.slots.length > 0) {
          this.availableSlots = data.slots;
        }
      }
    } catch (e) {
      console.log('Using default client slots');
    }

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="max-w-4xl mx-auto p-4 md:p-8 bg-[#171717]/95 backdrop-blur-xl border border-[#C6A15B]/30 rounded-2xl shadow-2xl relative text-[#F8F3E9]">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[#C6A15B]/20 pb-4 mb-6">
          <div class="flex items-center gap-3">
            <img src="assets/logo-icon.svg" alt="Vastu Sutram" class="w-10 h-10 drop-shadow" />
            <div>
              <h2 class="font-serif text-xl md:text-2xl text-[#C6A15B] font-bold">Book a Vastu Consultation</h2>
              <p class="text-xs text-[#DCCBB0]">Step ${this.currentStep} of ${this.totalSteps} • Confidential & Personalized</p>
            </div>
          </div>
          <button id="booking-close-btn" class="w-8 h-8 rounded-full border border-[#C6A15B]/40 flex items-center justify-center text-[#C6A15B] hover:bg-[#481C25] transition-all">✕</button>
        </div>

        <!-- Step Indicator Wizard -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-2 overflow-x-auto pb-1 text-xs">
            ${[
              '1. Service',
              '2. Package',
              '3. Contact',
              '4. Property',
              '5. Upload',
              '6. Schedule',
              '7. Payment',
              '8. Confirm'
            ].map((step, idx) => `
              <div class="flex items-center gap-1.5 whitespace-nowrap px-1">
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  this.currentStep === idx + 1
                    ? 'bg-[#C6A15B] text-[#171717] ring-2 ring-[#F9E29B]'
                    : this.currentStep > idx + 1
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#481C25]/60 text-[#DCCBB0] border border-[#C6A15B]/20'
                }">
                  ${this.currentStep > idx + 1 ? '✓' : idx + 1}
                </span>
                <span class="hidden md:inline ${this.currentStep === idx + 1 ? 'text-[#C6A15B] font-semibold' : 'text-[#DCCBB0]/70'}">${step}</span>
              </div>
            `).join('')}
          </div>
          <div class="w-full bg-[#12080B] h-1.5 rounded-full overflow-hidden border border-[#C6A15B]/20">
            <div class="h-full bg-gradient-to-r from-[#C6A15B] to-[#F9E29B] transition-all duration-300" style="width: ${(this.currentStep / this.totalSteps) * 100}%"></div>
          </div>
        </div>

        <!-- Step Content Body -->
        <div id="booking-step-container" class="min-h-[380px]">
          ${this.getStepHtml()}
        </div>

        <!-- Bottom Controls -->
        <div class="flex items-center justify-between border-t border-[#C6A15B]/20 pt-6 mt-8">
          ${this.currentStep > 1 && this.currentStep < 8 ? `
            <button id="booking-prev-btn" class="px-6 py-2.5 rounded-full border border-[#C6A15B]/40 text-[#DCCBB0] hover:bg-[#481C25] text-xs font-semibold uppercase tracking-wider transition-all">
              ← Back
            </button>
          ` : `<div></div>`}

          ${this.currentStep < 7 ? `
            <button id="booking-next-btn" class="px-8 py-2.5 rounded-full bg-gradient-to-r from-[#D9A52D] to-[#C6A15B] text-[#171717] font-serif text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(198,161,91,0.5)] transition-all">
              Continue ➔
            </button>
          ` : this.currentStep === 7 ? `
            <button id="booking-pay-btn" class="px-8 py-3 rounded-full bg-gradient-to-r from-[#D9A52D] via-[#F9E29B] to-[#C6A15B] text-[#171717] font-serif text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_25px_rgba(217,165,45,0.7)] transition-all">
              Authorize & Confirm Booking ➔
            </button>
          ` : `
            <button id="booking-done-btn" class="px-8 py-2.5 rounded-full bg-[#C6A15B] text-[#171717] font-serif text-xs font-bold uppercase tracking-wider hover:bg-[#F9E29B] transition-all">
              Return to Website
            </button>
          `}
        </div>
      </div>
    `;

    this.bindStepEvents();
  }

  getStepHtml() {
    switch (this.currentStep) {
      case 1:
        return this.renderStep1Service();
      case 2:
        return this.renderStep2Package();
      case 3:
        return this.renderStep3Customer();
      case 4:
        return this.renderStep4Property();
      case 5:
        return this.renderStep5Documents();
      case 6:
        return this.renderStep6Appointment();
      case 7:
        return this.renderStep7Payment();
      case 8:
        return this.renderStep8Confirmation();
      default:
        return ``;
    }
  }

  // STEP 1: Select Service
  renderStep1Service() {
    const services = [
      { id: "residential", name: "Home & Villa Vastu", icon: "🏛️", desc: "Independent homes, duplexes, luxury villas & renovations." },
      { id: "flat", name: "Flat & Apartment Vastu", icon: "🏢", desc: "High-rise apartments, penthouses & builder floors." },
      { id: "land", name: "Plot & Land Vastu", icon: "📐", desc: "Residential, commercial & agricultural land pre-purchase due diligence." },
      { id: "office", name: "Office & Corporate Vastu", icon: "💼", desc: "Corporate headquarters, cabins, workstations & cashflow zones." },
      { id: "factory", name: "Factory & Plant Vastu", icon: "🏭", desc: "Manufacturing units, heavy machinery & thermodynamic flow." },
      { id: "commercial", name: "Commercial & Retail Vastu", icon: "🛍️", desc: "Shops, showrooms, restaurants, hotels & hospitals." },
      { id: "planning", name: "CAD Architectural Review", icon: "📋", desc: "Pre-construction blueprint gridding & non-demolition remedies." },
      { id: "other", name: "Custom Consultation", icon: "✨", desc: "Specific geopathic audits, Muhurat selection or special queries." }
    ];

    return `
      <div>
        <h3 class="font-serif text-lg text-[#F9E29B] font-semibold mb-1">Step 1: Choose Your Consultation Category</h3>
        <p class="text-xs text-[#DCCBB0] mb-5">Select the domain of spatial guidance you require:</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          ${services.map(s => `
            <div data-select-service="${s.id}" data-service-name="${s.name}" class="cursor-pointer p-4 rounded-xl border transition-all ${
              this.formData.service === s.id
                ? 'border-[#C6A15B] bg-[#481C25]/80 shadow-[0_0_15px_rgba(198,161,91,0.25)]'
                : 'border-[#C6A15B]/20 bg-[#12080B]/60 hover:border-[#C6A15B]/50'
            }">
              <div class="text-2xl mb-2">${s.icon}</div>
              <h4 class="font-serif text-sm font-bold text-[#F8F3E9] mb-1">${s.name}</h4>
              <p class="text-[11px] text-[#DCCBB0]/80 leading-relaxed">${s.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // STEP 2: Select Package
  renderStep2Package() {
    // Find relevant packages or show standard tiers
    const category = this.formData.service === 'factory' ? 'industrial' :
                     this.formData.service === 'office' ? 'commercial' :
                     this.formData.service === 'land' ? 'land' : 'residential';

    const matchedPackages = VASTU_DATA.packages.filter(p => p.category === category);
    const packagesToShow = matchedPackages.length > 0 ? matchedPackages : VASTU_DATA.packages.slice(0, 3);

    return `
      <div>
        <h3 class="font-serif text-lg text-[#F9E29B] font-semibold mb-1">Step 2: Select Consultation Package</h3>
        <p class="text-xs text-[#DCCBB0] mb-5">Transparent pricing and deliverables tailored for ${this.formData.serviceName}:</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${packagesToShow.map(p => `
            <div data-select-package="${p.id}" data-package-name="${p.name}" data-package-price="${p.price}" class="cursor-pointer p-5 rounded-xl border flex flex-col justify-between transition-all ${
              this.formData.packageId === p.id
                ? 'border-[#C6A15B] bg-[#481C25]/85 shadow-[0_0_20px_rgba(198,161,91,0.3)] ring-1 ring-[#F9E29B]'
                : 'border-[#C6A15B]/25 bg-[#12080B]/60 hover:border-[#C6A15B]/60'
            }">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-[10px] uppercase font-bold tracking-widest text-[#C6A15B] bg-[#C6A15B]/10 px-2 py-0.5 rounded">${p.duration}</span>
                  ${p.popular ? `<span class="text-[10px] font-bold text-[#171717] bg-[#F9E29B] px-2 py-0.5 rounded-full">Recommended</span>` : ''}
                </div>
                <h4 class="font-serif text-base font-bold text-[#F8F3E9] mb-2">${p.name}</h4>
                <div class="text-2xl font-serif font-bold text-[#F9E29B] mb-1">${p.price}</div>
                <p class="text-[11px] text-[#DCCBB0] mb-4">${p.priceNote}</p>

                <div class="w-full h-[1px] bg-[#C6A15B]/20 mb-3"></div>

                <ul class="text-[11px] text-[#F8F3E9]/85 space-y-1.5 mb-4">
                  ${p.deliverables.map(d => `<li class="flex items-start gap-1.5"><span class="text-[#C6A15B]">✓</span> <span>${d}</span></li>`).join('')}
                </ul>
              </div>

              <div class="mt-2 text-center text-xs font-semibold py-2 rounded-lg ${
                this.formData.packageId === p.id ? 'bg-[#C6A15B] text-[#171717]' : 'border border-[#C6A15B]/40 text-[#C6A15B]'
              }">
                ${this.formData.packageId === p.id ? 'Selected Tier ✓' : 'Select Package'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // STEP 3: Customer Information
  renderStep3Customer() {
    return `
      <div>
        <h3 class="font-serif text-lg text-[#F9E29B] font-semibold mb-1">Step 3: Client Contact Details</h3>
        <p class="text-xs text-[#DCCBB0] mb-5">All client consultations and architectural plans are held in strict professional confidentiality.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1">Full Name *</label>
            <input type="text" id="cust-fullname" value="${this.formData.fullName}" placeholder="e.g. Rajesh Malhotra" class="w-full px-4 py-2.5 rounded-lg bg-[#12080B]/80 border border-[#C6A15B]/30 text-sm focus:border-[#C6A15B] outline-none text-[#F8F3E9]" />
          </div>

          <div>
            <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1">Email Address *</label>
            <input type="email" id="cust-email" value="${this.formData.email}" placeholder="e.g. rajesh@example.com" class="w-full px-4 py-2.5 rounded-lg bg-[#12080B]/80 border border-[#C6A15B]/30 text-sm focus:border-[#C6A15B] outline-none text-[#F8F3E9]" />
          </div>

          <div>
            <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1">Mobile Calling Number *</label>
            <input type="tel" id="cust-phone" value="${this.formData.phone}" placeholder="e.g. +91 98765 43210" class="w-full px-4 py-2.5 rounded-lg bg-[#12080B]/80 border border-[#C6A15B]/30 text-sm focus:border-[#C6A15B] outline-none text-[#F8F3E9]" />
          </div>

          <div>
            <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1">WhatsApp Number *</label>
            <input type="tel" id="cust-whatsapp" value="${this.formData.whatsapp}" placeholder="e.g. +91 98765 43210" class="w-full px-4 py-2.5 rounded-lg bg-[#12080B]/80 border border-[#C6A15B]/30 text-sm focus:border-[#C6A15B] outline-none text-[#F8F3E9]" />
          </div>

          <div>
            <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1">City *</label>
            <input type="text" id="cust-city" value="${this.formData.city}" placeholder="e.g. New Delhi / Mumbai / Dubai" class="w-full px-4 py-2.5 rounded-lg bg-[#12080B]/80 border border-[#C6A15B]/30 text-sm focus:border-[#C6A15B] outline-none text-[#F8F3E9]" />
          </div>

          <div>
            <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1">State / Country *</label>
            <input type="text" id="cust-state" value="${this.formData.state}" placeholder="e.g. Delhi NCR / Maharashtra" class="w-full px-4 py-2.5 rounded-lg bg-[#12080B]/80 border border-[#C6A15B]/30 text-sm focus:border-[#C6A15B] outline-none text-[#F8F3E9]" />
          </div>
        </div>
      </div>
    `;
  }

  // STEP 4: Property Information
  renderStep4Property() {
    return `
      <div>
        <h3 class="font-serif text-lg text-[#F9E29B] font-semibold mb-1">Step 4: Property Specifications</h3>
        <p class="text-xs text-[#DCCBB0] mb-5">Provide spatial parameters to help the consultant prepare the directional chart:</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1">Property Type</label>
            <select id="prop-type" class="w-full px-3.5 py-2.5 rounded-lg bg-[#12080B]/80 border border-[#C6A15B]/30 text-sm text-[#F8F3E9] outline-none">
              <option value="Independent House / Kothi">Independent House / Kothi</option>
              <option value="Apartment / High-Rise Flat">Apartment / High-Rise Flat</option>
              <option value="Duplex / Luxury Villa">Duplex / Luxury Villa</option>
              <option value="Residential Plot / Land">Residential Plot / Land</option>
              <option value="Corporate Office">Corporate Office</option>
              <option value="Commercial Showroom / Retail">Commercial Showroom / Retail</option>
              <option value="Manufacturing Plant / Factory">Manufacturing Plant / Factory</option>
              <option value="Warehouse / Logistics Center">Warehouse / Logistics Center</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1">Property Area</label>
            <input type="text" id="prop-area" value="${this.formData.propertyArea}" placeholder="e.g. 2,400 sq.ft / 500 sq.yards" class="w-full px-3.5 py-2.5 rounded-lg bg-[#12080B]/80 border border-[#C6A15B]/30 text-sm text-[#F8F3E9] outline-none" />
          </div>

          <div>
            <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1">Number of Floors</label>
            <select id="prop-floors" class="w-full px-3.5 py-2.5 rounded-lg bg-[#12080B]/80 border border-[#C6A15B]/30 text-sm text-[#F8F3E9] outline-none">
              <option value="1 Floor / Single Level">1 Floor / Single Level</option>
              <option value="2 Floors (G + 1)">2 Floors (G + 1)</option>
              <option value="3 Floors (G + 2)">3 Floors (G + 2)</option>
              <option value="4+ Floors">4+ Floors</option>
              <option value="Basement + Multi-Level">Basement + Multi-Level</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1">Main Entrance Facing (If known)</label>
            <select id="prop-direction" class="w-full px-3.5 py-2.5 rounded-lg bg-[#12080B]/80 border border-[#C6A15B]/30 text-sm text-[#F8F3E9] outline-none">
              <option value="North (Uttara)">North (Uttara)</option>
              <option value="North-East (Ishanya)">North-East (Ishanya)</option>
              <option value="East (Purva)">East (Purva)</option>
              <option value="South-East (Agneya)">South-East (Agneya)</option>
              <option value="South (Dakshina)">South (Dakshina)</option>
              <option value="South-West (Nairrutya)">South-West (Nairrutya)</option>
              <option value="West (Paschima)">West (Paschima)</option>
              <option value="North-West (Vayavya)">North-West (Vayavya)</option>
              <option value="Not Sure / To Be Measured">Not Sure / To Be Measured</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1">Construction Status</label>
            <select id="prop-status" class="w-full px-3.5 py-2.5 rounded-lg bg-[#12080B]/80 border border-[#C6A15B]/30 text-sm text-[#F8F3E9] outline-none">
              <option value="Ready to Move (Existing Dwelling)">Ready to Move (Existing Dwelling)</option>
              <option value="Under Construction">Under Construction</option>
              <option value="Planning / Architectural Stage">Planning / Architectural Stage</option>
              <option value="Pre-Purchase Evaluation">Pre-Purchase Evaluation</option>
              <option value="Renovation & Interior Design">Renovation & Interior Design</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1">Primary Objective / Concerns</label>
          <textarea id="prop-purpose" rows="3" placeholder="Briefly describe what you wish to achieve (e.g. career stability, health harmony, new construction planning, cashflow remedies without demolition)..." class="w-full px-3.5 py-2 rounded-lg bg-[#12080B]/80 border border-[#C6A15B]/30 text-sm text-[#F8F3E9] outline-none">${this.formData.purpose}</textarea>
        </div>
      </div>
    `;
  }

  // STEP 5: Document Upload
  renderStep5Documents() {
    return `
      <div>
        <h3 class="font-serif text-lg text-[#F9E29B] font-semibold mb-1">Step 5: Document & Floor Plan Upload</h3>
        <p class="text-xs text-[#DCCBB0] mb-5">Upload your floor plans, architectural drawings, Google Maps plot location or photos for spatial gridding:</p>

        <!-- Drag & Drop Zone -->
        <div id="drop-zone" class="border-2 border-dashed border-[#C6A15B]/40 hover:border-[#C6A15B] rounded-xl p-8 text-center bg-[#12080B]/50 transition-all cursor-pointer">
          <input type="file" id="file-input" multiple accept=".pdf,.png,.jpg,.jpeg,.dwg,.cad" class="hidden" />
          <div class="text-4xl mb-3">📁</div>
          <h4 class="font-serif text-base text-[#F8F3E9] font-bold mb-1">Drag and drop your drawings & plans here</h4>
          <p class="text-xs text-[#DCCBB0] mb-3">Supports PDF, PNG, JPG, or CAD exports (Max 50MB per file)</p>
          <button type="button" id="browse-btn" class="px-5 py-2 rounded-full border border-[#C6A15B] text-xs font-semibold uppercase text-[#C6A15B] hover:bg-[#C6A15B] hover:text-[#171717] transition-all">
            Browse Files
          </button>
        </div>

        <!-- Uploaded Files List -->
        <div id="uploaded-files-list" class="mt-4 space-y-2">
          ${this.uploadedFiles.length === 0 ? `
            <p class="text-xs text-[#DCCBB0]/70 italic text-center py-2">No documents attached yet. You can also share floor plans later via WhatsApp.</p>
          ` : this.uploadedFiles.map((file, idx) => `
            <div class="flex items-center justify-between p-3 rounded-lg bg-[#12080B] border border-[#C6A15B]/20 text-xs">
              <div class="flex items-center gap-2">
                <span class="text-[#C6A15B]">📄</span>
                <span class="font-medium text-[#F8F3E9]">${file.name}</span>
                <span class="text-[#DCCBB0]/60">(${(file.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button data-remove-file="${idx}" class="text-red-400 hover:text-red-300 font-bold px-2 py-0.5">✕ Remove</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // STEP 6: Appointment Selection
  renderStep6Appointment() {
    return `
      <div>
        <h3 class="font-serif text-lg text-[#F9E29B] font-semibold mb-1">Step 6: Choose Appointment Date & Slot</h3>
        <p class="text-xs text-[#DCCBB0] mb-5">Select your preferred date, consultation mode, and confirmed timing slot:</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-2">Select Date *</label>
            <input type="date" id="appointment-date" value="${this.formData.appointmentDate}" min="${new Date().toISOString().split('T')[0]}" class="w-full px-4 py-2.5 rounded-lg bg-[#12080B]/80 border border-[#C6A15B]/30 text-sm text-[#F8F3E9] outline-none mb-4" />

            <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-2">Consultation Mode *</label>
            <div class="space-y-2">
              ${[
                { id: "Online Video Consultation", desc: "Interactive screen-share over Zoom/Google Meet with blueprint markups." },
                { id: "Phone Consultation", desc: "Detailed telephonic review & audio discussion." },
                { id: "In-Person Office Meeting", desc: "Meet at Vastu Sutram consulting chambers (Gurugram)." },
                { id: "On-Site Visit Request", desc: "Consultant visits your actual site (Pan-India travel applicable)." }
              ].map(mode => `
                <label class="flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                  this.formData.consultationMode === mode.id
                    ? 'border-[#C6A15B] bg-[#481C25]/60 text-[#F8F3E9]'
                    : 'border-[#C6A15B]/15 bg-[#12080B]/50 text-[#DCCBB0]'
                }">
                  <input type="radio" name="consultation-mode" value="${mode.id}" ${this.formData.consultationMode === mode.id ? 'checked' : ''} class="mt-0.5" />
                  <div>
                    <span class="text-xs font-bold block">${mode.id}</span>
                    <span class="text-[10px] text-[#DCCBB0]/80">${mode.desc}</span>
                  </div>
                </label>
              `).join('')}
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-2">Available Time Slots (IST) *</label>
            <div class="grid grid-cols-1 gap-2">
              ${this.availableSlots.map(slot => `
                <div data-select-slot="${slot}" class="cursor-pointer p-3 rounded-lg border text-center transition-all ${
                  this.formData.appointmentTime === slot
                    ? 'border-[#C6A15B] bg-[#C6A15B] text-[#171717] font-bold shadow-md'
                    : 'border-[#C6A15B]/20 bg-[#12080B]/60 text-[#F8F3E9] hover:border-[#C6A15B]/60'
                }">
                  <span class="text-xs font-mono">${slot}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // STEP 7: Payment
  renderStep7Payment() {
    return `
      <div>
        <h3 class="font-serif text-lg text-[#F9E29B] font-semibold mb-1">Step 7: Payment & Fee Authorization</h3>
        <p class="text-xs text-[#DCCBB0] mb-5">Review your booking summary and select your payment preference:</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Summary Box -->
          <div class="p-5 rounded-xl bg-[#12080B] border border-[#C6A15B]/30 space-y-3">
            <h4 class="font-serif text-sm font-bold text-[#C6A15B] uppercase tracking-wider border-b border-[#C6A15B]/20 pb-2">Consultation Summary</h4>
            <div class="flex justify-between text-xs">
              <span class="text-[#DCCBB0]">Selected Package:</span>
              <span class="font-semibold text-[#F8F3E9]">${this.formData.packageName}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-[#DCCBB0]">Service Category:</span>
              <span class="font-semibold text-[#F8F3E9]">${this.formData.serviceName}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-[#DCCBB0]">Appointment Schedule:</span>
              <span class="font-semibold text-[#F8F3E9]">${this.formData.appointmentDate} @ ${this.formData.appointmentTime}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-[#DCCBB0]">Consultation Mode:</span>
              <span class="font-semibold text-[#F8F3E9]">${this.formData.consultationMode}</span>
            </div>
            <div class="w-full h-[1px] bg-[#C6A15B]/20"></div>
            <div class="flex justify-between text-sm font-serif">
              <span class="text-[#F9E29B] font-bold">Total Payable:</span>
              <span class="text-xl font-bold text-[#F9E29B]">${this.formData.amount}</span>
            </div>
          </div>

          <!-- Payment Options -->
          <div class="space-y-3">
            <h4 class="font-serif text-sm font-bold text-[#C6A15B] uppercase tracking-wider">Select Payment Channel</h4>
            ${[
              { id: "UPI / Razorpay", title: "UPI (Google Pay, PhonePe, Paytm, BHIM)", icon: "📱", badge: "Instant Confirmation" },
              { id: "Credit / Debit Card", title: "Credit / Debit Card (Visa, MasterCard, RuPay)", icon: "💳", badge: "Secure 256-Bit SSL" },
              { id: "Net Banking", title: "Net Banking (All Major Indian & Global Banks)", icon: "🏦", badge: "Direct Transfer" }
            ].map(pm => `
              <label class="flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                this.formData.paymentMethod === pm.id
                  ? 'border-[#C6A15B] bg-[#481C25]/80 text-[#F8F3E9]'
                  : 'border-[#C6A15B]/20 bg-[#12080B]/60 text-[#DCCBB0]'
              }">
                <div class="flex items-center gap-3">
                  <input type="radio" name="payment-method" value="${pm.id}" ${this.formData.paymentMethod === pm.id ? 'checked' : ''} />
                  <div>
                    <span class="text-xs font-bold block">${pm.icon} ${pm.title}</span>
                    <span class="text-[10px] text-[#C6A15B]">${pm.badge}</span>
                  </div>
                </div>
              </label>
            `).join('')}

            <div class="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200">
              🔒 <strong>Sandbox & Production Ready:</strong> In test mode, clicking Authorize will instantly simulate a verified banking transaction and record your appointment in the database.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // STEP 8: Confirmation Screen
  renderStep8Confirmation() {
    return `
      <div class="text-center py-6">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-900/60 border-2 border-emerald-500 flex items-center justify-center text-3xl text-emerald-400">
          ✓
        </div>

        <h3 class="font-serif text-2xl md:text-3xl text-[#F9E29B] font-bold mb-2">Your Vastu Consultation Request Has Been Received!</h3>
        <p class="text-xs md:text-sm text-[#DCCBB0] max-w-lg mx-auto mb-6">
          Thank you, <strong class="text-[#F8F3E9]">${this.formData.fullName}</strong>. Your consultation docket has been safely registered in our priority appointment ledger.
        </p>

        <!-- Booking Voucher Card -->
        <div class="max-w-xl mx-auto p-6 rounded-xl bg-[#12080B] border border-[#C6A15B]/40 text-left mb-6 shadow-2xl relative overflow-hidden" id="booking-receipt-print">
          <div class="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-[#C6A15B]/10 blur-xl pointer-events-none"></div>

          <div class="flex items-center justify-between border-b border-[#C6A15B]/20 pb-4 mb-4">
            <div>
              <span class="text-[10px] text-[#C6A15B] uppercase tracking-widest font-bold">Booking Reference ID</span>
              <div class="font-mono text-xl font-bold text-[#F9E29B] tracking-wider">${this.formData.bookingId}</div>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              ${this.formData.paymentStatus}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3 text-xs mb-4">
            <div>
              <span class="text-[#DCCBB0] block text-[11px]">Selected Package</span>
              <span class="font-semibold text-[#F8F3E9]">${this.formData.packageName}</span>
            </div>
            <div>
              <span class="text-[#DCCBB0] block text-[11px]">Appointment Schedule</span>
              <span class="font-semibold text-[#F8F3E9]">${this.formData.appointmentDate} @ ${this.formData.appointmentTime}</span>
            </div>
            <div>
              <span class="text-[#DCCBB0] block text-[11px]">Mode</span>
              <span class="font-semibold text-[#F8F3E9]">${this.formData.consultationMode}</span>
            </div>
            <div>
              <span class="text-[#DCCBB0] block text-[11px]">Total Fee Paid</span>
              <span class="font-semibold text-[#F9E29B]">${this.formData.amount}</span>
            </div>
          </div>

          <div class="text-[11px] text-[#DCCBB0]/90 p-3 rounded bg-[#481C25]/40 border border-[#C6A15B]/20">
            <strong>Next Steps:</strong> An automated confirmation docket along with the video meeting link has been prepared. Our senior consulting assistant will connect with you on WhatsApp (<span class="text-[#F8F3E9] font-medium">${this.formData.whatsapp}</span>) 24 hours prior to the session.
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-3">
          <button id="btn-print-receipt" class="px-5 py-2.5 rounded-full border border-[#C6A15B] text-xs font-semibold text-[#C6A15B] hover:bg-[#C6A15B] hover:text-[#171717] transition-all">
            🖨️ Download / Print Receipt
          </button>
          <a id="btn-whatsapp-confirm" href="https://wa.me/919876543210?text=${encodeURIComponent(`Hello Vastu Sutram, I have confirmed consultation booking ${this.formData.bookingId} for ${this.formData.packageName} on ${this.formData.appointmentDate}.`)}" target="_blank" class="px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-all flex items-center gap-2">
            <span>💬</span> Send WhatsApp Notification
          </a>
        </div>
      </div>
    `;
  }

  bindStepEvents() {
    // Close Modal
    const closeBtn = document.getElementById('booking-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (window.VastuApp && window.VastuApp.closeBookingModal) {
          window.VastuApp.closeBookingModal();
        }
      });
    }

    // Step 1: Select Service
    document.querySelectorAll('[data-select-service]').forEach(card => {
      card.addEventListener('click', (e) => {
        this.formData.service = e.currentTarget.getAttribute('data-select-service');
        this.formData.serviceName = e.currentTarget.getAttribute('data-service-name');
        this.render();
      });
    });

    // Step 2: Select Package
    document.querySelectorAll('[data-select-package]').forEach(card => {
      card.addEventListener('click', (e) => {
        this.formData.packageId = e.currentTarget.getAttribute('data-select-package');
        this.formData.packageName = e.currentTarget.getAttribute('data-package-name');
        this.formData.amount = e.currentTarget.getAttribute('data-package-price');
        this.render();
      });
    });

    // Step 5: File Upload & Drag-and-Drop
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');

    if (dropZone && fileInput) {
      browseBtn.addEventListener('click', () => fileInput.click());
      dropZone.addEventListener('click', (e) => {
        if (e.target !== browseBtn) fileInput.click();
      });

      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('border-[#F9E29B]', 'bg-[#481C25]/40');
      });

      dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('border-[#F9E29B]', 'bg-[#481C25]/40');
      });

      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-[#F9E29B]', 'bg-[#481C25]/40');
        if (e.dataTransfer.files) {
          this.handleFileUpload(e.dataTransfer.files);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files) {
          this.handleFileUpload(e.target.files);
        }
      });
    }

    // Remove File
    document.querySelectorAll('[data-remove-file]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-remove-file'));
        this.uploadedFiles.splice(idx, 1);
        this.formData.documents = this.uploadedFiles.map(f => f.name);
        this.render();
      });
    });

    // Step 6: Select Slot
    document.querySelectorAll('[data-select-slot]').forEach(card => {
      card.addEventListener('click', (e) => {
        this.formData.appointmentTime = e.currentTarget.getAttribute('data-select-slot');
        this.render();
      });
    });

    // Step 6: Consultation Mode Radio
    document.querySelectorAll('input[name="consultation-mode"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.formData.consultationMode = e.target.value;
      });
    });

    // Step 7: Payment Method Radio
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.formData.paymentMethod = e.target.value;
      });
    });

    // Prev Button
    const prevBtn = document.getElementById('booking-prev-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentStep > 1) {
          this.currentStep--;
          this.render();
        }
      });
    }

    // Next Button
    const nextBtn = document.getElementById('booking-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.validateCurrentStep()) {
          this.currentStep++;
          this.render();
        }
      });
    }

    // Pay Button (Step 7)
    const payBtn = document.getElementById('booking-pay-btn');
    if (payBtn) {
      payBtn.addEventListener('click', () => this.executeBooking());
    }

    // Done Button (Step 8)
    const doneBtn = document.getElementById('booking-done-btn');
    if (doneBtn) {
      doneBtn.addEventListener('click', () => {
        if (window.VastuApp && window.VastuApp.closeBookingModal) {
          window.VastuApp.closeBookingModal();
        }
      });
    }

    // Print Receipt
    const printBtn = document.getElementById('btn-print-receipt');
    if (printBtn) {
      printBtn.addEventListener('click', () => window.print());
    }
  }

  async handleFileUpload(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target.result;
        this.uploadedFiles.push({ name: file.name, size: file.size });
        this.formData.documents.push(file.name);

        // Upload to server
        try {
          await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: file.name, fileData: base64Data })
          });
        } catch (err) {
          console.warn('File local preview stored:', err);
        }
        this.render();
      };
      reader.readAsDataURL(file);
    }
  }

  validateCurrentStep() {
    if (this.currentStep === 3) {
      const name = document.getElementById('cust-fullname');
      const email = document.getElementById('cust-email');
      const phone = document.getElementById('cust-phone');
      const whatsapp = document.getElementById('cust-whatsapp');
      const city = document.getElementById('cust-city');
      const state = document.getElementById('cust-state');

      if (!name || !name.value.trim()) {
        alert('Please enter your Full Name.');
        return false;
      }
      if (!email || !email.value.includes('@')) {
        alert('Please enter a valid Email address.');
        return false;
      }
      if (!phone || phone.value.trim().length < 8) {
        alert('Please enter a valid Phone Number.');
        return false;
      }

      this.formData.fullName = name.value.trim();
      this.formData.email = email.value.trim();
      this.formData.phone = phone.value.trim();
      this.formData.whatsapp = (whatsapp && whatsapp.value.trim()) || this.formData.phone;
      this.formData.city = (city && city.value.trim()) || 'Not Specified';
      this.formData.state = (state && state.value.trim()) || 'India';
    }

    if (this.currentStep === 4) {
      const type = document.getElementById('prop-type');
      const area = document.getElementById('prop-area');
      const floors = document.getElementById('prop-floors');
      const dir = document.getElementById('prop-direction');
      const status = document.getElementById('prop-status');
      const purp = document.getElementById('prop-purpose');

      if (type) this.formData.propertyType = type.value;
      if (area) this.formData.propertyArea = area.value;
      if (floors) this.formData.floors = floors.value;
      if (dir) this.formData.direction = dir.value;
      if (status) this.formData.constructionStatus = status.value;
      if (purp) this.formData.purpose = purp.value;
    }

    if (this.currentStep === 6) {
      const dateEl = document.getElementById('appointment-date');
      if (dateEl && dateEl.value) {
        this.formData.appointmentDate = dateEl.value;
      }
    }

    return true;
  }

  async executeBooking() {
    // Generate Reference ID: VS-2026-XXXX
    const refCode = `VS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    this.formData.bookingId = refCode;
    this.formData.createdAt = new Date().toISOString();
    this.formData.status = "Confirmed";

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.formData)
      });
      if (res.ok) {
        console.log('Booking successfully committed to database');
      }
    } catch (err) {
      console.warn('Booking saved locally:', err);
    }

    // Save copy in localStorage for client persistence
    const localBookings = JSON.parse(localStorage.getItem('vastu_bookings') || '[]');
    localBookings.unshift(this.formData);
    localStorage.setItem('vastu_bookings', JSON.stringify(localBookings));

    // Advance to confirmation screen
    this.currentStep = 8;
    this.render();
  }
}

window.VastuBookingSystem = VastuBookingSystem;
