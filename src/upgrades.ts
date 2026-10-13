import type { GameState } from "./automation.ts";

// Upgrade data: price and effects
const upgradeData = {
  generator: {
    baseCost: 10,
    multiplier: 1.15,
    effect: { field: "generatorCount", amount: 1 },
  },
  click: {
    baseCost: 20,
    multiplier: 1.5,
    effect: { field: "clickPower", amount: 1 },
  },
  generatorPower: {
    baseCost: 50,
    multiplier: 2,
    effect: { field: "generatorPower", amount: 1 },
  },
  turbineOverhaul: {
    baseCost: 100,
    multiplier: 1.8,
    effect: { field: "generatorPower", amount: 2 },
  },
} as const;

export type UpgradeId = keyof typeof upgradeData;

// Calculate the price of an upgrade
export function getUpgradeCost(
  state: GameState,
  id: UpgradeId,
): number {
  const level = state.upgradeLevels[id] ?? 0;
  const data = upgradeData[id];

  return Math.ceil(
    data.baseCost * Math.pow(data.multiplier, level),
  );
}

// Try to purchase an upgrade
export function purchaseUpgrade(
  state: GameState,
  id: UpgradeId,
): { state: GameState; success: boolean } {
  const cost = getUpgradeCost(state, id);

  if (state.energy < cost) {
    return { state, success: false };
  }

  const newState: GameState = {
    ...state,
    energy: state.energy - cost,
    upgradeLevels: {
      ...state.upgradeLevels,
      [id]: (state.upgradeLevels[id] ?? 0) + 1,
    },
  };

  // Apply the effect from upgrade data
  const effect = upgradeData[id].effect;
  newState[effect.field] += effect.amount;

  return { state: newState, success: true };
}
