import templateHtml from "./ReactionPicker.html?raw";
import {
  defineCustomElt,
  queryElt,
  triggerCustomEvent,
} from "../componentUtils";
import { reactionToHex } from "../../models/TopicHolder";
import { EmotionalReaction, emotionalReactions } from "../../api";

export const reactionPickerEvents = {
  reactionchange: "reactionchange",
};

export interface ReactionChangeEvent {
  reaction: EmotionalReaction;
}

export const selectors = {
  reactionControls: ".reaction-controls",
  reactionOptions: ".color-splotch",
};

export interface ReactionPickerProps {
  /** an EmetionalReaction */
  initialreaction: EmotionalReaction;
}

export class ReactionPicker extends HTMLElement {
  static observedAttributes = ["initialreaction"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  connectedCallback() {
    this.setColors();
    this.addSplotchChangeEvent();
  }

  attributeChangedCallback(attr: string, was: string, value: string) {
    if (was === value) return;
    switch (attr) {
      case "initialreaction":
        this.setReaction(value as EmotionalReaction);
        break;
    }
  }

  private getSplotches() {
    return this.shadowRoot!.querySelectorAll<HTMLInputElement>(
      selectors.reactionOptions,
    );
  }

  private setReaction(reaction: EmotionalReaction) {
    const elt = queryElt<HTMLInputElement>(
      this.shadowRoot,
      `
      input[type="radio"][value="${reaction}"]`,
    );
    if (!elt) return;
    elt.checked = true;
  }

  private setColors() {
    this.getSplotches().forEach((splotch) => {
      splotch.style.backgroundColor =
        reactionToHex[splotch.value as EmotionalReaction];
    });
  }

  private addSplotchChangeEvent() {
    queryElt(this.shadowRoot, selectors.reactionControls)?.addEventListener(
      "change",
      this.onSplotchChange,
    );
  }

  private onSplotchChange = (e: Event) => {
    const selectedReaction = (e.target as HTMLInputElement).value;

    triggerCustomEvent(this, reactionPickerEvents.reactionchange, {
      reaction: selectedReaction,
    });
  };
}

export const reactionPickerTag = "reaction-picker";
defineCustomElt(reactionPickerTag, ReactionPicker);
