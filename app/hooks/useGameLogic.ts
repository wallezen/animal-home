import { useState, useCallback } from 'react';
import { GameState, Direction, Command } from '../types/commands';

const BOARD_SIZE = 6;
const MOVE_DURATION = 500;

export function useGameLogic() {
  const [isExecuting, setIsExecuting] = useState(false);

  const getNextPosition = (
    currentPos: { row: number; col: number },
    direction: Direction,
    steps: number = 1,
    isBackward: boolean = false
  ) => {
    let { row, col } = currentPos;
    const actualSteps = isBackward ? -steps : steps;

    switch (direction) {
      case 'up':
        row = Math.max(0, Math.min(BOARD_SIZE - 1, row - actualSteps));
        break;
      case 'down':
        row = Math.max(0, Math.min(BOARD_SIZE - 1, row + actualSteps));
        break;
      case 'left':
        col = Math.max(0, Math.min(BOARD_SIZE - 1, col - actualSteps));
        break;
      case 'right':
        col = Math.max(0, Math.min(BOARD_SIZE - 1, col + actualSteps));
        break;
    }

    return { row, col };
  };

  const getNextDirection = (currentDirection: Direction, turn: 'left' | 'right'): Direction => {
    const directions: Direction[] = ['up', 'right', 'down', 'left'];
    const currentIndex = directions.indexOf(currentDirection);

    if (turn === 'left') {
      return directions[(currentIndex + 3) % 4];
    } else {
      return directions[(currentIndex + 1) % 4];
    }
  };

  const executeCommand = useCallback((
    command: Command,
    gameState: GameState,
    onUpdate: (newState: Partial<GameState>) => void
  ) => {
    return new Promise<void>((resolve) => {
      switch (command.type) {
        case 'forward':
        case 'backward': {
          const steps = command.steps || 1;
          let currentStep = 0;
          const moveStep = () => {
            if (currentStep < steps) {
              const newPosition = getNextPosition(
                gameState.position,
                gameState.direction,
                1,
                command.type === 'backward'
              );
              onUpdate({ position: newPosition });
              gameState.position = newPosition;
              currentStep++;
              setTimeout(moveStep, MOVE_DURATION);
            } else {
              resolve();
            }
          };
          moveStep();
          break;
        }
        case 'turnLeft':
        case 'turnRight': {
          const newDirection = getNextDirection(
            gameState.direction,
            command.type === 'turnLeft' ? 'left' : 'right'
          );
          onUpdate({ direction: newDirection });
          gameState.direction = newDirection;
          setTimeout(resolve, MOVE_DURATION);
          break;
        }
      }
    });
  }, []);

  const executeCommands = useCallback(async (
    commands: Command[],
    gameState: GameState,
    onUpdate: (newState: Partial<GameState>) => void
  ) => {
    setIsExecuting(true);

    for (const command of commands) {
      await executeCommand(command, gameState, onUpdate);
    }

    setIsExecuting(false);
  }, [executeCommand]);

  return {
    isExecuting,
    executeCommands
  };
}
