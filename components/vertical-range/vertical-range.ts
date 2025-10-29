import templateHtml from "bundle-text:./vertical-range.html";
import { defineCustomElt, queryElt } from "../utils";

export class VerticalRange extends HTMLElement {
  #shadow: ShadowRoot;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
    this.#shadow.innerHTML = templateHtml;
  }

  getVerticalRangeElt() {
    return queryElt<HTMLInputElement>(this.#shadow, ".vertical-range");
  }

  set value(val: string) {
    const rangeElt = this.getVerticalRangeElt();
    if (!rangeElt) {
      return;
    }
    rangeElt.value = val;
  }
}

defineCustomElt("vertical-range", VerticalRange);
