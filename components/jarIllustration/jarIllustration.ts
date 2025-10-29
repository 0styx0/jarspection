import templateHtml from "bundle-text:./jarIllustration.html";
import { defineCustomElt, mapPropertiesToAttribute, queryElt } from "../utils";
import { defaultJarAttrs, JarAttrs } from "./jarAttrs";
import { paintJar } from "./jar-canvas-utils";

const selectors = {
  jarCanvas: ".jar",
};

export class JarIllustration
  extends HTMLElement
  implements Omit<JarAttrs, "label">
{
  fillleft = defaultJarAttrs.fillleft;
  fillright = defaultJarAttrs.fillright;

  // set when colorControls mounts
  colorleft = defaultJarAttrs.colorleft;
  colorright = defaultJarAttrs.colorright;

  static observedAttributes = [
    "fillleft",
    "fillright",
    "colorleft",
    "colorright",
  ];

  static mirroredProps = ["fillleft", "fillright", "colorleft", "colorright"];

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

  drawJar() {
    const canvas = queryElt<HTMLCanvasElement>(
      this.shadowRoot,
      selectors.jarCanvas,
    );

    if (!canvas) {
      return;
    }

    paintJar(
      canvas,
      this.fillleft,
      this.colorleft,
      this.fillright,
      this.colorright,
    );
  }
}
defineCustomElt("jar-illustration", JarIllustration);
