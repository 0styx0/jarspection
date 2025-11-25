import { expect, type Locator, type Page } from "@playwright/test";

type Side = 0 | 1;
type ReactionIdx = 0 | 1 | 2;

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

    return this.constructHelperClasses(tileElt);
  }

  async addTile() {

    const originalTiles = await this.page.locator("jar-tile").count();
    await this.page.getByRole("button", { name: "+" }).click();
    const afterTiles = this.page.locator("jar-tile");

    const newTile = this.page.getByRole("region", { name: "New Topic" }).last();
    await expect(newTile).toBeVisible();
    await expect(afterTiles).toHaveCount(originalTiles + 1);

    return this.constructHelperClasses(newTile);
  }

  private constructHelperClasses(tileElt: Locator) {
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
    await expect(this.tile).toBeVisible();
  }

  async remove() {

    const originalTiles = await this.page.locator("jar-tile").count();

    this.tile.getByLabel("Delete jar").click();
    const afterTiles = this.page.locator("jar-tile");

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

  async setReaction(reactionIdx: ReactionIdx) {
    const newReaction = await this.selectReaction(reactionIdx);

    const liquid = this.getLiquid();
    const categoryLabelElt = this.getCategoryLabel();

    await expect(liquid).toHaveCSS("background-color", newReaction);
    await expect(categoryLabelElt).toHaveCSS("color", newReaction);
  }

  private getCategoryLabel() {
    const label = labels.at(this.jarSide);
    expect(label).toBeDefined();

    return this.tile.getByText(label!, { exact: true });
  }

  private selectReaction(reactionIdx: ReactionIdx) {
    const reactionControl = this.tile
      .locator("reaction-picker")
      .nth(this.jarSide);
    const reactionInputElt = reactionControl.locator("input").nth(reactionIdx);
    reactionInputElt.check();
    return reactionInputElt.evaluate((el) => el.style.backgroundColor);
  }

  private getLiquid() {
    return this.tile.locator(".liquid").nth(this.jarSide);
  }

  private fillJarSide(amount: number) {
    this.tile.getByRole("slider").nth(this.jarSide).fill(amount.toString());
  }
}
