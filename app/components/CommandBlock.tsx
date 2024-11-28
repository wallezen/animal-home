import React from 'react';
import { FaArrowUp, FaArrowDown, FaRotateLeft, FaRotateRight, FaTrash } from 'react-icons/fa6';
import { CommandType, Command } from '../types/commands';

interface CommandBlockProps {
  type: CommandType;
  steps?: number;
  onDragStart: (type: CommandType) => void;
  onDelete?: () => void;
  onStepsChange?: (steps: number) => void;
  isTemplate?: boolean;
}

const CommandBlock: React.FC<CommandBlockProps> = ({
  type,
  steps = 1,
  onDragStart,
  onDelete,
  onStepsChange,
  isTemplate = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'forward':
        return <FaArrowUp />;
      case 'backward':
        return <FaArrowDown />;
      case 'turnLeft':
        return <FaRotateLeft />;
      case 'turnRight':
        return <FaRotateRight />;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'forward':
        return '前进';
      case 'backward':
        return '后退';
      case 'turnLeft':
        return '左转';
      case 'turnRight':
        return '右转';
    }
  };

  const needsSteps = type === 'forward' || type === 'backward';

  return (
    <div
      className={`
        flex items-center gap-2 p-3 bg-blue-500 text-white rounded-lg
        ${isTemplate ? 'cursor-move' : 'cursor-default'}
        shadow-md hover:bg-blue-600 group relative
      `}
      draggable={isTemplate}
      onDragStart={() => isTemplate && onDragStart(type)}
    >
      {getIcon()}
      <span>{getLabel()}</span>

      {needsSteps && onStepsChange && (
        <input
          type="number"
          min="1"
          max="5"
          value={steps}
          onChange={(e) => onStepsChange(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
          className="w-12 px-1 text-black rounded"
          onClick={(e) => e.stopPropagation()}
        />
      )}

      {!isTemplate && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 absolute -right-2 -top-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-opacity"
        >
          <FaTrash className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

export default CommandBlock;
