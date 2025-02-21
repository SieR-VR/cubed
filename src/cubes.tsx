import { useCallback, useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Quaternion } from "three";

import { cubedActions, Side, useCubedState } from "../hooks/cubed";
import { SingleCube } from "./single-cube";

const SideLookup: Record<Side, Quaternion> = {
  "Z+": new Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)),
  "Z-": new Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0)),
  "X+": new Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0)),
  "X-": new Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0)),
  "Y+": new Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)),
  "Y-": new Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)),
};

function clip(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export function Cubes() {
  const { viewport, gl, camera } = useThree();
  const { size, cubes, currentSide } = useCubedState();

  const [rotateAction, setRotateAction] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<[number, number] | null>(null);

  const currentRotateTime = useRef(0);
  const dragging = useRef<boolean>(false);
  const lerp = useRef<[Quaternion, Quaternion] | null>(null);

  const cubeGroupRef = useRef<THREE.Group | null>(null);

  useFrame((state, delta) => {
    if (!cubeGroupRef.current) return;

    const _lerp = (a: THREE.Quaternion, b: THREE.Quaternion, t: number) => {
      return a.slerp(b, t);
    };

    if (rotateAction) {
      currentRotateTime.current += delta;
      if (!lerp.current) {
        lerp.current = [
          cubeGroupRef.current.quaternion.clone(),
          SideLookup[currentSide],
        ];
      }

      const [start, end] = lerp.current;
      const t = currentRotateTime.current / 0.15;

      cubeGroupRef.current.quaternion.copy(_lerp(start, end, t));

      if (t > 1) {
        cubeGroupRef.current.quaternion.copy(end);

        currentRotateTime.current = 0;
        lerp.current = null;
        setRotateAction(false);
      }
    }
  });

  const onArrowKeyDown = useCallback((event: KeyboardEvent) => {
    if (!cubeGroupRef.current) return;
    if (rotateAction) return;

    if (event.key === "ArrowUp") {
      cubedActions.rotate("up");
    } else if (event.key === "ArrowDown") {
      cubedActions.rotate("down");
    } else if (event.key === "ArrowLeft") {
      cubedActions.rotate("left");
    } else if (event.key === "ArrowRight") {
      cubedActions.rotate("right");
    }

    setRotateAction(true);
  }, [rotateAction]);

  const onDragStart = useCallback((event: PointerEvent) => {
    if (event.button !== 0) return;
    if (dragging.current) return;

    const canvas = gl.domElement;

    const left = new THREE.Vector3(-size / 2, 0, 0).project(camera);
    const right = new THREE.Vector3(size / 2, 0, 0).project(camera);
    const xDiff = right.x - left.x;

    const { clientX, clientY } = event;
    const pixelsPerCube = xDiff / size * canvas.clientWidth / 2;

    const centerX = canvas.clientWidth / 2;
    const centerY = canvas.clientHeight / 2;

    const x = (clientX - centerX) / pixelsPerCube;
    const y = (centerY - clientY) / pixelsPerCube;

    const xIndex = clip(Math.ceil(x) + size / 2 - 1, 0, size - 1);
    const yIndex = clip(Math.ceil(y) + size / 2 - 1, 0, size - 1);

    console.log(xIndex, yIndex);

    dragging.current = true;
    setDragStart([xIndex, yIndex]);
  }, []);

  const onDragEnd = useCallback((event: PointerEvent) => {
    if (!dragging.current) return;
    if (!dragStart) return;

    const canvas = gl.domElement;

    const left = new THREE.Vector3(-size / 2, 0, 0).project(camera);
    const right = new THREE.Vector3(size / 2, 0, 0).project(camera);
    const xDiff = right.x - left.x;

    const pixelsPerCube = xDiff / size * canvas.clientWidth / 2;

    const centerX = canvas.clientWidth / 2;
    const centerY = canvas.clientHeight / 2;

    const x = (event.clientX - centerX) / pixelsPerCube;
    const y = (centerY - event.clientY) / pixelsPerCube;

    const xIndex = clip(Math.ceil(x) + size / 2 - 1, 0, size - 1);
    const yIndex = clip(Math.ceil(y) + size / 2 - 1, 0, size - 1);

    if (xIndex < 0 || xIndex >= size || yIndex < 0 || yIndex >= size) {
      dragging.current = false;
      setDragStart(null);
      return;
    }

    cubedActions.removeCube([
      dragStart,
      [xIndex, yIndex],
    ]);

    dragging.current = false;
    setDragStart(null);
  }, [dragStart]);

  useEffect(() => {
    window.addEventListener("keydown", onArrowKeyDown);

    gl.domElement.addEventListener("pointerdown", onDragStart);
    gl.domElement.addEventListener("pointerup", onDragEnd);

    return () => {
      window.removeEventListener("keydown", onArrowKeyDown);

      gl.domElement.removeEventListener("pointerdown", onDragStart);
      gl.domElement.removeEventListener("pointerup", onDragEnd);
    };
  }, [onArrowKeyDown, onDragStart, onDragEnd]);

  return (
    <>
      <group ref={cubeGroupRef}>
        {cubes.map((plane) =>
          plane.map((line) => line.map((cube) => <SingleCube {...cube} />))
        )}
      </group>
    </>
  );
}
