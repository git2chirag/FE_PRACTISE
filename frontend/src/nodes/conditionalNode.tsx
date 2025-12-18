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
    <BaseNode id={id} data={data} title={<><i className="fas fa-code-branch mr-2"></i>Conditional</>} handles={handles}>
      <div className="flex flex-col gap-2">
        <label className="flex flex-col text-xs">
          <span className="mb-1 font-medium">Type:</span>
          <select 
            value={condition} 
            onChange={(e) => setCondition(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="if">If/Else</option>
            <option value="switch">Switch</option>
            <option value="ternary">Ternary</option>
          </select>
        </label>
        <label className="flex flex-col text-xs">
          <span className="mb-1 font-medium">Operator:</span>
          <select 
            value={operator} 
            onChange={(e) => setOperator(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="==">Equals (==)</option>
            <option value="!=">Not Equals (!=)</option>
            <option value=">">Greater Than (&gt;)</option>
            <option value="<">Less Than (&lt;)</option>
            <option value=">=">Greater or Equal (&gt;=)</option>
            <option value="<=">Less or Equal (&lt;=)</option>
          </select>
        </label>
        <div className="text-xs text-gray-600 mt-1 p-2 bg-red-50 rounded">
          <span className="font-medium">Outputs:</span>
          <div className="text-gray-700 mt-1 space-y-0.5">
            <div>• true_branch: any</div>
            <div>• false_branch: any</div>
            <div>• metadata: object</div>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};
