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

export function paintJar(
  canvas: HTMLCanvasElement,
  fillLeft: number,
  colorLeft: string,
  fillRight: number,
  colorRight: string,
): void {
  canvas.width = 600;
  canvas.height = 800;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const jarDimensions = calculateJarDimensions(w, h);

  // Draw left half (give)
  drawLeftHalf(ctx, fillLeft, colorLeft, jarDimensions);

  // Draw right half (receive)
  drawRightHalf(ctx, fillRight, colorRight, jarDimensions);

  // Draw jar outline
  drawJarOutline(ctx, jarDimensions);
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
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function drawLeftHalf(
  ctx: CanvasRenderingContext2D,
  fillPercent: number,
  colorHex: string,
  dimensions: JarDimensions,
): void {
  if (fillPercent <= 0) return;

  const { centerX, jarBottom, jarHeight, neckWidth, bodyWidth, bodyStartY } =
    dimensions;

  const fillHeight = (fillPercent / 100) * jarHeight;
  const fillTop = jarBottom - fillHeight;
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

  // Draw fill level line
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

function drawRightHalf(
  ctx: CanvasRenderingContext2D,
  fillPercent: number,
  colorHex: string,
  dimensions: JarDimensions,
): void {
  if (fillPercent <= 0) return;

  const { centerX, jarBottom, jarHeight, neckWidth, bodyWidth, bodyStartY } =
    dimensions;

  const fillHeight = (fillPercent / 100) * jarHeight;
  const fillTop = jarBottom - fillHeight;
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

  // Draw fill level line
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
  ctx.strokeStyle = `rgba(${Math.min(255, color.r + 100)}, ${Math.min(255, color.g + 100)}, ${Math.min(255, color.b + 100)}, 0.5)`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX - fillWidth / 2, fillTop);
  ctx.lineTo(centerX, fillTop);
  ctx.stroke();
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
  ctx.strokeStyle = `rgba(${Math.min(255, color.r + 100)}, ${Math.min(255, color.g + 100)}, ${Math.min(255, color.b + 100)}, 0.5)`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, fillTop);
  ctx.lineTo(centerX + fillWidth / 2, fillTop);
  ctx.stroke();
}

function drawJarOutline(
  ctx: CanvasRenderingContext2D,
  dimensions: JarDimensions,
): void {
  const { centerX, jarTop, jarBottom, neckWidth, bodyWidth, neckHeight } =
    dimensions;

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
  ctx.quadraticCurveTo(centerX + bodyWidth / 2, jarBottom, centerX, jarBottom);
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
