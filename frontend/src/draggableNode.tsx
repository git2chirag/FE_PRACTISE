// draggableNode.tsx

import { DragEvent } from "react";

export const DraggableNode = ({ type, label, icon }: { type: string; label: string; icon?: React.ReactNode }) => {
    const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
      const appData = { nodeType };
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div
        className="cursor-grab active:cursor-grabbing min-w-24 px-4 py-3 flex items-center justify-center gap-2 bg-gradient-to-br from-[#4A6FA5] to-[#5B8DBE] rounded-lg hover:from-[#3B5A8C] hover:to-[#4A6FA5] transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 border border-[#3B5A8C]/20"
        onDragStart={(event) => onDragStart(event, type)}
        draggable
      >
          {icon && <span className="text-white text-sm">{icon}</span>}
          <span className="text-white text-sm font-semibold">{label}</span>
      </div>
    );
  };
  