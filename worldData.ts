import { CountryDef, GameStats } from "../types";

// Helper: Deep merge stats
const mergeStats = (base: GameStats, override?: Partial<GameStats>): GameStats => {
  if (!override) return base;
  return { ...base, ...override };
};

// Helper: Get effective country data for a specific year
export const getCountryAtYear = (country: CountryDef, year: number): CountryDef & { exists: boolean } => {
  let effectiveCountry = { ...country, exists: true };
  
  // Sort history by year ascending
  const history = country.history?.sort((a, b) => a.year - b.year) || [];

  let appliedOverride = null;
  for (const h of history) {
    if (h.year <= year) {
      appliedOverride = h;
    }
  }

  if (appliedOverride) {
    if (appliedOverride.name) effectiveCountry.name = appliedOverride.name;
    if (appliedOverride.stats) effectiveCountry.baseStats = mergeStats(effectiveCountry.baseStats, appliedOverride.stats);
    if (appliedOverride.alliances) effectiveCountry.alliances = appliedOverride.alliances;
    if (appliedOverride.exists !== undefined) effectiveCountry.exists = appliedOverride.exists;
  }

  return effectiveCountry;
};

export const getWorldAtYear = (year: number) => {
  return WORLD_DATA.map(c => getCountryAtYear(c, year)).filter(c => c.exists);
};

export const WORLD_DATA: CountryDef[] = [
  // --- NORTH AMERICA ---
  {
    id: "CAN", name: "Canada", mapColor: "#e9d5ff",
    baseStats: { stability: 90, economy: 85, military: 60, population: 38, ideologyScore: -15, approval: 60 },
    alliances: ["NATO", "G7", "Commonwealth"],
    path: "M430,70 C400,60 300,50 250,80 C200,100 220,150 280,150 C320,150 350,170 400,170 C450,170 550,180 580,180 C600,180 620,150 620,120 C620,90 580,70 500,70 Z",
    history: [
      { year: 1900, stats: { population: 5, economy: 40, military: 30 }, alliances: ["British Empire"] },
      { year: 1948, stats: { population: 13, economy: 60, military: 50 }, alliances: ["NATO", "Commonwealth"] }
    ]
  },
  {
    id: "USA", name: "United States", mapColor: "#bbf7d0",
    baseStats: { stability: 65, economy: 98, military: 98, population: 332, ideologyScore: 20, approval: 50 },
    alliances: ["NATO", "G7", "UN Security Council"],
    path: "M280,150 C280,150 260,200 280,250 C300,280 350,320 400,320 C450,320 500,320 540,320 C560,320 580,280 580,240 C580,200 550,180 500,180 C450,180 400,170 280,150 Z M150,80 C180,70 240,70 250,90 C260,110 240,130 180,130 C150,130 130,110 150,80 Z",
    history: [
      { year: 1900, stats: { population: 76, economy: 60, military: 40 }, alliances: ["None"] },
      { year: 1930, stats: { population: 123, economy: 30, military: 35 }, alliances: ["None"] },
      { year: 1948, stats: { population: 140, economy: 95, military: 90 }, alliances: ["NATO", "UN"] },
      { year: 1980, stats: { population: 220, economy: 90, military: 95 }, alliances: ["NATO", "G7"] }
    ]
  },
  {
    id: "GRL", name: "Greenland", mapColor: "#e5e7eb",
    baseStats: { stability: 95, economy: 20, military: 5, population: 0.05, ideologyScore: 0, approval: 70 },
    alliances: ["NATO (via Denmark)"],
    path: "M630,50 L750,40 L780,120 L720,150 L650,140 Z"
  },
  {
    id: "MEX", name: "Mexico", mapColor: "#fef08a",
    baseStats: { stability: 45, economy: 60, military: 40, population: 129, ideologyScore: -5, approval: 45 },
    alliances: ["USMCA"],
    path: "M280,250 C300,280 320,300 350,340 C380,380 400,380 450,420 C480,410 490,380 480,360 C460,340 440,340 400,320 C360,300 320,280 280,250 Z",
    history: [
      { year: 1900, stats: { population: 13, economy: 20 }, alliances: [] },
      { year: 1930, stats: { population: 16, economy: 25 }, alliances: [] }
    ]
  },
  {
    id: "CUB", name: "Cuba", mapColor: "#bfdbfe",
    baseStats: { stability: 60, economy: 20, military: 30, population: 11, ideologyScore: -80, approval: 40 },
    alliances: ["ALBA", "Non-Aligned"],
    path: "M470,365 C480,360 510,360 530,370 C535,375 520,385 510,380 C490,375 480,370 470,365 Z",
    history: [
      { year: 1900, stats: { population: 1.5, stability: 30 }, name: "Cuba (US Protectorate)" },
      { year: 1948, stats: { population: 5, ideologyScore: 10 }, name: "Cuba (Republic)", alliances: ["OAS"] },
      { year: 1980, stats: { population: 9, ideologyScore: -90 }, name: "Cuba (Socialist)", alliances: ["Comecon"] }
    ]
  },

  // --- SOUTH AMERICA ---
  {
    id: "COL", name: "Colombia", mapColor: "#fcd34d",
    baseStats: { stability: 40, economy: 45, military: 50, population: 51, ideologyScore: -10, approval: 35 },
    alliances: ["NATO Global Partner", "OAS"],
    path: "M470,450 C490,450 510,460 520,470 C530,480 520,500 500,500 C480,500 470,490 470,450 Z"
  },
  {
    id: "VEN", name: "Venezuela", mapColor: "#fca5a5",
    baseStats: { stability: 15, economy: 20, military: 40, population: 28, ideologyScore: -70, approval: 20 },
    alliances: ["OPEC", "ALBA"],
    path: "M520,470 C540,460 570,460 580,470 C590,490 580,500 550,500 C530,500 525,480 520,470 Z"
  },
  {
    id: "BRA", name: "Brazil", mapColor: "#86efac",
    baseStats: { stability: 55, economy: 65, military: 60, population: 214, ideologyScore: 10, approval: 55 },
    alliances: ["BRICS", "Mercosur", "G20"],
    path: "M550,500 C580,480 620,480 650,520 C680,560 650,600 620,620 C580,600 550,580 540,550 C540,520 550,500 550,500 Z",
    history: [
        { year: 1900, stats: { population: 17, economy: 30 } }
    ]
  },
  {
    id: "PER", name: "Peru", mapColor: "#fed7aa",
    baseStats: { stability: 35, economy: 40, military: 35, population: 33, ideologyScore: 5, approval: 25 },
    alliances: ["OAS"],
    path: "M480,500 C500,500 520,520 530,550 C530,580 510,600 500,620 C480,600 470,550 480,500 Z"
  },
  {
    id: "ARG", name: "Argentina", mapColor: "#93c5fd",
    baseStats: { stability: 50, economy: 55, military: 45, population: 45, ideologyScore: 15, approval: 40 },
    alliances: ["Mercosur", "G20"],
    path: "M520,620 C540,630 570,660 580,680 C590,720 580,800 540,840 C520,840 510,800 520,620 Z"
  },
  {
    id: "CHL", name: "Chile", mapColor: "#fdba74",
    baseStats: { stability: 70, economy: 60, military: 45, population: 19, ideologyScore: -5, approval: 45 },
    alliances: ["OAS", "OECD"],
    path: "M500,620 C510,630 520,680 520,840 C500,840 490,800 500,620 Z"
  },

  // --- EUROPE ---
  {
    id: "GBR", name: "United Kingdom", mapColor: "#fca5a5",
    baseStats: { stability: 80, economy: 80, military: 75, population: 67, ideologyScore: 10, approval: 50 },
    alliances: ["NATO", "G7", "Commonwealth", "AUKUS"],
    path: "M920,220 C930,210 950,210 960,220 C970,240 950,260 930,260 C920,260 910,240 920,220 Z",
    history: [
      { year: 1900, name: "British Empire", stats: { population: 400, economy: 95, military: 95 }, alliances: ["Allies"] },
      { year: 1930, name: "British Empire", stats: { economy: 70 }, alliances: ["Allies"] },
      { year: 1948, name: "United Kingdom", stats: { population: 50, economy: 60, military: 70 }, alliances: ["NATO"] }
    ]
  },
  {
    id: "FRA", name: "France", mapColor: "#93c5fd",
    baseStats: { stability: 75, economy: 80, military: 80, population: 67, ideologyScore: -5, approval: 45 },
    alliances: ["NATO", "EU", "G7", "UN Security Council"],
    path: "M940,260 C960,250 980,250 990,260 C1000,280 980,310 940,310 C930,300 930,280 940,260 Z",
    history: [
      { year: 1900, name: "French Third Republic", stats: { population: 40, economy: 80, military: 85 } },
      { year: 1948, name: "France", stats: { population: 41, economy: 50, military: 60 } }
    ]
  },
  {
    id: "ESP", name: "Spain", mapColor: "#fde047",
    baseStats: { stability: 70, economy: 70, military: 55, population: 47, ideologyScore: 5, approval: 50 },
    alliances: ["NATO", "EU"],
    path: "M900,310 C920,300 950,300 960,310 C970,330 950,360 910,360 C900,350 890,330 900,310 Z",
    history: [
      { year: 1930, name: "Second Spanish Republic", stats: { stability: 20 } },
      { year: 1948, name: "Francoist Spain", stats: { ideologyScore: 80 }, alliances: ["Non-Aligned"] }
    ]
  },
  {
    id: "DEU", name: "Germany", mapColor: "#d8b4fe",
    baseStats: { stability: 85, economy: 88, military: 65, population: 83, ideologyScore: -10, approval: 55 },
    alliances: ["NATO", "EU", "G7"],
    path: "M990,250 C1010,240 1030,240 1040,250 C1040,270 1020,280 990,270 C980,260 980,250 990,250 Z",
    history: [
      { year: 1900, name: "German Empire", stats: { population: 56, economy: 90, military: 95 }, alliances: ["Central Powers"] },
      { year: 1930, name: "Weimar Republic", stats: { population: 65, economy: 20, military: 20 }, alliances: [] },
      { year: 1948, name: "West Germany", stats: { population: 50, economy: 30, military: 10 }, alliances: ["NATO (Later)"] },
      { year: 1980, name: "West Germany", stats: { population: 61, economy: 85, military: 70 }, alliances: ["NATO", "EEC"] },
      { year: 1990 } // Reunified
    ]
  },
  {
    id: "ITA", name: "Italy", mapColor: "#86efac",
    baseStats: { stability: 65, economy: 75, military: 60, population: 60, ideologyScore: 15, approval: 45 },
    alliances: ["NATO", "EU", "G7"],
    path: "M1000,280 C1020,280 1040,290 1050,320 C1060,350 1040,360 1020,340 C1010,330 1000,300 1000,280 Z",
    history: [
        { year: 1900, name: "Kingdom of Italy", stats: { population: 32 } },
        { year: 1930, name: "Fascist Italy", stats: { population: 40, ideologyScore: 90 } }
    ]
  },
  {
    id: "NOR", name: "Norway", mapColor: "#fca5a5",
    baseStats: { stability: 95, economy: 90, military: 55, population: 5, ideologyScore: -20, approval: 70 },
    alliances: ["NATO"],
    path: "M980,150 C990,140 1010,140 1000,180 C990,200 980,220 970,210 C970,180 970,160 980,150 Z"
  },
  {
    id: "SWE", name: "Sweden", mapColor: "#fef08a",
    baseStats: { stability: 95, economy: 85, military: 60, population: 10, ideologyScore: -20, approval: 65 },
    alliances: ["NATO", "EU"],
    path: "M1010,140 C1030,130 1050,130 1040,180 C1030,200 1010,210 1000,180 Z"
  },
  {
    id: "FIN", name: "Finland", mapColor: "#bfdbfe",
    baseStats: { stability: 90, economy: 80, military: 65, population: 5, ideologyScore: -10, approval: 75 },
    alliances: ["NATO", "EU"],
    path: "M1050,130 C1070,120 1090,130 1080,180 C1070,200 1050,200 1040,180 Z",
    history: [
      { year: 1900, exists: false }
    ]
  },
  {
    id: "POL", name: "Poland", mapColor: "#fca5a5",
    baseStats: { stability: 75, economy: 65, military: 70, population: 38, ideologyScore: 30, approval: 45 },
    alliances: ["NATO", "EU", "Three Seas"],
    path: "M1040,230 C1060,230 1080,230 1080,250 C1080,270 1060,270 1040,250 Z",
    history: [
      { year: 1900, exists: false }, 
      { year: 1930, name: "Second Polish Republic", stats: { population: 32, military: 50 }, exists: true },
      { year: 1948, name: "Poland (PPR)", stats: { population: 24, economy: 30, ideologyScore: -80 }, alliances: ["Warsaw Pact"] },
      { year: 1980, name: "Poland (PRL)", stats: { population: 35, economy: 40, ideologyScore: -70 }, alliances: ["Warsaw Pact"] },
      { year: 1990, name: "Poland" }
    ]
  },
  {
    id: "UKR", name: "Ukraine", mapColor: "#fde047",
    baseStats: { stability: 30, economy: 30, military: 85, population: 44, ideologyScore: 10, approval: 80 },
    alliances: ["Lublin Triangle"],
    path: "M1080,250 C1120,240 1160,240 1160,270 C1160,290 1120,290 1080,270 Z",
    history: [
      { year: 1900, exists: false },
      { year: 1930, exists: false },
      { year: 1948, exists: false },
      { year: 1980, exists: false },
      { year: 1991, exists: true } // Independence
    ]
  },
  {
    id: "RUS", name: "Russia", mapColor: "#94a3b8",
    baseStats: { stability: 50, economy: 60, military: 90, population: 144, ideologyScore: 70, approval: 60 },
    alliances: ["BRICS", "CSTO", "SCO", "UN Security Council"],
    path: "M1100,100 C1300,80 1600,80 1800,100 C1900,150 1800,250 1600,250 C1400,250 1200,280 1100,250 C1080,200 1080,150 1100,100 Z",
    history: [
      { year: 1900, name: "Russian Empire", stats: { population: 125, economy: 50, military: 80, ideologyScore: 80 } },
      { year: 1930, name: "Soviet Union", stats: { population: 160, economy: 60, military: 85, ideologyScore: -100 } },
      { year: 1948, name: "Soviet Union", stats: { population: 170, economy: 70, military: 95, ideologyScore: -100 }, alliances: ["Warsaw Pact"] },
      { year: 1980, name: "Soviet Union", stats: { population: 265, economy: 65, military: 98, ideologyScore: -90 }, alliances: ["Warsaw Pact"] },
      { year: 1991, name: "Russia" }
    ]
  },
  {
    id: "ROU", name: "Romania", mapColor: "#fde047",
    baseStats: { stability: 60, economy: 55, military: 45, population: 19, ideologyScore: 10, approval: 50 },
    alliances: ["NATO", "EU"],
    path: "M1100,290 L1140,290 L1130,320 L1090,310 Z",
    history: [
      { year: 1948, alliances: ["Warsaw Pact"], stats: { ideologyScore: -80 } },
      { year: 1980, alliances: ["Warsaw Pact"], stats: { ideologyScore: -80 } },
      { year: 1990 }
    ]
  },
  {
    id: "BGR", name: "Bulgaria", mapColor: "#86efac",
    baseStats: { stability: 55, economy: 45, military: 40, population: 7, ideologyScore: 10, approval: 45 },
    alliances: ["NATO", "EU"],
    path: "M1110,320 L1150,320 L1140,340 L1100,335 Z",
    history: [
      { year: 1948, alliances: ["Warsaw Pact"], stats: { ideologyScore: -80 } },
      { year: 1990 }
    ]
  },
  {
    id: "GRC", name: "Greece", mapColor: "#bfdbfe",
    baseStats: { stability: 60, economy: 50, military: 55, population: 10, ideologyScore: 5, approval: 50 },
    alliances: ["NATO", "EU"],
    path: "M1100,340 L1130,345 L1120,380 L1090,370 Z"
  },
  {
    id: "SRB", name: "Serbia", mapColor: "#fca5a5",
    baseStats: { stability: 50, economy: 45, military: 50, population: 7, ideologyScore: 20, approval: 40 },
    alliances: ["Non-Aligned"],
    path: "M1090,300 L1110,300 L1115,330 L1090,320 Z",
    history: [
      { year: 1930, name: "Yugoslavia", stats: { population: 14 } },
      { year: 1948, name: "Yugoslavia", stats: { population: 16, ideologyScore: -60 }, alliances: ["Non-Aligned Movement"] },
      { year: 2006, name: "Serbia" }
    ]
  },
  {
    id: "HRV", name: "Croatia", mapColor: "#e9d5ff",
    baseStats: { stability: 70, economy: 60, military: 40, population: 4, ideologyScore: 10, approval: 55 },
    alliances: ["NATO", "EU"],
    path: "M1060,300 L1090,300 L1080,320 L1070,315 Z",
    history: [
        { year: 1900, exists: false }, 
        { year: 1930, exists: false }, 
        { year: 1948, exists: false }, 
        { year: 1980, exists: false },
        { year: 1991, exists: true }
    ]
  },
  {
    id: "HUN", name: "Hungary", mapColor: "#fed7aa",
    baseStats: { stability: 60, economy: 55, military: 40, population: 10, ideologyScore: 40, approval: 45 },
    alliances: ["NATO", "EU"],
    path: "M1060,285 L1100,285 L1090,300 L1060,300 Z",
    history: [
        { year: 1900, exists: false }, 
        { year: 1948, alliances: ["Warsaw Pact"] },
        { year: 1990 }
    ]
  },
  {
    id: "BIH", name: "Bosnia", mapColor: "#bfdbfe",
    baseStats: { stability: 40, economy: 30, military: 20, population: 3, ideologyScore: 10, approval: 30 },
    alliances: ["Non-Aligned"],
    path: "M1080,310 L1100,310 L1090,325 Z",
    history: [
        { year: 1900, exists: false }, 
        { year: 1930, exists: false }, 
        { year: 1948, exists: false }, 
        { year: 1980, exists: false },
        { year: 1992, exists: true }
    ]
  },
   {
    id: "SVN", name: "Slovenia", mapColor: "#bbf7d0",
    baseStats: { stability: 80, economy: 70, military: 20, population: 2, ideologyScore: 5, approval: 60 },
    alliances: ["NATO", "EU"],
    path: "M1050,295 L1070,295 L1060,305 Z",
    history: [
        { year: 1900, exists: false }, 
        { year: 1930, exists: false }, 
        { year: 1948, exists: false }, 
        { year: 1980, exists: false },
        { year: 1991, exists: true }
    ]
  },

  // --- AFRICA ---
  {
    id: "DZA", name: "Algeria", mapColor: "#86efac",
    baseStats: { stability: 40, economy: 45, military: 55, population: 44, ideologyScore: 20, approval: 30 },
    alliances: ["Arab League", "OPEC", "African Union"],
    path: "M950,360 C980,350 1020,350 1020,400 C1020,430 980,440 950,420 C940,400 940,380 950,360 Z",
    history: [{ year: 1900, exists: false }, { year: 1948, exists: false }, { year: 1962, exists: true }]
  },
  {
    id: "EGY", name: "Egypt", mapColor: "#fde047",
    baseStats: { stability: 40, economy: 45, military: 65, population: 104, ideologyScore: 30, approval: 40 },
    alliances: ["BRICS", "Arab League", "African Union"],
    path: "M1080,380 C1120,370 1150,370 1150,410 C1150,430 1120,440 1080,420 C1070,400 1070,390 1080,380 Z"
  },
  {
    id: "NGA", name: "Nigeria", mapColor: "#fca5a5",
    baseStats: { stability: 25, economy: 40, military: 40, population: 211, ideologyScore: 10, approval: 35 },
    alliances: ["African Union", "ECOWAS", "OPEC"],
    path: "M1000,450 C1040,450 1060,460 1060,490 C1040,510 1000,500 990,470 Z",
    history: [{ year: 1900, exists: false }, { year: 1948, exists: false }, { year: 1960, exists: true }]
  },
  {
    id: "ZAF", name: "South Africa", mapColor: "#93c5fd",
    baseStats: { stability: 50, economy: 60, military: 50, population: 60, ideologyScore: 0, approval: 50 },
    alliances: ["BRICS", "African Union", "G20"],
    path: "M1080,700 C1120,700 1160,700 1170,750 C1140,800 1100,800 1080,750 Z",
    history: [
        { year: 1900, name: "Cape Colony", stats: { population: 5 }, alliances: ["British Empire"] },
        { year: 1948, name: "South Africa", stats: { population: 12 }, alliances: ["Commonwealth"] }
    ]
  },
  {
    id: "COD", name: "DR Congo", mapColor: "#d8b4fe",
    baseStats: { stability: 10, economy: 15, military: 20, population: 92, ideologyScore: -10, approval: 20 },
    alliances: ["African Union"],
    path: "M1100,520 C1140,520 1180,530 1180,580 C1160,600 1120,600 1100,560 Z",
    history: [{ year: 1900, exists: false }, { year: 1948, exists: false }, { year: 1960, exists: true }]
  },
  {
    id: "ETH", name: "Ethiopia", mapColor: "#fcd34d",
    baseStats: { stability: 20, economy: 25, military: 45, population: 118, ideologyScore: 5, approval: 35 },
    alliances: ["BRICS", "African Union"],
    path: "M1180,480 C1220,480 1250,500 1230,540 C1200,540 1180,520 1180,480 Z"
  },
   {
    id: "AGO", name: "Angola", mapColor: "#fca5a5",
    baseStats: { stability: 40, economy: 30, military: 40, population: 32, ideologyScore: 0, approval: 40 },
    alliances: ["OPEC", "African Union"],
    path: "M1100,600 C1140,600 1150,650 1120,660 C1100,650 1100,600 1100,600 Z",
    history: [{ year: 1900, exists: false }, { year: 1948, exists: false }, { year: 1975, exists: true }]
  },
   {
    id: "KEN", name: "Kenya", mapColor: "#86efac",
    baseStats: { stability: 50, economy: 40, military: 35, population: 53, ideologyScore: 0, approval: 50 },
    alliances: ["African Union"],
    path: "M1200,540 C1220,540 1230,580 1200,580 C1190,560 1200,540 1200,540 Z",
    history: [{ year: 1900, exists: false }, { year: 1948, exists: false }, { year: 1963, exists: true }]
  },

  // --- MIDDLE EAST & ASIA ---
  {
    id: "SAU", name: "Saudi Arabia", mapColor: "#fcd34d",
    baseStats: { stability: 65, economy: 80, military: 70, population: 35, ideologyScore: 80, approval: 50 },
    alliances: ["OPEC", "Arab League", "GCC"],
    path: "M1180,380 C1220,380 1260,400 1260,450 C1220,460 1180,450 1160,400 Z",
    history: [
        { year: 1900, exists: false },
        { year: 1932, exists: true }
    ]
  },
  {
    id: "IRN", name: "Iran", mapColor: "#86efac",
    baseStats: { stability: 30, economy: 45, military: 75, population: 85, ideologyScore: 90, approval: 20 },
    alliances: ["BRICS", "SCO", "Axis of Resistance"],
    path: "M1240,330 C1280,330 1320,340 1320,380 C1280,390 1240,380 1230,350 Z"
  },
  {
    id: "IRQ", name: "Iraq", mapColor: "#fde047",
    baseStats: { stability: 20, economy: 35, military: 50, population: 41, ideologyScore: 40, approval: 30 },
    alliances: ["Arab League", "OPEC"],
    path: "M1200,350 L1240,350 L1250,380 L1210,380 Z",
    history: [{ year: 1900, exists: false }, { year: 1932, exists: true }]
  },
  {
    id: "SYR", name: "Syria", mapColor: "#fca5a5",
    baseStats: { stability: 10, economy: 10, military: 35, population: 18, ideologyScore: 50, approval: 20 },
    alliances: ["Axis of Resistance", "Arab League"],
    path: "M1200,340 L1230,340 L1225,355 L1200,350 Z",
    history: [{ year: 1900, exists: false }, { year: 1946, exists: true }]
  },
  {
    id: "TUR", name: "Turkey", mapColor: "#fca5a5",
    baseStats: { stability: 45, economy: 55, military: 75, population: 84, ideologyScore: 40, approval: 45 },
    alliances: ["NATO", "G20"],
    path: "M1130,310 C1160,300 1200,310 1200,340 C1160,350 1130,340 1120,320 Z",
    history: [
        { year: 1900, name: "Ottoman Empire", stats: { population: 30, economy: 40, military: 60 } },
        { year: 1930, name: "Turkey", stats: { population: 14 } }
    ]
  },
  {
    id: "AFG", name: "Afghanistan", mapColor: "#d8b4fe",
    baseStats: { stability: 15, economy: 10, military: 30, population: 40, ideologyScore: 95, approval: 10 },
    alliances: ["Non-Aligned"],
    path: "M1320,340 L1360,350 L1350,380 L1320,370 Z"
  },
   {
    id: "MNG", name: "Mongolia", mapColor: "#fef08a",
    baseStats: { stability: 80, economy: 30, military: 25, population: 3, ideologyScore: 10, approval: 65 },
    alliances: ["Non-Aligned"],
    path: "M1400,220 L1550,220 L1530,260 L1420,260 Z",
    history: [{ year: 1900, exists: false }, { year: 1911, exists: true }]
  },
  {
    id: "CHN", name: "China", mapColor: "#d8b4fe",
    baseStats: { stability: 70, economy: 90, military: 90, population: 1400, ideologyScore: -80, approval: 65 },
    alliances: ["BRICS", "SCO", "UN Security Council"],
    path: "M1350,250 C1450,240 1550,280 1550,380 C1500,420 1450,420 1350,350 C1320,320 1320,280 1350,250 Z",
    history: [
      { year: 1900, name: "Qing Dynasty", stats: { population: 400, economy: 40, military: 20 }, alliances: [] },
      { year: 1930, name: "Republic of China", stats: { population: 450, economy: 30, military: 40, stability: 20 } },
      { year: 1948, name: "China (Civil War)", stats: { population: 500, economy: 20, military: 60, stability: 10 } },
      { year: 1980, name: "PR China", stats: { population: 980, economy: 40, military: 75, ideologyScore: -90 } }
    ]
  },
   {
    id: "PRK", name: "North Korea", mapColor: "#fca5a5",
    baseStats: { stability: 95, economy: 10, military: 80, population: 25, ideologyScore: -100, approval: 10 },
    alliances: ["China Treaty Ally"],
    path: "M1560,290 L1585,290 L1585,310 L1565,310 Z",
    history: [{ year: 1900, exists: false }, { year: 1930, exists: false }, { year: 1948, exists: true }]
  },
  {
    id: "IND", name: "India", mapColor: "#93c5fd",
    baseStats: { stability: 55, economy: 75, military: 80, population: 1390, ideologyScore: 40, approval: 60 },
    alliances: ["BRICS", "G20", "SCO", "Quad"],
    path: "M1320,380 C1380,380 1420,400 1400,500 C1380,530 1340,530 1320,450 C1300,420 1300,400 1320,380 Z",
    history: [
      { year: 1900, name: "British Raj", stats: { population: 290, economy: 40, military: 40 }, alliances: ["British Empire"] },
      { year: 1930, name: "British Raj", stats: { population: 350 }, alliances: ["British Empire"] },
      { year: 1948, name: "India", stats: { population: 360, economy: 25, military: 40 }, alliances: ["Non-Aligned"] }
    ]
  },
  {
    id: "JPN", name: "Japan", mapColor: "#fca5a5",
    baseStats: { stability: 90, economy: 85, military: 60, population: 125, ideologyScore: 10, approval: 55 },
    alliances: ["G7", "Quad", "US Treaty Ally"],
    path: "M1600,280 C1620,270 1640,280 1640,320 C1630,350 1610,350 1600,320 C1590,300 1590,290 1600,280 Z",
    history: [
      { year: 1900, name: "Empire of Japan", stats: { population: 44, economy: 60, military: 75, ideologyScore: 80 } },
      { year: 1930, name: "Empire of Japan", stats: { population: 64, economy: 70, military: 90, ideologyScore: 90 } },
      { year: 1948, name: "Japan (Occupied)", stats: { population: 80, economy: 20, military: 0, stability: 40 }, alliances: ["US Occupied"] },
      { year: 1980, name: "Japan", stats: { population: 116, economy: 95, military: 40 }, alliances: ["US Treaty Ally"] }
    ]
  },
  {
    id: "KOR", name: "South Korea", mapColor: "#86efac",
    baseStats: { stability: 85, economy: 80, military: 75, population: 51, ideologyScore: 15, approval: 50 },
    alliances: ["G20", "US Treaty Ally"],
    path: "M1560,310 C1580,310 1590,320 1580,340 C1560,340 1550,320 1560,310 Z",
    history: [{ year: 1900, exists: false }, { year: 1930, exists: false }, { year: 1948, exists: true }]
  },
  {
    id: "VNM", name: "Vietnam", mapColor: "#fca5a5",
    baseStats: { stability: 65, economy: 55, military: 60, population: 98, ideologyScore: -60, approval: 60 },
    alliances: ["Non-Aligned"],
    path: "M1490,430 L1510,430 L1515,500 L1495,490 Z",
    history: [{ year: 1900, exists: false }, { year: 1930, exists: false }, { year: 1948, exists: false }, { year: 1976, exists: true }]
  },
  {
    id: "THA", name: "Thailand", mapColor: "#fef08a",
    baseStats: { stability: 45, economy: 55, military: 50, population: 70, ideologyScore: 20, approval: 45 },
    alliances: ["US Treaty Ally", "ASEAN"],
    path: "M1460,440 L1490,440 L1480,500 L1460,490 Z"
  },
  {
    id: "PHL", name: "Philippines", mapColor: "#bfdbfe",
    baseStats: { stability: 50, economy: 50, military: 45, population: 111, ideologyScore: 10, approval: 55 },
    alliances: ["US Treaty Ally", "ASEAN"],
    path: "M1550,450 L1580,450 L1570,510 L1540,500 Z",
    history: [{ year: 1900, exists: false }, { year: 1930, exists: false }, { year: 1946, exists: true }]
  },
   {
    id: "MYS", name: "Malaysia", mapColor: "#e9d5ff",
    baseStats: { stability: 60, economy: 65, military: 45, population: 32, ideologyScore: 10, approval: 55 },
    alliances: ["ASEAN", "Non-Aligned", "Commonwealth"],
    path: "M1470,510 L1520,510 L1530,530 L1480,530 Z M1560,520 L1600,520 L1590,540 L1560,540 Z",
    history: [{ year: 1900, exists: false }, { year: 1930, exists: false }, { year: 1957, exists: true }]
  },
  {
    id: "IDN", name: "Indonesia", mapColor: "#fde047",
    baseStats: { stability: 55, economy: 60, military: 55, population: 276, ideologyScore: 10, approval: 60 },
    alliances: ["ASEAN", "G20", "Non-Aligned"],
    path: "M1400,550 C1500,540 1600,550 1650,580 C1600,600 1500,600 1400,580 Z",
    history: [{ year: 1900, exists: false }, { year: 1930, exists: false }, { year: 1949, exists: true }]
  },
  {
    id: "PAK", name: "Pakistan", mapColor: "#86efac",
    baseStats: { stability: 30, economy: 40, military: 65, population: 220, ideologyScore: 30, approval: 40 },
    alliances: ["SCO", "Non-NATO Ally"],
    path: "M1280,370 C1320,370 1320,400 1310,420 C1280,410 1280,370 1280,370 Z",
    history: [
      { year: 1900, exists: false },
      { year: 1930, exists: false },
      { year: 1948, stats: { population: 40, economy: 20 } }
    ]
  },
  {
    id: "KAZ", name: "Kazakhstan", mapColor: "#fef08a",
    baseStats: { stability: 60, economy: 50, military: 40, population: 19, ideologyScore: 20, approval: 55 },
    alliances: ["CSTO", "SCO"],
    path: "M1200,230 C1300,240 1350,280 1300,310 C1250,300 1200,290 1200,230 Z",
    history: [{ year: 1900, exists: false }, { year: 1930, exists: false }, { year: 1948, exists: false }, { year: 1980, exists: false }, { year: 1991, exists: true }]
  },
  {
    id: "UZB", name: "Uzbekistan", mapColor: "#bfdbfe",
    baseStats: { stability: 55, economy: 40, military: 40, population: 34, ideologyScore: 30, approval: 50 },
    alliances: ["SCO"],
    path: "M1280,300 L1320,300 L1310,330 L1280,320 Z",
    history: [{ year: 1900, exists: false }, { year: 1930, exists: false }, { year: 1948, exists: false }, { year: 1980, exists: false }, { year: 1991, exists: true }]
  },

  // --- OCEANIA ---
  {
    id: "AUS", name: "Australia", mapColor: "#93c5fd",
    baseStats: { stability: 90, economy: 80, military: 40, population: 25, ideologyScore: 5, approval: 55 },
    alliances: ["Commonwealth", "AUKUS", "Five Eyes", "G20"],
    path: "M1500,650 C1600,630 1700,630 1720,700 C1700,750 1600,780 1500,750 C1450,700 1450,680 1500,650 Z",
    history: [
       { year: 1900, stats: { population: 3.7 }, alliances: ["British Empire"] }
    ]
  },
  {
    id: "NZL", name: "New Zealand", mapColor: "#86efac",
    baseStats: { stability: 95, economy: 70, military: 30, population: 5, ideologyScore: -10, approval: 60 },
    alliances: ["Commonwealth", "Five Eyes"],
    path: "M1750,800 C1770,790 1790,800 1780,850 C1760,860 1740,840 1750,800 Z",
    history: [
      { year: 1900, stats: { population: 0.8 }, alliances: ["British Empire"] }
    ]
  }
];