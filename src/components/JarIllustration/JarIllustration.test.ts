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

defineCustomElt(jarIllustrationTag, JarIllustration);

const renderJarIllustration = (attrs: Partial<JarIllustrationProps> = {}) =>
  renderComponent<JarIllustration>(jarIllustrationTag, attrs);

const getJarSide = (component: JarIllustration, selector: string) => {
  const el = component.shadowRoot?.querySelector<HTMLDivElement>(selector);
  expect(el).toBeTruthy();
  return el!;
};

describe("<jar-illustration>", () => {
  describe("initial render", () => {
    describe("without any attrs passed", () => {
      it("sets liquid to 50%", () => {
        const component = renderJarIllustration();
        const liquidLeft = getJarSide(component, selectors.jarLeft);
        const liquidRight = getJarSide(component, selectors.jarRight);

        expect(liquidLeft.style.height).toBe("50%");
        expect(liquidRight.style.height).toBe("50%");
      });

      it("sets color to yellow", () => {
        const component = renderJarIllustration();
        const liquidLeft = getJarSide(component, selectors.jarLeft);
        const liquidRight = getJarSide(component, selectors.jarRight);

        expect(liquidLeft.style.backgroundColor).toBe("rgb(255, 221, 68)");
        expect(liquidRight.style.backgroundColor).toBe("rgb(255, 221, 68)");
      });
    });

    it("applies initial attributes to liquidLeft and liquidRight", () => {
      const attrs = {
        fillleft: 40,
        fillright: 60,
        colorleft: "#111111",
        colorright: "#222222",
      };

      const component = renderJarIllustration(attrs);
      const liquidLeft = getJarSide(component, selectors.jarLeft);
      const liquidRight = getJarSide(component, selectors.jarRight);

      expect(liquidLeft.style.height).toBe("40%");
      expect(liquidLeft.style.backgroundColor).toBe("rgb(17, 17, 17)");

      expect(liquidRight.style.height).toBe("60%");
      expect(liquidRight.style.backgroundColor).toBe("rgb(34, 34, 34)");
    });
  });

  describe("attribute changes", () => {
    it("updates fillleft", () => {
      const component = renderJarIllustration();
      const liquidLeft = getJarSide(component, selectors.jarLeft);

      const newFillLeft = "75";
      component.setAttribute("fillleft", newFillLeft);

      expect(liquidLeft.style.height).toBe("75%");
      expect(component.fillleft).toBe(newFillLeft);
    });

    it("updates fillright", () => {
      const component = renderJarIllustration();
      const liquidRight = getJarSide(component, selectors.jarRight);

      const newFillRight = "25";
      component.setAttribute("fillright", newFillRight);

      expect(liquidRight.style.height).toBe("25%");
      expect(component.fillright).toBe(newFillRight);
    });

    it("updates colorleft", () => {
      const component = renderJarIllustration();
      const liquidLeft = getJarSide(component, selectors.jarLeft);

      const newColorLeft = "#ff0000";
      component.setAttribute("colorleft", newColorLeft);

      expect(liquidLeft.style.backgroundColor).toBe("rgb(255, 0, 0)");
      expect(component.colorleft).toBe(newColorLeft);
    });

    it("updates colorright", () => {
      const component = renderJarIllustration();
      const liquidRight = getJarSide(component, selectors.jarRight);

      const newColorRight = "#00ff00";
      component.setAttribute("colorright", newColorRight);

      expect(liquidRight.style.backgroundColor).toBe("rgb(0, 255, 0)");
      expect(component.colorright).toBe(newColorRight);
    });
  });
});
