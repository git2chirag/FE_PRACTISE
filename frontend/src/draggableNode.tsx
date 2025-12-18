// draggableNode.tsx

import { DragEvent } from "react";

export const DraggableNode = ({ type, label }: { type: string; label: string }) => {
    const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
      const appData = { nodeType };
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div
        className={`${type} cursor-grab active:cursor-grabbing min-w-20 h-15 flex items-center justify-center flex-col bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors`}
        onDragStart={(event) => onDragStart(event, type)}
        draggable
      >
          <span className="text-white text-sm font-medium">{label}</span>
      </div>
    );
  };
  