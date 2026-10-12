import type { GameState } from "./automation.ts";

export function createInitialGameState(): GameState {
  return {
    energy: 0,
    totalEnergyProduced: 0,
    clickPower: 1,
    generatorCount: 0,
    generatorPower: 1,
    upgradeLevels: {},
  };
}
