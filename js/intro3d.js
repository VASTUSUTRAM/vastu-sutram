/**
 * VASTU SUTRAM – ULTIMATE CINEMATIC 3D WEBSITE INTRODUCTION
 * Two-Part Connected Luxury 3D & Brand Film (Three.js + GSAP + Optional Vedic Soundscape)
 *
 * PART 1 – THE CINEMATIC VASTU PROTECTION STORY (Scenes 1–5):
 *   Scene 1 (0.0s – 2.2s): Mysterious deep burgundy/maroon atmosphere, golden floating particles, camera glides forward.
 *   Scene 2 (2.2s – 5.5s): Detailed 3D metallic Vastu Chakra emerges from the distance, rotating in 3D space with 8 directions & Brahmasthan.
 *   Scene 3 (5.5s – 8.8s): Architectural 3D Indian contemporary luxury residence reveals from an aerial three-quarter angle with warm interior lighting.
 *   Scene 4 (8.8s – 16.0s): House transitions into an architectural cutaway view; the 3D Vastu Chakra enters through the main entrance into the central Brahmasthan, expands into a golden mandala, illuminates all 8 directions sequentially, spreads golden energy lines, and forms a refined transparent golden protective dome around the residence ("WHERE BALANCE BEGINS, HARMONY FOLLOWS.").
 *   Scene 5 (16.0s – 18.2s): Camera zooms out, golden particles converge into a luminous circular golden light that expands and dissolves seamlessly into the deep maroon brand stage.
 *
 * PART 2 – VASTU SUTRAM PREMIUM BRAND INTRODUCTION (Scenes 6–10):
 *   Scene 6 (18.2s – 20.0s): Original Vastu Sutram logo (assets/logo-emblem.png) reveals in center with gentle zoom, light sweep & soft float.
 *   Scene 7 (20.0s – 21.4s): VASTU SUTRAM reveals directly below the logo in large champagne-gold serif typography.
 *   Scene 8 (21.4s – 22.7s): "WHERE ANCIENT WISDOM MEETS HARMONIOUS LIVING." reveals in warm ivory italic serif.
 *   Scene 9 (22.7s – 24.0s): THE PRINCIPLES OF VASTU staggered letter-by-letter reveal + animated golden underline.
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
    this.chakraDirectionBeams = [];
    this.chakraDirectionNodes = [];
    this.houseGroup = null;
    this.houseRoofGroup = null;
    this.houseUpperWalls = [];
    this.houseWindows = [];
    this.energyLinesGroup = null;
    this.energyBeamMat = null;
    this.protectiveDome = null;
    this.protectiveWire = null;
    this.protectiveBaseRing = null;
    this.convergenceVortex = null;

    // Animation state proxies driven by GSAP
    this.animState = {
      camX: 0,
      camY: 2.2,
      camZ: 28,
      lookX: 0,
      lookY: 0.5,
      lookZ: 0,
      chakraSpinSpeed: 0.65,
      chakraGlow: 0.35,
      houseWarmth: 0,
      cutawayProgress: 0,
      energyPulse: 0,
      domeProgress: 0,
      vortexGather: 0
    };

    // Optional Web Audio synthesizer for peaceful Indian tanpura/bell ambience
    this.audioCtx = null;
    this.isAudioPlaying = false;
    this.audioGain = null;

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
    return text
      .split('')
      .map((ch) => {
        if (ch === ' ') {
          return `<span class="inline-block w-2 sm:w-3">&nbsp;</span>`;
        }
        return `<span class="${className} inline-block opacity-0" style="transform: translateX(-8px);">${ch}</span>`;
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
        
        <!-- 3D WebGL Stage for Part 1 (Vastu Chakra & Architectural House Story) -->
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

        <!-- Top Controls (Audio On/Off & Skip Intro) — Hidden during Scene 1 dark opening -->
        <div id="intro-top-controls" class="absolute top-5 right-5 sm:top-7 sm:right-8 z-50 flex items-center gap-2.5 opacity-0">
          <button
            id="intro-sound-btn"
            type="button"
            class="px-3.5 py-1.5 rounded-full text-[11px] font-serif uppercase tracking-[0.16em] text-[#DCCBB0]/85 hover:text-[#F9E29B] border border-[#C6A15B]/35 hover:border-[#C6A15B]/75 bg-[#18080D]/65 backdrop-blur-md transition-all flex items-center gap-1.5"
            title="Toggle Sacred Vedic Ambience"
          >
            <span id="intro-sound-icon">🔇</span>
            <span id="intro-sound-label" class="hidden sm:inline">Sound Off</span>
          </button>
          <button
            id="skip-intro-btn"
            type="button"
            class="px-4 py-1.5 rounded-full text-[11px] font-serif uppercase tracking-[0.2em] text-[#DCCBB0]/85 hover:text-[#F9E29B] border border-[#C6A15B]/35 hover:border-[#C6A15B]/75 bg-[#18080D]/65 backdrop-blur-md transition-all"
          >
            Skip Intro ➔
          </button>
        </div>

        <!-- PART 2: VASTU SUTRAM PREMIUM BRAND INTRODUCTION (Scenes 6–10) -->
        <div id="intro-brand-stage" class="relative z-30 max-w-4xl w-full mx-auto flex flex-col items-center text-center px-5 py-8 pointer-events-none">
          
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
            class="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] brand-title-gold opacity-0 mb-4 sm:mb-5 leading-tight"
            style="transform: translateY(28px);"
          >
            VASTU SUTRAM
          </h1>

          <!-- Scene 8: Tagline Reveal ("WHERE ANCIENT WISDOM MEETS HARMONIOUS LIVING.") -->
          <p
            id="intro-tagline"
            class="font-editorial italic text-lg sm:text-2xl md:text-3xl text-[#F8F3E9] font-normal tracking-wide max-w-2xl mx-auto mb-6 sm:mb-7 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]"
          >
            ${taglineWordsHtml}
          </p>

          <!-- Scene 9: THE PRINCIPLES OF VASTU Staggered Letter Reveal + Golden Underline -->
          <div id="intro-principles-block" class="flex flex-col items-center mb-9 sm:mb-11">
            <div
              id="intro-principles-text"
              class="font-serif text-xs sm:text-sm md:text-base lg:text-lg text-[#E5C378] uppercase tracking-[0.28em] sm:tracking-[0.36em] font-semibold"
              aria-label="THE PRINCIPLES OF VASTU"
            >
              ${principlesHtml}
            </div>
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
      this.scene.fog = new THREE.FogExp2(0x14060A, 0.018);

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

      // 4. Cinematic Lighting Setup
      const ambientLight = new THREE.AmbientLight(0xFFE9C2, 0.65);
      this.scene.add(ambientLight);

      const keyGoldLight = new THREE.DirectionalLight(0xFFE299, 1.6);
      keyGoldLight.position.set(16, 26, 22);
      this.scene.add(keyGoldLight);

      const burgundyRimLight = new THREE.DirectionalLight(0x9E2A40, 1.0);
      burgundyRimLight.position.set(-18, 10, -14);
      this.scene.add(burgundyRimLight);

      this.chakraPointLight = new THREE.PointLight(0xFFD269, 2.2, 28);
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

    // Soft circular golden particle texture via canvas
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    const grad = pCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 248, 220, 1)');
    grad.addColorStop(0.4, 'rgba(249, 226, 155, 0.8)');
    grad.addColorStop(1, 'rgba(198, 161, 91, 0)');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 64, 64);

    const pTex = new THREE.CanvasTexture(pCanvas);
    const mat = new THREE.PointsMaterial({
      size: this.isMobile ? 0.38 : 0.32,
      map: pTex,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.ambientParticles = new THREE.Points(geo, mat);
    this.scene.add(this.ambientParticles);
  }

  build3DVastuChakra() {
    this.chakraGroup = new THREE.Group();
    // Initially placed deep in the dark background
    this.chakraGroup.position.set(0, 3.2, -26);
    this.chakraGroup.scale.set(0.01, 0.01, 0.01);

    this.chakraWheel = new THREE.Group();
    this.chakraGroup.add(this.chakraWheel);

    const goldMetallic = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      metalness: 0.88,
      roughness: 0.2,
      emissive: 0x5A3E10,
      emissiveIntensity: 0.35
    });

    const brightGoldMetallic = new THREE.MeshStandardMaterial({
      color: 0xF9E29B,
      metalness: 0.92,
      roughness: 0.14,
      emissive: 0x8A641B,
      emissiveIntensity: 0.45
    });

    const maroonCoreMat = new THREE.MeshStandardMaterial({
      color: 0x3A1019,
      metalness: 0.5,
      roughness: 0.45,
      emissive: 0x1D060B,
      emissiveIntensity: 0.3
    });

    // Concentric 3D Metallic Rings
    const radii = [
      { r: 3.4, tube: 0.09, mat: brightGoldMetallic },
      { r: 2.85, tube: 0.065, mat: goldMetallic },
      { r: 2.15, tube: 0.055, mat: goldMetallic },
      { r: 1.25, tube: 0.06, mat: brightGoldMetallic }
    ];

    radii.forEach((cfg) => {
      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(cfg.r, cfg.tube, 20, 96),
        cfg.mat
      );
      this.chakraWheel.add(torus);
    });

    // Subtle Perforated Medallion Base Plate
    const baseDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(3.35, 3.35, 0.08, 64),
      maroonCoreMat
    );
    baseDisc.rotation.x = Math.PI / 2;
    baseDisc.position.z = -0.05;
    this.chakraWheel.add(baseDisc);

    // 8 Directional Divisions, Pointers & Sequential Illumination Nodes
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;

      // Radial Spoke
      const spokeGeo = new THREE.CylinderGeometry(0.035, 0.035, 6.6, 8);
      const spoke = new THREE.Mesh(spokeGeo, goldMetallic);
      spoke.rotation.z = angle;
      this.chakraWheel.add(spoke);

      // Directional Spear Pointer
      const spearGeo = new THREE.ConeGeometry(i % 2 === 0 ? 0.22 : 0.16, 0.75, 4);
      const spear = new THREE.Mesh(spearGeo, brightGoldMetallic);
      spear.position.set(Math.cos(angle) * 3.1, Math.sin(angle) * 3.1, 0.06);
      spear.rotation.z = angle - Math.PI / 2;
      this.chakraWheel.add(spear);

      // Directional Node Jewel (Illuminates sequentially in Scene 4!)
      const nodeMat = new THREE.MeshStandardMaterial({
        color: 0xF9E29B,
        metalness: 0.8,
        roughness: 0.15,
        emissive: 0xF9E29B,
        emissiveIntensity: 0.2
      });
      const nodeOrb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), nodeMat);
      nodeOrb.position.set(Math.cos(angle) * 2.5, Math.sin(angle) * 2.5, 0.1);
      this.chakraWheel.add(nodeOrb);
      this.chakraDirectionNodes.push(nodeOrb);
    }

    // Sacred Vedic Octagram (Two Interlocking Golden Squares)
    for (let sq = 0; sq < 2; sq++) {
      const rot = sq * (Math.PI / 4);
      const pts = [];
      for (let c = 0; c <= 4; c++) {
        const a = rot + (c * Math.PI) / 2 + Math.PI / 4;
        pts.push(new THREE.Vector3(Math.cos(a) * 2.8, Math.sin(a) * 2.8, 0.08));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(
        lineGeo,
        new THREE.LineBasicMaterial({ color: 0xF9E29B, transparent: true, opacity: 0.85 })
      );
      this.chakraWheel.add(line);
    }

    // 81-Pada Sacred Mandala Grid Lines
    const gridSpan = 3.2;
    const half = gridSpan / 2;
    const step = gridSpan / 9;
    const gridMat = new THREE.LineBasicMaterial({
      color: 0xC6A15B,
      transparent: true,
      opacity: 0.45
    });
    for (let g = 1; g < 9; g++) {
      const offset = -half + g * step;
      const hLine = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-half, offset, 0.06),
        new THREE.Vector3(half, offset, 0.06)
      ]);
      const vLine = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(offset, -half, 0.06),
        new THREE.Vector3(offset, half, 0.06)
      ]);
      this.chakraWheel.add(new THREE.Line(hLine, gridMat));
      this.chakraWheel.add(new THREE.Line(vLine, gridMat));
    }

    // Central Brahmasthan Lotus & Glowing Octahedron Crystal
    const brahmaPedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.95, 0.18, 32),
      goldMetallic
    );
    brahmaPedestal.rotation.x = Math.PI / 2;
    brahmaPedestal.position.z = 0.08;
    this.chakraWheel.add(brahmaPedestal);

    this.brahmaCrystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.45, 0),
      brightGoldMetallic
    );
    this.brahmaCrystal.position.z = 0.35;
    this.chakraWheel.add(this.brahmaCrystal);

    this.scene.add(this.chakraGroup);
  }

  build3DIndianResidence() {
    // Contemporary Indian Luxury Courtyard Villa (Vastu-compliant architectural proportions)
    this.houseGroup = new THREE.Group();
    this.houseGroup.position.set(0, -1.8, 0);
    this.houseGroup.visible = false;

    // Materials
    this.plinthMat = new THREE.MeshStandardMaterial({
      color: 0x2B1D1E,
      roughness: 0.7,
      metalness: 0.2,
      transparent: true,
      opacity: 0
    });

    this.wallMat = new THREE.MeshStandardMaterial({
      color: 0xF3E6D3, // Warm Sandstone Ivory
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
      color: 0x5A1E28, // Royal Deep Maroon-Terracotta Roof
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

    // Sacred Courtyard Floor (Brahmasthan Center)
    const courtyardFloor = new THREE.Mesh(
      new THREE.BoxGeometry(8.8, 0.08, 8.8),
      this.courtyardFloorMat
    );
    courtyardFloor.position.y = 0.42;
    this.houseGroup.add(courtyardFloor);

    // Entrance Grand Steps (Front +Z)
    for (let s = 0; s < 3; s++) {
      const stepMesh = new THREE.Mesh(
        new THREE.BoxGeometry(2.8 - s * 0.2, 0.15, 0.45),
        this.wallMat
      );
      stepMesh.position.set(0, 0.08 + s * 0.12, 4.95 - s * 0.2);
      this.houseGroup.add(stepMesh);
    }

    // 2. Interior Vastu Room Partition Walls (Visible when house transitions to architectural cutaway)
    const partitionHeight = 2.4;
    const partY = 0.45 + partitionHeight / 2;

    const wallThickness = 0.22;
    // Outer Perimeter Walls (Left, Right, Back, and Front with Grand Entrance Portal)
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

    // Front Left & Right Wings leaving a 2.4m Grand Main Entrance Archway in the center
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

    // Grand Golden Entrance Arch Frame (Simhadwara)
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

    // Internal 8-Zone Courtyard Colonade & Low Room Dividers (surrounding the open central Brahmasthan)
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

    // 4 Golden Courtyard Pillars framing the Central Brahmasthan
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

    // 3. Warm Illuminated Windows around the Facade
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

    // 4. Roof & Upper Pavilion (Lifts and turns translucent during Scene 4 Cutaway!)
    this.houseRoofGroup = new THREE.Group();

    const mainRoofSlab = new THREE.Mesh(
      new THREE.BoxGeometry(9.4, 0.24, 9.4),
      this.wallMat
    );
    mainRoofSlab.position.y = 2.95;
    this.houseRoofGroup.add(mainRoofSlab);

    // Traditional Indian Sloped Shikhara / Hip Roof Crown with Golden Kalash Finial
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

    // Architectural Wireframe Overlay for Luxury Cutaway Blueprint Aesthetic
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
    // 1. Golden Energy Lines spreading from the Brahmasthan across all 8 directions of the house
    this.energyLinesGroup = new THREE.Group();
    this.energyLinesGroup.position.set(0, -1.32, 0); // Floor level inside the residence

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

    // Concentric Golden Energy Ripples on the House Floor
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

    // 2. Symbolic Transparent Golden Protective Dome / Shield around the Entire House
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

    // Delicate Sacred Geometric Lattice on the Protective Dome
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

    // Glowing Golden Base Sanctuary Ring
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

    const topControls = document.getElementById('intro-top-controls');
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
    // Complete dark burgundy/maroon environment, subtle golden particles, camera moves forward
    // No text or buttons shown initially.
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

    // Reveal subtle Skip & Sound controls after initial 2s dark opening
    tl.to(topControls, { opacity: 1, duration: 0.8 }, 2.0);

    // =========================================================================
    // SCENE 2 (2.2s – 5.6s): THE 3D VASTU CHAKRA APPEARS
    // Golden 3D Vastu Chakra emerges from distance, moves toward camera, rotates in 3D space
    // =========================================================================
    tl.to(
      this.chakraGroup.scale,
      { x: 1.15, y: 1.15, z: 1.15, duration: 3.0, ease: 'power2.out' },
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
    // Aerial three-quarter perspective reveals contemporary Indian villa with warm interior glow
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

    // Camera sweeps to a majestic aerial three-quarter architectural angle
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

    // Position the rotating 3D Chakra poised in front of the main entrance (+Z)
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
    // 1. House transitions into architectural cutaway view (roof lifts & becomes translucent)
    // 2. Chakra moves gracefully through the main entrance toward the central Brahmasthan
    // 3. Expands into a circular golden mandala inside the house
    // 4. 8 directional divisions illuminate one after another + golden energy lines spread
    // 5. Transparent golden protective dome forms around the entire house
    // =========================================================================

    // 4A (8.8s – 10.6s): Architectural cutaway transition
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

    // Camera glides closer to observe the Chakra entering the main entrance into the central core
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

    // 4B (9.2s – 11.4s): Chakra glides gracefully through the front entrance to the center (Brahmasthan)
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

    // 4C (11.4s – 13.0s): Chakra expands into a majestic circular golden mandala filling the house floorplan
    tl.to(
      this.chakraGroup.scale,
      { x: 1.18, y: 1.18, z: 1.18, duration: 1.5, ease: 'back.out(1.2)' },
      11.3
    );

    // 4D (11.8s – 13.8s): 8 directional divisions illuminate one after another & golden energy lines spread
    this.chakraDirectionNodes.forEach((nodeMesh, idx) => {
      const startT = 11.7 + idx * 0.16;
      tl.to(
        nodeMesh.scale,
        { x: 1.9, y: 1.9, z: 1.9, duration: 0.35, yoyo: true, repeat: 1 },
        startT
      );
      tl.to(
        nodeMesh.material,
        { emissiveIntensity: 1.6, duration: 0.4 },
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

    // Restore roof gently as the golden protective shield forms around the complete residence
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

    // 4E (13.3s – 16.0s): Transparent Golden Protective Dome forms around the entire house
    // Symbolic caption: "WHERE BALANCE BEGINS, HARMONY FOLLOWS."
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

    // Reveal Symbolic Message: "WHERE BALANCE BEGINS, HARMONY FOLLOWS."
    tl.to(
      storyCaptionWrap,
      { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' },
      13.4
    );

    // Slow camera pan around the glowing protected residence
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
    // Camera zooms out, house scales down, golden particles converge to center forming
    // a circular golden light that expands and dissolves into the deep maroon background.
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

    // Golden Circular Light Portal forms at screen center and expands smoothly
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

    // Ambient maroon geometry & soft golden glow appear
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
        x: 0,
        duration: 0.5,
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

    // 1. Update Camera Position & LookAt from GSAP animState
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

    // 2. Continuous 3D Rotation of the Vastu Chakra & Counter-Rotating Brahma Crystal
    if (this.chakraWheel) {
      this.chakraWheel.rotation.z -= 0.012 * this.animState.chakraSpinSpeed;
    }
    if (this.brahmaCrystal) {
      this.brahmaCrystal.rotation.z = elapsed * 1.6;
      this.brahmaCrystal.rotation.x = Math.sin(elapsed * 2.0) * 0.35;
    }
    if (this.chakraPointLight && this.chakraGroup) {
      this.chakraPointLight.position.copy(this.chakraGroup.position);
      this.chakraPointLight.position.y += 1.2;
    }

    // 3. Protective Shield Gentle Harmonic Rotation
    if (this.protectiveWire && this.domeGroup && this.domeGroup.visible) {
      this.protectiveWire.rotation.y = elapsed * 0.18;
    }

    // 4. Floating & Converging Golden Particles
    if (this.ambientParticles) {
      const posAttr = this.ambientParticles.geometry.attributes.position;
      const initPos = this.ambientParticles.geometry.userData.initialPositions;
      const gather = this.animState.vortexGather;

      for (let i = 0; i < posAttr.count; i++) {
        const ix = initPos[i * 3];
        const iy = initPos[i * 3 + 1];
        const iz = initPos[i * 3 + 2];

        // Gentle upward drift + orbital swirl during Scene 5 convergence
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
    const topControls = document.getElementById('intro-top-controls');
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
      topControls,
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

  toggleAmbientAudio() {
    const iconEl = document.getElementById('intro-sound-icon');
    const labelEl = document.getElementById('intro-sound-label');

    if (this.isAudioPlaying) {
      this.stopAmbientAudio();
      if (iconEl) iconEl.textContent = '🔇';
      if (labelEl) labelEl.textContent = 'Sound Off';
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      this.audioGain = this.audioCtx.createGain();
      this.audioGain.gain.setValueAtTime(0.001, now);
      this.audioGain.gain.exponentialRampToValueAtTime(0.08, now + 1.2);
      this.audioGain.connect(this.audioCtx.destination);

      // Warm Vedic Tanpura Fifth Drone (Sa - Pa - Upper Sa in C# / 138.59 Hz, 207.65 Hz, 277.18 Hz)
      this.droneOscs = [138.59, 207.65, 277.18].map((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const subGain = this.audioCtx.createGain();
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        subGain.gain.setValueAtTime(idx === 0 ? 0.5 : 0.22, now);
        osc.connect(subGain);
        subGain.connect(this.audioGain);
        osc.start();
        return osc;
      });

      // Gentle Temple Bell Chime Accent
      const bellOsc = this.audioCtx.createOscillator();
      const bellGain = this.audioCtx.createGain();
      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(554.37, now);
      bellGain.gain.setValueAtTime(0.06, now);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
      bellOsc.connect(bellGain);
      bellGain.connect(this.audioCtx.destination);
      bellOsc.start(now);
      bellOsc.stop(now + 3.6);

      this.isAudioPlaying = true;
      if (iconEl) iconEl.textContent = '🔊';
      if (labelEl) labelEl.textContent = 'Sound On';
    } catch (e) {
      console.warn('Audio context blocked or unsupported:', e);
    }
  }

  stopAmbientAudio() {
    this.isAudioPlaying = false;
    if (this.droneOscs) {
      this.droneOscs.forEach((osc) => {
        try {
          osc.stop();
        } catch (_) {}
      });
      this.droneOscs = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      try {
        this.audioCtx.close();
      } catch (_) {}
      this.audioCtx = null;
    }
  }

  bindEvents() {
    const skipBtn = document.getElementById('skip-intro-btn');
    const soundBtn = document.getElementById('intro-sound-btn');
    const exploreBtn = document.getElementById('btn-explore-website');
    const bookBtn = document.getElementById('btn-book-from-intro');

    if (skipBtn) {
      skipBtn.addEventListener('click', () => this.finishIntro(false));
    }
    if (soundBtn) {
      soundBtn.addEventListener('click', () => this.toggleAmbientAudio());
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

    this.stopAmbientAudio();

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
