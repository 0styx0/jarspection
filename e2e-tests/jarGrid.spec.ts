import { test, expect, Locator, Page } from "@playwright/test";
import { JarGridPage } from "./pageModels/JarGridPage";

test("sliders fill jars", async ({ page }) => {
  const jarGridPage = new JarGridPage(page);

  await jarGridPage.visit();
  await jarGridPage.setTile(1);

  await jarGridPage.setFillLevel(0, 100);
  await jarGridPage.setFillLevel(1, 29);
});
