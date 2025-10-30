import templateHtml from "./side-label.html?raw";
import { defineCustomElt, mapPropertiesToAttribute, queryElt } from "../utils";

export const selectors = {
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

  connectedCallback() {
    mapPropertiesToAttribute(this, SideLabel.mirroredProps);
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

export const sideLabelTag = "side-label";
defineCustomElt(sideLabelTag, SideLabel);
