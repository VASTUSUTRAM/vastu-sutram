/**
 * VASTU SUTRAM – Premium Cinematic Brand Reveal & Hero Intro Animation
 * Exact 7-Step Sequential Luxury Motion Design (GSAP + Ambient Particle Canvas)
 *  1. Deep maroon cinematic background with subtle Vastu sacred geometry
 *  2. Soft golden ambient light reflections and floating golden particles
 *  3. Original Vastu Sutram logo fades in with a gentle zoom, light sweep & soft float
 *  4. VASTU SUTRAM brand name reveals below the logo in Champagne Gold serif
 *  5. "WHERE ANCIENT WISDOM MEETS HARMONIOUS LIVING." tagline reveals in Warm Ivory italic serif
 *  6. THE PRINCIPLES OF VASTU reveals with letter-by-letter animation & golden underline
 *  7. EXPLORE THE WEBSITE and BOOK A CONSULTATION buttons reveal with upward motion
 */

class VastuCinematicIntro {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.isDismissed = false;
    this.particles = [];
    this.animFrameId = null;
    this.reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.initDOM();
    this.initAmbientParticles();
    this.bindEvents();
    this.playSequence();
  }

  buildLetterSpans(text, className) {
    return text.split('').map(ch => {
      if (ch === ' ') {
        return `<span class="inline-block w-2 sm:w-3">&nbsp;</span>`;
      }
      return `<span class="${className} inline-block opacity-0" style="transform: translateX(-8px);">${ch}</span>`;
    }).join('');
  }

  initDOM() {
    const principlesHtml = this.buildLetterSpans('THE PRINCIPLES OF VASTU', 'intro-principle-char');

    this.container.innerHTML = `
      <div id="intro-stage" class="relative w-full h-full overflow-hidden cinematic-maroon-bg flex flex-col items-center justify-center px-5 py-10 select-none opacity-0">
        
        <!-- Step 1: Very Subtle Vastu Sacred Geometry Backdrop -->
        <div id="intro-sacred-geometry" class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0">
          <svg class="w-[620px] h-[620px] sm:w-[780px] sm:h-[780px] md:w-[920px] md:h-[920px] text-[#C6A15B] opacity-[0.055] animate-slow-spin" viewBox="0 0 600 600" fill="none">
            <circle cx="300" cy="300" r="280" stroke="currentColor" stroke-width="1" stroke-dasharray="4 6" />
            <circle cx="300" cy="300" r="235" stroke="currentColor" stroke-width="1" />
            <circle cx="300" cy="300" r="185" stroke="currentColor" stroke-width="0.8" />
            <circle cx="300" cy="300" r="125" stroke="currentColor" stroke-width="0.8" />
            <rect x="134" y="134" width="332" height="332" stroke="currentColor" stroke-width="0.9" />
            <rect x="134" y="134" width="332" height="332" stroke="currentColor" stroke-width="0.9" transform="rotate(45 300 300)" />
            <line x1="300" y1="20" x2="300" y2="580" stroke="currentColor" stroke-width="0.6" />
            <line x1="20" y1="300" x2="580" y2="300" stroke="currentColor" stroke-width="0.6" />
            <line x1="102" y1="102" x2="498" y2="498" stroke="currentColor" stroke-width="0.6" />
            <line x1="498" y1="102" x2="102" y2="498" stroke="currentColor" stroke-width="0.6" />
          </svg>
        </div>

        <!-- Step 2: Soft Golden Ambient Light Reflections & Floating Particles -->
        <div id="intro-ambient-glow" class="absolute inset-0 pointer-events-none opacity-0">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] sm:w-[540px] sm:h-[540px] rounded-full bg-[radial-gradient(circle,rgba(198,161,91,0.22)_0%,rgba(72,28,37,0.18)_48%,transparent_72%)] blur-2xl"></div>
          <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[180px] sm:w-[400px] sm:h-[260px] rounded-full bg-[radial-gradient(circle,rgba(249,226,155,0.16)_0%,transparent_70%)] blur-xl"></div>
        </div>

        <canvas id="intro-particles-canvas" class="absolute inset-0 w-full h-full pointer-events-none opacity-0"></canvas>

        <!-- Subtle Skip Option in Top Corner -->
        <div class="absolute top-5 right-5 sm:top-7 sm:right-8 z-50">
          <button id="skip-intro-btn" class="px-4 py-1.5 rounded-full text-[11px] font-serif uppercase tracking-[0.2em] text-[#DCCBB0]/80 hover:text-[#F9E29B] border border-[#C6A15B]/30 hover:border-[#C6A15B]/70 bg-[#18080D]/60 backdrop-blur-md transition-all">
            Skip Intro ➔
          </button>
        </div>

        <!-- Centerpiece Sequential Brand Reveal -->
        <div class="relative z-20 max-w-4xl w-full mx-auto flex flex-col items-center text-center">
          
          <!-- Step 3: Original Vastu Sutram Logo Reveal -->
          <div id="intro-logo-wrap" class=" opacity-0 mb-5 sm:mb-7" style="transform: scale(0.88);">
            <div class="logo-float-luxury logo-light-sweep px-4 py-2 flex items-center justify-center">
              <img
                src="assets/logo-emblem.png"
                alt="VASTU SUTRAM Original Logo"
                class="w-48 sm:w-60 md:w-72 lg:w-80 h-auto object-contain original-brand-logo"
              />
            </div>
          </div>

          <!-- Step 4: Brand Name Animation (VASTU SUTRAM) -->
          <h1
            id="intro-brand-name"
            class="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-[0.2em] sm:tracking-[0.24em] brand-title-gold opacity-0 mb-4 sm:mb-5 leading-tight"
            style="transform: translateY(26px);"
          >
            VASTU SUTRAM
          </h1>

          <!-- Step 5: Tagline Animation -->
          <p
            id="intro-tagline"
            class="font-editorial italic text-lg sm:text-2xl md:text-3xl text-[#F8F3E9] font-normal tracking-wide max-w-2xl mx-auto opacity-0 mb-6 sm:mb-7 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
            style="transform: translateY(20px);"
          >
            &ldquo;Where Ancient Wisdom Meets Harmonious Living.&rdquo;
          </p>

          <!-- Step 6: THE PRINCIPLES OF VASTU Animated Brand Statement + Golden Underline -->
          <div id="intro-principles-block" class="flex flex-col items-center mb-9 sm:mb-11">
            <div
              id="intro-principles-text"
              class="font-serif text-xs sm:text-sm md:text-base lg:text-lg text-[#E5C378] uppercase tracking-[0.28em] sm:tracking-[0.36em] font-semibold"
              aria-label="THE PRINCIPLES OF VASTU"
            >
              ${principlesHtml}
            </div>
            <!-- Subtle Golden Underline Animation -->
            <div class="relative w-48 sm:w-64 md:w-80 h-[2px] mt-3 flex items-center justify-center">
              <div
                id="intro-principles-line"
                class="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#C6A15B] to-transparent shadow-[0_0_12px_#F9E29B]"
                style="transform: scaleX(0); transform-origin: center;"
              ></div>
              <div
                id="intro-principles-diamond"
                class="absolute w-2 h-2 rotate-45 bg-[#F9E29B] shadow-[0_0_10px_#F9E29B] opacity-0"
              ></div>
            </div>
          </div>

          <!-- Step 7: Call-To-Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto px-4">
            <button
              id="btn-explore-website"
              class="vastu-cta-primary w-full sm:w-auto px-9 py-4 rounded-full font-serif text-xs sm:text-sm uppercase tracking-[0.2em] font-bold opacity-0"
              style="transform: translateY(22px);"
            >
              EXPLORE THE WEBSITE
            </button>
            <button
              id="btn-book-from-intro"
              class="vastu-cta-secondary w-full sm:w-auto px-9 py-4 rounded-full font-serif text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold opacity-0"
              style="transform: translateY(22px);"
            >
              BOOK A CONSULTATION
            </button>
          </div>

        </div>
      </div>
    `;
  }

  initAmbientParticles() {
    const canvas = document.getElementById('intro-particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    this.resizeHandler = resize;
    window.addEventListener('resize', this.resizeHandler);

    // Subtle count of peaceful golden particles (36 on desktop, 22 on mobile)
    const count = window.innerWidth < 768 ? 22 : 36;
    this.particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -(Math.random() * 0.28 + 0.08),
      alpha: Math.random() * 0.55 + 0.15,
      phase: Math.random() * Math.PI * 2
    }));

    const renderParticles = () => {
      if (this.isDismissed) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of this.particles) {
        if (!this.reducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.phase += 0.015;
          if (p.y < -10) p.y = canvas.height + 10;
          if (p.x < -10) p.x = canvas.width + 10;
          if (p.x > canvas.width + 10) p.x = -10;
        }

        const currentAlpha = p.alpha * (0.65 + 0.35 * Math.sin(p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 226, 155, ${currentAlpha.toFixed(3)})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(198, 161, 91, 0.6)';
        ctx.fill();
      }

      this.animFrameId = requestAnimationFrame(renderParticles);
    };

    renderParticles();
  }

  playSequence() {
    const stage = document.getElementById('intro-stage');
    const geometry = document.getElementById('intro-sacred-geometry');
    const glow = document.getElementById('intro-ambient-glow');
    const canvas = document.getElementById('intro-particles-canvas');
    const logo = document.getElementById('intro-logo-wrap');
    const brandName = document.getElementById('intro-brand-name');
    const tagline = document.getElementById('intro-tagline');
    const chars = document.querySelectorAll('.intro-principle-char');
    const line = document.getElementById('intro-principles-line');
    const diamond = document.getElementById('intro-principles-diamond');
    const btnExplore = document.getElementById('btn-explore-website');
    const btnBook = document.getElementById('btn-book-from-intro');

    // Reduced-motion accessibility fallback
    if (this.reducedMotion || !window.gsap) {
      [stage, geometry, glow, canvas, logo, brandName, tagline, diamond, btnExplore, btnBook].forEach(el => {
        if (el) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
      if (line) line.style.transform = 'scaleX(1)';
      chars.forEach(c => {
        c.style.opacity = '1';
        c.style.transform = 'none';
      });
      return;
    }

    const tl = window.gsap.timeline({ defaults: { ease: 'power3.out' } });
    this.timeline = tl;

    // 1. Deep maroon cinematic background appears
    tl.to(stage, { opacity: 1, duration: 0.7, ease: 'power2.inOut' }, 0)
      .to(geometry, { opacity: 1, duration: 1.4, ease: 'power2.out' }, 0.15)

    // 2. Soft golden ambient light and particles appear
      .to([glow, canvas], { opacity: 1, duration: 1.4, ease: 'power2.out' }, 0.35)

    // 3. Original Vastu Sutram logo fades in with a gentle zoom
      .to(logo, { opacity: 1, scale: 1, duration: 1.7, ease: 'power2.out' }, 0.75)

    // 4. VASTU SUTRAM appears below the logo
      .to(brandName, { opacity: 1, y: 0, duration: 1.25 }, 1.95)

    // 5. Tagline appears with an elegant text reveal
      .to(tagline, { opacity: 1, y: 0, duration: 1.2 }, 2.75)

    // 6. THE PRINCIPLES OF VASTU appears with animated lettering + golden underline
      .to(chars, {
        opacity: 1,
        x: 0,
        duration: 0.55,
        stagger: 0.032,
        ease: 'power2.out'
      }, 3.55)
      .to(line, {
        scaleX: 1,
        duration: 0.9,
        ease: 'power2.inOut'
      }, 4.0)
      .to(diamond, {
        opacity: 1,
        duration: 0.5
      }, 4.35)

    // 7. Explore the Website and Book a Consultation buttons appear
      .to([btnExplore, btnBook], {
        opacity: 1,
        y: 0,
        duration: 1.0,
        stagger: 0.18,
        ease: 'power3.out'
      }, 4.65);
  }

  bindEvents() {
    const skipBtn = document.getElementById('skip-intro-btn');
    const exploreBtn = document.getElementById('btn-explore-website');
    const bookBtn = document.getElementById('btn-book-from-intro');

    if (skipBtn) {
      skipBtn.addEventListener('click', () => this.finishIntro(false));
    }
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => this.finishIntro(false));
    }
    if (bookBtn) {
      bookBtn.addEventListener('click', () => this.finishIntro(true));
    }
  }

  finishIntro(openBooking = false) {
    if (this.isDismissed) return;
    this.isDismissed = true;

    if (this.timeline) {
      this.timeline.kill();
    }
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }

    this.container.style.transition = 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)';
    this.container.style.opacity = '0';
    this.container.style.transform = 'scale(1.02)';
    this.container.style.pointerEvents = 'none';

    // Trigger the Hero section sequence smoothly as the overlay unveils
    if (window.VastuApp && typeof window.VastuApp.playHeroReveal === 'function') {
      window.VastuApp.playHeroReveal();
    }

    setTimeout(() => {
      this.container.style.display = 'none';
      if (openBooking) {
        const bookingSection = document.getElementById('booking-section');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
        } else if (window.VastuApp) {
          window.VastuApp.openBookingModal();
        }
      }
    }, 850);
  }
}

window.VastuCinematicIntro = VastuCinematicIntro;
