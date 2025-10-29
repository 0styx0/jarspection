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
  rangevalue = 0;

  static observedAttributes = ["rangevalue"];
  static mirroredProps = ["rangevalue"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  connectedCallback() {
    mapPropertiesToAttribute(this, VerticalRange.mirroredProps);

    this.addRangeChangeEvent();
  }

  attributeChangedCallback(attr: string, was: number, value: number) {
    if (was === value) return;

    switch (attr) {
      case "rangevalue":
        this.updateRange(value);
        break;
    }
  }

  private getRangeElt() {
    return queryElt<HTMLInputElement>(this.shadowRoot, selectors.range);
  }

  private setRangeEltValue(value: number) {
    const rangeElt = this.getRangeElt();
    if (!rangeElt) return;

    rangeElt.value = "" + value;
  }

  private addRangeChangeEvent() {
    queryElt(this.shadowRoot, selectors.range)?.addEventListener(
      "input",
      this.onRangeChange,
    );
  }

  private onRangeChange = (e: Event) => {
    const value = +(e.target as HTMLInputElement).value;
    this.rangevalue = value;
    this.updateRange(value);
  };

  private updateRange(value: number) {
    this.setRangeEltValue(value);

    triggerCustomEvent(this, rangeEvents.rangechange, {
      value,
    });
  }
}

defineCustomElt("vertical-range", VerticalRange);
