import { useEffect, useRef, useState } from "react";
import {
  Composite,
  Engine,
  Render,
  Runner,
  Mouse,
  MouseConstraint,
  Bodies,
  Events,
} from "matter-js";
import "../style/containers/RotateCanvas.css";
import IconAFRAME from "../assets/icon_AFRAME.png";
import IconCSS from "../assets/icon_CSS.png";
import IconHTML from "../assets/icon_HTML.png";
import IconJS from "../assets/icon_JS.png";
import IconREACT from "../assets/icon_REACT.png";
import IconTHREE from "../assets/icon_THREE.png";

const data: { [key: string]: { title: string; level: number; desc: string } } = {
  JS: {
    title: "Javascript",
    level: 4,
    desc: "자바스크립트에 대한 설명이라고 할 수 있습니다. 자바스크립트에 대한 설명. 자바스크립트에 대한 설명.",
  },
  REACT: {
    title: "React.js",
    level: 5,
    desc: "React에 대한 설명이라고 할 수 있습니다. React에 대한 설명. React에 대한 설명.",
  },
  CSS: {
    title: "CSS/SASS",
    level: 3,
    desc: "CSS에 대한 설명이라고 할 수 있습니다. CSS에 대한 설명. CSS에 대한 설명.",
  },
  AFRAME: {
    title: "Aframe.js",
    level: 4,
    desc: "AFRAME에 대한 설명이라고 할 수 있습니다. AFRAME에 대한 설명. AFRAME에 대한 설명.",
  },
  THREE: {
    title: "Three.js",
    level: 2,
    desc: "THREE에 대한 설명이라고 할 수 있습니다. THREE에 대한 설명. THREE에 대한 설명.",
  },
  HTML: {
    title: "HTML",
    level: 5,
    desc: "HTML에 대한 설명이라고 할 수 있습니다. HTML에 대한 설명. HTML에 대한 설명.",
  },
};

const RotateCanvas = () => {
  const [selected, setSelected] = useState<{ title: string; level: number; desc: string }>(
    data["JS"]
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const cw: number = 1000;
    const ch: number = 1000;
    const gravityPower: number = 0.5; // =radius
    let gravityDeg: number = 0;
    let engine: Engine,
      render: Render,
      runner: Runner,
      mouse: Mouse,
      mouseConstraint: MouseConstraint;

    initScene();
    initMouse();
    initGround();
    initImageBoxes();

    // 마우스 클릭 시 데이터 변경
    Events.on(mouseConstraint, "mousedown", () => {
      const newSelected: { title: string; level: number; desc: string } =
        mouseConstraint.body && data[mouseConstraint.body.label];
      newSelected && setSelected(newSelected);
    });

    // 이미지 박스 회전
    Events.on(runner, "tick", () => {
      gravityDeg += 1;
      engine.world.gravity.x = gravityPower * Math.cos((Math.PI / 180) * gravityDeg); // -1~1
      engine.world.gravity.y = gravityPower * Math.sin((Math.PI / 180) * gravityDeg); // -1~1
    });

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
      mouseConstraint = MouseConstraint.create(engine, { mouse: mouse });
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

    // 이미지 박스 생성
    function initImageBoxes() {
      const scale: number = 0.7; // 이미지 축소율
      const t1: { w: number; h: number } = { w: 250 * scale, h: 250 * scale }; // 이미지 타입별 크기
      const t2: { w: number; h: number } = { w: 732 * scale, h: 144 * scale };

      addRect(cw / 2, ch / 2, t1.w, t1.h, {
        label: "JS",
        chamfer: { radius: 20 },
        render: { sprite: { texture: IconJS, xScale: scale, yScale: scale } },
      });
      addRect(cw / 2 - t1.w, ch / 2, t1.w, t1.h, {
        label: "CSS",
        chamfer: { radius: 20 },
        render: { sprite: { texture: IconCSS, xScale: scale, yScale: scale } },
      });
      addRect(cw / 2 + t1.w, ch / 2, t1.w, t1.h, {
        label: "HTML",
        chamfer: { radius: 20 },
        render: { sprite: { texture: IconHTML, xScale: scale, yScale: scale } },
      });
      addRect(cw / 2, ch / 2 + t1.h, t1.w, t1.h, {
        label: "THREE",
        chamfer: { radius: 20 },
        render: { sprite: { texture: IconTHREE, xScale: scale, yScale: scale } },
      });
      addRect(cw / 2 - t1.w, ch / 2 + t1.h, t1.w, t1.h, {
        label: "REACT",
        chamfer: { radius: 75 },
        render: { sprite: { texture: IconREACT, xScale: scale, yScale: scale } },
      });
      addRect(cw / 2, ch / 2 - t2.h, t2.w, t2.h, {
        label: "AFRAME",
        chamfer: { radius: 20 },
        render: { sprite: { texture: IconAFRAME, xScale: scale, yScale: scale } },
      });
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
        <h1>{selected.title}</h1>
        <h2>
          {Array(5)
            .fill(null)
            .map((_: null, i: number) => (
              <span key={i} style={{ filter: `grayscale(${selected.level <= i ? 1 : 0})` }}>
                &#11088;
              </span>
            ))}
        </h2>
        <p>{selected.desc}</p>
      </aside>
    </div>
  );
};

export default RotateCanvas;
