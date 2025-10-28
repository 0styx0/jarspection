import templateHtml from "bundle-text:./side-label.html";
import { queryElt } from "../../utils";

const selectors = {
  label: ".label",
};
export class SideLabel extends HTMLElement {
  #shadow: ShadowRoot;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
    this.#shadow.innerHTML = templateHtml;
  }

  set color(value: string) {
    const label = queryElt<HTMLDivElement>(this.#shadow, selectors.label);

    if (!label) {
      return;
    }

    label.style.color = value;
  }
}

customElements.define("side-label", SideLabel);
