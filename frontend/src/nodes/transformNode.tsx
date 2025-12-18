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
    <BaseNode id={id} data={data} title={<><i className="fas fa-cogs mr-2"></i>Transform</>} handles={handles} outputs={{ result: 'transformed result', original: 'original input', metadata: { operation, timestamp: new Date().toISOString() } }} outputLabels={{ result: 'result', original: 'original', metadata: 'metadata' }}>
      <div className="flex flex-col gap-3">
        <label className="flex flex-col text-xs">
          <span className="mb-1.5 font-semibold text-slate-600">Operation:</span>
          <select 
            value={operation} 
            onChange={(e) => setOperation(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/30 focus:border-[#4A6FA5] transition-all bg-white hover:border-slate-300"
          >
            <option value="uppercase"><i className="fas fa-font mr-2"></i>Uppercase</option>
            <option value="lowercase"><i className="fas fa-font mr-2"></i>Lowercase</option>
            <option value="reverse"><i className="fas fa-undo mr-2"></i>Reverse</option>
            <option value="trim"><i className="fas fa-cut mr-2"></i>Trim</option>
            <option value="split"><i className="fas fa-cut mr-2"></i>Split</option>
            <option value="replace"><i className="fas fa-exchange-alt mr-2"></i>Replace</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};
