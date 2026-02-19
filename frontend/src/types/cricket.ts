export type Format = 'tests' | 'odis' | 't20is' | 'ipl';
export type Role = 'batter' | 'bowler';

export interface Team {
  name: string;
  formats: Format[];
}

export interface WagonWheelZone {
  zone: string;
  runs: number;
  fours: number;
  sixes: number;
  angle: number;
}

export interface PitchMapCell {
  length: string;
  line: string;
  balls: number;
  wickets: number;
  economy: number;
}

export interface PhaseStats {
  average?: number;
  strike_rate?: number;
  economy?: number;
  wickets?: number;
  boundary_pct?: number;
  dot_pct?: number;
}

export interface BatterStats {
  runs: number;
  innings: number;
  dismissals: number;
  not_outs: number;
  average: number;
  strike_rate: number;
  hundreds: number;
  fifties: number;
  fours: number;
  sixes: number;
  boundary_pct: number;
  dot_pct: number;
}

export interface BowlerStats {
  overs: number;
  wickets: number;
  runs_conceded: number;
  economy: number;
  average: number | null;
  strike_rate: number | null;
}

export interface BatterData {
  name: string;
  team: string;
  country: string;
  format: Format;
  role: 'batter';
  stats: BatterStats;
  phases: Record<string, PhaseStats>;
  dismissals_breakdown: Record<string, number>;
  wagon_wheel: WagonWheelZone[];
  vs_pace: { average: number; strike_rate: number };
  vs_spin: { average: number; strike_rate: number };
  vs_left_arm: { average: number; strike_rate: number };
  vs_right_arm: { average: number; strike_rate: number };
}

export interface BowlerData {
  name: string;
  team: string;
  country: string;
  format: Format;
  role: 'bowler';
  stats: BowlerStats;
  phases: Record<string, PhaseStats>;
  wicket_types: Record<string, number>;
  pitch_map: PitchMapCell[];
  vs_rhb: { economy: number; wickets: number };
  vs_lhb: { economy: number; wickets: number };
}

export type PlayerData = BatterData | BowlerData;

export const FORMAT_LABELS: Record<Format, string> = {
  tests: 'Tests',
  odis: 'ODIs',
  t20is: 'T20Is',
  ipl: 'IPL',
};

export const PHASE_LABELS: Record<string, string> = {
  first_session: 'Session 1',
  second_session: 'Session 2',
  third_session: 'Session 3',
  powerplay: 'Powerplay',
  middle: 'Middle Overs',
  death: 'Death Overs',
};

export const ZONE_LABELS: Record<string, string> = {
  fine_leg: 'Fine Leg',
  square_leg: 'Square Leg',
  midwicket: 'Midwicket',
  mid_on: 'Mid-On',
  straight: 'Straight',
  mid_off: 'Mid-Off',
  cover: 'Cover',
  point: 'Point',
  third_man: 'Third Man',
};
