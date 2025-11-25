import { test, expect, Locator, Page } from "@playwright/test";
import { JarGridPage } from "./pageModels/JarGridPage";

test("basic topic-level interactions", async ({ page }) => {
  const jarGridPage = new JarGridPage(page);
  await jarGridPage.visit();

  const { leftJar, rightJar } = await jarGridPage.getTile("Acts of Service");

  await leftJar.setFillLevel(100);
  await rightJar.setFillLevel(29);

  await leftJar.setReaction(0);
  await rightJar.setReaction(2);
  await leftJar.setReaction(1);

  await leftJar.setFillLevel(39);
});

test("basic tile-level controls", async ({ page }) => {
  const jarGridPage = new JarGridPage(page);
  await jarGridPage.visit();

  const { tile } = await jarGridPage.getTile("Quality Time");

  await tile.setLabel("My very own unicorn");
  await tile.remove();
});

test("Adding topic", async ({ page }) => {
  const jarGridPage = new JarGridPage(page);
  await jarGridPage.visit();

  const firstNewTile = await jarGridPage.addTile();
  await firstNewTile.leftJar.setReaction(2);

  await jarGridPage.addTile();
  await firstNewTile.tile.remove();
});
