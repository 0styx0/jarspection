import templateHtml from "bundle-text:./side-label.html";
import { defineCustomElt, queryElt } from "../utils";

const selectors = {
  label: ".label",
};

export class SideLabel extends HTMLElement {
  label = "";
  color = "";

  static observedAttributes = ["label", "color"];
  static mirroredProps = ["label", "color"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  attributeChangedCallback(attr: string, was: string, value: string) {
    switch (attr) {
      case "label":
        this.setLabelEltValue(value);
        break;
      case "color":
        this.setLabelEltColor(value);
        break;
    }
  }

  private getLabelElt() {
    return queryElt<HTMLDivElement>(this.shadowRoot, selectors.label);
  }

  private setLabelEltValue(value: string) {
    const labelElt = this.getLabelElt();
    if (!labelElt) return;

    labelElt.textContent = value;
  }

  private setLabelEltColor(color: string) {
    const labelElt = this.getLabelElt();
    if (!labelElt) return;

    labelElt.style.color = color;
  }
}

defineCustomElt("side-label", SideLabel);
