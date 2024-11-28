export type CommandType = 'forward' | 'backward' | 'turnLeft' | 'turnRight';

export interface Command {
  id: string;
  type: CommandType;
  steps?: number;
}

export type Direction = 'up' | 'right' | 'down' | 'left';

export interface GameState {
  position: { row: number; col: number };
  direction: Direction;
  commands: Command[];
}
