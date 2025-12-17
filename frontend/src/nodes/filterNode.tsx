// filterNode.tsx
// A node for filtering data

import { useState } from 'react';
import { Position } from 'reactflow';
import React from 'react';
import { BaseNode, HandleConfig } from './BaseNode';

export const FilterNode = ({ id, data }: any) => {
  const [condition, setCondition] = useState<string>(data?.condition || 'contains');
  const [value, setValue] = useState<string>(data?.value || '');

  const handles: HandleConfig[] = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input`
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-match`,
      style: { top: '33%' }
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-no-match`,
      style: { top: '66%' }
    }
  ];

  return (
    <BaseNode id={id} data={data} title="Filter" handles={handles}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px' }}>
          <span style={{ marginBottom: '4px', fontWeight: 500 }}>Condition:</span>
          <select 
            value={condition} 
            onChange={(e) => setCondition(e.target.value)}
            style={{
              padding: '4px 8px',
              border: '1px solid #CBD5E0',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            <option value="contains">Contains</option>
            <option value="equals">Equals</option>
            <option value="startsWith">Starts With</option>
            <option value="endsWith">Ends With</option>
          </select>
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px' }}>
          <span style={{ marginBottom: '4px', fontWeight: 500 }}>Value:</span>
          <input 
            type="text" 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            style={{
              padding: '4px 8px',
              border: '1px solid #CBD5E0',
              borderRadius: '4px',
              fontSize: '12px'
            }}
            placeholder="Filter value"
          />
        </label>
      </div>
    </BaseNode>
  );
};
