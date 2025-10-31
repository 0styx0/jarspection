import templateHtml from "./ColorControls.html?raw";
import { defineCustomElt, queryElt, triggerCustomEvent } from "../utils";
import { colors } from "../jarAttrs";

export const colorControlEvents = {
  colorchange: "colorchange",
};

export interface ColorChangeEvent {
  color: string;
}

export const selectors = {
  colorControls: ".ColorControls",
  colorSplotches: ".color-splotch",
};

export class ColorControls extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = templateHtml
      .replaceAll("{{coloryes}}", colors.yes)
      .replaceAll("{{colormaybe}}", colors.maybe)
      .replaceAll("{{colorno}}", colors.no);
  }

  connectedCallback() {
    this.setColors();
    this.addSplotchChangeEvent();
  }

  private getSplotches() {
    return this.shadowRoot!.querySelectorAll<HTMLInputElement>(
      selectors.colorSplotches,
    );
  }

  private setColors() {
    this.getSplotches().forEach((splotch) => {
      // allows consistent use of hex-formatted colors
      splotch.style.backgroundColor = splotch.value;
    });
  }

  private addSplotchChangeEvent() {
    queryElt(this.shadowRoot, selectors.colorControls)?.addEventListener(
      "change",
      this.onSplotchChange,
    );
  }

  private onSplotchChange = (e: Event) => {
    const selectedColor = (e.target as HTMLInputElement).value;

    triggerCustomEvent(this, colorControlEvents.colorchange, {
      color: selectedColor,
    });
  };
}

export const colorControlsTag = "color-controls";
defineCustomElt(colorControlsTag, ColorControls);
