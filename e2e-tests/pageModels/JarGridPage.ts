import { expect, type Locator, type Page } from "@playwright/test";

type JarSide = 0 | 1;
type ColorIdx = 0 | 1 | 2;

export class JarGridPage {
  readonly page: Page;
  private tile?: Locator;

  constructor(page: Page) {
    this.page = page;
  }

  visit() {
    return this.page.goto("/");
  }

  async setTile(n: number) {
    this.tile = this.page.locator("jar-tile").nth(n);
    await expect(this.tile).toBeVisible();
  }

  /** requires setTile to have been called **/
  async setFillLevel(jarSide: JarSide, amount: number) {
    this.fillJarSide(jarSide, amount);
    const liquid = this.getLiquid(jarSide);

    const actualAmount = await liquid.evaluate((el) => el.style.height);
    expect(actualAmount).toBe(`${amount}%`);
  }

  async setColor(jarSide: JarSide, colorIdx: ColorIdx) {
    this.tile!.getByRole("radio").nth(colorIdx).check();
    const liquid = this.getLiquid(jarSide);

    await expect(liquid).toHaveCSS("background-color", "rgb(255, 221, 68)");
  }

  private getLiquid(jarSide: JarSide) {
    return this.tile!.locator(".liquid").nth(jarSide);
  }

  private fillJarSide(jarSide: JarSide, amount: number) {
    this.tile!.getByRole("slider").nth(jarSide).fill(amount.toString());
  }
}
