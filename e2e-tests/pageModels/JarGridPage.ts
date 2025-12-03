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

  async appendTile() {
    const originalTiles = await this.page.locator("jar-tile").count();
    await this.page.getByRole("button", { name: "+" }).click();
    const afterTiles = this.page.locator("jar-tile");

    const newTile = this.page.getByRole("region", { name: "New Topic" }).last();
    await expect(newTile).toBeVisible();
    await expect(afterTiles).toHaveCount(originalTiles + 1);

    return this.constructHelperClasses(newTile);
  }

  async exportSettings() {
    this.page.on("download", (download) => {
      download.path().then(console.log).catch(console.error);
    });
    // Start waiting for download before clicking. Note no await.
    const downloadPromise = this.page.waitForEvent("download");
    await this.page.getByRole("button", { name: "Download save file" }).click();

    const download = await downloadPromise;

    const downloadFileName = download.suggestedFilename();

    await download.saveAs(downloadFileName);

    return downloadFileName;
  }

  async importSettings(importFileName: string) {
    await this.page
      .getByRole("button", { name: "Load save file", exact: true })
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
  tileElt: Locator;

  constructor(page: Page, tile: Locator) {
    this.page = page;
    this.tileElt = tile;
  }

  getJarSides() {
    return {
      leftJar: new JarSide(this.tileElt, 0),
      rightJar: new JarSide(this.tileElt, 1),
    };
  }

  getLabel() {
    return this.tileElt.getByLabel("Jar name");
  }

  async typeLabel(label: string) {
    const labelElt = this.getLabel();
    await labelElt.fill(label);

    this.tileElt = this.page.getByRole("region", { name: label });
    await expect(this.tileElt).toBeVisible();
  }

  /**
   * adds tile via keyboard shortcut
   */
  async addAdjacentTileKb() {
    await this.getLabel().focus();

    const originalTiles = await this.page.locator("jar-tile").count();
    await this.tileElt.press("Meta+N");
    const afterTiles = this.page.locator("jar-tile");
    await expect(afterTiles).toHaveCount(originalTiles + 1);

    const nextTileLocator = this.page
      .locator("jar-tile")
      .filter({
        has: this.tileElt,
      })
      .locator("+ jar-tile");

    await expect(nextTileLocator).toBeFocused();
    const nextTile = new Tile(this.page, nextTileLocator);
    await nextTile.typeLabel("hello me");
    await expect(nextTile.getLabel()).toHaveValue("hello me");
  }

  async removeKb() {
    await this.getLabel().focus();

    const originalTiles = await this.page.locator("jar-tile").count();

    const prevLabelVal = await this.getPrevTileLabel();

    await this.tileElt.press("Meta+W");

    const afterTiles = this.page.locator("jar-tile");
    await expect(afterTiles).toHaveCount(originalTiles - 1);
    expect(this.tileElt).not.toBeVisible();

    const prevTile = await this.getTile(prevLabelVal);
    await expect(prevTile.getLabel()).toBeFocused();
  }

  async removeMouse() {
    const originalTiles = await this.page.locator("jar-tile").count();
    const prevLabelVal = await this.getPrevTileLabel();

    this.tileElt.getByLabel("Delete jar").click();
    const afterTiles = this.page.locator("jar-tile");

    await expect(afterTiles).toHaveCount(originalTiles - 1);

    const prevTile = await this.getTile(prevLabelVal);
    await expect(prevTile.getLabel()).not.toBeFocused();
  }

  /**
   * Allows getting prev label after current selector fails due to removal
   */
  private getPrevTileLabel() {
    // setup to get prev input after current is deleted
    const prevTileLocator = this.page
      .locator("jar-tile")
      .filter({
        has: this.tileElt,
      })
      .locator("//preceding-sibling::jar-tile[1]")
      .last();
    return new Tile(this.page, prevTileLocator).getLabel().inputValue();
  }

  private async getTile(label: string) {
    const { tile } = await new JarGridPage(this.page).getTile(label);

    return tile;
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
