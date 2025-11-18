interface JarDimensions {
  centerX: number;
  jarTop: number;
  jarBottom: number;
  jarHeight: number;
  neckWidth: number;
  bodyWidth: number;
  neckHeight: number;
  bodyStartY: number;
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

const canvasDimensions = {
  width: 300, // Half of original 600
  height: 800,
};

// Top-level exported functions
export function paintLeftJar(
  canvas: HTMLCanvasElement,
  fillPercent: number,
  colorHex: string,
): void {
  const ctx = initializeCanvas(canvas);
  if (!ctx) return;

  // Calculate dimensions based on full jar width (600)
  const dimensions = calculateJarDimensions(600, canvasDimensions.height);

  drawLeftHalf(ctx, fillPercent, colorHex, dimensions);
  drawLeftJarOutline(ctx, dimensions);
}

export function paintRightJar(
  canvas: HTMLCanvasElement,
  fillPercent: number,
  colorHex: string,
): void {
  const ctx = initializeCanvas(canvas);
  if (!ctx) return;

  // Calculate dimensions based on full jar width (600)
  const dimensions = calculateJarDimensions(600, canvasDimensions.height);

  // Translate context to align with left half
  ctx.translate(-300, 0);

  drawRightHalf(ctx, fillPercent, colorHex, dimensions);
  drawRightJarOutline(ctx, dimensions);
}

export function paintJar(
  canvasLeft: HTMLCanvasElement,
  canvasRight: HTMLCanvasElement,
  fillLeft: number,
  colorLeft: string,
  fillRight: number,
  colorRight: string,
): void {
  paintLeftJar(canvasLeft, fillLeft, colorLeft);
  paintRightJar(canvasRight, fillRight, colorRight);
}

// Shared utility functions
function initializeCanvas(
  canvas: HTMLCanvasElement,
): CanvasRenderingContext2D | null {
  canvas.width = canvasDimensions.width;
  canvas.height = canvasDimensions.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);
  return ctx;
}

function calculateJarDimensions(w: number, h: number): JarDimensions {
  const centerX = w / 2;
  const jarTop = h * 0.1;
  const jarBottom = h * 0.9;
  const jarHeight = jarBottom - jarTop;
  const neckWidth = w * 0.2;
  const bodyWidth = w * 0.6;
  const neckHeight = jarHeight * 0.147;
  const bodyStartY = jarTop + neckHeight;

  return {
    centerX,
    jarTop,
    jarBottom,
    jarHeight,
    neckWidth,
    bodyWidth,
    neckHeight,
    bodyStartY,
  };
}

function hexToRgb(hex: string): RGBColor {
  const defaultRgb = { r: 0, g: 0, b: 0 };
  const normalizedHex = hex.replace(/^#/, "");

  const r = parseInt(normalizedHex.slice(0, 2), 16);
  const g = parseInt(normalizedHex.slice(2, 4), 16);
  const b = parseInt(normalizedHex.slice(4, 6), 16);

  if ([r, g, b].some((val) => isNaN(val) || val < 0 || val > 255)) {
    return defaultRgb;
  }

  return { r, g, b };
}

function createFillGradient(
  ctx: CanvasRenderingContext2D,
  fillTop: number,
  jarBottom: number,
  color: RGBColor,
): CanvasGradient {
  const gradient = ctx.createLinearGradient(0, fillTop, 0, jarBottom);
  gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.6)`);
  gradient.addColorStop(
    1,
    `rgba(${Math.max(0, color.r - 50)}, ${Math.max(0, color.g - 50)}, ${Math.max(0, color.b - 50)}, 0.8)`,
  );
  return gradient;
}

function setupJarStrokeStyle(ctx: CanvasRenderingContext2D): void {
  ctx.strokeStyle = "rgba(100, 100, 100, 0.9)";
  ctx.lineWidth = 20;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
}

function setupFillLineStyle(
  ctx: CanvasRenderingContext2D,
  color: RGBColor,
): void {
  ctx.strokeStyle = `rgba(${Math.min(255, color.r + 100)}, ${Math.min(255, color.g + 100)}, ${Math.min(255, color.b + 100)}, 0.5)`;
  ctx.lineWidth = 2;
}

function calculateFillMetrics(
  fillPercent: number,
  jarHeight: number,
  jarBottom: number,
) {
  const fillHeight = (fillPercent / 100) * jarHeight;
  const fillTop = jarBottom - fillHeight;
  return { fillHeight, fillTop };
}

// Left half drawing functions
function drawLeftHalf(
  ctx: CanvasRenderingContext2D,
  fillPercent: number,
  colorHex: string,
  dimensions: JarDimensions,
): void {
  if (fillPercent <= 0) return;

  const { jarBottom, jarHeight, neckWidth, bodyWidth, bodyStartY, centerX } =
    dimensions;

  const { fillTop } = calculateFillMetrics(fillPercent, jarHeight, jarBottom);
  const color = hexToRgb(colorHex);
  const gradient = createFillGradient(ctx, fillTop, jarBottom, color);

  ctx.fillStyle = gradient;
  ctx.beginPath();

  if (fillTop >= bodyStartY) {
    drawLeftBodyOnlyPath(ctx, centerX, fillTop, jarBottom, bodyWidth);
  } else {
    drawLeftNeckAndBodyPath(
      ctx,
      centerX,
      fillTop,
      jarBottom,
      bodyStartY,
      neckWidth,
      bodyWidth,
    );
  }

  ctx.fill();

  drawLeftFillLine(
    ctx,
    centerX,
    fillTop,
    bodyStartY,
    neckWidth,
    bodyWidth,
    color,
  );
}

function drawLeftBodyOnlyPath(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  fillTop: number,
  jarBottom: number,
  bodyWidth: number,
): void {
  ctx.moveTo(centerX - bodyWidth / 2, fillTop);
  ctx.lineTo(centerX, fillTop);
  ctx.lineTo(centerX, jarBottom);
  ctx.quadraticCurveTo(
    centerX - bodyWidth / 2,
    jarBottom,
    centerX - bodyWidth / 2,
    jarBottom - 20,
  );
  ctx.closePath();
}

function drawLeftNeckAndBodyPath(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  fillTop: number,
  jarBottom: number,
  bodyStartY: number,
  neckWidth: number,
  bodyWidth: number,
): void {
  ctx.moveTo(centerX - neckWidth / 2, fillTop);
  ctx.lineTo(centerX, fillTop);
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

function drawLeftFillLine(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  fillTop: number,
  bodyStartY: number,
  neckWidth: number,
  bodyWidth: number,
  color: RGBColor,
): void {
  const fillWidth = fillTop < bodyStartY ? neckWidth : bodyWidth;
  setupFillLineStyle(ctx, color);
  ctx.beginPath();
  ctx.moveTo(centerX - fillWidth / 2, fillTop);
  ctx.lineTo(centerX, fillTop);
  ctx.stroke();
}

function drawLeftJarOutline(
  ctx: CanvasRenderingContext2D,
  dimensions: JarDimensions,
): void {
  const { centerX, jarTop, jarBottom, neckWidth, bodyWidth, neckHeight } =
    dimensions;

  setupJarStrokeStyle(ctx);

  ctx.beginPath();
  // Rim (left half + center)
  ctx.moveTo(centerX - neckWidth / 2 - 10, jarTop);
  ctx.lineTo(centerX, jarTop);

  // Left outline
  ctx.moveTo(centerX - neckWidth / 2 - 10, jarTop);
  ctx.lineTo(centerX - neckWidth / 2, jarTop + neckHeight);
  ctx.lineTo(centerX - bodyWidth / 2, jarTop + neckHeight + 20);
  ctx.lineTo(centerX - bodyWidth / 2, jarBottom - 20);
  ctx.quadraticCurveTo(centerX - bodyWidth / 2, jarBottom, centerX, jarBottom);

  ctx.stroke();
}

// Right half drawing functions
function drawRightHalf(
  ctx: CanvasRenderingContext2D,
  fillPercent: number,
  colorHex: string,
  dimensions: JarDimensions,
): void {
  if (fillPercent <= 0) return;

  const { jarBottom, jarHeight, neckWidth, bodyWidth, bodyStartY, centerX } =
    dimensions;

  const { fillTop } = calculateFillMetrics(fillPercent, jarHeight, jarBottom);
  const color = hexToRgb(colorHex);
  const gradient = createFillGradient(ctx, fillTop, jarBottom, color);

  ctx.fillStyle = gradient;
  ctx.beginPath();

  if (fillTop >= bodyStartY) {
    drawRightBodyOnlyPath(ctx, centerX, fillTop, jarBottom, bodyWidth);
  } else {
    drawRightNeckAndBodyPath(
      ctx,
      centerX,
      fillTop,
      jarBottom,
      bodyStartY,
      neckWidth,
      bodyWidth,
    );
  }

  ctx.fill();

  drawRightFillLine(
    ctx,
    centerX,
    fillTop,
    bodyStartY,
    neckWidth,
    bodyWidth,
    color,
  );
}

function drawRightBodyOnlyPath(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  fillTop: number,
  jarBottom: number,
  bodyWidth: number,
): void {
  ctx.moveTo(centerX, fillTop);
  ctx.lineTo(centerX + bodyWidth / 2, fillTop);
  ctx.lineTo(centerX + bodyWidth / 2, jarBottom - 20);
  ctx.quadraticCurveTo(centerX + bodyWidth / 2, jarBottom, centerX, jarBottom);
  ctx.closePath();
}

function drawRightNeckAndBodyPath(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  fillTop: number,
  jarBottom: number,
  bodyStartY: number,
  neckWidth: number,
  bodyWidth: number,
): void {
  ctx.moveTo(centerX, fillTop);
  ctx.lineTo(centerX + neckWidth / 2, fillTop);
  ctx.lineTo(centerX + neckWidth / 2, bodyStartY);
  ctx.lineTo(centerX + bodyWidth / 2, bodyStartY + 20);
  ctx.lineTo(centerX + bodyWidth / 2, jarBottom - 20);
  ctx.quadraticCurveTo(centerX + bodyWidth / 2, jarBottom, centerX, jarBottom);
  ctx.lineTo(centerX, bodyStartY + 20);
  ctx.lineTo(centerX, bodyStartY);
  ctx.closePath();
}

function drawRightFillLine(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  fillTop: number,
  bodyStartY: number,
  neckWidth: number,
  bodyWidth: number,
  color: RGBColor,
): void {
  const fillWidth = fillTop < bodyStartY ? neckWidth : bodyWidth;
  setupFillLineStyle(ctx, color);
  ctx.beginPath();
  ctx.moveTo(centerX, fillTop);
  ctx.lineTo(centerX + fillWidth / 2, fillTop);
  ctx.stroke();
}

function drawRightJarOutline(
  ctx: CanvasRenderingContext2D,
  dimensions: JarDimensions,
): void {
  const { centerX, jarTop, jarBottom, neckWidth, bodyWidth, neckHeight } =
    dimensions;

  setupJarStrokeStyle(ctx);

  ctx.beginPath();
  // Rim (center + right half)
  ctx.moveTo(centerX, jarTop);
  ctx.lineTo(centerX + neckWidth / 2 + 10, jarTop);

  // Right outline
  ctx.moveTo(centerX + neckWidth / 2 + 10, jarTop);
  ctx.lineTo(centerX + neckWidth / 2, jarTop + neckHeight);
  ctx.lineTo(centerX + bodyWidth / 2, jarTop + neckHeight + 20);
  ctx.lineTo(centerX + bodyWidth / 2, jarBottom - 20);
  ctx.quadraticCurveTo(centerX + bodyWidth / 2, jarBottom, centerX, jarBottom);

  ctx.stroke();
}
