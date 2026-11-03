/**
 * VASTU SUTRAM – ULTIMATE CINEMATIC 3D WEBSITE INTRODUCTION
 * Two-Part Connected Luxury 3D & Brand Film (Three.js + GSAP)
 *
 * PART 1 – THE CINEMATIC VASTU PROTECTION STORY (Scenes 1–5):
 *   Scene 1 (0.0s – 2.2s): Mysterious deep burgundy/maroon atmosphere, golden floating particles, camera glides forward.
 *   Scene 2 (2.2s – 5.5s): Ancient Vedic Civilization 3D Vastu Chakra (aged Chola bronze, temple copper, oxidized gold patina, carved Devanagari / Sanskrit rings, 81-Pada mandala, 32 Padavinyasa pillars & sacred Yantra) emerges from the distance, rotating in 3D space.
 *   Scene 3 (5.5s – 8.8s): Architectural 3D Indian contemporary luxury residence reveals from an aerial three-quarter angle with warm interior lighting.
 *   Scene 4 (8.8s – 16.0s): House transitions into an architectural cutaway view; the 3D Ancient Vastu Chakra enters through the main entrance into the central Brahmasthan, expands into a golden mandala, illuminates all 8 directions sequentially, spreads golden energy lines, and forms a refined transparent golden protective dome around the residence ("WHERE BALANCE BEGINS, HARMONY FOLLOWS.").
 *   Scene 5 (16.0s – 18.2s): Camera zooms out, golden particles converge into a luminous circular golden light that expands and dissolves seamlessly into the deep maroon brand stage.
 *
 * PART 2 – VASTU SUTRAM PREMIUM BRAND INTRODUCTION (Scenes 6–10):
 *   Scene 6 (18.2s – 20.0s): Original Vastu Sutram logo (assets/logo-emblem.png) reveals in center with gentle zoom, light sweep & soft float.
 *   Scene 7 (20.0s – 21.4s): VASTU SUTRAM reveals directly below the logo in large champagne-gold serif typography.
 *   Scene 8 (21.4s – 22.7s): "WHERE ANCIENT WISDOM MEETS HARMONIOUS LIVING." reveals in warm ivory italic serif.
 *   Scene 9 (22.7s – 24.0s): THE PRINCIPLES OF VASTU staggered letter-by-letter reveal + animated golden underline with uniform letter-spacing.
 *   Scene 10 (24.0s – 25.2s): EXPLORE THE WEBSITE and BOOK A CONSULTATION buttons reveal smoothly.
 */

class VastuCinematicIntro {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.isDismissed = false;
    this.isMobile = window.innerWidth < 768;
    this.reducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Three.js state
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = window.THREE ? new THREE.Clock() : null;
    this.animFrameId = null;

    // 3D Story Objects
    this.ambientParticles = null;
    this.chakraGroup = null;
    this.chakraWheel = null;
    this.chakraOuterScriptRing = null;
    this.chakraDirectionBeams = [];
    this.chakraDirectionNodes = [];
    this.houseGroup = null;
    this.houseRoofGroup = null;
    this.houseWindows = [];
    this.energyLinesGroup = null;
    this.energyBeamMat = null;
    this.protectiveDome = null;
    this.protectiveWire = null;
    this.protectiveBaseRing = null;

    // Animation state proxies driven by GSAP
    this.animState = {
      camX: 0,
      camY: 2.2,
      camZ: 28,
      lookX: 0,
      lookY: 0.5,
      lookZ: 0,
      chakraSpinSpeed: 0.55,
      chakraGlow: 0.35,
      houseWarmth: 0,
      cutawayProgress: 0,
      energyPulse: 0,
      domeProgress: 0,
      vortexGather: 0
    };

    this.initDOM();
    this.bindEvents();

    if (this.reducedMotion || !window.THREE || !window.gsap) {
      this.showBrandStageImmediately();
    } else {
      this.initThreeScene();
      this.buildMasterTimeline();
    }
  }

  buildLetterSpans(text, className) {
    // Use standard inline spans (not inline-block) so browser kerning & CSS letter-spacing remain 100% uniform
    return text
      .split('')
      .map((ch) => {
        if (ch === ' ') {
          return `<span class="inline">&nbsp;</span>`;
        }
        return `<span class="${className} inline opacity-0">${ch}</span>`;
      })
      .join('');
  }

  buildWordSpans(text, className) {
    return text
      .split(' ')
      .map(
        (word) =>
          `<span class="${className} inline-block opacity-0 mr-1.5 sm:mr-2" style="transform: translateY(14px);">${word}</span>`
      )
      .join('');
  }

  initDOM() {
    const principlesHtml = this.buildLetterSpans(
      'THE PRINCIPLES OF VASTU',
      'intro-principle-char'
    );
    const taglineWordsHtml = this.buildWordSpans(
      '“WHERE ANCIENT WISDOM MEETS HARMONIOUS LIVING.”',
      'intro-tagline-word'
    );

    this.container.innerHTML = `
      <div id="intro-stage" class="relative w-full h-full overflow-hidden cinematic-maroon-bg flex items-center justify-center select-none">
        
        <!-- 3D WebGL Stage for Part 1 (Ancient Vastu Chakra & Architectural House Story) -->
        <div id="intro-3d-webgl-container" class="absolute inset-0 w-full h-full z-10 pointer-events-none"></div>

        <!-- Subtle Vastu Sacred Geometry Backdrop (Part 2 Brand Stage) -->
        <div id="intro-sacred-geometry" class="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-0">
          <svg class="w-[600px] h-[600px] sm:w-[780px] sm:h-[780px] md:w-[920px] md:h-[920px] text-[#C6A15B] opacity-[0.06] animate-slow-spin" viewBox="0 0 600 600" fill="none">
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

        <!-- Golden Circular Light Transition Portal (Connects Part 1 -> Part 2) -->
        <div id="intro-golden-portal" class="absolute inset-0 flex items-center justify-center pointer-events-none z-20 opacity-0">
          <div id="intro-golden-orb" class="w-24 h-24 rounded-full bg-[radial-gradient(circle,rgba(255,248,220,0.95)_0%,rgba(249,226,155,0.75)_32%,rgba(198,161,91,0.35)_62%,transparent_80%)] blur-md"></div>
        </div>

        <!-- Soft Golden Ambient Light Reflections (Part 2 Brand Stage) -->
        <div id="intro-ambient-glow" class="absolute inset-0 pointer-events-none z-10 opacity-0">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] sm:w-[560px] sm:h-[560px] rounded-full bg-[radial-gradient(circle,rgba(198,161,91,0.24)_0%,rgba(72,28,37,0.22)_48%,transparent_72%)] blur-2xl"></div>
          <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[180px] sm:w-[420px] sm:h-[260px] rounded-full bg-[radial-gradient(circle,rgba(249,226,155,0.18)_0%,transparent_70%)] blur-xl"></div>
        </div>

        <!-- Scene 4 Symbolic Caption ("WHERE BALANCE BEGINS, HARMONY FOLLOWS.") -->
        <div id="intro-story-caption-wrap" class="absolute bottom-12 sm:bottom-14 inset-x-0 z-30 flex flex-col items-center justify-center text-center px-6 pointer-events-none opacity-0" style="transform: translateY(16px);">
          <div class="px-6 py-3 rounded-full bg-[#16070B]/80 backdrop-blur-md border border-[#C6A15B]/45 shadow-[0_0_30px_rgba(198,161,91,0.25)]">
            <p id="intro-story-caption" class="font-serif text-xs sm:text-sm md:text-base tracking-[0.26em] uppercase text-[#F9E29B] font-semibold">
              &ldquo;WHERE BALANCE BEGINS, HARMONY FOLLOWS.&rdquo;
            </p>
          </div>
          <span class="text-[10px] sm:text-[11px] text-[#DCCBB0]/75 font-light tracking-widest uppercase mt-2">
            Symbolic Architectural Representation of Vastu Mandala Alignment
          </span>
        </div>

        <!-- PART 2: VASTU SUTRAM PREMIUM BRAND INTRODUCTION (Scenes 6–10) -->
        <div id="intro-brand-stage" class="relative z-30 max-w-4xl w-full mx-auto flex flex-col items-center justify-center text-center px-5 py-8 pointer-events-none">
          
          <!-- Scene 6: Original Vastu Sutram Logo Reveal -->
          <div id="intro-logo-wrap" class="opacity-0 mb-5 sm:mb-7" style="transform: scale(0.86);">
            <div class="logo-float-luxury logo-light-sweep px-4 py-2 flex items-center justify-center relative">
              <div class="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(249,226,155,0.22)_0%,transparent_70%)] blur-xl pointer-events-none"></div>
              <img
                src="assets/logo-emblem.png"
                alt="VASTU SUTRAM Original Logo"
                class="w-48 sm:w-60 md:w-72 lg:w-80 h-auto object-contain original-brand-logo relative z-10"
              />
            </div>
          </div>

          <!-- Scene 7: Brand Name Animation (VASTU SUTRAM) -->
          <h1
            id="intro-brand-name"
            class="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] brand-title-gold opacity-0 mb-4 sm:mb-5 leading-tight text-center"
            style="transform: translateY(28px);"
          >
            VASTU SUTRAM
          </h1>

          <!-- Scene 8: Tagline Reveal ("WHERE ANCIENT WISDOM MEETS HARMONIOUS LIVING.") -->
          <p
            id="intro-tagline"
            class="font-editorial italic text-lg sm:text-2xl md:text-3xl text-[#F8F3E9] font-normal tracking-wide max-w-2xl mx-auto mb-6 sm:mb-7 leading-relaxed text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]"
          >
            ${taglineWordsHtml}
          </p>

          <!-- Scene 9: THE PRINCIPLES OF VASTU Staggered Letter Reveal + Golden Underline -->
          <div id="intro-principles-block" class="w-full flex flex-col items-center justify-center text-center mb-9 sm:mb-11">
            <div
              id="intro-principles-text"
              class="font-serif text-xs sm:text-sm md:text-base lg:text-lg text-[#E5C378] uppercase tracking-[0.28em] sm:tracking-[0.34em] pl-[0.28em] sm:pl-[0.34em] font-semibold text-center whitespace-nowrap"
              aria-label="THE PRINCIPLES OF VASTU"
            >
              ${principlesHtml}
            </div>
            <div class="relative w-52 sm:w-68 md:w-80 h-[2px] mt-3.5 flex items-center justify-center mx-auto">
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

          <!-- Scene 10: Call-To-Action Buttons -->
          <div id="intro-cta-buttons" class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto px-4 pointer-events-auto">
            <button
              id="btn-explore-website"
              type="button"
              class="vastu-cta-primary w-full sm:w-auto px-9 py-4 rounded-full font-serif text-xs sm:text-sm uppercase tracking-[0.2em] font-bold opacity-0"
              style="transform: translateY(22px);"
            >
              EXPLORE THE WEBSITE
            </button>
            <button
              id="btn-book-from-intro"
              type="button"
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

  initThreeScene() {
    const webglContainer = document.getElementById('intro-3d-webgl-container');
    if (!webglContainer || !window.THREE) return;

    try {
      const width = window.innerWidth || 1280;
      const height = window.innerHeight || 720;

      // 1. Scene & Deep Maroon Atmospheric Fog
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x120508, 0.017);

      // 2. Camera
      this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 200);
      this.camera.position.set(this.animState.camX, this.animState.camY, this.animState.camZ);
      this.camera.lookAt(this.animState.lookX, this.animState.lookY, this.animState.lookZ);

      // 3. Renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      if ('outputEncoding' in this.renderer && THREE.sRGBEncoding) {
        this.renderer.outputEncoding = THREE.sRGBEncoding;
      }

      webglContainer.innerHTML = '';
      webglContainer.appendChild(this.renderer.domElement);

      // 4. Warm Temple & Antique Bronze Lighting (Avoiding harsh white specular blowout)
      const ambientLight = new THREE.AmbientLight(0xE8C89B, 0.52);
      this.scene.add(ambientLight);

      const keyGoldLight = new THREE.DirectionalLight(0xE6B86A, 1.25);
      keyGoldLight.position.set(14, 22, 18);
      this.scene.add(keyGoldLight);

      const copperRimLight = new THREE.DirectionalLight(0x8C3B2B, 0.85);
      copperRimLight.position.set(-16, -12, 12);
      this.scene.add(copperRimLight);

      this.chakraPointLight = new THREE.PointLight(0xD99B3C, 1.35, 22);
      this.chakraPointLight.position.set(0, 2, 0);
      this.scene.add(this.chakraPointLight);

      this.houseWarmLight = new THREE.PointLight(0xFFB84D, 0, 22);
      this.houseWarmLight.position.set(0, 1.8, 0);
      this.scene.add(this.houseWarmLight);

      // 5. Build 3D Scene Assets
      this.buildAtmosphericParticles();
      this.build3DVastuChakra();
      this.build3DIndianResidence();
      this.buildEnergyShieldAndGrid();

      // 6. Resize listener
      this.resizeHandler = () => {
        if (!this.renderer || !this.camera) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      };
      window.addEventListener('resize', this.resizeHandler);

      // 7. Start single RAF render loop
      this.renderLoop();
    } catch (err) {
      console.warn('WebGL 3D Intro fallback triggered:', err);
      this.showBrandStageImmediately();
    }
  }

  buildAtmosphericParticles() {
    const count = this.isMobile ? 220 : 420;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const initialPositions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 28;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      const x = r * Math.cos(theta) * Math.cos(phi);
      const y = r * Math.sin(phi) + 2;
      const z = r * Math.sin(theta) * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      initialPositions[i * 3] = x;
      initialPositions[i * 3 + 1] = y;
      initialPositions[i * 3 + 2] = z;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.userData = { initialPositions };

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    const grad = pCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 240, 200, 1)');
    grad.addColorStop(0.4, 'rgba(212, 165, 85, 0.8)');
    grad.addColorStop(1, 'rgba(150, 105, 45, 0)');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 64, 64);

    const pTex = new THREE.CanvasTexture(pCanvas);
    const mat = new THREE.PointsMaterial({
      size: this.isMobile ? 0.36 : 0.3,
      map: pTex,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.ambientParticles = new THREE.Points(geo, mat);
    this.scene.add(this.ambientParticles);
  }

  /**
   * Generates a procedural high-resolution Ancient Civilization Stone & Engraved Copper-Gold
   * Vastu Yantra texture (Indus / Vedic Sthapatya Veda aesthetic with Sanskrit inscriptions,
   * weathered patina, 81-Pada sacred grid, lotus petals, and Ashta-Dikpala seals).
   */
  createAncientMandalaTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const cx = 512;
    const cy = 512;

    // 1. Weathered Ancient Dark Bronze & Oxidized Terracotta-Stone Base
    const baseGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 500);
    baseGrad.addColorStop(0, '#2B1810');
    baseGrad.addColorStop(0.35, '#1F120D');
    baseGrad.addColorStop(0.7, '#2A1610');
    baseGrad.addColorStop(0.92, '#160B08');
    baseGrad.addColorStop(1, '#0E0705');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 1024, 1024);

    // 2. Aged Stone & Hammered Bronze Grain Stipple (Antique Patina)
    for (let i = 0; i < 4500; i++) {
      const rx = Math.random() * 1024;
      const ry = Math.random() * 1024;
      const sz = Math.random() * 2.4 + 0.5;
      ctx.fillStyle =
        i % 3 === 0
          ? 'rgba(184, 134, 60, 0.06)'
          : i % 2 === 0
          ? 'rgba(10, 5, 3, 0.14)'
          : 'rgba(120, 72, 38, 0.07)';
      ctx.fillRect(rx, ry, sz, sz);
    }

    // 3. Concentric Engraved Vedic Rings
    const ringRadii = [488, 462, 418, 396, 332, 260, 185, 118, 68];
    ringRadii.forEach((r, idx) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = idx % 2 === 0 ? 'rgba(205, 158, 82, 0.78)' : 'rgba(148, 98, 44, 0.55)';
      ctx.lineWidth = idx === 0 || idx === 3 ? 4 : 2;
      ctx.stroke();
    });

    // 4. Outer 32 Padavinyasa Vedic Gate Divisions & Ancient Tick Carvings
    for (let g = 0; g < 64; g++) {
      const a = (g / 64) * Math.PI * 2;
      const r1 = g % 2 === 0 ? 418 : 440;
      const r2 = 462;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
      ctx.strokeStyle = 'rgba(198, 150, 74, 0.65)';
      ctx.lineWidth = g % 2 === 0 ? 2.5 : 1.2;
      ctx.stroke();
    }

    // 5. Ancient Sanskrit / Devanagari Directional Inscriptions around the Ring
    const sanskritRing = [
      { deg: -90, label: 'उत्तर • कुबेर', code: 'N' },
      { deg: -45, label: 'ईशान • शिव', code: 'NE' },
      { deg: 0, label: 'पूर्व • इन्द्र', code: 'E' },
      { deg: 45, label: 'आग्नेय • अग्नि', code: 'SE' },
      { deg: 90, label: 'दक्षिण • यम', code: 'S' },
      { deg: 135, label: 'नैऋत्य • निऋति', code: 'SW' },
      { deg: 180, label: 'पश्चिम • वरुण', code: 'W' },
      { deg: -135, label: 'वायव्य • वायु', code: 'NW' }
    ];

    ctx.font = 'bold 20px "Cinzel", Georgia, serif';
    ctx.fillStyle = 'rgba(226, 182, 104, 0.88)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    sanskritRing.forEach((item) => {
      const rad = (item.deg * Math.PI) / 180;
      const tx = cx + Math.cos(rad) * 364;
      const ty = cy + Math.sin(rad) * 364;
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(rad + Math.PI / 2);
      ctx.fillText(item.label, 0, 0);
      ctx.restore();
    });

    // 6. Sacred 16-Petal & 8-Petal Engraved Temple Lotus Mandala
    for (let p = 0; p < 16; p++) {
      const a = (p / 16) * Math.PI * 2;
      const nextA = ((p + 1) / 16) * Math.PI * 2;
      const midA = (a + nextA) / 2;
      const rIn = 185;
      const rTip = 256;

      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * rIn, cy + Math.sin(a) * rIn);
      ctx.quadraticCurveTo(
        cx + Math.cos(midA) * (rTip + 18),
        cy + Math.sin(midA) * (rTip + 18),
        cx + Math.cos(nextA) * rIn,
        cy + Math.sin(nextA) * rIn
      );
      ctx.fillStyle = p % 2 === 0 ? 'rgba(130, 56, 32, 0.38)' : 'rgba(92, 54, 24, 0.35)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(212, 165, 85, 0.75)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 7. Engraved 81-Pada (9x9) Paramasayika Vastu Purusha Lattice inside the Sanctum
    const gridSpan = 250;
    const halfG = gridSpan / 2;
    const stepG = gridSpan / 9;
    ctx.strokeStyle = 'rgba(212, 165, 85, 0.52)';
    ctx.lineWidth = 1.6;
    for (let i = 0; i <= 9; i++) {
      const off = -halfG + i * stepG;
      ctx.beginPath();
      ctx.moveTo(cx - halfG, cy + off);
      ctx.lineTo(cx + halfG, cy + off);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + off, cy - halfG);
      ctx.lineTo(cx + off, cy + halfG);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  build3DVastuChakra() {
    this.chakraGroup = new THREE.Group();
    this.chakraGroup.position.set(0, 3.2, -26);
    this.chakraGroup.scale.set(0.01, 0.01, 0.01);

    this.chakraWheel = new THREE.Group();
    this.chakraGroup.add(this.chakraWheel);

    // Ancient Civilization Materials: Aged Chola Bronze, Hammered Temple Copper, Weathered Brass & Dark Stone
    const antiqueBronzeMat = new THREE.MeshStandardMaterial({
      color: 0x9C7238, // Aged Antique Bronze-Gold
      metalness: 0.72,
      roughness: 0.44,
      emissive: 0x261706,
      emissiveIntensity: 0.22
    });

    const agedBrassMat = new THREE.MeshStandardMaterial({
      color: 0xC29548, // Burnished Temple Brass (No harsh white glare)
      metalness: 0.76,
      roughness: 0.36,
      emissive: 0x38230A,
      emissiveIntensity: 0.26
    });

    const ancientCopperMat = new THREE.MeshStandardMaterial({
      color: 0x7E4227, // Deep Patinated Vedic Copper
      metalness: 0.65,
      roughness: 0.48,
      emissive: 0x240D06,
      emissiveIntensity: 0.2
    });

    const carvedStoneRimMat = new THREE.MeshStandardMaterial({
      color: 0x2A1A14, // Carved Dark Basalt / Temple Stone
      metalness: 0.28,
      roughness: 0.75
    });

    // 1. Heavy Carved Ancient Stone & Bronze Base Medallion with Engraved Mandala Texture
    const mandalaTex = this.createAncientMandalaTexture();
    const mandalaFaceMat = new THREE.MeshStandardMaterial({
      map: mandalaTex,
      roughness: 0.58,
      metalness: 0.38,
      emissive: 0x2A1808,
      emissiveIntensity: 0.22
    });

    const stoneBackingDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(3.62, 3.78, 0.28, 72),
      carvedStoneRimMat
    );
    stoneBackingDisc.rotation.x = Math.PI / 2;
    stoneBackingDisc.position.z = -0.16;
    this.chakraWheel.add(stoneBackingDisc);

    const engravedMandalaDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(3.45, 3.45, 0.1, 72),
      [antiqueBronzeMat, mandalaFaceMat, mandalaFaceMat]
    );
    engravedMandalaDisc.rotation.x = Math.PI / 2;
    engravedMandalaDisc.position.z = -0.02;
    this.chakraWheel.add(engravedMandalaDisc);

    // 2. Stepped Concentric Antique Bronze & Copper Temple Rings
    const ringConfigs = [
      { r: 3.55, tube: 0.13, mat: antiqueBronzeMat, z: 0.04 },
      { r: 3.12, tube: 0.075, mat: ancientCopperMat, z: 0.07 },
      { r: 2.52, tube: 0.085, mat: agedBrassMat, z: 0.09 },
      { r: 1.82, tube: 0.065, mat: ancientCopperMat, z: 0.11 },
      { r: 1.15, tube: 0.08, mat: agedBrassMat, z: 0.14 }
    ];

    ringConfigs.forEach((cfg) => {
      const ringMesh = new THREE.Mesh(
        new THREE.TorusGeometry(cfg.r, cfg.tube, 20, 96),
        cfg.mat
      );
      ringMesh.position.z = cfg.z;
      this.chakraWheel.add(ringMesh);
    });

    // 3. 32 Carved Temple Gear Bosses / Studs along the Outer Rim (Ancient Astrolabe / Konark Wheel Motif)
    for (let b = 0; b < 32; b++) {
      const bAngle = (b / 32) * Math.PI * 2;
      const isCardinalStud = b % 4 === 0;
      const bossGeo = new THREE.BoxGeometry(
        isCardinalStud ? 0.24 : 0.15,
        isCardinalStud ? 0.28 : 0.18,
        0.22
      );
      const bossMesh = new THREE.Mesh(
        bossGeo,
        isCardinalStud ? agedBrassMat : antiqueBronzeMat
      );
      bossMesh.position.set(
        Math.cos(bAngle) * 3.58,
        Math.sin(bAngle) * 3.58,
        0.05
      );
      bossMesh.rotation.z = bAngle;
      this.chakraWheel.add(bossMesh);
    }

    // 4. Eight Sculpted Ancient Konark-Style Chariot Spokes & Vajra Pointers
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const spokeGroup = new THREE.Group();
      spokeGroup.rotation.z = angle;

      // Tapered Carved Temple Pillar Spoke
      const lowerShaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.08, 2.35, 12),
        antiqueBronzeMat
      );
      lowerShaft.position.set(0, 2.15, 0.08);
      spokeGroup.add(lowerShaft);

      // Decorative Ring Mouldings on each Spoke (Chola Bronze Pillar Style)
      [1.45, 2.1, 2.75].forEach((rPos) => {
        const collar = new THREE.Mesh(
          new THREE.TorusGeometry(0.095, 0.03, 10, 20),
          agedBrassMat
        );
        collar.rotation.x = Math.PI / 2;
        collar.position.set(0, rPos, 0.08);
        spokeGroup.add(collar);
      });

      // Ancient Vajra / Trishul-Tipped Directional Finial
      const finialTip = new THREE.Mesh(
        new THREE.ConeGeometry(0.18, 0.55, 4),
        agedBrassMat
      );
      finialTip.position.set(0, 3.22, 0.1);
      spokeGroup.add(finialTip);

      // Directional Ashta-Dikpala Medallion Node (Illuminates sequentially in Scene 4)
      const nodeMat = new THREE.MeshStandardMaterial({
        color: 0xD8A452,
        metalness: 0.72,
        roughness: 0.32,
        emissive: 0x8F5E18,
        emissiveIntensity: 0.25
      });
      const nodeSeal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.21, 0.14, 8),
        nodeMat
      );
      nodeSeal.rotation.x = Math.PI / 2;
      nodeSeal.position.set(0, 2.52, 0.14);
      spokeGroup.add(nodeSeal);
      this.chakraDirectionNodes.push(nodeSeal);

      this.chakraWheel.add(spokeGroup);
    }

    // 5. Interlocking 3D Copper Sri-Yantra / Ashta-Kona Star Reliefs
    for (let sq = 0; sq < 2; sq++) {
      const sqMesh = new THREE.Mesh(
        new THREE.RingGeometry(2.38, 2.48, 4),
        sq === 0 ? agedBrassMat : ancientCopperMat
      );
      sqMesh.rotation.z = sq * (Math.PI / 4) + Math.PI / 8;
      sqMesh.position.z = 0.12;
      this.chakraWheel.add(sqMesh);
    }

    // 6. Central Ancient Brahmasthan Stepped Temple Sanctum (16-Petal Bronze Lotus + Carved Meru Sri Yantra Pyramid)
    const meruStep1 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.05, 1.15, 0.16, 8),
      ancientCopperMat
    );
    meruStep1.rotation.x = Math.PI / 2;
    meruStep1.position.z = 0.12;
    this.chakraWheel.add(meruStep1);

    const meruStep2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.76, 0.88, 0.18, 8),
      antiqueBronzeMat
    );
    meruStep2.rotation.x = Math.PI / 2;
    meruStep2.rotation.y = Math.PI / 8;
    meruStep2.position.z = 0.22;
    this.chakraWheel.add(meruStep2);

    // 12 Sculpted Bronze Lotus Petals cradling the Central Meru
    for (let p = 0; p < 12; p++) {
      const pAngle = (p / 12) * Math.PI * 2;
      const petalGeo = new THREE.ConeGeometry(0.14, 0.42, 4);
      const petal = new THREE.Mesh(petalGeo, agedBrassMat);
      petal.position.set(Math.cos(pAngle) * 0.88, Math.sin(pAngle) * 0.88, 0.2);
      petal.rotation.z = pAngle - Math.PI / 2;
      this.chakraWheel.add(petal);
    }

    // Central Carved Meru Bindu (Stepped Ancient Pyramid & Finial instead of a harsh white disc)
    this.brahmaCrystal = new THREE.Group();
    const meruPyramid = new THREE.Mesh(
      new THREE.ConeGeometry(0.46, 0.42, 4),
      agedBrassMat
    );
    meruPyramid.rotation.x = Math.PI / 2;
    meruPyramid.rotation.y = Math.PI / 4;
    this.brahmaCrystal.add(meruPyramid);

    const meruKalash = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.22, 0),
      antiqueBronzeMat
    );
    meruKalash.position.z = 0.24;
    this.brahmaCrystal.add(meruKalash);

    this.brahmaCrystal.position.z = 0.32;
    this.chakraWheel.add(this.brahmaCrystal);

    this.scene.add(this.chakraGroup);
  }

  build3DIndianResidence() {
    this.houseGroup = new THREE.Group();
    this.houseGroup.position.set(0, -1.8, 0);
    this.houseGroup.visible = false;

    this.plinthMat = new THREE.MeshStandardMaterial({
      color: 0x2B1D1E,
      roughness: 0.7,
      metalness: 0.2,
      transparent: true,
      opacity: 0
    });

    this.wallMat = new THREE.MeshStandardMaterial({
      color: 0xF3E6D3,
      roughness: 0.45,
      metalness: 0.1,
      transparent: true,
      opacity: 0
    });

    this.cutawayWallMat = new THREE.MeshStandardMaterial({
      color: 0xF8F3E9,
      roughness: 0.35,
      metalness: 0.15,
      transparent: true,
      opacity: 0
    });

    this.trimGoldMat = new THREE.MeshStandardMaterial({
      color: 0xC6A15B,
      metalness: 0.8,
      roughness: 0.25,
      transparent: true,
      opacity: 0
    });

    this.roofTerracottaMat = new THREE.MeshStandardMaterial({
      color: 0x5A1E28,
      roughness: 0.4,
      metalness: 0.3,
      transparent: true,
      opacity: 0
    });

    this.windowGlowMat = new THREE.MeshStandardMaterial({
      color: 0xFFE4A0,
      emissive: 0xFFB84D,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0
    });

    this.courtyardFloorMat = new THREE.MeshStandardMaterial({
      color: 0x36151E,
      roughness: 0.4,
      metalness: 0.3,
      transparent: true,
      opacity: 0
    });

    // 1. Landscaped Ground Sanctuary & Stepped Plinth
    const estateLawn = new THREE.Mesh(
      new THREE.CylinderGeometry(9.2, 9.8, 0.3, 64),
      this.plinthMat
    );
    estateLawn.position.y = -0.25;
    this.houseGroup.add(estateLawn);

    const plinthRing = new THREE.Mesh(
      new THREE.RingGeometry(8.9, 9.15, 64),
      this.trimGoldMat
    );
    plinthRing.rotation.x = -Math.PI / 2;
    plinthRing.position.y = -0.08;
    this.houseGroup.add(plinthRing);

    const mainPlinth = new THREE.Mesh(
      new THREE.BoxGeometry(9.6, 0.5, 9.6),
      this.plinthMat
    );
    mainPlinth.position.y = 0.15;
    this.houseGroup.add(mainPlinth);

    const courtyardFloor = new THREE.Mesh(
      new THREE.BoxGeometry(8.8, 0.08, 8.8),
      this.courtyardFloorMat
    );
    courtyardFloor.position.y = 0.42;
    this.houseGroup.add(courtyardFloor);

    for (let s = 0; s < 3; s++) {
      const stepMesh = new THREE.Mesh(
        new THREE.BoxGeometry(2.8 - s * 0.2, 0.15, 0.45),
        this.wallMat
      );
      stepMesh.position.set(0, 0.08 + s * 0.12, 4.95 - s * 0.2);
      this.houseGroup.add(stepMesh);
    }

    // 2. Interior Vastu Room Partition Walls
    const partitionHeight = 2.4;
    const partY = 0.45 + partitionHeight / 2;
    const wallThickness = 0.22;

    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(8.8, partitionHeight, wallThickness),
      this.cutawayWallMat
    );
    backWall.position.set(0, partY, -4.3);
    this.houseGroup.add(backWall);

    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, partitionHeight, 8.8),
      this.cutawayWallMat
    );
    leftWall.position.set(-4.3, partY, 0);
    this.houseGroup.add(leftWall);

    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, partitionHeight, 8.8),
      this.cutawayWallMat
    );
    rightWall.position.set(4.3, partY, 0);
    this.houseGroup.add(rightWall);

    const frontLeftWing = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, partitionHeight, wallThickness),
      this.cutawayWallMat
    );
    frontLeftWing.position.set(-2.8, partY, 4.3);
    this.houseGroup.add(frontLeftWing);

    const frontRightWing = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, partitionHeight, wallThickness),
      this.cutawayWallMat
    );
    frontRightWing.position.set(2.8, partY, 4.3);
    this.houseGroup.add(frontRightWing);

    const pillarGeo = new THREE.CylinderGeometry(0.14, 0.16, 2.7, 16);
    const leftPillar = new THREE.Mesh(pillarGeo, this.trimGoldMat);
    leftPillar.position.set(-1.15, partY + 0.1, 4.55);
    const rightPillar = new THREE.Mesh(pillarGeo, this.trimGoldMat);
    rightPillar.position.set(1.15, partY + 0.1, 4.55);
    const lintelBeam = new THREE.Mesh(
      new THREE.BoxGeometry(2.7, 0.28, 0.38),
      this.trimGoldMat
    );
    lintelBeam.position.set(0, 2.95, 4.55);
    this.houseGroup.add(leftPillar, rightPillar, lintelBeam);

    const innerDividerH = 1.65;
    const innerY = 0.45 + innerDividerH / 2;
    const innerPartitions = [
      { w: 2.5, d: 0.14, x: -3.0, z: -1.6 },
      { w: 2.5, d: 0.14, x: 3.0, z: -1.6 },
      { w: 2.5, d: 0.14, x: -3.0, z: 1.6 },
      { w: 2.5, d: 0.14, x: 3.0, z: 1.6 },
      { w: 0.14, d: 2.5, x: -1.6, z: -3.0 },
      { w: 0.14, d: 2.5, x: 1.6, z: -3.0 }
    ];
    innerPartitions.forEach((p) => {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(p.w, innerDividerH, p.d),
        this.cutawayWallMat
      );
      m.position.set(p.x, innerY, p.z);
      this.houseGroup.add(m);
    });

    const courtCoords = [
      [-1.6, -1.6],
      [1.6, -1.6],
      [-1.6, 1.6],
      [1.6, 1.6]
    ];
    courtCoords.forEach(([cx, cz]) => {
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.12, 2.4, 12),
        this.trimGoldMat
      );
      col.position.set(cx, partY, cz);
      this.houseGroup.add(col);
    });

    const windowPositions = [
      { x: -2.8, y: 1.65, z: 4.43, w: 1.4, h: 1.2, rotY: 0 },
      { x: 2.8, y: 1.65, z: 4.43, w: 1.4, h: 1.2, rotY: 0 },
      { x: -4.43, y: 1.65, z: -2.2, w: 1.5, h: 1.2, rotY: Math.PI / 2 },
      { x: -4.43, y: 1.65, z: 2.2, w: 1.5, h: 1.2, rotY: Math.PI / 2 },
      { x: 4.43, y: 1.65, z: -2.2, w: 1.5, h: 1.2, rotY: Math.PI / 2 },
      { x: 4.43, y: 1.65, z: 2.2, w: 1.5, h: 1.2, rotY: Math.PI / 2 }
    ];
    windowPositions.forEach((wp) => {
      const winMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(wp.w, wp.h),
        this.windowGlowMat
      );
      winMesh.position.set(wp.x, wp.y, wp.z);
      winMesh.rotation.y = wp.rotY;
      if (wp.x < -4) winMesh.rotation.y = -Math.PI / 2;
      this.houseGroup.add(winMesh);
      this.houseWindows.push(winMesh);
    });

    this.houseRoofGroup = new THREE.Group();

    const mainRoofSlab = new THREE.Mesh(
      new THREE.BoxGeometry(9.4, 0.24, 9.4),
      this.wallMat
    );
    mainRoofSlab.position.y = 2.95;
    this.houseRoofGroup.add(mainRoofSlab);

    const hipRoofGeo = new THREE.ConeGeometry(6.8, 2.1, 4);
    hipRoofGeo.rotateY(Math.PI / 4);
    const hipRoof = new THREE.Mesh(hipRoofGeo, this.roofTerracottaMat);
    hipRoof.position.y = 4.1;
    this.houseRoofGroup.add(hipRoof);

    const roofGoldTrim = new THREE.Mesh(
      new THREE.BoxGeometry(9.55, 0.08, 9.55),
      this.trimGoldMat
    );
    roofGoldTrim.position.y = 3.08;
    this.houseRoofGroup.add(roofGoldTrim);

    const kalashFinial = new THREE.Mesh(
      new THREE.ConeGeometry(0.24, 0.7, 16),
      this.trimGoldMat
    );
    kalashFinial.position.y = 5.35;
    this.houseRoofGroup.add(kalashFinial);

    this.houseGroup.add(this.houseRoofGroup);

    const blueprintEdgesGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(8.82, 2.42, 8.82));
    this.blueprintWireMat = new THREE.LineBasicMaterial({
      color: 0xF9E29B,
      transparent: true,
      opacity: 0
    });
    const blueprintLines = new THREE.LineSegments(blueprintEdgesGeo, this.blueprintWireMat);
    blueprintLines.position.y = partY;
    this.houseGroup.add(blueprintLines);

    this.scene.add(this.houseGroup);
  }

  buildEnergyShieldAndGrid() {
    this.energyLinesGroup = new THREE.Group();
    this.energyLinesGroup.position.set(0, -1.32, 0);

    this.energyBeamMat = new THREE.MeshBasicMaterial({
      color: 0xF9E29B,
      transparent: true,
      opacity: 0
    });

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const beamGroup = new THREE.Group();
      beamGroup.rotation.y = angle;

      const beamGeo = new THREE.BoxGeometry(4.2, 0.04, 0.09);
      beamGeo.translate(2.1, 0, 0);
      const beamMesh = new THREE.Mesh(beamGeo, this.energyBeamMat.clone());
      beamMesh.scale.x = 0.001;
      beamGroup.add(beamMesh);

      this.energyLinesGroup.add(beamGroup);
      this.chakraDirectionBeams.push(beamMesh);
    }

    this.floorRippleRings = [];
    [1.6, 2.9, 4.1].forEach((r) => {
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xF9E29B,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0
      });
      const ringMesh = new THREE.Mesh(new THREE.RingGeometry(r - 0.05, r + 0.05, 64), ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      this.energyLinesGroup.add(ringMesh);
      this.floorRippleRings.push(ringMesh);
    });

    this.scene.add(this.energyLinesGroup);

    this.domeGroup = new THREE.Group();
    this.domeGroup.position.set(0, -1.8, 0);
    this.domeGroup.visible = false;

    const domeRadius = 8.4;
    const domeGeo = new THREE.SphereGeometry(
      domeRadius,
      48,
      32,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.52
    );

    this.domeMat = new THREE.MeshStandardMaterial({
      color: 0xF9E29B,
      emissive: 0xC6A15B,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.6,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.protectiveDome = new THREE.Mesh(domeGeo, this.domeMat);
    this.domeGroup.add(this.protectiveDome);

    const domeWireGeo = new THREE.SphereGeometry(
      domeRadius + 0.04,
      24,
      14,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.52
    );
    this.domeWireMat = new THREE.MeshBasicMaterial({
      color: 0xFFF2C2,
      wireframe: true,
      transparent: true,
      opacity: 0,
      depthWrite: false
    });
    this.protectiveWire = new THREE.Mesh(domeWireGeo, this.domeWireMat);
    this.domeGroup.add(this.protectiveWire);

    this.domeBaseMat = new THREE.MeshBasicMaterial({
      color: 0xF9E29B,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    this.protectiveBaseRing = new THREE.Mesh(
      new THREE.RingGeometry(domeRadius - 0.15, domeRadius + 0.15, 96),
      this.domeBaseMat
    );
    this.protectiveBaseRing.rotation.x = -Math.PI / 2;
    this.protectiveBaseRing.position.y = 0.05;
    this.domeGroup.add(this.protectiveBaseRing);

    this.scene.add(this.domeGroup);
  }

  buildMasterTimeline() {
    const tl = window.gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    this.timeline = tl;

    const storyCaptionWrap = document.getElementById('intro-story-caption-wrap');
    const goldenPortal = document.getElementById('intro-golden-portal');
    const goldenOrb = document.getElementById('intro-golden-orb');
    const webglContainer = document.getElementById('intro-3d-webgl-container');

    const sacredGeo = document.getElementById('intro-sacred-geometry');
    const ambientGlow = document.getElementById('intro-ambient-glow');
    const logoWrap = document.getElementById('intro-logo-wrap');
    const brandName = document.getElementById('intro-brand-name');
    const taglineWords = document.querySelectorAll('.intro-tagline-word');
    const principleChars = document.querySelectorAll('.intro-principle-char');
    const principleLine = document.getElementById('intro-principles-line');
    const principleDiamond = document.getElementById('intro-principles-diamond');
    const btnExplore = document.getElementById('btn-explore-website');
    const btnBook = document.getElementById('btn-book-from-intro');

    // =========================================================================
    // SCENE 1 (0.0s – 2.2s): THE MYSTERIOUS BEGINNING
    // =========================================================================
    tl.to(
      this.ambientParticles.material,
      { opacity: 0.78, duration: 2.0, ease: 'power2.out' },
      0.1
    );
    tl.to(
      this.animState,
      { camZ: 18.5, camY: 2.5, duration: 2.2, ease: 'sine.inOut' },
      0
    );

    // =========================================================================
    // SCENE 2 (2.2s – 5.6s): THE ANCIENT 3D VASTU CHAKRA APPEARS
    // =========================================================================
    tl.to(
      this.chakraGroup.scale,
      { x: 1.12, y: 1.12, z: 1.12, duration: 3.0, ease: 'power2.out' },
      2.1
    );
    tl.to(
      this.chakraGroup.position,
      { x: 0, y: 2.6, z: 8.2, duration: 3.3, ease: 'power2.inOut' },
      2.1
    );
    tl.to(
      this.chakraGroup.rotation,
      { x: -0.42, y: 0.22, duration: 3.3, ease: 'sine.inOut' },
      2.1
    );

    // =========================================================================
    // SCENE 3 (5.6s – 8.8s): A BEAUTIFUL INDIAN RESIDENCE APPEARS
    // =========================================================================
    tl.call(
      () => {
        if (this.houseGroup) this.houseGroup.visible = true;
      },
      null,
      5.4
    );

    tl.to(
      [
        this.plinthMat,
        this.wallMat,
        this.cutawayWallMat,
        this.trimGoldMat,
        this.roofTerracottaMat,
        this.courtyardFloorMat
      ],
      { opacity: 1, duration: 2.2, ease: 'power2.out' },
      5.5
    );
    tl.to(
      this.windowGlowMat,
      { opacity: 0.95, duration: 2.2, ease: 'power2.out' },
      5.8
    );
    tl.to(
      this.houseWarmLight,
      { intensity: 2.4, duration: 2.2 },
      5.8
    );

    tl.to(
      this.animState,
      {
        camX: 9.2,
        camY: 8.6,
        camZ: 17.5,
        lookX: 0,
        lookY: -0.2,
        lookZ: 0.5,
        duration: 3.2,
        ease: 'power2.inOut'
      },
      5.5
    );

    tl.to(
      this.chakraGroup.position,
      { x: 0, y: 0.4, z: 7.4, duration: 2.8, ease: 'power2.inOut' },
      5.7
    );
    tl.to(
      this.chakraGroup.scale,
      { x: 0.62, y: 0.62, z: 0.62, duration: 2.8, ease: 'power2.inOut' },
      5.7
    );
    tl.to(
      this.chakraGroup.rotation,
      { x: -Math.PI / 2 + 0.25, y: 0, duration: 2.8, ease: 'power2.inOut' },
      5.7
    );

    // =========================================================================
    // SCENE 4 (8.8s – 16.0s): THE CHAKRA ENTERS THE HOUSE & FORMS PROTECTIVE SHIELD
    // =========================================================================
    tl.to(
      this.houseRoofGroup.position,
      { y: 3.2, duration: 1.8, ease: 'power2.inOut' },
      8.8
    );
    tl.to(
      this.roofTerracottaMat,
      { opacity: 0.14, duration: 1.6, ease: 'power2.inOut' },
      8.8
    );
    tl.to(
      this.wallMat,
      { opacity: 0.22, duration: 1.6, ease: 'power2.inOut' },
      8.8
    );
    tl.to(
      this.cutawayWallMat,
      { opacity: 0.48, duration: 1.6, ease: 'power2.inOut' },
      8.8
    );
    tl.to(
      this.blueprintWireMat,
      { opacity: 0.55, duration: 1.6, ease: 'power2.inOut' },
      8.8
    );

    tl.to(
      this.animState,
      {
        camX: 0,
        camY: 9.8,
        camZ: 14.2,
        lookX: 0,
        lookY: -0.9,
        lookZ: 0,
        duration: 3.0,
        ease: 'power2.inOut'
      },
      8.8
    );

    tl.to(
      this.chakraGroup.rotation,
      { x: -Math.PI / 2, y: 0, duration: 1.2, ease: 'power2.out' },
      9.0
    );
    tl.to(
      this.chakraGroup.position,
      { x: 0, y: -1.15, z: 0, duration: 2.3, ease: 'power2.inOut' },
      9.1
    );

    tl.to(
      this.chakraGroup.scale,
      { x: 1.18, y: 1.18, z: 1.18, duration: 1.5, ease: 'back.out(1.2)' },
      11.3
    );

    this.chakraDirectionNodes.forEach((nodeMesh, idx) => {
      const startT = 11.7 + idx * 0.16;
      tl.to(
        nodeMesh.scale,
        { x: 1.7, y: 1.7, z: 1.7, duration: 0.35, yoyo: true, repeat: 1 },
        startT
      );
      tl.to(
        nodeMesh.material,
        { emissiveIntensity: 1.3, duration: 0.4 },
        startT
      );
    });

    this.chakraDirectionBeams.forEach((beamMesh, idx) => {
      const startT = 11.8 + idx * 0.16;
      tl.to(
        beamMesh.material,
        { opacity: 0.9, duration: 0.4 },
        startT
      );
      tl.to(
        beamMesh.scale,
        { x: 1, duration: 0.75, ease: 'power2.out' },
        startT
      );
    });

    this.floorRippleRings.forEach((ring, idx) => {
      tl.to(
        ring.material,
        { opacity: 0.65, duration: 0.65 },
        12.2 + idx * 0.25
      );
    });

    tl.to(
      this.houseRoofGroup.position,
      { y: 0, duration: 1.6, ease: 'power2.inOut' },
      13.1
    );
    tl.to(
      this.roofTerracottaMat,
      { opacity: 0.85, duration: 1.4 },
      13.2
    );
    tl.to(
      this.wallMat,
      { opacity: 0.88, duration: 1.4 },
      13.2
    );
    tl.to(
      this.houseWarmLight,
      { intensity: 3.8, duration: 1.5 },
      13.0
    );

    tl.call(
      () => {
        if (this.domeGroup) {
          this.domeGroup.visible = true;
          this.domeGroup.scale.set(0.2, 0.2, 0.2);
        }
      },
      null,
      13.2
    );

    tl.to(
      this.domeGroup.scale,
      { x: 1, y: 1, z: 1, duration: 2.0, ease: 'power3.out' },
      13.25
    );
    tl.to(
      this.domeMat,
      { opacity: 0.22, duration: 1.8, ease: 'power2.out' },
      13.3
    );
    tl.to(
      this.domeWireMat,
      { opacity: 0.38, duration: 1.8, ease: 'power2.out' },
      13.4
    );
    tl.to(
      this.domeBaseMat,
      { opacity: 0.85, duration: 1.5, ease: 'power2.out' },
      13.4
    );

    tl.to(
      storyCaptionWrap,
      { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' },
      13.4
    );

    tl.to(
      this.animState,
      {
        camX: -5.5,
        camY: 6.2,
        camZ: 18.5,
        lookY: -0.3,
        duration: 2.6,
        ease: 'sine.inOut'
      },
      13.4
    );

    // =========================================================================
    // SCENE 5 (16.0s – 18.2s): CINEMATIC GOLDEN TRANSITION TO THE BRAND
    // =========================================================================
    tl.to(
      storyCaptionWrap,
      { opacity: 0, y: -12, duration: 0.8, ease: 'power2.in' },
      15.9
    );

    tl.to(
      this.animState,
      {
        camX: 0,
        camY: 4.5,
        camZ: 34,
        vortexGather: 1,
        duration: 2.0,
        ease: 'power2.inOut'
      },
      16.0
    );

    tl.to(
      [this.houseGroup.scale, this.domeGroup.scale, this.chakraGroup.scale, this.energyLinesGroup.scale],
      { x: 0.15, y: 0.15, z: 0.15, duration: 1.8, ease: 'power2.in' },
      16.1
    );

    tl.to(
      goldenPortal,
      { opacity: 1, duration: 0.7, ease: 'power2.in' },
      16.6
    );
    tl.fromTo(
      goldenOrb,
      { scale: 0.2 },
      { scale: 14, duration: 1.4, ease: 'power3.inOut' },
      16.6
    );
    tl.to(
      webglContainer,
      { opacity: 0, duration: 0.9, ease: 'power2.inOut' },
      17.2
    );
    tl.to(
      goldenPortal,
      { opacity: 0, duration: 1.1, ease: 'power2.out' },
      17.6
    );

    // =========================================================================
    // PART 2 – VASTU SUTRAM PREMIUM BRAND INTRODUCTION (18.0s – 24.8s)
    // =========================================================================
    tl.to(
      [sacredGeo, ambientGlow],
      { opacity: 1, duration: 1.4, ease: 'power2.out' },
      17.7
    );

    // SCENE 6 (18.0s – 19.8s): ORIGINAL VASTU SUTRAM LOGO REVEAL
    tl.to(
      logoWrap,
      { opacity: 1, scale: 1, duration: 1.7, ease: 'power2.out' },
      18.0
    );

    // SCENE 7 (19.6s – 21.0s): BRAND NAME ANIMATION ("VASTU SUTRAM")
    tl.to(
      brandName,
      { opacity: 1, y: 0, duration: 1.25, ease: 'power3.out' },
      19.6
    );

    // SCENE 8 (20.8s – 22.2s): TAGLINE REVEAL ("WHERE ANCIENT WISDOM MEETS HARMONIOUS LIVING.")
    tl.to(
      taglineWords,
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.11,
        ease: 'power2.out'
      },
      20.8
    );

    // SCENE 9 (22.0s – 23.5s): THE PRINCIPLES OF VASTU (Staggered letters + golden underline)
    tl.to(
      principleChars,
      {
        opacity: 1,
        duration: 0.45,
        stagger: 0.03,
        ease: 'power2.out'
      },
      22.0
    );
    tl.to(
      principleLine,
      {
        scaleX: 1,
        duration: 0.85,
        ease: 'power2.inOut'
      },
      22.5
    );
    tl.to(
      principleDiamond,
      {
        opacity: 1,
        duration: 0.45
      },
      22.9
    );

    // SCENE 10 (23.3s – 24.6s): CALL-TO-ACTION BUTTONS
    tl.to(
      [btnExplore, btnBook],
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        stagger: 0.18,
        ease: 'power3.out'
      },
      23.3
    );
  }

  renderLoop() {
    if (this.isDismissed) return;
    this.animFrameId = requestAnimationFrame(() => this.renderLoop());

    if (!this.renderer || !this.scene || !this.camera) return;

    const elapsed = this.clock ? this.clock.getElapsedTime() : Date.now() * 0.001;

    this.camera.position.set(
      this.animState.camX,
      this.animState.camY,
      this.animState.camZ
    );
    this.camera.lookAt(
      this.animState.lookX,
      this.animState.lookY,
      this.animState.lookZ
    );

    if (this.chakraWheel) {
      this.chakraWheel.rotation.z -= 0.012 * this.animState.chakraSpinSpeed;
    }
    if (this.brahmaCrystal) {
      this.brahmaCrystal.rotation.z = elapsed * 0.95;
    }
    if (this.chakraPointLight && this.chakraGroup) {
      this.chakraPointLight.position.copy(this.chakraGroup.position);
      this.chakraPointLight.position.y += 1.2;
    }

    if (this.protectiveWire && this.domeGroup && this.domeGroup.visible) {
      this.protectiveWire.rotation.y = elapsed * 0.18;
    }

    if (this.ambientParticles) {
      const posAttr = this.ambientParticles.geometry.attributes.position;
      const initPos = this.ambientParticles.geometry.userData.initialPositions;
      const gather = this.animState.vortexGather;

      for (let i = 0; i < posAttr.count; i++) {
        const ix = initPos[i * 3];
        const iy = initPos[i * 3 + 1];
        const iz = initPos[i * 3 + 2];

        const swirlAngle = elapsed * 0.25 + gather * 2.5;
        const rx = ix * Math.cos(swirlAngle * 0.3) - iz * Math.sin(swirlAngle * 0.3);
        const rz = ix * Math.sin(swirlAngle * 0.3) + iz * Math.cos(swirlAngle * 0.3);
        const floatY = iy + Math.sin(elapsed * 0.8 + i) * 0.4;

        posAttr.array[i * 3] = THREE.MathUtils.lerp(rx, 0, gather * 0.92);
        posAttr.array[i * 3 + 1] = THREE.MathUtils.lerp(floatY, 1.2, gather * 0.92);
        posAttr.array[i * 3 + 2] = THREE.MathUtils.lerp(rz, 8, gather * 0.92);
      }
      posAttr.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }

  showBrandStageImmediately() {
    const sacredGeo = document.getElementById('intro-sacred-geometry');
    const ambientGlow = document.getElementById('intro-ambient-glow');
    const logoWrap = document.getElementById('intro-logo-wrap');
    const brandName = document.getElementById('intro-brand-name');
    const taglineWords = document.querySelectorAll('.intro-tagline-word');
    const principleChars = document.querySelectorAll('.intro-principle-char');
    const principleLine = document.getElementById('intro-principles-line');
    const principleDiamond = document.getElementById('intro-principles-diamond');
    const btnExplore = document.getElementById('btn-explore-website');
    const btnBook = document.getElementById('btn-book-from-intro');

    [
      sacredGeo,
      ambientGlow,
      logoWrap,
      brandName,
      principleDiamond,
      btnExplore,
      btnBook
    ].forEach((el) => {
      if (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    });
    if (principleLine) principleLine.style.transform = 'scaleX(1)';
    taglineWords.forEach((w) => {
      w.style.opacity = '1';
      w.style.transform = 'none';
    });
    principleChars.forEach((c) => {
      c.style.opacity = '1';
      c.style.transform = 'none';
    });
  }

  stopAmbientAudio() {
    // Preserved as safe no-op for external callers
  }

  bindEvents() {
    const exploreBtn = document.getElementById('btn-explore-website');
    const bookBtn = document.getElementById('btn-book-from-intro');

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
    if (this.renderer) {
      this.renderer.dispose();
    }

    this.container.style.transition =
      'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
    this.container.style.opacity = '0';
    this.container.style.transform = 'scale(1.02)';
    this.container.style.pointerEvents = 'none';

    if (window.vastuApp && typeof window.vastuApp.playHeroReveal === 'function') {
      window.vastuApp.playHeroReveal();
    } else if (window.VastuApp && typeof window.VastuApp.playHeroReveal === 'function') {
      window.VastuApp.playHeroReveal();
    }

    setTimeout(() => {
      this.container.style.display = 'none';
      if (openBooking) {
        const bookingSection = document.getElementById('booking-section');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 900);
  }
}

window.VastuCinematicIntro = VastuCinematicIntro;
