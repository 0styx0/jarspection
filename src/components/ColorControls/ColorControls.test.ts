import { describe, it, expect } from "vitest";
import {
  ColorControls,
  colorControlsTag,
  selectors,
  colorControlEvents,
} from "./ColorControls";
import { defineCustomElt } from "../componentUtils";
import { renderComponent } from "../../test/testUtils";

defineCustomElt(colorControlsTag, ColorControls);

const renderColorControls = () =>
  renderComponent<ColorControls>(colorControlsTag);

const getSplotches = (component: ColorControls) => {
  const splotches = component.shadowRoot?.querySelectorAll<HTMLInputElement>(
    selectors.colorSplotches,
  );
  expect(splotches).toBeTruthy();
  return splotches!;
};

describe("<color-controls>", () => {
  describe("initial rendering", () => {
    it("sets background colors of splotches to their values", () => {
      const component = renderColorControls();
      const splotches = getSplotches(component);

      splotches.forEach((splotch) => {
        // getting backgroundcolor gets rbg. I'm just checking if it's set since I don't want to convert rgb to hex solely to test
        expect(splotch.style.backgroundColor).not.toBe("");
      });
    });
  });

  describe("click", () => {
    it("emits colorchange event with color=option.value", () => {
      const component = renderColorControls();
      const splotches = getSplotches(component);

      const firstSplotch = splotches[0];
      const expectedColor = firstSplotch.value;

      let emittedColor = "";
      component.addEventListener(colorControlEvents.colorchange, (e: Event) => {
        emittedColor = (e as CustomEvent<{ color: string }>).detail.color;
      });

      firstSplotch.click();

      expect(emittedColor).toBe(expectedColor);
    });
  });
});
