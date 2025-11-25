import { expect, type Locator, type Page } from "@playwright/test";

type Side = 0 | 1;
export type Reaction = "positive" | "neutral" | "negative";

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

  async exportSettings() {
    console.log("exporting");
    this.page.on("download", (download) => {
      download.path().then(console.log).catch(console.error);
    });
    // Start waiting for download before clicking. Note no await.
    const downloadPromise = this.page.waitForEvent("download");
    await this.page.getByRole("button", { name: "Export Preferences" }).click();

    const download = await downloadPromise;

    const downloadFileName = download.suggestedFilename();

    await download.saveAs(downloadFileName);

    return downloadFileName;
  }

  async importSettings(importFileName: string) {
    await this.page
      .getByRole("button", { name: "Import Preferences:" })
      .setInputFiles(importFileName);
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

  getLabel() {
    return this.tile.getByLabel("Jar name");
  }

  async setLabel(label: string) {
    const labelElt = this.getLabel();
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

  getStrengthElt() {
    return this.tile
      .getByRole("slider", { name: "Jar fill level" })
      .nth(this.jarSide);
  }

  getReactionControl(reaction: Reaction) {
    return this.getReactionControlPanel().locator(
      `input[type="radio"][value="${reaction}"]`,
    );
  }

  async setStrength(strength: number) {
    this.setStrengthElt(strength);

    const actualStrength = await this.getIllustrationLevel();
    expect(actualStrength).toBe(`${strength}%`);
  }

  private getIllustrationLevel() {
    const illustration = this.getIllustration();

    return illustration.evaluate((el) => el.style.height);
  }

  async setReaction(reaction: Reaction) {
    const newReaction = await this.selectReaction(reaction);

    const illustration = this.getIllustration();
    const categoryLabelElt = this.getTopicName();

    await expect(illustration).toHaveCSS("background-color", newReaction);
    await expect(categoryLabelElt).toHaveCSS("color", newReaction);
  }

  private getTopicName() {
    const label = labels.at(this.jarSide);
    expect(label).toBeDefined();

    return this.tile.getByText(label!, { exact: true });
  }

  private async selectReaction(reaction: Reaction) {
    const reactionControl = this.getReactionControl(reaction);
    await reactionControl.check();
    return reactionControl.evaluate((el) => el.style.backgroundColor);
  }

  private getIllustration() {
    return this.tile.locator(".liquid").nth(this.jarSide);
  }

  private getReactionControlPanel() {
    return this.tile.locator("reaction-picker").nth(this.jarSide);
  }

  private setStrengthElt(amount: number) {
    this.getStrengthElt().fill(amount.toString());
  }
}
