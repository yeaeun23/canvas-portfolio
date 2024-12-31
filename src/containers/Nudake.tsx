import { useEffect, useRef } from "react";
import throttle from "lodash/throttle";
import "../style/containers/Nudake.css";
import image1 from "../assets/nudake-1.jpg";
import image2 from "../assets/nudake-2.jpg";
import image3 from "../assets/nudake-3.jpg";
import { getAngle, getDistance, getScrupedPercent } from "../utils/utils";

const Nudake = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const canvasParent = canvas.parentNode as HTMLElement;
    const ctx = canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
    let canvasWidth: number, canvasHeight: number;

    const imageSrcs: string[] = [image1, image2, image3];
    let currIndex: number = 0;
    let prevPos: { x: number; y: number } = { x: 0, y: 0 };

    function resize() {
      canvasWidth = canvasParent.clientWidth;
      canvasHeight = canvasParent.clientHeight;
      canvas.style.width = canvasWidth + "px";
      canvas.style.height = canvasHeight + "px";
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      drawImage();
    }

    function drawImage() {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const image = new Image();
      image.src = imageSrcs[currIndex];
      image.onload = () => {
        ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
      };
    }

    function onMouseDown(e: MouseEvent) {
      canvas.addEventListener("mouseup", onMouseUp);
      canvas.addEventListener("mouseleave", onMouseUp);
      canvas.addEventListener("mousemove", onMouseMove);

      prevPos = { x: e.offsetX, y: e.offsetY };
    }

    function onMouseUp() {
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseUp);
      canvas.removeEventListener("mousemove", onMouseMove);
    }

    function onMouseMove(e: MouseEvent) {
      drawCircles(e);
      checkPercent();
    }

    function drawCircles(e: MouseEvent) {
      const nextPos: { x: number; y: number } = { x: e.offsetX, y: e.offsetY };
      const dist: number = getDistance(prevPos, nextPos);
      const angle: number = getAngle(prevPos, nextPos);

      for (let i: number = 0; i < dist; i++) {
        const x = prevPos.x + Math.cos(angle) * i;
        const y = prevPos.y + Math.sin(angle) * i;

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }

      prevPos = nextPos;
    }

    const checkPercent = throttle(() => {
      const percent = getScrupedPercent(ctx, canvasWidth, canvasHeight);
      console.log(percent);
    }, 500); // 0.5초마다 실행

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("resize", resize);
    resize();

    return () => {
      // 컴포넌트 언마운트 시 클린업
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="nudake">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Nudake;
