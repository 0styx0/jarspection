import templateHtml from "bundle-text:./jarTile.html";
import { defineCustomElt, mapPropertiesToAttribute, queryElt } from "../utils";
import { SideLabel } from "../side-label/side-label";
import { defaultJarAttrs, JarAttrs } from "../jarIllustration/jarAttrs";
import { JarIllustration } from "../jarIllustration/jarIllustration";
import {
  ColorChangeEvent,
  colorControlEvents,
} from "../color-controls/color-controls";
import { RangeChangeEvent } from "../vertical-range/vertical-range";

const selectors = {
  labelInput: ".label-input",
  colorLeft: ".colors-left",
  colorRight: ".colors-right",
  rangeLeft: ".range-left",
  rangeRight: ".range-right",
  labelLeft: ".label-left",
  labelRight: ".label-right",
  removeBtn: ".remove-btn",
  jarIllustration: ".jar-illustration",
};

export class JarTile extends HTMLElement implements JarAttrs {
  fillleft = defaultJarAttrs.fillleft;
  fillright = defaultJarAttrs.fillright;

  colorleft = defaultJarAttrs.colorleft;
  colorright = defaultJarAttrs.colorright;

  #jarIllustration: JarIllustration | null = null;

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
    this.attachShadow({ mode: "open" }).innerHTML = templateHtml
      .replaceAll("{{fillleft}}", this.fillleft)
      .replaceAll("{{fillright}}", this.fillright)
      .replaceAll("{{colorleft}}", this.colorleft)
      .replaceAll("{{colorright}}", this.colorright);
  }

  connectedCallback() {
    mapPropertiesToAttribute(this, JarTile.mirroredProps);

    this.#jarIllustration = queryElt(
      this.shadowRoot,
      selectors.jarIllustration,
    );

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

    this.drawJar();
  }

  setupEventListeners() {
    this.handleRemove();
    this.handleColorChanges();
    this.handleFillChanges();
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
        colorControlEvents.colorchange,
        (e: CustomEventInit<ColorChangeEvent>) => {
          handler(e.detail?.color || "");
        },
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
        (e: CustomEventInit<RangeChangeEvent>) => {
          handler(e.detail?.value || 0);
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

  drawJar() {
    if (!this.#jarIllustration) {
      console.warn("No jar illustration yet");
      return;
    }

    this.#jarIllustration.colorleft = this.colorleft;
    this.#jarIllustration.colorright = this.colorright;
    this.#jarIllustration.fillleft = this.fillleft;
    this.#jarIllustration.fillright = this.fillright;
  }

  handleRemove() {
    const removeBtn = queryElt(this.shadowRoot, selectors.removeBtn)!;
    removeBtn.addEventListener("click", () => this.remove());
  }
}

export const jarTileTag = "jar-tile";
defineCustomElt(jarTileTag, JarTile);
