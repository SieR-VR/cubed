import { cubedState, cubedActions } from './cubed';
import { describe, it, expect, beforeEach } from 'vitest';

describe('cubed actions', () => {
  beforeEach(() => {
    // 테스트를 위해 3x3x3 큐브로 초기화
    cubedActions.initGameState(3);
  });

  describe('removeCube', () => {
    it('should remove cubes when sum is 10', () => {
      // 특정 값을 가진 큐브로 강제 설정
      cubedState.cubes[0][0][2].number = 3;
      cubedState.cubes[0][1][2].number = 7;

      // Z+ 면에서 봤을 때 (0,0)과 (0,1) 위치의 큐브 선택
      cubedActions.removeCube([[0, 0], [0, 1]]);

      // 선택된 큐브들이 removed되었는지 확인
      expect(cubedState.cubes[0][0][2].removed).toBe(true);
      expect(cubedState.cubes[0][1][2].removed).toBe(true);
    });

    it('should not remove cubes when sum is not 10', () => {
      cubedState.cubes[0][0][2].number = 3;
      cubedState.cubes[0][1][2].number = 4;

      cubedActions.removeCube([[0, 0], [0, 1]]);

      expect(cubedState.cubes[0][0][2].removed).toBe(false);
      expect(cubedState.cubes[0][1][2].removed).toBe(false);
    });

    it('should ignore already removed cubes', () => {
      cubedState.cubes[0][0][2].number = 3;
      cubedState.cubes[0][1][2].number = 7;
      cubedState.cubes[0][0][2].removed = true; // 미리 removed 처리

      cubedActions.removeCube([[0, 0], [0, 1]]);

      // 이미 removed된 큐브는 무시되므로, 합이 10이 되지 않아 다른 큐브도 removed되지 않아야 함
      expect(cubedState.cubes[0][1][2].removed).toBe(false);
    });

    it('should work with different sides', () => {
      // X+ 면 테스트
      cubedState.currentSide = "X+";
      cubedState.cubes[2][0][0].number = 4;
      cubedState.cubes[2][1][0].number = 6;

      cubedActions.removeCube([[0, 0], [0, 1]]);

      expect(cubedState.cubes[2][0][0].removed).toBe(true);
      expect(cubedState.cubes[2][1][0].removed).toBe(true);
    });
  });
});
