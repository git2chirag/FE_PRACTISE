// draggableNode.tsx

import React from 'react';

interface DraggableNodeProps {
  type: string;
  label: string;
}

export const DraggableNode: React.FC<DraggableNodeProps> = ({ type, label }) => {
  return (
    <div className={type} draggable>
      <span>{label}</span>
    </div>
  );
};
