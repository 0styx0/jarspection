import templateHtml from "./JarTile.html?raw";
import { defineCustomElt, mapPropertiesToAttribute, queryElt } from "../utils";
import { SideLabel } from "../SideLabel/SideLabel";
import { defaultJarAttrs, JarAttrs } from "../JarIllustration/jarAttrs";
import { JarIllustration } from "../JarIllustration/JarIllustration";
import {
  ColorChangeEvent,
  colorControlEvents,
} from "../ColorControls/ColorControls";
import {
  RangeChangeEvent,
  rangeEvents,
} from "../VerticalRange/VerticalRange";

const selectors = {
  labelInput: ".label-input",
  colorLeft: ".colors-left",
  colorRight: ".colors-right",
  rangeLeft: ".range-left",
  rangeRight: ".range-right",
  labelLeft: ".label-left",
  labelRight: ".label-right",
  removeBtn: ".remove-btn",
  JarIllustration: ".jar-illustration",
};

export class JarTile extends HTMLElement implements JarAttrs {
  fillleft = defaultJarAttrs.fillleft;
  fillright = defaultJarAttrs.fillright;

  colorleft = defaultJarAttrs.colorleft;
  colorright = defaultJarAttrs.colorright;

  labelleft = defaultJarAttrs.labelleft;
  labelright = defaultJarAttrs.labelright;

  static observedAttributes = [
    "label",
    "labelleft",
    "labelright",
    "fillleft",
    "fillright",
    "colorleft",
    "colorright",
  ];

  static mirroredProps = [
    "labelleft",
    "labelright",
    "fillleft",
    "fillright",
    "colorleft",
    "colorright",
  ];

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = templateHtml
      .replaceAll("{{fillleft}}", this.fillleft)
      .replaceAll("{{fillright}}", this.fillright)
      .replaceAll("{{colorleft}}", this.colorleft)
      .replaceAll("{{colorright}}", this.colorright)
      .replaceAll("{{labelleft}}", this.labelleft)
      .replaceAll("{{labelright}}", this.labelright);
  }

  connectedCallback() {
    mapPropertiesToAttribute(this, JarTile.mirroredProps);

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

  private setupEventListeners() {
    this.handleRemove();
    this.handleColorChanges();
    this.handleFillChanges();
  }

  private getLabelElt = () =>
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

  private setSideLabelColor(selector: string, color: string) {
    const sideLabel = queryElt<SideLabel>(this.shadowRoot, selector);

    if (!sideLabel) {
      return;
    }
    sideLabel.color = color;
  }

  private handleColorChanges = () => {
    const colorLeft = queryElt(this.shadowRoot, selectors.colorLeft);
    const colorRight = queryElt(this.shadowRoot, selectors.colorRight);

    if (!colorLeft || !colorRight) {
      console.warn("Error setting color events. Element(s) not found", {
        colorLeft,
        colorRight,
      });
      return;
    }

    handleCustomEvent<CustomEventInit<ColorChangeEvent>>(
      colorLeft,
      colorControlEvents.colorchange,
      (detail) => (this.colorleft = detail?.color || ""),
    );
    handleCustomEvent<CustomEventInit<ColorChangeEvent>>(
      colorRight,
      colorControlEvents.colorchange,
      (detail) => (this.colorright = detail?.color || ""),
    );
  };

  private handleFillChanges = () => {
    const rangeLeft = queryElt(this.shadowRoot, selectors.rangeLeft);

    const rangeRight = queryElt(this.shadowRoot, selectors.rangeRight);

    if (!rangeRight || !rangeLeft) {
      console.warn("Error setting range events. Element(s) not found", {
        rangeLeft,
        rangeRight,
      });
      return;
    }

    handleCustomEvent<CustomEventInit<RangeChangeEvent>>(
      rangeLeft,
      rangeEvents.rangechange,
      (detail) => (this.fillleft = detail?.value || 0),
    );

    handleCustomEvent<CustomEventInit<RangeChangeEvent>>(
      rangeRight,
      rangeEvents.rangechange,
      (detail) => (this.fillright = detail?.value || 0),
    );
  };

  private drawJar() {
    const jarIllustrationElt = queryElt<JarIllustration>(
      this.shadowRoot,
      selectors.JarIllustration,
    );

    if (!jarIllustrationElt) {
      console.warn("No jar illustration yet");
      return;
    }

    jarIllustrationElt.colorleft = this.colorleft;
    jarIllustrationElt.colorright = this.colorright;
    jarIllustrationElt.fillleft = this.fillleft;
    jarIllustrationElt.fillright = this.fillright;
  }

  private handleRemove() {
    const removeBtn = queryElt(this.shadowRoot, selectors.removeBtn)!;
    removeBtn.addEventListener("click", () => this.remove());
  }
}

function handleCustomEvent<T extends CustomEventInit>(
  elt: Element,
  eventName: string,
  cb: (detail: T["detail"]) => void,
) {
  elt.addEventListener(eventName, (e: T) => cb(e.detail));
}

export const jarTileTag = "jar-tile";
defineCustomElt(jarTileTag, JarTile);
