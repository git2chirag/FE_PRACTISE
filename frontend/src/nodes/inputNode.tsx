// inputNode.tsx

import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import React from 'react';
import { BaseNode, HandleConfig } from './BaseNode';
import { useStore } from '../store';

interface InputNodeProps {
  id: string;
  data: {
    inputName?: string;
    inputType?: string;
  };
}

export const InputNode: React.FC<InputNodeProps> = ({ id, data }) => {
  const [currName, setCurrName] = useState<string>(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState<string>(data.inputType || 'Text');
  const updateNodeData = useStore((state) => state.updateNodeData);

  // Update store when local state changes
  useEffect(() => {
    updateNodeData(id, { 
      inputName: currName, 
      inputType,
      outputs: [currName || 'value']
    });
  }, [currName, inputType, id, updateNodeData]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputType(e.target.value);
  };

  const handles: HandleConfig[] = [
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-out`
    }
  ];

  return (
    <BaseNode id={id} data={data} title="Input" handles={handles}>
      <div className="flex flex-col gap-3">
        <label className="flex flex-col text-xs">
          <span className="mb-1.5 font-semibold text-gray-700">Input Type:</span>
          <select 
            value={inputType} 
            onChange={handleTypeChange}
            className="px-3 py-2 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-400"
          >
            <option value="Text">📝 Text</option>
            <option value="File">📁 File</option>
            <option value="Number">🔢 Number</option>
            <option value="Boolean">✓ Boolean</option>
          </select>
        </label>
        <div className="text-xs mt-1 p-3 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-md">
          <div className="font-bold text-green-800 mb-1.5">Output:</div>
          <div className="flex items-center gap-2 text-green-700 font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{currName || 'value'}</span>
            <span className="text-green-600">({inputType})</span>
          </div>
        </div>
      </div>
    </BaseNode>
  );
}
