export enum Ideology {
  COMMUNISM = "Communism",
  SOCIALISM = "Socialism",
  LIBERALISM = "Liberalism",
  CONSERVATISM = "Conservatism",
  NATIONALISM = "Nationalism",
  FASCISM = "Fascism"
}

export type LeaderType = 'DEMOCRAT' | 'DICTATOR';

export interface Law {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  type: 'CIVIL' | 'ECONOMIC' | 'MILITARY' | 'POLITICAL' | 'ENVIRONMENT';
  effectDescription: string;
}

export interface GameStats {
  stability: number; // 0-100
  economy: number; // 0-100
  military: number; // 0-100
  population: number; // in millions
  ideologyScore: number; // -100 (Far Left) to 100 (Far Right)
  approval: number; // 0-100 (0 = Hated, 100 = Loved)
}

export interface GameEvent {
  turn: number;
  title: string;
  description: string;
  consequence: string;
  type: 'war' | 'political' | 'economic' | 'diplomatic' | 'neutral';
}

export interface GameState {
  countryName: string;
  leaderName: string;
  leaderType: LeaderType;
  turn: number;
  startYear: number; // The year the game started (e.g., 1900, 2024)
  level: number; // Current term/level of the leader
  stats: GameStats;
  laws: Law[];
  globalTension: number; // 0-100
  events: GameEvent[];
  isGameOver: boolean;
  gameOverReason?: string;
  controlledCountryIds: string[]; // List of country IDs controlled
  tradePartners: string[]; // List of IDs
  wars: string[]; // List of IDs we are at war with
}

export interface HistoricalOverride {
  year: number; // Applies if game year is >= this year (until next override)
  name?: string;
  stats?: Partial<GameStats>;
  exists?: boolean; // If false, country is disabled for this era (e.g. Ukraine in 1900)
  alliances?: string[];
}

export interface CountryDef {
  id: string;
  name: string;
  baseStats: GameStats;
  path: string; // SVG Path
  mapColor?: string; // Hex color for the map visualization
  alliances: string[]; // e.g., ["NATO", "EU", "BRICS"]
  history?: HistoricalOverride[];
}

// Helper to get color based on ideology or status
export const getIdeologyColor = (score: number) => {
  if (score < -50) return "text-red-400"; // Far Left
  if (score < -20) return "text-orange-400"; // Left
  if (score > 50) return "text-blue-600"; // Far Right
  if (score > 20) return "text-blue-400"; // Right
  return "text-slate-400"; // Center
};