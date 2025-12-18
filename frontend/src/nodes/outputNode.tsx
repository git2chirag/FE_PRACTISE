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
          <span className="mb-1.5 font-semibold text-slate-600">Output Type:</span>
          <select 
            value={outputType} 
            onChange={handleTypeChange}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/30 focus:border-[#4A6FA5] transition-all bg-white hover:border-slate-300"
          >
            <option value="Text"><i className="fas fa-file-alt mr-2"></i>Text</option>
            <option value="Image"><i className="fas fa-image mr-2"></i>Image</option>
            <option value="File"><i className="fas fa-folder mr-2"></i>File</option>
            <option value="JSON"><i className="fas fa-code mr-2"></i>JSON</option>
          </select>
        </label>
        <div className="text-xs mt-1 p-3 bg-gradient-to-br from-blue-50/50 to-slate-50 border border-slate-200 rounded-lg">
          <div className="font-bold text-slate-700 mb-1.5 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[#4A6FA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Final Output:
          </div>
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <div className="w-2 h-2 bg-[#4A6FA5] rounded-full"></div>
            <span>{currName || 'result'}</span>
            <span className="text-slate-500">({outputType})</span>
          </div>
        </div>
      </div>
    </BaseNode>
  );
}
