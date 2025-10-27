import templateHtml from "bundle-text:./vertical-range.html";

export class VerticalRange extends HTMLElement {
  #shadow: ShadowRoot;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
    this.#shadow.innerHTML = templateHtml;
  }

  get verticalRangeElt() {
    return this.#shadow.querySelector(".vertical-range");
  }
}

customElements.define("vertical-range", VerticalRange);
