import templateHtml from "./JarIllustration.html?raw";
import {
  defineCustomElt,
  mapPropertiesToAttribute,
  queryElt,
} from "../componentUtils";
import { defaultJarTileProps } from "../JarTile/JarTile";
import { reactionToHex } from "../../models/TopicHolder";

export const selectors = {
  jarLeft: ".left-side .liquid",
  jarRight: ".right-side .liquid",
  accessibility: {
    fullJarState: ".screenreader-only .full-state",
  },
};

export type JarIllustrationProps = {
  reactionleft: string;
  reactionright: string;
  strengthleft: number;
  strengthright: number;
};

export class JarIllustration
  extends HTMLElement
  implements JarIllustrationProps
{
  strengthleft = defaultJarTileProps.topic.emotions[0].strength;
  strengthright = defaultJarTileProps.topic.emotions[1].strength;

  reactionleft = defaultJarTileProps.topic.emotions[0].reaction;
  reactionright = defaultJarTileProps.topic.emotions[1].reaction;

  static observedAttributes = [
    "reactionleft",
    "reactionright",
    "strengthleft",
    "strengthright",
  ];

  static mirroredProps = [
    "reactionleft",
    "reactionright",
    "strengthleft",
    "strengthright",
  ];

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  connectedCallback() {
    mapPropertiesToAttribute(this, JarIllustration.mirroredProps);

    this.drawJar();
  }

  attributeChangedCallback(attr: string, was: string, value: string) {
    if (was === value) return;

    this.drawJar();
  }

  private drawJar() {
    const leftJar = queryElt<HTMLDivElement>(
      this.shadowRoot,
      selectors.jarLeft,
    );
    const rightJar = queryElt<HTMLDivElement>(
      this.shadowRoot,
      selectors.jarRight,
    );

    if (!leftJar || !rightJar) {
      console.warn("JarIllustration: Unable to find jar half", {
        leftJar,
        rightJar,
      });
      return;
    }

    this.updateAccessibleText();
    this.updateJars(leftJar, rightJar);
  }

  private updateJars(leftJar: HTMLDivElement, rightJar: HTMLDivElement) {
    leftJar.style.backgroundColor = reactionToHex[this.reactionleft];
    leftJar.style.height = this.strengthleft + "%";

    rightJar.style.backgroundColor = reactionToHex[this.reactionright];
    rightJar.style.height = this.strengthright + "%";
  }

  private updateAccessibleText() {
    const fullStateElt = queryElt<HTMLSpanElement>(
      this.shadowRoot,
      selectors.accessibility.fullJarState,
    );

    if (!fullStateElt) {
      console.warn(
        "JarIllustration: Accessible text elt not found",
        selectors.accessibility.fullJarState,
      );
      return;
    }
    fullStateElt.textContent = `person 1': ${this.reactionleft}, ${this.strengthleft}% filled. person 2: ${this.reactionright}, ${this.strengthright}% filled.`;
  }
}

export const jarIllustrationTag = "jar-illustration";
defineCustomElt(jarIllustrationTag, JarIllustration);
