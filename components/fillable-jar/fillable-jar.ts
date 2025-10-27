import templateHtml from "bundle-text:./fillable-jar.html";
import {
  ColorChangeEvent,
  ColorChangeEventHandler,
  colorControlsEmitted,
} from "../color-controls/color-controls";
import { paintJar } from "./jar-canvas-utils";
import { queryElt } from "../../utils";
import { CustomElement } from "../base-component/base-component";

const colors = {
  yellow: "#ffdd44",
};

export class FillableJar extends CustomElement {
  #shadow: ShadowRoot;

  fillleft = 50;
  fillright = 50;

  colorleft = colors.yellow;
  colorright = colors.yellow;

  static observedAttributes = [
    "label",
    "fillleft",
    "fillright",
    "colorleft",
    "colorright",
  ];

  static mirroredProps = ["fillleft", "fillright", "colorleft", "colorright"];

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
    queryElt<HTMLTextAreaElement>(this.#shadow, ".label-input");

  get label() {
    return this.getLabelElt()?.value;
  }

  set label(value) {
    const labelElt = this.getLabelElt();

    if (!labelElt) {
      return;
    }

    labelElt.value = value || "";
  }

  attributeChangedCallback(attr: string, was: string, value: string) {
    switch (attr) {
      case "label":
        this.label = value;
        break;
      case "fillleft":
      case "fillright":
      case "colorleft":
      case "colorright":
        if (was === value) return;
        this.drawJar();
    }
  }

  handleColorChanges = () => {
    const addColorChangeEvent = (
      eltId: string,
      handler: (color: string) => void,
    ) =>
      queryElt(this.#shadow, eltId)!.addEventListener(
        colorControlsEmitted.colorchange,
        ((e) => {
          handler(e.detail.color);
        }) as ColorChangeEventHandler,
      );

    addColorChangeEvent("#colors-giving", (color) => (this.colorleft = color));

    addColorChangeEvent(
      "#colors-receiving",
      (color) => (this.colorright = color),
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
        });

    addFillChangeEvent(
      "#range-left",
      (rangeValue) => (this.fillleft = rangeValue),
    );

    addFillChangeEvent(
      "#range-right",
      (rangeValue) => (this.fillright = rangeValue),
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
      this.fillleft,
      this.colorleft,
      this.fillright,
      this.colorright,
    );
  }
}

customElements.define("fillable-jar", FillableJar);
