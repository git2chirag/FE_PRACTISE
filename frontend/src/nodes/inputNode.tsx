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
    <BaseNode id={id} data={data} title={<><i className="fas fa-sign-in-alt mr-2"></i>Input</>} handles={handles}>
      <div className="flex flex-col gap-3">
        <label className="flex flex-col text-xs">
          <span className="mb-1.5 font-semibold text-slate-600">Input Type:</span>
          <select 
            value={inputType} 
            onChange={handleTypeChange}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/30 focus:border-[#4A6FA5] transition-all bg-white hover:border-slate-300"
          >
            <option value="Text"><i className="fas fa-file-alt mr-2"></i>Text</option>
            <option value="File"><i className="fas fa-folder mr-2"></i>File</option>
            <option value="Number"><i className="fas fa-hashtag mr-2"></i>Number</option>
            <option value="Boolean"><i className="fas fa-check-square mr-2"></i>Boolean</option>
          </select>
        </label>
        <div className="text-xs mt-1 p-3 bg-gradient-to-br from-blue-50/50 to-slate-50 border border-slate-200 rounded-lg">
          <div className="font-bold text-slate-700 mb-1.5 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[#4A6FA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Output:
          </div>
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <div className="w-2 h-2 bg-[#4A6FA5] rounded-full"></div>
            <span>{currName || 'value'}</span>
            <span className="text-slate-500">({inputType})</span>
          </div>
        </div>
      </div>
    </BaseNode>
  );
}
