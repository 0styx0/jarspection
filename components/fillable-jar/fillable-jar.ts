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

const selectors = {
  labelInput: ".label-input",
  colorLeft: ".colors-left",
  colorRight: ".colors-right",
  rangeLeft: ".range-left",
  rangeRight: ".range-right",
  removeBtn: ".remove-btn",
  jarCanvas: ".jar",
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

  getLabelElt = () =>
    queryElt<HTMLTextAreaElement>(this.#shadow, selectors.labelInput);

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

  handleColorChanges = () => {
    const addColorChangeEvent = (
      selector: string,
      handler: (color: string) => void,
    ) =>
      queryElt(this.#shadow, selector)!.addEventListener(
        colorControlsEmitted.colorchange,
        ((e) => {
          handler(e.detail.color);
        }) as ColorChangeEventHandler,
      );

    addColorChangeEvent(
      selectors.colorLeft,
      (color) => (this.colorleft = color),
    );

    addColorChangeEvent(
      selectors.colorRight,
      (color) => (this.colorright = color),
    );
  };

  handleFillChanges = () => {
    const addFillChangeEvent = (
      selector: string,
      handler: (rangeValue: number) => void,
    ) =>
      queryElt(this.#shadow, selector)!.addEventListener(
        "input",
        (e: Event) => {
          handler(e.originalTarget?.value);
        },
      );

    addFillChangeEvent(
      selectors.rangeLeft,
      (rangeValue) => (this.fillleft = rangeValue),
    );

    addFillChangeEvent(
      selectors.rangeRight,
      (rangeValue) => (this.fillright = rangeValue),
    );
  };

  handleRemove() {
    const removeBtn = queryElt(this.#shadow, selectors.removeBtn)!;
    removeBtn.addEventListener("click", () => this.remove());
  }

  setupEventListeners() {
    this.handleRemove();
    this.handleColorChanges();
    this.handleFillChanges();
  }

  drawJar() {
    const canvas = queryElt<HTMLCanvasElement>(
      this.#shadow,
      selectors.jarCanvas,
    );

    if (!canvas) {
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
