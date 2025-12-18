// outputNode.tsx

import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import React from 'react';
import { BaseNode, HandleConfig } from './BaseNode';
import { useStore } from '../store';

export const OutputNode = ({ id, data }: any) => {
  const [currName, setCurrName] = useState<string>(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState<string>(data.outputType || 'Text');
  const updateNodeData = useStore((state) => state.updateNodeData);

  useEffect(() => {
    updateNodeData(id, { outputName: currName, outputType });
  }, [currName, outputType, id, updateNodeData]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOutputType(e.target.value);
  };

  const handles: HandleConfig[] = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-in`
    }
  ];

  return (
    <BaseNode id={id} data={data} title={<><i className="fas fa-sign-out-alt mr-2"></i>Output</>} handles={handles}>
      <div className="flex flex-col gap-3">
        <label className="flex flex-col text-xs">
          <span className="mb-1.5 font-semibold text-gray-700">Output Type:</span>
          <select 
            value={outputType} 
            onChange={handleTypeChange}
            className="px-3 py-2 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white hover:border-gray-400"
          >
            <option value="Text"><i className="fas fa-file-alt mr-2"></i>Text</option>
            <option value="Image"><i className="fas fa-image mr-2"></i>Image</option>
            <option value="File"><i className="fas fa-folder mr-2"></i>File</option>
            <option value="JSON"><i className="fas fa-code mr-2"></i>JSON</option>
          </select>
        </label>
        <div className="text-xs mt-1 p-3 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-md">
          <div className="font-bold text-purple-800 mb-1.5">Final Output:</div>
          <div className="flex items-center gap-2 text-purple-700 font-medium">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>{currName || 'result'}</span>
            <span className="text-purple-600">({outputType})</span>
          </div>
        </div>
      </div>
    </BaseNode>
  );
}
