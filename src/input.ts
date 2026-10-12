import type { GameState } from "./automation.ts";

export function manualGenerate(
  state: GameState,
): GameState {
  return {
    ...state,
    energy: state.energy + state.clickPower,
    totalEnergyProduced: state.totalEnergyProduced + state.clickPower,
  };
}
