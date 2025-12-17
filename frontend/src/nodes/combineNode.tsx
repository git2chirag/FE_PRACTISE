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
    <BaseNode id={id} data={data} title="🔗 Combine" handles={handles}>
      <div className="flex flex-col gap-3">
        <label className="flex flex-col text-xs">
          <span className="mb-1.5 font-semibold text-gray-700">Operation:</span>
          <select 
            value={operation} 
            onChange={(e) => setOperation(e.target.value)}
            className="px-3 py-2 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all bg-white hover:border-gray-400"
          >
            <option value="concat">📝 Concatenate</option>
            <option value="merge">🔄 Merge Objects</option>
            <option value="array">📚 Create Array</option>
            <option value="join">🔗 Join with Delimiter</option>
          </select>
        </label>
        <div className="text-xs mt-1 p-3 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-md">
          <div className="font-bold text-yellow-800 mb-2">Outputs:</div>
          <div className="text-yellow-700 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="font-medium">combined</span>
              <span className="text-yellow-600">(any)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="font-medium">count</span>
              <span className="text-yellow-600">(number)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="font-medium">metadata</span>
              <span className="text-yellow-600">(object)</span>
            </div>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};
