/**
 * VASTU SUTRAM – Data Repository & Vedic Knowledge Base
 * Complete, scholarly, authentic Vedic dataset
 */

const VASTU_DATA = {
  brand: {
    name: "VASTU SUTRAM",
    tagline: "THE PRINCIPLES OF VASTU",
    subTagline: "Where Ancient Wisdom Meets Harmonious Living.",
    logoPath: "assets/logo.svg",
    logoIconPath: "assets/logo-icon.svg",
    mandalaBg: "assets/mandala-bg.svg",
    colors: {
      burgundy: "#481C25",
      gold: "#C6A15B",
      ivory: "#F8F3E9",
      charcoal: "#171717",
      sand: "#DCCBB0",
      cream: "#FFFDF8"
    }
  },

  consultant: {
    name: "Rajni Singh",
    designation: "Senior Vastu Consultant & Vedic Space Planner",
    photo: "assets/rajni-singh.svg",
    introduction: "With a deep understanding of traditional Vastu principles and their practical application, our consultant provides personalised guidance to help individuals and organisations make informed decisions about their spaces.",
    experience: "15+ Years of Dedicated Practice",
    qualifications: "Vastu Acharya • Master in Traditional Vedic Architecture (Sthapatya Veda)",
    certifications: [
      "Certified Energy Auditor & Geopathic Stress Specialist",
      "Member of Indian Council of Vedic Architectural Sciences",
      "Advanced Padavinyasa & 45 Devta Field Certification"
    ],
    journey: "Spanning over a decade and a half, Rajni Singh has guided hundreds of families, industrialists, real estate developers, and corporate institutions in harmonizing their living and working spaces with cosmic solar and geomagnetic energies, emphasizing scientific spatial logic without requiring structural demolition.",
    areasOfExpertise: [
      "Residential Vastu & Apartment Optimization",
      "Industrial Plants & Manufacturing Production Flows",
      "Commercial Showrooms, Offices & Hospitality Vastu",
      "Pre-Purchase Land & Plot Energy Audits",
      "Architectural Blueprint Alignment & 32-Gate Analysis",
      "Non-Demolition Energy Balancers & Elemental Neutralization"
    ],
    achievements: [
      "Over 1,200+ Spatial Audits conducted across India & Globally",
      "Keynote Speaker at National Vedic Architecture Conclaves",
      "Pioneered the Non-Demolition Energy Harmonization Protocol"
    ],
    awards: [
      "Vastu Shiromani Award for Excellence in Spatial Design",
      "Outstanding Vedic Consultant Award (National Heritage Forum)"
    ],
    publications: [
      "The Living Sanctuary: Vedic Geometry for Contemporary Homes",
      "Industrial Prosperity through Spatial Alignment (Research Paper)"
    ],
    mediaAppearances: [
      "Featured on Architectural Digest (Vastu & Modern Design)",
      "Vedic Living Podcast: Guest Speaker on Ep. 42 & Ep. 78",
      "Live Panelist on National Design Forum: Science of Directions"
    ],
    podcastAppearances: [
      "The Cosmic Space Podcast: Deconstructing the Brahmasthan",
      "Real Estate Horizons: Why High-Rise Apartments Need Vastu Balance",
      "Mindful Architecture with Rajni Singh"
    ],
    philosophy: "Vastu Shastra is not superstition or blind dogma; it is an empirical Vedic science of harmonizing the five primeval elements (Panchabhutas) with solar trajectories and geomagnetic force lines to nurture health, mental clarity, and abundance in human dwellings."
  },

  // Panchabhutas (Five Primordial Elements)
  panchabhutas: [
    {
      id: "prithvi",
      name: "Prithvi (Earth)",
      direction: "South-West (Nairrutya)",
      symbol: "Square / Solid Cube",
      color: "Warm Golden Yellow & Earthy Ochre",
      energy: "Stability, Gravitational Grounding, Heaviness & Mastery",
      description: "Prithvi represents grounding, structural mass, and physical security. It governs the South-West quadrant and anchors family relationships, specialized leadership skills, and long-term financial stability.",
      guidelines: [
        "Ideal for Master Bedroom and Cabin of the Head of Household / Enterprise CEO",
        "Keep this zone structurally heaviest, tallest, and completely enclosed",
        "Avoid water bodies, borewells, underground sumps, or corner cuts in the South-West",
        "Non-Demolition Remedy: Heavy brass artifacts, yellow jaisalmer stone, earth lead rods, and grounding pyramids"
      ]
    },
    {
      id: "jal",
      name: "Jal (Water)",
      direction: "North & North-East (Ishanya)",
      symbol: "Crescent / Flowing Wave",
      color: "Deep Ocean Blue, Pristine Aqua & Clear Silver",
      energy: "Clarity, Prosperity, Receptivity & Spiritual Awakening",
      description: "Jal represents fluidity, calm intellect, monetary liquidity, and spiritual elevation. It rules the North-East (Ishanya), the divine receptor of magnetic energy and morning infrared solar rays.",
      guidelines: [
        "Ideal for Pooja Room, Meditation Chambers, and Underground Water Tanks",
        "Keep this zone completely light, pristine, open, and uncluttered",
        "Strictly avoid toilets, septic tanks, overhead tanks, or kitchens here",
        "Non-Demolition Remedy: Copper/silver water urns, natural marble fountains, pristine white lighting, and energized water yantras"
      ]
    },
    {
      id: "agni",
      name: "Agni (Fire)",
      direction: "South-East (Agneya)",
      symbol: "Upward Triangle / Flame",
      color: "Vermilion Crimson, Sunset Orange & Coral Pink",
      energy: "Digestion, Cash Flow, Passion, Vitality & Radiant Drive",
      description: "Agni governs bodily metabolism, willpower, cash liquidity, and dynamic transformation. It dominates the South-East (Agneya), the intersection of morning warmth and high solar intensity.",
      guidelines: [
        "Ideal for Kitchen cooktop, electrical sub-stations, transformers, inverters, and furnaces",
        "Cook facing East to absorb life-giving morning solar ultraviolet & infrared rays",
        "Avoid placing water sumps, bathrooms, or master bedrooms directly in Agneya",
        "Non-Demolition Remedy: Copper strips, red jasper crystals, triangular fire yantras, and warm amber lighting"
      ]
    },
    {
      id: "vayu",
      name: "Vayu (Air)",
      direction: "North-West (Vayavya)",
      symbol: "Circle / Dynamic Whirl",
      color: "Pure White, Pearl Grey & Soft Sky Blue",
      energy: "Movement, Communication, Goodwill, Networking & Speed",
      description: "Vayu governs airflow, mental flexibility, banking support, commercial sales turnover, and dynamic change. It presides over the North-West (Vayavya), directing cosmic circulation.",
      guidelines: [
        "Ideal for Guest Rooms, Finished Goods Dispatch, Sales Team Workstations, and Garages",
        "Promote cross-ventilation, light furnishings, and open window fenestration",
        "Avoid locating permanent heavy machinery or owner master bedrooms here",
        "Non-Demolition Remedy: Brass air spirals, moving metal chimes, white marble spheres, and energized Vayu yantras"
      ]
    },
    {
      id: "akash",
      name: "Akash (Space / Ether)",
      direction: "Center (Brahmasthan) & West",
      symbol: "Infinite Void / Sacred Dot (Bindu)",
      color: "Luminous Golden Amber & Cosmic Translucent",
      energy: "Expansiveness, Universal Consciousness, Balance & Creation",
      description: "Akash represents the omnipresent container of all elements. It radiates from the central Brahmasthan, providing the breathing canvas that allows all cosmic and geomagnetic currents to circulate.",
      guidelines: [
        "Keep the central Brahmasthan open to the sky (courtyard/atrium) or structurally unencumbered",
        "Ensure zero load-bearing columns, overhead beams, toilets, or underground sumps in the core",
        "Maintain clean central axis allowing unobstructed prana flow between cardinal gates",
        "Non-Demolition Remedy: Convex brass ceiling mirrors, crystal lotus centers, gold wire perimeter grids, and soft diffuse ambient illumination"
      ]
    }
  ],

  // 8 Cardinal & Intercardinal Directions + Center (Brahmasthan)
  directions: [
    {
      code: "N",
      name: "North (Uttara)",
      rulingDeity: "Kubera (Lord of Wealth)",
      rulingPlanet: "Budha (Mercury)",
      element: "Jal (Water)",
      color: "#2D6A4F",
      attributes: "Abundance, Career Opportunities, New Inflow, Customer Influx",
      idealRooms: "Treasury, Cash Locker, Living Room, Entrance (N3, N4), Open Lawns",
      dosAndDonts: "Keep wide windows and low plinth; avoid heavy storage, red colors, or toilets."
    },
    {
      code: "NE",
      name: "North-East (Ishanya)",
      rulingDeity: "Lord Shiva / Ishana",
      rulingPlanet: "Guru (Jupiter)",
      element: "Jal / Akash",
      color: "#3A86FF",
      attributes: "Divine Wisdom, Spiritual Awakening, Mental Peace, Clarity of Thought",
      idealRooms: "Pooja Room, Meditation Hall, Study, Underground Water Storage",
      dosAndDonts: "Keep lowest plinth height, maximum open space; strictly no toilets or kitchen."
    },
    {
      code: "E",
      name: "East (Purva)",
      rulingDeity: "Indra & Surya",
      rulingPlanet: "Surya (Sun)",
      element: "Vayu / Fire",
      color: "#F4A261",
      attributes: "Social Connections, Health, Government Support, Vision & Leadership",
      idealRooms: "Main Entrance (E3, E4), Living Room, Balcony, Family Lounge",
      dosAndDonts: "Allow generous morning sunlight; avoid tall trees or high boundary walls directly in front."
    },
    {
      code: "SE",
      name: "South-East (Agneya)",
      rulingDeity: "Agni (Fire God)",
      rulingPlanet: "Shukra (Venus)",
      element: "Agni (Fire)",
      color: "#E76F51",
      attributes: "Cash Liquidity, Physical Energy, Passion, Domestic Happiness",
      idealRooms: "Kitchen, Electric Meter, Heat Pumps, Generators, Boilers",
      dosAndDonts: "Cook facing East; avoid water tanks, bedrooms for couples, or blue/black shades."
    },
    {
      code: "S",
      name: "South (Dakshina)",
      rulingDeity: "Yama (Lord of Dharma & Justice)",
      rulingPlanet: "Mangala (Mars)",
      element: "Fire / Earth",
      color: "#C1121F",
      attributes: "Fame, Social Recognition, Relaxation, Deep Sleep",
      idealRooms: "Master Bedroom, Heavy Furniture, Staircase (climbing clockwise)",
      dosAndDonts: "Keep wall thick and heavy; avoid borewell, underground water storage or main entrance without remedy."
    },
    {
      code: "SW",
      name: "South-West (Nairrutya)",
      rulingDeity: "Nirriti / Rahu",
      rulingPlanet: "Rahu",
      element: "Prithvi (Earth)",
      color: "#DDA15E",
      attributes: "Stability, Authority, Relationship Harmony, Skill Mastership",
      idealRooms: "Master Bedroom, Owner's Cabin, Safe Vault facing North, Heavy Storage",
      dosAndDonts: "Keep highest and heaviest zone; never build toilets, borewells or open terraces here."
    },
    {
      code: "W",
      name: "West (Paschima)",
      rulingDeity: "Varuna (Lord of Oceans)",
      rulingPlanet: "Shani (Saturn)",
      element: "Akash / Vayu",
      color: "#6C757D",
      attributes: "Profits, Monetary Gains, Realization of Dreams, Professional Growth",
      idealRooms: "Dining Room, Children Study Room, Overhead Water Tank, Office Conference",
      dosAndDonts: "Keep elevated compared to East; avoid large open pits or cuts in this zone."
    },
    {
      code: "NW",
      name: "North-West (Vayavya)",
      rulingDeity: "Vayu (Wind God)",
      rulingPlanet: "Chandra (Moon)",
      element: "Vayu (Air)",
      color: "#ADB5BD",
      attributes: "Helpful People, Banking Support, Goods Movement, Travel & Mental Agility",
      idealRooms: "Guest Room, Finished Goods Dispatch, Finished Products Warehouse, Garage",
      dosAndDonts: "Ensure fresh airflow; keep free of heavy permanent RCC columns or master bedrooms."
    },
    {
      code: "CENTER",
      name: "Center (Brahmasthan)",
      rulingDeity: "Lord Brahma (Creator)",
      rulingPlanet: "Cosmic Source",
      element: "Akash (Ether)",
      color: "#C6A15B",
      attributes: "Total Equilibrium, Vital Cosmic Life Force (Prana), Family Cohesion",
      idealRooms: "Open Courtyard, Central Atrium, Uncluttered Foyer with Natural Skylight",
      dosAndDonts: "Zero structural weight, no pillars, no toilets, no underground sumps, no septic tanks."
    }
  ],

  // 32 Gates of Vastu Purusha Mandala (Padavinyasa)
  gates32: [
    // East Gates (E1 to E8)
    { id: "E1", name: "Shikhi", direction: "East", auspicious: false, effect: "Fire hazards, excessive heat and instability in domestic peace." },
    { id: "E2", name: "Parjanya", direction: "East", auspicious: false, effect: "Unnecessary household expenditure, female health challenges." },
    { id: "E3", name: "Jayanta", direction: "East", auspicious: true, effect: "Outstanding wealth, sharp enthusiasm, victory in enterprise, prestigious reputation." },
    { id: "E4", name: "Indra", direction: "East", auspicious: true, effect: "Royal benevolence, state patronage, authority, powerful network connections." },
    { id: "E5", name: "Surya", direction: "East", auspicious: false, effect: "Extreme anger, disputes with government bodies, short-temperament." },
    { id: "E6", name: "Satya", direction: "East", auspicious: false, effect: "Breach of contracts, unreliable partnerships, lack of commitment." },
    { id: "E7", name: "Bhrisha", direction: "East", auspicious: false, effect: "Thoughtless decisions, erratic behavior, financial squandering." },
    { id: "E8", name: "Antariksha", direction: "East", auspicious: false, effect: "Isolation, excessive expenditure, emotional loneliness." },

    // South Gates (S1 to S8)
    { id: "S1", name: "Anila", direction: "South", auspicious: false, effect: "Cash burn, instability in children's education and pursuits." },
    { id: "S2", name: "Pusha", direction: "South", auspicious: false, effect: "Servant troubles, employee turnover, family discord." },
    { id: "S3", name: "Vitatha", direction: "South", auspicious: true, effect: "Fabulous prosperity through effort, practical courage, social distinction." },
    { id: "S4", name: "Brihatkshata", direction: "South", auspicious: true, effect: "Progeny abundance, sound physical health, abundant harvests, business expansion." },
    { id: "S5", name: "Yama", direction: "South", auspicious: false, effect: "Chronic legal friction, debt accumulation, mental distress." },
    { id: "S6", name: "Gandharva", direction: "South", auspicious: false, effect: "Aimless wandering, musical/artistic distractions, loss of focus." },
    { id: "S7", name: "Bhringaraja", direction: "South", auspicious: false, effect: "Disappointment in business projects, lack of follow-through." },
    { id: "S8", name: "Mriga", direction: "South", auspicious: false, effect: "Physical weakness, sudden illnesses, family estrangement." },

    // West Gates (W1 to W8)
    { id: "W1", name: "Pitra", direction: "West", auspicious: false, effect: "Ancestor issues, generational stagnation, family inertia." },
    { id: "W2", name: "Dauvarika", direction: "West", auspicious: false, effect: "Unstable relationships, suspicion, mistrust among partners." },
    { id: "W3", name: "Sugriva", direction: "West", auspicious: true, effect: "All-round wealth, continuous cash accumulation, expansion of assets." },
    { id: "W4", name: "Pushpadanta", direction: "West", auspicious: true, effect: "Assistance from wealthy mentors, flourishing of children, prosperity." },
    { id: "W5", name: "Varuna", direction: "West", auspicious: false, effect: "Fluctuating fortune, over-speculation, emotional vulnerability." },
    { id: "W6", name: "Asura", direction: "West", auspicious: false, effect: "Depression, fatigue, feeling burdened by circumstances." },
    { id: "W7", name: "Shosha", direction: "West", auspicious: false, effect: "Addictions, chronic anxiety, weakening immune system." },
    { id: "W8", name: "Papyakshma", direction: "West", auspicious: false, effect: "Unexplained illnesses, lingering ailments, loss of vitality." },

    // North Gates (N1 to N8)
    { id: "N1", name: "Roga", direction: "North", auspicious: false, effect: "Physical sickness, lethargy, constant medical expenses." },
    { id: "N2", name: "Naga", direction: "North", auspicious: false, effect: "Envy from peers, jealousy, domestic friction." },
    { id: "N3", name: "Mukhya", direction: "North", auspicious: true, effect: "High revenue, multiple new income streams, business breakthroughs." },
    { id: "N4", name: "Bhallata", direction: "North", auspicious: true, effect: "Vast legacy wealth, continuous financial windfall, real estate expansion." },
    { id: "N5", name: "Soma", direction: "North", auspicious: true, effect: "Mental tranquility, serene atmosphere, spiritual depth, prosperity." },
    { id: "N6", name: "Bhujanga", direction: "North", auspicious: false, effect: "Self-deception, excessive pride, erratic financial bets." },
    { id: "N7", name: "Aditi", direction: "North", auspicious: false, effect: "Restlessness among females, discontentment despite wealth." },
    { id: "N8", name: "Diti", direction: "North", auspicious: false, effect: "Narrow thinking, constant doubt, missed grand opportunities." }
  ],

  // 45 Devtas of Vastu Purusha Mandala
  devtas45: {
    brahma: {
      name: "Brahma",
      placement: "Central Core (Brahmasthan) - 9 Central Squares",
      attribute: "The Primordial Creator and Cosmic Source. Governs pure genesis, manifestation, and universal prana balance."
    },
    innerFour: [
      { name: "Bhudar", direction: "North", attribute: "Manifestation power and ground stability." },
      { name: "Aryama", direction: "East", attribute: "Ancestral harmony, alliances, and social contracts." },
      { name: "Vivaswan", direction: "South", attribute: "Fame, reputation, and radiant energy." },
      { name: "Mitra", direction: "West", attribute: "Friendship, business partnerships, and cooperative contracts." }
    ],
    intermediateEight: [
      { name: "Aapah", direction: "North-East", attribute: "Life-giving cosmic healing and rejuvenation." },
      { name: "Aapatsavatsa", direction: "North-East", attribute: "Nurturing energy carrier for spiritual endeavors." },
      { name: "Savita", direction: "South-East", attribute: "Inception of motivation, ignite initiation." },
      { name: "Savitra", direction: "South-East", attribute: "Active manifestation of thoughts into physical reality." },
      { name: "Jaya", direction: "South-West", attribute: "Weaponry of mind, guaranteed victory, courage." },
      { name: "Indrajaya", direction: "South-West", attribute: "Unwavering protection against negative influences." },
      { name: "Rudra", direction: "North-West", attribute: "Support channels, destruction of obstacles." },
      { name: "Rajayakshma", direction: "North-West", attribute: "Holding capacity and resource retention." }
    ],
    outerThirtyTwo: [
      "Shikhi", "Parjanya", "Jayanta", "Indra", "Surya", "Satya", "Bhrisha", "Antariksha",
      "Anila", "Pusha", "Vitatha", "Brihatkshata", "Yama", "Gandharva", "Bhringaraja", "Mriga",
      "Pitra", "Dauvarika", "Sugriva", "Pushpadanta", "Varuna", "Asura", "Shosha", "Papyakshma",
      "Roga", "Naga", "Mukhya", "Bhallata", "Soma", "Bhujanga", "Aditi", "Diti"
    ]
  },

  // Room Placement Matrix
  roomMatrix: [
    { room: "Pooja & Meditation Room", bestDirection: "North-East (Ishanya)", altDirection: "East / North", worstDirection: "South-West / South", remedy: "If misplaced in South, use silver Om yantra, white marble plinth, and light lavender crystals." },
    { room: "Kitchen & Cooktop", bestDirection: "South-East (Agneya)", altDirection: "North-West (Vayavya)", worstDirection: "North-East / South-West", remedy: "If kitchen is in North-East, install green barcode tape under cooktop and copper sun above flame." },
    { room: "Master Bedroom", bestDirection: "South-West (Nairrutya)", altDirection: "South / West", worstDirection: "North-East / North-West", remedy: "If master bedroom is in North-East, sleep with head to South; use heavy wooden bed and brass lead coils." },
    { room: "Living Room & Foyer", bestDirection: "North / East / North-East", altDirection: "North-West", worstDirection: "South-West", remedy: "Ensure heavy sofas are placed along South/West walls; keep North/East open with indoor water fountain." },
    { room: "Toilets & Bathrooms", bestDirection: "East-of-South-East (ESE) / SSW / WNW", altDirection: "South / West perimeter", worstDirection: "North-East / Central Core", remedy: "Strictly block North-East toilets with 3-sided zinc/copper floor strip barrier and activated charcoal." },
    { room: "Staircase (Internal/External)", bestDirection: "South / South-West / West", altDirection: "North-West", worstDirection: "North-East / Center", remedy: "Climb clockwise. If placed in North-East, install heavy lead pyramids under first step and brass rods." },
    { room: "Overhead Water Tank", bestDirection: "South-West / West", altDirection: "South", worstDirection: "North-East", remedy: "Must be elevated on brick pedestals; never place overhead water tank directly over central Brahmasthan." },
    { room: "Underground Water Sump / Borewell", bestDirection: "North-East / North / East", altDirection: "None", worstDirection: "South-West / South-East", remedy: "Underground water in South-West causes severe health and wealth drain. Seal immediately and shift to Ishanya." }
  ],

  // Disha Shool (Directional Restrictions & Traditional Travel Remedies)
  dishaShool: [
    { day: "Sunday (Ravivar)", direction: "West (Paschima)", planet: "Surya (Sun)", traditionalRemedy: "Consume betel leaf (Paan) or a spoon of cow's ghee before departing if travel is essential." },
    { day: "Monday (Somvar)", direction: "East (Purva)", planet: "Chandra (Moon)", traditionalRemedy: "Look into a clean mirror and drink fresh water or a spoonful of sweet curd before leaving." },
    { day: "Tuesday (Mangalvar)", direction: "North (Uttara)", planet: "Mangala (Mars)", traditionalRemedy: "Eat a piece of jaggery (Gud) and coriander seeds before stepping out of the house." },
    { day: "Wednesday (Budhavar)", direction: "North (Uttara)", planet: "Budha (Mercury)", traditionalRemedy: "Consume a small amount of sesame seeds (Til) or jaggery with water prior to the journey." },
    { day: "Thursday (Guruvar)", direction: "South (Dakshina)", planet: "Guru (Jupiter)", traditionalRemedy: "Eat yellow mustard seeds (Peeli Sarson) or sweet curd before heading on the journey." },
    { day: "Friday (Shukravar)", direction: "West (Paschima)", planet: "Shukra (Venus)", traditionalRemedy: "Consume fresh barley, sweet barley porridge, or sweetened curd before departure." },
    { day: "Saturday (Shanivar)", direction: "East (Purva)", planet: "Shani (Saturn)", traditionalRemedy: "Eat black sesame seeds (Kala Til) or a small amount of ginger with water before travel." }
  ],

  // Griha Aarambh & Griha Pravesh Principles
  sacredRituals: {
    grihaAarambh: {
      title: "Griha Aarambh (Foundation Groundbreaking)",
      description: "The classical Bhumi Pujan and foundation laying ceremony aligns the human dwelling with the awakening cycles of the Vastu Purusha.",
      keyPrinciples: [
        "Auspicious Solar Movements: Prefer Uttarayana (sun moving northward) during Shukla Paksha (waxing moon).",
        "Excavation Sequence: Excavation must commence strictly in the North-East (Ishanya) and terminate in the South-West (Nairrutya).",
        "Foundation Masonry Sequence: The first foundational cornerstone must be laid in the South-West (Nairrutya), progressing clockwise towards the North-East.",
        "Soil Fertility Test: A 1-cubit pit is filled with water; if water remains after 24 hours, the land is supremely auspicious (Gaja-Lakshmi bhumi)."
      ]
    },
    grihaPravesh: {
      title: "Griha Pravesh (Sacred Housewarming Ceremony)",
      description: "Entering an auspicious new dwelling marks the formal invocation of cosmic prana, establishing harmony, health, and family longevity.",
      classifications: [
        { type: "Apoorva Griha Pravesh", desc: "First entry into a newly constructed residence upon newly acquired land." },
        { type: "Sapoorva Griha Pravesh", desc: "Entry into an existing home after migration, relocation, or substantial reconstruction." },
        { type: "Dwandwah Griha Pravesh", desc: "Re-entry into a residence after renovation necessitated by natural elements or long vacancies." }
      ],
      auspiciousSteps: [
        "Calculate accurate Muhurta based on the homeowner's Janma Nakshatra and solar transition (Sankranti).",
        "Lead the entry carrying a brass or copper Mangal Kalash filled with pure holy water and topped with a coconut and mango leaves.",
        "Cross the auspicious threshold with the right foot forward during the calculated Muhurta time.",
        "Boil fresh milk in a new vessel until it overflows gracefully towards the East or North, symbolizing boundless domestic abundance."
      ]
    }
  },

  // COMPLETE VASTU CONSULTATION SERVICES DIRECTORY (All 5 Pillars & 50+ Sub-services)
  services: [
    {
      id: "residential",
      title: "Residential Vastu",
      category: "Residential Architecture",
      tagline: "Sacred Spatial Harmony for Homes, Flats, Villas & Renovation",
      description: "Transform your living environment into a sanctuary of deep peace, vitality, and enduring prosperity using classical Vedic geometry without requiring structural demolition.",
      subServices: [
        {
          id: "res-independent-house",
          name: "Independent House Vastu",
          icon: "🏡",
          shortDesc: "Complete spatial audit for standalone bungalows, kothis, and luxury estates.",
          importance: "Harmonizes the boundary walls, courtyard, overhead load, and underground water reservoirs with cardinal axes.",
          traditionalBasis: "Sthapatya Veda mandates strict equilibrium between heavy South-West plinths and light North-East courtyards.",
          deliverables: ["Full 16-Zone Blueprint Gridding", "32-Gate Entrance Mapping", "Non-Demolition Elemental Remedies", "Written Diagnostic Report"]
        },
        {
          id: "res-flats-apartments",
          name: "Flats and Apartments Vastu",
          icon: "🏢",
          shortDesc: "Specialized high-rise apartment analysis addressing shared vertical utility shafts and pre-fixed entrances.",
          importance: "Neutralizes imbalances when walls and beams cannot be demolished or altered.",
          traditionalBasis: "Uses micro-zoning (Padavinyasa per apartment unit) to create a localized high-frequency pranic field.",
          deliverables: ["Apartment Layout Directional Audit", "Main Door Energy Correction Strips", "Bed & Cooktop Orientation Plan", "Color Resonance Chart"]
        },
        {
          id: "res-new-construction",
          name: "New Home Construction Planning",
          icon: "📐",
          shortDesc: "End-to-end Vedic guidance from Bhumi Pujan, foundation stone, doorframe installation to Griha Pravesh.",
          importance: "Ensures structural perfection before a single brick is laid, saving millions in future remedial costs.",
          traditionalBasis: "Follows Manasara and Mayamata principles for pillar grid spans and room volume proportions (Ayadi Shadvarga).",
          deliverables: ["Architect Blueprint Collaboration", "Muhurta Calculations for 4 Milestones", "Pillar & Beam Placement Checks", "Master Ayadi Dimension Calculations"]
        },
        {
          id: "res-existing-homes",
          name: "Existing Homes (Zero Demolition)",
          icon: "✨",
          shortDesc: "Scientific energy balancing for lived-in houses using metals, crystals, pyramids, and color therapy.",
          importance: "Corrects acute Vastu doshas without knocking down a single wall or breaking expensive tiles.",
          traditionalBasis: "Elemental transmutation (Panchabhuta Shodhana) using copper, brass, zinc, and semi-precious minerals.",
          deliverables: ["On-Site or Remote Energy Scan", "Remedial Metal Strip Installation Plan", "Pyramid Energy Neutralizers", "Follow-up Energy Retesting"]
        },
        {
          id: "res-duplex-villas",
          name: "Duplex and Luxury Villas",
          icon: "🏰",
          shortDesc: "Multi-level vertical Vastu balancing linking ground courtyards with rooftop terraces and skylights.",
          importance: "Prevents energy dissipation across multiple floors and stabilizes vertical staircase vortexes.",
          traditionalBasis: "Maintains uninterrupted central prana verticality from ground Brahmasthan to rooftop sky dome.",
          deliverables: ["Multi-Level 3D Floor Audits", "Internal Staircase Clockwise Balancing", "Balcony & Terrace Zoning", "Landscape & Pool Placement"]
        },
        {
          id: "res-bedroom",
          name: "Bedroom Vastu",
          icon: "🛏️",
          shortDesc: "Optimizing sleep orientations, headboard alignments, and couple harmony zones.",
          importance: "Deep restorative sleep lowers cardiovascular tension and stabilizes psychological bonding.",
          traditionalBasis: "Aligning human bio-magnetic field with Earth's North-South magnetic dipole (head to South/East).",
          deliverables: ["Headboard Directional Alignment", "Mirror & Wardrobe Relocation Guidance", "Color Palette for Restful Sleep", "Electronic EMF Neutralization"]
        },
        {
          id: "res-kitchen",
          name: "Kitchen Vastu",
          icon: "🔥",
          shortDesc: "Placing cooktops, sinks, refrigerators, and food storage in accordance with Agni (Fire).",
          importance: "Prevents clash between water and fire elements, ensuring digestive vitality and cash liquidity.",
          traditionalBasis: "Agneya (South-East) placement allows the cook to face the vital morning solar rays.",
          deliverables: ["Burner & Sink Separation Blueprint", "Appliance Placement Matrix", "Countertop Stone Recommendations", "Exhaust & Ventilation Flow Plan"]
        },
        {
          id: "res-pooja-room",
          name: "Pooja Room Vastu",
          icon: "🪔",
          shortDesc: "Designing sacred sanctums in the divine Ishanya (North-East) corner for spiritual elevation.",
          importance: "Creates a high-frequency meditation vortex that permeates the entire dwelling with serenity.",
          traditionalBasis: "Ishana deity rules divine intellect; this zone receives the purest ultraviolet morning spectrum.",
          deliverables: ["Deity Facing Orientation (East/West)", "Altar Elevation & Marble Guidance", "Lighting & Incense Ventilation", "Sacred Geometric Yantra Placement"]
        },
        {
          id: "res-bathroom-toilet",
          name: "Bathroom and Toilet Vastu",
          icon: "🚿",
          shortDesc: "Remediating negative drainage zones and toxic water disposal outlets.",
          importance: "Toilets in auspicious zones (like North-East or South-West) cause severe wealth leakage and illness.",
          traditionalBasis: "Confining disposal activities to cleansing sub-directions (SSW, WNW, ESE) to preserve sacred prana.",
          deliverables: ["Toilet Commode Remedial Strip Layout", "Drainage Outflow Direction Plan", "Activated Charcoal Odor Balancers", "Partition Screen Guidance"]
        },
        {
          id: "res-living-room",
          name: "Living Room Vastu",
          icon: "🛋️",
          shortDesc: "Creating welcoming, sociable, and energetic spaces for family gatherings and esteemed guests.",
          importance: "Fosters cordial relationships, social reputation, and harmonious communication.",
          traditionalBasis: "Heavy seating against South/West walls; open, airy sightlines facing North and East.",
          deliverables: ["Seating Arrangement Blueprint", "Art & Wall Decor Directional Guidelines", "Indoor Plants & Water Feature Placement", "Window & Lighting Plan"]
        },
        {
          id: "res-staircase",
          name: "Staircase Vastu",
          icon: "🪜",
          shortDesc: "Aligning internal and external steps to climb clockwise in heavy quadrants.",
          importance: "Prevents structural heavy loads from stifling the light, sensitive North-East sector.",
          traditionalBasis: "Clockwise ascending spiral mimics Earth's rotation and channels upward grounding prana.",
          deliverables: ["Step Count Calculation (Odd numbers / 3n+2)", "Clockwise Turning Radius Audit", "Lead Pyramids for Incorrect Stairwells", "Under-Stairs Usage Guidelines"]
        },
        {
          id: "res-main-entrance",
          name: "Main Entrance Vastu",
          icon: "🚪",
          shortDesc: "Pinpointing the single most auspicious entrance gate among the 32 Padavinyasa divisions.",
          importance: "The main door is the mouth of prana (Simhadwara); auspicious doors bring windfall wealth and prestige.",
          traditionalBasis: "Selection of classical gates (E3 Jayanta, E4 Indra, S3 Vitatha, S4 Brihatkshata, W3 Sugriva, N3 Mukhya, N4 Bhallata).",
          deliverables: ["Entrance Gate Precision Measurement", "Threshold (Dehli) Consecration Advice", "Auspicious Wood & Color Selection", "Entrance Remedial Metal Rods"]
        },
        {
          id: "res-griha-pravesh",
          name: "Griha Pravesh Guidance",
          icon: "🥥",
          shortDesc: "Auspicious planetary Muhurta calculations and traditional housewarming ceremonial protocols.",
          importance: "Ensures the family enters during peak planetary resonance for long-term health and success.",
          traditionalBasis: "Synchronizing solar ingress, waxing lunar tithi, and owner's Janma Nakshatra.",
          deliverables: ["Personalized Muhurta Timing Window", "Ritual Checklist (Kalash, Vastu Homa)", "First Cooking of Milk Guidelines", "Threshold Protection Yantra"]
        },
        {
          id: "res-home-renovation",
          name: "Home Renovation Vastu",
          icon: "🔨",
          shortDesc: "Guiding structural renovations, interior upgrades, room repurposing, and extensions.",
          importance: "Prevents accidental disruption of the Brahmasthan or creation of acute directional cuts.",
          traditionalBasis: "Maintains the 9x9 mandala balance while modernizing open-plan layouts.",
          deliverables: ["Pre-Renovation Blueprint Assessment", "Wall Removal Feasibility Vastu Check", "Materials & Paint Color Schemes", "Remedial Grids for Altered Zones"]
        }
      ]
    },

    {
      id: "land",
      title: "Land and Plot Vastu",
      category: "Site & Land Advisory",
      tagline: "Vedic Soil, Topography & Geomagnetic Due Diligence Before Acquisition",
      description: "Comprehensive due diligence on vacant land parcels, evaluating plot geometry, soil vitality, directional tilt, slope gradients, and surrounding road infrastructure prior to financial commitment.",
      subServices: [
        {
          id: "land-residential-plots",
          name: "Residential Plots Vastu",
          icon: "🌱",
          shortDesc: "Evaluation of Gaumukhi (cow-faced) residential layouts, perimeter ratios, and soil quality.",
          importance: "Builds a foundation of long-term family peace, longevity, and flourishing progeny.",
          traditionalBasis: "Preference for rectangular (1:1.5 to 1:2) plots aligned squarely with true cardinal North.",
          deliverables: ["Plot Boundary & Proportion Analysis", "Compass Declination Offset Calculation", "Gaumukhi Shape Verification", "Site Layout Master Plan"]
        },
        {
          id: "land-commercial-plots",
          name: "Commercial Plots Vastu",
          icon: "🏙️",
          shortDesc: "Shermukhi (lion-faced) plot evaluations optimized for high footfall, retail visibility, and enterprise wealth.",
          importance: "Expansive frontages attract massive wealth currents and customer influx.",
          traditionalBasis: "Shermukhi proportions (wider front, narrower back) suit commercial establishments.",
          deliverables: ["Commercial Frontage Energy Mapping", "Main Gate & Parking Zoning", "Drainage Outflow Feasibility", "Footfall Pull Vortex Plan"]
        },
        {
          id: "land-agricultural",
          name: "Agricultural Land Vastu",
          icon: "🌾",
          shortDesc: "Farmland orientation, water canal routing, borewell placement, and farmhouse positioning.",
          importance: "Maximizes crop yield, soil fertility, groundwater longevity, and cattle well-being.",
          traditionalBasis: "Gentle natural slopes towards East and North-East capture life-nurturing irrigation flow.",
          deliverables: ["Acreage Contour Survey", "Borewell & Water Reservoir Spotting", "Farmhouse Location Zoning", "Windbreak Tree Plantation Plan"]
        },
        {
          id: "land-industrial",
          name: "Industrial Land Vastu",
          icon: "🏭",
          shortDesc: "Large-scale acreage surveys for manufacturing complexes, logistics hubs, and processing parks.",
          importance: "Prevents legal disputes, industrial accidents, environmental clearances friction, and labor strikes.",
          traditionalBasis: "Balancing high-voltage Agni grids with heavy South-West machinery zoning.",
          deliverables: ["Multi-Acre Master Zoning Blueprint", "Heavy Infrastructure Sectoring", "Approach Road Energy Audit", "Effluent Discharge Feasibility"]
        },
        {
          id: "land-direction-analysis",
          name: "Plot Direction Analysis (Vidisha)",
          icon: "🧭",
          shortDesc: "Measuring angular tilts and cardinal declination offsets with digital compass precision.",
          importance: "Plots tilted beyond 15° from magnetic North require specialized angular building alignments.",
          traditionalBasis: "Vidisha plots (corners aligned to cardinals) distribute cosmic rays diagonally, requiring correction.",
          deliverables: ["Angular Declination Calculation", "Rotated Mandala Superimposition", "Tilt Neutralization Blueprints", "Boundary Offset Corrections"]
        },
        {
          id: "land-shape-slope",
          name: "Plot Shape and Slope Analysis",
          icon: "⛰️",
          shortDesc: "Auditing terrain contours: North-East low slopes vs. South-West elevated grades.",
          importance: "Water and solar runoff from South-West towards North-East ensures steady wealth accumulation.",
          traditionalBasis: "Gaja-Prishta (elephant back) and Kurma-Prishta (tortoise shell) topographical categorizations.",
          deliverables: ["Topographical Gradient Evaluation", "Cut / Extension Remedial Strips", "Grading & Levelling Recommendations", "Retaining Wall Planning"]
        },
        {
          id: "land-road-entrance",
          name: "Road and Entrance Analysis (Veedhi Shoola)",
          icon: "🛣️",
          shortDesc: "Neutralizing aggressive road hits (T-junctions, Y-forks, and curving street thrusts).",
          importance: "Veedhi Shoolas from negative angles can cause financial collapse or severe accidents.",
          traditionalBasis: "Deflecting aggressive prana velocities using copper boundary baffles and convex mirrors.",
          deliverables: ["Road Thrust Vector Mapping", "Deflection Barrier Blueprints", "Entrance Gate Relocation Plan", "Auspicious Tree Buffer Strategy"]
        },
        {
          id: "land-selection",
          name: "Land Selection Consultation",
          icon: "🔍",
          shortDesc: "Comparative multi-site evaluation before purchasing land parcels for private or commercial use.",
          importance: "Prevents emotional investments in land with geopathic stress, burial grounds, or toxic history.",
          traditionalBasis: "Bhumi Pariksha: Soil fragrance, color, sound test, taste test, and seed germination test.",
          deliverables: ["Comparative Multi-Plot Scorecard", "Geopathic Stress Field Scan", "Historic Soil Energy Assessment", "Final Acquisition Recommendation"]
        },
        {
          id: "land-before-purchase",
          name: "Before-Purchase Due Diligence",
          icon: "📑",
          shortDesc: "Confidential rapid due-diligence report prior to token payments or legal registration.",
          importance: "Gives buyers leverage to negotiate or reject flawed real estate properties before financial lock-in.",
          traditionalBasis: "Immediate verification against the classical 18 Vastu defect indicators.",
          deliverables: ["Rapid 48-Hour Verdict Report", "Red Flag Defect Inventory", "Negotiation Feasibility Summary", "Remedial Cost Projection"]
        }
      ]
    },

    {
      id: "commercial",
      title: "Commercial Vastu",
      category: "Commercial & Corporate",
      tagline: "Amplifying Footfall, Customer Conversions & Enterprise Wealth",
      description: "Strategic spatial optimization for modern corporate headquarters, high-street retail stores, shopping complexes, hospitality resorts, healthcare clinics, and banking institutions.",
      subServices: [
        {
          id: "com-offices",
          name: "Offices & Coworking Spaces",
          icon: "💼",
          shortDesc: "Departmental zoning for productivity, team synergy, and minimized employee attrition.",
          importance: "Positions executives in leadership zones and sales teams in active movement quadrants.",
          traditionalBasis: "Executive command in South-West, finance in North, marketing/client reception in North-West.",
          deliverables: ["Office Desk Layout Gridding", "Director Cabin Alignment", "Conference Room Energy Zoning", "Pooja/Reception Counter Plan"]
        },
        {
          id: "com-corporate-offices",
          name: "Corporate Headquarters",
          icon: "🏛️",
          shortDesc: "Multi-floor corporate campus planning, boardrooms, investor relations, and server rooms.",
          importance: "Protects shareholder value, corporate reputation, and strategic vision execution.",
          traditionalBasis: "Alignment of MD/CEO suites with the ruling Nairrutya earth-stability field.",
          deliverables: ["Multi-Level Corporate Zoning", "Boardroom Table Orientation", "Data Center / Server Agni Alignment", "Corporate Brand Color Harmony"]
        },
        {
          id: "com-shops-showrooms",
          name: "Shops and Showrooms",
          icon: "🛍️",
          shortDesc: "Maximizing footfall walk-ins, premium product showcase visibility, and billing counters.",
          importance: "Ensures products catch customer gaze instantly and triggers prompt buying decisions.",
          traditionalBasis: "Open inviting entrances, display shelves on South/West, cash register facing North.",
          deliverables: ["Footfall Circulation Blueprint", "Cash Till / Locker Facing Guidance", "Product Display Tier Zoning", "Entrance Energy Activators"]
        },
        {
          id: "com-shopping-complexes",
          name: "Shopping Complexes & Malls",
          icon: "🏬",
          shortDesc: "Anchor store placement, atrium design, food court Agni zoning, and escalator flows.",
          importance: "Eliminates dead retail corners and ensures uniform foot traffic circulation across all levels.",
          traditionalBasis: "Atrium Brahmasthan activation with expansive natural skylights and clockwise escalator spirals.",
          deliverables: ["Master Retail Circulation Plan", "Food Court Kitchen Alignments", "Anchor Tenant Vastu Zoning", "Basement Parking Flow Review"]
        },
        {
          id: "com-restaurants-cafes",
          name: "Restaurants and Cafes",
          icon: "🍽️",
          shortDesc: "Commercial kitchen placement, bar counter zoning, dining layouts, and culinary reputation.",
          importance: "Ensures repeat clientele, high dining turnover, and consistent culinary excellence.",
          traditionalBasis: "Kitchen in South-East (Agneya), cold storage in North-West, cashier in North.",
          deliverables: ["Kitchen Hood & Cooktop Layout", "Bar / Liquor Counter West Zoning", "Table Seating Orientation Plan", "Cashier & Billing Stand Optimization"]
        },
        {
          id: "com-hotels-resorts",
          name: "Hotels and Luxury Resorts",
          icon: "🏨",
          shortDesc: "Grand lobby reception, guest suite zoning, banquet halls, swimming pools, and spas.",
          importance: "Cultivates exceptional guest reviews, high occupancy rates, and international prestige.",
          traditionalBasis: "Water bodies in North-East, banquet halls in East/South-East, luxury suites in South-West.",
          deliverables: ["Resort Master Site Plan Review", "Guest Suite Headboard Alignments", "Spa & Wellness Water Zoning", "Landscape & Waterbody Placement"]
        },
        {
          id: "com-hospitals-clinics",
          name: "Hospitals and Healthcare Institutions",
          icon: "🏥",
          shortDesc: "Operation theaters, ICU bays, doctor consulting rooms, diagnostic labs, and recovery wards.",
          importance: "Accelerates patient recovery rates, surgical precision, and hospital reputation.",
          traditionalBasis: "Operation theaters in Agneya/Vayavya, patient recovery in North-East to absorb healing infrared prana.",
          deliverables: ["OT & Surgical Wing Directional Audit", "Doctor Cabin Facing Alignment", "Patient Bed Headboard Orientation", "Pharmacy & Medical Storage Zoning"]
        },
        {
          id: "com-educational",
          name: "Educational Institutions & Colleges",
          icon: "🎓",
          shortDesc: "Classrooms, science laboratories, auditoriums, sports grounds, and administrative blocks.",
          importance: "Enhances student concentration, academic rankings, and campus harmony.",
          traditionalBasis: "Students face East/North while studying; science labs in South-East; library in North-East.",
          deliverables: ["Classroom Desk Orientation Plan", "Physics/Chemistry Lab Zoning", "Principal & Dean Suite Placement", "Library & Study Hall Optimization"]
        },
        {
          id: "com-banks",
          name: "Banks and Financial Chambers",
          icon: "🏦",
          shortDesc: "Treasury vault placement, cash teller counters, loan processing cabins, and ATM foyers.",
          importance: "Ensures perpetual capital liquidity, robust loan recoveries, and zero embezzlement.",
          traditionalBasis: "Strongroom vaults placed in South-West opening northward towards Kubera.",
          deliverables: ["Vault & Safe Locker Orientation", "Branch Manager Cabin Alignment", "Customer Teller Counter Layout", "ATM Machine Zoning"]
        },
        {
          id: "com-commercial-buildings",
          name: "Commercial Office Buildings",
          icon: "🏗️",
          shortDesc: "Complete architectural review for multi-tenant commercial towers and business parks.",
          importance: "Attracts blue-chip corporate tenants and ensures high rental yields and zero vacancies.",
          traditionalBasis: "Elevator cores, service shafts, and structural columns designed outside central Brahmasthan.",
          deliverables: ["Commercial Building Core Review", "Elevator & Stairwell Zoning", "HVAC Chiller Plant Positioning", "Grand Entrance Foyer Design"]
        }
      ]
    },

    {
      id: "industrial",
      title: "Industrial Vastu",
      category: "Industrial & Manufacturing",
      tagline: "Maximizing Production Uptime, Machine Longevity, Safety & Export Growth",
      description: "Comprehensive factory zoning, raw material unloading, heavy CNC machinery vibration dampening, transformer placement, quality assurance, and finished goods movement.",
      subServices: [
        {
          id: "ind-factories",
          name: "Factories and Industrial Complexes",
          icon: "🏭",
          shortDesc: "Master site zoning across multi-acre factory compounds for peak thermodynamic efficiency.",
          importance: "Eliminates frequent machinery breakdowns, labor disputes, and production bottlenecks.",
          traditionalBasis: "Linear flow of materials moving clockwise from heavy South/West to active North-West.",
          deliverables: ["Factory Compound Master Layout", "Heavy Foundation Soil Resonance Check", "Boundary Wall & Gate Balancing", "Administrative Block Zoning"]
        },
        {
          id: "ind-manufacturing-units",
          name: "Manufacturing Units & Assembly Lines",
          icon: "⚙️",
          shortDesc: "Zoning fabrication shops, CNC machining cells, assembly conveyors, and packaging lines.",
          importance: "Ensures seamless throughput speed, low rejection rates, and maximum operational safety.",
          traditionalBasis: "Raw material storage in South-West, processing in South, assembly towards North-West.",
          deliverables: ["Conveyor Flow Orientation Blueprint", "CNC Machine Foundation Checks", "Operator Workstation Alignments", "Safety & Emergency Exit Audit"]
        },
        {
          id: "ind-warehouses",
          name: "Warehouses and Logistics Fulfillment Centers",
          icon: "📦",
          shortDesc: "Racking systems, forklift circulation, dynamic loading docks, and inventory turnover.",
          importance: "Accelerates dispatch speed, prevents inventory spoilage, and optimizes vertical space.",
          traditionalBasis: "Heavy slow-moving pallets in South-West; fast-moving finished goods in North-West.",
          deliverables: ["Pallet Rack Storage Zoning", "Loading & Unloading Dock Orientation", "Forklift Traffic Flow Analysis", "Inventory Dispatch Velocity Plan"]
        },
        {
          id: "ind-plants",
          name: "Industrial Chemical & Processing Plants",
          icon: "🧪",
          shortDesc: "Chemical reactors, distillation columns, cooling towers, and boiler installations.",
          importance: "Mitigates hazardous chemical reactions, industrial fires, and volatile pressure spikes.",
          traditionalBasis: "High-heat processing strictly confined to Agneya (South-East) and water cooling to North-East.",
          deliverables: ["Chemical Processing Sectoring", "Boiler & Furnace Zoning", "Cooling Tower & Water Basin Checks", "Hazardous Material Buffer Plan"]
        },
        {
          id: "ind-production-units",
          name: "Production Units & Workshops",
          icon: "🔧",
          shortDesc: "Toolrooms, precision grinding shops, quality inspection labs, and prototyping rooms.",
          importance: "Maximizes tool calibration accuracy, operator focus, and micro-precision output.",
          traditionalBasis: "Quality control inspection labs placed in North/North-East for clear illumination and precision.",
          deliverables: ["QA/QC Testing Lab Optimization", "Toolroom Placement Plan", "Raw Inflow vs Outflow Pathways", "Scrap & Waste Disposal Layout"]
        },
        {
          id: "ind-offices",
          name: "Industrial Administrative Offices",
          icon: "🖥️",
          shortDesc: "Plant manager cabins, security guard posts, time offices, and labor union conference halls.",
          importance: "Maintains industrial peace, firm administrative discipline, and swift management decisions.",
          traditionalBasis: "Plant head cabin positioned in South-West overlooking the entire factory floor.",
          deliverables: ["Plant Head Cabin Alignment", "Security Gatehouse Placement", "Accounts & Billing Department Plan", "Labor Rest Area Zoning"]
        },
        {
          id: "ind-machinery-placement",
          name: "Machinery Placement Guidance",
          icon: "🔩",
          shortDesc: "Positioning heavy mechanical presses, stamping dies, generators, and compressors.",
          importance: "Prevents structural vibrations from cracking building foundations or destabilizing precision tools.",
          traditionalBasis: "Heavy static loads anchored in South and South-West; dynamic vibratory units dampened.",
          deliverables: ["Machine-by-Machine Grid Coordinates", "Electrical Motor Agni Alignment", "Vibration Dampening Pad Guidance", "Compressor Air Intake Zoning"]
        },
        {
          id: "ind-entrance-layout",
          name: "Industrial Entrance and Layout Analysis",
          icon: "🚛",
          shortDesc: "Heavy multi-axle trailer entry gates, weighbridges, security turnstiles, and visitor foyers.",
          importance: "Ensures smooth logistics turnaround times without transport gate bottlenecks.",
          traditionalBasis: "Auspicious gates (N3/N4 or E3/E4) for administrative inflow; S3/S4 or W3/W4 for heavy trucks.",
          deliverables: ["Inbound/Outbound Gate Bifurcation", "Weighbridge Placement Audit", "Truck Parking Buffer Layout", "Internal Roadway Radius Review"]
        },
        {
          id: "ind-land-selection",
          name: "Industrial Land Selection Consultation",
          icon: "🗺️",
          shortDesc: "Evaluating industrial development authority (IDA/MIDC/RIICO) plots before industrial bidding.",
          importance: "Avoids buying plots burdened with severe terrain dips or adverse chemical runoff.",
          traditionalBasis: "Comprehensive survey of high-tension power lines, neighboring industrial smoke, and soil stability.",
          deliverables: ["Pre-Auction Plot Due Diligence", "Power Substation Proximity Audit", "Effluent River Drainage Feasibility", "Final Acquisition Report"]
        }
      ]
    },

    {
      id: "planning",
      title: "Vastu Planning and Implementation",
      category: "Architectural & CAD Advisory",
      tagline: "Architectural Blueprint Auditing Prior to Groundbreaking & Structural Construction",
      description: "Collaborative consultation with personal architects, civil engineers, and interior designers to embed sacred Vedic geometry and Ayadi proportions into contemporary structural blueprints.",
      subServices: [
        {
          id: "plan-residential-cad",
          name: "Residential Floor Plan Analysis",
          icon: "📐",
          shortDesc: "Superimposing the 16-zone Shakti Chakra and 9x9 mandala onto residential 2D/3D CAD plans.",
          importance: "Identifies hidden directional cuts, toilet misplacements, and structural column conflicts.",
          traditionalBasis: "Padavinyasa 81-pada grid matching each room dimension with cosmic planetary lords.",
          deliverables: ["CAD Blueprint Overlay Dossier", "Zone-by-Zone Area Calculation", "Correction Recommendations on Drawing", "Architect Review Teleconference"]
        },
        {
          id: "plan-commercial-cad",
          name: "Commercial Floor Plan Analysis",
          icon: "🏬",
          shortDesc: "Reviewing commercial architectural drawings for maximum retail floor area and customer flow.",
          importance: "Eliminates dead retail corridors and structural columns blocking main sightlines.",
          traditionalBasis: "Open central atriums and outward radiating energy corridors.",
          deliverables: ["Commercial CAD Overlay Report", "Corridor Circulation Vector Analysis", "Anchor Tenant Demarcation Plan", "Executive Cabin Coordinates"]
        },
        {
          id: "plan-industrial-layout",
          name: "Industrial Layout Analysis",
          icon: "🏭",
          shortDesc: "Reviewing engineering drawings for manufacturing plants, piping isometric plans, and electrical layouts.",
          importance: "Prevents high-risk collisions between water pipelines and high-voltage electrical conduits.",
          traditionalBasis: "Agni-Jal elemental segregation across industrial engineering blueprints.",
          deliverables: ["Plant Layout Review Drawing", "Electrical & Transformer Zone Checks", "Water Pipe Route Separation Plan", "Machinery Anchor Coordinates"]
        },
        {
          id: "plan-new-construction",
          name: "New Construction Vastu Planning",
          icon: "🏛️",
          shortDesc: "Comprehensive architectural space planning starting from blank paper through to final commissioning.",
          importance: "Creates a harmonious sanctuary designed to exact classical Ayadi formulas.",
          traditionalBasis: "Calculates the 6 classical Ayadi aspects: Aaya, Vyaya, Yoni, Nakshatra, Vara, and Tithi.",
          deliverables: ["Complete Vastu-Compliant Master Plan", "Custom Ayadi Room Dimensional Chart", "Structural Pillar Alignment Checks", "Construction Phase Milestones"]
        },
        {
          id: "plan-architectural-review",
          name: "Architectural Plan Review",
          icon: "📋",
          shortDesc: "Independent third-party Vastu verification of drawings prepared by external design firms.",
          importance: "Provides unbiased advice ensuring aesthetic luxury harmonizes with authentic Vedic science.",
          traditionalBasis: "Bridging modern luxury aesthetics with timeless ancient environmental physics.",
          deliverables: ["Independent Compliance Scorecard", "Minor Adjustment Redlines (No Re-draw needed)", "Conflict Resolution Strategy", "Joint Meeting with Design Team"]
        },
        {
          id: "plan-directional-analysis",
          name: "Directional Analysis & Compass Gridding",
          icon: "🧭",
          shortDesc: "Accurate compass degree readings, magnetic North calculations, and true solar declination.",
          importance: "Even a 5° error in compass orientation can misplace a door from an auspicious to inauspicious gate.",
          traditionalBasis: "Shanku Sthapana (solar gnomon shadow analysis) combined with modern satellite GPS data.",
          deliverables: ["True North vs Magnetic North Analysis", "Precision Degree Overlay Chart", "16-Zone Energy Angle Breakdown", "Certified Orientation Seal"]
        },
        {
          id: "plan-corrections-remedies",
          name: "Vastu Corrections and Recommendations",
          icon: "✨",
          shortDesc: "Custom non-demolition remedial blueprint specifying elemental metals, crystals, and yantras.",
          importance: "Neutralizes structural defects that cannot be physically moved or rebuilt.",
          traditionalBasis: "Elemental resonance therapy using copper, brass, zinc, silver, lead, and natural gemstones.",
          deliverables: ["Comprehensive Remedial Master Plan", "Exact Material & Metal Specifications", "Installation Depth & Position Map", "Follow-up Verification Protocol"]
        }
      ]
    }
  ],

  // COMPLETE CONSULTATION PACKAGES AND PRICING (17 Exact Packages across 4 Categories)
  packages: [
    // A. Residential Packages (5 Packages)
    {
      id: "pkg-res-basic",
      category: "residential",
      name: "Basic Home Vastu Consultation",
      price: "Starting from ₹5,100",
      rawPrice: 5100,
      priceNote: "Starting from ₹5,100 / Contact for Custom Blueprint Scope",
      duration: "45 Minutes",
      mode: "Online Video / Phone Consultation",
      siteVisit: "Available on request (Travel extra)",
      floorPlanAnalysis: "Primary Directional Check",
      detailedReport: "Summary Action Points (Email)",
      followUp: "7 Days Email Q&A",
      deliverables: [
        "Floor Plan Directional Verification",
        "Primary Dos & Don'ts Checklist",
        "Major Room Placement Guidance (Kitchen, Bed, Pooja)",
        "One-on-One 45-Minute Video Consultation",
        "Written Summary Action Plan via Email"
      ],
      popular: false
    },
    {
      id: "pkg-res-complete",
      category: "residential",
      name: "Complete Home Vastu Analysis",
      price: "Starting from ₹11,000",
      rawPrice: 11000,
      priceNote: "Starting from ₹11,000 / Contact for Custom Scope",
      duration: "90 Minutes + Comprehensive Report",
      mode: "Online Video / Personal Consultation",
      siteVisit: "Optional Site Visit Available",
      floorPlanAnalysis: "Full 16-Zone Energy Gridding",
      detailedReport: "Exhaustive PDF Dossier (25+ Pages)",
      followUp: "30 Days Follow-up Support",
      deliverables: [
        "Detailed 16-Zone Padavinyasa Gridding",
        "32-Gate Main Entrance Precision Audit",
        "Non-Demolition Remedies (Metals, Colors, Crystals)",
        "Room-by-Room Scientific Diagnostics",
        "Comprehensive PDF Consultation Dossier (25+ Pages)",
        "1 Free Follow-Up Call within 30 Days"
      ],
      popular: true
    },
    {
      id: "pkg-res-premium",
      category: "residential",
      name: "Premium Residential Vastu Consultation",
      price: "Starting from ₹21,000",
      rawPrice: 21000,
      priceNote: "Starting from ₹21,000 / Contact for Custom Scope",
      duration: "Full Day Comprehensive Site Audit",
      mode: "Personal In-Person Site Visit + Video Reviews",
      siteVisit: "Included (City Limits)",
      floorPlanAnalysis: "Multi-Floor Multi-Level Gridding",
      detailedReport: "Exhaustive 50-Page Architectural Report",
      followUp: "90 Days Priority WhatsApp Access",
      deliverables: [
        "In-Person On-Site Environmental Energy Scan",
        "Geopathic Stress & Magnetic Field Mapping",
        "Multi-Floor Complete Blueprint Optimization",
        "Landscape, Waterbody & Boundary Wall Planning",
        "Exhaustive 50-Page Bound Architectural Report",
        "Direct WhatsApp Priority Access for 90 Days"
      ],
      popular: false
    },
    {
      id: "pkg-res-construction",
      category: "residential",
      name: "New Home Construction Consultation",
      price: "Starting from ₹35,000",
      rawPrice: 35000,
      priceNote: "Starting from ₹35,000 / Contact for Custom Scope",
      duration: "Full Construction Lifecycle Advisory",
      mode: "Architect Collaboration + Site Milestone Visits",
      siteVisit: "Multiple Milestone Site Visits",
      floorPlanAnalysis: "Complete Architectural Blueprint Development",
      detailedReport: "Comprehensive Construction Dossier",
      followUp: "Until Griha Pravesh Housewarming",
      deliverables: [
        "Site Selection & Soil Energy Assessment",
        "Bhumi Pujan & Foundation Muhurat Calculation",
        "Collaborative Blueprint Revisions with Your Architect",
        "Ayadi Shadvarga Dimensional Calculations",
        "Pillar, Beam & Main Doorframe Placement Checks",
        "Griha Pravesh & Housewarming Muhurat Guidance"
      ],
      popular: false
    },
    {
      id: "pkg-res-apartment",
      category: "residential",
      name: "Flat and Apartment Consultation",
      price: "Starting from ₹8,500",
      rawPrice: 8500,
      priceNote: "Starting from ₹8,500 / Contact for Custom Scope",
      duration: "60 Minutes + Written Report",
      mode: "Online Video / Remote Evaluation",
      siteVisit: "Available on request",
      floorPlanAnalysis: "High-Rise Apartment Micro-Zoning",
      detailedReport: "Specialized Apartment PDF Dossier",
      followUp: "15 Days Email Support",
      deliverables: [
        "Builder Blueprint Directional Rectification",
        "Main Door Remedial Strip Blueprint (No Demolition)",
        "Balcony, Kitchen & Bed Orientation Solutions",
        "Neutralization of Shared Duct / Toilet Faults",
        "Specialized High-Rise PDF Advisory Dossier"
      ],
      popular: false
    },

    // B. Land Packages (4 Packages)
    {
      id: "pkg-land-plot",
      category: "land",
      name: "Residential Plot Analysis",
      price: "Starting from ₹7,500",
      rawPrice: 7500,
      priceNote: "Starting from ₹7,500 / Contact for Custom Scope",
      duration: "60 Minutes",
      mode: "Online CAD / Site Survey",
      siteVisit: "Available on request",
      floorPlanAnalysis: "Perimeter & Boundary Proportion Audit",
      detailedReport: "Detailed Plot Feasibility Report",
      followUp: "15 Days Support",
      deliverables: [
        "Plot Proportions & Gaumukhi Shape Verification",
        "Compass Declination & Angular Offset Reading",
        "Slope, Gradient & Drainage Flow Guidance",
        "Road Alignment & Gate Positioning Advice"
      ],
      popular: false
    },
    {
      id: "pkg-land-commercial",
      category: "land",
      name: "Commercial Land Analysis",
      price: "Starting from ₹15,000",
      rawPrice: 15000,
      priceNote: "Starting from ₹15,000 / Contact for Custom Scope",
      duration: "Half-Day Assessment",
      mode: "On-Site Survey + Blueprint Review",
      siteVisit: "Included (Regional)",
      floorPlanAnalysis: "Master Commercial Site Layout",
      detailedReport: "Commercial Land Due Diligence Dossier",
      followUp: "30 Days Support",
      deliverables: [
        "Shermukhi Commercial Frontage Assessment",
        "Traffic Flow & Customer Entry Gate Zoning",
        "Water Reservoir & Underground Utility Spotting",
        "Commercial Viability & Wealth Attraction Index"
      ],
      popular: true
    },
    {
      id: "pkg-land-industrial",
      category: "land",
      name: "Industrial Land Analysis",
      price: "Starting from ₹25,000",
      rawPrice: 25000,
      priceNote: "Starting from ₹25,000 / Contact for Custom Scope",
      duration: "Comprehensive Acreage Survey",
      mode: "On-Site Multi-Acre Audit",
      siteVisit: "Included (Full Day)",
      floorPlanAnalysis: "Heavy Industrial Master Zoning",
      detailedReport: "Exhaustive Industrial Land Report",
      followUp: "60 Days Support",
      deliverables: [
        "Large-Scale Acreage Topography Survey",
        "Heavy Production, Boiler & Substation Zoning",
        "Effluent Drainage & Groundwater Investigation",
        "Regulatory Clearance Vastu Alignment"
      ],
      popular: false
    },
    {
      id: "pkg-land-prepurchase",
      category: "land",
      name: "Before-Purchase Land Consultation",
      price: "Starting from ₹9,500",
      rawPrice: 9500,
      priceNote: "Starting from ₹9,500 / Contact for Custom Scope",
      duration: "Rapid 48-Hour Assessment",
      mode: "Online CAD & Satellite Survey",
      siteVisit: "Available on request",
      floorPlanAnalysis: "Red Flag Defect Inventory",
      detailedReport: "Clear Go / No-Go Decision Dossier",
      followUp: "Until Property Negotiation Closure",
      deliverables: [
        "Rapid 48-Hour Acquisition Verdict",
        "Road Hit (Veedhi Shoola) & T-Junction Hazard Check",
        "Historic Soil Vitality & Geopathic Stress Review",
        "Negotiation Leverage & Remedial Budget Projections"
      ],
      popular: false
    },

    // C. Commercial Packages (4 Packages)
    {
      id: "pkg-com-office",
      category: "commercial",
      name: "Office Vastu Consultation",
      price: "Starting from ₹18,000",
      rawPrice: 18000,
      priceNote: "Starting from ₹18,000 / Contact for Custom Scope",
      duration: "2 Hours + Audit Report",
      mode: "Online Video or On-Site Visit",
      siteVisit: "Available on request",
      floorPlanAnalysis: "Complete Corporate Desk Gridding",
      detailedReport: "Executive Workplace PDF Dossier",
      followUp: "30 Days Dedicated Support",
      deliverables: [
        "MD & Executive Director Cabin Placement",
        "Accounts, Treasury & Cash Locker Zoning",
        "Sales, Marketing & Team Productivity Layout",
        "Reception Foyer & Brand Identity Alignment",
        "Employee Turnover & Conflict Mitigation Strategy"
      ],
      popular: true
    },
    {
      id: "pkg-com-retail",
      category: "commercial",
      name: "Shop and Showroom Consultation",
      price: "Starting from ₹14,000",
      rawPrice: 14000,
      priceNote: "Starting from ₹14,000 / Contact for Custom Scope",
      duration: "90 Minutes On-Site / Remote",
      mode: "On-Site Walkthrough Preferred",
      siteVisit: "Included (Local)",
      floorPlanAnalysis: "Retail Footfall Circulation Grid",
      detailedReport: "Showroom Conversion Blueprint",
      followUp: "30 Days Support",
      deliverables: [
        "Customer Footfall Magnet Entrance Placement",
        "Cash Register (Till) Directional Alignment",
        "High-Value Product Display Tier Optimization",
        "Stock Inventory Storage & Dead Stock Clearance Zone"
      ],
      popular: false
    },
    {
      id: "pkg-com-hospitality",
      category: "commercial",
      name: "Hotel and Restaurant Consultation",
      price: "Starting from ₹30,000",
      rawPrice: 30000,
      priceNote: "Starting from ₹30,000 / Contact for Custom Scope",
      duration: "Full Property Spatial Audit",
      mode: "On-Site Comprehensive Survey",
      siteVisit: "Included",
      floorPlanAnalysis: "Complete Commercial Hospitality Blueprint",
      detailedReport: "Master Hospitality Vastu Report",
      followUp: "60 Days Support",
      deliverables: [
        "Commercial Kitchen (Agneya) Burner Layout",
        "Dining Table Seating & Bar Counter Positioning",
        "Grand Reception & Guest Welcome Foyer",
        "Banquet Hall, Kitchen & Swimming Pool Zoning"
      ],
      popular: false
    },
    {
      id: "pkg-com-corporate",
      category: "commercial",
      name: "Corporate Building Consultation",
      price: "Starting from ₹50,000",
      rawPrice: 50000,
      priceNote: "Starting from ₹50,000 / Contact for Custom Scope",
      duration: "Multi-Day Campus Audit",
      mode: "On-Site Executive Engagement",
      siteVisit: "Included (Multiple Days)",
      floorPlanAnalysis: "Multi-Storey Tower Complete Analysis",
      detailedReport: "Institutional Master Plan Document",
      followUp: "180 Days Retainer Advisory",
      deliverables: [
        "Multi-Floor Vertical Shaft & Elevator Core Audit",
        "C-Suite Leadership Suites & Boardroom Alignment",
        "Data Center / Server Infrastructure Fire Zoning",
        "Investor Relations & Capital Flow Vortex Creation"
      ],
      popular: false
    },

    // D. Industrial Packages (4 Packages)
    {
      id: "pkg-ind-factory",
      category: "industrial",
      name: "Factory Vastu Consultation",
      price: "Starting from ₹28,000",
      rawPrice: 28000,
      priceNote: "Starting from ₹28,000 / Contact for Custom Scope",
      duration: "Full Day On-Site Industrial Audit",
      mode: "In-Person Field Survey",
      siteVisit: "Included",
      floorPlanAnalysis: "Industrial Plant Master Zoning",
      detailedReport: "Comprehensive Industrial Dossier (40+ Pages)",
      followUp: "60 Days Priority Support",
      deliverables: [
        "Machinery Layout & Weight Distribution Blueprint",
        "Raw Material (SW) to Finished Goods (NW) Inflow",
        "Electrical Substation, Transformers & Boilers (SE)",
        "Administrative Office & Plant Head Cabin Alignment",
        "Labor Safety, Dispute Minimization & Uptime Maximizer"
      ],
      popular: true
    },
    {
      id: "pkg-ind-manufacturing",
      category: "industrial",
      name: "Manufacturing Unit Analysis",
      price: "Starting from ₹35,000",
      rawPrice: 35000,
      priceNote: "Starting from ₹35,000 / Contact for Custom Scope",
      duration: "Detailed Engineering Review",
      mode: "On-Site Plant Engagement",
      siteVisit: "Included",
      floorPlanAnalysis: "Production Line Flow Optimization",
      detailedReport: "Manufacturing Diagnostic Dossier",
      followUp: "90 Days Support",
      deliverables: [
        "Clockwise Thermodynamic Production Flow Alignment",
        "CNC Machinery Vibration Dampening Points",
        "QA/QC Precision Testing Laboratory Zoning",
        "Raw Chemical & Flammable Storage Security"
      ],
      popular: false
    },
    {
      id: "pkg-ind-warehouse",
      category: "industrial",
      name: "Warehouse Vastu Consultation",
      price: "Starting from ₹22,000",
      rawPrice: 22000,
      priceNote: "Starting from ₹22,000 / Contact for Custom Scope",
      duration: "Full Day Logistics Review",
      mode: "On-Site Survey",
      siteVisit: "Included",
      floorPlanAnalysis: "High-Bay Racking & Loading Layout",
      detailedReport: "Logistics Optimization Report",
      followUp: "30 Days Support",
      deliverables: [
        "Loading & Unloading Dock Orientation",
        "High-Speed Inventory Turnover (North-West) Zoning",
        "Heavy Dead Stock Storage (South-West) Alignment",
        "Forklift Pathways & Material Safety Clearances"
      ],
      popular: false
    },
    {
      id: "pkg-ind-layout",
      category: "industrial",
      name: "Complete Industrial Layout Analysis",
      price: "Starting from ₹60,000",
      rawPrice: 60000,
      priceNote: "Starting from ₹60,000 / Contact for Custom Scope",
      duration: "Multi-Acre Industrial Complex Audit",
      mode: "On-Site Comprehensive Team Audit",
      siteVisit: "Included (Multiple Days)",
      floorPlanAnalysis: "Complete Complex Master Planning",
      detailedReport: "Full Industrial Master Dossier",
      followUp: "180 Days Executive Access",
      deliverables: [
        "End-to-End Multi-Building Complex Balancing",
        "High-Tension Power Ingress & Water Outflow Audit",
        "Internal Logistics Roads & Heavy Trailer Flow",
        "Zero Structural Demolition Remedial Gridding",
        "Senior Management Executive Consultation Briefing"
      ],
      popular: false
    }
  ],

  // Package Comparison Table Parameters
  packageComparison: [
    { feature: "Floor Plan Evaluation", basic: "Primary Check", complete: "Full 16-Zone Gridding", premium: "Multi-Floor 3D Gridding", corporate: "Complete Master Planning" },
    { feature: "Padavinyasa 32-Gate Analysis", basic: "—", complete: "Included (Exact Gate)", premium: "Included (Exact Gate)", corporate: "All Complex Entrances" },
    { feature: "Non-Demolition Remedial Blueprint", basic: "General Advice", complete: "Full Color & Metal Plan", premium: "Exhaustive Custom Blueprint", corporate: "Engineered Grid Blueprints" },
    { feature: "Diagnostic Report Format", basic: "Email Summary", complete: "25+ Page PDF Dossier", premium: "50-Page Bound Dossier", corporate: "Comprehensive Enterprise Dossier" },
    { feature: "Consultation Mode", basic: "Online Video / Phone", complete: "Online Video / In-Person", premium: "On-Site Personal Visit", corporate: "On-Site Multi-Day Audit" },
    { feature: "Site Visit Feasibility", basic: "On Request", complete: "Optional Add-on", premium: "Included (City Limits)", corporate: "Included Multi-Day" },
    { feature: "Follow-Up Support Period", basic: "7 Days Email", complete: "30 Days Email & Call", premium: "90 Days Priority WhatsApp", corporate: "180 Days Retainer Advisory" },
    { feature: "Ayadi Shadvarga Calculations", basic: "—", complete: "On Request", premium: "Included", corporate: "Complete Master Formula" }
  ],

  // 12 Scholarly Research Articles (All requested in Section 15)
  articles: [
    {
      id: "art-what-is-vastu",
      slug: "what-is-vastu-shastra",
      title: "What Is Vastu Shastra? The Ancient Vedic Science of Spatial Harmony",
      excerpt: "Explore the classical origins of Sthapatya Veda, tracing how ancient sages harmonized human habitats with solar radiation, geomagnetic forces, and cosmic energy fields.",
      category: "Vedic Foundations",
      readTime: "7 Min Read",
      date: "October 14, 2026",
      image: "assets/mandala-bg.svg",
      content: `
        <p class="mb-4">Vastu Shastra is the world's most ancient environmental design science, codified millennia ago as a sub-branch of <em>Atharva Veda</em> known as <em>Sthapatya Veda</em>. The word <strong>Vastu</strong> derives from the Sanskrit root <em>Vas</em>, meaning "to dwell or exist in harmony", while <strong>Shastra</strong> signifies scientific doctrine or authoritative treatise.</p>
        
        <h4 class="font-serif text-lg text-[#F9E29B] font-bold mt-6 mb-3">1. The Confluence of Three Cosmic Forces</h4>
        <p class="mb-4">Traditional Vedic architecture acknowledges that a built habitat acts as a biological transducer. It interacts directly with three primary forces of nature:</p>
        <ul class="list-disc pl-5 space-y-2 mb-4 text-[#DCCBB0]">
          <li><strong>Solar Energy (Saura Urja):</strong> The dynamic passage of the Sun from dawn in the East to sunset in the West, releasing vital ultraviolet, visible light, and infrared frequencies that stimulate metabolism and sterilize living quarters.</li>
          <li><strong>Geomagnetic Energy (Bhu-Chumbakiya Urja):</strong> The Earth's magnetic flux continuously flowing from the South Pole to the North Pole, influencing blood circulation, neurological resting states, and cellular regeneration.</li>
          <li><strong>Cosmic Life Force (Prana):</strong> Subtle ambient etheric energy originating from the cosmos, concentrated within the central <em>Brahmasthan</em> of any enclosed structural volume.</li>
        </ul>

        <h4 class="font-serif text-lg text-[#F9E29B] font-bold mt-6 mb-3">2. Vastu Purusha Mandala: The Blueprint of Cosmic Order</h4>
        <p class="mb-4">At the philosophical core of Vastu Shastra lies the <em>Vastu Purusha Mandala</em>—a sacred geometric grid, typically divided into an 81-square (9×9) matrix known as <em>Paramasayika</em> or a 64-square (8×8) matrix known as <em>Manduka</em>. The Vastu Purusha lies face downward with his head pointed towards the pristine North-East (Ishanya) and feet anchored in the heavy South-West (Nairrutya).</p>
        
        <p class="mb-4">When a house respects this orientation, room functions naturally synchronize with human biological rhythms. The morning mind seeks spiritual clarity in the North-East; the digestive fires burn bright in the South-East; the body demands grounding rest in the South-West; and evening socialization flourishes in the North-West.</p>
      `,
      relatedArticles: ["importance-of-main-entrance", "understanding-brahmasthan", "vastu-purusha-mandala-explained"]
    },

    {
      id: "art-main-entrance",
      slug: "importance-of-main-entrance",
      title: "Importance of the Main Entrance: The 32 Padavinyasa Gates Explained",
      excerpt: "The entrance is the mouth of prana. Learn why pinpointing the exact degree gate from the 32 divisions dictates whether a home attracts windfall wealth or persistent friction.",
      category: "Door & Gate Vastu",
      readTime: "8 Min Read",
      date: "October 18, 2026",
      image: "assets/mandala-bg.svg",
      content: `
        <p class="mb-4">In traditional treatises such as <em>Brihat Samhita</em> and <em>Mayamata</em>, the main entrance of a residence is known as the <strong>Simhadwara</strong>—the royal gate of prana. Just as a human being receives nourishment through the mouth, a home draws its cosmic vitality through the primary doorway.</p>

        <h4 class="font-serif text-lg text-[#F9E29B] font-bold mt-6 mb-3">The 32 Padavinyasa Entrance Gates</h4>
        <p class="mb-4">Classical Vastu divides the outer perimeter of any property into 32 equal zones—8 along each of the four cardinal directions. Contrary to modern misconceptions that "all South or West entrances are bad", classical texts reveal that specific gates along the South and West are among the most financially prosperous:</p>

        <ul class="list-disc pl-5 space-y-2 mb-4 text-[#DCCBB0]">
          <li><strong>East Gates (E3 Jayanta & E4 Indra):</strong> Attracts victory in competition, state recognition, prestigious honors, and energetic vitality.</li>
          <li><strong>South Gates (S3 Vitatha & S4 Brihatkshata):</strong> Generates immense commercial expansion, abundance of progeny, and practical courage.</li>
          <li><strong>West Gates (W3 Sugriva & W4 Pushpadanta):</strong> Outstanding gates for wealth accumulation, monetary returns on investment, and support from wealthy benefactors.</li>
          <li><strong>North Gates (N3 Mukhya & N4 Bhallata):</strong> Associated with Lord Kubera, ensuring continuous business breakthroughs and generational inheritance.</li>
        </ul>

        <p class="mb-4">If an existing doorway falls on an inauspicious gate (such as E1 Shikhi or S5 Yama), zero structural demolition is required. Vedic spatial science employs non-demolition energy blockades, such as consecrated copper or brass threshold strips embedded into the flooring, effectively neutralizing the adverse vibrational frequency.</p>
      `,
      relatedArticles: ["what-is-vastu-shastra", "common-vastu-planning-mistakes", "understanding-eight-directions"]
    },

    {
      id: "art-kitchen-direction",
      slug: "best-direction-for-kitchen",
      title: "Best Direction for a Kitchen: Harmonizing Agni in Contemporary Homes",
      excerpt: "Why the South-East (Agneya) quadrant is the classical seat of the Fire God, and how to remediate misplaced stoves in modern apartments without demolition.",
      category: "Residential Architecture",
      readTime: "6 Min Read",
      date: "October 21, 2026",
      image: "assets/mandala-bg.svg",
      content: `
        <p class="mb-4">The kitchen represents the hearth of the home, dominated by <strong>Agni Deva</strong>, the deity of transformation, metabolic fire, and illumination. Food cooked in a harmonious kitchen carries positive vibrational frequencies that directly determine the physical vitality, immunity, and mental clarity of all occupants.</p>

        <h4 class="font-serif text-lg text-[#F9E29B] font-bold mt-6 mb-3">The Supreme Quadrant: South-East (Agneya)</h4>
        <p class="mb-4">The South-East direction is governed by Venus (Shukra) and the fire element. Positioned here, the morning solar rays assist in naturally disinfecting the culinary space while the afternoon heat dissipates without stagnating inside sleeping chambers.</p>

        <h4 class="font-serif text-lg text-[#F9E29B] font-bold mt-6 mb-3">Critical Golden Rules of Kitchen Vastu:</h4>
        <ul class="list-disc pl-5 space-y-2 mb-4 text-[#DCCBB0]">
          <li><strong>Cook Facing East:</strong> The chef should face the rising sun while preparing meals to channel positive prana into the food.</li>
          <li><strong>Fire and Water Separation:</strong> Never place the cooktop (Agni) immediately beside or directly below the water sink (Jal). Maintain a minimum distance of 2 to 3 feet, or separate them with a wooden or stone barrier.</li>
          <li><strong>The Peril of North-East Kitchens:</strong> Fire placed in the divine water zone (Ishanya) creates acute elemental discord, frequently manifesting as digestive ailments and financial disputes.</li>
        </ul>

        <p class="mb-4">For modern apartments where the kitchen is permanently built in the North-East or South-West, specialized non-demolition remedies like green Baroda marble slabs placed beneath the cooktop and copper helixes neutralize the clash of elements.</p>
      `,
      relatedArticles: ["what-is-vastu-shastra", "traditional-vastu-modern-homes", "common-vastu-planning-mistakes"]
    },

    {
      id: "art-understanding-brahmasthan",
      slug: "understanding-brahmasthan",
      title: "Understanding Brahmasthan: Why the Center of Your House Must Breathe",
      excerpt: "The sacred central navel of any architectural structure. Discover why load-bearing pillars, toilets, or heavy furniture in the center suffocates the family's cosmic prana.",
      category: "Vedic Geometry",
      readTime: "7 Min Read",
      date: "October 24, 2026",
      image: "assets/mandala-bg.svg",
      content: `
        <p class="mb-4">In traditional Indian architecture, the central 1/9th zone of any rectangular or square building plan is known as the <strong>Brahmasthan</strong>—the throne of Lord Brahma, the cosmic creator. It functions as the energetic lungs and heart of the habitat, drawing pure etheric life-force (Akash Tattva) from above and distributing it outward to the eight directions.</p>

        <h4 class="font-serif text-lg text-[#F9E29B] font-bold mt-6 mb-3">The Traditional Courtyard (Angan)</h4>
        <p class="mb-4">In ancient Vedic residences (Havelis, Nalukettu, and Wada homes), the Brahmasthan was intentionally kept as an open-to-sky courtyard. This structural design fulfilled both micro-climatic and metaphysical functions: warm air escaped through the central opening, cool breezes were drawn in through perimeter verandas, and cosmic rays nourished the dwelling continuously.</p>

        <h4 class="font-serif text-lg text-[#F9E29B] font-bold mt-6 mb-3">Severe Brahmasthan Afflictions & Remedies:</h4>
        <ul class="list-disc pl-5 space-y-2 mb-4 text-[#DCCBB0]">
          <li><strong>Heavy RCC Columns:</strong> Structural weight placed squarely upon the Brahmasthan suppresses family vitality and slows progress. Remedied by wrapping pillars in consecrated brass casing.</li>
          <li><strong>Toilets or Septic Tanks:</strong> Placing wastewater drainage in the cosmic center is considered the single most severe defect in Vastu Shastra. Must be energetically isolated with zinc-copper perimeter rings.</li>
          <li><strong>Beams Overhead:</strong> Ensure dining tables or family living sofas do not rest directly beneath exposed overhead structural beams crossing the center.</li>
        </ul>
      `,
      relatedArticles: ["what-is-vastu-shastra", "vastu-purusha-mandala-explained", "traditional-vastu-modern-homes"]
    },

    {
      id: "art-vastu-before-buying-house",
      slug: "vastu-before-buying-house",
      title: "Vastu Before Buying a House: 9 Critical Due Diligence Checkpoints",
      excerpt: "A comprehensive checklist for prospective homebuyers to evaluate directional alignment, entrance gates, ventilation, and structural geometry before signing agreements.",
      category: "Homebuyer Guide",
      readTime: "9 Min Read",
      date: "October 27, 2026",
      image: "assets/mandala-bg.svg",
      content: `
        <p class="mb-4">Purchasing a home is one of the most significant emotional and financial investments in an individual's lifetime. Conducting a thorough Vastu evaluation before signing agreements or handing over earnest money ensures you acquire an asset that promotes health, longevity, and compounding abundance.</p>

        <h4 class="font-serif text-lg text-[#F9E29B] font-bold mt-6 mb-3">The 9 Critical Due Diligence Checkpoints:</h4>
        <ol class="list-decimal pl-5 space-y-2 mb-4 text-[#DCCBB0]">
          <li><strong>True Magnetic North Verification:</strong> Do not rely on builder brochures stating "North Facing". Measure the exact degree offset with an engineered magnetic compass.</li>
          <li><strong>Shape of the Flat/House:</strong> Prefer square or rectangular layouts. Avoid units with severe triangular cuts, L-shapes, or missing quadrants.</li>
          <li><strong>Main Entrance Auspicious Gate:</strong> Ensure the main entrance falls within an auspicious padavinyasa division (e.g. N3, N4, E3, E4, S3, S4, W3, W4).</li>
          <li><strong>Master Bedroom Location:</strong> Verify that the primary bedroom is situated in the South-West or South, providing grounding and authority.</li>
          <li><strong>Kitchen Placement:</strong> Ensure the cooktop is positioned in the South-East (Agneya) or North-West (Vayavya).</li>
          <li><strong>Zero Toilets in North-East:</strong> Inspect plumbing shafts to guarantee toilets are not located in the sacred Ishanya zone.</li>
          <li><strong>Balcony and Natural Light:</strong> Expansive balconies facing North or East maximize morning infrared and ultraviolet sunlight.</li>
          <li><strong>Staircase Orientation:</strong> Verify that internal or external staircases ascend in a clockwise direction.</li>
          <li><strong>Surrounding Environment:</strong> Avoid properties situated immediately opposite hospital emergency exits, cemeteries, electrical substations, or sharp road hits (Veedhi Shoola).</li>
        </ol>
      `,
      relatedArticles: ["importance-of-main-entrance", "vastu-before-purchasing-land", "common-vastu-planning-mistakes"]
    },

    {
      id: "art-vastu-before-land",
      slug: "vastu-before-purchasing-land",
      title: "Vastu Before Purchasing Land: Soil Testing, Slopes & Road Alignments",
      excerpt: "Uncover ancient soil fertility testing, Gaumukhi vs. Shermukhi plot geometry, slope gradients, and road thrusts (Veedhi Shoola) before committing capital.",
      category: "Land & Plot Vastu",
      readTime: "8 Min Read",
      date: "October 29, 2026",
      image: "assets/mandala-bg.svg",
      content: `
        <p class="mb-4">The quality of the soil and the topographical incline of a plot dictate the energetic baseline of any building erected upon it. Classical treatises such as <em>Manasara</em> devote extensive chapters to <strong>Bhumi Pariksha</strong>—the systematic examination of land prior to purchase.</p>

        <h4 class="font-serif text-lg text-[#F9E29B] font-bold mt-6 mb-3">1. Traditional Soil Testing Protocols</h4>
        <p class="mb-4">Ancient texts prescribe practical environmental tests to evaluate soil density and organic vitality:</p>
        <ul class="list-disc pl-5 space-y-2 mb-4 text-[#DCCBB0]">
          <li><strong>The Pit Test (Gart Pariksha):</strong> Dig a pit measuring 1 cubit (approx. 18×18×18 inches). Refill the extracted soil back into the pit. If excess soil remains, the land is <em>Uttama</em> (superior density). If soil falls short, the land is porous and prone to subsidence.</li>
          <li><strong>The Water Retention Test:</strong> Fill the same pit with water in the evening. If water remains by morning, the land retains moisture and promises fertile living conditions.</li>
        </ul>

        <h4 class="font-serif text-lg text-[#F9E29B] font-bold mt-6 mb-3">2. Topographical Slope Gradients</h4>
        <p class="mb-4">The natural slope of the land should invariably tilt downward towards the North and North-East, while remaining elevated towards the South and South-West. This alignment channels groundwater and geomagnetic energy in harmony with the Earth's natural currents.</p>
      `,
      relatedArticles: ["vastu-before-buying-house", "common-vastu-planning-mistakes", "what-is-vastu-shastra"]
    },

    {
      id: "art-commercial-offices",
      slug: "vastu-for-commercial-offices",
      title: "Vastu for Commercial Offices: Boosting Productivity, Sales & Leadership",
      excerpt: "Strategic spatial optimization for corporate headquarters: CEO seating in the South-West, finance in the North, marketing in the North-West, and active cash flows.",
      category: "Commercial Architecture",
      readTime: "7 Min Read",
      date: "November 01, 2026",
      image: "assets/mandala-bg.svg",
      content: `
        <p class="mb-4">A high-performing corporate office must balance intellectual clarity, strategic leadership, rapid execution, and healthy financial liquidity. By applying Vastu principles to departmental zoning, companies frequently experience reduced attrition, sharper decision-making, and accelerated business growth.</p>

        <h4 class="font-serif text-lg text-[#F9E29B] font-bold mt-6 mb-3">Key Corporate Departmental Zoning:</h4>
        <ul class="list-disc pl-5 space-y-2 mb-4 text-[#DCCBB0]">
          <li><strong>Managing Director & CEO Suite (South-West):</strong> The South-West quadrant commands the Earth element, granting stability, unshakable authority, and long-term vision. The leader should sit facing North or East.</li>
          <li><strong>Finance & Accounts Department (North):</strong> North is ruled by Kubera and Mercury, governing monetary assets and precision record-keeping. Cash lockers and accounting staff thrive here.</li>
          <li><strong>Sales, Business Development & Logistics (North-West):</strong> North-West is governed by Vayu (Air), representing movement, communication, and swift turnaround times. Sales teams positioned here maintain continuous pipeline momentum.</li>
          <li><strong>Creative & Research Labs (East / North-East):</strong> Benefitting from clarity of intellect (Guru) and social network expansion (Indra).</li>
        </ul>
      `,
      relatedArticles: ["vastu-for-factories", "what-is-vastu-shastra", "importance-of-main-entrance"]
    },

    {
      id: "art-vastu-factories",
      slug: "vastu-for-factories",
      title: "Vastu for Factories: Aligning Manufacturing Units for Peak Output and Safety",
      excerpt: "Learn how linear thermodynamic material flows from the South-West to North-West eliminate machinery downtime, prevent industrial accidents, and maximize export profits.",
      category: "Industrial Architecture",
      readTime: "8 Min Read",
      date: "November 01, 2026",
      image: "assets/mandala-bg.svg",
      content: `
        <p class="mb-4">Industrial plants operate on heavy energy loads, high mechanical pressures, and complex logistics flows. When factory layouts contradict natural thermodynamic and gravitational vectors, plants often suffer chronic machine breakdowns, electrical fires, and quality rejections.</p>

        <h4 class="font-serif text-lg text-[#F9E29B] font-bold mt-6 mb-3">The Clockwise Production Vector</h4>
        <p class="mb-4">The fundamental principle of industrial Vastu is the clockwise thermodynamic progression:</p>
        <ol class="list-decimal pl-5 space-y-2 mb-4 text-[#DCCBB0]">
          <li><strong>Raw Material Storage (South-West):</strong> Heavy raw materials anchor the earth quadrant, providing structural stability.</li>
          <li><strong>Heavy Processing & Furnaces (South-East):</strong> High-temperature boilers, furnaces, heat treatment, and electrical transformers must be situated in the Agni zone.</li>
          <li><strong>Secondary Machining & Tooling (South & West):</strong> Stamping presses, CNC machinery, and assembly bays occupy stable Southern and Western sectors.</li>
          <li><strong>Finished Goods & Dispatch (North-West):</strong> Packaged products awaiting shipment are positioned in the Vayu zone, ensuring swift dispatch and zero warehouse dead-stock.</li>
        </ol>
      `,
      relatedArticles: ["vastu-for-commercial-offices", "understanding-eight-directions", "what-is-vastu-shastra"]
    },

    {
      id: "art-eight-directions",
      slug: "understanding-eight-directions",
      title: "Understanding the Eight Directions: Cosmic Rulers, Elements & Energies",
      excerpt: "A deep dive into the 8 Ashta Dikpalas, ruling planets, elemental balances, and behavioral attributes governing each directional quadrant of your property.",
      category: "Vedic Knowledge",
      readTime: "9 Min Read",
      date: "November 01, 2026",
      image: "assets/mandala-bg.svg",
      content: `
        <p class="mb-4">In Vedic cosmology, space is not an empty vacuum; it is governed by eight divine guardians known as the <strong>Ashta Dikpalas</strong>, each presiding over a distinct planetary influence, primordial element, and psychological facet of human life.</p>

        <h4 class="font-serif text-lg text-[#F9E29B] font-bold mt-6 mb-3">The Ashta Dikpala Matrix</h4>
        <div class="space-y-3 text-xs md:text-sm text-[#DCCBB0]">
          <p><strong>1. North (Uttara):</strong> Deity: Kubera | Planet: Mercury | Element: Water | Key Attribute: New opportunities, wealth inflow, intellectual agility.</p>
          <p><strong>2. North-East (Ishanya):</strong> Deity: Ishana (Shiva) | Planet: Jupiter | Element: Water/Space | Key Attribute: Spiritual enlightenment, mental clarity, divine blessings.</p>
          <p><strong>3. East (Purva):</strong> Deity: Indra | Planet: Sun | Element: Air/Fire | Key Attribute: Social network, health, government favor, vital stamina.</p>
          <p><strong>4. South-East (Agneya):</strong> Deity: Agni | Planet: Venus | Element: Fire | Key Attribute: Cash flow, physical passion, digestion, female health.</p>
          <p><strong>5. South (Dakshina):</strong> Deity: Yama | Planet: Mars | Element: Fire/Earth | Key Attribute: Fame, honor, sound sleep, discipline, lawfulness.</p>
          <p><strong>6. South-West (Nairrutya):</strong> Deity: Nirriti | Planet: Rahu | Element: Earth | Key Attribute: Mastership, relationship stability, skill retention, protection.</p>
          <p><strong>7. West (Paschima):</strong> Deity: Varuna | Planet: Saturn | Element: Space/Water | Key Attribute: Commercial profits, realization of dreams, academic focus.</p>
          <p><strong>8. North-West (Vayavya):</strong> Deity: Vayu | Planet: Moon | Element: Air | Key Attribute: Helpful allies, banking support, movement, travel, sales turnover.</p>
        </div>
      `,
      relatedArticles: ["what-is-vastu-shastra", "vastu-purusha-mandala-explained", "importance-of-main-entrance"]
    },

    {
      id: "art-vastu-purusha-mandala-explained",
      slug: "vastu-purusha-mandala-explained",
      title: "Vastu Purusha Mandala Explained: The Sacred Geometry of Ancient Architecture",
      excerpt: "Deconstructing the cosmic legend of Vastu Purusha, his anatomical distribution across the floor plan, and how to harness his blessings in modern buildings.",
      category: "Sacred Geometry",
      readTime: "8 Min Read",
      date: "November 01, 2026",
      image: "assets/mandala-bg.svg",
      content: `
        <p class="mb-4">The <strong>Vastu Purusha Mandala</strong> is the foundational metaphysical diagram of Hindu architectural science. It symbolizes the manifestation of the unmanifest cosmic consciousness into bounded, physical architectural form.</p>

        <h4 class="font-serif text-lg text-[#F9E29B] font-bold mt-6 mb-3">The Classical Legend</h4>
        <p class="mb-4">According to the <em>Matsya Purana</em>, during a titanic cosmic struggle between Shiva and the demon Andhaka, drops of sweat fell from Shiva's brow and formed a colossal being of immense appetite and power—the <strong>Vastu Purusha</strong>. When this entity threatened to consume the universe, the 45 cosmic deities (Devtas) pressed him downward to the Earth, pinning him in place.</p>
        
        <p class="mb-4">Brahma then ordained that this Purusha would become the presiding deity of all built structures. Whoever honors the deities occupying his body parts during building construction will enjoy health, abundance, and spiritual peace; whoever violates them will experience friction.</p>

        <h4 class="font-serif text-lg text-[#F9E29B] font-bold mt-6 mb-3">Anatomical Correlations</h4>
        <ul class="list-disc pl-5 space-y-2 mb-4 text-[#DCCBB0]">
          <li><strong>Head in North-East (Ishanya):</strong> Seat of divine intellect and sensory organs. Keep spotless, open, and elevated spiritually.</li>
          <li><strong>Heart & Navel in Center (Brahmasthan):</strong> Seat of universal respiration. Must be completely free of structural weight.</li>
          <li><strong>Hands in North-West & South-East:</strong> Seat of dynamic action and metabolic digestion.</li>
          <li><strong>Feet in South-West (Nairrutya):</strong> Seat of gravitational anchoring and stability. Keep solid, elevated, and heavy.</li>
        </ul>
      `,
      relatedArticles: ["understanding-brahmasthan", "what-is-vastu-shastra", "understanding-eight-directions"]
    },

    {
      id: "art-common-planning-mistakes",
      slug: "common-vastu-planning-mistakes",
      title: "Common Vastu Planning Mistakes in Modern Homes and How to Rectify Them",
      excerpt: "Identifies the 7 most frequent architectural errors in contemporary floor plans—from corner cuts to underground sumps—and practical non-demolition cures.",
      category: "Remedial Architecture",
      readTime: "7 Min Read",
      date: "November 01, 2026",
      image: "assets/mandala-bg.svg",
      content: `
        <p class="mb-4">In contemporary urban developments, architectural constraints and aesthetic trends often lead to unintended Vastu violations. Fortunately, traditional Vedic wisdom offers sophisticated non-demolition cures that restore spatial equilibrium without knocking down walls.</p>

        <h4 class="font-serif text-lg text-[#F9E29B] font-bold mt-6 mb-3">The 7 Most Common Planning Errors:</h4>
        <ol class="list-decimal pl-5 space-y-2 mb-4 text-[#DCCBB0]">
          <li><strong>Cut in North-East (Missing Ishanya):</strong> Suppresses spiritual growth and mental clarity. Remedied by installing zinc rods along the cut and convex brass mirrors to energetically extend the space.</li>
          <li><strong>Toilets in South-West:</strong> Causes severe relationship breakdown and chronic financial drain. Remedied by isolating the commode with a 3-sided lead strip barrier.</li>
          <li><strong>Underground Water Tank in South-East:</strong> Clashes directly with Agni, leading to sudden health expenses. Remedied by shifting water storage to North-East or neutralizing with copper pyramids.</li>
          <li><strong>Overhead Water Tank in North-East:</strong> Puts immense structural weight upon the head of the Vastu Purusha. Remedied by relocating tank to South-West on elevated pedestals.</li>
          <li><strong>Main Entrance Facing a T-Junction:</strong> Generates aggressive road thrust. Remedied by erecting a copper boundary baffle or consecrated Pakua mirror.</li>
          <li><strong>Kitchen Placed Underneath a Toilet:</strong> Causes contamination of food energy. Remedied by ceiling false-ceiling insulation with consecrated quartz crystals.</li>
          <li><strong>Cluttered Central Corridor:</strong> Stifles prana distribution. Remedied by decluttering furniture and installing warm diffuse illumination.</li>
        </ol>
      `,
      relatedArticles: ["vastu-before-buying-house", "best-direction-for-kitchen", "traditional-vastu-modern-homes"]
    },

    {
      id: "art-traditional-vastu-modern-homes",
      slug: "traditional-vastu-principles-for-modern-homes",
      title: "Traditional Vastu Principles for Modern Homes: Balancing Luxury & Vedic Science",
      excerpt: "How forward-thinking architects seamlessly fuse open-concept minimalism, floor-to-ceiling glass, and steel cantilevers with authentic ancient Vedic spatial science.",
      category: "Modern Vedic Living",
      readTime: "8 Min Read",
      date: "November 01, 2026",
      image: "assets/mandala-bg.svg",
      content: `
        <p class="mb-4">A common myth among modern designers is that Vastu Shastra restricts architectural creativity or forces archaic visual styles. In reality, authentic Vedic architecture is a pure system of environmental physics, solar geometry, and proportions (Ayadi formulas) that effortlessly enhances modern luxury design.</p>

        <h4 class="font-serif text-lg text-[#F9E29B] font-bold mt-6 mb-3">Harmonizing Modern Features with Ancient Science:</h4>
        <ul class="list-disc pl-5 space-y-2 mb-4 text-[#DCCBB0]">
          <li><strong>Floor-to-Ceiling Glass Fenestration:</strong> Position extensive glass facades along North and East walls to flood interiors with beneficial morning light, while utilizing thick insulated masonry along South and West walls to mitigate excessive afternoon heat.</li>
          <li><strong>Open-Concept Living:</strong> Create expansive open living areas while honoring the central Brahmasthan through floating skylights or elegant sunken atriums.</li>
          <li><strong>Smart Home Automation:</strong> Position server racks and inverters in the South-East (Agneya) and smart ambient lighting controllers to match circadium solar rhythms.</li>
          <li><strong>Minimalist Color Palettes:</strong> Use warm ivories and creams as a neutral base, while strategically introducing muted elemental accents (terracotta in SE, earthen ochres in SW, serene sea-blues in NE).</li>
        </ul>
      `,
      relatedArticles: ["what-is-vastu-shastra", "best-direction-for-kitchen", "common-vastu-planning-mistakes"]
    }
  ],

  // Professional Media & Field Work Gallery (9 Categories from Section 13)
  gallery: [
    {
      id: "gal-1",
      title: "The Cosmic Space Podcast: Deconstructing Brahmasthan",
      category: "Podcast Appearances",
      categorySlug: "podcast",
      type: "video",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      image: "assets/mandala-bg.svg",
      description: "In-depth podcast dialogue on why modern high-rise apartments must preserve central etheric breathing space."
    },
    {
      id: "gal-2",
      title: "National Architectural Conclave Keynote",
      category: "Seminars and Workshops",
      categorySlug: "seminars",
      type: "image",
      image: "assets/mandala-bg.svg",
      description: "Delivering the keynote address on 'Non-Demolition Vastu Harmonization' before leading Indian architects."
    },
    {
      id: "gal-3",
      title: "Industrial Manufacturing Plant Energy Audit",
      category: "Site Visits",
      categorySlug: "site-visits",
      type: "image",
      image: "assets/mandala-bg.svg",
      description: "Conducting geopathic stress field measurements and machine vibration zoning at a 12-acre manufacturing complex."
    },
    {
      id: "gal-4",
      title: "Architectural Digest Panel: Vedic Geometry in Luxury Living",
      category: "Interviews and Media",
      categorySlug: "interviews",
      type: "video",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      image: "assets/mandala-bg.svg",
      description: "Featured panel discussion on harmonizing floor-to-ceiling glass facades with classical Vastu orientations."
    },
    {
      id: "gal-5",
      title: "Residential Villa Blueprint Consecration Session",
      category: "Vastu Consultations",
      categorySlug: "consultations",
      type: "image",
      image: "assets/mandala-bg.svg",
      description: "Collaborative consultation with homeowners aligning 16-zone energy divisions on architectural floor plans."
    },
    {
      id: "gal-6",
      title: "Real Estate Developers Leadership Roundtable",
      category: "Professional Events",
      categorySlug: "events",
      type: "image",
      image: "assets/mandala-bg.svg",
      description: "Advising tier-1 real estate developers on designing Vastu-compliant master township master plans."
    },
    {
      id: "gal-7",
      title: "Executive Director Corporate Chamber Consultation",
      category: "Client Meetings",
      categorySlug: "meetings",
      type: "image",
      image: "assets/mandala-bg.svg",
      description: "Private executive consultation optimizing CEO cabin, boardrooms, and finance lockers."
    },
    {
      id: "gal-8",
      title: "Masterclass: The 32 Padavinyasa Gates Explained",
      category: "Educational Videos",
      categorySlug: "educational",
      type: "video",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      image: "assets/mandala-bg.svg",
      description: "Comprehensive educational masterclass demystifying the 32 perimeter gates of the Vastu Purusha Mandala."
    },
    {
      id: "gal-9",
      title: "National Media Coverage: Science of Sacred Living",
      category: "Media Coverage",
      categorySlug: "media",
      type: "image",
      image: "assets/mandala-bg.svg",
      description: "National newspaper feature profiling Rajni Singh's non-demolition scientific spatial balance methodologies."
    }
  ],

  // Client Testimonials (Clearly Marked Placeholders ready for Owner authorization)
  testimonials: [
    {
      id: "test-1",
      name: "Vikramaditya Singhania",
      city: "New Delhi",
      category: "Luxury Villa Vastu",
      review: "Our ancestral residence in South Delhi suffered from prolonged unrest and financial delays. Rajni Singh's non-demolition audit rectified our entrance and kitchen through precise metal strips and crystal balancers. Within three months, our home felt remarkably peaceful, and our stalled projects gained momentum.",
      rating: 5,
      avatarInitial: "VS"
    },
    {
      id: "test-2",
      name: "Dr. Ananya Deshmukh",
      city: "Mumbai",
      category: "Apartment Vastu Optimization",
      review: "Being a medical professional, I was initially skeptical of traditional claims. However, Rajni Singh's scientific explanation of geomagnetic axes and solar infrared spectra completely changed my perspective. Her remedies for our high-rise apartment were subtle, elegant, and completely zero-demolition.",
      rating: 5,
      avatarInitial: "AD"
    },
    {
      id: "test-3",
      name: "Rameshwar Patel",
      city: "Ahmedabad",
      category: "Industrial Plant Layout",
      review: "Our chemical processing plant in Sanand had recurring machinery breakdowns and labor friction. Following Vastu Sutram's master industrial audit, we realigned our transformer substation and boiler outflow. Our operational uptime improved by over 24% over the following quarter.",
      rating: 5,
      avatarInitial: "RP"
    },
    {
      id: "test-4",
      name: "Sunita & K. R. Mehra",
      city: "Bengaluru",
      category: "New Home Construction",
      review: "From our Bhumi Pujan to Griha Pravesh, Rajni ji worked seamlessly with our modern architect. She calculated custom Ayadi dimensions for our bedrooms and ensured the central skylight atrium breathes freely. Our home is now our greatest source of tranquility.",
      rating: 5,
      avatarInitial: "SM"
    }
  ],

  // Default Consultation Time Slots (IST)
  defaultSlots: [
    "09:30 AM - 10:30 AM",
    "11:00 AM - 12:00 PM",
    "12:30 PM - 01:30 PM",
    "02:30 PM - 03:30 PM",
    "04:00 PM - 05:00 PM",
    "05:30 PM - 06:30 PM"
  ]
};

// CommonJS support for server/test environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VASTU_DATA;
}
