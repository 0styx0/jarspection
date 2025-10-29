import templateHtml from "bundle-text:./fillable-jar.html";
import {
  ColorChangeEvent,
  ColorChangeEventHandler,
  colorControlsEmitted,
} from "../color-controls/color-controls";
import { paintJar } from "./jar-canvas-utils";
import { defineCustomElt, mapPropertiesToAttribute, queryElt } from "../utils";
import { SideLabel } from "../side-label/side-label";
import { defaultJarAttrs, JarAttrs } from "./jarAttrs";

const selectors = {
  labelInput: ".label-input",
  colorLeft: ".colors-left",
  colorRight: ".colors-right",
  rangeLeft: ".range-left",
  rangeRight: ".range-right",
  labelLeft: ".label-left",
  labelRight: ".label-right",
  removeBtn: ".remove-btn",
  jarCanvas: ".jar",
};

export class FillableJar extends HTMLElement implements JarAttrs {
  fillleft = defaultJarAttrs.fillleft;
  fillright = defaultJarAttrs.fillright;

  // set when colorControls mounts
  colorleft = defaultJarAttrs.colorleft;
  colorright = defaultJarAttrs.colorright;

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
    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  connectedCallback() {
    mapPropertiesToAttribute(this, FillableJar.mirroredProps);

    this.setupEventListeners();

    this.drawJar();
  }

  attributeChangedCallback(attr: string, was: string, value: string) {
    switch (attr) {
      case "label":
        this.label = value;
        break;
      case "colorleft":
        this.setSideLabelColor(selectors.labelLeft, this.colorleft);
        break;
      case "colorright":
        this.setSideLabelColor(selectors.labelRight, this.colorright);
        break;
    }

    if (was === value) return;

    this.drawJar();
  }

  getLabelElt = () =>
    queryElt<HTMLTextAreaElement>(this.shadowRoot, selectors.labelInput);

  get label() {
    return this.getLabelElt()?.value || "";
  }

  set label(value: string) {
    const labelElt = this.getLabelElt();

    if (!labelElt) {
      return;
    }

    labelElt.value = value || "";
  }

  setSideLabelColor(selector: string, color: string) {
    const sideLabel = queryElt<SideLabel>(this.shadowRoot, selector);

    if (!sideLabel) {
      return;
    }
    sideLabel.color = color;
  }

  handleColorChanges = () => {
    const addColorChangeEvent = (
      selector: string,
      handler: (color: string) => void,
    ) =>
      queryElt(this.shadowRoot, selector)!.addEventListener(
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
      queryElt(this.shadowRoot, selector)!.addEventListener(
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
    const removeBtn = queryElt(this.shadowRoot, selectors.removeBtn)!;
    removeBtn.addEventListener("click", () => this.remove());
  }

  setupEventListeners() {
    this.handleRemove();
    this.handleColorChanges();
    this.handleFillChanges();
  }

  drawJar() {
    const canvas = queryElt<HTMLCanvasElement>(
      this.shadowRoot,
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

defineCustomElt("fillable-jar", FillableJar);
