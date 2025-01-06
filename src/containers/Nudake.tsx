import { useEffect, useRef } from "react";
import throttle from "lodash/throttle";
import "../style/containers/Nudake.css";
import image1 from "../assets/nudake-1.jpg";
import image2 from "../assets/nudake-2.jpg";
import image3 from "../assets/nudake-3.jpg";
import * as Utils from "../utils/utils";

const Nudake = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const canvasParent = canvas.parentNode as HTMLElement;

    const ctx = canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
    let canvasWidth: number, canvasHeight: number;

    const imageSrcs: string[] = [image1, image2, image3];
    const loadedImages: HTMLImageElement[] = [];
    let currIndex: number = 0;

    let prevPos: { x: number; y: number } = { x: 0, y: 0 };

    function resize() {
      canvasWidth = canvasParent.clientWidth;
      canvasHeight = canvasParent.clientHeight;
      canvas.style.width = canvasWidth + "px";
      canvas.style.height = canvasHeight + "px";
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      preloadImages().then(() => drawImage());
    }

    function preloadImages(): Promise<void> {
      return new Promise((resolve) => {
        let loaded = 0;

        imageSrcs.forEach((src: string) => {
          const img: HTMLImageElement = new Image();
          img.src = src;

          img.onload = () => {
            loaded += 1;
            loadedImages.push(img);

            if (loaded === imageSrcs.length) return resolve();
          };
        });
      });
    }

    function drawImage() {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.globalCompositeOperation = "source-over"; // 기본값으로 초기화

      const image: HTMLImageElement = loadedImages[currIndex];
      Utils.drawImageCenter(canvas, ctx, image);
      //ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

      const nextImage: string = imageSrcs[(currIndex + 1) % imageSrcs.length];
      canvasParent.style.backgroundImage = `url(${nextImage})`;
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
      const dist: number = Utils.getDistance(prevPos, nextPos);
      const angle: number = Utils.getAngle(prevPos, nextPos);

      for (let i: number = 0; i < dist; i++) {
        const x = prevPos.x + Math.cos(angle) * i;
        const y = prevPos.y + Math.sin(angle) * i;

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, canvasWidth / 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }

      prevPos = nextPos;
    }

    const checkPercent = throttle(() => {
      const percent = Utils.getScrupedPercent(ctx, canvasWidth, canvasHeight);
      console.log(percent);

      if (percent > 50) {
        currIndex = (currIndex + 1) % imageSrcs.length;
        drawImage();
      }
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
