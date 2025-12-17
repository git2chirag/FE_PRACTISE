// inputNode.tsx

import { useState } from 'react';
import { Position } from 'reactflow';
import React from 'react';
import { BaseNode, HandleConfig } from './BaseNode';

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

  const handles: HandleConfig[] = [
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-value`
    }
  ];

  return (
    <BaseNode id={id} data={data} title="Input" handles={handles}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px' }}>
          <span style={{ marginBottom: '4px', fontWeight: 500 }}>Name:</span>
          <input 
            type="text" 
            value={currName} 
            onChange={handleNameChange}
            style={{
              padding: '4px 8px',
              border: '1px solid #CBD5E0',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px' }}>
          <span style={{ marginBottom: '4px', fontWeight: 500 }}>Type:</span>
          <select 
            value={inputType} 
            onChange={handleTypeChange}
            style={{
              padding: '4px 8px',
              border: '1px solid #CBD5E0',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            <option value="Text">Text</option>
            <option value="File">File</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
}
