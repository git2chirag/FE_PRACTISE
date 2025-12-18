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
    <BaseNode id={id} data={data} title={<><i className="fas fa-link mr-2"></i>Combine</>} handles={handles}>
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
        <div className="text-xs mt-1 p-3 bg-gradient-to-br from-blue-50/50 to-slate-50 border border-slate-200 rounded-lg">
          <div className="font-bold text-slate-700 mb-2 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[#4A6FA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Outputs:
          </div>
          <div className="text-slate-600 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#4A6FA5] rounded-full"></div>
              <span className="font-medium">combined</span>
              <span className="text-slate-500">(any)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#5B8DBE] rounded-full"></div>
              <span className="font-medium">count</span>
              <span className="text-slate-500">(number)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#64748B] rounded-full"></div>
              <span className="font-medium">metadata</span>
              <span className="text-slate-500">(object)</span>
            </div>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};
