// conditionalNode.tsx
// A node for conditional logic

import { useState } from 'react';
import { Position } from 'reactflow';
import React from 'react';
import { BaseNode, HandleConfig } from './BaseNode';

export const ConditionalNode = ({ id, data }: any) => {
  const [condition, setCondition] = useState<string>(data?.condition || 'if');

  const handles: HandleConfig[] = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-condition`,
      style: { top: '33%' }
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-value`,
      style: { top: '66%' }
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-true`,
      style: { top: '33%' }
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-false`,
      style: { top: '66%' }
    }
  ];

  return (
    <BaseNode id={id} data={data} title="Conditional" handles={handles}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px' }}>
          <span style={{ marginBottom: '4px', fontWeight: 500 }}>Type:</span>
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
            <option value="if">If/Else</option>
            <option value="switch">Switch</option>
            <option value="ternary">Ternary</option>
          </select>
        </label>
        <div style={{ fontSize: '10px', color: '#718096' }}>
          Evaluates condition and routes to true/false branch
        </div>
      </div>
    </BaseNode>
  );
};
