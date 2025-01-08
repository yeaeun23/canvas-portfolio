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

    // 바닥 생성
    function initGround() {
      const ground: Matter.Body = Bodies.rectangle(cw / 2, ch, cw, 50, { isStatic: true });
      Composite.add(engine.world, ground);
    }

    // 사각형 생성
    function addRect(x: number, y: number, w: number, h: number, options = {}) {
      const rect = Bodies.rectangle(x, y, w, h, options);
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
