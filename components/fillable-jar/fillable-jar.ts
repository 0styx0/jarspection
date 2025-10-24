import templateHtml from "bundle-text:./fillable-jar.html";

const colors = {
  yellow: "#ffdd44",
};
export class FillableJar extends HTMLElement {
  #fill = 50;
  #color = colors.yellow;
  #label = "New Jar";

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

  get fill() {
    return this.#fill;
  }
  set fill(value) {

    this.#fill = Math.max(0, Math.min(100, value)) ?? this.#fill;
  }

  get color() {
    return this.#color;
  }
  set color(value) {
    this.#color = value ?? this.#color;
  }
  get label() {
    return this.#label;
  }

  set label(value) {
    this.#label = value ?? this.#label;
    this.setupLabel();
  }

  set giving(value: boolean) {
    this.shadowRoot.querySelector<HTMLInputElement>(".jar-giving").checked =
      value;
  }

  get giving() {
    return (
      this.shadowRoot?.querySelector<HTMLInputElement>(".jar-giving")
        ?.checked || false
    );
  }

  set receiving(value: boolean) {
    this.shadowRoot.querySelector<HTMLInputElement>(".jar-receiving").checked =
      value;
  }
  get receiving() {
    return (
      this.shadowRoot?.querySelector<HTMLInputElement>(".jar-receiving")
        ?.checked || false
    );
  }

  render() {
    this.shadowRoot.innerHTML = templateHtml;
  }

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

  setupEventListeners() {
    const removeBtn = this.shadowRoot.querySelector(".remove-btn");
    if (removeBtn) {
      removeBtn.addEventListener("click", () => this.remove());
    }

    const fillSlider = this.shadowRoot.querySelector(".fill-slider-vertical");
    if (fillSlider) {
      fillSlider.addEventListener("input", (e) => {
        this.fill = e.target.value;
        this.drawJar();
      });
    }

    const colorSplotches = this.shadowRoot.querySelectorAll(".color-splotch");
    colorSplotches.forEach((s) => {
      s.addEventListener("click", (e) => {
        this.color = e.currentTarget.getAttribute("data-color");

        this.drawJar();
      });
    });

    const label = this.shadowRoot.querySelector(".label-input");
    label.addEventListener("input", (e) => {
      this.label = e.target.value;
    });
  }

  setupSliderHeight() {
    const fillSlider = this.shadowRoot.querySelector<HTMLInputElement>(
      ".fill-slider-vertical",
    );
    const container =
      this.shadowRoot.querySelector<HTMLDivElement>(".fill-controls");
    if (fillSlider && container) {
      fillSlider.style.height = `${container.offsetHeight * 0.5}px`;
    }
  }
  drawJar() {
    const canvas = this.shadowRoot.querySelector("canvas");
    if (!canvas) return;

    canvas.width = 600;
    canvas.height = 800;

    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const fillPercent = this.#fill;
    ctx.clearRect(0, 0, w, h);

    const centerX = w / 2;
    const jarTop = h * 0.16;
    const jarBottom = h * 0.84;
    const jarHeight = jarBottom - jarTop;
    const neckWidth = w * 0.15;
    const bodyWidth = w * 0.4;
    const neckHeight = jarHeight * 0.147;

    const fillHeight = (fillPercent / 100) * jarHeight;
    const fillTop = jarBottom - fillHeight;

    if (fillPercent > 0) {
      const baseColor = this.hexToRgb(this.#color);
      const gradient = ctx.createLinearGradient(0, fillTop, 0, jarBottom);
      gradient.addColorStop(
        0,
        `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.6)`,
      );
      gradient.addColorStop(
        1,
        `rgba(${Math.max(0, baseColor.r - 50)}, ${Math.max(0, baseColor.g - 50)}, ${Math.max(0, baseColor.b - 50)}, 0.8)`,
      );

      ctx.fillStyle = gradient;
      ctx.beginPath();

      const bodyStartY = jarTop + neckHeight;
      let fillWidth = fillTop < bodyStartY ? neckWidth : bodyWidth;

      if (fillTop >= bodyStartY) {
        ctx.moveTo(centerX - bodyWidth / 2, fillTop);
        ctx.lineTo(centerX + bodyWidth / 2, fillTop);
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
        ctx.closePath();
      } else {
        ctx.moveTo(centerX - neckWidth / 2, fillTop);
        ctx.lineTo(centerX + neckWidth / 2, fillTop);
        ctx.lineTo(centerX + neckWidth / 2, bodyStartY);
        ctx.lineTo(centerX + bodyWidth / 2, bodyStartY + 20);
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
        ctx.lineTo(centerX - bodyWidth / 2, bodyStartY + 20);
        ctx.lineTo(centerX - neckWidth / 2, bodyStartY);
        ctx.closePath();
      }

      ctx.fill();

      ctx.strokeStyle = `rgba(${Math.min(255, baseColor.r + 100)}, ${Math.min(
        255,
        baseColor.g + 100,
      )}, ${Math.min(255, baseColor.b + 100)}, 0.5)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - fillWidth / 2, fillTop);
      ctx.lineTo(centerX + fillWidth / 2, fillTop);
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
