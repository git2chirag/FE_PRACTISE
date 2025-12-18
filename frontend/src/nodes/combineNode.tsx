// combineNode.tsx
// A node for combining multiple inputs

import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import React from 'react';
import { BaseNode, HandleConfig } from './BaseNode';
import { useStore } from '../store';

export const CombineNode = ({ id, data }: any) => {
  const [operation, setOperation] = useState<string>(data?.operation || 'concat');
  const updateNodeData = useStore((state) => state.updateNodeData);

  useEffect(() => {
    updateNodeData(id, { 
      operation,
      outputs: ['combined', 'count', 'metadata']
    });
  }, [operation, id, updateNodeData]);

  const handles: HandleConfig[] = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input-1`,
      style: { top: '25%' }
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input-2`,
      style: { top: '50%' }
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input-3`,
      style: { top: '75%' }
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-out`
    }
  ];

  return (
    <BaseNode id={id} data={data} title={<><i className="fas fa-link mr-2"></i>Combine</>} handles={handles} outputs={{ combined: 'combined result', count: 0, metadata: { operation } }} outputLabels={{ combined: 'combined', count: 'count', metadata: 'metadata' }}>
      <div className="flex flex-col gap-3">
        <label className="flex flex-col text-xs">
          <span className="mb-1.5 font-semibold text-slate-600">Operation:</span>
          <select 
            value={operation} 
            onChange={(e) => setOperation(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/30 focus:border-[#4A6FA5] transition-all bg-white hover:border-slate-300"
          >
            <option value="concat"><i className="fas fa-plus mr-2"></i>Concatenate</option>
            <option value="merge"><i className="fas fa-object-group mr-2"></i>Merge Objects</option>
            <option value="array"><i className="fas fa-list mr-2"></i>Create Array</option>
            <option value="join"><i className="fas fa-link mr-2"></i>Join with Delimiter</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};
