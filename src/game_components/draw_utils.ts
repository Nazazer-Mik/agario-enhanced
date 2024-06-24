export function drawCircle(
  centerX: number,
  centerY: number,
  radius: number,
  color: string,
  outlineColor: string,
  outlineWidth: number,
  ctx: CanvasRenderingContext2D
) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = outlineWidth;
  ctx.strokeStyle = outlineColor;
  ctx.stroke();
  ctx.closePath();
}
