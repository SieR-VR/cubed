import { useCubedState } from "../hooks/cubed";

export interface SingleCubeProp {
  number: keyof typeof ColorTable;
  coordinate: readonly [number, number, number];

  removed: boolean;
}

const ColorTable = {
  1: "#3E3B32",
  2: "#828282",
  3: "#C93C20",
  4: "#025669",
  5: "#464531",
  6: "#308446",
  7: "#0E294B",
  8: "#641C34",
  9: "#D53032"
}

export function SingleCube({ number, coordinate }: SingleCubeProp) {
  const { size } = useCubedState()

  return (
    <mesh position={coordinate}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={ColorTable[number]} />
    </mesh>
  )
}
