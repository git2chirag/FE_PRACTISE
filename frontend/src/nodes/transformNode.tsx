// transformNode.tsx
// A node for transforming data

import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import React from 'react';
import { BaseNode, HandleConfig } from './BaseNode';
import { useStore } from '../store';

export const TransformNode = ({ id, data }: any) => {
  const [operation, setOperation] = useState<string>(data?.operation || 'uppercase');
  const updateNodeData = useStore((state) => state.updateNodeData);

  useEffect(() => {
    updateNodeData(id, { 
      operation,
      outputs: ['result', 'original', 'metadata']
    });
  }, [operation, id, updateNodeData]);

  const handles: HandleConfig[] = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-in`
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-out`
    }
  ];

  return (
    <BaseNode id={id} data={data} title={<><i className="fas fa-cogs mr-2"></i>Transform</>} handles={handles}>
      <div className="flex flex-col gap-3">
        <label className="flex flex-col text-xs">
          <span className="mb-1.5 font-semibold text-gray-700">Operation:</span>
          <select 
            value={operation} 
            onChange={(e) => setOperation(e.target.value)}
            className="px-3 py-2 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white hover:border-gray-400"
          >
            <option value="uppercase"><i className="fas fa-font mr-2"></i>Uppercase</option>
            <option value="lowercase"><i className="fas fa-font mr-2"></i>Lowercase</option>
            <option value="reverse"><i className="fas fa-undo mr-2"></i>Reverse</option>
            <option value="trim"><i className="fas fa-cut mr-2"></i>Trim</option>
            <option value="split"><i className="fas fa-cut mr-2"></i>Split</option>
            <option value="replace"><i className="fas fa-exchange-alt mr-2"></i>Replace</option>
          </select>
        </label>
        <div className="text-xs mt-1 p-3 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-md">
          <div className="font-bold text-orange-800 mb-2">Outputs:</div>
          <div className="text-orange-700 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="font-medium">result</span>
              <span className="text-orange-600">(any)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="font-medium">original</span>
              <span className="text-orange-600">(any)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="font-medium">metadata</span>
              <span className="text-orange-600">(object)</span>
            </div>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};
