import templateHtml from "bundle-text:./side-label.html";
import { defineCustomElt, queryElt } from "../utils";

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

  getLabel() {
    return queryElt<HTMLDivElement>(this.#shadow, selectors.label);
  }

  set color(value: string) {
    const label = this.getLabel();
    if (!label) {
      return;
    }

    label.style.color = value;
  }

  set label(value: string) {
    const label = this.getLabel();
    if (!label) {
      return;
    }

    label.innerText = value;
  }
}

defineCustomElt("side-label", SideLabel);
