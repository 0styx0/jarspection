import templateHtml from "bundle-text:./fillable-jar.html";
import {
  ColorChangeEvent,
  ColorControls,
  colorControlsEmitted,
} from "../color-controls/color-controls";

const colors = {
  yellow: "#ffdd44",
};
export class FillableJar extends HTMLElement {
  #givePercent = 50;
  #receivePercent = 50;
  #label = "New Jar";

  #giveColor = colors.yellow;
  #receiveColor = colors.yellow;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  static get observedAttributes() {
    return ["fill", "color", "label", "giving", "receiving"];
  }
  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.drawJar();
    this.setupSliderHeight();
    this.setupResizeObserver();
    this.setupLabel();
  }

  set givePercent(value: number) {
    this.#givePercent = value;
  }
  set receivePercent(value: number) {
    this.#receivePercent = value;
  }
  get fill() {
    return this.#givePercent;
  }
  set fill(value) {
    this.#givePercent = Math.max(0, Math.min(100, value)) ?? this.#givePercent;
  }

  get label() {
    return this.#label;
  }

  set label(value) {
    this.#label = value ?? this.#label;
    this.setupLabel();
  }

  render() {
    this.shadowRoot.innerHTML = templateHtml;
  }

  handleColorChanges = () => {
    const addColorChangeEvent = (
      eltId: string,
      handler: (color: string) => void,
    ) =>
      this.shadowRoot!.querySelector(eltId)!.addEventListener(
        colorControlsEmitted.colorchange,
        (e: ColorChangeEvent) => {
          handler(e.detail.color);
          this.drawJar();
        },
      );

    addColorChangeEvent("#colors-giving", (color) => (this.#giveColor = color));

    addColorChangeEvent(
      "#colors-receiving",
      (color) => (this.#receiveColor = color),
    );
  };

  setupResizeObserver() {
    // Adjust on resize if needed
    const resizeObserver = new ResizeObserver(() => {
      this.drawJar();
      this.setupSliderHeight();
    });
    resizeObserver.observe(this.shadowRoot.querySelector(".jar-container"));
  }

  setupLabel() {
    const label =
      this.shadowRoot.querySelector<HTMLTextAreaElement>(".label-input");
    label.value = this.label;
  }

  setSlider(name: string) {
    const fillSlider = this.shadowRoot!.querySelector(
      `[name="${name}"]`,
    ) as HTMLInputElement;

    fillSlider.addEventListener("input", (e) => {
      this[name] = e.target.value;
      this.drawJar();
    });
  }
  setupEventListeners() {
    const removeBtn = this.shadowRoot.querySelector(".remove-btn")!;
    removeBtn.addEventListener("click", () => this.remove());

    this.setSlider("receivePercent");
    this.setSlider("givePercent");

    this.handleColorChanges();

    const label = this.shadowRoot.querySelector(".label-input");
    label.addEventListener("input", (e) => {
      this.label = e.target.value;
    });
  }

  setupSliderHeight() {
    const fillSlider = this.shadowRoot.querySelector<HTMLInputElement>(
      ".fill-slider-vertical",
    );
  }
  drawJar() {
    const canvas = this.shadowRoot.querySelector("canvas");
    if (!canvas) return;

    canvas.width = 600;
    canvas.height = 800;

    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const giveFillPercent = this.#givePercent;
    const receiveFillPercent = this.#receivePercent;
    ctx.clearRect(0, 0, w, h);

    const centerX = w / 2;
    const jarTop = h * 0.16;
    const jarBottom = h * 0.84;
    const jarHeight = jarBottom - jarTop;
    const neckWidth = w * 0.15;
    const bodyWidth = w * 0.4;
    const neckHeight = jarHeight * 0.147;

    const giveFillHeight = (giveFillPercent / 100) * jarHeight;
    const giveFillTop = jarBottom - giveFillHeight;

    const receiveFillHeight = (receiveFillPercent / 100) * jarHeight;
    const receiveFillTop = jarBottom - receiveFillHeight;

    const bodyStartY = jarTop + neckHeight;

    // Draw left half (give)
    if (giveFillPercent > 0) {
      const giveColor = this.hexToRgb(this.#giveColor);
      const giveGradient = ctx.createLinearGradient(
        0,
        giveFillTop,
        0,
        jarBottom,
      );
      giveGradient.addColorStop(
        0,
        `rgba(${giveColor.r}, ${giveColor.g}, ${giveColor.b}, 0.6)`,
      );
      giveGradient.addColorStop(
        1,
        `rgba(${Math.max(0, giveColor.r - 50)}, ${Math.max(0, giveColor.g - 50)}, ${Math.max(0, giveColor.b - 50)}, 0.8)`,
      );

      ctx.fillStyle = giveGradient;
      ctx.beginPath();

      if (giveFillTop >= bodyStartY) {
        // Left half - body only
        ctx.moveTo(centerX - bodyWidth / 2, giveFillTop);
        ctx.lineTo(centerX, giveFillTop);
        ctx.lineTo(centerX, jarBottom);
        ctx.quadraticCurveTo(
          centerX - bodyWidth / 2,
          jarBottom,
          centerX - bodyWidth / 2,
          jarBottom - 20,
        );
        ctx.closePath();
      } else {
        // Left half - neck and body
        ctx.moveTo(centerX - neckWidth / 2, giveFillTop);
        ctx.lineTo(centerX, giveFillTop);
        ctx.lineTo(centerX, bodyStartY);
        ctx.lineTo(centerX, bodyStartY + 20);
        ctx.lineTo(centerX, jarBottom);
        ctx.quadraticCurveTo(
          centerX - bodyWidth / 2,
          jarBottom,
          centerX - bodyWidth / 2,
          jarBottom - 20,
        );
        ctx.lineTo(centerX - bodyWidth / 2, bodyStartY + 20);
        ctx.lineTo(centerX - neckWidth / 2, bodyStartY);
        ctx.closePath();
      }

      ctx.fill();

      // Draw give fill level line
      let giveFillWidth = giveFillTop < bodyStartY ? neckWidth : bodyWidth;
      ctx.strokeStyle = `rgba(${Math.min(255, giveColor.r + 100)}, ${Math.min(
        255,
        giveColor.g + 100,
      )}, ${Math.min(255, giveColor.b + 100)}, 0.5)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - giveFillWidth / 2, giveFillTop);
      ctx.lineTo(centerX, giveFillTop);
      ctx.stroke();
    }

    // Draw right half (receive)
    if (receiveFillPercent > 0) {
      const receiveColor = this.hexToRgb(this.#receiveColor);
      const receiveGradient = ctx.createLinearGradient(
        0,
        receiveFillTop,
        0,
        jarBottom,
      );
      receiveGradient.addColorStop(
        0,
        `rgba(${receiveColor.r}, ${receiveColor.g}, ${receiveColor.b}, 0.6)`,
      );
      receiveGradient.addColorStop(
        1,
        `rgba(${Math.max(0, receiveColor.r - 50)}, ${Math.max(0, receiveColor.g - 50)}, ${Math.max(0, receiveColor.b - 50)}, 0.8)`,
      );

      ctx.fillStyle = receiveGradient;
      ctx.beginPath();

      if (receiveFillTop >= bodyStartY) {
        // Right half - body only
        ctx.moveTo(centerX, receiveFillTop);
        ctx.lineTo(centerX + bodyWidth / 2, receiveFillTop);
        ctx.lineTo(centerX + bodyWidth / 2, jarBottom - 20);
        ctx.quadraticCurveTo(
          centerX + bodyWidth / 2,
          jarBottom,
          centerX,
          jarBottom,
        );
        ctx.closePath();
      } else {
        // Right half - neck and body
        ctx.moveTo(centerX, receiveFillTop);
        ctx.lineTo(centerX + neckWidth / 2, receiveFillTop);
        ctx.lineTo(centerX + neckWidth / 2, bodyStartY);
        ctx.lineTo(centerX + bodyWidth / 2, bodyStartY + 20);
        ctx.lineTo(centerX + bodyWidth / 2, jarBottom - 20);
        ctx.quadraticCurveTo(
          centerX + bodyWidth / 2,
          jarBottom,
          centerX,
          jarBottom,
        );
        ctx.lineTo(centerX, bodyStartY + 20);
        ctx.lineTo(centerX, bodyStartY);
        ctx.closePath();
      }

      ctx.fill();

      // Draw receive fill level line
      let receiveFillWidth =
        receiveFillTop < bodyStartY ? neckWidth : bodyWidth;
      ctx.strokeStyle = `rgba(${Math.min(255, receiveColor.r + 100)}, ${Math.min(
        255,
        receiveColor.g + 100,
      )}, ${Math.min(255, receiveColor.b + 100)}, 0.5)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, receiveFillTop);
      ctx.lineTo(centerX + receiveFillWidth / 2, receiveFillTop);
      ctx.stroke();
    }

    // Draw jar outline
    ctx.strokeStyle = "rgba(100, 100, 100, 0.9)";
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    // Rim
    ctx.moveTo(centerX - neckWidth / 2 - 10, jarTop);
    ctx.lineTo(centerX + neckWidth / 2 + 10, jarTop);

    // Right neck and shoulder
    ctx.lineTo(centerX + neckWidth / 2, jarTop + neckHeight);
    ctx.lineTo(centerX + bodyWidth / 2, jarTop + neckHeight + 20);

    // Right body and bottom curve
    ctx.lineTo(centerX + bodyWidth / 2, jarBottom - 20);
    ctx.quadraticCurveTo(
      centerX + bodyWidth / 2,
      jarBottom,
      centerX,
      jarBottom,
    );
    ctx.quadraticCurveTo(
      centerX - bodyWidth / 2,
      jarBottom,
      centerX - bodyWidth / 2,
      jarBottom - 20,
    );

    // Left body, shoulder, and neck
    ctx.lineTo(centerX - bodyWidth / 2, jarTop + neckHeight + 20);
    ctx.lineTo(centerX - neckWidth / 2, jarTop + neckHeight);
    ctx.lineTo(centerX - neckWidth / 2 - 10, jarTop);

    ctx.closePath();
    ctx.stroke();
  }
  hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 100, g: 200, b: 255 };
  }
}

customElements.define("fillable-jar", FillableJar);
