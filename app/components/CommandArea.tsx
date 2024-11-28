import React from 'react';
import { Command } from '../types/commands';
import CommandBlock from './CommandBlock';

interface CommandAreaProps {
  commands: Command[];
  onCommandsChange: (commands: Command[]) => void;
}

const CommandArea: React.FC<CommandAreaProps> = ({ commands, onCommandsChange }) => {
  const availableCommands = ['forward', 'backward', 'turnLeft', 'turnRight'];

  const handleDragStart = (type: string) => {
    const newCommand: Command = {
      id: Math.random().toString(36).substr(2, 9),
      type: type as Command['type'],
      steps: type === 'forward' || type === 'backward' ? 1 : undefined,
    };
    onCommandsChange([...commands, newCommand]);
  };

  const handleDelete = (id: string) => {
    onCommandsChange(commands.filter(cmd => cmd.id !== id));
  };

  const handleStepsChange = (id: string, steps: number) => {
    onCommandsChange(
      commands.map(cmd =>
        cmd.id === id ? { ...cmd, steps } : cmd
      )
    );
  };

  return (
    <div className="mt-8">
      <div className="flex gap-4 mb-4">
        {availableCommands.map((type) => (
          <CommandBlock
            key={type}
            type={type as Command['type']}
            onDragStart={handleDragStart}
            isTemplate={true}
          />
        ))}
      </div>
      <div className="min-h-[100px] p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="flex flex-wrap gap-2">
          {commands.map((command) => (
            <CommandBlock
              key={command.id}
              type={command.type}
              steps={command.steps}
              onDragStart={() => {}}
              onDelete={() => handleDelete(command.id)}
              onStepsChange={(steps) => handleStepsChange(command.id, steps)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommandArea;
