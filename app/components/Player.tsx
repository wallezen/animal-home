import React from 'react';
import { Direction } from '../types/commands';

interface PlayerProps {
  direction: Direction;
  isMoving: boolean;
}

const Player: React.FC<PlayerProps> = ({ direction, isMoving }) => {
  return (
    <div className={`
      absolute inset-0 flex items-center justify-center
      transition-all duration-300 ease-in-out
    `}>
      <div className={`
        relative
        transform transition-transform
        ${direction === 'right' ? 'rotate-90' : ''}
        ${direction === 'down' ? 'rotate-180' : ''}
        ${direction === 'left' ? '-rotate-90' : ''}
        ${direction === 'up' ? 'rotate-0' : ''}
      `}>
        {/* 车身 - 俯视图 */}
        <div className={`relative ${isMoving ? 'animate-car-move' : ''}`}>
          {/* 主车身 */}
          <div className="w-8 h-10 bg-blue-500 rounded-lg shadow-lg" />

          {/* 车头 - 箭头形状 */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2
                        w-0 h-0 border-8 border-transparent
                        border-b-blue-600" />

          {/* 挡风玻璃 */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2
                        w-6 h-4 bg-sky-200 rounded-sm" />

          {/* 车灯 */}
          <div className={`
            absolute top-0 left-1 w-1.5 h-1.5 bg-yellow-300 rounded-full
            ${isMoving ? 'animate-pulse' : ''}
          `} />
          <div className={`
            absolute top-0 right-1 w-1.5 h-1.5 bg-yellow-300 rounded-full
            ${isMoving ? 'animate-pulse' : ''}
          `} />

          {/* 尾灯 */}
          <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
          <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </div>

        {/* 尾气效果 */}
        {isMoving && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
            <div className="w-1.5 h-1.5 bg-gray-200/80 rounded-full animate-exhaust-1" />
            <div className="w-1.5 h-1.5 bg-gray-200/60 rounded-full animate-exhaust-2" />
            <div className="w-1.5 h-1.5 bg-gray-200/40 rounded-full animate-exhaust-3" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Player;
