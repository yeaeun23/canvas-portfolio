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

  return Math.atan2(dy, dx);
}
