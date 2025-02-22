import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";

import { cubedActions, useCubedState } from "../hooks/cubed";
import { Cubes } from "./cubes";
import { Timer } from "./timer";
import { Result } from "./result";
import { DirectionPad } from "./direction-pad";

export function Cubed() {
  const { score, end } = useCubedState();

  const [aspect, setAspect] = useState(1);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);

  useEffect(() => {
    cubedActions.initGameState(6);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setAspect(window.innerWidth / window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Canvas
        color="black"
        style={{
          touchAction: "none",
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          width: "100vw",
          height: "100vh",
        }}
        draggable={false}
      >
        <color attach="background" args={["black"]} />
        <ambientLight intensity={Math.PI / 2} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <Cubes />
        <Stats />
        <OrthographicCamera
          makeDefault
          ref={cameraRef}
          attach="camera"
          position={[0, 0, 10]}
          zoom={0.25}
          left={-aspect}
          right={aspect}
          top={1}
          bottom={-1}
          manual
        />
      </Canvas>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          margin: 10,
          color: "white",
          fontSize: "2rem",
          fontWeight: "bold",
          textShadow: "0 0 10px white",
        }}
      >
        Score: {score}
      </div>
      <Timer />
      {end && <Result />}
      <DirectionPad />
    </>
  );
}
