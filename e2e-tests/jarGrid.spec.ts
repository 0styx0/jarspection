import { test, expect, Locator, Page } from "@playwright/test";
import { JarGridPage } from "./pageModels/JarGridPage";

test("basic jar interactions", async ({ page }) => {
  const jarGridPage = new JarGridPage(page);

  await jarGridPage.visit();
  const { leftJar, rightJar } = await jarGridPage.setTile('Acts of Service');

  await leftJar.setFillLevel(100);
  await rightJar.setFillLevel(29);

  await leftJar.setColor(0);
  await rightJar.setColor(2);
  await leftJar.setColor(1);

  await leftJar.setFillLevel(39);
});

test('basic tile-level controls', async ({page}) => {
  
  const jarGridPage = new JarGridPage(page);

  await jarGridPage.visit();
  await jarGridPage.setTile('Quality Time');

  await jarGridPage.deleteTile()
})
