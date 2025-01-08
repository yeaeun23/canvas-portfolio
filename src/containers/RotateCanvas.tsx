import { useEffect, useRef } from "react";
import { Composite, Engine, Render, Runner, Mouse, MouseConstraint, Bodies } from "matter-js";
import "../style/containers/RotateCanvas.css";

const RotateCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const cw: number = 1000;
    const ch: number = 1000;
    let engine: Engine,
      render: Render,
      runner: Runner,
      mouse: Mouse,
      mouseConstraint: MouseConstraint;

    initScene();
    initMouse();
    initGround();

    // 마우스 휠 이벤트
    canvas.addEventListener(
      "wheel",
      () => {
        addRect(mouse.position.x, mouse.position.y, 50, 50);
      },
      { passive: true }
    );

    function initScene() {
      engine = Engine.create();
      render = Render.create({
        canvas: canvas,
        engine: engine,
        options: { width: cw, height: ch, wireframes: false, background: "#1b1b19" },
      });
      runner = Runner.create();

      Render.run(render);
      Runner.run(runner, engine);
    }

    // 마우스 연결
    function initMouse() {
      mouse = Mouse.create(canvas);
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
      });
      Composite.add(engine.world, mouseConstraint);
    }

    // 그라운드 생성
    function initGround() {
      const segments: number = 36; // 바닥 개수
      const deg: number = (Math.PI * 2) / segments; // 바닥 각도(10˚)
      const width: number = 50; // 바닥 가로
      const radius: number = cw / 2 + width / 2; // 그라운드 반지름
      const height: number = radius * Math.tan(deg / 2) * 2; // 바닥 세로

      for (let i = 0; i < segments; i++) {
        const theta: number = deg * i; // 기울어진 각도
        const x: number = radius * Math.cos(theta) + cw / 2; // 바닥 중심 좌표
        const y: number = radius * Math.sin(theta) + ch / 2;

        addRect(x, y, width, height, { isStatic: true, angle: theta });
      }
    }

    // 사각형 생성
    function addRect(x: number, y: number, w: number, h: number, options = {}) {
      const rect: Matter.Body = Bodies.rectangle(x, y, w, h, options);
      Composite.add(engine.world, rect);
    }
  }, []);

  return (
    <div className="rotate-canvas-wrapper">
      <canvas ref={canvasRef} />
      <aside>
        <h1>Javascript</h1>
        <h2>⭐⭐⭐⭐⭐</h2>
        <p>
          It is a long established fact that a reader will be distracted by the readable content of
          a page when looking at its layout. The point of using Lorem Ipsum is that it has a
          more-or-less normal distribution of letters, as opposed to using 'Content here, content
          here', making it look like readable English. Many desktop publishing packages and web page
          editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum'
          will uncover many web sites still in their infancy. Various versions have evolved over the
          years, sometimes by accident, sometimes on purpose (injected humour and the like).
        </p>
      </aside>
    </div>
  );
};

export default RotateCanvas;
