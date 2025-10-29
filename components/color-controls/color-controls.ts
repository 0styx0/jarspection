import templateHtml from "bundle-text:./color-controls.html";
import { defineCustomElt, queryElt } from "../utils";
import { colors } from "../jarIllustration/jarAttrs";

export class ColorControls extends HTMLElement {
  #colorSplotches = [] as unknown as NodeListOf<HTMLInputElement>;
  #shadow: ShadowRoot;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
    this.#shadow.innerHTML = templateHtml
      .replaceAll("{{coloryes}}", colors.yes)
      .replaceAll("{{colormaybe}}", colors.maybe)
      .replaceAll("{{colorno}}", colors.no);
  }

  connectedCallback() {
    this.getSplotches();
    this.setColors();
  }

  getSplotches() {
    this.#colorSplotches = this.shadowRoot!.querySelectorAll(".color-splotch");
  }

  setColors() {
    this.#colorSplotches.forEach((splotch) => {
      splotch.style.backgroundColor = splotch.value;
    });
  }
}

defineCustomElt("color-controls", ColorControls);
