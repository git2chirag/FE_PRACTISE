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
    <BaseNode id={id} data={data} title={<><i className="fas fa-filter mr-2"></i>Filter</>} handles={handles}>
      <div className="flex flex-col gap-2">
        <label className="flex flex-col text-xs">
          <span className="mb-1.5 font-semibold text-slate-600">Condition:</span>
          <select 
            value={condition} 
            onChange={(e) => setCondition(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/30 focus:border-[#4A6FA5] transition-all bg-white hover:border-slate-300"
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
          <span className="mb-1.5 font-semibold text-slate-600">Value:</span>
          <input 
            type="text" 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            placeholder="Filter value"
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/30 focus:border-[#4A6FA5] transition-all bg-white hover:border-slate-300"
          />
        </label>
        <div className="text-xs mt-2 p-3 bg-gradient-to-br from-blue-50/50 to-slate-50 border border-slate-200 rounded-lg">
          <div className="font-bold text-slate-700 mb-2 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[#4A6FA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Outputs:
          </div>
          <div className="text-slate-600 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#4A6FA5] rounded-full"></div>
              <span className="font-medium">match</span>
              <span className="text-slate-500">(any)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#5B8DBE] rounded-full"></div>
              <span className="font-medium">no_match</span>
              <span className="text-slate-500">(any)</span>
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
