import templateHtml from "./AddJar.html?raw";
import { defineCustomElt, queryElt, triggerCustomEvent } from "../utils";
import { createJars } from "../../utils";
import { defaultJarTileProps, JarTileProps } from "../JarTile/JarTile";

export const addJarEvents = {
  addJar: "addJar",
};

export interface AddJarEvent {
  jar: JarTileProps;
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

  private createAddJarListener() {
    const addJarButton = queryElt<HTMLDivElement>(
      this.shadowRoot,
      selectors.addJar,
    );

    if (!addJarButton) return;

    addJarButton.addEventListener("click", () => {
      createJars([defaultJarTileProps]);
    });
    // before addingthis, I must figure out export spec
    // triggerCustomEvent(this, colorControlEvents.colorchange, {
    //   color: selectedColor,
    // });
  }
}

export const addJarTag = "add-jar";
defineCustomElt(addJarTag, AddJar);
