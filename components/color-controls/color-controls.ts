import templateHtml from "bundle-text:./color-controls.html";
import { defineCustomElt, queryElt } from "../utils";
import { colors } from "../jarIllustration/jarAttrs";

export const colorControlEvents = {
  colorchange: "colorchange",
};

export interface ColorChangeEvent {
  color: string;
}

const selectors = {
  colorControls: ".color-controls",
  colorSplotches: ".color-splotch",
};

export class ColorControls extends HTMLElement {
  #colorSplotches = [] as unknown as NodeListOf<HTMLInputElement>;

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = templateHtml
      .replaceAll("{{coloryes}}", colors.yes)
      .replaceAll("{{colormaybe}}", colors.maybe)
      .replaceAll("{{colorno}}", colors.no);
  }

  connectedCallback() {
    this.getSplotches();
    this.setColors();
    this.addSplotchChangeEvent();
  }

  getSplotches() {
    this.#colorSplotches = this.shadowRoot!.querySelectorAll(
      selectors.colorSplotches,
    );
  }

  setColors() {
    this.#colorSplotches.forEach((splotch) => {
      // allows consistent use of hex-formatted colors
      splotch.style.backgroundColor = splotch.value;
    });
  }

  addSplotchChangeEvent() {
    queryElt(this.shadowRoot, selectors.colorControls)?.addEventListener(
      "change",
      this.onSplotchChange,
    );
  }

  onSplotchChange = (e: Event) => {
    const selectedColor = (e.target as HTMLInputElement).value;
    this.triggerColorChangeEvent(selectedColor);
  };

  triggerColorChangeEvent(selectedColor: string) {
    const customEvent = new CustomEvent<ColorChangeEvent>(
      colorControlEvents.colorchange,
      {
        bubbles: true,
        composed: true,
        detail: {
          color: selectedColor,
        },
      },
    );
    this.dispatchEvent(customEvent);
  }
}

defineCustomElt("color-controls", ColorControls);
