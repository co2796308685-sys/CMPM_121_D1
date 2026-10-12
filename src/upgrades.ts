import type { GameState } from "./automation.ts";

export type UpgradeId =
  | "generator"
  | "click"
  | "generatorPower";

const upgradeData = {
  generator: { baseCost: 10, multiplier: 1.15 },
  click: { baseCost: 20, multiplier: 1.5 },
  generatorPower: { baseCost: 50, multiplier: 2 },
};

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

  switch (id) {
    case "generator":
      newState.generatorCount += 1;
      break;

    case "click":
      newState.clickPower += 1;
      break;

    case "generatorPower":
      newState.generatorPower += 1;
      break;
  }

  return { state: newState, success: true };
}
