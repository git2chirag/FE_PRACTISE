// transformNode.tsx
// A node for transforming data

import { useState } from 'react';
import { Position } from 'reactflow';
import React from 'react';
import { BaseNode, HandleConfig } from './BaseNode';

export const TransformNode = ({ id, data }: any) => {
  const [operation, setOperation] = useState<string>(data?.operation || 'uppercase');

  const handles: HandleConfig[] = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input`
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-output`
    }
  ];

  return (
    <BaseNode id={id} data={data} title="Transform" handles={handles}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px' }}>
          <span style={{ marginBottom: '4px', fontWeight: 500 }}>Operation:</span>
          <select 
            value={operation} 
            onChange={(e) => setOperation(e.target.value)}
            style={{
              padding: '4px 8px',
              border: '1px solid #CBD5E0',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            <option value="uppercase">Uppercase</option>
            <option value="lowercase">Lowercase</option>
            <option value="reverse">Reverse</option>
            <option value="trim">Trim</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};
