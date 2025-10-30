import { describe, it, expect } from "vitest";
import { selectors, SideLabel, sideLabelTag } from "./side-label";
import { defineCustomElt } from "../utils";

defineCustomElt("side-label", SideLabel);

function renderComponent() {
  const sideLabel = document.createElement(sideLabelTag) as SideLabel;
  document.body.appendChild(sideLabel);

  return sideLabel;
}

const getLabelElt = (sideLabel: SideLabel) =>
  sideLabel.shadowRoot?.querySelector<HTMLDivElement>(selectors.label);

describe("<SideLabel>", () => {
  describe("defaults to", () => {
    it("empty label", () => {
      const component = renderComponent();
      const label = getLabelElt(component)?.textContent;

      expect(label).toBe("");
    });

    it("empty color", () => {
      const component = renderComponent();
      const labelElt = getLabelElt(component);
      expect(labelElt?.style.color).toBe("");
    });
  });

  describe("updates when attributes change", () => {
    it("updates label text when label attribute changes", () => {
      const component = renderComponent();
      const expectedLabel = "Hello";

      component.label = expectedLabel;

      const labelElt = getLabelElt(component);
      expect(labelElt?.textContent).toBe(expectedLabel);
    });

    it("updates label color when color attribute changes", () => {
      const component = renderComponent();
      const expectedColor = "red";
      component.color = expectedColor;

      const labelElt = getLabelElt(component);
      expect(labelElt?.style.color).toBe(expectedColor);
    });
  });
});
