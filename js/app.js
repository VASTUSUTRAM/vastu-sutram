/**
 * VASTU SUTRAM – Master Application Core
 */

class VastuApp {
  constructor() {
    this.currentServiceTab = 'residential';
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

  // 1. INTRO
  initIntro() {
    const introContainer = document.getElementById('cinematic-intro-wrapper');
    if (!introContainer) return;

    // Check if user already skipped or seen intro this session
    const seen = sessionStorage.getItem('vastu_intro_seen');
    if (seen === 'true') {
      introContainer.style.display = 'none';
      return;
    }

    if (window.THREE && window.VastuCinematicIntro) {
      this.introInstance = new VastuCinematicIntro('cinematic-intro-wrapper');
    } else {
      introContainer.style.display = 'none';
    }
  }

  replayIntro() {
    const introContainer = document.getElementById('cinematic-intro-wrapper');
    if (!introContainer) return;
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

    // Particle system
    const particles = [];
    const particleCount = Math.min(width > 768 ? 100 : 40, 120);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * 0.02
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Subtle Golden Mandala Radial Center
      const grad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, Math.min(width, height) * 0.65);
      grad.addColorStop(0, 'rgba(198, 161, 91, 0.08)');
      grad.addColorStop(0.5, 'rgba(72, 28, 37, 0.05)');
      grad.addColorStop(1, 'rgba(18, 8, 11, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw Floating Gold Particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += Math.sin(Date.now() * p.pulse) * 0.005;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 226, 155, ${Math.max(0.1, Math.min(0.8, p.alpha))})`;
        ctx.shadowColor = '#D9A52D';
        ctx.shadowBlur = 8;
        ctx.fill();
      });

      requestAnimationFrame(render);
    }

    render();
  }

  // 4. PANCHABHUTAS (FIVE ELEMENTS)
  renderPanchabhutas() {
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

  // 6. SERVICES DIRECTORY
  renderServices() {
    const tabsContainer = document.getElementById('services-tabs');
    const gridContainer = document.getElementById('services-grid');
    if (!tabsContainer || !gridContainer) return;

    tabsContainer.innerHTML = VASTU_DATA.services.map(s => `
      <button data-service-tab="${s.id}" class="px-5 py-2.5 rounded-full font-serif text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
        this.currentServiceTab === s.id
          ? 'bg-gradient-to-r from-[#D9A52D] to-[#C6A15B] text-[#171717] shadow-lg shadow-[#C6A15B]/30'
          : 'border border-[#C6A15B]/30 text-[#DCCBB0] hover:bg-[#481C25]/50 hover:text-[#F8F3E9]'
      }">
        ${s.category}
      </button>
    `).join('');

    const activeService = VASTU_DATA.services.find(s => s.id === this.currentServiceTab) || VASTU_DATA.services[0];

    gridContainer.innerHTML = `
      <div class="col-span-full mb-6 p-6 rounded-2xl bg-gradient-to-r from-[#481C25]/70 via-[#171717]/80 to-[#12080B]/90 border border-[#C6A15B]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span class="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">${activeService.tagline}</span>
          <h3 class="font-serif text-2xl text-[#F8F3E9] font-bold mt-0.5">${activeService.category}</h3>
          <p class="text-xs text-[#DCCBB0] max-w-2xl mt-1 leading-relaxed">${activeService.description}</p>
        </div>
        <button data-book-service="${activeService.id}" class="px-6 py-3 rounded-full bg-[#C6A15B] text-[#171717] font-serif text-xs font-bold uppercase tracking-wider hover:bg-[#F9E29B] transition-all whitespace-nowrap">
          Book This Category ➔
        </button>
      </div>

      ${activeService.subServices.map(sub => `
        <div class="p-6 rounded-xl bg-[#171717]/80 backdrop-blur-md border border-[#C6A15B]/25 hover:border-[#C6A15B] transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
          <div>
            <div class="w-10 h-10 rounded-lg bg-[#481C25] border border-[#C6A15B]/30 flex items-center justify-center text-lg text-[#F9E29B] mb-4 group-hover:scale-110 transition-transform">
              🏛️
            </div>
            <h4 class="font-serif text-base font-bold text-[#F8F3E9] mb-2 group-hover:text-[#F9E29B] transition-colors">${sub.name}</h4>
            <p class="text-xs text-[#DCCBB0] leading-relaxed mb-6 font-light">${sub.desc}</p>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-[#C6A15B]/15">
            <button data-learn-more-service="${sub.name}" class="text-xs text-[#C6A15B] hover:text-[#F9E29B] font-medium flex items-center gap-1">
              <span>Learn More</span> <span>➔</span>
            </button>
            <button data-book-subservice="${sub.name}" class="px-4 py-1.5 rounded-full border border-[#C6A15B]/40 text-[11px] font-semibold text-[#F8F3E9] hover:bg-[#C6A15B] hover:text-[#171717] transition-all">
              Book
            </button>
          </div>
        </div>
      `).join('')}
    `;

    // Bind tab clicks
    tabsContainer.querySelectorAll('[data-service-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentServiceTab = e.currentTarget.getAttribute('data-service-tab');
        this.renderServices();
      });
    });

    // Bind Book triggers
    gridContainer.querySelectorAll('[data-book-service], [data-book-subservice]').forEach(btn => {
      btn.addEventListener('click', () => this.openBookingModal());
    });

    // Learn More modal trigger
    gridContainer.querySelectorAll('[data-learn-more-service]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const title = e.currentTarget.getAttribute('data-learn-more-service');
        this.openServiceDetailModal(title);
      });
    });
  }

  // 7. KNOWLEDGE EXPLORER & 3D CHAKRA
  initKnowledgeExplorer() {
    if (window.THREE && window.InteractiveVastuChakra) {
      this.chakraInstance = new InteractiveVastuChakra('chakra-3d-canvas', 'chakra-info-panel');
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

  // 8. CONSULTATION PACKAGES
  renderPackages() {
    const tabsContainer = document.getElementById('packages-tabs');
    const cardsContainer = document.getElementById('packages-cards');
    if (!tabsContainer || !cardsContainer) return;

    const categories = [
      { id: 'residential', label: 'Residential Packages' },
      { id: 'commercial', label: 'Commercial Packages' },
      { id: 'industrial', label: 'Industrial Packages' },
      { id: 'land', label: 'Land & Plot Packages' }
    ];

    tabsContainer.innerHTML = categories.map(c => `
      <button data-package-tab="${c.id}" class="px-5 py-2.5 rounded-full font-serif text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
        this.currentPackageTab === c.id
          ? 'bg-gradient-to-r from-[#D9A52D] to-[#C6A15B] text-[#171717] shadow-lg shadow-[#C6A15B]/30'
          : 'border border-[#C6A15B]/30 text-[#DCCBB0] hover:bg-[#481C25]/50 hover:text-[#F8F3E9]'
      }">
        ${c.label}
      </button>
    `).join('');

    const matched = VASTU_DATA.packages.filter(p => p.category === this.currentPackageTab);

    cardsContainer.innerHTML = matched.map(p => `
      <div class="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-[#171717] to-[#12080B] border border-[#C6A15B]/30 hover:border-[#C6A15B] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between shadow-xl relative overflow-hidden group">
        ${p.popular ? `<div class="absolute top-0 right-0 bg-gradient-to-l from-[#F9E29B] to-[#C6A15B] text-[#171717] text-[10px] uppercase font-bold tracking-widest px-4 py-1 rounded-bl-xl shadow-md">Most Preferred</div>` : ''}

        <div>
          <span class="text-[10px] uppercase tracking-widest font-semibold text-[#C6A15B] block mb-1">${p.duration} • ${p.mode}</span>
          <h3 class="font-serif text-xl font-bold text-[#F8F3E9] mb-3 group-hover:text-[#F9E29B] transition-colors">${p.name}</h3>
          
          <div class="mb-4">
            <span class="text-3xl font-serif font-bold text-[#F9E29B]">${p.price}</span>
            <span class="text-xs text-[#DCCBB0] block mt-0.5">${p.priceNote}</span>
          </div>

          <div class="w-full h-[1px] bg-[#C6A15B]/20 mb-6"></div>

          <ul class="space-y-2.5 text-xs text-[#F8F3E9]/85 mb-8">
            ${p.deliverables.map(d => `
              <li class="flex items-start gap-2">
                <span class="text-[#C6A15B] font-bold">✓</span>
                <span>${d}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <button data-book-package-id="${p.id}" class="w-full py-3 rounded-full bg-gradient-to-r from-[#D9A52D] via-[#F9E29B] to-[#C6A15B] text-[#171717] font-serif text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(217,165,45,0.6)] transition-all">
          Book This Package ➔
        </button>
      </div>
    `).join('');

    // Bind package tabs
    tabsContainer.querySelectorAll('[data-package-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentPackageTab = e.currentTarget.getAttribute('data-package-tab');
        this.renderPackages();
      });
    });

    // Bind Book buttons
    cardsContainer.querySelectorAll('[data-book-package-id]').forEach(btn => {
      btn.addEventListener('click', () => this.openBookingModal());
    });
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
        <img src="${post.image}" alt="${post.caption}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 text-left">
          <span class="text-[10px] text-[#F9E29B] font-serif font-bold uppercase tracking-wider">${post.tag}</span>
          <p class="text-[11px] text-[#F8F3E9] line-clamp-2 mt-1 leading-snug font-light">${post.caption}</p>
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

    content.innerHTML = `
      <div class="max-w-xl w-full p-6 rounded-2xl bg-[#171717] border border-[#C6A15B]/40 text-[#F8F3E9]">
        <div class="flex justify-between items-center border-b border-[#C6A15B]/20 pb-3 mb-4">
          <span class="text-xs uppercase tracking-widest text-[#C6A15B] font-bold">Consultation Service Detail</span>
          <button id="service-modal-close" class="text-lg text-[#C6A15B] hover:text-[#F8F3E9]">✕</button>
        </div>
        <h3 class="font-serif text-xl font-bold text-[#F9E29B] mb-3">${serviceTitle}</h3>
        <p class="text-xs text-[#DCCBB0] leading-relaxed mb-6 font-light">
          Our specialized consultation for <strong>${serviceTitle}</strong> includes comprehensive blueprint analysis, angular degree directional measurements, elemental conflict resolution, and non-demolition remedial guidelines designed to preserve architectural aesthetics while optimizing energetic flow.
        </p>
        <button id="btn-service-modal-book" class="w-full py-3 rounded-full bg-gradient-to-r from-[#D9A52D] to-[#C6A15B] text-[#171717] font-serif text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(198,161,91,0.5)]">
          Schedule Consultation for ${serviceTitle} ➔
        </button>
      </div>
    `;

    modal.classList.remove('hidden');
    document.getElementById('service-modal-close').addEventListener('click', () => modal.classList.add('hidden'));
    document.getElementById('btn-service-modal-book').addEventListener('click', () => {
      modal.classList.add('hidden');
      this.openBookingModal();
    });
  }

  // 12. WHATSAPP BOOKING DOSSIER & DIRECT CHAT
  initWhatsAppBookingForm() {
    const form = document.getElementById('whatsapp-consultation-form');
    if (!form) return;

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

      const name = document.getElementById('wa-name') ? document.getElementById('wa-name').value.trim() : '';
      const phone = document.getElementById('wa-phone') ? document.getElementById('wa-phone').value.trim() : '';
      const email = document.getElementById('wa-email') ? document.getElementById('wa-email').value.trim() : '';
      const consultationType = document.getElementById('wa-consultation-type') ? document.getElementById('wa-consultation-type').value : '';
      const propertyType = document.getElementById('wa-property-type') ? document.getElementById('wa-property-type').value : '';
      const city = document.getElementById('wa-city') ? document.getElementById('wa-city').value.trim() : '';
      const date = document.getElementById('wa-date') ? document.getElementById('wa-date').value : '';
      const timeSlot = document.getElementById('wa-time-slot') ? document.getElementById('wa-time-slot').value : '';
      const message = document.getElementById('wa-message') ? document.getElementById('wa-message').value.trim() : '';

      if (!name || !phone || !email || !city || !date) {
        alert('Please fill out all required fields marked with *.');
        return;
      }

      currentPayload = {
        name,
        phone,
        email,
        serviceName: consultationType,
        propertyType,
        city,
        appointmentDate: date,
        appointmentTime: timeSlot,
        message,
        source: 'WhatsApp Booking Form'
      };

      formattedMessage = 
`*VASTU SUTRAM – CONSULTATION ENQUIRY DOSSIER*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• *Client Name:* ${name}
• *WhatsApp Number:* ${phone}
• *Email Address:* ${email}
• *Consultation Type:* ${consultationType}
• *Property Type:* ${propertyType}
• *Location / City:* ${city}
• *Preferred Date:* ${date}
• *Preferred Time Slot:* ${timeSlot}
• *Client Query / Specific Concerns:*
${message ? message : 'Standard spatial evaluation and energetic alignment requested.'}
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
        const rawWaNumber = (VASTU_DATA.config && VASTU_DATA.config.whatsappNumber) || '919181457155';
        const cleanNumber = rawWaNumber.replace(/\D/g, '');
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

  // 13. RAZORPAY INTEGRATION & PAYMENT WORKFLOW
  initRazorpayPayment() {
    const modal = document.getElementById('razorpay-modal');
    const modalContent = document.getElementById('razorpay-modal-content');
    const closeBtn = document.getElementById('razorpay-modal-close');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }

    // Attach to package card buttons
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-book-package-id]');
      if (!target) return;

      const pkgId = target.getAttribute('data-book-package-id');
      const pkg = (VASTU_DATA.packages || []).find(p => p.id === pkgId);
      if (!pkg) return;

      if (!modal || !modalContent) {
        this.openBookingModal();
        return;
      }

      modalContent.innerHTML = `
        <div class="p-4 rounded-xl bg-[#121011] border border-[#C6A15B]/30 space-y-2">
          <div class="flex justify-between items-start">
            <div>
              <span class="text-[10px] uppercase tracking-widest text-[#C6A15B] font-bold">${pkg.duration} • ${pkg.mode}</span>
              <h4 class="font-serif text-lg font-bold text-[#F8F3E9]">${pkg.name}</h4>
            </div>
            <span class="font-serif text-lg font-bold text-[#F9E29B]">${pkg.price}</span>
          </div>
          <p class="text-xs text-[#DCCBB0] font-light">${pkg.priceNote || 'Comprehensive Vedic Architectural Evaluation'}</p>
        </div>

        <div class="space-y-3 pt-2">
          <button id="razorpay-online-pay-btn" class="w-full py-3.5 rounded-full bg-gradient-to-r from-[#D9A52D] via-[#F9E29B] to-[#C6A15B] text-[#171717] font-serif text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all flex items-center justify-center gap-2">
            <span>Pay with Razorpay (Card / UPI / NetBanking)</span>
            <span>💳</span>
          </button>

          <button id="razorpay-whatsapp-book-btn" class="w-full py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white font-serif text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
            <span>Book via WhatsApp & Direct Bank Transfer</span>
            <span>💬</span>
          </button>
        </div>

        <div id="razorpay-status-message" class="hidden p-3 rounded-lg text-xs leading-relaxed"></div>
      `;

      modal.classList.remove('hidden');

      const payBtn = document.getElementById('razorpay-online-pay-btn');
      const waBtn = document.getElementById('razorpay-whatsapp-book-btn');
      const statusBox = document.getElementById('razorpay-status-message');

      if (waBtn) {
        waBtn.addEventListener('click', () => {
          modal.classList.add('hidden');
          const rawWa = (VASTU_DATA.config && VASTU_DATA.config.whatsappNumber) || '9181457155';
          const cleanWa = rawWa.replace(/\D/g, '');
          const text = encodeURIComponent(`*VASTU SUTRAM – PACKAGE INQUIRY*\nI would like to book the *${pkg.name}* (${pkg.price}) consultation.`);
          window.open(`https://api.whatsapp.com/send?phone=${cleanWa}&text=${text}`, '_blank');
        });
      }

      if (payBtn) {
        payBtn.addEventListener('click', async () => {
          payBtn.disabled = true;
          payBtn.innerHTML = `<span>Checking Gateway Connection...</span>`;

          try {
            const res = await fetch('/api/razorpay/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ packageId: pkg.id, amount: 510000, currency: 'INR' })
            });
            const data = await res.json();

            if (data.setupMode) {
              statusBox.className = 'p-3 rounded-lg bg-amber-950/60 border border-amber-500/40 text-xs text-amber-200 mt-3 leading-relaxed';
              statusBox.innerHTML = `
                <strong class="block mb-1 text-amber-300">⚙️ Payment Gateway Setup Notice:</strong>
                ${data.message}<br/>
                <span class="text-[11px] text-[#DCCBB0] mt-1 block">To complete this consultation immediately without gateway delay, please click the <strong>Book via WhatsApp</strong> option above.</span>
              `;
              statusBox.classList.remove('hidden');
              payBtn.disabled = false;
              payBtn.innerHTML = `<span>Pay with Razorpay</span> <span>💳</span>`;
              return;
            }

            if (data.success && window.Razorpay) {
              const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: 'VASTU SUTRAM',
                description: pkg.name,
                order_id: data.orderId,
                handler: async function (response) {
                  await fetch('/api/razorpay/verify-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(response)
                  });
                  alert('Payment Successful! Reference ID: ' + response.razorpay_payment_id);
                  modal.classList.add('hidden');
                },
                theme: { color: '#C6A15B' }
              };
              const rzp = new window.Razorpay(options);
              rzp.open();
            }
          } catch (err) {
            statusBox.className = 'p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-200 mt-3';
            statusBox.textContent = 'Gateway connection initialized. Please complete via WhatsApp booking.';
            statusBox.classList.remove('hidden');
            payBtn.disabled = false;
            payBtn.innerHTML = `<span>Pay with Razorpay</span> <span>💳</span>`;
          }
        });
      }
    });
  }

  // 14. CONTACT FORM
  initContactForm() {
    const form = document.getElementById('main-contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !phone || !email || !message) {
        alert('Please fill out all required fields.');
        return;
      }

      try {
        const res = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, email, subject, message })
        });
        if (res.ok) {
          alert('Thank you! Your enquiry has been received. Our senior consultant will respond promptly.');
          form.reset();
        }
      } catch (err) {
        alert('Thank you! Your message has been received.');
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
