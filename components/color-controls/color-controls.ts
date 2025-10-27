import templateHtml from "bundle-text:./color-controls.html";

export type ColorChangeEventHandler = (event: ColorChangeEvent) => void;
export type ColorChangeEvent = CustomEvent<{
  color: string;
}>;

export const colorControlsEmitted = {
  colorchange: "colorchange",
};

const colors = {
  yellow: "#ffdd44",
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
    this.initializeColorSelection();
  }

  getSplotches() {
    this.#colorSplotches = this.shadowRoot!.querySelectorAll(".color-splotch");
  }

  initializeColorSelection() {
    this.#colorSplotches.forEach((splotch) => {
      splotch.addEventListener("click", this.handleColorClick);
    });
  }

  handleColorClick = (e: MouseEvent) => {
    const selectedColor =
      (e.target as HTMLDivElement).getAttribute("data-color") || colors.yellow;

    this.dispatchColorChangeEvent(selectedColor);
  };

  dispatchColorChangeEvent(selectedColor: string) {
    this.dispatchEvent(
      new CustomEvent(colorControlsEmitted.colorchange, {
        detail: { color: selectedColor },
        bubbles: true,
      }) as ColorChangeEvent,
    );
  }
}

customElements.define("color-controls", ColorControls);
