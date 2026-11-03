/**
 * VASTU SUTRAM – Interactive 3D Vastu Chakra & Knowledge Explorer
 */

class InteractiveVastuChakra {
  constructor(canvasContainerId, infoPanelId) {
    this.container = document.getElementById(canvasContainerId);
    this.infoPanel = document.getElementById(infoPanelId);
    if (!this.container) return;

    this.selectedDirection = "NE"; // Default to Ishanya (North-East)
    this.autoRotate = true;
    this.currentZoom = 38;
    this.targetRotation = 0;
    this.currentRotation = 0;
    this.isDragging = false;
    this.prevMouseX = 0;

    this.initThree();
    this.bindEvents();
    this.selectDirection("NE");
    this.animate();
  }

  initThree() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 550;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, -5, this.currentZoom);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Warm Vedic Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.85);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xF9E29B, 1.4);
    dirLight.position.set(10, 20, 30);
    this.scene.add(dirLight);

    // Build Chakra Master Group
    this.wheelGroup = new THREE.Group();
    this.wheelGroup.rotation.x = -Math.PI * 0.18; // Cinematic 3D angle
    this.scene.add(this.wheelGroup);

    this.buildChakraGeometry();
  }

  buildChakraGeometry() {
    // 1. Outer Dark Medallion Disc
    const baseGeo = new THREE.CylinderGeometry(18, 18, 0.4, 64);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1A0B10,
      roughness: 0.4,
      metalness: 0.7
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.rotation.x = Math.PI / 2;
    this.wheelGroup.add(baseMesh);

    // 2. Concentric Golden Ring Dividers
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xF9E29B,
      emissive: 0xC6A15B,
      emissiveIntensity: 0.3,
      metalness: 0.9,
      roughness: 0.2
    });

    [6, 10, 14, 17.5].forEach(r => {
      const ringGeo = new THREE.RingGeometry(r - 0.12, r + 0.12, 64);
      const ringMesh = new THREE.Mesh(ringGeo, goldMat);
      ringMesh.position.z = 0.25;
      this.wheelGroup.add(ringMesh);
    });

    // 3. Central Brahmasthan Square / Octahedron
    const centerGeo = new THREE.BoxGeometry(4.2, 4.2, 0.6);
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0xD9A52D,
      emissive: 0xF9E29B,
      emissiveIntensity: 0.5,
      metalness: 0.9
    });
    this.brahmasthanMesh = new THREE.Mesh(centerGeo, centerMat);
    this.brahmasthanMesh.position.z = 0.35;
    this.wheelGroup.add(this.brahmasthanMesh);

    // 4. Directional Wedge Segments (8 Cardinal/Intercardinal)
    this.directionMeshes = {};
    const dirAngles = [
      { code: "N", angle: Math.PI / 2, color: 0x2D6A4F },
      { code: "NE", angle: Math.PI / 4, color: 0x3A86FF },
      { code: "E", angle: 0, color: 0xF4A261 },
      { code: "SE", angle: -Math.PI / 4, color: 0xE76F51 },
      { code: "S", angle: -Math.PI / 2, color: 0xC1121F },
      { code: "SW", angle: -Math.PI * 0.75, color: 0xDDA15E },
      { code: "W", angle: Math.PI, color: 0x6C757D },
      { code: "NW", angle: Math.PI * 0.75, color: 0x8D99AE }
    ];

    dirAngles.forEach(dir => {
      const wedgeGroup = new THREE.Group();
      
      // Arc Segment
      const arcGeo = new THREE.RingGeometry(6, 17.2, 24, 1, dir.angle - Math.PI / 8, Math.PI / 4);
      const arcMat = new THREE.MeshStandardMaterial({
        color: dir.color,
        roughness: 0.4,
        metalness: 0.5,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide
      });
      const arcMesh = new THREE.Mesh(arcGeo, arcMat);
      arcMesh.position.z = 0.28;
      wedgeGroup.add(arcMesh);

      // Pointer Ray
      const pointerGeo = new THREE.ConeGeometry(0.4, 2.2, 4);
      const pointerMat = new THREE.MeshStandardMaterial({ color: 0xF9E29B, metalness: 0.8 });
      const pointer = new THREE.Mesh(pointerGeo, pointerMat);
      pointer.position.set(Math.cos(dir.angle) * 16.5, Math.sin(dir.angle) * 16.5, 0.45);
      pointer.rotation.z = dir.angle - Math.PI / 2;
      wedgeGroup.add(pointer);

      this.wheelGroup.add(wedgeGroup);
      this.directionMeshes[dir.code] = { group: wedgeGroup, mat: arcMat, originalColor: dir.color };
    });

    // 5. 32 Radiant Gate Pips on Perimeter
    const gateGeo = new THREE.SphereGeometry(0.25, 8, 8);
    const gateMatAuspicious = new THREE.MeshBasicMaterial({ color: 0x55FF55 });
    const gateMatNormal = new THREE.MeshBasicMaterial({ color: 0xC6A15B });

    for (let i = 0; i < 32; i++) {
      const theta = (i * Math.PI * 2) / 32;
      const isAuspicious = [2, 3, 10, 11, 18, 19, 26, 27].includes(i); // E3, E4, S3, S4, W3, W4, N3, N4
      const pip = new THREE.Mesh(gateGeo, isAuspicious ? gateMatAuspicious : gateMatNormal);
      pip.position.set(Math.cos(theta) * 17.6, Math.sin(theta) * 17.6, 0.35);
      this.wheelGroup.add(pip);
    }
  }

  bindEvents() {
    const canvasEl = this.renderer.domElement;

    // Drag to Rotate
    canvasEl.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMouseX = e.clientX;
      this.autoRotate = false;
      const btn = document.getElementById('chakra-autorotate-btn');
      if (btn) btn.textContent = '▶ Auto-Rotate';
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    canvasEl.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.prevMouseX;
      this.wheelGroup.rotation.z += deltaX * 0.008;
      this.prevMouseX = e.clientX;
    });

    // Touch Support for Mobile
    canvasEl.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.prevMouseX = e.touches[0].clientX;
        this.autoRotate = false;
      }
    });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    canvasEl.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - this.prevMouseX;
      this.wheelGroup.rotation.z += deltaX * 0.01;
      this.prevMouseX = e.touches[0].clientX;
    });

    // Zoom Buttons
    const zoomInBtn = document.getElementById('chakra-zoom-in');
    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => this.zoom(-4));
    }
    const zoomOutBtn = document.getElementById('chakra-zoom-out');
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => this.zoom(4));
    }

    // Auto-Rotate Toggle
    const autoBtn = document.getElementById('chakra-autorotate-btn');
    if (autoBtn) {
      autoBtn.addEventListener('click', () => {
        this.autoRotate = !this.autoRotate;
        autoBtn.textContent = this.autoRotate ? '⏸ Pause Rotation' : '▶ Auto-Rotate';
      });
    }

    // Reset View
    const resetBtn = document.getElementById('chakra-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.wheelGroup.rotation.z = 0;
        this.currentZoom = 38;
        this.camera.position.z = 38;
      });
    }

    // Direction Select Buttons
    document.querySelectorAll('[data-vastu-dir]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const dir = e.currentTarget.getAttribute('data-vastu-dir');
        this.selectDirection(dir);
      });
    });

    // Resize
    window.addEventListener('resize', () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight || 550;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  zoom(delta) {
    this.currentZoom = Math.max(22, Math.min(55, this.currentZoom + delta));
    this.camera.position.z = this.currentZoom;
  }

  selectDirection(code) {
    this.selectedDirection = code;

    // Highlight Direction Mesh in 3D
    Object.keys(this.directionMeshes).forEach(d => {
      const item = this.directionMeshes[d];
      if (d === code) {
        item.mat.opacity = 1.0;
        item.mat.emissive = new THREE.Color(0xF9E29B);
        item.mat.emissiveIntensity = 0.6;
        item.group.scale.set(1.05, 1.05, 1.05);
      } else {
        item.mat.opacity = 0.55;
        item.mat.emissive = new THREE.Color(0x000000);
        item.mat.emissiveIntensity = 0;
        item.group.scale.set(1, 1, 1);
      }
    });

    // Update Active Button styling
    document.querySelectorAll('[data-vastu-dir]').forEach(btn => {
      if (btn.getAttribute('data-vastu-dir') === code) {
        btn.classList.add('bg-[#C6A15B]', 'text-[#171717]', 'font-bold');
        btn.classList.remove('text-[#F8F3E9]', 'bg-[#171717]/60');
      } else {
        btn.classList.remove('bg-[#C6A15B]', 'text-[#171717]', 'font-bold');
        btn.classList.add('text-[#F8F3E9]', 'bg-[#171717]/60');
      }
    });

    // Render Detailed Information into Panel
    this.renderInfoPanel(code);
  }

  renderInfoPanel(code) {
    if (!this.infoPanel) return;

    if (code === "CENTER") {
      this.infoPanel.innerHTML = `
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b border-[#C6A15B]/20 pb-3">
            <div>
              <span class="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold">Central Axis</span>
              <h3 class="font-serif text-2xl text-[#F8F3E9] font-bold">Brahmasthan (Cosmic Core)</h3>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-[#C6A15B]/20 text-[#C6A15B] border border-[#C6A15B]/40">Ether / Akash</span>
          </div>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="p-3 rounded-lg bg-[#12080B]/50 border border-[#C6A15B]/15">
              <span class="text-[#DCCBB0] block font-light">Ruling Deity</span>
              <span class="text-[#F8F3E9] font-semibold">Lord Brahma (The Creator)</span>
            </div>
            <div class="p-3 rounded-lg bg-[#12080B]/50 border border-[#C6A15B]/15">
              <span class="text-[#DCCBB0] block font-light">Element & Color</span>
              <span class="text-[#C6A15B] font-semibold">Akash • Pure Gold & Ivory</span>
            </div>
          </div>
          <div>
            <h4 class="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold mb-1">Cosmic Function</h4>
            <p class="text-xs text-[#DCCBB0] leading-relaxed">The central 1/9th zone of any plot or dwelling. It represents the navel of the Vastu Purusha through which cosmic prana enters and circulates throughout all 8 directions.</p>
          </div>
          <div class="p-3.5 rounded-lg bg-[#481C25]/40 border border-[#C6A15B]/25">
            <h4 class="text-xs uppercase tracking-widest text-[#F9E29B] font-bold mb-1">Essential Architectural Principles</h4>
            <ul class="text-xs text-[#F8F3E9]/90 space-y-1 list-disc list-inside">
              <li>Keep completely open, light, and structurally uncluttered</li>
              <li>Strictly no heavy RCC columns, beams, or load-bearing pillars</li>
              <li>No toilets, septic tanks, kitchens, or underground sumps</li>
              <li>Traditional feature: Open courtyard (Angan) or natural central skylight</li>
            </ul>
          </div>
        </div>
      `;
      return;
    }

    const data = VASTU_DATA.directions.find(d => d.code === code) || VASTU_DATA.directions[0];
    const relatedGates = VASTU_DATA.gates32.filter(g => g.code.startsWith(code.charAt(0)));

    this.infoPanel.innerHTML = `
      <div class="space-y-4">
        <!-- Direction Title -->
        <div class="flex items-center justify-between border-b border-[#C6A15B]/20 pb-3">
          <div>
            <span class="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold">${data.code} Quadrant</span>
            <h3 class="font-serif text-2xl text-[#F8F3E9] font-bold">${data.name}</h3>
          </div>
          <div class="w-4 h-4 rounded-full" style="background-color: ${data.color}"></div>
        </div>

        <!-- Deities & Elements -->
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div class="p-3 rounded-lg bg-[#12080B]/50 border border-[#C6A15B]/15">
            <span class="text-[#DCCBB0] block font-light">Ruling Deity</span>
            <span class="text-[#F8F3E9] font-semibold">${data.rulingDeity}</span>
          </div>
          <div class="p-3 rounded-lg bg-[#12080B]/50 border border-[#C6A15B]/15">
            <span class="text-[#DCCBB0] block font-light">Planet & Element</span>
            <span class="text-[#F8F3E9] font-semibold">${data.rulingPlanet} • ${data.element}</span>
          </div>
        </div>

        <!-- Attributes -->
        <div>
          <h4 class="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold mb-1">Key Cosmic Influences</h4>
          <p class="text-xs text-[#F8F3E9]/90 font-medium">${data.attributes}</p>
        </div>

        <!-- Ideal Room Placements -->
        <div>
          <h4 class="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold mb-1">Ideal Room Placements</h4>
          <p class="text-xs text-[#DCCBB0] leading-relaxed">${data.idealRooms}</p>
        </div>

        <!-- Dos and Don'ts -->
        <div class="p-3.5 rounded-lg bg-[#481C25]/40 border border-[#C6A15B]/25">
          <h4 class="text-xs uppercase tracking-widest text-[#F9E29B] font-bold mb-1">Vastu Guidelines & Remedial Notes</h4>
          <p class="text-xs text-[#F8F3E9]/90 leading-relaxed">${data.dosAndDonts}</p>
        </div>

        <!-- 32 Padavinyasa Gates in this quadrant -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold">Padavinyasa Entrance Gates (${code.charAt(0)}1–${code.charAt(0)}8)</h4>
            <span class="text-[10px] text-[#C6A15B]/70">Green = Auspicious</span>
          </div>
          <div class="grid grid-cols-4 gap-1.5 text-[11px]">
            ${relatedGates.map(g => {
              const isAusp = g.nature.includes('Auspicious');
              return `
                <div class="p-2 rounded border text-center ${isAusp ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300 font-semibold' : 'border-[#C6A15B]/20 bg-[#12080B]/40 text-[#DCCBB0]'}">
                  <div class="font-mono text-xs font-bold">${g.code}</div>
                  <div class="truncate text-[10px]">${g.name}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.autoRotate && this.wheelGroup) {
      this.wheelGroup.rotation.z += 0.003;
    }

    if (this.brahmasthanMesh) {
      this.brahmasthanMesh.rotation.z -= 0.006;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.InteractiveVastuChakra = InteractiveVastuChakra;
