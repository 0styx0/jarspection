import { test, expect, Locator, Page } from "@playwright/test";
import { JarGridPage, Reaction } from "./pageModels/JarGridPage";

test("basic topic-level interactions", async ({ page }) => {
  const jarGridPage = new JarGridPage(page);
  await jarGridPage.visit();

  const { leftJar, rightJar } = await jarGridPage.getTile("Acts of Service");

  await leftJar.setStrength(100);
  await rightJar.setStrength(29);

  await leftJar.setReaction("positive");
  await rightJar.setReaction("negative");
  await leftJar.setReaction("neutral");

  await leftJar.setStrength(39);
});

test("basic tile-level controls", async ({ page }) => {
  const jarGridPage = new JarGridPage(page);
  await jarGridPage.visit();

  const { tile } = await jarGridPage.getTile("Quality Time");

  await tile.typeLabel("My very own unicorn");
  await tile.remove();
});

test("Adding topic", async ({ page }) => {
  const jarGridPage = new JarGridPage(page);
  await jarGridPage.visit();

  const firstNewTile = await jarGridPage.appendTile();
  await firstNewTile.leftJar.setReaction("positive");

  await jarGridPage.appendTile();
  await firstNewTile.tile.remove();
});

test("exporting/importing results in original page", async ({ page }) => {
  const jarGridPage = new JarGridPage(page);
  await jarGridPage.visit();

  const newTileData = {
    label: "unicorns r us",
    left: {
      reaction: "negative" as Reaction,
      strength: 25,
    },
    right: {
      reaction: "positive" as Reaction,
      strength: 75,
    },
  };

  const newTile = await jarGridPage.appendTile();
  await newTile.rightJar.setReaction(newTileData.right.reaction);
  await newTile.leftJar.setReaction(newTileData.left.reaction);
  await newTile.leftJar.setStrength(newTileData.left.strength);
  await newTile.rightJar.setStrength(newTileData.right.strength);
  await newTile.tile.typeLabel(newTileData.label);

  const exportFileName = await jarGridPage.exportSettings();
  await jarGridPage.page.reload();

  await jarGridPage.importSettings(exportFileName);

  const importedTile = await jarGridPage.getTile(newTileData.label);

  await Promise.all([
    expect(importedTile.tile.getLabel()).toHaveValue(newTileData.label),
    expect(
      importedTile.rightJar.getReactionControl(newTileData.right.reaction),
    ).toBeChecked(),
    expect(
      importedTile.leftJar.getReactionControl(newTileData.left.reaction),
    ).toBeChecked(),
    expect(importedTile.rightJar.getStrengthElt()).toHaveValue(
      newTileData.right.strength.toString(),
    ),
    expect(importedTile.leftJar.getStrengthElt()).toHaveValue(
      newTileData.left.strength.toString(),
    ),
  ]);
});

test("keyboard shortcuts", async ({ page }) => {
  const jarGridPage = new JarGridPage(page);
  await jarGridPage.visit();

  const { tile } = await jarGridPage.getTile("Acts of Service");

  await tile.addAdjacentTileKb()
  await tile.removeKb()
});
