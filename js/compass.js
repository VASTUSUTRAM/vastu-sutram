/**
 * VASTU SUTRAM – Interactive Digital Vastu Compass
 * Features:
 * - 16 Vastu Zones & Degree Readings
 * - Auspicious Door Indicators (E3, E4, S3, S4, W3, W4, N3, N4)
 * - Device Orientation Sensor Support (Live compass on Mobile)
 * - Manual Drag Rotation
 */

class VastuCompass {
  constructor(toggleBtnId, modalId) {
    this.toggleBtn = document.getElementById(toggleBtnId);
    this.modal = document.getElementById(modalId);
    this.heading = 0; // Degrees
    this.isSensorActive = false;

    if (this.toggleBtn && this.modal) {
      this.init();
    }
  }

  init() {
    this.toggleBtn.addEventListener('click', () => {
      this.modal.classList.toggle('hidden');
      if (!this.modal.classList.contains('hidden')) {
        this.requestDeviceOrientation();
      }
    });

    const closeBtn = document.getElementById('compass-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.modal.classList.add('hidden'));
    }

    // Dial interactive slider / drag
    const slider = document.getElementById('compass-degree-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        this.setHeading(parseFloat(e.target.value));
      });
    }

    // Quick direction buttons
    document.querySelectorAll('[data-compass-preset]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const deg = parseFloat(e.currentTarget.getAttribute('data-compass-preset'));
        this.setHeading(deg);
        if (slider) slider.value = deg;
      });
    });

    this.renderCompassDial();
    this.setHeading(0);
  }

  requestDeviceOrientation() {
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', (e) => this.handleOrientation(e), true);
            this.isSensorActive = true;
          }
        })
        .catch(console.error);
    } else if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => this.handleOrientation(e), true);
      this.isSensorActive = true;
    }
  }

  handleOrientation(e) {
    let compassHeading = null;
    if (e.webkitCompassHeading) {
      compassHeading = e.webkitCompassHeading;
    } else if (e.alpha !== null) {
      compassHeading = 360 - e.alpha;
    }

    if (compassHeading !== null) {
      this.setHeading(compassHeading);
      const slider = document.getElementById('compass-degree-slider');
      if (slider) slider.value = Math.round(compassHeading);
    }
  }

  setHeading(deg) {
    this.heading = Math.round(deg) % 360;
    const dial = document.getElementById('compass-dial-svg');
    const needle = document.getElementById('compass-needle');
    const readout = document.getElementById('compass-deg-readout');
    const zoneName = document.getElementById('compass-zone-readout');
    const zoneAdvice = document.getElementById('compass-zone-advice');

    if (dial) {
      dial.style.transform = `rotate(${-this.heading}deg)`;
    }

    if (readout) {
      readout.textContent = `${this.heading}°`;
    }

    const zone = this.getZoneDetails(this.heading);
    if (zoneName) {
      zoneName.textContent = zone.name;
    }
    if (zoneAdvice) {
      zoneAdvice.textContent = zone.advice;
    }
  }

  getZoneDetails(deg) {
    // 16 Zones each 22.5 degrees
    const zones = [
      { name: "North (Uttara) • Water", advice: "Ideal for Main Entrance (N3/N4), Cash Locker, Living Room, Open Greenery." },
      { name: "North-North-East • Health", advice: "Ideal for Healing herbs, Medicine cabinet, Meditation." },
      { name: "North-East (Ishanya) • Divinity", advice: "Sacred Ishanya: Ideal for Pooja Room, Water sump. No toilets or heavy stairs." },
      { name: "East-North-East • Joy", advice: "Ideal for Family recreation, indoor plants, morning sunroom." },
      { name: "East (Purva) • Social Connections", advice: "Ideal for Grand Entrance (E3/E4), Balcony, Wide windows." },
      { name: "East-South-East • Analysis", advice: "Ideal for Study, Research notes, discussion corner." },
      { name: "South-East (Agneya) • Fire Element", advice: "Ideal for Kitchen cooktop, Electrical meter, Inverter. No water tanks." },
      { name: "South-South-East • Power & Stamina", advice: "Ideal for Fitness equipment, exercise corner." },
      { name: "South (Dakshina) • Fame & Rest", advice: "Ideal for Heavy furniture, bedroom, clockwise ascending staircase." },
      { name: "South-South-West • Disposal", advice: "Ideal for Waste disposal, septic tank, storage of discarded items." },
      { name: "South-West (Nairrutya) • Earth", advice: "Master Bedroom, Owner's Suite, Heavy structural mass. Highest plinth." },
      { name: "West-South-West • Knowledge", advice: "Ideal for Bookshelves, children study desk, educational trophies." },
      { name: "West (Paschima) • Profits & Gains", advice: "Ideal for Dining room, trade documents, conference room." },
      { name: "West-North-West • Detoxification", advice: "Ideal for Emotional release room, guest toilet with proper remedies." },
      { name: "North-West (Vayavya) • Air / Support", advice: "Ideal for Guest room, finished goods storage, parking." },
      { name: "North-North-West • Attraction", advice: "Ideal for Dressing area, couple bedroom, aesthetic decor." }
    ];

    const index = Math.round(deg / 22.5) % 16;
    return zones[index];
  }

  renderCompassDial() {
    const container = document.getElementById('compass-dial-container');
    if (!container) return;

    let markers = '';
    for (let i = 0; i < 360; i += 10) {
      const isMajor = i % 45 === 0;
      const isCard = i % 90 === 0;
      const length = isCard ? 12 : (isMajor ? 8 : 4);
      const strokeWidth = isCard ? 2 : 1;
      const strokeColor = isCard ? '#F9E29B' : '#C6A15B';

      markers += `
        <line x1="120" y1="${20}" x2="120" y2="${20 + length}" 
              stroke="${strokeColor}" stroke-width="${strokeWidth}" 
              transform="rotate(${i} 120 120)" />
      `;
    }

    container.innerHTML = `
      <svg id="compass-dial-svg" viewBox="0 0 240 240" class="w-full h-full transition-transform duration-200">
        <!-- Outer Outer Rim -->
        <circle cx="120" cy="120" r="114" fill="#171717" stroke="#C6A15B" stroke-width="2" />
        <circle cx="120" cy="120" r="106" fill="#12080B" stroke="#C6A15B" stroke-width="1" stroke-dasharray="2,2" opacity="0.6"/>
        
        <!-- Degree Ticks -->
        ${markers}

        <!-- 8 Main Direction Labels -->
        <text x="120" y="44" fill="#F9E29B" font-family="serif" font-size="12" font-weight="bold" text-anchor="middle">N</text>
        <text x="180" y="68" fill="#C6A15B" font-family="serif" font-size="9" text-anchor="middle">NE</text>
        <text x="200" y="124" fill="#F9E29B" font-family="serif" font-size="12" font-weight="bold" text-anchor="middle">E</text>
        <text x="180" y="180" fill="#C6A15B" font-family="serif" font-size="9" text-anchor="middle">SE</text>
        <text x="120" y="204" fill="#F9E29B" font-family="serif" font-size="12" font-weight="bold" text-anchor="middle">S</text>
        <text x="60" y="180" fill="#C6A15B" font-family="serif" font-size="9" text-anchor="middle">SW</text>
        <text x="40" y="124" fill="#F9E29B" font-family="serif" font-size="12" font-weight="bold" text-anchor="middle">W</text>
        <text x="60" y="68" fill="#C6A15B" font-family="serif" font-size="9" text-anchor="middle">NW</text>

        <!-- Center Emblem -->
        <circle cx="120" cy="120" r="28" fill="#481C25" stroke="#C6A15B" stroke-width="1.5" />
        <circle cx="120" cy="120" r="8" fill="#C6A15B" />
      </svg>

      <!-- Center Fixed Compass Needle (Points Upwards to Heading) -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg id="compass-needle" viewBox="0 0 240 240" class="w-full h-full">
          <!-- North Red Pointer -->
          <polygon points="120,40 125,120 115,120" fill="#E63946" stroke="#FFFFFF" stroke-width="0.5" />
          <!-- South Gold Pointer -->
          <polygon points="120,200 125,120 115,120" fill="#C6A15B" stroke="#FFFFFF" stroke-width="0.5" />
          <circle cx="120" cy="120" r="5" fill="#FFFFFF" />
        </svg>
      </div>
    `;
  }
}

window.VastuCompass = VastuCompass;
