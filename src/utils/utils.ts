// 두 점 사이의 거리 구하기
export function getDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const dx: number = p2.x - p1.x;
  const dy: number = p2.y - p1.y;

  return Math.sqrt(dx * dx + dy * dy);
}

// 두 점 사이의 각도 구하기
export function getAngle(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const dx: number = p2.x - p1.x;
  const dy: number = p2.y - p1.y;

  return Math.atan2(dy, dx); // rad
}

// 캔버스 지워진 비율 구하기
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

// 캔버스 크기에 맞춰 이미지 그리기
export function drawImageCenter(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement
) {
  const cw: number = canvas.width; // 캔버스 크기
  const ch: number = canvas.height;
  const cr: number = ch / cw; // 비율

  const iw: number = image.width; // 실제 이미지 크기
  const ih: number = image.height;
  const ir: number = ih / iw; // 비율

  let sw: number, sh: number; // 보여줄 이미지 크기
  let sx: number, sy: number; // 시작점

  // 보여줄 이미지 크기 구하기
  if (ir >= cr) {
    sw = iw;
    sh = sw * (ch / cw); // sw:sh=cw:ch
  } else {
    sh = ih;
    sw = sh * (cw / ch);
  }

  // 보여줄 이미지 시작점 구하기
  sx = (iw - sw) / 2;
  sy = (ih - sh) / 2;

  // 이미지 그리기
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, cw, ch);
}
