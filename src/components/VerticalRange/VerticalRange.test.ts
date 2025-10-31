import { describe, it, expect } from "vitest";
import { fireEvent } from "@testing-library/dom";
import {
  VerticalRange,
  verticalRangeTag,
  rangeEvents,
  RangeChangeEvent,
  selectors,
  VerticalRangeProps,
} from "./VerticalRange";
import { defineCustomElt } from "../utils";
import { renderComponent } from "../../test/testUtils";

defineCustomElt(verticalRangeTag, VerticalRange);

const renderVerticalRange = (attrs: Partial<VerticalRangeProps> = {}) =>
  renderComponent<VerticalRange>(verticalRangeTag, attrs);

const getRangeElt = (component: VerticalRange) => {
  const range = component.shadowRoot?.querySelector<HTMLInputElement>(
    selectors.range,
  );

  expect(range).toBeTruthy();

  return range!;
};

describe("<vertical-range>", () => {
  describe("initial rendering", () => {
    it("renders with passed-in rangevalue", () => {
      const expectedValue = 50;
      const component = renderVerticalRange({ rangevalue: expectedValue });
      const range = getRangeElt(component);
      expect(+range.value).toBe(expectedValue);
    });
  });

  describe("user input", () => {
    it("fires rangechange event when range is changed", () => {
      const component = renderVerticalRange();
      const range = getRangeElt(component);

      const expectedValue = 30;
      let emittedValue = -1;

      component.addEventListener(rangeEvents.rangechange, (e: Event) => {
        emittedValue = (e as CustomEvent<RangeChangeEvent>).detail.value;
      });

      fireEvent.input(range, { target: { value: expectedValue } });

      expect(emittedValue).toBe(expectedValue);
    });

    it("updates rangevalue attr when range is changed", () => {
      const component = renderVerticalRange();
      const range = getRangeElt(component);

      const expectedValue = 19;

      fireEvent.input(range, { target: { value: expectedValue } });

      expect(+component.rangevalue).toBe(expectedValue);
      expect(+component.getAttribute("rangevalue")!).toBe(expectedValue);
    });
  });
});
