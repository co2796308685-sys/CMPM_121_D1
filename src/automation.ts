export function getEnergyPerSecond(state: {
  generatorCount: number;
  generatorPower: number;
}): number {
  const energyPerSecond = state.generatorCount * state.generatorPower;
  return energyPerSecond;
}

export interface GameState {
  energy: number;
  totalEnergyProduced: number;
  clickPower: number;
  generatorCount: number;
  generatorPower: number;
  upgradeLevels: Record<string, number>;
}

export function advanceTime(
  state: GameState,
  seconds: number,
): GameState {
  const energyProduced = getEnergyPerSecond(state) * seconds;
  const newState = { ...state };

  newState.energy = state.energy + energyProduced;
  newState.totalEnergyProduced = state.totalEnergyProduced + energyProduced;

  return newState;
}
