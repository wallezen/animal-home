import React, { type ReactNode } from "react";
import { FaHome, FaPlay, FaStop } from "react-icons/fa";
import { GiSnake, GiMammoth, GiFishEscape, GiHummingbird } from "react-icons/gi";
import GameCell from "./GameCell";
import Legend from "./Legend";
import CommandArea from './CommandArea';
import { Command, GameState } from '../types/commands';
import { useGameLogic } from '../hooks/useGameLogic';
import Player from './Player';

type CellType = "base" | "reptile" | "mammal" | "fish" | "bird" | "empty";
type BlockType = "reptileBlock" | "mammalBlock" | "fishBlock" | "birdBlock" | null;

interface Cell {
  type: CellType;
  row: number;
  col: number;
  block: BlockType;
}

const BOARD_SIZE = 6;

const getInitialBoard = (): Cell[][] => {
  const board: Cell[][] = Array(BOARD_SIZE)
    .fill(null)
    .map((_, row) =>
      Array(BOARD_SIZE)
        .fill(null)
        .map((_, col) => ({ type: "empty", row, col, block: null }))
    );

  // Set special cells
  board[0][0].type = "base";
  board[5][5].type = "base";
  board[0][2].type = "reptile";
  board[2][5].type = "mammal";
  board[3][0].type = "fish";
  board[5][3].type = "bird";

  // 随机放置积木块
  const blocks: BlockType[] = ["reptileBlock", "mammalBlock", "fishBlock", "birdBlock"];
  const availableCells: [number, number][] = [];

  // 收集所有空格子
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j].type === "empty") {
        availableCells.push([i, j]);
      }
    }
  }

  // 随机放置积木块
  blocks.forEach(block => {
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const [row, col] = availableCells.splice(randomIndex, 1)[0];
    board[row][col].block = block;
  });

  return board;
};

const getCellIcon = (type: CellType): ReactNode => {
  const areaStyle = `
    absolute inset-0 flex items-center justify-center
    before:absolute before:inset-0
    before:bg-gradient-to-br before:from-white/40 before:to-transparent
    rounded-md border-2
    z-10
  `;
  const iconStyle = "text-2xl relative";

  switch (type) {
    case "base":
      return (
        <div className={`
          ${areaStyle}
          bg-gradient-to-br from-amber-100 to-amber-200
          border-amber-700
        `}>
          <FaHome className={`${iconStyle} text-amber-700`} />
        </div>
      );
    case "reptile":
      return (
        <div className={`
          ${areaStyle}
          bg-gradient-to-br from-emerald-100 to-emerald-200
          border-emerald-600
        `}>
          <GiSnake className={`${iconStyle} text-emerald-700`} />
        </div>
      );
    case "mammal":
      return (
        <div className={`
          ${areaStyle}
          bg-gradient-to-br from-orange-100 to-orange-200
          border-orange-700
        `}>
          <GiMammoth className={`${iconStyle} text-orange-800`} />
        </div>
      );
    case "fish":
      return (
        <div className={`
          ${areaStyle}
          bg-gradient-to-br from-cyan-100 to-cyan-200
          border-cyan-600
        `}>
          <GiFishEscape className={`${iconStyle} text-cyan-700`} />
        </div>
      );
    case "bird":
      return (
        <div className={`
          ${areaStyle}
          bg-gradient-to-br from-rose-100 to-rose-200
          border-rose-600
        `}>
          <GiHummingbird className={`${iconStyle} text-rose-700`} />
        </div>
      );
    default:
      return null;
  }
};

const getBlockIcon = (block: BlockType): ReactNode => {
  const blockBaseStyle = `
    absolute w-10 h-10
    top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
    flex items-center justify-center
    transform-gpu hover:scale-105 transition-transform
    shadow-[2px_2px_0_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.7)]
    before:absolute before:inset-0 before:bg-gradient-to-br
    before:from-white/60 before:to-transparent
    z-20
  `;

  const iconStyle = "text-base relative";
  const blockShape = "rounded-[3px] border-b-[3px] border-r-[3px]";

  switch (block) {
    case "reptileBlock":
      return (
        <div className={`
          ${blockBaseStyle} ${blockShape}
          bg-emerald-300 border-emerald-500
          [transform-style:preserve-3d]
        `}>
          <GiSnake className={`${iconStyle} text-emerald-700`} />
        </div>
      );
    case "mammalBlock":
      return (
        <div className={`
          ${blockBaseStyle} ${blockShape}
          bg-orange-300 border-orange-500
          [transform-style:preserve-3d]
        `}>
          <GiMammoth className={`${iconStyle} text-orange-800`} />
        </div>
      );
    case "fishBlock":
      return (
        <div className={`
          ${blockBaseStyle} ${blockShape}
          bg-cyan-300 border-cyan-500
          [transform-style:preserve-3d]
        `}>
          <GiFishEscape className={`${iconStyle} text-cyan-700`} />
        </div>
      );
    case "birdBlock":
      return (
        <div className={`
          ${blockBaseStyle} ${blockShape}
          bg-rose-300 border-rose-500
          [transform-style:preserve-3d]
        `}>
          <GiHummingbird className={`${iconStyle} text-rose-700`} />
        </div>
      );
    default:
      return null;
  }
};

const legendItems = [
  { icon: <FaHome className="text-amber-700" />, label: "基地" },
  { icon: <GiSnake className="text-emerald-600" />, label: "爬行类" },
  { icon: <GiMammoth className="text-orange-700" />, label: "哺乳类" },
  { icon: <GiFishEscape className="text-cyan-600" />, label: "鱼类" },
  { icon: <GiHummingbird className="text-rose-600" />, label: "鸟类" },
];

export default function GameBoard() {
  const [gameState, setGameState] = React.useState<GameState>({
    position: { row: 0, col: 0 },
    direction: 'right',
    commands: [],
  });

  const [board, setBoard] = React.useState(() => getInitialBoard());
  const { isExecuting, executeCommands } = useGameLogic();

  const handleCommandsChange = (newCommands: Command[]) => {
    setGameState((prev) => ({
      ...prev,
      commands: newCommands,
    }));
  };

  const handleExecute = async () => {
    await executeCommands(
      gameState.commands,
      gameState,
      (newState) => setGameState((prev) => ({ ...prev, ...newState }))
    );
  };

  const handleReset = () => {
    setGameState({
      position: { row: 0, col: 0 }, // 回到起始基地
      direction: 'right',           // 重置方向
      commands: [],                 // 清空命令
    });
  };

  // 添加角色渲染
  const renderPlayer = (cell: Cell) => {
    if (cell.row === gameState.position.row && cell.col === gameState.position.col) {
      return (
        <div className="relative z-30">
          <Player direction={gameState.direction} isMoving={isExecuting} />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">送小动物回家游戏</h1>

        {/* 新增一个水平flex容器 */}
        <div className="flex gap-8">
          {/* 左侧棋盘区域 */}
          <div className="flex flex-col">
            <div className="grid grid-cols-6 gap-2 bg-gradient-to-br from-sky-100 to-emerald-100 p-4 rounded-lg">
              {board.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <GameCell
                      key={`${rowIndex}-${colIndex}`}
                      icon={getCellIcon(cell.type)}
                      type={cell.type}
                    >
                      {renderPlayer(cell)}
                      {getBlockIcon(cell.block)}
                    </GameCell>
                  ))}
                </React.Fragment>
              ))}
            </div>
            <Legend items={legendItems} />
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleExecute}
                disabled={isExecuting || gameState.commands.length === 0}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg
                  ${isExecuting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'}
                  text-white font-semibold transition-colors
                `}
              >
                {isExecuting ? (
                  <>
                    <FaStop /> 执行中...
                  </>
                ) : (
                  <>
                    <FaPlay /> 执行命令
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                disabled={isExecuting}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg
                  ${isExecuting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600'}
                  text-white font-semibold transition-colors
                `}
              >
                <FaHome /> 重置
              </button>
            </div>
          </div>

          {/* 右侧命令区域 */}
          <div className="w-80">
            <CommandArea
              commands={gameState.commands}
              onCommandsChange={handleCommandsChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
