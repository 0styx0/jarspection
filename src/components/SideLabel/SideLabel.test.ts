import { describe, it, expect } from "vitest";
import {
  selectors,
  SideLabel,
  SideLabelProps,
  sideLabelTag,
} from "./SideLabel";
import { defineCustomElt } from "../utils";
import { renderComponent } from "../../test/testUtils";

defineCustomElt(sideLabelTag, SideLabel);

const renderSideLabel = (attrs: Partial<SideLabelProps> = {}) =>
  renderComponent<SideLabel>(sideLabelTag, attrs);

const getLabelElt = (sideLabel: SideLabel) =>
  sideLabel.shadowRoot?.querySelector<HTMLDivElement>(selectors.label);

describe("<side-label>", () => {
  describe("initial render", () => {
    describe("defaults to", () => {
      it("empty label", () => {
        const component = renderSideLabel();
        const label = getLabelElt(component)?.textContent;

        expect(label).toBe("");
      });

      it("empty color", () => {
        const component = renderSideLabel();
        const labelElt = getLabelElt(component);
        expect(labelElt?.style.color).toBe("");
      });
    });

    describe("renders passed-in", () => {
      it("label", () => {
        const expectedLabel = "hello meow";
        const component = renderSideLabel({
          label: expectedLabel,
        });
        const label = getLabelElt(component)?.textContent;

        expect(label).toBe(expectedLabel);
        expect(component.label).toBe(expectedLabel);
      });

      it("color", () => {
        const expectedColor = "#FFFFFF";
        const component = renderSideLabel({ color: "#FFFFFF" });
        const labelElt = getLabelElt(component);
        expect(labelElt?.style.color).toContain("255, 255, 255");
        expect(component.color).toBe(expectedColor);
      });
    });
  });

  describe("updates when attributes change", () => {
    it("updates label text when label attribute changes", () => {
      const component = renderSideLabel();
      const expectedLabel = "Hello";

      component.label = expectedLabel;

      const labelElt = getLabelElt(component);
      expect(labelElt?.textContent).toBe(expectedLabel);
    });

    it("updates label color when color attribute changes", () => {
      const component = renderSideLabel();
      const expectedColor = "red";
      component.color = expectedColor;

      const labelElt = getLabelElt(component);
      expect(labelElt?.style.color).toBe(expectedColor);
    });
  });
});
