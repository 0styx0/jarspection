import templateHtml from "bundle-text:./fillable-jar.html";
import {
  ColorChangeEvent,
  ColorControls,
  colorControlsEmitted,
} from "../color-controls/color-controls";
import { drawJar as paintJar } from "./jar-canvas-utils";

const colors = {
  yellow: "#ffdd44",
};
export class FillableJar extends HTMLElement {
  #shadow: ShadowRoot;

  #fillLeft = 50;
  #fillRight = 50;

  #colorLeft = colors.yellow;
  #colorRight = colors.yellow;

  static observedAttributes = ["label"];

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
    this.#shadow.innerHTML = templateHtml;
  }

  connectedCallback() {
    this.setupEventListeners();
    this.drawJar();
  }

  getLabelElt = () =>
    this.#shadow.querySelector<HTMLTextAreaElement>(".label-input");

  get label() {
    return this.getLabelElt()?.value;
  }

  set label(value) {
    const labelElt = this.getLabelElt();

    if (!labelElt) {
      console.log("Unable to find label", labelElt);
      return;
    }

    labelElt.value = value || "";
  }

  attributeChangedCallback(attr: string, was: string, value: string) {
    switch (attr) {
      case "label":
        this.label = value;
        break;
    }
  }

  handleColorChanges = () => {
    const addColorChangeEvent = (
      eltId: string,
      handler: (color: string) => void,
    ) =>
      this.#shadow!.querySelector(eltId)!.addEventListener(
        colorControlsEmitted.colorchange,
        (e: ColorChangeEvent) => {
          handler(e.detail.color);
          this.drawJar();
        },
      );

    addColorChangeEvent("#colors-giving", (color) => (this.#colorLeft = color));

    addColorChangeEvent(
      "#colors-receiving",
      (color) => (this.#colorRight = color),
    );
  };

  handleFillChanges = () => {
    const addFillChangeEvent = (
      eltId: string,
      handler: (rangeValue: number) => void,
    ) =>
      this.#shadow
        .querySelector(eltId)!
        .addEventListener("input", (e: Event) => {
          handler(e.originalTarget?.value);
          this.drawJar();
        });

    addFillChangeEvent(
      "#range-left",
      (rangeValue) => (this.#fillLeft = rangeValue),
    );

    addFillChangeEvent(
      "#range-right",
      (rangeValue) => (this.#fillRight = rangeValue),
    );
  };

  setupEventListeners() {
    const removeBtn = this.#shadow.querySelector(".remove-btn")!;
    removeBtn.addEventListener("click", () => this.remove());

    this.handleColorChanges();
    this.handleFillChanges();
  }

  drawJar() {
    const canvas = this.#shadow.querySelector("canvas");

    if (!canvas) {
      console.log("Canvas not found");
      return;
    }
    paintJar(
      canvas,
      this.#fillLeft,
      this.#colorLeft,
      this.#fillRight,
      this.#colorRight,
    );
  }
}

customElements.define("fillable-jar", FillableJar);
