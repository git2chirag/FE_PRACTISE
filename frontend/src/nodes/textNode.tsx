// textNode.tsx

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import React from 'react';


export const TextNode = ({ id, data }: any) => {
  const [currText, setCurrText] = useState<string>(data?.text || '{{input}}');

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrText(e.target.value);
  };

  return (
    <div style={{width: 200, height: 80, border: '1px solid black'}}>
      <div>
        <span>Text</span>
      </div>
      <div>
        <label>
          Text:
          <input 
            type="text" 
            value={currText} 
            onChange={handleTextChange} 
          />
        </label>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
      />
    </div>
  );
}

// Converted to TypeScript
export {};
