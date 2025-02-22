import { proxy, useSnapshot } from 'valtio'

function randomNumber(): SingleCubeProp['number'] {
  return Math.floor(Math.random() * 9 + 1) as SingleCubeProp['number']
}

function getNextSide(currentSide: Side, action: RotateAction): Side {
  const lookup = {
    "Z+": {
      "up": "Y+",
      "down": "Y-",
      "left": "X+",
      "right": "X-"
    },
    "Z-": {
      "up": "Y+",
      "down": "Y-",
      "left": "X-",
      "right": "X+"
    },
    "X+": {
      "up": "Y+",
      "down": "Y-",
      "left": "Z-",
      "right": "Z+"
    },
    "X-": {
      "up": "Y+",
      "down": "Y-",
      "left": "Z+",
      "right": "Z-"
    },
    "Y+": {
      "up": "Z-",
      "down": "Z+",
      "left": "X+",
      "right": "X-"
    },
    "Y-": {
      "up": "Z+",
      "down": "Z-",
      "left": "X+",
      "right": "X-"
    }
  } as const;

  return lookup[currentSide][action];
}

function getInitialExposed(x: number, y: number, z: number): Set<Side> {
  const sides = new Set<Side>();

  if (x === 0) {
    sides.add("X-");
  }

  if (x === cubedState.size - 1) {
    sides.add("X+");
  }

  if (y === 0) {
    sides.add("Y-");
  }

  if (y === cubedState.size - 1) {
    sides.add("Y+");
  }

  if (z === 0) {
    sides.add("Z-");
  }

  if (z === cubedState.size - 1) {
    sides.add("Z+");
  }

  return sides;
}

export const ColorTable = {
  1: "#3E3B32",
  2: "#828282",
  3: "#C93C20",
  4: "#025669",
  5: "#464531",
  6: "#308446",
  7: "#0E294B",
  8: "#641C34",
  9: "#D53032",
};

const SideList = ['X+', 'X-', 'Y+', 'Y-', 'Z+', 'Z-'] as const;

export type RotateAction = "up" | "down" | "left" | "right";

export type Side = "Z+" | "Z-" | "X+" | "X-" | "Y+" | "Y-"

export type Point2D = [number, number];

export interface CubedState {
  scene: "title" | "game"
  end: boolean;
  score: number;

  start: Date;
  timeLimit: number;

  size: number;
  cubes: SingleCubeProp[][][]

  currentSide: Side
}

export interface SingleCubeProp {
  number: keyof typeof ColorTable;

  coordinate: [number, number, number];
  exposed: Set<Side>;

  removed: boolean;
}

export const cubedState = proxy<CubedState>({
  scene: "title",
  end: false,

  score: 0,
  start: new Date(),

  size: 0,
  cubes: [],

  currentSide: "Z+",
  timeLimit: 0,
});

export const cubedActions = {
  initGameState(size: number) {
    cubedState.size = size;
    cubedState.cubes =
      Array.from({ length: size }).map((_, x) =>
        Array.from({ length: size }).map((_, y) =>
          Array.from({ length: size }).map((_, z) => ({
            number: randomNumber(),
            coordinate: [x, y, z],
            removed: false,
            exposed: getInitialExposed(x, y, z)
          }))
        )
      )

    cubedState.end = false;
    cubedState.start = new Date();
    cubedState.timeLimit = 150;

    cubedState.scene = "game";
  },

  endGame() {
    cubedState.end = true;
  },

  goTitle() {
    cubedState.scene = "title";
  },

  rotate(action: RotateAction): Side {
    if (cubedState.end) return cubedState.currentSide;

    const currentSide = cubedState.currentSide;
    const nextSide = getNextSide(currentSide, action);

    cubedState.currentSide = nextSide;

    return nextSide;
  },

  removeCube(rect: [Point2D, Point2D]) {
    if (cubedState.end) return;

    const forward = Array.from({ length: cubedState.size }).map((_, i) => i);
    const backward = [...forward].reverse();

    const [[x1, y1], [x2, y2]] = rect;
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    // currentSide에 따라 좌표를 3D로 변환하는 함수
    const convertTo3DIndices = (x: number, y: number): [number, number, number][] => {
      switch (cubedState.currentSide) {
        case "Z+": return [...backward].map((i) => [x, y, i]);
        case "Z-": return [...forward].map((i) => [cubedState.size - x - 1, y, i]);
        case "X+": return [...forward].map((i) => [i, y, x]);
        case "X-": return [...backward].map((i) => [i, y, cubedState.size - x - 1]);
        case "Y+": return [...backward].map((i) => [x, i, cubedState.size - y - 1]);
        case "Y-": return [...forward].map((i) => [x, i, y]);
      }
    };

    // 선택된 영역의 큐브들을 수집
    const selectedCubes: SingleCubeProp[] = [];
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const indices = convertTo3DIndices(x, y);

        for (const [i, j, k] of indices) {
          const cube = cubedState.cubes[i][j][k];
          if (!cube.removed) {
            selectedCubes.push(cube);
            break;
          }
        }
      }
    }

    // 선택된 큐브들의 합이 10인지 확인
    const sum = selectedCubes.reduce((acc, cube) => acc + cube.number, 0);
    if (sum === 10) {
      // 합이 10이면 모든 선택된 큐브를 removed 처리
      selectedCubes.forEach(cube => {
        cube.removed = true;
      });

      cubedState.score += selectedCubes.length;
    }

    cubedActions.recalculateExposed();
  },

  recalculateExposed() {
    if (cubedState.end) return;

    const forward = Array.from({ length: cubedState.size }).map((_, i) => i);
    const backward = [...forward].reverse();

    const convertTo3DIndices = (side: Side, x: number, y: number): [number, number, number][] => {
      switch (side) {
        case "Z+": return [...backward].map((i) => [x, y, i]);
        case "Z-": return [...forward].map((i) => [x, y, i]);
        case "X+": return [...backward].map((i) => [i, y, x]);
        case "X-": return [...forward].map((i) => [i, y, x]);
        case "Y+": return [...backward].map((i) => [x, i, y]);
        case "Y-": return [...forward].map((i) => [x, i, y]);
      }
    };

    SideList.forEach((side) => {
      for (let x = 0; x < cubedState.size; x++) {
        for (let y = 0; y < cubedState.size; y++) {
          const indices = convertTo3DIndices(side, x, y);

          for (const [i, j, k] of indices) {
            const cube = cubedState.cubes[i][j][k];

            if (cube.removed) continue;

            cube.exposed.add(side);
            break;
          }
        }
      }
    });
  }
}

export const useCubedState = () => useSnapshot(cubedState);
