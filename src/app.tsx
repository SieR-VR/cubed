import { Canvas } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'
import { useEffect } from 'react'

import { cubedActions, useCubedState } from '../hooks/cubed'
import { SingleCube } from './single-cube';

export function App() {
  const { size, cubes } = useCubedState();

  useEffect(() => {
    cubedActions.initGameState(6);
  }, [])

  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      {cubes.map(
        plane => plane.map(
          line => line.map(
            cube => <SingleCube {...cube} />
          )
        )
      )}
      <OrbitControls />
      <Stats />
    </Canvas>
  )
}
