// filterNode.tsx
// A node for filtering data

import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import React from 'react';
import { BaseNode, HandleConfig } from './BaseNode';
import { useStore } from '../store';

export const FilterNode = ({ id, data }: any) => {
  const [condition, setCondition] = useState<string>(data?.condition || 'contains');
  const [value, setValue] = useState<string>(data?.value || '');
  const updateNodeData = useStore((state) => state.updateNodeData);

  useEffect(() => {
    updateNodeData(id, { 
      condition, 
      value,
      outputs: ['match', 'no_match', 'metadata']
    });
  }, [condition, value, id, updateNodeData]);

  const handles: HandleConfig[] = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-in`
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-out-match`,
      style: { top: '33%' }
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-out-nomatch`,
      style: { top: '66%' }
    }
  ];

  return (
    <BaseNode id={id} data={data} title="Filter" handles={handles}>
      <div className="flex flex-col gap-2">
        <label className="flex flex-col text-xs">
          <span className="mb-1 font-medium">Condition:</span>
          <select 
            value={condition} 
            onChange={(e) => setCondition(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="contains">Contains</option>
            <option value="equals">Equals</option>
            <option value="startsWith">Starts With</option>
            <option value="endsWith">Ends With</option>
            <option value="greaterThan">Greater Than</option>
            <option value="lessThan">Less Than</option>
          </select>
        </label>
        <label className="flex flex-col text-xs">
          <span className="mb-1 font-medium">Value:</span>
          <input 
            type="text" 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            placeholder="Filter value"
            className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <div className="text-xs text-gray-600 mt-1 p-2 bg-teal-50 rounded">
          <span className="font-medium">Outputs:</span>
          <div className="text-gray-700 mt-1 space-y-0.5">
            <div>• match: any</div>
            <div>• no_match: any</div>
            <div>• metadata: object</div>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};
