import { describe, it, expect, vi } from "vitest";
import { defineCustomElt } from "../utils";
import { paintJar } from "./jarCanvasUtils";
import {
  JarIllustration,
  jarIllustrationTag,
  selectors,
} from "./JarIllustration";
import { defaultJarAttrs } from "./jarAttrs";

vi.mock("./jarCanvasUtils.ts", () => ({
  paintJar: vi.fn(),
}));

defineCustomElt(jarIllustrationTag, JarIllustration);

function renderComponent(
  attrs?: Partial<{
    fillleft: number;
    fillright: number;
    colorleft: string;
    colorright: string;
  }>,
) {
  const component = document.createElement(
    jarIllustrationTag,
  ) as JarIllustration;

  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      component.setAttribute(k, String(v));
    }
  }

  document.body.appendChild(component);
  return component;
}

const getCanvas = (component: JarIllustration) => {
  const canvas = component.shadowRoot?.querySelector<HTMLCanvasElement>(
    selectors.jarCanvas,
  );
  expect(canvas).toBeTruthy();
  return canvas!;
};

describe("<jar-illustration>", () => {
  describe("initial render", () => {
    it("calls paintJar on initial render with default attributes", () => {
      vi.clearAllMocks();
      const component = renderComponent();
      const canvas = getCanvas(component);

      expect(paintJar).toHaveBeenCalledTimes(1);
      expect(paintJar).toHaveBeenLastCalledWith(
        canvas,
        defaultJarAttrs.fillleft,
        defaultJarAttrs.colorleft,
        defaultJarAttrs.fillright,
        defaultJarAttrs.colorright,
      );
    });

    it("calls paintJar on initial render with passed-in attributes", () => {
      vi.clearAllMocks();
      const attrs = {
        fillleft: 40,
        fillright: 60,
        colorleft: "#111111",
        colorright: "#222222",
      };
      const component = renderComponent(attrs);
      const canvas = getCanvas(component);

      // initial render + each updated attribute
      expect(paintJar).toHaveBeenCalledTimes(5);
      expect(paintJar).toHaveBeenLastCalledWith(
        canvas,
        attrs.fillleft,
        attrs.colorleft,
        attrs.fillright,
        attrs.colorright,
      );
    });
  });

  describe("attribute changes", () => {
    it("calls paintJar and updates fillleft", () => {
      vi.clearAllMocks();
      const component = renderComponent();
      const canvas = getCanvas(component);

      const newFillLeft = "75";
      component.setAttribute("fillleft", newFillLeft);

      expect(paintJar).toHaveBeenCalledTimes(2);
      expect(paintJar).toHaveBeenLastCalledWith(
        canvas,
        +newFillLeft,
        defaultJarAttrs.colorleft,
        +defaultJarAttrs.fillright,
        defaultJarAttrs.colorright,
      );
      expect(component.fillleft).toBe(newFillLeft);
    });

    it("calls paintJar and updates fillright", () => {
      vi.clearAllMocks();
      const component = renderComponent();
      const canvas = getCanvas(component);

      const newFillRight = "25";
      component.setAttribute("fillright", newFillRight);

      expect(paintJar).toHaveBeenCalledTimes(2);
      expect(paintJar).toHaveBeenLastCalledWith(
        canvas,
        +defaultJarAttrs.fillleft,
        defaultJarAttrs.colorleft,
        +newFillRight,
        defaultJarAttrs.colorright,
      );
      expect(component.fillright).toBe(newFillRight);
    });

    it("calls paintJar and updates colorleft", () => {
      vi.clearAllMocks();
      const component = renderComponent();
      const canvas = getCanvas(component);

      const newColorLeft = "#ff0000";
      component.setAttribute("colorleft", newColorLeft);

      expect(paintJar).toHaveBeenCalledTimes(2);
      expect(paintJar).toHaveBeenLastCalledWith(
        canvas,
        component.fillleft,
        newColorLeft,
        component.fillright,
        component.colorright,
      );
      expect(component.colorleft).toBe(newColorLeft);
    });

    it("calls paintJar and updates colorright", () => {
      vi.clearAllMocks();
      const component = renderComponent();
      const canvas = getCanvas(component);

      const newColorRight = "#00ff00";
      component.setAttribute("colorright", newColorRight);

      expect(paintJar).toHaveBeenCalledTimes(2);
      expect(paintJar).toHaveBeenLastCalledWith(
        canvas,
        component.fillleft,
        component.colorleft,
        component.fillright,
        newColorRight,
      );
      expect(component.colorright).toBe(newColorRight);
    });
  });
});
