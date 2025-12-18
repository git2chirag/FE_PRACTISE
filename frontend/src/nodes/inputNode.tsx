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
    <BaseNode id={id} data={data} title={<><i className="fas fa-sign-in-alt mr-2"></i>Input</>} handles={handles} outputs={{ [currName]: currName || 'value' }} outputLabels={{ [currName]: currName || 'value' }}>
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
      </div>
    </BaseNode>
  );
}
