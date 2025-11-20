import { expect, type Locator, type Page } from "@playwright/test";

type Side = 0 | 1;
type ColorIdx = 0 | 1 | 2;

const rgbColors = [
  "rgb(68, 255, 68)", // for "yes"
  "rgb(255, 221, 68)", // for "maybe"
  "rgb(255, 68, 68)", // for "no"
];

// indexed by JarSide
const labels = ["G", "R"];

export class JarGridPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  visit() {
    return this.page.goto("/");
  }

  async getTile(tileDesc: string) {
    const tileElt = this.page.getByRole("region", { name: tileDesc });
    await expect(tileElt).toBeVisible();

    const tile = new Tile(this.page, tileElt);
    return {
      tile,
      ...tile.getJarSides(),
    };
  }
}

class Tile {
  readonly page: Page;
  private tile: Locator;

  constructor(page: Page, tile: Locator) {
    this.page = page;
    this.tile = tile;
  }

  getJarSides() {
    return {
      leftJar: new JarSide(this.tile, 0),
      rightJar: new JarSide(this.tile, 1),
    };
  }

  async setLabel(label: string) {
    const labelElt = this.tile.getByLabel("Jar name");
    await labelElt.fill(label);

    this.tile = this.page.getByRole("region", { name: label });
    await expect(this.tile).toBeVisible()
  }

  async remove() {
    const originalTiles = await this.page.locator("jar-tile").count();
    this.tile.getByLabel("Delete jar").click();
    const afterTiles = this.page.locator("jar-tile");

    await expect(this.tile).toHaveCount(0);
    await expect(afterTiles).toHaveCount(originalTiles - 1);
  }
}

class JarSide {
  private tile: Locator;
  private jarSide: Side;

  constructor(tile: Locator, side: Side) {
    this.tile = tile;
    this.jarSide = side;
  }

  /** requires setTile to have been called **/
  async setFillLevel(amount: number) {
    this.fillJarSide(amount);
    const liquid = this.getLiquid();

    const actualAmount = await liquid.evaluate((el) => el.style.height);
    expect(actualAmount).toBe(`${amount}%`);
  }

  async setColor(colorIdx: ColorIdx) {
    const newColor = await this.selectColor(colorIdx);

    const liquid = this.getLiquid();
    const categoryLabelElt = this.getCategoryLabel();

    await expect(liquid).toHaveCSS("background-color", newColor);
    await expect(categoryLabelElt).toHaveCSS("color", newColor);
  }

  private getCategoryLabel() {
    const label = labels.at(this.jarSide);
    expect(label).toBeDefined();

    return this.tile.getByText(label!, { exact: true });
  }

  private selectColor(colorIdx: ColorIdx) {
    const colorControls = this.tile.locator("fieldset.color-controls").nth(
      this.jarSide,
    );
    const colorOptElt = colorControls.getByRole("radio").nth(colorIdx);
    colorOptElt.check();
    return colorOptElt.evaluate((el) => el.style.backgroundColor);
  }

  private getLiquid() {
    return this.tile.locator(".liquid").nth(this.jarSide);
  }

  private fillJarSide(amount: number) {
    this.tile.getByRole("slider").nth(this.jarSide).fill(amount.toString());
  }
}
