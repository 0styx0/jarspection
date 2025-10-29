import templateHtml from "bundle-text:./vertical-range.html";
import {
  defineCustomElt,
  mapPropertiesToAttribute,
  queryElt,
  triggerCustomEvent,
} from "../utils";

export const rangeEvents = {
  rangechange: "rangechange",
};

export interface RangeChangeEvent {
  value: number;
}

const selectors = {
  range: ".vertical-range",
};

export class VerticalRange extends HTMLElement {
  #rangeElt: HTMLInputElement | null = null;
  rangevalue = 0;

  static observedAttributes = ["rangevalue"];
  static mirroredProps = ["rangevalue"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  connectedCallback() {
    mapPropertiesToAttribute(this, VerticalRange.mirroredProps);

    this.#rangeElt = queryElt<HTMLInputElement>(
      this.shadowRoot,
      selectors.range,
    );

    this.addRangeChangeEvent();
  }

  attributeChangedCallback(attr: string, was: number, value: number) {
    if (was === value) return;

    switch (attr) {
      case "rangevalue":
        this.setRangeEltValue(value);
        break;
    }
  }

  setRangeEltValue(value: number) {
    if (!this.#rangeElt) return;

    this.#rangeElt.value = "" + value;
  }

  addRangeChangeEvent() {
    queryElt(this.shadowRoot, selectors.range)?.addEventListener(
      "input",
      this.onRangeChange,
    );
  }

  onRangeChange = (e: Event) => {
    const value = +(e.target as HTMLInputElement).value;
    this.rangevalue = value;

    triggerCustomEvent(this, rangeEvents.rangechange, {
      value,
    });
  };
}

defineCustomElt("vertical-range", VerticalRange);
