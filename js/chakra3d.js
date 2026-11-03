/**
 * VASTU SUTRAM – Interactive 3D Rotating Vastu Purusha Mandala & Directional Compass
 * Built with Three.js:
 * - Multi-layered 3D Vastu Mandala & Concentric Champagne Gold Rings
 * - 8 Directional 3D Sectors (N, NE, E, SE, S, SW, W, NW) with Sanskrit & Element Labels
 * - 81-Pada (9x9) Sacred Vastu Purusha Lattice & 8-Petal Lotus Geometry
 * - Central Brahmasthan Stepped Golden Pedestal & Counter-Rotating Crystal Octahedron
 * - 32 Padavinyasa Outer Gate Spheres
 * - Smooth Continuous 3D Rotation, 2-Axis Drag Tilt & Spin, Scroll-to-Zoom, Raycaster Picking
 * - Automatic High-Precision SVG Fallback if WebGL is unavailable
 */

class InteractiveVastuChakra {
  constructor(canvasContainerId, infoPanelId) {
    this.container =
      document.getElementById(canvasContainerId) ||
      document.getElementById('chakra-3d-canvas-container') ||
      document.getElementById('chakra-3d-canvas');
    this.infoPanel =
      document.getElementById(infoPanelId) ||
      document.getElementById('chakra-info-panel');

    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.chakraGroup = null;
    this.wheelGroup = null;
    this.centerCrystal = null;
    this.outerHaloRing = null;
    this.directionSectors = {};
    this.pickableMeshes = [];
    this.selectedDirection = 'NE';
    this.hoveredDirection = null;

    this.isAutoRotating = true;
    this.isDragging = false;
    this.dragMoved = false;
    this.previousMouseX = 0;
    this.previousMouseY = 0;

    // Default 3D orientation & camera zoom
    this.defaultTiltX = -0.52; // ~30 deg luxury architectural perspective
    this.targetTiltX = this.defaultTiltX;
    this.currentTiltX = this.defaultTiltX;

    this.targetRotationZ = 0;
    this.currentRotationZ = 0;

    this.defaultZoom = 34;
    this.targetZoom = this.defaultZoom;
    this.currentZoom = this.defaultZoom;

    this.animationFrameId = null;
    this.clock = window.THREE ? new THREE.Clock() : null;
    this.raycaster = window.THREE ? new THREE.Raycaster() : null;
    this.pointer = window.THREE ? new THREE.Vector2() : null;

    this.init();
  }

  init() {
    this.populateDirectionButtonsBar();

    if (!window.THREE) {
      this.renderFallbackSVG();
      this.selectDirection(this.selectedDirection);
      return;
    }

    try {
      const width = this.container.clientWidth || 640;
      const height = this.container.clientHeight || 520;

      // 1. Scene
      this.scene = new THREE.Scene();

      // 2. Camera
      this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 250);
      this.camera.position.set(0, -4.5, this.defaultZoom);
      this.camera.lookAt(0, 0, 0);

      // 3. WebGL Renderer
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

      this.container.innerHTML = '';
      this.renderer.domElement.style.width = '100%';
      this.renderer.domElement.style.height = '100%';
      this.renderer.domElement.style.display = 'block';
      this.renderer.domElement.style.cursor = 'grab';
      this.container.appendChild(this.renderer.domElement);

      // 4. Lighting
      const ambientLight = new THREE.AmbientLight(0xFFFDF8, 0.92);
      this.scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xFFE7A8, 1.55);
      keyLight.position.set(16, 22, 28);
      this.scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0xC6A15B, 0.95);
      rimLight.position.set(-18, -16, 18);
      this.scene.add(rimLight);

      const maroonFill = new THREE.PointLight(0x8B2639, 1.2, 48);
      maroonFill.position.set(0, -14, 10);
      this.scene.add(maroonFill);

      const brahmaLight = new THREE.PointLight(0xFFD778, 1.6, 26);
      brahmaLight.position.set(0, 0, 5.5);
      this.scene.add(brahmaLight);

      // 5. Build 3D Vastu Chakra Hierarchy
      // chakraGroup holds the 3D tilt (X rotation); wheelGroup rotates continuously around Z
      this.chakraGroup = new THREE.Group();
      this.chakraGroup.rotation.x = this.defaultTiltX;
      this.scene.add(this.chakraGroup);

      this.wheelGroup = new THREE.Group();
      this.chakraGroup.add(this.wheelGroup);

      this.buildChakraGeometry();
      this.setupInteractions();
      this.selectDirection('NE');
      this.animate();
    } catch (err) {
      console.error('WebGL Vastu Chakra initialization error, switching to SVG fallback:', err);
      this.renderFallbackSVG();
      this.selectDirection(this.selectedDirection);
    }
  }

  populateDirectionButtonsBar() {
    const btnBar = document.getElementById('chakra-direction-buttons');
    if (!btnBar) return;

    const directionsOrder = [
      { code: 'N', label: 'N • North' },
      { code: 'NE', label: 'NE • Ishanya' },
      { code: 'E', label: 'E • East' },
      { code: 'SE', label: 'SE • Agneya' },
      { code: 'S', label: 'S • South' },
      { code: 'SW', label: 'SW • Nairrutya' },
      { code: 'W', label: 'W • West' },
      { code: 'NW', label: 'NW • Vayavya' },
      { code: 'CENTER', label: '✦ Brahmasthan' }
    ];

    btnBar.innerHTML = directionsOrder
      .map(
        (d) => `
        <button
          type="button"
          data-chakra-dir="${d.code}"
          class="px-3 py-1.5 rounded-full border border-[#C6A15B]/35 text-[#F8F3E9] hover:border-[#C6A15B] hover:text-[#F9E29B] transition-all whitespace-nowrap font-serif tracking-wider text-[11px]"
        >
          ${d.label}
        </button>
      `
      )
      .join('');
  }

  createTextLabelSprite(title, subtitle, elementTag, isCardinal = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 140;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Subtle pill backdrop for crisp legibility at any 3D angle
    ctx.fillStyle = isCardinal ? 'rgba(52, 16, 24, 0.88)' : 'rgba(20, 13, 16, 0.84)';
    ctx.strokeStyle = isCardinal ? 'rgba(249, 226, 155, 0.85)' : 'rgba(198, 161, 91, 0.55)';
    ctx.lineWidth = 3;

    const rx = 18;
    const ry = 16;
    const rw = 220;
    const rh = 108;
    const radius = 22;
    ctx.beginPath();
    ctx.moveTo(rx + radius, ry);
    ctx.lineTo(rx + rw - radius, ry);
    ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius);
    ctx.lineTo(rx + rw, ry + rh - radius);
    ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh);
    ctx.lineTo(rx + radius, ry + rh);
    ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius);
    ctx.lineTo(rx, ry + radius);
    ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Main Direction Code (N, NE, E...)
    ctx.font = 'bold 40px "Cinzel", "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = isCardinal ? '#F9E29B' : '#E6C67C';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, 128, 50);

    // Sanskrit / Direction Subtitle
    ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#F8F3E9';
    ctx.fillText(subtitle, 128, 84);

    // Element tag
    ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#C6A15B';
    ctx.fillText(elementTag, 128, 108);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(3.2, 1.75, 1);
    sprite.renderOrder = 10;
    return sprite;
  }

  buildChakraGeometry() {
    // Ancient Civilization Bronze, Burnished Temple Brass & Carved Stone Materials
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0x9C7238, // Aged Chola Bronze
      metalness: 0.72,
      roughness: 0.42,
      emissive: 0x2A1A08,
      emissiveIntensity: 0.22
    });

    const brightGoldMat = new THREE.MeshStandardMaterial({
      color: 0xC69A4B, // Burnished Antique Temple Brass
      metalness: 0.76,
      roughness: 0.34,
      emissive: 0x3D270C,
      emissiveIntensity: 0.28
    });

    const maroonBaseMat = new THREE.MeshStandardMaterial({
      color: 0x24120E, // Weathered Ancient Terracotta-Stone Plinth
      metalness: 0.35,
      roughness: 0.68,
      emissive: 0x100504,
      emissiveIntensity: 0.2
    });

    const obsidianPlateMat = new THREE.MeshStandardMaterial({
      color: 0x18100D, // Dark Carved Basalt Sanctum Plate
      metalness: 0.42,
      roughness: 0.58
    });

    // 1. Heavy Royal Architectural Plinth Disc (3D Depth Base)
    const outerPlinthGeo = new THREE.CylinderGeometry(12.2, 12.6, 0.7, 96);
    outerPlinthGeo.rotateX(Math.PI / 2);
    const outerPlinth = new THREE.Mesh(outerPlinthGeo, maroonBaseMat);
    outerPlinth.position.z = -0.45;
    this.wheelGroup.add(outerPlinth);

    const innerPlateGeo = new THREE.CylinderGeometry(11.3, 11.3, 0.36, 96);
    innerPlateGeo.rotateX(Math.PI / 2);
    const innerPlate = new THREE.Mesh(innerPlateGeo, obsidianPlateMat);
    innerPlate.position.z = -0.18;
    this.wheelGroup.add(innerPlate);

    // 2. Multiple Concentric Champagne Gold 3D Torus Rings
    const ringRadii = [
      { r: 12.15, tube: 0.18, mat: brightGoldMat, z: 0.05 },
      { r: 11.2, tube: 0.13, mat: goldMat, z: 0.12 },
      { r: 9.25, tube: 0.11, mat: goldMat, z: 0.16 },
      { r: 6.1, tube: 0.1, mat: brightGoldMat, z: 0.22 },
      { r: 3.15, tube: 0.12, mat: brightGoldMat, z: 0.3 }
    ];

    ringRadii.forEach((cfg) => {
      const torusGeo = new THREE.TorusGeometry(cfg.r, cfg.tube, 24, 128);
      const torus = new THREE.Mesh(torusGeo, cfg.mat);
      torus.position.z = cfg.z;
      this.wheelGroup.add(torus);
    });

    // Counter-rotating outer celestial halo ring with degree ticks
    this.outerHaloRing = new THREE.Group();
    const haloTorus = new THREE.Mesh(
      new THREE.TorusGeometry(12.85, 0.05, 16, 128),
      new THREE.MeshBasicMaterial({ color: 0xC6A15B, transparent: true, opacity: 0.55 })
    );
    this.outerHaloRing.add(haloTorus);

    for (let i = 0; i < 72; i++) {
      const angle = (i / 72) * Math.PI * 2;
      const isMajor = i % 9 === 0;
      const len = isMajor ? 0.55 : 0.26;
      const rStart = 12.45;
      const pts = [
        new THREE.Vector3(Math.cos(angle) * rStart, Math.sin(angle) * rStart, 0.05),
        new THREE.Vector3(Math.cos(angle) * (rStart + len), Math.sin(angle) * (rStart + len), 0.05)
      ];
      const tickGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const tickMat = new THREE.LineBasicMaterial({
        color: isMajor ? 0xF9E29B : 0xC6A15B,
        transparent: true,
        opacity: isMajor ? 0.9 : 0.45
      });
      this.outerHaloRing.add(new THREE.Line(tickGeo, tickMat));
    }
    this.wheelGroup.add(this.outerHaloRing);

    // 3. Eight Directional 3D Sectors (N, NE, E, SE, S, SW, W, NW) — Ancient Patinated Mineral & Bronze Tones
    const directionsConfig = [
      { code: 'N', sub: 'Uttara', el: 'Water • Kubera', deg: 90, color: 0x1D4438, accent: 0x4E8E72, cardinal: true },
      { code: 'NE', sub: 'Ishanya', el: 'Water/Space • Shiva', deg: 45, color: 0x1E3A54, accent: 0x5C8BB5, cardinal: false },
      { code: 'E', sub: 'Purva', el: 'Air/Fire • Surya', deg: 0, color: 0x6B3B1E, accent: 0xC98448, cardinal: true },
      { code: 'SE', sub: 'Agneya', el: 'Fire • Agni', deg: -45, color: 0x63211B, accent: 0xB85642, cardinal: false },
      { code: 'S', sub: 'Dakshina', el: 'Earth/Fire • Yama', deg: -90, color: 0x54161D, accent: 0xAD3944, cardinal: true },
      { code: 'SW', sub: 'Nairrutya', el: 'Earth • Nirriti', deg: -135, color: 0x4F361C, accent: 0xB38348, cardinal: false },
      { code: 'W', sub: 'Paschima', el: 'Space • Varuna', deg: 180, color: 0x2C3440, accent: 0x798897, cardinal: true },
      { code: 'NW', sub: 'Vayavya', el: 'Air • Vayu', deg: 135, color: 0x3A3F45, accent: 0x99A2AC, cardinal: false }
    ];

    const innerRadius = 3.25;
    const outerRadius = 9.15;
    const halfSpan = THREE.MathUtils.degToRad(20.8);

    directionsConfig.forEach((dir) => {
      const centerAngle = THREE.MathUtils.degToRad(dir.deg);
      const startAngle = centerAngle - halfSpan;
      const endAngle = centerAngle + halfSpan;

      const sectorGroup = new THREE.Group();
      sectorGroup.userData = { directionCode: dir.code };

      // 3D Extruded Sector Wedge
      const wedgeShape = new THREE.Shape();
      wedgeShape.absarc(0, 0, outerRadius, startAngle, endAngle, false);
      wedgeShape.absarc(0, 0, innerRadius, endAngle, startAngle, true);
      wedgeShape.closePath();

      const extrudeSettings = {
        depth: 0.32,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.06,
        bevelThickness: 0.06
      };

      const wedgeGeo = new THREE.ExtrudeGeometry(wedgeShape, extrudeSettings);
      const wedgeMat = new THREE.MeshStandardMaterial({
        color: dir.color,
        metalness: 0.42,
        roughness: 0.36,
        emissive: dir.color,
        emissiveIntensity: 0.18
      });

      const wedgeMesh = new THREE.Mesh(wedgeGeo, wedgeMat);
      wedgeMesh.position.z = 0.02;
      wedgeMesh.userData = { directionCode: dir.code };
      sectorGroup.add(wedgeMesh);
      this.pickableMeshes.push(wedgeMesh);

      // Golden Outline Border on the Top Face of Each Sector
      const borderPts = [];
      const arcSteps = 20;
      for (let s = 0; s <= arcSteps; s++) {
        const a = startAngle + (s / arcSteps) * (endAngle - startAngle);
        borderPts.push(new THREE.Vector3(Math.cos(a) * outerRadius, Math.sin(a) * outerRadius, 0.42));
      }
      for (let s = arcSteps; s >= 0; s--) {
        const a = startAngle + (s / arcSteps) * (endAngle - startAngle);
        borderPts.push(new THREE.Vector3(Math.cos(a) * innerRadius, Math.sin(a) * innerRadius, 0.42));
      }
      borderPts.push(borderPts[0].clone());

      const borderGeo = new THREE.BufferGeometry().setFromPoints(borderPts);
      const borderLine = new THREE.Line(
        borderGeo,
        new THREE.LineBasicMaterial({ color: 0xF9E29B, transparent: true, opacity: 0.78 })
      );
      sectorGroup.add(borderLine);

      // 3D Compass Pointer Spear for Each Direction
      const pointerGroup = new THREE.Group();
      const coneLen = dir.cardinal ? 1.55 : 1.15;
      const coneRadius = dir.cardinal ? 0.36 : 0.26;
      const coneGeo = new THREE.ConeGeometry(coneRadius, coneLen, 4);
      const coneMesh = new THREE.Mesh(coneGeo, dir.cardinal ? brightGoldMat : goldMat);
      coneMesh.position.set(
        Math.cos(centerAngle) * 10.05,
        Math.sin(centerAngle) * 10.05,
        0.34
      );
      // Point cone outward radially
      coneMesh.rotation.z = centerAngle - Math.PI / 2;
      coneMesh.userData = { directionCode: dir.code };
      pointerGroup.add(coneMesh);
      this.pickableMeshes.push(coneMesh);
      sectorGroup.add(pointerGroup);

      // Golden Radial Spoke from Inner Ring to Outer Rim
      const spokeAngle = centerAngle + THREE.MathUtils.degToRad(22.5);
      const spokeGeo = new THREE.CylinderGeometry(0.045, 0.045, 8.05, 8);
      const spokeMesh = new THREE.Mesh(spokeGeo, goldMat);
      const midR = 7.2;
      spokeMesh.position.set(
        Math.cos(spokeAngle) * midR,
        Math.sin(spokeAngle) * midR,
        0.26
      );
      spokeMesh.rotation.z = spokeAngle - Math.PI / 2;
      this.wheelGroup.add(spokeMesh);

      // Crisp 3D Direction Label Sprite floating above each wedge
      const labelSprite = this.createTextLabelSprite(dir.code, dir.sub, dir.el, dir.cardinal);
      const labelR = 6.55;
      labelSprite.position.set(
        Math.cos(centerAngle) * labelR,
        Math.sin(centerAngle) * labelR,
        0.95
      );
      labelSprite.userData = { directionCode: dir.code };
      sectorGroup.add(labelSprite);

      this.directionSectors[dir.code] = {
        group: sectorGroup,
        mesh: wedgeMesh,
        border: borderLine,
        baseColor: dir.color,
        accentColor: dir.accent,
        targetZ: 0
      };

      this.wheelGroup.add(sectorGroup);
    });

    // 4. Sacred 81-Pada (9x9) Vastu Purusha Mandala Grid & Octagram Star
    const gridSize = 11.4;
    const halfGrid = gridSize / 2;
    const divisions = 9;
    const step = gridSize / divisions;
    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0xF9E29B,
      transparent: true,
      opacity: 0.34
    });

    for (let i = 0; i <= divisions; i++) {
      const offset = -halfGrid + i * step;
      // Clip grid lines inside the 9.15 radius circle
      const maxCoord = Math.sqrt(Math.max(0, 9.05 * 9.05 - offset * offset));
      if (maxCoord > 0.2) {
        const hGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-maxCoord, offset, 0.44),
          new THREE.Vector3(maxCoord, offset, 0.44)
        ]);
        const vGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(offset, -maxCoord, 0.44),
          new THREE.Vector3(offset, maxCoord, 0.44)
        ]);
        this.wheelGroup.add(new THREE.Line(hGeo, gridMaterial));
        this.wheelGroup.add(new THREE.Line(vGeo, gridMaterial));
      }
    }

    // Sacred Vedic Octagram (Two Interlocking 3D Golden Squares)
    const sqRadius = 8.95;
    for (let sq = 0; sq < 2; sq++) {
      const rotOffset = sq * (Math.PI / 4);
      const sqPts = [];
      for (let c = 0; c <= 4; c++) {
        const a = rotOffset + (c * Math.PI) / 2 + Math.PI / 4;
        sqPts.push(new THREE.Vector3(Math.cos(a) * sqRadius, Math.sin(a) * sqRadius, 0.46));
      }
      const sqGeo = new THREE.BufferGeometry().setFromPoints(sqPts);
      const sqLine = new THREE.Line(
        sqGeo,
        new THREE.LineBasicMaterial({ color: 0xF9E29B, transparent: true, opacity: 0.65 })
      );
      this.wheelGroup.add(sqLine);
    }

    // 5. 32 Outer Padavinyasa Gate Jewels along the Perimeter
    const gateRadius = 11.68;
    for (let g = 0; g < 32; g++) {
      const angle = (g / 32) * Math.PI * 2;
      // Highlight key auspicious gates in glowing emerald-gold, others in champagne gold
      const isAuspicious = [2, 3, 10, 11, 18, 19, 26, 27, 28].includes(g);
      const gateOrbGeo = new THREE.SphereGeometry(isAuspicious ? 0.19 : 0.13, 16, 16);
      const gateOrbMat = new THREE.MeshStandardMaterial({
        color: isAuspicious ? 0x52B788 : 0xC6A15B,
        metalness: 0.75,
        roughness: 0.2,
        emissive: isAuspicious ? 0x2D6A4F : 0x4A3612,
        emissiveIntensity: isAuspicious ? 0.65 : 0.3
      });
      const orb = new THREE.Mesh(gateOrbGeo, gateOrbMat);
      orb.position.set(Math.cos(angle) * gateRadius, Math.sin(angle) * gateRadius, 0.24);
      this.wheelGroup.add(orb);
    }

    // 6. Central Brahmasthan (Lotus Pedestal + Sacred 8-Petal Mandala + Floating Golden Crystal)
    const brahmaGroup = new THREE.Group();
    brahmaGroup.userData = { directionCode: 'CENTER' };

    const step1Geo = new THREE.CylinderGeometry(3.05, 3.2, 0.35, 48);
    step1Geo.rotateX(Math.PI / 2);
    const step1Mat = new THREE.MeshStandardMaterial({
      color: 0x581C28,
      metalness: 0.5,
      roughness: 0.35,
      emissive: 0x2A0910,
      emissiveIntensity: 0.3
    });
    const step1Mesh = new THREE.Mesh(step1Geo, step1Mat);
    step1Mesh.position.z = 0.25;
    step1Mesh.userData = { directionCode: 'CENTER' };
    brahmaGroup.add(step1Mesh);
    this.pickableMeshes.push(step1Mesh);

    const step2Geo = new THREE.CylinderGeometry(2.15, 2.35, 0.35, 48);
    step2Geo.rotateX(Math.PI / 2);
    const step2Mesh = new THREE.Mesh(step2Geo, goldMat.clone());
    step2Mesh.position.z = 0.5;
    step2Mesh.userData = { directionCode: 'CENTER' };
    brahmaGroup.add(step2Mesh);
    this.pickableMeshes.push(step2Mesh);

    // 8 Sculpted Golden Lotus Petals around the Brahmasthan
    for (let p = 0; p < 8; p++) {
      const pAngle = (p / 8) * Math.PI * 2;
      const petalGeo = new THREE.ConeGeometry(0.42, 1.15, 4);
      const petalMesh = new THREE.Mesh(petalGeo, brightGoldMat);
      petalMesh.position.set(Math.cos(pAngle) * 2.45, Math.sin(pAngle) * 2.45, 0.45);
      petalMesh.rotation.z = pAngle - Math.PI / 2;
      petalMesh.userData = { directionCode: 'CENTER' };
      brahmaGroup.add(petalMesh);
      this.pickableMeshes.push(petalMesh);
    }

    // Central Floating Golden Octahedron Crystal (Brahma Bindu)
    const crystalGeo = new THREE.OctahedronGeometry(1.05, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xF9E29B,
      metalness: 0.92,
      roughness: 0.1,
      emissive: 0xC6A15B,
      emissiveIntensity: 0.55
    });
    this.centerCrystal = new THREE.Mesh(crystalGeo, crystalMat);
    this.centerCrystal.position.z = 1.45;
    this.centerCrystal.userData = { directionCode: 'CENTER' };
    brahmaGroup.add(this.centerCrystal);
    this.pickableMeshes.push(this.centerCrystal);

    // Brahmasthan Center Label Sprite
    const centerSprite = this.createTextLabelSprite('BRAHMA', 'Brahmasthan', 'Akash • Ether', true);
    centerSprite.scale.set(2.65, 1.45, 1);
    centerSprite.position.set(0, 0, 2.75);
    brahmaGroup.add(centerSprite);

    this.directionSectors['CENTER'] = {
      group: brahmaGroup,
      mesh: step1Mesh,
      border: null,
      baseColor: 0x581C28,
      accentColor: 0xF9E29B,
      targetZ: 0
    };

    this.wheelGroup.add(brahmaGroup);
  }

  setupInteractions() {
    if (!this.renderer) return;
    const dom = this.renderer.domElement;

    // Pointer / Mouse Drag for 3D Rotation + Tilt
    dom.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.dragMoved = false;
      this.previousMouseX = e.clientX;
      this.previousMouseY = e.clientY;
      dom.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMouseX;
        const deltaY = e.clientY - this.previousMouseY;
        if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
          this.dragMoved = true;
        }
        this.targetRotationZ += deltaX * 0.0085;
        this.targetTiltX = THREE.MathUtils.clamp(
          this.targetTiltX + deltaY * 0.006,
          -1.05,
          0.15
        );
        this.previousMouseX = e.clientX;
        this.previousMouseY = e.clientY;
      } else {
        this.handlePointerHover(e);
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        dom.style.cursor = 'grab';
      }
    });

    // Click on 3D Sector to Select Direction
    dom.addEventListener('click', (e) => {
      if (this.dragMoved) return;
      const hitCode = this.raycastDirection(e.clientX, e.clientY);
      if (hitCode) {
        this.selectDirection(hitCode);
      }
    });

    // Scroll-to-Zoom (Clamped within safe camera bounds)
    dom.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        this.targetZoom = THREE.MathUtils.clamp(
          this.targetZoom + e.deltaY * 0.018,
          23,
          46
        );
      },
      { passive: false }
    );

    // Mobile Touch Drag (Spin & 3D Tilt) + Tap Selection
    let touchStartX = 0;
    let touchStartY = 0;
    dom.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length === 1) {
          this.isDragging = true;
          this.dragMoved = false;
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          this.previousMouseX = touchStartX;
          this.previousMouseY = touchStartY;
        }
      },
      { passive: true }
    );

    dom.addEventListener(
      'touchmove',
      (e) => {
        if (this.isDragging && e.touches.length === 1) {
          const deltaX = e.touches[0].clientX - this.previousMouseX;
          const deltaY = e.touches[0].clientY - this.previousMouseY;
          if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
            this.dragMoved = true;
          }
          this.targetRotationZ += deltaX * 0.0085;
          this.targetTiltX = THREE.MathUtils.clamp(
            this.targetTiltX + deltaY * 0.0055,
            -1.05,
            0.15
          );
          this.previousMouseX = e.touches[0].clientX;
          this.previousMouseY = e.touches[0].clientY;
        }
      },
      { passive: true }
    );

    dom.addEventListener('touchend', (e) => {
      if (!this.dragMoved && e.changedTouches && e.changedTouches.length === 1) {
        const t = e.changedTouches[0];
        const hitCode = this.raycastDirection(t.clientX, t.clientY);
        if (hitCode) {
          this.selectDirection(hitCode);
        }
      }
      this.isDragging = false;
    });

    // Bind Direction Selector Buttons
    this.bindControlButtons();

    // Responsive Resize Handling
    const handleResize = () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      if (w > 0 && h > 0) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      }
    };

    window.addEventListener('resize', handleResize);
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(handleResize);
      this.resizeObserver.observe(this.container);
    }
  }

  bindControlButtons() {
    document.querySelectorAll('[data-chakra-dir]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const dir = e.currentTarget.getAttribute('data-chakra-dir');
        this.selectDirection(dir);
      });
    });

    const toggleSpinBtn = document.getElementById('chakra-autorotate-btn');
    if (toggleSpinBtn) {
      toggleSpinBtn.addEventListener('click', () => {
        this.isAutoRotating = !this.isAutoRotating;
        toggleSpinBtn.textContent = this.isAutoRotating ? 'Pause Rotation' : 'Resume Rotation';
      });
    }

    const resetBtn = document.getElementById('chakra-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.targetRotationZ = 0;
        this.targetTiltX = this.defaultTiltX;
        this.targetZoom = this.defaultZoom;
        this.isAutoRotating = true;
        if (toggleSpinBtn) toggleSpinBtn.textContent = 'Pause Rotation';
        this.selectDirection('NE');
      });
    }
  }

  raycastDirection(clientX, clientY) {
    if (!this.raycaster || !this.renderer || !this.camera) return null;
    const rect = this.renderer.domElement.getBoundingClientRect();
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return null;
    }

    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.pickableMeshes, true);
    if (intersects.length > 0) {
      let obj = intersects[0].object;
      while (obj) {
        if (obj.userData && obj.userData.directionCode) {
          return obj.userData.directionCode;
        }
        obj = obj.parent;
      }
    }
    return null;
  }

  handlePointerHover(e) {
    if (!this.renderer) return;
    const hitCode = this.raycastDirection(e.clientX, e.clientY);
    if (hitCode !== this.hoveredDirection) {
      this.hoveredDirection = hitCode;
      this.renderer.domElement.style.cursor = hitCode ? 'pointer' : 'grab';
      this.updateSectorHighlights();
    }
  }

  updateSectorHighlights() {
    Object.keys(this.directionSectors).forEach((key) => {
      const item = this.directionSectors[key];
      const isSelected = key === this.selectedDirection;
      const isHovered = key === this.hoveredDirection;

      if (isSelected) {
        item.mesh.material.emissive.setHex(0xC6A15B);
        item.mesh.material.emissiveIntensity = 0.68;
        item.targetZ = 0.45;
      } else if (isHovered) {
        item.mesh.material.emissive.setHex(item.accentColor);
        item.mesh.material.emissiveIntensity = 0.45;
        item.targetZ = 0.22;
      } else {
        item.mesh.material.emissive.setHex(item.baseColor);
        item.mesh.material.emissiveIntensity = 0.18;
        item.targetZ = 0;
      }
    });
  }

  selectDirection(dirCode) {
    this.selectedDirection = dirCode;
    this.updateSectorHighlights();

    // Update active state on direction pills
    document.querySelectorAll('[data-chakra-dir]').forEach((btn) => {
      const code = btn.getAttribute('data-chakra-dir');
      if (code === dirCode) {
        btn.classList.add('bg-[#C6A15B]', 'text-[#121011]', 'font-bold', 'shadow-md');
        btn.classList.remove('text-[#F8F3E9]');
      } else {
        btn.classList.remove('bg-[#C6A15B]', 'text-[#121011]', 'font-bold', 'shadow-md');
        btn.classList.add('text-[#F8F3E9]');
      }
    });

    // Update SVG fallback highlight if active
    this.container.querySelectorAll('[data-svg-sector]').forEach((el) => {
      if (el.getAttribute('data-svg-sector') === dirCode) {
        el.setAttribute('fill-opacity', '0.95');
        el.setAttribute('stroke-width', '2.8');
      } else {
        el.setAttribute('fill-opacity', '0.68');
        el.setAttribute('stroke-width', '1.2');
      }
    });

    this.renderInfoPanel(dirCode);
  }

  renderInfoPanel(dirCode) {
    if (!this.infoPanel || typeof VASTU_DATA === 'undefined') return;

    const dirData =
      VASTU_DATA.directions.find((d) => d.code === dirCode) || VASTU_DATA.directions[1];

    // Match corresponding Panchabhuta (5 Element) wisdom
    const elementMatch = VASTU_DATA.panchabhutas.find((p) => {
      if (dirCode === 'NE' || dirCode === 'N') return p.id === 'jal';
      if (dirCode === 'SE' || dirCode === 'S') return p.id === 'agni';
      if (dirCode === 'SW') return p.id === 'prithvi';
      if (dirCode === 'NW' || dirCode === 'E') return p.id === 'vayu';
      return p.id === 'akash';
    });

    // Match corresponding Padavinyasa gates for cardinal directions
    const gatePrefixMap = { N: 'N', E: 'E', S: 'S', W: 'W' };
    const gatePrefix = gatePrefixMap[dirCode] || null;
    const auspiciousGates = gatePrefix
      ? VASTU_DATA.gates32.filter((g) => g.id.startsWith(gatePrefix) && g.auspicious)
      : [];

    this.infoPanel.innerHTML = `
      <div class="animate-fadeIn space-y-5">
        <div class="flex items-center justify-between border-b border-[#C6A15B]/30 pb-3">
          <div>
            <span class="text-[11px] uppercase tracking-[0.22em] text-[#C6A15B] font-semibold block">
              Selected Vedic Sector • ${dirData.code}
            </span>
            <h3 class="text-2xl md:text-3xl font-serif font-bold text-[#F8F3E9] mt-0.5">${dirData.name}</h3>
          </div>
          <div class="w-12 h-12 rounded-full border-2 border-[#C6A15B] flex items-center justify-center font-serif font-bold text-sm text-[#F9E29B] bg-[#481C25]/80 shadow-inner">
            ${dirData.code === 'CENTER' ? '✦' : dirData.code}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 text-xs">
          <div class="p-3 rounded-xl bg-[#24161A]/90 border border-[#C6A15B]/25">
            <span class="text-[#C6A15B] block uppercase tracking-wider text-[10px]">Ruling Deity (Adhipati)</span>
            <strong class="text-[#F8F3E9] text-sm font-serif mt-0.5 block">${dirData.rulingDeity}</strong>
          </div>
          <div class="p-3 rounded-xl bg-[#24161A]/90 border border-[#C6A15B]/25">
            <span class="text-[#C6A15B] block uppercase tracking-wider text-[10px]">Planetary Lord (Graha)</span>
            <strong class="text-[#F8F3E9] text-sm font-serif mt-0.5 block">${dirData.rulingPlanet}</strong>
          </div>
          <div class="p-3 rounded-xl bg-[#24161A]/90 border border-[#C6A15B]/25">
            <span class="text-[#C6A15B] block uppercase tracking-wider text-[10px]">Panchabhuta Element</span>
            <strong class="text-[#F9E29B] text-sm font-serif mt-0.5 block">${dirData.element}</strong>
          </div>
          <div class="p-3 rounded-xl bg-[#24161A]/90 border border-[#C6A15B]/25">
            <span class="text-[#C6A15B] block uppercase tracking-wider text-[10px]">Primary Resonance</span>
            <strong class="text-[#F8F3E9] text-xs mt-0.5 block leading-snug">${dirData.attributes}</strong>
          </div>
        </div>

        <div class="space-y-3 text-xs leading-relaxed">
          <div class="p-3.5 rounded-xl bg-[#1E1316] border-l-2 border-[#C6A15B]">
            <h4 class="text-[#C6A15B] font-semibold uppercase tracking-wider text-[11px] mb-1">
              Ideal Spatial Allocation (Residential & Commercial)
            </h4>
            <p class="text-[#F8F3E9]/90">${dirData.idealRooms}</p>
          </div>

          <div class="p-3.5 rounded-xl bg-[#481C25]/35 border-l-2 border-[#E76F51]">
            <h4 class="text-[#F9E29B] font-semibold uppercase tracking-wider text-[11px] mb-1">
              Vedic Sthapatya Guidelines & Remedies
            </h4>
            <p class="text-[#F8F3E9]/85">${dirData.dosAndDonts}</p>
          </div>

          ${
            elementMatch
              ? `
          <div class="p-3.5 rounded-xl bg-[#140E10]/90 border border-[#C6A15B]/20">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] uppercase tracking-widest text-[#C6A15B] font-bold">
                Elemental Principle • ${elementMatch.name}
              </span>
              <span class="text-[10px] text-[#DCCBB0]">${elementMatch.symbol}</span>
            </div>
            <p class="text-[#DCCBB0] text-[11px] leading-relaxed">${elementMatch.description}</p>
          </div>
          `
              : ''
          }

          ${
            auspiciousGates.length > 0
              ? `
          <div class="p-3 rounded-xl bg-[#1A2E26]/40 border border-[#52B788]/30">
            <span class="text-[10px] uppercase tracking-widest text-[#52B788] font-bold block mb-1">
              Auspicious Padavinyasa Entrance Gates (${dirData.code})
            </span>
            <p class="text-[#F8F3E9]/90 text-[11px]">
              ${auspiciousGates.map((g) => `<strong>${g.id} (${g.name})</strong>: ${g.effect}`).join(' • ')}
            </p>
          </div>
          `
              : ''
          }
        </div>
      </div>
    `;
  }

  renderFallbackSVG() {
    // High-precision interactive SVG fallback if WebGL is disabled on client device
    this.container.innerHTML = `
      <div class="w-full h-full flex items-center justify-center p-4">
        <svg viewBox="-140 -140 280 280" class="w-full h-full max-h-[480px] drop-shadow-2xl">
          <defs>
            <radialGradient id="chakraMaroonGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#481C25" />
              <stop offset="100%" stop-color="#12070A" />
            </radialGradient>
          </defs>
          <circle cx="0" cy="0" r="130" fill="url(#chakraMaroonGrad)" stroke="#C6A15B" stroke-width="3" />
          <circle cx="0" cy="0" r="115" fill="none" stroke="#F9E29B" stroke-width="1" stroke-dasharray="4 3" />
          <circle cx="0" cy="0" r="95" fill="none" stroke="#C6A15B" stroke-width="1.5" />
          <g id="svg-chakra-sectors">
            ${[
              { code: 'N', angle: -90, color: '#1D5B47' },
              { code: 'NE', angle: -45, color: '#1E4E79' },
              { code: 'E', angle: 0, color: '#7F421C' },
              { code: 'SE', angle: 45, color: '#7A231D' },
              { code: 'S', angle: 90, color: '#6B1520' },
              { code: 'SW', angle: 135, color: '#5E3E1C' },
              { code: 'W', angle: 180, color: '#2F3B4C' },
              { code: 'NW', angle: -135, color: '#3E4C59' }
            ]
              .map((d) => {
                const a1 = ((d.angle - 21) * Math.PI) / 180;
                const a2 = ((d.angle + 21) * Math.PI) / 180;
                const rIn = 36;
                const rOut = 94;
                const x1 = Math.cos(a1) * rIn;
                const y1 = Math.sin(a1) * rIn;
                const x2 = Math.cos(a1) * rOut;
                const y2 = Math.sin(a1) * rOut;
                const x3 = Math.cos(a2) * rOut;
                const y3 = Math.sin(a2) * rOut;
                const x4 = Math.cos(a2) * rIn;
                const y4 = Math.sin(a2) * rIn;
                const mid = (d.angle * Math.PI) / 180;
                const tx = Math.cos(mid) * 66;
                const ty = Math.sin(mid) * 66;
                return `
                  <g class="cursor-pointer" onclick="window.vastuApp && window.vastuApp.chakraInstance && window.vastuApp.chakraInstance.selectDirection('${d.code}')">
                    <path data-svg-sector="${d.code}" d="M ${x1} ${y1} L ${x2} ${y2} A ${rOut} ${rOut} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${rIn} ${rIn} 0 0 0 ${x1} ${y1} Z" fill="${d.color}" fill-opacity="0.75" stroke="#F9E29B" stroke-width="1.4" />
                    <text x="${tx}" y="${ty}" fill="#F9E29B" font-size="11" font-family="Cinzel, serif" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${d.code}</text>
                  </g>
                `;
              })
              .join('')}
          </g>
          <g class="cursor-pointer" onclick="window.vastuApp && window.vastuApp.chakraInstance && window.vastuApp.chakraInstance.selectDirection('CENTER')">
            <circle data-svg-sector="CENTER" cx="0" cy="0" r="32" fill="#581C28" stroke="#F9E29B" stroke-width="2" />
            <text x="0" y="2" fill="#F9E29B" font-size="8.5" font-family="Cinzel, serif" font-weight="bold" text-anchor="middle" dominant-baseline="middle">BRAHMA</text>
          </g>
        </svg>
      </div>
    `;
    this.bindControlButtons();
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    if (!this.renderer || !this.scene || !this.camera) return;

    const elapsedTime = this.clock ? this.clock.getElapsedTime() : Date.now() * 0.001;

    // Continuous smooth rotation around Z when auto-rotating and not dragging
    if (this.isAutoRotating && !this.isDragging) {
      this.targetRotationZ -= 0.0032;
    }

    // Smooth damping for wheel spin, 3D tilt, and camera zoom
    this.currentRotationZ += (this.targetRotationZ - this.currentRotationZ) * 0.08;
    this.currentTiltX += (this.targetTiltX - this.currentTiltX) * 0.08;
    this.currentZoom += (this.targetZoom - this.currentZoom) * 0.1;

    if (this.wheelGroup) {
      this.wheelGroup.rotation.z = this.currentRotationZ;
    }

    if (this.chakraGroup) {
      // Gentle harmonic breathing tilt on top of user-controlled tilt angle
      this.chakraGroup.rotation.x = this.currentTiltX + Math.sin(elapsedTime * 0.8) * 0.025;
      this.chakraGroup.position.y = Math.sin(elapsedTime * 1.1) * 0.15;
    }

    // Smooth Z-elevation transition for selected/hovered 3D sector
    Object.keys(this.directionSectors).forEach((key) => {
      const item = this.directionSectors[key];
      if (item && item.group) {
        item.group.position.z += (item.targetZ - item.group.position.z) * 0.12;
      }
    });

    // Counter-rotate outer celestial degree ring
    if (this.outerHaloRing) {
      this.outerHaloRing.rotation.z = -this.currentRotationZ * 1.35;
    }

    // Counter-rotate & levitate central Brahmasthan crystal
    if (this.centerCrystal) {
      this.centerCrystal.rotation.z = -elapsedTime * 1.2;
      this.centerCrystal.rotation.x = Math.sin(elapsedTime * 1.5) * 0.35;
      this.centerCrystal.position.z = 1.45 + Math.sin(elapsedTime * 2.2) * 0.18;
    }

    this.camera.position.z = this.currentZoom;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }
}

window.InteractiveVastuChakra = InteractiveVastuChakra;
