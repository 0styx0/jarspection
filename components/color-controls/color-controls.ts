import templateHtml from "bundle-text:./color-controls.html";
import { defineCustomElt, queryElt } from "../utils";

export type ColorChangeEventHandler = (event: ColorChangeEvent) => void;
export type ColorChangeEvent = CustomEvent<{
  // in the form "rgb(68, 255, 68)"
  color: string;
}>;

export const colorControlsEmitted = {
  colorchange: "colorchange",
};

export class ColorControls extends HTMLElement {
  #colorSplotches = [] as unknown as NodeListOf<HTMLDivElement>;
  #shadow: ShadowRoot;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
    this.#shadow.innerHTML = templateHtml;
  }

  connectedCallback() {
    this.getSplotches();
    this.addClickHandlers();

    this.sendDefaultColor();
  }

  getSplotches() {
    this.#colorSplotches = this.shadowRoot!.querySelectorAll(".color-splotch");
  }

  sendDefaultColor() {
    requestAnimationFrame(() => {
      const defaultColorElt = queryElt<HTMLDivElement>(
        this.#shadow,
        "[data-default]",
      )!;
      this.dispatchColorChangeEvent(defaultColorElt);
    });
  }

  addClickHandlers() {
    this.#colorSplotches.forEach((splotch) => {
      splotch.addEventListener("click", this.handleColorClick);
    });
  }

  handleColorClick = (e: MouseEvent) => {
    const elt = e.target as HTMLDivElement;
    this.dispatchColorChangeEvent(elt);
  };

  dispatchColorChangeEvent(colorElt: HTMLDivElement) {
    const selectedColor = getComputedStyle(colorElt).backgroundColor;

    this.dispatchEvent(
      new CustomEvent(colorControlsEmitted.colorchange, {
        detail: { color: selectedColor },
        bubbles: true,
      }) as ColorChangeEvent,
    );
  }
}

defineCustomElt("color-controls", ColorControls);
