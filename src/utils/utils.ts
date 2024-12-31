// 두 점 사이의 거리
export function getDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const dx: number = p2.x - p1.x;
  const dy: number = p2.y - p1.y;

  return Math.sqrt(dx * dx + dy * dy);
}

// 두 점 사이의 각도
export function getAngle(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const dx: number = p2.x - p1.x;
  const dy: number = p2.y - p1.y;

  return Math.atan2(dy, dx); // rad
}

// 캔버스 지워진 비율
export function getScrupedPercent(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): number {
  const pixels = ctx.getImageData(0, 0, width, height);
  const gap = 32; // 4배수(r,g,b,a)
  const total = pixels.data.length / gap;
  let count = 0;

  for (let i = 0; i < pixels.data.length - 3; i += gap) {
    if (pixels.data[i + 3] === 0) count++;
  }

  return Math.round((count / total) * 100); // 백분율 계산
}
