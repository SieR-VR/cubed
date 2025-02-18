import { proxy, useSnapshot } from 'valtio'
import { SingleCubeProp } from '../src/single-cube';

function randomNumber(): SingleCubeProp['number'] {
  return Math.floor(Math.random() * 9 + 1) as SingleCubeProp['number']
}

export const cubedState = proxy<{
  size: number;
  cubes: SingleCubeProp[][][]
}>({
  size: 0,
  cubes: []
});

export const cubedActions = {
  initGameState(size: number) {
    const halfSize = size / 2;

    cubedState.size = size;
    cubedState.cubes =
      Array.from({ length: size }).map((_, x) =>
        Array.from({ length: size }).map((_, y) =>
          Array.from({ length: size }).map((_, z) => ({
            number: randomNumber(),
            coordinate: [x - halfSize, y - halfSize, z - halfSize],
            removed: false
          }))
        )
      )
  }
}

export const useCubedState = () => useSnapshot(cubedState);
