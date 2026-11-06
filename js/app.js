/**
 * VASTU SUTRAM – Master Application Core
 */

class VastuApp {
  constructor() {
    this.currentServiceTab = 'featured12';
    this.currentPackageTab = 'residential';
    this.currentGalleryFilter = 'all';
    this.currentArticleFilter = 'all';
    this.currentPanchabhuta = 'prithvi';
    this.knowledgeTab = 'chakra';
    this.testimonialIndex = 0;

    this.init();
  }

  async init() {
    this.initIntro();
    this.initNavbar();
    this.initHeroCanvas();
    this.renderPanchabhutas();
    this.renderConsultant();
    this.renderServices();
    this.initKnowledgeExplorer();
    this.renderPackages();
    this.renderGallery();
    this.renderInstagram();
    this.renderTestimonials();
    this.renderArticles();
    this.initWhatsAppBookingForm();
    this.initContactForm();
    this.initRazorpayPayment();
    this.initFloatingElements();
    this.initModals();
    this.bindGlobalEvents();
  }

  // 1. CINEMATIC INTRO & HERO REVEAL
  initIntro() {
    this.setupHeroLetters();

    const introContainer = document.getElementById('cinematic-intro-wrapper');
    if (!introContainer) {
      this.playHeroReveal();
      return;
    }

    if (window.VastuCinematicIntro) {
      this.introInstance = new VastuCinematicIntro('cinematic-intro-wrapper');
    } else {
      introContainer.style.display = 'none';
      this.playHeroReveal();
    }
  }

  setupHeroLetters() {
    const heroPrinciples = document.getElementById('hero-principles-text');
    if (!heroPrinciples || heroPrinciples.dataset.splitDone === 'true') return;
    const text = heroPrinciples.textContent.trim();
    heroPrinciples.innerHTML = text.split('').map(ch => {
      if (ch === ' ') return `<span class="inline">&nbsp;</span>`;
      return `<span class="hero-principle-char inline">${ch}</span>`;
    }).join('');
    heroPrinciples.dataset.splitDone = 'true';
  }

  playHeroReveal() {
    this.setupHeroLetters();
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !window.gsap) return;

    const logo = document.getElementById('hero-logo-wrap');
    const brandName = document.getElementById('hero-brand-name');
    const tagline = document.getElementById('hero-tagline');
    const chars = document.querySelectorAll('.hero-principle-char');
    const line = document.getElementById('hero-principles-line');
    const diamond = document.getElementById('hero-principles-diamond');
    const btnExplore = document.getElementById('hero-btn-explore');
    const btnBook = document.getElementById('hero-btn-book');

    const tl = window.gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (logo) tl.fromTo(logo, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.3 }, 0);
    if (brandName) tl.fromTo(brandName, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1.0 }, 0.35);
    if (tagline) tl.fromTo(tagline, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.95 }, 0.7);
    if (chars.length) {
      tl.fromTo(chars, { opacity: 0 }, { opacity: 1, duration: 0.45, stagger: 0.025, ease: 'power2.out' }, 1.0);
    }
    if (line) tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.75, ease: 'power2.inOut' }, 1.25);
    if (diamond) tl.fromTo(diamond, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.5);
    if (btnExplore && btnBook) {
      tl.fromTo([btnExplore, btnBook], { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.85, stagger: 0.14 }, 1.45);
    }
  }

  replayIntro() {
    const introContainer = document.getElementById('cinematic-intro-wrapper');
    if (!introContainer) return;
    if (this.introInstance && typeof this.introInstance.finishIntro === 'function') {
      this.introInstance.stopAmbientAudio();
      if (this.introInstance.timeline) this.introInstance.timeline.kill();
      if (this.introInstance.animFrameId) cancelAnimationFrame(this.introInstance.animFrameId);
      if (this.introInstance.renderer) this.introInstance.renderer.dispose();
    }
    introContainer.style.display = 'block';
    introContainer.style.opacity = '1';
    introContainer.style.transform = 'scale(1)';
    introContainer.style.pointerEvents = 'auto';

    if (window.VastuCinematicIntro) {
      this.introInstance = new VastuCinematicIntro('cinematic-intro-wrapper');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 2. NAVBAR & SCROLL
  initNavbar() {
    const navbar = document.getElementById('main-navbar');
    const scrollBar = document.getElementById('scroll-progress-bar');
    const backToTopBtn = document.getElementById('back-to-top-btn');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPct = (scrollY / docHeight) * 100;

      if (scrollBar) {
        scrollBar.style.width = `${scrollPct}%`;
      }

      if (navbar) {
        if (scrollY > 50) {
          navbar.classList.add('bg-[#171717]/95', 'backdrop-blur-md', 'shadow-xl', 'border-b', 'border-[#C6A15B]/30');
          navbar.classList.remove('bg-transparent');
        } else {
          navbar.classList.remove('bg-[#171717]/95', 'shadow-xl', 'border-b', 'border-[#C6A15B]/30');
          navbar.classList.add('bg-transparent');
        }
      }

      if (backToTopBtn) {
        if (scrollY > 400) {
          backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
          backToTopBtn.classList.add('opacity-100');
        } else {
          backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
          backToTopBtn.classList.remove('opacity-100');
        }
      }
    });

    // Mobile Hamburger
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-drawer');
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
      // Close on link click
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
      });
    }

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // 3. HERO CANVAS BACKGROUND
  initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    });

    // Subtle, peaceful golden dust particles
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particles = [];
    const particleCount = width > 768 ? 34 : 20;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.6,
        vx: (Math.random() - 0.5) * 0.16,
        vy: -(Math.random() * 0.24 + 0.06),
        alpha: Math.random() * 0.45 + 0.15,
        pulse: Math.random() * 0.015
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Draw Floating Gold Particles
      particles.forEach(p => {
        if (!reducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha += Math.sin(Date.now() * p.pulse) * 0.003;
        }

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 226, 155, ${Math.max(0.1, Math.min(0.6, p.alpha))})`;
        ctx.shadowColor = '#C6A15B';
        ctx.shadowBlur = 6;
        ctx.fill();
      });

      if (!reducedMotion) {
        requestAnimationFrame(render);
      }
    }

    render();
  }

  // 4. PANCHABHUTAS (FIVE ELEMENTS)
  renderPanchabhutas() {
    const gridEl = document.getElementById('panchabhutas-grid');
    if (gridEl && VASTU_DATA.panchabhutas) {
      gridEl.innerHTML = VASTU_DATA.panchabhutas
        .map(
          (p) => `
        <div class="p-6 rounded-2xl bg-gradient-to-b from-[#1E1015]/90 to-[#140B0E]/95 border border-[#C6A15B]/30 hover:border-[#F9E29B]/75 transition-all duration-300 shadow-xl flex flex-col justify-between group hover:-translate-y-1.5">
          <div>
            <div class="flex items-center justify-between text-[10px] uppercase tracking-widest text-[#C6A15B] font-bold mb-2">
              <span>${p.direction}</span>
              <span class="px-2 py-0.5 rounded-full bg-[#481C25]/80 text-[#F9E29B] border border-[#C6A15B]/30">${p.symbol.split('/')[0].trim()}</span>
            </div>
            <h3 class="font-serif text-lg font-bold text-[#F8F3E9] group-hover:text-[#F9E29B] transition-colors mb-2">${p.name}</h3>
            <p class="text-xs text-[#DCCBB0] font-light leading-relaxed mb-4">${p.description}</p>
          </div>
          <div class="pt-3 border-t border-[#C6A15B]/20 text-[11px] text-[#EADCC9]/90">
            <strong class="text-[#C6A15B] uppercase tracking-wider text-[10px] block mb-0.5">Resonance:</strong>
            <span>${p.energy}</span>
          </div>
        </div>
      `
        )
        .join('');
    }

    const listContainer = document.getElementById('panchabhuta-list');
    const displayContainer = document.getElementById('panchabhuta-display');
    if (!listContainer || !displayContainer) return;

    listContainer.innerHTML = VASTU_DATA.panchabhutas.map(p => `
      <button data-select-panchabhuta="${p.id}" class="w-full text-left p-4 rounded-xl border transition-all ${
        this.currentPanchabhuta === p.id
          ? 'border-[#C6A15B] bg-[#481C25]/80 shadow-[0_0_15px_rgba(198,161,91,0.25)] ring-1 ring-[#F9E29B]'
          : 'border-[#C6A15B]/20 bg-[#12080B]/60 hover:border-[#C6A15B]/50'
      }">
        <div class="flex items-center justify-between mb-1">
          <span class="font-serif text-base font-bold text-[#F8F3E9]">${p.name}</span>
          <span class="text-xs text-[#C6A15B] font-mono">${p.symbol}</span>
        </div>
        <div class="text-xs text-[#DCCBB0] font-medium">${p.direction}</div>
      </button>
    `).join('');

    const active = VASTU_DATA.panchabhutas.find(p => p.id === this.currentPanchabhuta) || VASTU_DATA.panchabhutas[0];

    displayContainer.innerHTML = `
      <div class="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#171717] via-[#241016] to-[#12080B] border border-[#C6A15B]/30 shadow-2xl relative overflow-hidden">
        <div class="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#C6A15B]/10 blur-3xl pointer-events-none"></div>

        <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-[#C6A15B]/20 pb-4 mb-6 gap-2">
          <div>
            <span class="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">Vedic Element Analysis</span>
            <h3 class="font-serif text-2xl md:text-3xl text-[#F9E29B] font-bold mt-1">${active.name}</h3>
          </div>
          <span class="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#481C25] text-[#F9E29B] border border-[#C6A15B]/40">
            ${active.direction}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs">
          <div class="p-4 rounded-xl bg-[#12080B]/60 border border-[#C6A15B]/15">
            <span class="text-[#DCCBB0] block font-light mb-0.5">Energy Essence</span>
            <span class="text-[#F8F3E9] font-bold text-sm">${active.energy}</span>
          </div>
          <div class="p-4 rounded-xl bg-[#12080B]/60 border border-[#C6A15B]/15">
            <span class="text-[#DCCBB0] block font-light mb-0.5">Resonant Colors & Geometry</span>
            <span class="text-[#C6A15B] font-bold text-sm">${active.color} • ${active.symbol}</span>
          </div>
        </div>

        <p class="text-sm text-[#DCCBB0] leading-relaxed mb-6 font-light">
          ${active.description}
        </p>

        <div class="p-5 rounded-xl bg-[#481C25]/40 border border-[#C6A15B]/25">
          <h4 class="font-serif text-xs uppercase tracking-widest text-[#F9E29B] font-bold mb-3">Traditional Spatial Principles & Remedies</h4>
          <ul class="space-y-2 text-xs text-[#F8F3E9]/90">
            ${active.guidelines.map(g => `<li class="flex items-start gap-2"><span class="text-[#C6A15B]">✦</span> <span>${g}</span></li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    // Bind click events on buttons
    listContainer.querySelectorAll('[data-select-panchabhuta]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentPanchabhuta = e.currentTarget.getAttribute('data-select-panchabhuta');
        this.renderPanchabhutas();
      });
    });
  }

  // 5. MEET THE CONSULTANT
  renderConsultant() {
    const c = VASTU_DATA.consultant;
    const nameEl = document.getElementById('consultant-name');
    const desigEl = document.getElementById('consultant-designation');
    const introEl = document.getElementById('consultant-intro');
    const photoEl = document.getElementById('consultant-photo');
    const expEl = document.getElementById('consultant-experience');
    const qualEl = document.getElementById('consultant-qualifications');
    const philEl = document.getElementById('consultant-philosophy');
    const journeyEl = document.getElementById('consultant-journey');
    const areasEl = document.getElementById('consultant-areas');

    if (nameEl) nameEl.textContent = c.name;
    if (desigEl) desigEl.textContent = c.designation;
    if (introEl) introEl.textContent = c.introduction;
    if (photoEl) photoEl.src = c.photo;
    if (expEl) expEl.textContent = c.experience;
    if (qualEl) qualEl.textContent = c.qualifications;
    if (philEl) philEl.textContent = c.philosophy;
    if (journeyEl) journeyEl.textContent = c.journey;

    if (areasEl) {
      areasEl.innerHTML = c.areasOfExpertise.map(area => `
        <div class="flex items-center gap-2 text-xs text-[#F8F3E9] p-2.5 rounded-lg bg-[#12080B]/60 border border-[#C6A15B]/20">
          <span class="text-[#C6A15B]">✓</span>
          <span>${area}</span>
        </div>
      `).join('');
    }
  }

  // 6. VASTU KNOWLEDGE & ARCHITECTURAL SERVICES DIRECTORY
  getFeatured12KnowledgeCards() {
    return [
      {
        id: 'res-independent-house',
        name: 'Independent House Vastu',
        zoneBadge: '16-Zone Estate Balance',
        directionFocus: 'North-East Courtyard & South-West Plinth',
        consultationType: 'Residential Vastu Consultation',
        propertyType: 'Independent Villa / Bungalow',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'Complete Vedic spatial blueprint auditing for standalone bungalows, kothis, and private estates—harmonizing boundary walls, central courtyards, and underground water reservoirs.',
        introduction: 'Independent residences interact directly with terrestrial geomagnetic currents, solar trajectories, and surrounding road thrusts (Veedhi Shoola). Proper alignment between the outer compound wall and inner plinth creates a peaceful family sanctuary.',
        directionalConsiderations: 'Keep the North and North-East (Ishanya) zones lowest, open, and uncluttered with lawns or underground water reservoirs. Anchor the South-West (Nairrutya) with the highest structural elevation and master suite.',
        traditionalPrinciples: 'Classical Sthapatya Veda and Manasara prescribe the 81-Pada Paramasayika Mandala for standalone homes, preserving an unencumbered central Brahmasthan and selecting auspicious entrance gates (E3 Jayanta, E4 Indra, N3 Mukhya, N4 Bhallata).',
        practicalPlanning: 'Coordinate borewell location, septic tank separation (North-West/South-East sub-zones), clockwise staircase orientation, and slope gradients prior to landscaping.',
        commonMistakes: 'Placing underground water sumps or deep swimming pools in the South-West, building heavy staircases in the North-East, or blocking the main entrance with pillars or large trees.',
        deliverables: ['Full 16-Zone Blueprint Gridding', '32-Gate Entrance Mapping', 'Compound Wall & Slope Audit', 'Non-Demolition Elemental Remedies']
      },
      {
        id: 'res-flats-apartments',
        name: 'Flats and Apartments Vastu',
        zoneBadge: 'High-Rise Prana Optimization',
        directionFocus: 'Main Entrance & Elemental Micro-Zoning',
        consultationType: 'Residential Vastu Consultation',
        propertyType: 'Apartment / Flat',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'Specialized high-rise apartment Vastu evaluation addressing fixed entrances, shared utility shafts, and multi-floor layouts using 100% non-demolition elemental balancing.',
        introduction: 'Modern high-rise apartments have fixed structural columns, pre-allocated plumbing shafts, and shared corridors. Vastu Sutram applies micro-mandala gridding to harmonize your individual unit without moving walls.',
        directionalConsiderations: 'Evaluate the angular degree of the apartment main door from the geometric center (Brahmasthan) of the flat, alongside balcony orientations receiving morning eastern or northern light.',
        traditionalPrinciples: 'Applies Padavinyasa micro-zoning and Panchabhuta Shodhana (five-element balancing) so that internal fire, water, and earth zones operate in equilibrium regardless of floor height.',
        practicalPlanning: 'Optimize bed headboards, cooktop orientation, study desk direction, color palettes, and metallic threshold strips to neutralize unfavourable door or toilet locations.',
        commonMistakes: 'Purchasing L-shaped flats with missing North-East or South-West corners, placing mirrors directly opposite the main entrance or bed, and cluttering the central living foyer.',
        deliverables: ['Apartment 16-Zone Degree Overlay', 'Main Door Energy Correction Strips', 'Bed & Cooktop Orientation Plan', 'Room-by-Room Color Resonance Chart']
      },
      {
        id: 'res-new-construction',
        name: 'New Home Construction Planning',
        zoneBadge: 'Groundbreaking to Griha Pravesh',
        directionFocus: 'Ayadi Proportions & 81-Pada Grid',
        consultationType: 'Vastu Mapping',
        propertyType: 'Under-Construction Site',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'End-to-end collaborative architectural planning from Bhumi Pujan and foundation excavation to structural column alignment, doorframe installation, and Griha Pravesh.',
        introduction: 'Designing a home from the blueprint stage allows 100% Vastu precision before a single brick is laid—eliminating future remedial expenses while blending seamlessly with luxury contemporary architecture.',
        directionalConsiderations: 'Align the building footprint squarely with cardinal axes, establish higher floor levels in the South and West, and channel rainwater and drainage toward the North or East.',
        traditionalPrinciples: 'Incorporates Shanku Sthapana directional calibration and classical Ayadi Shadvarga room-proportion formulas (Aaya, Vyaya, Yoni, Nakshatra) tailored to the homeowner.',
        practicalPlanning: 'Work directly with your architect and structural engineer to position load-bearing columns outside the sensitive Brahmasthan core and align doors with auspicious pada gates.',
        commonMistakes: 'Digging the basement or foundation pit in the South-West first instead of the North-East, or placing heavy structural beams directly over beds, altars, and dining tables.',
        deliverables: ['Architect Blueprint Collaboration', '4-Stage Construction Muhurta Guide', 'Column & Beam Alignment Check', 'Custom Ayadi Room Dimension Chart']
      },
      {
        id: 'res-existing-homes',
        name: 'Existing Homes (Zero Demolition)',
        zoneBadge: '100% Non-Demolition Protocol',
        directionFocus: 'Elemental Metal & Crystal Balancing',
        consultationType: 'Residential Vastu Consultation',
        propertyType: 'Independent Villa / Bungalow',
        image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'Scientific energy harmonization for lived-in homes using elemental metal strips, natural minerals, sacred geometry yantras, and directional color therapy without breaking a single tile.',
        introduction: 'When a family is already living in a finished residence, structural demolition is disruptive and unnecessary. Our signature Zero-Demolition Protocol rectifies directional imbalances discreetly and elegantly.',
        directionalConsiderations: 'Identify elemental clashes—such as fire in a water zone (kitchen in North-East) or water disposal in an earth zone (toilet in South-West)—using precision degree mapping.',
        traditionalPrinciples: 'Rooted in Panchabhuta Tattva Shodhana: utilizing specific conductive metals (copper for Agni, brass for Prithvi, stainless steel for Vayu, aluminium/lead for Rahu/Nirriti) to arrest energy leakage.',
        practicalPlanning: 'Install flush floor or threshold metal strips, adjust furniture orientations, calibrate lighting spectrums, and place natural earth crystals in weak quadrants.',
        commonMistakes: 'Hanging unverified superstitions or generic trinkets without calculating the exact 16-zone angular degree chart from the home center.',
        deliverables: ['Precision 16-Zone Diagnostic Scan', 'Flush Metal Strip Installation Map', 'Elemental Color & Lighting Schedule', 'Post-Remedy Follow-Up Review']
      },
      {
        id: 'res-duplex-villas',
        name: 'Duplex and Luxury Villas',
        zoneBadge: 'Multi-Level Spatial Equilibrium',
        directionFocus: 'Vertical Prana Axis & Staircase Flow',
        consultationType: 'Residential Vastu Consultation',
        propertyType: 'Independent Villa / Bungalow',
        image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'Multi-floor architectural Vastu balancing for duplexes, triplexes, and luxury estates—harmonizing internal staircases, double-height sky atriums, rooftop terraces, and pools.',
        introduction: 'Duplexes and luxury villas feature complex vertical circulation, double-height lounges, home theaters, and landscaped pools that require coordinated floor-to-floor energetic alignment.',
        directionalConsiderations: 'Place double-height skylights or open terraces in the North, East, or central Brahmasthan while keeping upper-floor bedrooms and entertainment lounges anchored in the South and West.',
        traditionalPrinciples: 'Maintains uninterrupted vertical prana continuity across stacked floor plates and ensures internal staircases ascend clockwise in the South, West, or South-West zones.',
        practicalPlanning: 'Audit swimming pool placement (ideal in North/North-East), home elevator shafts, basement entertainment zones, and staff quarters.',
        commonMistakes: 'Locating upper-floor toilets directly above the ground-floor Pooja room or kitchen cooktop, or building open North-facing terraces that are higher than the South roof.',
        deliverables: ['Multi-Floor Stacked CAD Audit', 'Clockwise Staircase & Lift Balancing', 'Swimming Pool & Landscape Zoning', 'Terrace & Skylight Prana Plan']
      },
      {
        id: 'res-bedroom',
        name: 'Bedroom Vastu',
        zoneBadge: 'Restorative Sleep & Harmony',
        directionFocus: 'South-West Master Suite & Headboard Axis',
        consultationType: 'Residential Vastu Consultation',
        propertyType: 'Apartment / Flat',
        image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'Optimizing master, children, and guest bedrooms—aligning bed headboards, wardrobes, dressing mirrors, and soothing color palettes for deep restorative sleep and marital harmony.',
        introduction: 'We spend a third of our lives sleeping. Bedroom Vastu aligns the human bio-magnetic field with Earth’s geomagnetic axis to promote cardiovascular calm, emotional stability, and restful sleep.',
        directionalConsiderations: 'The South-West (Nairrutya) is ideal for the Master Bedroom of the head of the family; South/West suits adult family members; East/North-West suits children and guest rooms.',
        traditionalPrinciples: 'Sleeping with the head toward the South or East harmonizes blood circulation with Earth’s magnetic polarity, whereas sleeping with the head due North induces restlessness.',
        practicalPlanning: 'Position the bed against a solid South or West wall with an unobstructed view of the door, place heavy wardrobes along South/West walls, and keep dressing mirrors out of direct bed sightlines.',
        commonMistakes: 'Sleeping directly underneath exposed structural ceiling beams, placing an en-suite bathroom door directly facing the pillow, or keeping high-EMF screens and water features near the headboard.',
        deliverables: ['Headboard Polarity Alignment', 'Wardrobe & Mirror Placement Plan', 'En-Suite Toilet Door Neutralization', 'Calming Elemental Palette Guide']
      },
      {
        id: 'res-kitchen',
        name: 'Kitchen Vastu',
        zoneBadge: 'Agneya Culinary Vitality',
        directionFocus: 'South-East (Agni) & Cooktop-Sink Balance',
        consultationType: 'Residential Vastu Consultation',
        propertyType: 'Apartment / Flat',
        image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'Harmonizing the sacred Agni (Fire) zone—optimizing stove placement, water sink separation, refrigerator positioning, grain storage, and countertop colors for health and financial liquidity.',
        introduction: 'In Vedic architecture, the kitchen is the powerhouse of Agni (digestive fire, immunity, and cash flow). Harmonizing fire and water appliances within the kitchen directly nurtures family health.',
        directionalConsiderations: 'South-East (Agneya) is the primary zone for the kitchen, with North-West (Vayavya) as the secondary permissive zone. The person cooking should ideally face East.',
        traditionalPrinciples: 'Maintains strict elemental separation between Agni (cooktop, oven, microwave) in the South-East quadrant and Jal (sink, RO water purifier) toward the North-East of the kitchen.',
        practicalPlanning: 'Store heavy food grains and pantry provisions along the South or West cabinets, and choose warm ivory, terracotta, olive green, or champagne-toned countertops rather than jet black in wrong zones.',
        commonMistakes: 'Locating the kitchen in the North-East (Ishanya) or South-West (Nairrutya) zone, or placing the gas burner and water sink adjacent on the same platform without an elemental buffer.',
        deliverables: ['Cooktop & Sink Separation Blueprint', 'Appliance & Refrigerator Zoning', 'Countertop Slab Color Guidance', 'Non-Demolition Agni Balancing']
      },
      {
        id: 'res-pooja-room',
        name: 'Pooja Room Vastu',
        zoneBadge: 'Sacred Ishanya Sanctum',
        directionFocus: 'North-East (Ishanya) Spiritual Vortex',
        consultationType: 'Residential Vastu Consultation',
        propertyType: 'Independent Villa / Bungalow',
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'Designing serene meditation and prayer sanctums in the auspicious Ishanya (North-East) quadrant—guiding altar orientation, idol heights, marble materials, and sacred geometry.',
        introduction: 'The Pooja and meditation room acts as the spiritual resonator of a residence, receiving gentle morning solar rays and anchoring mental clarity, gratitude, and inner stillness.',
        directionalConsiderations: 'North-East (Ishanya), East, or North are the most auspicious zones for the altar. Deities should face West or East so the worshipper faces East or North while praying.',
        traditionalPrinciples: 'Preserves purity and lightness in the Ishana Devta field, utilizing white Makrana marble, brass lamps, and natural ventilation while keeping idols slightly away from the wall for prana circulation.',
        practicalPlanning: 'Place the Agni lamp (Diya) and incense in the South-East corner of the altar, store sacred texts on the West/South shelves, and use a two-shutter wooden door with a threshold.',
        commonMistakes: 'Building the Pooja alcove underneath a staircase, sharing a common wall with a bathroom commode, or placing ancestral photographs alongside temple deities.',
        deliverables: ['Sacred Altar Orientation Plan', 'Idol Placement & Elevation Guide', 'Temple Marble & Lighting Advice', 'Meditation Space Harmonization']
      },
      {
        id: 'res-bathroom-toilet',
        name: 'Bathroom and Toilet Vastu',
        zoneBadge: 'Drainage & Elemental Containment',
        directionFocus: 'SSW / WNW Disposal & Zero-Demolition Sealing',
        consultationType: 'Residential Vastu Consultation',
        propertyType: 'Apartment / Flat',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'Neutralizing energy drainage from misplaced bathrooms and septic tanks using non-demolition metallic boundary strips, commode axis alignment, and natural mineral absorbers.',
        introduction: 'Modern residences feature attached bathrooms in nearly every bedroom. Because toilets represent waste disposal, an uninsulated toilet in an auspicious zone can drain vitality and financial stability.',
        directionalConsiderations: 'Ideal zones for disposal are South-of-South-West (SSW) or West-of-North-West (WNW). Strictly avoid or remediate toilets located in the North-East, South-West, or central Brahmasthan.',
        traditionalPrinciples: 'Applies elemental boundary isolation (installing specific metal strips around the toilet doorframe or floor perimeter) to virtually cut off the toilet’s draining effect from the surrounding Vastu zone.',
        practicalPlanning: 'Align the commode seat along the North–South axis (avoiding East–West), slope bathroom floor drainage toward the North or East, and keep the bathroom door closed.',
        commonMistakes: 'Leaving a North-East or South-West attached toilet untreated in an apartment, or placing the overhead water tank directly above a sensitive bedroom core.',
        deliverables: ['Toilet Zone Degree Diagnosis', 'Metallic Floor/Door Sealing Plan', 'Drainage & Exhaust Orientation', 'Sea-Salt & Mineral Neutralizers']
      },
      {
        id: 'com-commercial',
        name: 'Commercial Vastu',
        zoneBadge: 'Retail, Showrooms & Hospitality',
        directionFocus: 'Customer Influx & Kubera Cash Counter',
        consultationType: 'Commercial Vastu Consultation',
        propertyType: 'Commercial Office / Showroom',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'Strategic spatial optimization for retail showrooms, shopping complexes, luxury hotels, restaurants, and healthcare clinics to amplify customer footfall, conversions, and brand prestige.',
        introduction: 'Commercial establishments thrive on dynamic customer circulation, inviting storefronts, and smooth cash conversion. Commercial Vastu aligns display zones, billing counters, and entrances for sustained growth.',
        directionalConsiderations: 'Keep the North and East entrance zones wide, brightly lit, and unobstructed. Position heavy display racks in the South and West, and orient the cash counter to face North or East.',
        traditionalPrinciples: 'Harnesses the North (Kubera—wealth inflow), East (Indra—brand visibility), and North-West (Vayu—rapid inventory turnover and customer movement) quadrants.',
        practicalPlanning: 'Design clockwise customer walk-through pathways, place billing and safe lockers in the South-West/North axis, and position restaurant kitchens or electrical panels in the South-East.',
        commonMistakes: 'Blocking the storefront entrance with dark signage or steps in the wrong pada gate, or placing the billing cashier underneath a heavy staircase or beam.',
        deliverables: ['Customer Footfall Circulation Plan', 'Cash Counter & Safe Orientation', 'Showroom Display Tier Zoning', 'Auspicious Entrance Gate Calibration']
      },
      {
        id: 'ind-factory',
        name: 'Factory and Industrial Vastu',
        zoneBadge: 'Manufacturing & Plant Engineering',
        directionFocus: 'South-West Heavy Machinery & Agni Boilers',
        consultationType: 'Factory Vastu Consultation',
        propertyType: 'Industrial Factory / Plant',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'Comprehensive industrial site zoning for factories, warehouses, and processing plants—optimizing heavy CNC machinery foundations, furnaces, raw material bays, and dispatch gates.',
        introduction: 'Industrial manufacturing plants bring together massive mechanical loads, high-voltage transformers, thermal boilers, and large workforces. Proper Vastu alignment enhances operational uptime, safety, and smooth dispatch.',
        directionalConsiderations: 'Anchor heavy machinery and raw material storage in the South-West and South; place boilers, transformers, and generators in the South-East (Agni); locate finished goods dispatch in the North-West (Vayu).',
        traditionalPrinciples: 'Establishes a clockwise thermodynamic production flow—from raw material intake to fabrication, quality testing (North-East), and rapid dispatch (North-West)—preventing elemental friction.',
        practicalPlanning: 'Separate heavy multi-axle truck gates from administrative gates, position the weighbridge and guardhouse accurately, and keep the North-East open for water storage and R&D.',
        commonMistakes: 'Installing high-voltage transformers or furnaces in the North-East water zone, or placing finished goods warehouses in the South-West where stock stagnates.',
        deliverables: ['Multi-Acre Plant Master Zoning', 'Heavy Machinery Grid Coordinates', 'Transformer & Boiler Agni Audit', 'Raw-to-Dispatch Logistics Flow Plan']
      },
      {
        id: 'com-office',
        name: 'Office Vastu',
        zoneBadge: 'Corporate & Executive Suites',
        directionFocus: 'CEO Cabin, Boardroom & Finance Zoning',
        consultationType: 'Commercial Vastu Consultation',
        propertyType: 'Commercial Office / Showroom',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'Departmental spatial planning for corporate headquarters, executive cabins, boardrooms, IT studios, and financial chambers to strengthen leadership clarity, team synergy, and revenue growth.',
        introduction: 'In a corporate office, every department carries a distinct energetic function—visionary leadership, financial accounting, creative marketing, and technical execution. Aligning each team with its resonant Vastu zone elevates productivity.',
        directionalConsiderations: 'Locate the Founder/CEO cabin in the South-West facing North or East; place the Finance & Accounts team in the North; position Sales & Marketing in the North-West; and welcome clients in the North-East reception.',
        traditionalPrinciples: 'Anchors leadership authority in the Earth element (South-West) while keeping the central office zone (Brahmasthan) open and clutter-free for cross-departmental communication.',
        practicalPlanning: 'Orient employee workstations to face North or East, place server racks and pantry appliances in the South-East, and configure boardroom seating so key decision-makers command the South-West end.',
        commonMistakes: 'Seating the MD/CEO in the North-West or North-East cabin, or placing employee desks facing blank South walls under heavy overhead beams.',
        deliverables: ['CEO & Director Cabin Alignment', 'Departmental Desk Zoning Matrix', 'Boardroom & Reception Blueprint', 'Server Room & Pantry Balancing']
      }
    ];
  }

  getDefaultImageForSubService(subId, index = 0) {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80'
    ];
    return fallbackImages[index % fallbackImages.length];
  }

  renderServices() {
    const tabsContainer = document.getElementById('services-tabs');
    const gridContainer = document.getElementById('services-grid');
    if (!tabsContainer || !gridContainer) return;

    const featured12 = this.getFeatured12KnowledgeCards();
    const tabsList = [
      { id: 'featured12', label: '✦ Core 12 Vastu Domains' },
      ...VASTU_DATA.services.map((s) => ({ id: s.id, label: s.category }))
    ];

    tabsContainer.innerHTML = tabsList
      .map(
        (t) => `
      <button
        type="button"
        data-service-tab="${t.id}"
        class="px-5 py-2.5 rounded-full font-serif text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
          this.currentServiceTab === t.id
            ? 'bg-gradient-to-r from-[#D9A52D] via-[#F9E29B] to-[#C6A15B] text-[#16070B] shadow-lg shadow-[#C6A15B]/30 font-bold'
            : 'border border-[#C6A15B]/35 text-[#DCCBB0] bg-[#181013]/80 hover:bg-[#481C25]/60 hover:text-[#F8F3E9]'
        }"
      >
        ${t.label}
      </button>
    `
      )
      .join('');

    let cardsToRender = [];
    let bannerHtml = '';

    if (this.currentServiceTab === 'featured12') {
      cardsToRender = featured12;
    } else {
      const activeService =
        VASTU_DATA.services.find((s) => s.id === this.currentServiceTab) || VASTU_DATA.services[0];

      bannerHtml = `
        <div class="col-span-full mb-2 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#481C25]/80 via-[#1E1015]/90 to-[#12080B]/95 border border-[#C6A15B]/35 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div>
            <span class="text-[11px] uppercase tracking-[0.22em] text-[#C6A15B] font-bold">${activeService.tagline || 'Vedic Architectural Advisory'}</span>
            <h3 class="font-serif text-2xl md:text-3xl text-[#F8F3E9] font-bold mt-1">${activeService.category}</h3>
            <p class="text-xs sm:text-sm text-[#DCCBB0] max-w-2xl mt-1.5 leading-relaxed font-light">${activeService.description || ''}</p>
          </div>
          <button
            type="button"
            data-book-category="${activeService.category}"
            class="vastu-cta-primary px-7 py-3.5 rounded-full font-serif text-xs font-bold uppercase tracking-wider whitespace-nowrap"
          >
            Book Consultation ➔
          </button>
        </div>
      `;

      cardsToRender = (activeService.subServices || []).map((sub, idx) => {
        const matchIn12 = featured12.find(
          (f) => f.id === sub.id || f.name.toLowerCase() === (sub.name || '').toLowerCase()
        );
        const descriptionText =
          sub.shortDesc ||
          sub.desc ||
          sub.importance ||
          'Comprehensive Vedic spatial evaluation, directional degree calibration, and non-demolition elemental harmonization.';
        return {
          id: sub.id || `sub-${idx}`,
          name: sub.name || 'Vastu Consultation',
          zoneBadge: activeService.category || 'Vastu Shastra',
          directionFocus: sub.traditionalBasis || '16-Zone Mandala & Elemental Alignment',
          consultationType:
            activeService.id === 'commercial'
              ? 'Commercial Vastu Consultation'
              : activeService.id === 'industrial'
              ? 'Factory Vastu Consultation'
              : activeService.id === 'planning'
              ? 'Vastu Mapping'
              : 'Residential Vastu Consultation',
          propertyType:
            activeService.id === 'commercial'
              ? 'Commercial Office / Showroom'
              : activeService.id === 'industrial'
              ? 'Industrial Factory / Plant'
              : activeService.id === 'land'
              ? 'Vacant Plot / Land Parcel'
              : 'Independent Villa / Bungalow',
          image: matchIn12 ? matchIn12.image : this.getDefaultImageForSubService(sub.id, idx),
          shortDesc: descriptionText,
          introduction:
            (matchIn12 && matchIn12.introduction) ||
            `${sub.name} is a specialized discipline within classical Vedic architecture focused on aligning spatial proportions, entrances, and elemental placements for lasting harmony.`,
          directionalConsiderations:
            (matchIn12 && matchIn12.directionalConsiderations) ||
            sub.importance ||
            'Evaluates true compass degrees across all 8 cardinal and intercardinal directions relative to the property center (Brahmasthan).',
          traditionalPrinciples:
            (matchIn12 && matchIn12.traditionalPrinciples) ||
            sub.traditionalBasis ||
            'Grounded in Sthapatya Veda, Manasara, and the 81-Pada Vastu Purusha Mandala.',
          practicalPlanning:
            (matchIn12 && matchIn12.practicalPlanning) ||
            'Coordinates architectural layout, functional zoning, solar illumination, and non-demolition elemental balancing.',
          commonMistakes:
            (matchIn12 && matchIn12.commonMistakes) ||
            'Ignoring angular compass declination, placing conflicting elements (water/fire) in sensitive zones, or obstructing the central Brahmasthan.',
          deliverables: Array.isArray(sub.deliverables) && sub.deliverables.length
            ? sub.deliverables
            : ['16-Zone Directional Audit', '32-Gate Entrance Analysis', 'Zero-Demolition Remedial Plan', 'Consultation Dossier']
        };
      });
    }

    this.currentKnowledgeCardsMap = {};
    cardsToRender.forEach((c) => {
      this.currentKnowledgeCardsMap[c.name] = c;
    });

    gridContainer.innerHTML = `
      ${bannerHtml}
      ${cardsToRender
        .map(
          (card, index) => `
        <article
          class="vastu-knowledge-card flex flex-col justify-between group"
          data-knowledge-card
          style="opacity: 0; transform: translateY(26px);"
        >
          <div>
            <!-- Architectural Image Header -->
            <div class="vastu-card-img-wrap">
              <img
                src="${card.image}"
                alt="${card.name} – Vastu Sutram Architectural Guide"
                loading="${index < 3 ? 'eager' : 'lazy'}"
                class="vastu-card-img"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#160A0E] via-[#160A0E]/35 to-transparent"></div>
              <div class="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                <span class="px-3 py-1 rounded-full text-[10px] font-serif uppercase tracking-[0.16em] bg-[#16070B]/85 text-[#F9E29B] border border-[#C6A15B]/45 backdrop-blur-md font-semibold">
                  ${card.zoneBadge}
                </span>
                <span class="w-7 h-7 rounded-full bg-[#16070B]/80 border border-[#C6A15B]/40 flex items-center justify-center text-[11px] font-serif text-[#C6A15B] font-bold">
                  ${String(index + 1).padStart(2, '0')}
                </span>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-6 pb-4">
              <h3 class="font-serif text-lg sm:text-xl font-bold text-[#F8F3E9] group-hover:text-[#F9E29B] transition-colors leading-snug mb-2.5">
                ${card.name}
              </h3>
              <div class="w-12 h-[1.5px] bg-gradient-to-r from-[#C6A15B] to-transparent mb-3 group-hover:w-24 transition-all duration-500"></div>
              <p class="text-xs sm:text-[13px] text-[#DCCBB0] leading-relaxed font-light line-clamp-3">
                ${card.shortDesc}
              </p>
            </div>
          </div>

          <!-- Card Footer: Learn More & Book Consultation -->
          <div class="px-6 pb-6 pt-3 mt-2 border-t border-[#C6A15B]/20 flex items-center justify-between gap-3">
            <button
              type="button"
              data-learn-more-service="${card.name}"
              class="text-xs font-serif uppercase tracking-[0.14em] text-[#E5C378] hover:text-[#FFF2C2] font-semibold flex items-center gap-1.5 py-2 transition-colors"
            >
              <span>Learn More</span>
              <span class="vastu-card-learn-arrow">➔</span>
            </button>
            <button
              type="button"
              data-book-subservice="${card.name}"
              class="vastu-card-book-btn px-4 py-2 rounded-full font-serif text-[11px] uppercase tracking-[0.14em] font-bold whitespace-nowrap"
            >
              Book Consultation
            </button>
          </div>
        </article>
      `
        )
        .join('')}
    `;

    // Staggered GSAP entrance animation & 3D hover tilt
    this.animateKnowledgeCards(gridContainer);
    this.initKnowledgeParticles();

    // Bind tab clicks
    tabsContainer.querySelectorAll('[data-service-tab]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        this.currentServiceTab = e.currentTarget.getAttribute('data-service-tab');
        this.renderServices();
      });
    });

    // Bind Book Consultation triggers -> prefill WhatsApp Booking Form (9181457155) & scroll smoothly
    gridContainer.querySelectorAll('[data-book-subservice]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const categoryName = e.currentTarget.getAttribute('data-book-subservice');
        this.navigateToWhatsAppBookingForCategory(categoryName);
      });
    });

    gridContainer.querySelectorAll('[data-book-category]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const categoryName = e.currentTarget.getAttribute('data-book-category');
        this.navigateToWhatsAppBookingForCategory(categoryName);
      });
    });

    // Learn More modal trigger
    gridContainer.querySelectorAll('[data-learn-more-service]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const title = e.currentTarget.getAttribute('data-learn-more-service');
        this.openServiceDetailModal(title);
      });
    });
  }

  animateKnowledgeCards(gridContainer) {
    const cards = gridContainer.querySelectorAll('[data-knowledge-card]');
    const reducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reducedMotion && window.gsap) {
      window.gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.075,
        ease: 'power3.out',
        clearProps: 'transform'
      });
    } else {
      cards.forEach((c) => {
        c.style.opacity = '1';
        c.style.transform = 'none';
      });
    }

    // Subtle interactive 3D tilt on desktop hover
    if (!reducedMotion && window.innerWidth >= 1024) {
      cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -4.2;
          const rotateY = ((x - centerX) / centerX) * 4.2;
          card.style.transform = `perspective(950px) translateY(-6px) rotateX(${rotateX.toFixed(
            2
          )}deg) rotateY(${rotateY.toFixed(2)}deg)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(950px) translateY(0px) rotateX(0deg) rotateY(0deg)';
        });
      });
    }
  }

  initKnowledgeParticles() {
    if (this.knowledgeParticlesInitialized) return;
    const canvas = document.getElementById('knowledge-particles-canvas');
    if (!canvas) return;
    this.knowledgeParticlesInitialized = true;

    const ctx = canvas.getContext('2d');
    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.clientWidth : window.innerWidth;
      canvas.height = parent ? parent.clientHeight : 900;
    };
    resize();
    window.addEventListener('resize', resize);

    const pts = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.6,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -(Math.random() * 0.22 + 0.06),
      alpha: Math.random() * 0.45 + 0.15
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = canvas.height;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 226, 155, ${p.alpha})`;
        ctx.fill();
      }
      requestAnimationFrame(draw);
    };
    draw();
  }

  navigateToWhatsAppBookingForCategory(categoryName) {
    const cardData =
      (this.currentKnowledgeCardsMap && this.currentKnowledgeCardsMap[categoryName]) || null;

    const consultSelect = document.getElementById('wa-consultation-type');
    const propSelect = document.getElementById('wa-property-type');
    const msgInput = document.getElementById('wa-message');

    if (consultSelect && cardData && cardData.consultationType) {
      // Ensure option exists or add dynamic category option so exact category is transmitted to WhatsApp
      let matched = false;
      for (const opt of consultSelect.options) {
        if (opt.value === `${categoryName} (${cardData.consultationType})` || opt.value === categoryName) {
          consultSelect.value = opt.value;
          matched = true;
          break;
        }
      }
      if (!matched) {
        const customOpt = document.createElement('option');
        customOpt.value = `${categoryName} — ${cardData.consultationType}`;
        customOpt.textContent = `${categoryName} (${cardData.consultationType})`;
        consultSelect.prepend(customOpt);
        consultSelect.value = customOpt.value;
      }
    }

    if (propSelect && cardData && cardData.propertyType) {
      for (const opt of propSelect.options) {
        if (opt.value === cardData.propertyType) {
          propSelect.value = cardData.propertyType;
          break;
        }
      }
    }

    if (msgInput) {
      msgInput.value = `I would like to book a Vastu consultation for "${categoryName}". Please share available slots and blueprint evaluation details.`;
    }

    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      if (typeof this.setBookingWizardStep === 'function') {
        this.setBookingWizardStep(1);
      }
      bookingSection.scrollIntoView({ behavior: 'smooth' });
      const nameInput = document.getElementById('wa-name');
      if (nameInput) {
        setTimeout(() => nameInput.focus({ preventScroll: true }), 650);
      }
    } else {
      this.openBookingModal();
    }
  }

  // 7. KNOWLEDGE EXPLORER & 3D CHAKRA
  initKnowledgeExplorer() {
    if (window.InteractiveVastuChakra) {
      const containerId = document.getElementById('chakra-3d-canvas-container')
        ? 'chakra-3d-canvas-container'
        : 'chakra-3d-canvas';
      this.chakraInstance = new InteractiveVastuChakra(containerId, 'chakra-info-panel');
    }

    // Tabs inside knowledge section
    document.querySelectorAll('[data-knowledge-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-knowledge-tab');
        this.switchKnowledgeTab(tab);
      });
    });

    this.render32GatesTable();
    this.render45DevtasSection();
    this.renderRoomMatrixSection();
  }

  switchKnowledgeTab(tab) {
    this.knowledgeTab = tab;
    document.querySelectorAll('[data-knowledge-tab]').forEach(btn => {
      if (btn.getAttribute('data-knowledge-tab') === tab) {
        btn.classList.add('bg-[#C6A15B]', 'text-[#171717]', 'font-bold');
        btn.classList.remove('text-[#DCCBB0]', 'bg-[#12080B]/60');
      } else {
        btn.classList.remove('bg-[#C6A15B]', 'text-[#171717]', 'font-bold');
        btn.classList.add('text-[#DCCBB0]', 'bg-[#12080B]/60');
      }
    });

    const views = {
      chakra: document.getElementById('view-chakra-3d'),
      gates: document.getElementById('view-32-gates'),
      devtas: document.getElementById('view-45-devtas'),
      matrix: document.getElementById('view-room-matrix')
    };

    Object.keys(views).forEach(key => {
      if (views[key]) {
        if (key === tab) {
          views[key].classList.remove('hidden');
        } else {
          views[key].classList.add('hidden');
        }
      }
    });
  }

  render32GatesTable() {
    const container = document.getElementById('gates-table-container');
    if (!container) return;

    container.innerHTML = `
      <div class="overflow-x-auto rounded-xl border border-[#C6A15B]/30 bg-[#12080B]/80">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#481C25]/80 text-[#C6A15B] font-serif border-b border-[#C6A15B]/30 uppercase text-[11px]">
            <tr>
              <th class="p-3">Gate Code</th>
              <th class="p-3">Presiding Devta</th>
              <th class="p-3">Quadrant</th>
              <th class="p-3">Traditional Classification</th>
              <th class="p-3">Scriptural Consequence / Influence</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#C6A15B]/15 text-xs">
            ${VASTU_DATA.gates32.map(g => {
              const isAusp = g.nature.includes('Auspicious');
              const quad = g.code.startsWith('E') ? 'East (Purva)' :
                           g.code.startsWith('S') ? 'South (Dakshina)' :
                           g.code.startsWith('W') ? 'West (Paschima)' : 'North (Uttara)';
              return `
                <tr class="hover:bg-[#481C25]/20 transition-all ${isAusp ? 'bg-emerald-950/20' : ''}">
                  <td class="p-3 font-mono font-bold ${isAusp ? 'text-emerald-400' : 'text-[#F9E29B]'}">${g.code}</td>
                  <td class="p-3 font-semibold text-[#F8F3E9]">${g.name}</td>
                  <td class="p-3 text-[#DCCBB0]">${quad}</td>
                  <td class="p-3">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isAusp ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                      g.nature === 'Mixed' || g.nature === 'Neutral' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      'bg-red-500/20 text-red-300 border border-red-500/40'
                    }">${g.nature}</span>
                  </td>
                  <td class="p-3 text-[#DCCBB0]">${g.effect}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  render45DevtasSection() {
    const container = document.getElementById('devtas-content-container');
    if (!container) return;

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-6 rounded-xl bg-[#12080B]/90 border border-[#C6A15B]/30">
          <span class="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">Center (1 Devta)</span>
          <h4 class="font-serif text-lg font-bold text-[#F9E29B] mb-2">Lord Brahma</h4>
          <p class="text-xs text-[#DCCBB0] leading-relaxed mb-4">Occupies the central 9 squares (Brahmasthan). Radiates infinite cosmic intelligence and balance to all sectors.</p>
          <div class="text-[11px] text-[#F8F3E9] p-3 rounded bg-[#481C25]/40 border border-[#C6A15B]/20">
            Rule: Zero heavy weight, no columns, no toilets, no underground water tanks.
          </div>
        </div>

        <div class="p-6 rounded-xl bg-[#12080B]/90 border border-[#C6A15B]/30">
          <span class="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">Inner Belt (4 Devtas)</span>
          <h4 class="font-serif text-lg font-bold text-[#F9E29B] mb-2">Brahmavithi Deities</h4>
          <p class="text-xs text-[#DCCBB0] leading-relaxed mb-4">Aryama (East), Vivasvan (South), Mitra (West), and Bhudhar/Aapatsavatsa (North). Governs core organ health, alliances, and visionary drive.</p>
          <div class="text-[11px] text-[#F8F3E9] p-3 rounded bg-[#481C25]/40 border border-[#C6A15B]/20">
            Rule: Clean circulation, internal courtyards, living rooms and family dining halls.
          </div>
        </div>

        <div class="p-6 rounded-xl bg-[#12080B]/90 border border-[#C6A15B]/30">
          <span class="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">Outer Perimeter (32 Devtas)</span>
          <h4 class="font-serif text-lg font-bold text-[#F9E29B] mb-2">Padavinyasa Boundary</h4>
          <p class="text-xs text-[#DCCBB0] leading-relaxed mb-4">Form the outer boundary of the home, governing entrances, windows, boundary walls, and external environmental exchanges.</p>
          <div class="text-[11px] text-[#F8F3E9] p-3 rounded bg-[#481C25]/40 border border-[#C6A15B]/20">
            Rule: Main entrance must only be positioned on auspicious fields (E3, E4, S3, S4, W3, W4, N3, N4).
          </div>
        </div>
      </div>
    `;
  }

  renderRoomMatrixSection() {
    const container = document.getElementById('room-matrix-container');
    if (!container) return;

    const rooms = [
      { name: "Pooja & Meditation Room", ideal: "North-East (Ishanya)", alt: "East or North", prohibited: "South-West, South, under staircase, adjacent to toilet", notes: "Keep pristine, white/cream marble, deities facing East or West." },
      { name: "Kitchen (Stove Placement)", ideal: "South-East (Agneya)", alt: "North-West (Vayavya)", prohibited: "North-East, South-West, Center", notes: "Cook facing East. Never place cooking hob adjacent to water sink." },
      { name: "Master Bedroom", ideal: "South-West (Nairrutya)", alt: "South or West", prohibited: "North-East (leads to restlessness)", notes: "Sleep with head towards South or East for optimal magnetic alignment." },
      { name: "Bathrooms & Toilets", ideal: "West-North-West, South-South-West", alt: "North-West", prohibited: "North-East (strictly forbidden), South-West, Brahmasthan", notes: "Use non-demolition zinc/copper strips to seal toilet boundary vibrations." },
      { name: "Staircase (Ascent)", ideal: "South, South-West, West", alt: "North-West", prohibited: "North-East, Brahmasthan", notes: "Must ascend in a clockwise direction. Never store pooja altar or kitchen under stairs." },
      { name: "Underground Water Tank", ideal: "North-East or North", alt: "East", prohibited: "South-West, South-East (fire zone)", notes: "Must be in the water element zone. Enhances health, prosperity, and peace." }
    ];

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${rooms.map(r => `
          <div class="p-5 rounded-xl bg-[#12080B]/85 border border-[#C6A15B]/25 space-y-2 text-xs">
            <h4 class="font-serif text-base font-bold text-[#F9E29B]">${r.name}</h4>
            <div class="grid grid-cols-2 gap-2 text-[11px]">
              <div class="p-2.5 rounded bg-[#481C25]/50 border border-[#C6A15B]/20">
                <span class="text-[#C6A15B] block font-bold">Ideal Direction</span>
                <span class="text-[#F8F3E9] font-semibold">${r.ideal}</span>
              </div>
              <div class="p-2.5 rounded bg-red-950/40 border border-red-500/20">
                <span class="text-red-300 block font-bold">Strictly Prohibited</span>
                <span class="text-red-200">${r.prohibited}</span>
              </div>
            </div>
            <p class="text-[#DCCBB0] leading-relaxed pt-1 font-light"><strong class="text-[#F8F3E9]">Vastu Note:</strong> ${r.notes}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 8. CONSULTATION PACKAGES (ULTRA-PREMIUM 3D FLOATING CARDS & INTERACTIVE BOOKING)
  getPackageIconSVG(pkg) {
    const id = pkg.id || '';
    if (id === 'pkg-res-basic' || pkg.iconType === 'home-basic') {
      // Minimalist Luxury Architectural Home Blueprint Icon
      return `
        <svg class="w-7 h-7 text-[#F9E29B]" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 15L16 5l12 10"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 12.5V26h17V12.5"/>
          <rect x="13" y="18" width="6" height="8" stroke="#C6A15B" stroke-width="1.4"/>
          <circle cx="16" cy="12" r="2.2" stroke="#F9E29B" stroke-width="1.3"/>
        </svg>
      `;
    }
    if (id === 'pkg-res-complete' || pkg.iconType === 'mandala-complete' || pkg.popular) {
      // Sacred Vastu Mandala & 16-Zone Blueprint Grid Icon
      return `
        <svg class="w-7 h-7 text-[#FFF2C2]" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6">
          <circle cx="16" cy="16" r="12" stroke="#F9E29B" stroke-width="1.5"/>
          <rect x="8.5" y="8.5" width="15" height="15" stroke="#C6A15B" stroke-width="1.3"/>
          <rect x="8.5" y="8.5" width="15" height="15" transform="rotate(45 16 16)" stroke="#F9E29B" stroke-width="1.3"/>
          <circle cx="16" cy="16" r="2.6" fill="#F9E29B"/>
        </svg>
      `;
    }
    if (id === 'pkg-res-premium' || pkg.iconType === 'estate-premium') {
      // Luxury Multi-Level Estate & Architectural Sanctuary Icon
      return `
        <svg class="w-7 h-7 text-[#F9E29B]" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 27h26"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 27V14l10-8 10 8v13"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M11 27V18h10v9"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 6V3m-5 9h10"/>
          <circle cx="16" cy="14" r="1.8" fill="#F9E29B"/>
        </svg>
      `;
    }
    if (pkg.category === 'commercial') {
      // Executive Corporate Tower & Showroom Geometry Icon
      return `
        <svg class="w-7 h-7 text-[#F9E29B]" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6">
          <rect x="6" y="5" width="13" height="22" stroke-linecap="round" stroke-linejoin="round"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 12h7v15h-7"/>
          <line x1="10" y1="10" x2="15" y2="10"/><line x1="10" y1="14" x2="15" y2="14"/><line x1="10" y1="18" x2="15" y2="18"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M11 27v-4h3v4"/>
        </svg>
      `;
    }
    if (pkg.category === 'industrial') {
      // Industrial Plant & Thermodynamic Energy Grid Icon
      return `
        <svg class="w-7 h-7 text-[#F9E29B]" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 27V13l7 4V13l7 4V9l10-3v21H4z"/>
          <circle cx="23" cy="16" r="3" stroke="#F9E29B" stroke-width="1.4"/>
          <path stroke-linecap="round" d="M9 22h6"/>
        </svg>
      `;
    }
    // Land & Plot / Default Compass Survey Icon
    return `
      <svg class="w-7 h-7 text-[#F9E29B]" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6">
        <polygon points="16,4 28,11 24,26 8,26 4,11" stroke-linejoin="round"/>
        <circle cx="16" cy="16" r="5" stroke="#C6A15B" stroke-width="1.3"/>
        <path stroke-linecap="round" stroke-linejoin="round" d="M16 9v14M9 16h14"/>
      </svg>
    `;
  }

  renderPackages() {
    const tabsContainer = document.getElementById('packages-tabs');
    const cardsContainer = document.getElementById('packages-cards');
    if (!tabsContainer || !cardsContainer) return;

    this.initPackagesParticles();

    const categories = [
      { id: 'residential', label: 'RESIDENTIAL PACKAGES', icon: '🏛️' },
      { id: 'commercial', label: 'COMMERCIAL PACKAGES', icon: '🏢' },
      { id: 'industrial', label: 'INDUSTRIAL PACKAGES', icon: '⚙️' },
      { id: 'land', label: 'LAND & PLOT PACKAGES', icon: '🧭' }
    ];

    tabsContainer.innerHTML = categories.map(c => {
      const isActive = this.currentPackageTab === c.id;
      return `
        <button
          type="button"
          role="tab"
          aria-selected="${isActive ? 'true' : 'false'}"
          data-package-tab="${c.id}"
          class="vastu-pkg-pill ${isActive ? 'active' : ''}"
        >
          <span>${c.label}</span>
        </button>
      `;
    }).join('');

    const matched = (VASTU_DATA.packages || []).filter(p => p.category === this.currentPackageTab);

    cardsContainer.innerHTML = matched.map((p, idx) => {
      const isPopular = Boolean(p.popular);
      const badges = Array.isArray(p.badges) && p.badges.length
        ? p.badges
        : [p.duration, p.mode].filter(Boolean);
      const tierTag = p.tierTag || (isPopular ? 'SIGNATURE COMPREHENSIVE DOSSIER' : 'VEDIC ARCHITECTURAL CONSULTATION');
      const deliverables = Array.isArray(p.deliverables) ? p.deliverables.filter(Boolean) : [];

      return `
        <article
          class="vastu-pricing-card ${isPopular ? 'vastu-pricing-card-featured' : ''} p-7 md:p-8 flex flex-col justify-between group"
          data-pkg-card-index="${idx}"
        >
          ${isPopular ? `
            <div class="absolute top-0 right-0 z-20 bg-gradient-to-r from-[#D9A52D] via-[#FFF2C2] to-[#C6A15B] text-[#16070B] font-serif text-[10px] uppercase font-extrabold tracking-[0.2em] px-4 py-1.5 rounded-bl-2xl shadow-[0_6px_20px_rgba(217,165,45,0.45)] flex items-center gap-1.5">
              <span>★</span>
              <span>MOST PREFERRED</span>
            </div>
          ` : ''}

          <div class="relative z-10">
            <!-- Top Header: Custom Architectural SVG Icon Orb & Tier Tag -->
            <div class="flex items-center gap-4 mb-5">
              <div class="vastu-pkg-icon-orb shrink-0">
                ${this.getPackageIconSVG(p)}
              </div>
              <div>
                <span class="text-[10px] uppercase tracking-[0.2em] text-[#C6A15B] font-bold block mb-0.5">${tierTag}</span>
                <h3 class="font-serif text-xl md:text-[1.35rem] font-bold text-[#F8F3E9] group-hover:text-[#F9E29B] transition-colors leading-snug">
                  ${p.name}
                </h3>
              </div>
            </div>

            <!-- Duration & Consultation Mode Badges -->
            <div class="flex flex-wrap gap-2 mb-6">
              ${badges.map(b => `
                <span class="px-3 py-1 rounded-full text-[10px] font-medium tracking-wider uppercase bg-[#481C25]/65 text-[#F9E29B] border border-[#C6A15B]/35">
                  ${b}
                </span>
              `).join('')}
            </div>

            <!-- Prominent Luxury Price Box -->
            <div class="p-4 rounded-2xl bg-[#12080B]/75 border border-[#C6A15B]/30 mb-6 relative overflow-hidden">
              <div class="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[#C6A15B]/10 blur-xl pointer-events-none"></div>
              <span class="text-[10px] uppercase tracking-[0.2em] text-[#DCCBB0] block mb-1">Consultation Fee</span>
              <div class="font-serif text-2xl md:text-3xl font-bold text-[#F9E29B] tracking-wide">
                ${p.price}
              </div>
              <span class="text-[11px] text-[#DCCBB0]/85 block mt-1 font-light">
                ${p.priceNote || 'Includes personalized Vedic spatial diagnostics'}
              </span>
            </div>

            <!-- Golden Architectural Divider -->
            <div class="flex items-center gap-2 mb-5">
              <span class="text-[10px] uppercase tracking-[0.2em] text-[#C6A15B] font-semibold">Included Deliverables</span>
              <span class="flex-1 h-[1px] bg-gradient-to-r from-[#C6A15B]/45 to-transparent"></span>
            </div>

            <!-- Features & Deliverables List with Golden Checkmarks -->
            <ul class="space-y-3 text-xs md:text-[13px] text-[#F8F3E9]/90 mb-8">
              ${deliverables.map(d => `
                <li class="flex items-start gap-3 leading-relaxed">
                  <span class="w-5 h-5 rounded-full bg-[#481C25]/90 border border-[#C6A15B]/60 text-[#F9E29B] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-[0_0_10px_rgba(198,161,91,0.25)]">✓</span>
                  <span>${d}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Dual Action Footer: Primary WhatsApp Consultation Pre-Fill + Instant Online Gateway -->
          <div class="relative z-10 pt-2 space-y-2.5">
            <button
              type="button"
              data-prefill-package-id="${p.id}"
              class="vastu-pkg-cta-btn w-full py-3.5 px-5 rounded-full font-serif text-xs font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-2"
            >
              <span>Book This Package</span>
              <span class="vastu-pkg-cta-arrow">➔</span>
            </button>

            <button
              type="button"
              data-book-package-id="${p.id}"
              class="w-full py-2 rounded-full border border-[#C6A15B]/35 hover:border-[#F9E29B] bg-[#12080B]/60 hover:bg-[#481C25]/50 text-[#DCCBB0] hover:text-[#F9E29B] font-serif text-[10px] uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-1.5"
            >
              <span>🔒 Instant Online Payment / Gateway</span>
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Bind category navigation pills with smooth transition
    tabsContainer.querySelectorAll('[data-package-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const nextTab = e.currentTarget.getAttribute('data-package-tab');
        if (nextTab === this.currentPackageTab) return;
        this.currentPackageTab = nextTab;
        this.renderPackages();
      });
    });

    // Bind Primary "Book This Package" button -> Pre-fill WhatsApp Consultation Form & Smooth Scroll
    cardsContainer.querySelectorAll('[data-prefill-package-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pkgId = e.currentTarget.getAttribute('data-prefill-package-id');
        const pkg = (VASTU_DATA.packages || []).find(item => item.id === pkgId);
        if (pkg) {
          this.navigateToWhatsAppBookingForPackage(pkg);
        }
      });
    });

    // Initialize 3D Mouse Tilt + Cursor Spotlight on Cards
    this.initPackageCards3DTilt();

    // Scroll-triggered entrance animation for the Packages section (runs once on first scroll into view)
    this.initPackagesScrollReveal();

    // Animate newly rendered cards when switching tabs
    if (window.gsap && this.packagesSectionRevealed) {
      const cards = cardsContainer.querySelectorAll('.vastu-pricing-card');
      window.gsap.fromTo(
        cards,
        { opacity: 0, y: 28, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.11, ease: 'power3.out', clearProps: 'transform' }
      );
    }
  }

  initPackagesScrollReveal() {
    if (this.packagesScrollObserverInitialized) return;
    const section = document.getElementById('packages');
    if (!section) return;
    this.packagesScrollObserverInitialized = true;

    const triggerReveal = () => {
      if (this.packagesSectionRevealed) return;
      this.packagesSectionRevealed = true;
      if (!window.gsap) return;

      const header = document.getElementById('packages-hero-header');
      const pills = document.querySelectorAll('#packages-tabs .vastu-pkg-pill');
      const cards = document.querySelectorAll('#packages-cards .vastu-pricing-card');

      const tl = window.gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (header) {
        tl.fromTo(header, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.85 }, 0);
      }
      if (pills.length) {
        tl.fromTo(pills, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 }, 0.2);
      }
      if (cards.length) {
        tl.fromTo(
          cards,
          { opacity: 0, y: 34, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.75, stagger: 0.12, clearProps: 'transform' },
          0.35
        );
      }
    };

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            triggerReveal();
            obs.disconnect();
          }
        });
      }, { threshold: 0.12 });
      obs.observe(section);
    } else {
      triggerReveal();
    }
  }

  navigateToWhatsAppBookingForPackage(pkg) {
    if (!pkg) return;

    const consultSelect = document.getElementById('wa-consultation-type');
    const propSelect = document.getElementById('wa-property-type');
    const msgInput = document.getElementById('wa-message');
    const amountInput = document.getElementById('wa-confirmed-amount');

    if (consultSelect) {
      const optionLabel = `${pkg.name} (${pkg.price})`;
      let found = false;
      for (const opt of consultSelect.options) {
        if (
          opt.value === optionLabel ||
          opt.textContent === optionLabel ||
          opt.getAttribute('data-pkg-id') === pkg.id
        ) {
          consultSelect.value = opt.value;
          found = true;
          break;
        }
      }
      if (!found) {
        const customOpt = document.createElement('option');
        customOpt.value = optionLabel;
        customOpt.textContent = optionLabel;
        customOpt.setAttribute('data-pkg-id', pkg.id);
        customOpt.setAttribute('data-starting-price', String(pkg.rawPrice || 11000));
        consultSelect.prepend(customOpt);
        consultSelect.value = optionLabel;
      }
    }

    if (amountInput && pkg.rawPrice) {
      amountInput.value = pkg.rawPrice;
    }

    if (propSelect) {
      const catToProperty = {
        residential: 'Independent House',
        commercial: 'Office',
        industrial: 'Factory / Industrial Unit',
        land: 'Plot / Open Land'
      };
      const targetProp = catToProperty[pkg.category];
      if (targetProp) {
        for (const opt of propSelect.options) {
          if (opt.value === targetProp) {
            propSelect.value = targetProp;
            break;
          }
        }
      }
    }

    if (msgInput) {
      msgInput.value = `I would like to book the "${pkg.name}" package (${pkg.price} • ${pkg.duration}). Please share available consultation slots and blueprint submission steps.`;
    }

    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      if (typeof this.setBookingWizardStep === 'function') {
        this.setBookingWizardStep(1);
      }
      bookingSection.scrollIntoView({ behavior: 'smooth' });
      const nameInput = document.getElementById('wa-name');
      if (nameInput) {
        setTimeout(() => nameInput.focus({ preventScroll: true }), 650);
      }
    } else {
      this.openBookingModal();
    }
  }

  initPackageCards3DTilt() {
    const cardsContainer = document.getElementById('packages-cards');
    if (!cardsContainer) return;

    const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const cards = cardsContainer.querySelectorAll('.vastu-pricing-card');

    cards.forEach(card => {
      if (isTouch) return;
      const isFeatured = card.classList.contains('vastu-pricing-card-featured');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4.5;
        const rotateY = ((x - centerX) / centerX) * 4.5;
        const baseLift = isFeatured ? -12 : -6;

        card.style.transform = `perspective(1100px) translateY(${baseLift}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${isFeatured ? 1.03 : 1.01})`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  initPackagesParticles() {
    const canvas = document.getElementById('packages-particles-canvas');
    if (!canvas || canvas.dataset.initialized === 'true') return;
    canvas.dataset.initialized = 'true';

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight || 800);

    window.addEventListener('resize', () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    });

    const count = 34;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.9 + 0.6,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -Math.random() * 0.32 - 0.08,
      alpha: Math.random() * 0.55 + 0.2
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const pt of particles) {
        pt.x += pt.vx;
        pt.y += pt.vy;
        if (pt.y < -10) pt.y = height + 10;
        if (pt.x < -10) pt.x = width + 10;
        if (pt.x > width + 10) pt.x = -10;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 226, 155, ${pt.alpha})`;
        ctx.fill();
      }
      requestAnimationFrame(draw);
    };
    draw();
  }

  // 9. GALLERY & ARCHITECTURAL VISUALS
  renderGallery() {
    const filtersContainer = document.getElementById('gallery-filters');
    const gridContainer = document.getElementById('gallery-grid');
    if (!filtersContainer || !gridContainer) return;

    const categories = VASTU_DATA.galleryCategories || [
      'All',
      'Residential',
      'Commercial',
      'Factory',
      'Vastu Mapping',
      'Vastu Consultation',
      'Architectural & Vastu Diagrams'
    ];

    filtersContainer.innerHTML = categories.map(cat => `
      <button data-gallery-filter="${cat}" class="px-4 py-1.5 rounded-full text-xs font-serif tracking-wider uppercase transition-all whitespace-nowrap ${
        this.currentGalleryFilter === cat
          ? 'bg-[#C6A15B] text-[#171717] font-bold shadow-md shadow-[#C6A15B]/30'
          : 'border border-[#C6A15B]/30 text-[#DCCBB0] hover:bg-[#481C25]/40'
      }">
        ${cat}
      </button>
    `).join('');

    let items = VASTU_DATA.gallery || [];
    if (this.currentGalleryFilter !== 'All') {
      items = items.filter(i => i.category === this.currentGalleryFilter);
    }

    gridContainer.innerHTML = items.map(item => `
      <div data-gallery-item-id="${item.id}" class="group cursor-pointer rounded-2xl overflow-hidden bg-[#181416] border border-[#C6A15B]/25 hover:border-[#C6A15B] transition-all duration-300 relative shadow-xl hover:-translate-y-1">
        <div class="aspect-video w-full bg-[#121011] relative overflow-hidden flex items-center justify-center p-2">
          <img src="${item.image || item.src}" alt="${item.title}" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
          <div class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-serif uppercase tracking-wider font-bold bg-[#481C25]/90 text-[#F9E29B] border border-[#C6A15B]/40">
            ${item.badge || item.category}
          </div>
        </div>
        <div class="p-5 bg-gradient-to-b from-[#181416] to-[#121011] border-t border-[#C6A15B]/15">
          <div class="flex items-center justify-between text-[10px] text-[#C6A15B] font-mono mb-1">
            <span>${item.category}</span>
            <span>${item.metrics || 'Precision Audit'}</span>
          </div>
          <h4 class="font-serif text-base font-bold text-[#F8F3E9] group-hover:text-[#F9E29B] transition-colors leading-snug">${item.title}</h4>
          <p class="text-xs text-[#DCCBB0] mt-1.5 line-clamp-2 font-light leading-relaxed">${item.description}</p>
          <div class="mt-3 pt-3 border-t border-[#C6A15B]/10 flex items-center justify-between text-xs text-[#C6A15B] group-hover:text-[#F9E29B]">
            <span>View Full Blueprint</span>
            <span>🔍</span>
          </div>
        </div>
      </div>
    `).join('');

    // Bind filter buttons
    filtersContainer.querySelectorAll('[data-gallery-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentGalleryFilter = e.currentTarget.getAttribute('data-gallery-filter');
        this.renderGallery();
      });
    });

    // Bind item click for lightbox
    gridContainer.querySelectorAll('[data-gallery-item-id]').forEach(card => {
      card.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-gallery-item-id');
        this.openLightbox(id);
      });
    });
  }

  openLightbox(id) {
    const item = (VASTU_DATA.gallery || []).find(i => i.id === id);
    if (!item) return;

    const modal = document.getElementById('lightbox-modal');
    const content = document.getElementById('lightbox-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="max-w-4xl w-full p-6 md:p-8 rounded-3xl bg-[#181416] border border-[#C6A15B]/40 text-[#F8F3E9] shadow-2xl relative">
        <div class="flex justify-between items-center border-b border-[#C6A15B]/20 pb-4 mb-4">
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 rounded-full text-xs font-serif uppercase tracking-wider font-bold bg-[#481C25] text-[#F9E29B] border border-[#C6A15B]/40">
              ${item.category}
            </span>
            <span class="text-xs text-[#DCCBB0] font-mono">${item.metrics || ''}</span>
          </div>
          <button id="lightbox-close" class="text-2xl text-[#C6A15B] hover:text-[#F8F3E9] font-bold">✕</button>
        </div>
        <div class="w-full bg-[#121011] rounded-2xl overflow-hidden flex items-center justify-center mb-6 border border-[#C6A15B]/20 p-4">
          <img src="${item.image || item.src}" alt="${item.title}" class="max-h-[60vh] max-w-full object-contain" />
        </div>
        <h3 class="font-serif text-2xl font-bold text-[#F9E29B] mb-2">${item.title}</h3>
        <p class="text-xs md:text-sm text-[#DCCBB0] leading-relaxed mb-6 font-light">${item.description}</p>
        <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#C6A15B]/20">
          <button id="lightbox-book-btn" class="flex-1 py-3 rounded-full bg-gradient-to-r from-[#D9A52D] via-[#F9E29B] to-[#C6A15B] text-[#171717] font-serif text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all">
            Schedule Consultation for This Architecture ➔
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    document.getElementById('lightbox-close').addEventListener('click', () => modal.classList.add('hidden'));
    const bookBtn = document.getElementById('lightbox-book-btn');
    if (bookBtn) {
      bookBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        const formEl = document.getElementById('booking-section');
        if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  // 10. DEDICATED INSTAGRAM SECTION
  renderInstagram() {
    const gridContainer = document.getElementById('instagram-grid');
    if (!gridContainer) return;

    const posts = VASTU_DATA.instagramPosts || [];
    gridContainer.innerHTML = posts.map(post => `
      <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="group block relative rounded-2xl overflow-hidden bg-[#181416] border border-[#C6A15B]/30 hover:border-[#C6A15B] transition-all duration-300 hover:-translate-y-1 shadow-lg aspect-square">
        <img src="${post.image}" alt="${post.title || post.caption || 'Vastu Sutram Instagram'}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 text-left">
          <span class="text-[10px] text-[#F9E29B] font-serif font-bold uppercase tracking-wider">${post.tag || post.title || 'Vastu Sutram'}</span>
          <p class="text-[11px] text-[#F8F3E9] line-clamp-2 mt-1 leading-snug font-light">${post.caption || ''}</p>
          <div class="flex items-center gap-1 text-[10px] text-[#C6A15B] mt-2 font-mono">
            <span>View on Instagram</span>
            <span>↗</span>
          </div>
        </div>
      </a>
    `).join('');
  }

  // 10. TESTIMONIALS CAROUSEL
  renderTestimonials() {
    const container = document.getElementById('testimonials-card-container');
    if (!container) return;

    const t = VASTU_DATA.testimonials[this.testimonialIndex];

    container.innerHTML = `
      <div class="max-w-3xl mx-auto p-8 md:p-10 rounded-2xl bg-gradient-to-br from-[#171717] via-[#2D1219] to-[#12080B] border border-[#C6A15B]/40 shadow-2xl relative text-center">
        <div class="text-4xl text-[#C6A15B] font-serif mb-4">“</div>
        <p class="font-serif text-base md:text-xl text-[#F8F3E9] italic leading-relaxed mb-6">
          ${t.review}
        </p>

        <div class="flex justify-center gap-1 text-amber-400 text-sm mb-4">
          ★★★★★
        </div>

        <div>
          <h4 class="font-serif text-lg font-bold text-[#F9E29B]">${t.name}</h4>
          <p class="text-xs text-[#DCCBB0]">${t.role} • ${t.city}</p>
          <span class="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-semibold bg-[#C6A15B]/20 text-[#C6A15B] border border-[#C6A15B]/30">
            ${t.category}
          </span>
        </div>
      </div>
    `;

    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');

    if (prevBtn) {
      prevBtn.onclick = () => {
        this.testimonialIndex = (this.testimonialIndex - 1 + VASTU_DATA.testimonials.length) % VASTU_DATA.testimonials.length;
        this.renderTestimonials();
      };
    }
    if (nextBtn) {
      nextBtn.onclick = () => {
        this.testimonialIndex = (this.testimonialIndex + 1) % VASTU_DATA.testimonials.length;
        this.renderTestimonials();
      };
    }
  }

  // 11. ARTICLES & BLOGS
  renderArticles() {
    const container = document.getElementById('articles-grid');
    if (!container) return;

    container.innerHTML = VASTU_DATA.articles.map(a => `
      <div data-article-id="${a.id}" class="cursor-pointer group rounded-2xl overflow-hidden bg-[#171717]/80 border border-[#C6A15B]/25 hover:border-[#C6A15B] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between shadow-xl">
        <div class="p-6">
          <div class="flex items-center justify-between text-[11px] text-[#C6A15B] mb-2 font-medium">
            <span>${a.category}</span>
            <span>${a.readTime}</span>
          </div>
          <h3 class="font-serif text-lg font-bold text-[#F8F3E9] group-hover:text-[#F9E29B] transition-colors mb-3 leading-snug">${a.title}</h3>
          <p class="text-xs text-[#DCCBB0] leading-relaxed line-clamp-3 font-light">${a.excerpt}</p>
        </div>
        <div class="px-6 py-4 border-t border-[#C6A15B]/15 flex items-center justify-between text-xs text-[#C6A15B] group-hover:text-[#F9E29B]">
          <span>Read Full Article</span>
          <span>➔</span>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('[data-article-id]').forEach(card => {
      card.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-article-id');
        this.openArticleModal(id);
      });
    });
  }

  openArticleModal(id) {
    const article = VASTU_DATA.articles.find(a => a.id === id);
    if (!article) return;

    const modal = document.getElementById('article-modal');
    const content = document.getElementById('article-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="max-w-3xl w-full p-6 md:p-10 rounded-2xl bg-[#171717] border border-[#C6A15B]/40 text-[#F8F3E9] max-h-[85vh] overflow-y-auto">
        <div class="flex justify-between items-center border-b border-[#C6A15B]/20 pb-4 mb-6">
          <span class="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">${article.category} • ${article.readTime}</span>
          <button id="article-modal-close" class="text-xl text-[#C6A15B] hover:text-[#F8F3E9]">✕</button>
        </div>
        <h2 class="font-serif text-2xl md:text-3xl font-bold text-[#F9E29B] mb-4">${article.title}</h2>
        <div class="text-xs text-[#DCCBB0] mb-6 italic">Published: ${article.date} • Vastu Sutram Knowledge Repository</div>
        <div class="text-sm text-[#F8F3E9]/90 leading-relaxed space-y-4 font-light">
          <p>${article.content}</p>
        </div>
        <div class="mt-8 pt-6 border-t border-[#C6A15B]/20 flex items-center justify-between">
          <button id="btn-book-from-article" class="px-6 py-2.5 rounded-full bg-[#C6A15B] text-[#171717] font-serif text-xs font-bold uppercase hover:bg-[#F9E29B]">
            Consult an Expert on This ➔
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    document.getElementById('article-modal-close').addEventListener('click', () => modal.classList.add('hidden'));
    document.getElementById('btn-book-from-article').addEventListener('click', () => {
      modal.classList.add('hidden');
      this.openBookingModal();
    });
  }

  openServiceDetailModal(serviceTitle) {
    const modal = document.getElementById('service-detail-modal');
    const content = document.getElementById('service-detail-content');
    if (!modal || !content) return;

    const featured12 = this.getFeatured12KnowledgeCards();
    const cardData =
      (this.currentKnowledgeCardsMap && this.currentKnowledgeCardsMap[serviceTitle]) ||
      featured12.find((c) => c.name === serviceTitle) || {
        name: serviceTitle,
        zoneBadge: 'Vastu Sutram Architectural Guide',
        directionFocus: '16-Zone Mandala & Elemental Alignment',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80',
        introduction: `Our specialized Vastu consultation for ${serviceTitle} combines classical Sthapatya Veda principles with modern architectural space planning.`,
        directionalConsiderations:
          'Evaluates true solar and geomagnetic degrees across all 8 cardinal and intercardinal directions relative to the property center (Brahmasthan).',
        traditionalPrinciples:
          'Grounded in the 81-Pada Paramasayika Mandala, 32 outer entrance gates (Padavinyasa), and Panchabhuta five-element balancing.',
        practicalPlanning:
          'Harmonizes functional room zoning, furniture orientation, entrance thresholds, and natural daylight circulation.',
        commonMistakes:
          'Ignoring compass declination, placing conflicting water and fire utilities together, or obstructing the central Brahmasthan.',
        deliverables: [
          '16-Zone Directional Degree Audit',
          '32-Gate Entrance Evaluation',
          '100% Zero-Demolition Elemental Remedies',
          'Personalised Action Dossier'
        ]
      };

    content.innerHTML = `
      <div class="max-w-3xl w-full rounded-3xl overflow-hidden bg-[#181215] border border-[#C6A15B]/50 text-[#F8F3E9] shadow-[0_25px_70px_rgba(0,0,0,0.85)] max-h-[88vh] flex flex-col">
        <!-- Modal Hero Image Header -->
        <div class="relative h-48 sm:h-56 w-full shrink-0 overflow-hidden bg-[#12080B]">
          <img
            src="${cardData.image}"
            alt="${cardData.name}"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#181215] via-[#181215]/55 to-transparent"></div>
          <button
            type="button"
            id="service-modal-close"
            class="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#12080B]/85 border border-[#C6A15B]/50 text-[#F9E29B] hover:bg-[#C6A15B] hover:text-[#12080B] flex items-center justify-center text-base font-bold transition-all"
            aria-label="Close modal"
          >
            ✕
          </button>
          <div class="absolute bottom-4 left-6 right-6">
            <span class="px-3 py-1 rounded-full text-[10px] font-serif uppercase tracking-[0.18em] bg-[#481C25]/90 text-[#F9E29B] border border-[#C6A15B]/45 font-semibold inline-block mb-2">
              ${cardData.zoneBadge || 'Vastu Knowledge Guide'}
            </span>
            <h3 class="font-serif text-2xl sm:text-3xl font-bold text-[#F8F3E9] leading-tight">
              ${cardData.name}
            </h3>
          </div>
        </div>

        <!-- Scrollable Detailed Vastu Guide Body -->
        <div class="p-6 sm:p-8 overflow-y-auto space-y-5 text-xs sm:text-sm leading-relaxed">
          <!-- 1. Introduction -->
          <div class="p-4 rounded-2xl bg-[#221318]/90 border border-[#C6A15B]/25">
            <h4 class="font-serif text-xs uppercase tracking-[0.18em] text-[#F9E29B] font-bold mb-1.5">
              1. Introduction to ${cardData.name}
            </h4>
            <p class="text-[#F8F3E9]/90 font-light">${cardData.introduction}</p>
          </div>

          <!-- Grid: Directional Considerations & Traditional Principles -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-2xl bg-[#140D10] border border-[#C6A15B]/25">
              <h4 class="font-serif text-xs uppercase tracking-[0.16em] text-[#C6A15B] font-bold mb-1.5">
                2. Important Directional Considerations
              </h4>
              <p class="text-[#DCCBB0] text-xs font-light leading-relaxed">${cardData.directionalConsiderations}</p>
            </div>

            <div class="p-4 rounded-2xl bg-[#140D10] border border-[#C6A15B]/25">
              <h4 class="font-serif text-xs uppercase tracking-[0.16em] text-[#C6A15B] font-bold mb-1.5">
                3. Traditional Vastu Principles
              </h4>
              <p class="text-[#DCCBB0] text-xs font-light leading-relaxed">${cardData.traditionalPrinciples}</p>
            </div>
          </div>

          <!-- Grid: Practical Planning & Common Mistakes -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-2xl bg-[#1A2821]/45 border border-emerald-500/30">
              <h4 class="font-serif text-xs uppercase tracking-[0.16em] text-emerald-300 font-bold mb-1.5">
                4. Practical Planning Considerations
              </h4>
              <p class="text-[#F8F3E9]/85 text-xs font-light leading-relaxed">${cardData.practicalPlanning}</p>
            </div>

            <div class="p-4 rounded-2xl bg-[#3D161E]/55 border border-rose-400/30">
              <h4 class="font-serif text-xs uppercase tracking-[0.16em] text-[#F9E29B] font-bold mb-1.5">
                5. Common Mistakes to Avoid
              </h4>
              <p class="text-[#F8F3E9]/85 text-xs font-light leading-relaxed">${cardData.commonMistakes}</p>
            </div>
          </div>

          <!-- 6. Consultation Recommendations & Deliverables -->
          <div class="p-4 rounded-2xl bg-[#140D10] border border-[#C6A15B]/30">
            <h4 class="font-serif text-xs uppercase tracking-[0.18em] text-[#F9E29B] font-bold mb-2.5">
              6. Consultation Recommendations & Scope
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              ${(cardData.deliverables || [])
                .map(
                  (item) => `
                <div class="flex items-center gap-2 text-xs text-[#EADCC9] bg-[#221318]/80 px-3 py-2 rounded-lg border border-[#C6A15B]/20">
                  <span class="text-[#F9E29B]">✦</span>
                  <span>${item}</span>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="p-5 sm:px-8 border-t border-[#C6A15B]/25 bg-[#120B0E] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <span class="text-[11px] text-[#DCCBB0]">
            Direct WhatsApp Consultation Line: <strong class="text-[#F9E29B] font-mono">+91 91814 57155</strong>
          </span>
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              id="btn-service-modal-book"
              class="vastu-cta-primary flex-1 sm:flex-initial px-7 py-3 rounded-full font-serif text-xs font-bold uppercase tracking-wider"
            >
              Book Consultation for ${cardData.name} ➔
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    document.getElementById('service-modal-close').addEventListener('click', () => {
      modal.classList.add('hidden');
    });
    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    };
    document.getElementById('btn-service-modal-book').addEventListener('click', () => {
      modal.classList.add('hidden');
      this.navigateToWhatsAppBookingForCategory(cardData.name);
    });
  }

  // 12. 4-STEP GUIDED CONSULTATION BOOKING ENGINE & WHATSAPP DOSSIER
  initWhatsAppBookingForm() {
    const form = document.getElementById('whatsapp-consultation-form');
    if (!form) return;

    this.currentBookingWizardStep = 1;
    this.maxCompletedBookingStep = 0;

    // Set default date (2 days ahead) if empty
    const dateInput = document.getElementById('wa-date');
    if (dateInput && !dateInput.value) {
      const d = new Date();
      d.setDate(d.getDate() + 2);
      dateInput.value = d.toISOString().split('T')[0];
    }

    // Sync confirmed amount input when package selection changes
    const consultSelectEl = document.getElementById('wa-consultation-type');
    const confirmedAmountEl = document.getElementById('wa-confirmed-amount');
    if (consultSelectEl && confirmedAmountEl) {
      consultSelectEl.addEventListener('change', () => {
        const selOpt = consultSelectEl.options[consultSelectEl.selectedIndex];
        const basePrice = selOpt ? selOpt.getAttribute('data-starting-price') : null;
        if (basePrice) {
          confirmedAmountEl.value = basePrice;
        } else {
          const match = (consultSelectEl.value || '').match(/₹\s*([0-9,]+)/);
          if (match && match[1]) {
            confirmedAmountEl.value = match[1].replace(/,/g, '');
          }
        }
      });
    }

    const prevBtn = document.getElementById('booking-step-prev-btn');
    const nextBtn = document.getElementById('booking-step-next-btn');
    const stepNodes = document.querySelectorAll('[data-booking-step-trigger]');

    const showStepAlert = (msg) => {
      const alertBox = document.getElementById('booking-step-alert');
      if (!alertBox) return;
      if (!msg) {
        alertBox.classList.add('hidden');
        alertBox.textContent = '';
      } else {
        alertBox.innerHTML = `<span>⚠️</span> <span>${msg}</span>`;
        alertBox.classList.remove('hidden');
      }
    };

    const validateUpToStep = (stepNumber) => {
      const name = document.getElementById('wa-name') ? document.getElementById('wa-name').value.trim() : '';
      const phone = document.getElementById('wa-phone') ? document.getElementById('wa-phone').value.trim() : '';
      const email = document.getElementById('wa-email') ? document.getElementById('wa-email').value.trim() : '';
      const city = document.getElementById('wa-city') ? document.getElementById('wa-city').value.trim() : '';
      const confirmedVal = Number(document.getElementById('wa-confirmed-amount')?.value || 0);
      const date = document.getElementById('wa-date') ? document.getElementById('wa-date').value : '';

      if (stepNumber >= 1) {
        if (!name || !phone || !email) {
          showStepAlert('Please enter your Full Name, WhatsApp Number, and Email Address in Step 01.');
          return false;
        }
      }
      if (stepNumber >= 2) {
        if (!city) {
          showStepAlert('Please enter your Property Location / City in Step 02.');
          return false;
        }
        if (!confirmedVal || confirmedVal < 1) {
          showStepAlert('Please confirm a valid Consultation Payable Fee (INR) in Step 02.');
          return false;
        }
      }
      if (stepNumber >= 3) {
        if (!date) {
          showStepAlert('Please select your Preferred Consultation Date in Step 03.');
          return false;
        }
      }
      showStepAlert('');
      return true;
    };

    this.collectBookingFormData = () => {
      const name = (document.getElementById('wa-name')?.value || '').trim();
      const phone = (document.getElementById('wa-phone')?.value || '').trim();
      const altPhone = (document.getElementById('wa-alt-phone')?.value || '').trim();
      const email = (document.getElementById('wa-email')?.value || '').trim();
      const consultSel = document.getElementById('wa-consultation-type');
      const consultationType = consultSel ? consultSel.value : 'Complete Home Vastu Analysis';
      const selectedOpt = consultSel ? consultSel.options[consultSel.selectedIndex] : null;
      const packageId = (selectedOpt && selectedOpt.getAttribute('data-pkg-id')) || 'pkg-res-complete';
      const propertyType = document.getElementById('wa-property-type')?.value || 'Independent House';
      const propertyStage = document.getElementById('wa-property-stage')?.value || 'Existing Property';
      const consultationMode = document.getElementById('wa-mode')?.value || 'Online Video / Blueprint Review';
      const city = (document.getElementById('wa-city')?.value || '').trim();
      const date = document.getElementById('wa-date')?.value || '';
      const timeSlot = document.getElementById('wa-time-slot')?.value || '11:30 AM - 12:30 PM';
      const message = (document.getElementById('wa-message')?.value || '').trim();
      const confirmedAmount = Math.max(1, Math.round(Number(document.getElementById('wa-confirmed-amount')?.value || 11000)));

      return {
        name,
        fullName: name,
        phone: altPhone ? `${phone} (Alt: ${altPhone})` : phone,
        whatsapp: phone,
        email,
        packageId,
        packageName: consultationType.replace(/\s*\(Starting[^)]*\)/i, '').trim(),
        serviceName: consultationType,
        propertyType: propertyStage ? `${propertyType} (${propertyStage})` : propertyType,
        city,
        consultationMode,
        appointmentDate: date,
        appointmentTime: `${timeSlot} • ${consultationMode}`,
        message,
        confirmedAmount,
        amountPayable: confirmedAmount,
        amount: `₹${confirmedAmount.toLocaleString('en-IN')}`,
        source: '4-Step Guided Consultation Booking Form'
      };
    };

    this.populateLiveReviewGrid = () => {
      const reviewGrid = document.getElementById('booking-live-review-grid');
      if (!reviewGrid) return;

      const d = this.collectBookingFormData();
      const msg = d.message || 'Standard spatial evaluation and energetic alignment requested.';

      const rows = [
        { label: 'Client Name', value: d.name || '—', step: 1 },
        { label: 'WhatsApp & Contact', value: d.phone || '—', step: 1 },
        { label: 'Email Address', value: d.email || '—', step: 1 },
        { label: 'Consultation Package', value: d.serviceName || '—', step: 2 },
        { label: 'Confirmed Payable Fee (INR)', value: `₹${d.confirmedAmount.toLocaleString('en-IN')}`, step: 2, highlight: true },
        { label: 'Property Type & Location', value: `${d.propertyType} • ${d.city || '—'}`, step: 2 },
        { label: 'Consultation Mode', value: d.consultationMode, step: 3 },
        { label: 'Preferred Schedule', value: `${d.appointmentDate || '—'} (${d.appointmentTime.split('•')[0].trim()})`, step: 3 }
      ];

      reviewGrid.innerHTML = `
        ${rows.map(r => `
          <div class="p-4 rounded-2xl ${r.highlight ? 'bg-[#481C25]/55 border-[#F9E29B]/55' : 'bg-[#12080B]/80 border-[#C6A15B]/25'} border flex items-start justify-between gap-3">
            <div>
              <span class="text-[10px] uppercase tracking-[0.18em] text-[#C6A15B] font-bold block mb-1">${r.label}</span>
              <span class="text-xs sm:text-sm ${r.highlight ? 'text-[#F9E29B] font-serif font-bold text-base' : 'text-[#F8F3E9] font-medium'}">${r.value}</span>
            </div>
            <button type="button" data-edit-booking-step="${r.step}" class="text-[10px] uppercase tracking-wider text-[#F9E29B] hover:underline font-serif shrink-0">Edit</button>
          </div>
        `).join('')}
        <div class="md:col-span-2 p-4 rounded-2xl bg-[#12080B]/80 border border-[#C6A15B]/25 flex items-start justify-between gap-3">
          <div>
            <span class="text-[10px] uppercase tracking-[0.18em] text-[#C6A15B] font-bold block mb-1">Specific Spatial Priorities / Notes</span>
            <p class="text-xs text-[#DCCBB0] leading-relaxed font-light">${msg}</p>
          </div>
          <button type="button" data-edit-booking-step="3" class="text-[10px] uppercase tracking-wider text-[#F9E29B] hover:underline font-serif shrink-0">Edit</button>
        </div>
      `;

      reviewGrid.querySelectorAll('[data-edit-booking-step]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const targetStep = parseInt(e.currentTarget.getAttribute('data-edit-booking-step'), 10);
          this.setBookingWizardStep(targetStep);
        });
      });
    };

    this.setBookingWizardStep = (stepNumber) => {
      const target = Math.max(1, Math.min(4, stepNumber));
      this.currentBookingWizardStep = target;
      if (target - 1 > this.maxCompletedBookingStep) {
        this.maxCompletedBookingStep = target - 1;
      }

      showStepAlert('');

      // Toggle step panes
      const panes = form.querySelectorAll('[data-booking-step-pane]');
      panes.forEach(pane => {
        const paneStep = parseInt(pane.getAttribute('data-booking-step-pane'), 10);
        if (paneStep === target) {
          pane.classList.remove('hidden');
          if (window.gsap) {
            window.gsap.fromTo(pane, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
          }
        } else {
          pane.classList.add('hidden');
        }
      });

      // Update horizontal progress line & step nodes
      const progressLine = document.getElementById('booking-progress-line');
      if (progressLine) {
        const pct = ((target - 1) / 3) * 100;
        progressLine.style.width = `${pct}%`;
      }

      stepNodes.forEach(node => {
        const s = parseInt(node.getAttribute('data-booking-step-trigger'), 10);
        node.classList.remove('active', 'completed');
        if (s === target) {
          node.classList.add('active');
        } else if (s < target || s <= this.maxCompletedBookingStep) {
          node.classList.add('completed');
        }
      });

      // Update Footer Navigation Buttons
      const nextLabel = document.getElementById('booking-step-next-label');
      if (prevBtn) {
        if (target === 1) {
          prevBtn.classList.add('invisible');
        } else {
          prevBtn.classList.remove('invisible');
        }
      }

      if (nextBtn) {
        if (target === 4) {
          nextBtn.classList.add('hidden');
          this.populateLiveReviewGrid();
        } else {
          nextBtn.classList.remove('hidden');
          const labels = {
            1: 'Continue to Property Details',
            2: 'Continue to Preferences',
            3: 'Review Consultation Dossier'
          };
          if (nextLabel) nextLabel.textContent = labels[target] || 'Continue';
        }
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentBookingWizardStep > 1) {
          this.setBookingWizardStep(this.currentBookingWizardStep - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (validateUpToStep(this.currentBookingWizardStep)) {
          this.setBookingWizardStep(this.currentBookingWizardStep + 1);
        }
      });
    }

    stepNodes.forEach(node => {
      node.addEventListener('click', () => {
        const targetStep = parseInt(node.getAttribute('data-booking-step-trigger'), 10);
        if (targetStep <= this.currentBookingWizardStep) {
          this.setBookingWizardStep(targetStep);
        } else if (validateUpToStep(targetStep - 1)) {
          this.setBookingWizardStep(targetStep);
        }
      });
    });

    // Primary Online Payment Button on Step 04 ("Proceed to Online Payment (UPI / Razorpay)")
    const proceedPayBtn = document.getElementById('booking-proceed-payment-btn');
    if (proceedPayBtn) {
      proceedPayBtn.addEventListener('click', async () => {
        if (!validateUpToStep(3)) return;
        const bookingData = this.collectBookingFormData();
        proceedPayBtn.disabled = true;
        const origHtml = proceedPayBtn.innerHTML;
        proceedPayBtn.innerHTML = `<span>Creating Booking Reference...</span>`;

        try {
          const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
          });
          const data = await res.json();
          const savedBooking = (data && data.booking) || {
            ...bookingData,
            id: `VS-2026-${Math.floor(1000 + Math.random() * 9000)}`
          };
          const matchedPkg = (VASTU_DATA.packages || []).find(p => p.id === savedBooking.packageId) || {
            id: savedBooking.packageId,
            name: savedBooking.packageName,
            price: savedBooking.amount,
            rawPrice: savedBooking.amountPayable
          };
          this.openOnlinePaymentPortal(savedBooking, matchedPkg);
        } catch (err) {
          const fallbackBooking = {
            ...bookingData,
            id: `VS-2026-${Math.floor(1000 + Math.random() * 9000)}`
          };
          this.openOnlinePaymentPortal(fallbackBooking, null);
        } finally {
          proceedPayBtn.disabled = false;
          proceedPayBtn.innerHTML = origHtml;
        }
      });
    }

    const modal = document.getElementById('whatsapp-review-modal');
    const previewContent = document.getElementById('whatsapp-preview-content');
    const closeBtn = document.getElementById('whatsapp-review-close');
    const editBtn = document.getElementById('whatsapp-edit-btn');
    const sendBtn = document.getElementById('whatsapp-send-btn');
    const statusNotice = document.getElementById('whatsapp-handoff-status');

    let currentPayload = null;
    let formattedMessage = '';

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateUpToStep(3)) {
        return;
      }

      currentPayload = this.collectBookingFormData();

      formattedMessage = 
`*VASTU SUTRAM – CONSULTATION ENQUIRY DOSSIER*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• *Client Name:* ${currentPayload.name}
• *WhatsApp Number:* ${currentPayload.phone}
• *Email Address:* ${currentPayload.email}
• *Consultation Package:* ${currentPayload.serviceName}
• *Confirmed Payable Fee:* ${currentPayload.amount}
• *Property Type:* ${currentPayload.propertyType}
• *Location / City:* ${currentPayload.city}
• *Consultation Mode:* ${currentPayload.consultationMode}
• *Preferred Date:* ${currentPayload.appointmentDate}
• *Preferred Time Slot:* ${currentPayload.appointmentTime.split('•')[0].trim()}
• *Client Query / Specific Concerns:*
${currentPayload.message ? currentPayload.message : 'Standard spatial evaluation and energetic alignment requested.'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Platform:* https://vastu-sutram.vercel.app`;

      if (previewContent) {
        previewContent.textContent = formattedMessage;
      }

      if (statusNotice) statusNotice.classList.add('hidden');
      if (modal) modal.classList.remove('hidden');
    });

    const closeModal = () => {
      if (modal) modal.classList.add('hidden');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (editBtn) editBtn.addEventListener('click', closeModal);

    if (sendBtn) {
      sendBtn.addEventListener('click', async () => {
        const cleanNumber = '918145715755';
        const encodedText = encodeURIComponent(formattedMessage);
        const waUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedText}`;

        // Open WhatsApp in new window/tab
        window.open(waUrl, '_blank', 'noopener,noreferrer');

        if (statusNotice) {
          statusNotice.classList.remove('hidden');
        }

        // Persist booking to backend database
        try {
          if (currentPayload) {
            await fetch('/api/bookings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(currentPayload)
            });
          }
        } catch (err) {
          console.warn('Booking record logged locally:', err);
        }
      });
    }
  }

  // 13. COMPLETE ONLINE PAYMENT INTEGRATION (STATE BANK OF INDIA UPI + RAZORPAY)
  initRazorpayPayment() {
    const modal = document.getElementById('razorpay-modal');
    const closeBtn = document.getElementById('razorpay-modal-close');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }

    // Attach to package card "Instant Online Payment / Gateway" buttons
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-book-package-id]');
      if (!target) return;

      const pkgId = target.getAttribute('data-book-package-id');
      const pkg = (VASTU_DATA.packages || []).find(p => p.id === pkgId);
      if (!pkg) return;

      // Also pre-fill the booking form in the background so customer details stay synced
      const existingFormData = typeof this.collectBookingFormData === 'function'
        ? this.collectBookingFormData()
        : {};

      const initialBooking = {
        id: `VS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        name: existingFormData.name || '',
        phone: existingFormData.phone || '',
        whatsapp: existingFormData.whatsapp || '',
        email: existingFormData.email || '',
        city: existingFormData.city || '',
        propertyType: existingFormData.propertyType || 'Residential Property',
        packageId: pkg.id,
        packageName: pkg.name,
        consultationMode: existingFormData.consultationMode || pkg.mode || 'Online Video Consultation',
        appointmentDate: existingFormData.appointmentDate || new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
        appointmentTime: existingFormData.appointmentTime || '11:30 AM - 12:30 PM',
        amountPayable: pkg.rawPrice || 11000,
        confirmedAmount: pkg.rawPrice || 11000
      };

      this.openOnlinePaymentPortal(initialBooking, pkg);
    });
  }

  openOnlinePaymentPortal(bookingRecord, pkg) {
    const modal = document.getElementById('razorpay-modal');
    const modalContent = document.getElementById('razorpay-modal-content');
    if (!modal || !modalContent) return;

    const booking = bookingRecord || {};
    const bookingRef = booking.id || booking.bookingId || `VS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const packageName = (pkg && pkg.name) || booking.packageName || 'Complete Home Vastu Analysis';
    const packageId = (pkg && pkg.id) || booking.packageId || 'pkg-res-complete';
    const startingPriceLabel = (pkg && pkg.price) || `Starting from ₹${(booking.amountPayable || 11000).toLocaleString('en-IN')}`;
    let confirmedAmount = Math.max(
      1,
      Math.round(Number(booking.amountPayable || booking.confirmedAmount || (pkg && pkg.rawPrice) || 11000))
    );

    const buildUpiDeepLink = (amountInr, refId) => {
      const cleanAmt = Number(amountInr || 5100).toFixed(2);
      return `upi://pay?pa=gauriomji@oksbi&pn=${encodeURIComponent('Vastu Sutram')}&am=${encodeURIComponent(cleanAmt)}&cu=INR&tn=${encodeURIComponent(refId)}`;
    };

    const buildQrCodeUrl = (upiUri) => {
      return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&color=12080B&bgcolor=FFFDF8&data=${encodeURIComponent(upiUri)}`;
    };

    const upiUri = buildUpiDeepLink(confirmedAmount, bookingRef);
    const qrUrl = buildQrCodeUrl(upiUri);

    modalContent.innerHTML = `
      <!-- Top Booking & Fee Summary Dossier -->
      <div class="p-5 rounded-2xl bg-[#12080B]/95 border border-[#C6A15B]/40 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C6A15B]/20 pb-3.5">
          <div>
            <span class="text-[10px] uppercase tracking-[0.2em] text-[#C6A15B] font-bold block">SELECTED CONSULTATION PACKAGE</span>
            <h4 class="font-serif text-lg sm:text-xl font-bold text-[#F8F3E9]">${packageName}</h4>
            <span class="text-[11px] text-[#DCCBB0]">${startingPriceLabel} • Currency: INR (₹)</span>
          </div>
          <div class="sm:text-right">
            <span class="text-[10px] uppercase tracking-[0.2em] text-[#C6A15B] font-bold block">BOOKING REFERENCE</span>
            <span id="pay-portal-ref" class="font-mono text-base sm:text-lg font-bold text-[#F9E29B] bg-[#481C25]/70 px-3 py-1 rounded-lg border border-[#C6A15B]/40 inline-block mt-0.5">${bookingRef}</span>
          </div>
        </div>

        <!-- Customer Details Row (Editable if not yet filled) -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label class="block text-[10px] uppercase tracking-wider text-[#C6A15B] font-semibold mb-1">Customer Name *</label>
            <input type="text" id="pay-cust-name" value="${(booking.name || '').replace(/"/g, '&quot;')}" placeholder="Enter Full Name" class="w-full px-3 py-2 rounded-xl bg-[#1B0D12] border border-[#C6A15B]/35 text-xs text-[#F8F3E9] outline-none focus:border-[#F9E29B]" />
          </div>
          <div>
            <label class="block text-[10px] uppercase tracking-wider text-[#C6A15B] font-semibold mb-1">Mobile / WhatsApp *</label>
            <input type="tel" id="pay-cust-phone" value="${(booking.phone || '').replace(/"/g, '&quot;')}" placeholder="+91 98765 43210" class="w-full px-3 py-2 rounded-xl bg-[#1B0D12] border border-[#C6A15B]/35 text-xs text-[#F8F3E9] outline-none focus:border-[#F9E29B]" />
          </div>
          <div>
            <label class="block text-[10px] uppercase tracking-wider text-[#C6A15B] font-semibold mb-1">Email Address *</label>
            <input type="email" id="pay-cust-email" value="${(booking.email || '').replace(/"/g, '&quot;')}" placeholder="client@example.com" class="w-full px-3 py-2 rounded-xl bg-[#1B0D12] border border-[#C6A15B]/35 text-xs text-[#F8F3E9] outline-none focus:border-[#F9E29B]" />
          </div>
        </div>

        <!-- Confirmed Payable Amount Control -->
        <div class="p-3.5 rounded-xl bg-[#481C25]/45 border border-[#C6A15B]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span class="text-[10px] uppercase tracking-[0.18em] text-[#F9E29B] font-bold block">CONFIRMED PAYABLE AMOUNT (INR)</span>
            <p class="text-[11px] text-[#DCCBB0] font-light">
              Package prices are starting prices. Confirm or adjust the exact agreed consultation fee below:
            </p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span class="font-serif text-lg font-bold text-[#F9E29B]">₹</span>
            <input
              type="number"
              id="pay-confirmed-amount-input"
              min="1"
              step="1"
              value="${confirmedAmount}"
              class="w-36 px-3 py-2 rounded-xl bg-[#12080B] border border-[#F9E29B]/60 font-mono text-base font-bold text-[#F9E29B] outline-none text-right"
            />
          </div>
        </div>
      </div>

      <!-- Payment Method Selector Tabs -->
      <div class="grid grid-cols-2 gap-3" role="tablist">
        <button
          type="button"
          id="tab-btn-upi"
          class="p-3.5 rounded-2xl border border-[#F9E29B] bg-[#481C25]/85 text-left transition-all flex items-center justify-between"
        >
          <div>
            <span class="text-[10px] uppercase tracking-[0.18em] text-[#F9E29B] font-bold block">OPTION A • DIRECT BANK UPI</span>
            <span class="font-serif text-sm font-bold text-[#F8F3E9]">Pay Using SBI UPI</span>
          </div>
          <span class="text-lg">📲</span>
        </button>

        <button
          type="button"
          id="tab-btn-razorpay"
          class="p-3.5 rounded-2xl border border-[#C6A15B]/30 bg-[#12080B]/75 hover:border-[#C6A15B]/60 text-left transition-all flex items-center justify-between"
        >
          <div>
            <span class="text-[10px] uppercase tracking-[0.18em] text-[#C6A15B] font-bold block">OPTION B • INSTANT GATEWAY</span>
            <span class="font-serif text-sm font-bold text-[#F8F3E9]">Pay Using Razorpay</span>
          </div>
          <span class="text-lg">💳</span>
        </button>
      </div>

      <!-- ========================================================== -->
      <!-- OPTION A PANEL: STATE BANK OF INDIA UPI (gauriomji@oksbi)  -->
      <!-- ========================================================== -->
      <div id="panel-pay-upi" class="p-5 rounded-2xl bg-[#12080B]/90 border border-[#C6A15B]/40 space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <!-- Left: Scannable Dynamic QR Code -->
          <div class="md:col-span-5 flex flex-col items-center text-center p-4 rounded-2xl bg-[#FFFDF8] text-[#171717] border-2 border-[#C6A15B] shadow-lg">
            <span class="text-[10px] uppercase tracking-[0.2em] font-bold text-[#481C25] mb-2">SCAN WITH ANY UPI APP</span>
            <img
              id="upi-dynamic-qr-img"
              src="${qrUrl}"
              alt="Vastu Sutram State Bank of India UPI QR Code (gauriomji@oksbi)"
              class="w-44 h-44 object-contain rounded-lg border border-[#C6A15B]/30"
            />
            <span class="text-[11px] font-mono font-bold text-[#481C25] mt-2">UPI ID: gauriomji@oksbi</span>
            <span class="text-[10px] text-[#171717]/75">GPay • PhonePe • Paytm • BHIM • SBI Pay</span>
          </div>

          <!-- Right: Verified Merchant UPI Credentials & Mobile Deep Link -->
          <div class="md:col-span-7 space-y-3.5 text-xs">
            <div class="p-3.5 rounded-xl bg-[#1B0D12] border border-[#C6A15B]/30 space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-[#DCCBB0]">Payee Name:</span>
                <strong class="text-[#F8F3E9] font-serif">Vastu Sutram</strong>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[#DCCBB0]">Official UPI ID:</span>
                <div class="flex items-center gap-2">
                  <strong class="text-[#F9E29B] font-mono text-sm">gauriomji@oksbi</strong>
                  <button type="button" id="copy-upi-id-btn" class="px-2 py-0.5 rounded bg-[#481C25] border border-[#C6A15B]/50 text-[10px] text-[#F9E29B] hover:bg-[#C6A15B] hover:text-[#12080B] transition-all">Copy</button>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[#DCCBB0]">Payment Provider:</span>
                <strong class="text-[#F8F3E9]">State Bank of India UPI</strong>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[#DCCBB0]">Exact Payable Amount:</span>
                <strong id="upi-amount-readout" class="text-[#F9E29B] font-serif text-base">₹${confirmedAmount.toLocaleString('en-IN')}</strong>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[#DCCBB0]">Booking Reference Note:</span>
                <strong class="text-[#F8F3E9] font-mono">${bookingRef}</strong>
              </div>
            </div>

            <!-- Mobile Deep-Link Button -->
            <a
              id="upi-open-app-link"
              href="${upiUri}"
              class="vastu-pkg-cta-btn w-full py-3.5 px-5 rounded-full font-serif text-xs font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-2 text-center"
            >
              <span>📱 Open UPI App to Pay ₹<span id="upi-btn-amt">${confirmedAmount.toLocaleString('en-IN')}</span></span>
              <span>➔</span>
            </a>

            <!-- UTR / UPI Reference Submission for Admin Verification -->
            <div class="p-3.5 rounded-xl bg-[#181215] border border-[#C6A15B]/30 space-y-2.5">
              <label for="upi-utr-input" class="block text-[11px] font-serif text-[#F9E29B] font-semibold">
                Completed UPI Transfer? Enter 12-Digit UTR / UPI Reference No:
              </label>
              <div class="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  id="upi-utr-input"
                  placeholder="e.g. 431098765432 (Optional / Recommended)"
                  class="flex-1 px-3.5 py-2.5 rounded-xl bg-[#12080B] border border-[#C6A15B]/40 text-xs font-mono text-[#F8F3E9] outline-none focus:border-[#F9E29B]"
                />
                <button
                  type="button"
                  id="upi-submit-verification-btn"
                  class="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-serif text-xs font-bold uppercase tracking-wider transition-all shrink-0"
                >
                  Submit UPI Payment ➔
                </button>
              </div>
              <p class="text-[10px] text-[#DCCBB0]/80 leading-relaxed">
                <strong>Verification Policy:</strong> Direct UPI transfers to <span class="font-mono text-[#F9E29B]">gauriomji@oksbi</span> are recorded as <em>Manual Verification Required</em> and marked <em>Paid</em> once verified against State Bank of India settlement records.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================================== -->
      <!-- OPTION B PANEL: RAZORPAY CHECKOUT GATEWAY                  -->
      <!-- ========================================================== -->
      <div id="panel-pay-razorpay" class="hidden p-5 rounded-2xl bg-[#12080B]/90 border border-[#C6A15B]/40 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#C6A15B]/20">
          <div>
            <span class="text-[10px] uppercase tracking-[0.2em] text-[#C6A15B] font-bold block">INSTANT AUTOMATED VERIFICATION</span>
            <h5 class="font-serif text-base font-bold text-[#F8F3E9]">Razorpay Secure Checkout (256-Bit SSL)</h5>
          </div>
          <div class="flex flex-wrap gap-1.5 text-[10px] text-[#F9E29B]">
            <span class="px-2.5 py-1 rounded-full bg-[#481C25]/70 border border-[#C6A15B]/35">UPI / GPay / PhonePe</span>
            <span class="px-2.5 py-1 rounded-full bg-[#481C25]/70 border border-[#C6A15B]/35">Credit &amp; Debit Cards</span>
            <span class="px-2.5 py-1 rounded-full bg-[#481C25]/70 border border-[#C6A15B]/35">Net Banking</span>
          </div>
        </div>

        <p class="text-xs text-[#DCCBB0] font-light leading-relaxed">
          Pay securely via Razorpay using UPI, Visa/MasterCard/RuPay Cards, or Net Banking. Your payment signature is verified cryptographically on our server for instant booking confirmation.
        </p>

        <button
          type="button"
          id="razorpay-online-pay-btn"
          class="btn-gold-shimmer w-full py-4 rounded-full text-xs sm:text-sm font-serif font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-2.5 shadow-xl"
        >
          <span>💳 Pay ₹<span id="rzp-btn-amt">${confirmedAmount.toLocaleString('en-IN')}</span> via Razorpay Checkout</span>
          <span>➔</span>
        </button>
      </div>

      <!-- Status / Error Alert Box -->
      <div id="razorpay-status-message" class="hidden p-4 rounded-xl text-xs leading-relaxed"></div>
    `;

    modal.classList.remove('hidden');

    // Bind interactive elements inside the payment portal
    const amtInput = document.getElementById('pay-confirmed-amount-input');
    const qrImg = document.getElementById('upi-dynamic-qr-img');
    const upiReadout = document.getElementById('upi-amount-readout');
    const upiBtnAmt = document.getElementById('upi-btn-amt');
    const rzpBtnAmt = document.getElementById('rzp-btn-amt');
    const upiLink = document.getElementById('upi-open-app-link');
    const tabUpi = document.getElementById('tab-btn-upi');
    const tabRzp = document.getElementById('tab-btn-razorpay');
    const panelUpi = document.getElementById('panel-pay-upi');
    const panelRzp = document.getElementById('panel-pay-razorpay');
    const copyBtn = document.getElementById('copy-upi-id-btn');
    const upiSubmitBtn = document.getElementById('upi-submit-verification-btn');
    const rzpPayBtn = document.getElementById('razorpay-online-pay-btn');
    const statusBox = document.getElementById('razorpay-status-message');

    const getCustomerInputs = () => {
      const name = (document.getElementById('pay-cust-name')?.value || '').trim();
      const phone = (document.getElementById('pay-cust-phone')?.value || '').trim();
      const email = (document.getElementById('pay-cust-email')?.value || '').trim();
      return {
        name: name || booking.name || 'Valued Client',
        fullName: name || booking.name || 'Valued Client',
        phone: phone || booking.phone || '',
        whatsapp: phone || booking.whatsapp || booking.phone || '',
        email: email || booking.email || '',
        city: booking.city || '',
        propertyType: booking.propertyType || 'Residential Property',
        consultationMode: booking.consultationMode || 'Online Video Consultation',
        appointmentDate: booking.appointmentDate || '',
        appointmentTime: booking.appointmentTime || ''
      };
    };

    const showPortalAlert = (html, type = 'amber') => {
      if (!statusBox) return;
      const styles = {
        amber: 'p-4 rounded-xl bg-amber-950/75 border border-amber-400/45 text-xs text-amber-100 leading-relaxed',
        rose: 'p-4 rounded-xl bg-rose-950/75 border border-rose-400/45 text-xs text-rose-100 leading-relaxed',
        emerald: 'p-4 rounded-xl bg-emerald-950/75 border border-emerald-400/45 text-xs text-emerald-100 leading-relaxed'
      };
      statusBox.className = styles[type] || styles.amber;
      statusBox.innerHTML = html;
      statusBox.classList.remove('hidden');
    };

    if (amtInput) {
      amtInput.addEventListener('input', () => {
        const val = Math.max(1, Math.round(Number(amtInput.value || 1)));
        confirmedAmount = val;
        const formatted = val.toLocaleString('en-IN');
        if (upiReadout) upiReadout.textContent = `₹${formatted}`;
        if (upiBtnAmt) upiBtnAmt.textContent = formatted;
        if (rzpBtnAmt) rzpBtnAmt.textContent = formatted;
        const nextUri = buildUpiDeepLink(val, bookingRef);
        if (upiLink) upiLink.setAttribute('href', nextUri);
        if (qrImg) qrImg.setAttribute('src', buildQrCodeUrl(nextUri));
      });
    }

    if (tabUpi && tabRzp && panelUpi && panelRzp) {
      tabUpi.addEventListener('click', () => {
        panelUpi.classList.remove('hidden');
        panelRzp.classList.add('hidden');
        tabUpi.className = 'p-3.5 rounded-2xl border border-[#F9E29B] bg-[#481C25]/85 text-left transition-all flex items-center justify-between';
        tabRzp.className = 'p-3.5 rounded-2xl border border-[#C6A15B]/30 bg-[#12080B]/75 hover:border-[#C6A15B]/60 text-left transition-all flex items-center justify-between';
      });
      tabRzp.addEventListener('click', () => {
        panelRzp.classList.remove('hidden');
        panelUpi.classList.add('hidden');
        tabRzp.className = 'p-3.5 rounded-2xl border border-[#F9E29B] bg-[#481C25]/85 text-left transition-all flex items-center justify-between';
        tabUpi.className = 'p-3.5 rounded-2xl border border-[#C6A15B]/30 bg-[#12080B]/75 hover:border-[#C6A15B]/60 text-left transition-all flex items-center justify-between';
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText('gauriomji@oksbi');
        }
        copyBtn.textContent = 'Copied ✓';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
      });
    }

    // Option A Handler: Submit Direct SBI UPI Payment Reference (Marks Manual Verification Required)
    if (upiSubmitBtn) {
      upiSubmitBtn.addEventListener('click', async () => {
        const cust = getCustomerInputs();
        if (!cust.name || !cust.phone) {
          showPortalAlert('⚠️ Please enter your Full Name and Mobile / WhatsApp number above before submitting your UPI payment reference.', 'rose');
          return;
        }
        const utrVal = (document.getElementById('upi-utr-input')?.value || '').trim();
        upiSubmitBtn.disabled = true;
        upiSubmitBtn.textContent = 'Recording...';

        try {
          const res = await fetch('/api/payments/upi-submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId: bookingRef,
              packageId,
              packageName,
              confirmedAmount,
              utrNumber: utrVal || 'SUBMITTED-VIA-SBI-UPI',
              customerData: cust
            })
          });
          const data = await res.json();
          if (!res.ok || !data.success) {
            showPortalAlert(`⚠️ ${data.error || 'Could not record UPI submission.'}`, 'rose');
            upiSubmitBtn.disabled = false;
            upiSubmitBtn.textContent = 'Submit UPI Payment ➔';
            return;
          }
          this.renderPaymentConfirmationScreen(modalContent, data.booking, {
            isVerifiedPaid: false,
            isManualUpi: true
          });
        } catch (err) {
          showPortalAlert('⚠️ Network error while recording UPI reference. Please try again.', 'rose');
          upiSubmitBtn.disabled = false;
          upiSubmitBtn.textContent = 'Submit UPI Payment ➔';
        }
      });
    }

    // Option B Handler: Razorpay Order Creation & Cryptographic Signature Verification
    if (rzpPayBtn) {
      rzpPayBtn.addEventListener('click', async () => {
        const cust = getCustomerInputs();
        if (!cust.name || !cust.phone) {
          showPortalAlert('⚠️ Please enter your Full Name and Mobile / WhatsApp number above before initiating Razorpay checkout.', 'rose');
          return;
        }

        rzpPayBtn.disabled = true;
        const origLabel = rzpPayBtn.innerHTML;
        rzpPayBtn.innerHTML = `<span>Initializing Secure Razorpay Order...</span>`;

        try {
          const res = await fetch('/api/payments/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId: bookingRef,
              packageId,
              packageName,
              confirmedAmount,
              customerData: cust
            })
          });
          const orderData = await res.json();

          if (orderData.alreadyPaid) {
            showPortalAlert(`✓ ${orderData.error}`, 'emerald');
            rzpPayBtn.disabled = false;
            rzpPayBtn.innerHTML = origLabel;
            return;
          }

          if (orderData.setupMode) {
            showPortalAlert(`
              <strong class="block text-amber-300 mb-1">⚙️ Razorpay Credentials Required for Card/Gateway Checkout:</strong>
              ${orderData.message}
              <div class="mt-2 pt-2 border-t border-amber-400/25 flex flex-wrap items-center justify-between gap-2">
                <span class="text-[11px] text-[#F9E29B]">You can pay immediately right now using <strong>Option A: State Bank of India UPI (gauriomji@oksbi)</strong>.</span>
                <button type="button" id="switch-to-upi-tab-btn" class="px-3 py-1 rounded-lg bg-[#C6A15B] text-[#12080B] font-serif font-bold text-[11px] uppercase">Switch to SBI UPI QR ➔</button>
              </div>
            `, 'amber');
            const swBtn = document.getElementById('switch-to-upi-tab-btn');
            if (swBtn && tabUpi) swBtn.addEventListener('click', () => tabUpi.click());
            rzpPayBtn.disabled = false;
            rzpPayBtn.innerHTML = origLabel;
            return;
          }

          if (!orderData.success || !orderData.orderId) {
            showPortalAlert(`⚠️ ${orderData.error || 'Could not create Razorpay order.'}`, 'rose');
            rzpPayBtn.disabled = false;
            rzpPayBtn.innerHTML = origLabel;
            return;
          }

          if (!window.Razorpay) {
            showPortalAlert('⚠️ Razorpay Checkout SDK could not be loaded. Please check your internet connection or use Option A: State Bank of India UPI (gauriomji@oksbi).', 'rose');
            rzpPayBtn.disabled = false;
            rzpPayBtn.innerHTML = origLabel;
            return;
          }

          const options = {
            key: orderData.keyId,
            amount: orderData.amount,
            currency: orderData.currency || 'INR',
            name: 'Vastu Sutram',
            description: `${packageName} (${bookingRef})`,
            image: 'assets/logo-emblem.png',
            order_id: orderData.orderId,
            prefill: {
              name: cust.name,
              email: cust.email,
              contact: cust.phone
            },
            notes: {
              bookingReference: bookingRef,
              packageName
            },
            theme: { color: '#C6A15B' },
            handler: async (response) => {
              showPortalAlert('🔒 Verifying cryptographic payment signature with Vastu Sutram server...', 'amber');
              try {
                const verifyRes = await fetch('/api/payments/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    bookingId: bookingRef,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    confirmedAmount,
                    customerName: cust.name,
                    phone: cust.phone,
                    email: cust.email,
                    packageName
                  })
                });
                const verifyData = await verifyRes.json();
                if (verifyRes.ok && verifyData.verified) {
                  this.renderPaymentConfirmationScreen(modalContent, verifyData.booking, {
                    isVerifiedPaid: true,
                    isManualUpi: false
                  });
                } else {
                  showPortalAlert(`❌ Payment Verification Failed: ${verifyData.error || 'Signature mismatch.'} If any amount was debited, please contact vastusutram@gmail.com with reference ${bookingRef}.`, 'rose');
                  rzpPayBtn.disabled = false;
                  rzpPayBtn.innerHTML = origLabel;
                }
              } catch (verErr) {
                showPortalAlert('❌ Server verification request interrupted. Please contact support with your payment ID.', 'rose');
                rzpPayBtn.disabled = false;
                rzpPayBtn.innerHTML = origLabel;
              }
            },
            modal: {
              ondismiss: () => {
                rzpPayBtn.disabled = false;
                rzpPayBtn.innerHTML = origLabel;
              }
            }
          };

          const rzpInstance = new window.Razorpay(options);
          rzpInstance.on('payment.failed', (failResp) => {
            const errDesc = failResp?.error?.description || 'Transaction was declined or cancelled by the bank.';
            showPortalAlert(`❌ <strong>Payment Failed:</strong> ${errDesc} You may retry with Razorpay or use Option A: State Bank of India UPI (<span class="font-mono">gauriomji@oksbi</span>).`, 'rose');
            rzpPayBtn.disabled = false;
            rzpPayBtn.innerHTML = origLabel;
          });
          rzpInstance.open();
        } catch (err) {
          showPortalAlert(`⚠️ Unable to reach payment gateway: ${err.message}`, 'rose');
          rzpPayBtn.disabled = false;
          rzpPayBtn.innerHTML = origLabel;
        }
      });
    }
  }

  renderPaymentConfirmationScreen(container, booking, { isVerifiedPaid = false, isManualUpi = false } = {}) {
    if (!container || !booking) return;

    const paymentDate = new Date(booking.paidAt || booking.upiSubmittedAt || booking.createdAt || Date.now()).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    const amountFormatted = `₹${Number(booking.amountPayable || 0).toLocaleString('en-IN')}`;
    const txId = booking.transactionId || 'Pending';
    const paymentStatusBadge = isVerifiedPaid ? 'Paid' : (booking.paymentStatus || 'Manual Verification Required');
    const bookingStatusBadge = isVerifiedPaid ? 'Confirmed' : (booking.status || 'Pending Verification');

    const waMessage =
`Hello Vastu Sutram, I have completed my consultation payment.

Customer Name: ${booking.name || booking.fullName || ''}
Booking Reference: ${booking.id || ''}
Consultation Package: ${booking.packageName || ''}
Amount Paid: ${amountFormatted}
Transaction ID: ${txId}
Payment Method: ${booking.paymentMethod || ''}
Payment Status: ${paymentStatusBadge}
Preferred Date: ${booking.appointmentDate || 'As Scheduled'}`;

    const waUrl = `https://api.whatsapp.com/send?phone=918145715755&text=${encodeURIComponent(waMessage)}`;

    container.innerHTML = `
      <div class="text-center py-4 space-y-5" id="vastu-payment-receipt-card">
        <!-- Animated Golden Emblem Seal -->
        <div class="w-20 h-20 mx-auto rounded-full ${
          isVerifiedPaid
            ? 'bg-gradient-to-br from-[#D9A52D] via-[#FFF2C2] to-[#C6A15B] text-[#12080B] shadow-[0_0_40px_rgba(249,226,155,0.6)]'
            : 'bg-[#481C25] border-2 border-[#F9E29B] text-[#F9E29B] shadow-[0_0_30px_rgba(198,161,91,0.35)]'
        } flex items-center justify-center text-4xl font-bold">
          ${isVerifiedPaid ? '✓' : '⏳'}
        </div>

        <div>
          <span class="text-[10px] uppercase tracking-[0.24em] text-[#C6A15B] font-bold block mb-1">
            ${isVerifiedPaid ? 'OFFICIAL PAYMENT RECEIPT & CONFIRMATION' : 'DIRECT SBI UPI SUBMISSION RECORDED'}
          </span>
          <h3 class="font-serif text-2xl sm:text-3xl font-bold text-[#F9E29B]">
            ${isVerifiedPaid ? 'Payment Successful!' : 'Payment Reference Submitted'}
          </h3>
          <p class="text-xs sm:text-sm text-[#F8F3E9] font-serif italic mt-1">
            "Thank you for choosing Vastu Sutram."
          </p>
        </div>

        <!-- Detailed Receipt Grid -->
        <div class="p-5 rounded-2xl bg-[#12080B] border border-[#C6A15B]/45 text-left space-y-3 text-xs shadow-xl">
          <div class="flex items-center justify-between border-b border-[#C6A15B]/20 pb-3">
            <div class="flex items-center gap-2.5">
              <img src="assets/logo-emblem.png" alt="Vastu Sutram" class="h-9 w-auto object-contain original-brand-logo" />
              <div>
                <div class="font-serif font-bold text-sm text-[#F9E29B]">VASTU SUTRAM</div>
                <div class="text-[10px] text-[#C6A15B] tracking-widest uppercase">State Bank of India UPI • Razorpay</div>
              </div>
            </div>
            <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isVerifiedPaid
                ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-400/50'
                : 'bg-amber-950/90 text-amber-300 border border-amber-400/50'
            }">
              ${paymentStatusBadge}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div class="p-3 rounded-xl bg-[#1B0D12]/90 border border-[#C6A15B]/20">
              <span class="text-[10px] uppercase tracking-wider text-[#C6A15B] block">Customer Name</span>
              <strong class="text-sm text-[#F8F3E9]">${booking.name || booking.fullName || 'Client'}</strong>
            </div>
            <div class="p-3 rounded-xl bg-[#1B0D12]/90 border border-[#C6A15B]/20">
              <span class="text-[10px] uppercase tracking-wider text-[#C6A15B] block">Booking Reference ID</span>
              <strong class="text-sm font-mono text-[#F9E29B]">${booking.id}</strong>
            </div>
            <div class="p-3 rounded-xl bg-[#1B0D12]/90 border border-[#C6A15B]/20">
              <span class="text-[10px] uppercase tracking-wider text-[#C6A15B] block">Selected Package</span>
              <strong class="text-sm text-[#F8F3E9]">${booking.packageName || 'Vastu Consultation'}</strong>
            </div>
            <div class="p-3 rounded-xl bg-[#1B0D12]/90 border border-[#C6A15B]/20">
              <span class="text-[10px] uppercase tracking-wider text-[#C6A15B] block">${isVerifiedPaid ? 'Amount Paid' : 'Confirmed Payable Amount'}</span>
              <strong class="text-base font-serif text-[#F9E29B]">${amountFormatted}</strong>
            </div>
            <div class="p-3 rounded-xl bg-[#1B0D12]/90 border border-[#C6A15B]/20">
              <span class="text-[10px] uppercase tracking-wider text-[#C6A15B] block">Transaction / UTR ID</span>
              <strong class="text-xs font-mono text-[#F8F3E9] break-all">${txId}</strong>
            </div>
            <div class="p-3 rounded-xl bg-[#1B0D12]/90 border border-[#C6A15B]/20">
              <span class="text-[10px] uppercase tracking-wider text-[#C6A15B] block">Payment Date &amp; Status</span>
              <strong class="text-xs text-[#F8F3E9]">${paymentDate} • ${bookingStatusBadge}</strong>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-[#481C25]/40 border border-[#C6A15B]/30 text-[11px] text-[#DCCBB0] leading-relaxed">
            ${
              isVerifiedPaid
                ? `✓ Your payment has been cryptographically verified and your consultation booking is <strong>Confirmed</strong>. A confirmation record has been logged for <strong>${booking.email || 'your email'}</strong> from <strong>vastusutram@gmail.com</strong>.`
                : `⏳ Your direct UPI payment reference to <strong>gauriomji@oksbi</strong> (State Bank of India UPI) is recorded with status <strong>Manual Verification Required</strong>. Once verified by our administration, your booking status will be updated to <strong>Paid &amp; Confirmed</strong>.`
            }
          </div>
        </div>

        <!-- Action Buttons: WhatsApp Notification (+91 81457 15755) + Print Receipt -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href="${waUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-serif text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <span>💬 Send Payment Details on WhatsApp (+91 81457 15755)</span>
            <span>➔</span>
          </a>

          <button
            type="button"
            id="btn-print-payment-receipt"
            class="w-full sm:w-auto px-6 py-3.5 rounded-full border border-[#C6A15B]/60 text-[#F9E29B] hover:bg-[#481C25] font-serif text-xs font-semibold uppercase tracking-[0.14em] transition-all"
          >
            🖨️ Print Receipt
          </button>
        </div>
      </div>
    `;

    if (window.gsap) {
      window.gsap.fromTo(
        container.firstElementChild,
        { opacity: 0, scale: 0.95, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }

    const printBtn = document.getElementById('btn-print-payment-receipt');
    if (printBtn) {
      printBtn.addEventListener('click', () => window.print());
    }
  }

  // 14. CONTACT FORM
  initContactForm() {
    const form = document.getElementById('main-contact-form');
    if (!form) return;

    const feedback = document.getElementById('contact-form-feedback');
    const showFeedback = (text, isError = false) => {
      if (!feedback) {
        alert(text);
        return;
      }
      feedback.textContent = text;
      feedback.className = isError
        ? 'p-3.5 rounded-xl bg-rose-950/75 border border-rose-400/45 text-xs text-rose-200'
        : 'p-3.5 rounded-xl bg-emerald-950/75 border border-emerald-400/45 text-xs text-emerald-200';
      feedback.classList.remove('hidden');
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !phone || !email || !message) {
        showFeedback('Please fill out all required fields marked with *.', true);
        return;
      }

      try {
        const res = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, email, subject, message })
        });
        if (res.ok) {
          showFeedback('✓ Thank you! Your confidential enquiry has been received by Vastu Sutram. Our senior consultant will respond within 24 hours.');
          form.reset();
        } else {
          showFeedback('✓ Thank you! Your message has been logged for our consultation desk.');
          form.reset();
        }
      } catch (err) {
        showFeedback('✓ Thank you! Your message has been received.');
        form.reset();
      }
    });
  }

  // 13. FLOATING ELEMENTS & COMPASS
  initFloatingElements() {
    if (window.VastuCompass) {
      this.compassInstance = new VastuCompass('floating-compass-btn', 'floating-compass-modal');
    }

    // Quick Inquiry Drawer Toggle
    const inqBtn = document.getElementById('floating-inquiry-btn');
    const inqModal = document.getElementById('quick-inquiry-modal');
    const inqClose = document.getElementById('quick-inquiry-close');

    if (inqBtn && inqModal) {
      inqBtn.addEventListener('click', () => inqModal.classList.remove('hidden'));
    }
    if (inqClose && inqModal) {
      inqClose.addEventListener('click', () => inqModal.classList.add('hidden'));
    }

    const quickForm = document.getElementById('quick-inquiry-form');
    if (quickForm) {
      quickForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('quick-name').value;
        const phone = document.getElementById('quick-phone').value;
        const msg = document.getElementById('quick-message').value;

        try {
          await fetch('/api/inquiries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, message: msg, subject: 'Quick Floating Inquiry' })
          });
        } catch (err) {
          console.log(err);
        }
        alert('Thank you! Our consultation coordinator will contact you.');
        inqModal.classList.add('hidden');
        quickForm.reset();
      });
    }
  }

  // 14. MODAL MANAGEMENT
  initModals() {
    // Open Booking modal on any element with data-open-booking
    document.querySelectorAll('[data-open-booking]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openBookingModal();
      });
    });

    // Admin trigger
    const adminTrigger = document.getElementById('admin-modal-trigger');
    if (adminTrigger) {
      adminTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.openAdminModal();
      });
    }

    // Replay Intro trigger in footer / navbar
    document.querySelectorAll('[data-replay-intro]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.replayIntro();
      });
    });
  }

  openBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    if (!this.bookingInstance && window.VastuBookingSystem) {
      this.bookingInstance = new VastuBookingSystem('booking-modal-body');
    }
  }

  closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) modal.classList.add('hidden');
  }

  openAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    if (!this.adminInstance && window.VastuAdminDashboard) {
      this.adminInstance = new VastuAdminDashboard('admin-modal-body');
    }
  }

  closeAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) modal.classList.add('hidden');
  }

  bindGlobalEvents() {
    // Escape key closes open modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeBookingModal();
        this.closeAdminModal();
        const lb = document.getElementById('lightbox-modal');
        if (lb) lb.classList.add('hidden');
        const art = document.getElementById('article-modal');
        if (art) art.classList.add('hidden');
        const srv = document.getElementById('service-detail-modal');
        if (srv) srv.classList.add('hidden');
        const comp = document.getElementById('floating-compass-modal');
        if (comp) comp.classList.add('hidden');
      }
    });
  }
}

// Instantiate on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  window.VastuApp = new VastuApp();
});
