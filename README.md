# Power Station

Restore an abandoned power station by generating energy, buying generators, and improving their output.

**[Play Power Station](https://yifeiyang19-code.github.io/CMPM_121_D1/)**

## How to play

Click **Generate Energy** to produce energy manually. Spend stored energy on upgrades:

| Upgrade          | Initial cost | Effect                        |
| ---------------- | -----------: | ----------------------------- |
| Generator        |        10 EU | Adds one generator            |
| Click Power      |        20 EU | Adds 1 EU per manual click    |
| Generator Power  |        50 EU | Adds 1 EU/s to each generator |
| Turbine Overhaul |       100 EU | Adds 2 EU/s to each generator |

Generators produce energy automatically. Total production rate is the number of generators multiplied by their individual power.

Upgrade prices increase with repeated purchases. Buttons display the current price and are disabled when stored energy is insufficient. Purchases reduce stored energy but do not reduce total energy produced.

## Run and build

Install Deno 2.9.7 and Git. From the repository directory:

- Run `deno task setup` once per clone to enable pre-commit checks.
- Run `deno task dev`, then open the local address printed by Vite.
- Run `deno task ci` to check formatting, lint, and TypeScript, then build the production app.
- Run `deno task preview` to serve the latest production build locally.

Preview does not rebuild or publish the app. Run `deno task fmt` to fix formatting before checking again.

The GitHub Actions workflow checks, builds, and deploys changes pushed to `main`. GitHub Pages must use **GitHub Actions** as its deployment source.

## Code navigation

| File                           | Responsibility                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| `src/automation.ts`            | Shared `GameState` type, production-rate calculation, and elapsed-time advancement |
| `src/state.ts`                 | Initial game state                                                                 |
| `src/input.ts`                 | Manual energy generation                                                           |
| `src/upgrades.ts`              | Upgrade content data, price calculation, purchase conditions, and effects          |
| `src/main.ts`                  | UI, input handlers, rendering, and automatic time updates                          |
| `src/assets/tile.svg`          | Imported image displayed in the app                                                |
| `.github/workflows/deploy.yml` | Production checks and GitHub Pages deployment                                      |

Automatic updates use the difference between successive `performance.now()` readings. The timer requests updates every 100 milliseconds, but production depends on actual elapsed seconds rather than the number of timer callbacks.

Manual generation and all purchases settle elapsed production before changing state. This ensures that time before a generator or power purchase uses the previous production rate. Energy displays use two decimal places while calculations retain their precision.

## Data-driven design and revision

Originally, upgrade data described prices, while a `switch` inside the purchase function separately selected each upgrade's effect. Adding an ordinary upgrade required changes in both places.

We moved each effect's target field and amount into `upgradeData`. The shared purchase function now handles affordability, payment, upgrade levels, and effect application for every entry. Upgrade identifiers are derived from the data keys.

This separates content definitions from purchase processing, supporting the Single Responsibility Principle. It also supports the Open/Closed Principle for the current additive upgrade model: new content can use existing processing without another item-specific purchase branch.

The same revision added **Turbine Overhaul** through this model. It uses the shared pricing and purchase behavior, and its UI was connected in a subsequent increment.

Relevant history:

- [Original upgrade implementation](https://github.com/yifeiyang19-code/CMPM_121_D1/commit/d3a6b0bcb1f0ff706f0421c3761f248dbd485ecf)
- [Data-driven effects and Turbine Overhaul addition](https://github.com/yifeiyang19-code/CMPM_121_D1/commit/2673141204ac0780a16e8e989db5776b59ca081c)
- [Turbine Overhaul UI integration](https://github.com/yifeiyang19-code/CMPM_121_D1/commit/e2bedbd477511a1d94ef9cec5a818da000825e5d)
- [Purchase timing and energy display revision](https://github.com/yifeiyang19-code/CMPM_121_D1/commit/07aff60cc5466672b7f45277bbb191e543ff590b)

## Validation

Local checks and production deployment passed. Browser checks covered manual generation, purchases, increasing prices, and Turbine Overhaul's effect. The final deployed game was also checked after automatic generation was integrated.

For future changes, check both the local build and the public deployment. Automated checks do not establish correct gameplay.

## Credits

This project uses the [official CMPM 121 D1 starter](https://github.com/ucsc-cmpm-121-f26/d1-starter).

Tooling was adapted from the [CMPM 121 Fall 2026 S01 starter](https://github.com/ucsc-cmpm-121-f26/s01-starter/tree/8974888efb6537be82e8eb069db139ea885039da), which has no explicit repository license. No new license is assigned to that material. As recorded in the starter's credits, the D1 scaffold and original SVG were authored with OpenAI GPT-6 Astra assistance. Dependencies retain their respective licenses.

AI assistance was used for repository review, explanations, integration guidance, and drafting this README.
