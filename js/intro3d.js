/**
 * VASTU SUTRAM – Cinematic 3D Opening Animation
 * 5 Scenes:
 *  1. Cosmic Universe (Mandala Materialization)
 *  2. Indian Luxury House Appears & Doors Open
 *  3. Chakra Enters & Golden Energy Floor Grid
 *  4. Symbolic Protective Golden Dome & Harmony Field
 *  5. Logo Reveal & Call to Actions
 */

class VastuCinematicIntro {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.duration = 16000; // ~16 seconds total timeline
    this.startTime = null;
    this.sceneIndex = 0;
    this.isSkipped = false;
    this.audioEnabled = true;
    this.audioCtx = null;

    this.initDOM();
    this.initThree();
    this.initAudio();
    this.bindEvents();
    this.start();
  }

  initDOM() {
    this.container.innerHTML = `
      <div id="intro-canvas-container" class="absolute inset-0 w-full h-full overflow-hidden bg-[#12080B]"></div>
      
      <!-- Top Bar: Skip Intro & Audio Toggle -->
      <div class="absolute top-6 right-6 z-50 flex items-center gap-3">
        <button id="intro-audio-btn" class="px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider text-[#C6A15B] border border-[#C6A15B]/40 bg-[#171717]/60 backdrop-blur-md hover:bg-[#C6A15B]/20 transition-all flex items-center gap-2">
          <span id="audio-icon">🔊</span>
          <span id="audio-text">Audio On</span>
        </button>
        <button id="skip-intro-btn" class="px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest text-[#F8F3E9] uppercase border border-[#C6A15B]/60 bg-[#481C25]/80 backdrop-blur-md hover:bg-[#C6A15B] hover:text-[#171717] transition-all shadow-lg shadow-black/40">
          Skip Intro ➔
        </button>
      </div>

      <!-- Scene Narrative Captions -->
      <div class="absolute bottom-16 left-0 right-0 z-40 text-center pointer-events-none px-6 transition-all duration-700" id="intro-captions">
        <div class="inline-block px-6 py-2.5 rounded-full bg-[#171717]/75 backdrop-blur-md border border-[#C6A15B]/30 shadow-2xl">
          <p id="caption-title" class="font-serif text-[#C6A15B] text-sm md:text-base tracking-widest uppercase mb-0.5">Scene I: Cosmic Origin</p>
          <p id="caption-desc" class="text-xs md:text-sm text-[#F8F3E9]/90 font-light">From the cosmic stillness, the sacred geometry of the Vastu Purusha Mandala awakens...</p>
        </div>
      </div>

      <!-- Timeline Progress Bar -->
      <div class="absolute bottom-6 left-12 right-12 z-40">
        <div class="w-full bg-[#481C25]/40 h-1 rounded-full overflow-hidden border border-[#C6A15B]/20">
          <div id="intro-progress-bar" class="h-full bg-gradient-to-r from-[#C6A15B] via-[#E4C988] to-[#C6A15B] w-0 transition-all duration-100 shadow-[0_0_8px_#C6A15B]"></div>
        </div>
        <div class="flex justify-between text-[10px] text-[#C6A15B]/70 uppercase tracking-widest mt-1.5 font-medium">
          <span>1. Cosmic Universe</span>
          <span>2. The House</span>
          <span>3. Energy Inflow</span>
          <span>4. Protection Dome</span>
          <span>5. Vastu Sutram</span>
        </div>
      </div>

      <!-- Scene 5 Logo Reveal Overlay (Hidden initially) -->
      <div id="intro-logo-reveal" class="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#12080B]/90 via-[#481C25]/80 to-[#12080B]/95 backdrop-blur-md opacity-0 pointer-events-none transition-opacity duration-1000">
        <div class="max-w-2xl text-center flex flex-col items-center transform transition-transform duration-1000 scale-95" id="logo-reveal-content">
          <!-- Logo Image -->
          <div class="w-64 md:w-80 mb-6">
            <img src="assets/logo.png" alt="VASTU SUTRAM – Rajni Singh" class="w-full h-auto object-contain original-brand-logo" />
          </div>

          <!-- Tagline & Quote -->
          <div class="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C6A15B] to-transparent mb-4"></div>
          <p class="font-serif text-lg md:text-2xl text-[#F8F3E9] italic tracking-wide mb-8 drop-shadow">
            "Where Ancient Wisdom Meets Harmonious Living."
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center gap-4">
            <button id="btn-explore-website" class="px-8 py-3.5 rounded-full font-serif text-sm tracking-widest uppercase font-semibold text-[#171717] bg-gradient-to-r from-[#D9A52D] via-[#F9E29B] to-[#C6A15B] hover:shadow-[0_0_25px_rgba(217,165,45,0.6)] transform hover:-translate-y-0.5 transition-all">
              EXPLORE THE WEBSITE
            </button>
            <button id="btn-book-from-intro" class="px-8 py-3.5 rounded-full font-serif text-sm tracking-widest uppercase font-medium text-[#F8F3E9] border border-[#C6A15B] bg-[#481C25]/60 hover:bg-[#C6A15B]/20 backdrop-blur-md hover:shadow-[0_0_20px_rgba(198,161,91,0.3)] transform hover:-translate-y-0.5 transition-all">
              BOOK A CONSULTATION
            </button>
          </div>
        </div>
      </div>
    `;
  }

  initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    } catch (e) {
      console.warn('Web Audio not supported');
    }
  }

  playAmbientChime(freq = 216, type = 'sine', duration = 3.5) {
    if (!this.audioEnabled || !this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      
      // Warm Vedic bell harmonic
      gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, this.audioCtx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context policy
    }
  }

  initThree() {
    const container = document.getElementById('intro-canvas-container');
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Three.js Scene, Camera, Renderer
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x12080B, 0.015);

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 45);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    // Realistic Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.6);
    this.scene.add(ambientLight);

    this.pointLight = new THREE.PointLight(0xD9A52D, 2.5, 120);
    this.pointLight.position.set(0, 10, 25);
    this.scene.add(this.pointLight);

    const goldDirectional = new THREE.DirectionalLight(0xF9E29B, 1.2);
    goldDirectional.position.set(20, 40, 30);
    this.scene.add(goldDirectional);

    // BUILD 3D OBJECTS
    this.createCosmicParticles();
    this.createVastuChakraMesh();
    this.createIndianHouseMesh();
    this.createProtectionDome();
  }

  createCosmicParticles() {
    const particleCount = 2800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const goldColors = [
      new THREE.Color(0xF9E29B),
      new THREE.Color(0xD9A52D),
      new THREE.Color(0xC6A15B),
      new THREE.Color(0xFFFFFF)
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 10 + Math.random() * 90;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3] = radius * Math.cos(phi) * Math.sin(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(phi) * Math.cos(theta);

      const color = goldColors[Math.floor(Math.random() * goldColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.45,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  createVastuChakraMesh() {
    this.chakraGroup = new THREE.Group();

    // 1. Central Brahmasthan Core (Golden glowing octahedron/mandala)
    const coreGeo = new THREE.OctahedronGeometry(2, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xF9E29B,
      emissive: 0xD9A52D,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.15,
      wireframe: true
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.chakraGroup.add(coreMesh);

    // 2. Concentric Square Grids (9x9 Padavinyasa Mandala)
    for (let r = 4; r <= 16; r += 3) {
      const squareGeo = new THREE.RingGeometry(r - 0.15, r + 0.15, 4);
      const squareMat = new THREE.MeshBasicMaterial({
        color: 0xC6A15B,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const squareMesh = new THREE.Mesh(squareGeo, squareMat);
      squareMesh.rotation.z = Math.PI / 4;
      this.chakraGroup.add(squareMesh);
    }

    // 3. Concentric Rings
    for (let r = 6; r <= 18; r += 4) {
      const ringGeo = new THREE.RingGeometry(r - 0.08, r + 0.08, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xD9A52D,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      this.chakraGroup.add(ringMesh);
    }

    // 4. 8 Directional Indicators / Rays
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const rayGeo = new THREE.ConeGeometry(0.5, 3.5, 4);
      const rayMat = new THREE.MeshStandardMaterial({
        color: 0xF9E29B,
        emissive: 0xC6A15B,
        metalness: 0.8,
        roughness: 0.2
      });
      const rayMesh = new THREE.Mesh(rayGeo, rayMat);
      rayMesh.position.set(Math.cos(angle) * 19, Math.sin(angle) * 19, 0);
      rayMesh.rotation.z = angle - Math.PI / 2;
      this.chakraGroup.add(rayMesh);
    }

    // 5. 32 Small Radiant Dots representing the 32 Gates
    const dotsGeo = new THREE.BufferGeometry();
    const dotPositions = [];
    for (let i = 0; i < 32; i++) {
      const angle = (i * Math.PI * 2) / 32;
      dotPositions.push(Math.cos(angle) * 17.5, Math.sin(angle) * 17.5, 0);
    }
    dotsGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));
    const dotsMat = new THREE.PointsMaterial({ color: 0xFFE082, size: 0.65 });
    const dotsMesh = new THREE.Points(dotsGeo, dotsMat);
    this.chakraGroup.add(dotsMesh);

    this.chakraGroup.position.set(0, 0, 0);
    this.scene.add(this.chakraGroup);
  }

  createIndianHouseMesh() {
    this.houseGroup = new THREE.Group();

    // Stone Plinth / Base
    const plinthGeo = new THREE.BoxGeometry(26, 1.5, 20);
    const plinthMat = new THREE.MeshStandardMaterial({ color: 0x2A2022, roughness: 0.8 });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = -7;
    this.houseGroup.add(plinth);

    // Main House Walls (Indian Luxury Sandstone/Terracotta Finish)
    const wallGeo = new THREE.BoxGeometry(24, 12, 18);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x3D1A22,
      roughness: 0.6,
      metalness: 0.1
    });
    this.houseWalls = new THREE.Mesh(wallGeo, wallMat);
    this.houseWalls.position.y = -0.5;
    this.houseGroup.add(this.houseWalls);

    // Traditional Sloping Eaves / Gopura Crown Roof
    const roofGeo = new THREE.ConeGeometry(17, 7, 4);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x5C2028,
      roughness: 0.4,
      metalness: 0.3
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 9;
    roof.rotation.y = Math.PI / 4;
    this.houseGroup.add(roof);

    // Traditional Carved Teak Wooden Double Doors
    const doorFrameGeo = new THREE.BoxGeometry(6.6, 9.4, 0.6);
    const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0xC6A15B, metalness: 0.8 });
    const doorFrame = new THREE.Mesh(doorFrameGeo, doorFrameMat);
    doorFrame.position.set(0, -2, 9.1);
    this.houseGroup.add(doorFrame);

    // Left Door Leaf
    const doorGeo = new THREE.BoxGeometry(3, 9, 0.4);
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x301808,
      roughness: 0.5,
      metalness: 0.2
    });

    this.doorLeft = new THREE.Mesh(doorGeo, doorMat);
    this.doorLeft.position.set(-1.5, -2, 9.3);
    this.doorLeftPivot = new THREE.Group();
    this.doorLeftPivot.position.set(-3, -2, 9.3);
    this.doorLeft.position.set(1.5, 0, 0);
    this.doorLeftPivot.add(this.doorLeft);
    this.houseGroup.add(this.doorLeftPivot);

    // Right Door Leaf
    this.doorRight = new THREE.Mesh(doorGeo, doorMat);
    this.doorRightPivot = new THREE.Group();
    this.doorRightPivot.position.set(3, -2, 9.3);
    this.doorRight.position.set(-1.5, 0, 0);
    this.doorRightPivot.add(this.doorRight);
    this.houseGroup.add(this.doorRightPivot);

    // Courtyard Inner Warm Light
    this.interiorLight = new THREE.PointLight(0xFFA500, 0, 30);
    this.interiorLight.position.set(0, -1, 5);
    this.houseGroup.add(this.interiorLight);

    // Golden Directional Grid Lines on the floor inside house
    const gridHelper = new THREE.GridHelper(16, 8, 0xF9E29B, 0xC6A15B);
    gridHelper.position.set(0, -6.1, 0);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0;
    this.floorGrid = gridHelper;
    this.houseGroup.add(gridHelper);

    // Initially hide house behind fog / distance
    this.houseGroup.position.set(0, 0, -40);
    this.houseGroup.scale.set(0.1, 0.1, 0.1);
    this.scene.add(this.houseGroup);
  }

  createProtectionDome() {
    // Translucent Golden Protective Mandala Dome
    const domeGeo = new THREE.SphereGeometry(22, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0xF9E29B,
      emissive: 0xD9A52D,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0,
      wireframe: true,
      side: THREE.DoubleSide
    });
    this.domeMesh = new THREE.Mesh(domeGeo, domeMat);
    this.domeMesh.position.set(0, -7, 0);
    this.scene.add(this.domeMesh);

    // Concentric Energy Pulse Rings around house
    const pulseRingGeo = new THREE.RingGeometry(24, 25, 64);
    const pulseRingMat = new THREE.MeshBasicMaterial({
      color: 0xD9A52D,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    this.pulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat);
    this.pulseRing.rotation.x = Math.PI / 2;
    this.pulseRing.position.set(0, -6.8, 0);
    this.scene.add(this.pulseRing);
  }

  bindEvents() {
    const skipBtn = document.getElementById('skip-intro-btn');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => this.skipIntro());
    }

    const audioBtn = document.getElementById('intro-audio-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        this.audioEnabled = !this.audioEnabled;
        document.getElementById('audio-icon').textContent = this.audioEnabled ? '🔊' : '🔇';
        document.getElementById('audio-text').textContent = this.audioEnabled ? 'Audio On' : 'Muted';
      });
    }

    const exploreBtn = document.getElementById('btn-explore-website');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => this.dismissIntro());
    }

    const bookBtn = document.getElementById('btn-book-from-intro');
    if (bookBtn) {
      bookBtn.addEventListener('click', () => {
        this.dismissIntro();
        if (window.VastuApp && window.VastuApp.openBookingModal) {
          window.VastuApp.openBookingModal();
        }
      });
    }

    // Handle Resize
    window.addEventListener('resize', () => {
      if (!this.renderer || !this.camera) return;
      const container = document.getElementById('intro-canvas-container');
      const w = container ? container.clientWidth : window.innerWidth;
      const h = container ? container.clientHeight : window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  start() {
    this.startTime = performance.now();
    this.playAmbientChime(194.18, 'sine', 4); // Earth frequency sound
    this.animate();
  }

  animate() {
    if (this.isDismissed) return;
    requestAnimationFrame(() => this.animate());

    const now = performance.now();
    const elapsed = now - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1);

    // Update Progress Bar
    const pBar = document.getElementById('intro-progress-bar');
    if (pBar) {
      pBar.style.width = `${progress * 100}%`;
    }

    // Rotate background particles
    if (this.particles) {
      this.particles.rotation.y += 0.0012;
      this.particles.rotation.x += 0.0006;
    }

    // SCENE TIMELINE MANAGER
    if (!this.isSkipped) {
      if (progress < 0.22) {
        this.renderScene1(progress / 0.22);
      } else if (progress < 0.44) {
        this.renderScene2((progress - 0.22) / 0.22);
      } else if (progress < 0.66) {
        this.renderScene3((progress - 0.44) / 0.22);
      } else if (progress < 0.85) {
        this.renderScene4((progress - 0.66) / 0.19);
      } else {
        this.renderScene5((progress - 0.85) / 0.15);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  updateCaptions(title, desc) {
    const t = document.getElementById('caption-title');
    const d = document.getElementById('caption-desc');
    if (t && d && (t.textContent !== title)) {
      t.textContent = title;
      d.textContent = desc;
    }
  }

  // SCENE 1: Cosmic Universe & Mandala Emergence
  renderScene1(t) {
    this.updateCaptions(
      "Scene I: The Cosmic Universe",
      "From the cosmic stillness, the sacred geometry of the Vastu Purusha Mandala emerges with glowing golden precision..."
    );

    // Rotate and slowly tilt chakra in 3D
    this.chakraGroup.rotation.z += 0.006;
    this.chakraGroup.rotation.y = Math.sin(t * Math.PI) * 0.35;
    this.chakraGroup.rotation.x = Math.cos(t * Math.PI) * 0.2;

    // Zoom camera in gradually
    this.camera.position.z = 45 - t * 12;
    this.camera.position.y = Math.sin(t * Math.PI) * 2;
  }

  // SCENE 2: The House Appears & Doors Open
  renderScene2(t) {
    this.updateCaptions(
      "Scene II: The Sacred Dwelling",
      "A luxury Indian sanctuary materializes. The golden Vastu Chakra approaches the grand carved entrance..."
    );

    // Scale house up and bring closer
    this.houseGroup.position.z = -40 + t * 40; // from -40 to 0
    const scale = 0.1 + t * 0.9;
    this.houseGroup.scale.set(scale, scale, scale);

    // Move chakra towards the door
    this.chakraGroup.position.set(0, -2, 22 - t * 11);
    this.chakraGroup.scale.set(1 - t * 0.4, 1 - t * 0.4, 1 - t * 0.4);
    this.chakraGroup.rotation.z += 0.01;

    // Slowly open teak wooden doors
    if (t > 0.4) {
      const doorOpen = (t - 0.4) / 0.6;
      this.doorLeftPivot.rotation.y = -doorOpen * 1.6;
      this.doorRightPivot.rotation.y = doorOpen * 1.6;
      this.interiorLight.intensity = doorOpen * 2.5;
    }

    this.camera.position.set(0, 3 - t * 2, 33 - t * 10);
    this.camera.lookAt(0, -2, 0);

    if (t > 0.8 && !this._scene2SoundPlayed) {
      this.playAmbientChime(288, 'triangle', 3.5);
      this._scene2SoundPlayed = true;
    }
  }

  // SCENE 3: Chakra Enters House & Floor Grid Forms
  renderScene3(t) {
    this.updateCaptions(
      "Scene III: Golden Energy Inflow",
      "The chakra transforms into streams of golden prana, permeating the courtyard and manifesting the 9x9 sacred floor grid..."
    );

    // Fade chakra into streaming particle effect
    this.chakraGroup.scale.set((1 - t) * 0.6, (1 - t) * 0.6, (1 - t) * 0.6);
    this.chakraGroup.position.z = 11 - t * 12; // Enters into the doorway

    // Floor grid illuminates
    this.floorGrid.material.opacity = Math.min(t * 1.2, 0.9);

    // Camera swoops forward following golden particles into the entrance
    this.camera.position.set(0, -1 + Math.sin(t * Math.PI) * 1.5, 23 - t * 14);
    this.camera.lookAt(0, -2, -5);

    if (t > 0.5 && !this._scene3SoundPlayed) {
      this.playAmbientChime(324, 'sine', 3);
      this._scene3SoundPlayed = true;
    }
  }

  // SCENE 4: Symbolic Protection Dome & Harmony Field
  renderScene4(t) {
    this.updateCaptions(
      "Scene IV: Symbolic Protection & Harmony",
      "Luminous golden energy radiates outwards, weaving an ethereal dome of balance, prosperity and protection..."
    );

    // Camera gently pulls back to wide shot
    this.camera.position.set(0, 8 + t * 4, 9 + t * 35);
    this.camera.lookAt(0, 2, 0);

    // Golden Dome appears and pulses
    this.domeMesh.material.opacity = Math.min(t * 0.7, 0.65);
    this.domeMesh.rotation.y += 0.005;

    // Expanding golden wave rings
    this.pulseRing.material.opacity = Math.sin(t * Math.PI) * 0.8;
    this.pulseRing.scale.set(1 + t * 0.8, 1 + t * 0.8, 1 + t * 0.8);

    // House illuminated with warm glow
    this.houseWalls.material.emissive = new THREE.Color(0xC6A15B);
    this.houseWalls.material.emissiveIntensity = t * 0.35;

    if (!this._scene4SoundPlayed) {
      this.playAmbientChime(432, 'sine', 4); // Sacred 432 Hz frequency
      this._scene4SoundPlayed = true;
    }
  }

  // SCENE 5: Logo Reveal & Brand Climax
  renderScene5(t) {
    this.updateCaptions(
      "Scene V: Vastu Sutram",
      "Where Ancient Wisdom Meets Harmonious Living."
    );

    // Reveal Logo Overlay
    const overlay = document.getElementById('intro-logo-reveal');
    const content = document.getElementById('logo-reveal-content');
    if (overlay && content) {
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
      content.style.transform = 'scale(1)';
    }

    if (!this._scene5SoundPlayed) {
      this.playAmbientChime(528, 'sine', 5); // 528 Hz transformation tone
      this._scene5SoundPlayed = true;
    }
  }

  skipIntro() {
    this.isSkipped = true;
    this.renderScene5(1);
    const pBar = document.getElementById('intro-progress-bar');
    if (pBar) pBar.style.width = '100%';
  }

  dismissIntro() {
    this.isDismissed = true;
    this.container.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    this.container.style.opacity = '0';
    this.container.style.transform = 'scale(1.04)';
    this.container.style.pointerEvents = 'none';

    setTimeout(() => {
      this.container.style.display = 'none';
      // Mark as seen in session storage
      sessionStorage.setItem('vastu_intro_seen', 'true');
    }, 850);
  }
}

// Export / global hook
window.VastuCinematicIntro = VastuCinematicIntro;
