import { describe, it, expect, vi } from "vitest";
import { defineCustomElt } from "../utils";
import {
  JarIllustration,
  JarIllustrationProps,
  jarIllustrationTag,
  selectors,
} from "./JarIllustration";
import { renderComponent } from "../../test/testUtils";
import { defaultJarTileProps } from "../JarTile/JarTile";
import { paintLeftJar, paintRightJar } from "./jarCanvasUtils";

vi.mock("./jarCanvasUtils.ts", () => ({
  paintLeftJar: vi.fn(),
  paintRightJar: vi.fn(),
}));

defineCustomElt(jarIllustrationTag, JarIllustration);

const renderJarIllustration = (attrs: Partial<JarIllustrationProps> = {}) =>
  renderComponent<JarIllustration>(jarIllustrationTag, attrs);

const getJarCanvas = (component: JarIllustration, selector: string) => {
  const canvas =
    component.shadowRoot?.querySelector<HTMLCanvasElement>(selector);
  expect(canvas).toBeTruthy();
  return canvas!;
};

describe("<jar-illustration>", () => {
  describe("initial render", () => {
    it("calls paintLeftJar and paintRightJar on initial render with default attributes", () => {
      vi.clearAllMocks();
      const component = renderJarIllustration();
      const canvasLeft = getJarCanvas(component, selectors.jarLeft);
      const canvasRight = getJarCanvas(component, selectors.jarRight);

      expect(paintLeftJar).toHaveBeenCalledTimes(1);
      expect(paintRightJar).toHaveBeenCalledTimes(1);
      expect(paintLeftJar).toHaveBeenLastCalledWith(
        canvasLeft,
        defaultJarTileProps.categories[0].percent,
        defaultJarTileProps.categories[0].hexColor,
      );
      expect(paintRightJar).toHaveBeenLastCalledWith(
        canvasRight,
        defaultJarTileProps.categories[1].percent,
        defaultJarTileProps.categories[1].hexColor,
      );
    });

    it("calls paintLeftJar and paintRightJar on initial render with passed-in attributes", () => {
      vi.clearAllMocks();
      const attrs = {
        fillleft: 40,
        fillright: 60,
        colorleft: "#111111",
        colorright: "#222222",
      };
      const component = renderJarIllustration(attrs);
      const canvasLeft = getJarCanvas(component, selectors.jarLeft);
      const canvasRight = getJarCanvas(component, selectors.jarRight);

      // initial render + each updated attribute
      expect(paintLeftJar).toHaveBeenCalledTimes(5);
      expect(paintRightJar).toHaveBeenCalledTimes(5);
      expect(paintLeftJar).toHaveBeenLastCalledWith(
        canvasLeft,
        attrs.fillleft,
        attrs.colorleft,
      );
      expect(paintRightJar).toHaveBeenLastCalledWith(
        canvasRight,
        attrs.fillright,
        attrs.colorright,
      );
    });
  });

  describe("attribute changes", () => {
    it("calls paintLeftJar and updates fillleft", () => {
      vi.clearAllMocks();
      const component = renderJarIllustration();
      const canvasLeft = getJarCanvas(component, selectors.jarLeft);

      const newFillLeft = "75";
      component.setAttribute("fillleft", newFillLeft);

      expect(paintLeftJar).toHaveBeenCalledTimes(2);
      expect(paintLeftJar).toHaveBeenLastCalledWith(
        canvasLeft,
        +newFillLeft,
        defaultJarTileProps.categories[0].hexColor,
      );
      expect(component.fillleft).toBe(newFillLeft);
    });

    it("calls paintRightJar and updates fillright", () => {
      vi.clearAllMocks();
      const component = renderJarIllustration();
      const canvasRight = getJarCanvas(component, selectors.jarRight);

      const newFillRight = "25";
      component.setAttribute("fillright", newFillRight);

      expect(paintRightJar).toHaveBeenCalledTimes(2);
      expect(paintRightJar).toHaveBeenLastCalledWith(
        canvasRight,
        +newFillRight,
        defaultJarTileProps.categories[1].hexColor,
      );
      expect(component.fillright).toBe(newFillRight);
    });

    it("calls paintLeftJar and updates colorleft", () => {
      vi.clearAllMocks();
      const component = renderJarIllustration();
      const canvasLeft = getJarCanvas(component, selectors.jarLeft);

      const newColorLeft = "#ff0000";
      component.setAttribute("colorleft", newColorLeft);

      expect(paintLeftJar).toHaveBeenCalledTimes(2);
      expect(paintLeftJar).toHaveBeenLastCalledWith(
        canvasLeft,
        component.fillleft,
        newColorLeft,
      );
      expect(component.colorleft).toBe(newColorLeft);
    });

    it("calls paintRightJar and updates colorright", () => {
      vi.clearAllMocks();
      const component = renderJarIllustration();
      const canvasRight = getJarCanvas(component, selectors.jarRight);

      const newColorRight = "#00ff00";
      component.setAttribute("colorright", newColorRight);

      expect(paintRightJar).toHaveBeenCalledTimes(2);
      expect(paintRightJar).toHaveBeenLastCalledWith(
        canvasRight,
        component.fillright,
        newColorRight,
      );
      expect(component.colorright).toBe(newColorRight);
    });
  });
});
