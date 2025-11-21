import templateHtml from "./AddJar.html?raw";
import {
  defineCustomElt,
  queryElt,
  triggerCustomEvent,
} from "../componentUtils";
import { TopicHolder } from "../../models/TopicHolder";

export const addJarEvents = {
  addJar: "addJar",
};

export interface AddJarEvent {
  container: TopicHolder;
}
export const selectors = {
  addJar: ".add-jar",
};
export class AddJar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  connectedCallback() {
    this.createAddJarListener();
  }

  private createAddJarListener = () => {
    const addJarButton = queryElt<HTMLDivElement>(
      this.shadowRoot,
      selectors.addJar,
    );

    if (!addJarButton) return;

    addJarButton.addEventListener("click", () => {
      triggerCustomEvent(this, addJarEvents.addJar, {
        container: new TopicHolder(),
      });
    });
  };
}

export const addJarTag = "add-jar";
defineCustomElt(addJarTag, AddJar);
