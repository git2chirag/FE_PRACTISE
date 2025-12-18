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
    <BaseNode id={id} data={data} title={<><i className="fas fa-filter mr-2"></i>Filter</>} handles={handles} outputs={{ match: 'filtered match', no_match: 'filtered no_match', metadata: { condition, value } }} outputLabels={{ match: 'match', no_match: 'no_match', metadata: 'metadata' }}>
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
      </div>
    </BaseNode>
  );
};
