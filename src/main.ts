import { createInitialGameState } from "./state.ts";
import { manualGenerate } from "./input.ts";
import type { GameState } from "./automation.ts";

// @deno-types="./asset-url.d.ts"
import tileUrl from "./assets/tile.svg?no-inline";
import { getUpgradeCost, purchaseUpgrade } from "./upgrades.ts";

let state = createInitialGameState();

const app = document.querySelector<HTMLElement>("#app")!;

app.innerHTML = `
  <section class="station">
    <h1>Power Station</h1>
    <p>Restore the abandoned power station.</p>

    <section>
      <h2>Energy Status</h2>
      <p>Stored Energy: <output id="energy">0</output> EU</p>
      <p>Total Produced: <output id="total-energy">0</output> EU</p>
      <p>Generators: <output id="generators">0</output></p>
      <p>Production Rate: <output id="production-rate">0</output> EU/s</p>
    </section>

    <button id="generate" type="button">
      Generate Energy
    </button>
    <button id="buy-generator" type="button" disabled>
      Buy Generator (10 EU)
    </button>
  </section>
`;
const button = document.querySelector<HTMLButtonElement>("#generate");
const generatorButton = document.querySelector<HTMLButtonElement>(
  "#buy-generator",
);
const energyOutput = document.querySelector<HTMLOutputElement>("#energy");
const totalEnergyOutput = document.querySelector<HTMLOutputElement>(
  "#total-energy",
);
const generatorsOutput = document.querySelector<HTMLOutputElement>(
  "#generators",
);
const productionRateOutput = document.querySelector<HTMLOutputElement>(
  "#production-rate",
);

const image = document.createElement("img");
image.src = tileUrl;
image.alt = "A teal tile with a cream circle";
image.width = 96;
image.height = 96;
app.append(image);

if (
  !button || !generatorButton || !energyOutput || !totalEnergyOutput ||
  !generatorsOutput ||
  !productionRateOutput
) {
  throw new Error("Missing required elements in the DOM");
}

function render(state: GameState): void {
  const generatorCost = getUpgradeCost(state, "generator");
  energyOutput!.textContent = state.energy.toString();
  totalEnergyOutput!.textContent = state.totalEnergyProduced.toString();
  generatorsOutput!.textContent = state.generatorCount.toString();
  productionRateOutput!.textContent =
    (state.generatorCount * state.generatorPower).toString();
  generatorButton!.textContent = "Buy Generator (" + generatorCost + " EU)";
  generatorButton!.disabled = state.energy < generatorCost;
}

render(state);

button.addEventListener("click", () => {
  state = manualGenerate(state);
  render(state);
});

generatorButton.addEventListener("click", () => {
  state = purchaseUpgrade(state, "generator").state;
  render(state);
});
