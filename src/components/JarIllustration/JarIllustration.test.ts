import { describe, it, expect, vi } from "vitest";
import { defineCustomElt } from "../componentUtils";
import {
  JarIllustration,
  JarIllustrationProps,
  jarIllustrationTag,
  selectors,
} from "./JarIllustration";
import { renderComponent, rgbColors } from "../../test/testUtils";
import { defaultJarTileProps } from "../JarTile/JarTile";
import { emotionalReactions } from "../../api";

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

        expect(liquidLeft.style.backgroundColor).toBe(rgbColors.neutral);
        expect(liquidRight.style.backgroundColor).toBe(rgbColors.neutral);
      });
    });

    it("applies initial attributes to liquidLeft and liquidRight", () => {
      const attrs = {
        strengthleft: 40,
        strengthright: 60,
        reactionleft: emotionalReactions.neutral,
        reactionright: emotionalReactions.negative,
      };

      const component = renderJarIllustration(attrs);
      const liquidLeft = getJarSide(component, selectors.jarLeft);
      const liquidRight = getJarSide(component, selectors.jarRight);

      expect(liquidLeft.style.height).toBe("40%");
      expect(liquidLeft.style.backgroundColor).toBe(rgbColors.neutral);

      expect(liquidRight.style.height).toBe("60%");
      expect(liquidRight.style.backgroundColor).toBe(rgbColors.negative);
    });
  });

  describe("attribute changes", () => {
    it("updates strengthleft", () => {
      const component = renderJarIllustration();
      const liquidLeft = getJarSide(component, selectors.jarLeft);

      const newstrengthleft = "75";
      component.setAttribute("strengthleft", newstrengthleft);

      expect(liquidLeft.style.height).toBe("75%");
      expect(component.strengthleft).toBe(newstrengthleft);
    });

    it("updates strengthright", () => {
      const component = renderJarIllustration();
      const liquidRight = getJarSide(component, selectors.jarRight);

      const newstrengthright = "25";
      component.setAttribute("strengthright", newstrengthright);

      expect(liquidRight.style.height).toBe("25%");
      expect(component.strengthright).toBe(newstrengthright);
    });

    it("updates reactionleft", () => {
      const component = renderJarIllustration();
      const liquidLeft = getJarSide(component, selectors.jarLeft);

      const newreactionleft = emotionalReactions.positive
      component.setAttribute("reactionleft", newreactionleft);

      expect(liquidLeft.style.backgroundColor).toBe(rgbColors.positive);
      expect(component.reactionleft).toBe(newreactionleft);
    });

    it("updates reactionright", () => {
      const component = renderJarIllustration();
      const liquidRight = getJarSide(component, selectors.jarRight);

      const newreactionright = emotionalReactions.negative
      component.setAttribute("reactionright", newreactionright);

      expect(liquidRight.style.backgroundColor).toBe(rgbColors.negative);
      expect(component.reactionright).toBe(newreactionright);
    });
  });
});
