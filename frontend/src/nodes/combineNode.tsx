// combineNode.tsx
// A node for combining multiple inputs

import { Position } from 'reactflow';
import React from 'react';
import { BaseNode, HandleConfig } from './BaseNode';

export const CombineNode = ({ id, data }: any) => {
  const handles: HandleConfig[] = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input1`,
      style: { top: '25%' }
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input2`,
      style: { top: '50%' }
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input3`,
      style: { top: '75%' }
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-output`
    }
  ];

  return (
    <BaseNode id={id} data={data} title="Combine" handles={handles}>
      <div style={{ fontSize: '12px', color: '#4A5568' }}>
        <p style={{ margin: 0 }}>Merge Inputs</p>
        <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#718096' }}>
          Combines multiple inputs into one output
        </p>
      </div>
    </BaseNode>
  );
};
