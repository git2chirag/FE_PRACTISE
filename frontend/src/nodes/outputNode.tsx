// outputNode.tsx

import { useState } from 'react';
import { Position } from 'reactflow';
import React from 'react';
import { BaseNode, HandleConfig } from './BaseNode';

export const OutputNode = ({ id, data }: any) => {
  const [currName, setCurrName] = useState<string>(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState<string>(data.outputType || 'Text');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOutputType(e.target.value);
  };

  const handles: HandleConfig[] = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-value`
    }
  ];

  return (
    <BaseNode id={id} data={data} title="Output" handles={handles}>
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
            value={outputType} 
            onChange={handleTypeChange}
            style={{
              padding: '4px 8px',
              border: '1px solid #CBD5E0',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            <option value="Text">Text</option>
            <option value="File">Image</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
}
