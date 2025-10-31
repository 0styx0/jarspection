import templateHtml from "./JarIllustration.html?raw";
import { defineCustomElt, mapPropertiesToAttribute, queryElt } from "../utils";
import { defaultJarAttrs, JarAttrs } from "./jarAttrs";
import { paintJar } from "./jarCanvasUtils";

export const selectors = {
  jarCanvas: ".jar",
};

type JarIllustrationAttrs = Pick<
  JarAttrs,
  "fillleft" | "fillright" | "colorleft" | "colorright"
>;

export class JarIllustration
  extends HTMLElement
  implements JarIllustrationAttrs
{
  fillleft = defaultJarAttrs.fillleft;
  fillright = defaultJarAttrs.fillright;

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

  private drawJar() {
    const canvas = queryElt<HTMLCanvasElement>(
      this.shadowRoot,
      selectors.jarCanvas,
    );

    if (!canvas) {
      return;
    }

    paintJar(
      canvas,
      +this.fillleft,
      this.colorleft,
      +this.fillright,
      this.colorright,
    );
  }
}

export const jarIllustrationTag = "jar-illustration";
defineCustomElt(jarIllustrationTag, JarIllustration);
