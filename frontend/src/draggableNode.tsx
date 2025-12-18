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
        className="cursor-grab active:cursor-grabbing min-w-24 px-4 py-3 flex items-center justify-center gap-2 bg-gradient-to-br from-[#4A6FA5] to-[#5B8DBE] rounded-lg hover:from-[#3B5A8C] hover:to-[#4A6FA5] transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 border border-[#3B5A8C]/20"
        onDragStart={(event) => onDragStart(event, type)}
        draggable
      >
          <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="text-white text-sm font-semibold">{label}</span>
      </div>
    );
  };
  