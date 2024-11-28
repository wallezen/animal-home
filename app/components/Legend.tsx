import React, { type ReactNode } from "react";

interface LegendItemProps {
  icon: ReactNode;
  label: string;
}

function LegendItem({ icon, label }: LegendItemProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
      <div className="text-xl">{icon}</div>
      <span className="text-gray-700 font-medium">{label}</span>
    </div>
  );
}

interface LegendProps {
  items: Array<{ icon: ReactNode; label: string }>;
}

export default function Legend({ items }: LegendProps) {
  return (
    <div className="mt-6 grid grid-cols-3 gap-3">
      {items.map((item, index) => (
        <LegendItem key={index} icon={item.icon} label={item.label} />
      ))}
    </div>
  );
}