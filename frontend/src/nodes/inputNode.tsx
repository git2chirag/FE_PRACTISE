// inputNode.tsx

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import React from 'react';

interface InputNodeProps {
  id: string;
  data: {
    inputName?: string;
    inputType?: string;
  };
}

export const InputNode: React.FC<InputNodeProps> = ({ id, data }) => {
  const [currName, setCurrName] = useState<string>(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState<string>(data.inputType || 'Text');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputType(e.target.value);
  };

  return (
    <div style={{width: 200, height: 80, border: '1px solid black'}}>
      <div>
        <span>Input</span>
      </div>
      <div>
        <label>
          Name:
          <input 
            type="text" 
            value={currName} 
            onChange={handleNameChange} 
          />
        </label>
        <label>
          Type:
          <select value={inputType} onChange={handleTypeChange}>
            <option value="Text">Text</option>
            <option value="File">File</option>
          </select>
        </label>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-value`}
      />
    </div>
  );
}

export {};
