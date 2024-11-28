import React, { type ReactNode } from "react";

interface GameCellProps {
  icon: ReactNode;
  type: string;
  children?: ReactNode;
}

const GameCell: React.FC<GameCellProps> = ({ icon, type, children }) => {
  return (
    <div className="
      relative w-16 h-16
      bg-white/80 rounded-lg
      shadow-inner
      flex items-center justify-center
      overflow-hidden
      transition-all duration-200
      hover:shadow-md
      perspective-[1000px]
    ">
      {icon}
      {children}
    </div>
  );
};

export default GameCell;
