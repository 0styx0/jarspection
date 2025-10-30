import { describe, it, expect } from "vitest";
import { fireEvent } from "@testing-library/dom";
import {
  VerticalRange,
  verticalRangeTag,
  rangeEvents,
  RangeChangeEvent,
} from "./vertical-range";
import { defineCustomElt } from "../utils";

defineCustomElt(verticalRangeTag, VerticalRange);

function renderComponent(rangeValue?: number) {
  const component = document.createElement(verticalRangeTag) as VerticalRange;

  if (rangeValue !== undefined) component.rangevalue = rangeValue;

  document.body.appendChild(component);

  return component;
}

const getRangeElt = (component: VerticalRange) => {
  const range =
    component.shadowRoot?.querySelector<HTMLInputElement>(".vertical-range");

  expect(range).toBeTruthy();

  return range!;
};

describe("<VerticalRange>", () => {
  describe("initial rendering", () => {
    it("renders with passed-in rangevalue", () => {
      const expectedValue = 50;
      const component = renderComponent(expectedValue);
      const range = getRangeElt(component);
      expect(+range.value).toBe(expectedValue);
    });
  });

  describe("user input", () => {
    it("fires rangechange event when range is changed", () => {
      const component = renderComponent();
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
      const component = renderComponent();
      const range = getRangeElt(component);

      const expectedValue = 19;

      fireEvent.input(range, { target: { value: expectedValue } });

      expect(+component.rangevalue).toBe(expectedValue);
      expect(+component.getAttribute("rangevalue")!).toBe(expectedValue);
    });
  });
});
