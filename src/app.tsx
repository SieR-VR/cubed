import { useCallback, useEffect, useRef, useState, PointerEvent } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stats, OrthographicCamera, Grid, OrbitControls } from '@react-three/drei'
import * as THREE from 'three';

import { cubedActions, useCubedState } from '../hooks/cubed'
import { Cubes } from './cubes';

export function App() {
  const { size, cubes } = useCubedState();

  const [aspect, setAspect] = useState(1);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);

  useEffect(() => {
    cubedActions.initGameState(6);
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setAspect(window.innerWidth / window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Canvas color="black">
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
  )
}
