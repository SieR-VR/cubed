import { Text } from "@react-three/drei";
import { useCubedState, Side, SingleCubeProp, ColorTable } from "../hooks/cubed";

type Props = {
  readonly [K in keyof SingleCubeProp]: SingleCubeProp[K]
}

const SidePositionMap: Record<Side, [number, number, number]> = {
  "X+": [+0.51, 0, 0],
  "X-": [-0.51, 0, 0],
  "Y+": [0, 0.51, 0],
  "Y-": [0, -0.51, 0],
  "Z+": [0, 0, 0.51],
  "Z-": [0, 0, -0.51],
}

const SideRotationMap: Record<Side, [number, number, number]> = {
  "X+": [0, Math.PI / 2, 0],
  "X-": [0, -Math.PI / 2, 0],
  "Y+": [-Math.PI / 2, 0, 0],
  "Y-": [Math.PI / 2, 0, 0],
  "Z+": [0, 0, 0],
  "Z-": [0, Math.PI, 0],
}

export function SingleCube({ number, coordinate, exposed, removed }: Props) {
  const { size } = useCubedState();
  const [x, y, z] = coordinate.map((e) => e + 0.5 - size / 2);

  if (removed) return null;

  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={ColorTable[number]} />
      </mesh>
      {Array.from(exposed).map((side) => (
        <Text color="white" anchorX="center" anchorY="middle" fontSize={0.5} position={SidePositionMap[side]} rotation={SideRotationMap[side]}>
          {number}
        </Text>
      ))}
    </group>
  );
}
