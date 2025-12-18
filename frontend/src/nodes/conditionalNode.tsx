// conditionalNode.tsx
// A node for conditional logic

import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import React from 'react';
import { BaseNode, HandleConfig } from './BaseNode';
import { useStore } from '../store';

export const ConditionalNode = ({ id, data }: any) => {
  const [condition, setCondition] = useState<string>(data?.condition || 'if');
  const [operator, setOperator] = useState<string>(data?.operator || '==');
  const updateNodeData = useStore((state) => state.updateNodeData);

  useEffect(() => {
    updateNodeData(id, { 
      condition, 
      operator,
      outputs: ['true_branch', 'false_branch', 'metadata']
    });
  }, [condition, operator, id, updateNodeData]);

  const handles: HandleConfig[] = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-in-condition`,
      style: { top: '33%' }
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-in-value`,
      style: { top: '66%' }
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-out-true`,
      style: { top: '33%' }
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-out-false`,
      style: { top: '66%' }
    }
  ];

  return (
    <BaseNode id={id} data={data} title={<><i className="fas fa-code-branch mr-2"></i>Conditional</>} handles={handles} outputs={{ true_branch: 'Conditional result (true)', false_branch: 'Conditional result (false)', metadata: { condition: condition, operator: operator } }} outputLabels={{ true_branch: 'true_branch', false_branch: 'false_branch', metadata: 'metadata' }}>
      <div className="flex flex-col gap-2">
        <label className="flex flex-col text-xs">
          <span className="mb-1.5 font-semibold text-slate-600">Type:</span>
          <select 
            value={condition} 
            onChange={(e) => setCondition(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/30 focus:border-[#4A6FA5] transition-all bg-white hover:border-slate-300"
          >
            <option value="if">If/Else</option>
            <option value="switch">Switch</option>
            <option value="ternary">Ternary</option>
          </select>
        </label>
        <label className="flex flex-col text-xs">
          <span className="mb-1.5 font-semibold text-slate-600">Operator:</span>
          <select 
            value={operator} 
            onChange={(e) => setOperator(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/30 focus:border-[#4A6FA5] transition-all bg-white hover:border-slate-300"
          >
            <option value="==">Equals (==)</option>
            <option value="!=">Not Equals (!=)</option>
            <option value=">">Greater Than (&gt;)</option>
            <option value="<">Less Than (&lt;)</option>
            <option value=">=">Greater or Equal (&gt;=)</option>
            <option value="<=">Less or Equal (&lt;=)</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};
