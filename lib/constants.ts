import type { BoardSpace } from "@/types";

export const BOARD_SPACES: BoardSpace[] = [
  { id: 0, name: "Start", type: "start", district: null },
  { id: 1, name: "Ember Lane", type: "property", district: "Ember", price: 60, baseRent: 2, rentLevels: [2,10,30,90,160,250], mortgageValue: 30, upgradeColor: "#92400E" },
  { id: 2, name: "City Event", type: "city_event", district: null },
  { id: 3, name: "Copper Row", type: "property", district: "Ember", price: 60, baseRent: 4, rentLevels: [4,20,60,180,320,450], mortgageValue: 30, upgradeColor: "#92400E" },
  { id: 4, name: "Civic Tax", type: "tax", district: null },
  { id: 5, name: "Northline Station", type: "transit", district: "Transit", price: 200, mortgageValue: 100 },
  { id: 6, name: "Jade Avenue", type: "property", district: "Jade", price: 100, baseRent: 6, rentLevels: [6,30,90,270,400,550], mortgageValue: 50, upgradeColor: "#14B8A6" },
  { id: 7, name: "Market Event", type: "market_event", district: null },
  { id: 8, name: "Jade Square", type: "property", district: "Jade", price: 100, baseRent: 6, rentLevels: [6,30,90,270,400,550], mortgageValue: 50, upgradeColor: "#14B8A6" },
  { id: 9, name: "Jade Court", type: "property", district: "Jade", price: 120, baseRent: 8, rentLevels: [8,40,100,300,450,600], mortgageValue: 60, upgradeColor: "#14B8A6" },
  { id: 10, name: "Lockup / Visiting", type: "lockup", district: null },
  { id: 11, name: "Coral Street", type: "property", district: "Coral", price: 140, baseRent: 10, rentLevels: [10,50,150,450,625,750], mortgageValue: 70, upgradeColor: "#FB7185" },
  { id: 12, name: "Waterworks", type: "utility", district: "Utility", price: 150, mortgageValue: 75 },
  { id: 13, name: "Coral Market", type: "property", district: "Coral", price: 140, baseRent: 10, rentLevels: [10,50,150,450,625,750], mortgageValue: 70, upgradeColor: "#FB7185" },
  { id: 14, name: "Coral Heights", type: "property", district: "Coral", price: 160, baseRent: 12, rentLevels: [12,60,180,500,700,900], mortgageValue: 80, upgradeColor: "#FB7185" },
  { id: 15, name: "Eastline Station", type: "transit", district: "Transit", price: 200, mortgageValue: 100 },
  { id: 16, name: "Harbor Road", type: "property", district: "Harbor", price: 180, baseRent: 14, rentLevels: [14,70,200,550,750,950], mortgageValue: 90, upgradeColor: "#0EA5E9" },
  { id: 17, name: "City Event", type: "city_event", district: null },
  { id: 18, name: "Harbor Quay", type: "property", district: "Harbor", price: 180, baseRent: 14, rentLevels: [14,70,200,550,750,950], mortgageValue: 90, upgradeColor: "#0EA5E9" },
  { id: 19, name: "Harbor Point", type: "property", district: "Harbor", price: 200, baseRent: 16, rentLevels: [16,80,220,600,800,1000], mortgageValue: 100, upgradeColor: "#0EA5E9" },
  { id: 20, name: "Rest Plaza", type: "rest", district: null },
  { id: 21, name: "Ivory Road", type: "property", district: "Ivory", price: 220, baseRent: 18, rentLevels: [18,90,250,700,875,1050], mortgageValue: 110, upgradeColor: "#E7E5E4" },
  { id: 22, name: "Market Event", type: "market_event", district: null },
  { id: 23, name: "Ivory Court", type: "property", district: "Ivory", price: 220, baseRent: 18, rentLevels: [18,90,250,700,875,1050], mortgageValue: 110, upgradeColor: "#E7E5E4" },
  { id: 24, name: "Ivory Tower", type: "property", district: "Ivory", price: 240, baseRent: 20, rentLevels: [20,100,300,750,925,1100], mortgageValue: 120, upgradeColor: "#E7E5E4" },
  { id: 25, name: "Southline Station", type: "transit", district: "Transit", price: 200, mortgageValue: 100 },
  { id: 26, name: "Neon Avenue", type: "property", district: "Neon", price: 260, baseRent: 22, rentLevels: [22,110,330,800,975,1150], mortgageValue: 130, upgradeColor: "#84CC16" },
  { id: 27, name: "Neon Plaza", type: "property", district: "Neon", price: 260, baseRent: 22, rentLevels: [22,110,330,800,975,1150], mortgageValue: 130, upgradeColor: "#84CC16" },
  { id: 28, name: "Power Grid", type: "utility", district: "Utility", price: 150, mortgageValue: 75 },
  { id: 29, name: "Neon Heights", type: "property", district: "Neon", price: 280, baseRent: 24, rentLevels: [24,120,360,850,1025,1200], mortgageValue: 140, upgradeColor: "#84CC16" },
  { id: 30, name: "Go To Lockup", type: "go_to_lockup", district: null },
  { id: 31, name: "Obsidian Street", type: "property", district: "Obsidian", price: 300, baseRent: 26, rentLevels: [26,130,390,900,1100,1275], mortgageValue: 150, upgradeColor: "#475569" },
  { id: 32, name: "Obsidian Yard", type: "property", district: "Obsidian", price: 300, baseRent: 26, rentLevels: [26,130,390,900,1100,1275], mortgageValue: 150, upgradeColor: "#475569" },
  { id: 33, name: "City Event", type: "city_event", district: null },
  { id: 34, name: "Obsidian Gate", type: "property", district: "Obsidian", price: 320, baseRent: 28, rentLevels: [28,150,450,1000,1200,1400], mortgageValue: 160, upgradeColor: "#475569" },
  { id: 35, name: "Westline Station", type: "transit", district: "Transit", price: 200, mortgageValue: 100 },
  { id: 36, name: "Market Event", type: "market_event", district: null },
  { id: 37, name: "Crown Avenue", type: "property", district: "Crown", price: 350, baseRent: 35, rentLevels: [35,175,500,1100,1300,1500], mortgageValue: 175, upgradeColor: "#F59E0B" },
  { id: 38, name: "Luxury Tax", type: "tax", district: null },
  { id: 39, name: "Crown Palace", type: "property", district: "Crown", price: 400, baseRent: 50, rentLevels: [50,200,600,1400,1700,2000], mortgageValue: 200, upgradeColor: "#F59E0B" },
];

export const DISTRICTS: Record<string, number[]> = {
  Ember: [1, 3],
  Jade: [6, 8, 9],
  Coral: [11, 13, 14],
  Harbor: [16, 18, 19],
  Ivory: [21, 23, 24],
  Neon: [26, 27, 29],
  Obsidian: [31, 32, 34],
  Crown: [37, 39],
  Transit: [5, 15, 25, 35],
  Utility: [12, 28],
};

export const DISTRICT_COLORS: Record<string, string> = {
  Ember: "#92400E",
  Jade: "#14B8A6",
  Coral: "#FB7185",
  Harbor: "#0EA5E9",
  Ivory: "#E7E5E4",
  Neon: "#84CC16",
  Obsidian: "#475569",
  Crown: "#F59E0B",
  Transit: "#0F766E",
  Utility: "#64748B",
};

export const PLAYER_COLORS = ["#D98236", "#2DD4BF", "#FBBF24", "#A78BFA"];

export const STARTING_BALANCE = 1500;
export const PASS_START_BONUS = 200;
export const LOCKUP_RELEASE_FEE = 50;
export const CIVIC_TAX_AMOUNT = 200;
export const LUXURY_TAX_AMOUNT = 100;

export const UPGRADE_NAMES = ["Base", "Minor", "Strong", "Premium", "Tower", "Landmark"];

export const TRANSIT_RENT: Record<number, number> = { 1: 25, 2: 50, 3: 100, 4: 200 };
