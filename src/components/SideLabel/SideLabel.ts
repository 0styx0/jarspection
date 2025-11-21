import templateHtml from "./SideLabel.html?raw";
import {
  defineCustomElt,
  mapPropertiesToAttribute,
  queryElt,
} from "../componentUtils";
import { EmotionalReaction, emotionalReactions } from "../../api";
import { reactionToHex } from "../../models/TopicHolder";

export const selectors = {
  label: ".label",
};

export interface SideLabelProps {
  label: string;
  reaction: EmotionalReaction;
}

export class SideLabel extends HTMLElement implements SideLabelProps {
  label = "";
  reaction: EmotionalReaction = emotionalReactions.neutral;

  static observedAttributes = ["label", "reaction"];
  static mirroredProps = ["label", "reaction"];

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
      case "reaction":
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

  private setLabelEltColor(reaction: string) {
    const labelElt = this.getLabelElt();
    if (!labelElt) return;

    labelElt.style.color = reactionToHex[reaction as EmotionalReaction];
  }
}

export const sideLabelTag = "side-label";
defineCustomElt(sideLabelTag, SideLabel);
