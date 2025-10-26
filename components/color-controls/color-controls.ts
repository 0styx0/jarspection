import templateHtml from "bundle-text:./color-controls.html";

export type ColorChangeEventHandler = (event: ColorChangeEvent) => void;
type ColorChangeEvent = CustomEvent<{
  color: string;
}>;

export const colorControlsEmitted = {
  colorchange: "colorchange",
};

const colors = {
  yellow: "#ffdd44",
};

export class ColorControls extends HTMLElement {
  static readonly defaultColor = colors.yellow;
  #colorSplotches = [] as unknown as NodeListOf<HTMLDivElement>;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot!.innerHTML = templateHtml;
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
        composed: true,
      }) as ColorChangeEvent,
    );
  }
}

customElements.define("color-controls", ColorControls);
