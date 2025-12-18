// apiNode.tsx
// A node for making API calls

import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import React from 'react';
import { BaseNode, HandleConfig } from './BaseNode';
import { useStore } from '../store';

export const APINode = ({ id, data }: any) => {
  const [method, setMethod] = useState<string>(data?.method || 'GET');
  const [url, setUrl] = useState<string>(data?.url || '');
  const [headers, setHeaders] = useState<string>(data?.headers || '');
  const updateNodeData = useStore((state) => state.updateNodeData);

  useEffect(() => {
    updateNodeData(id, { 
      method, 
      url, 
      headers,
      outputs: ['response', 'status', 'headers', 'error']
    });
  }, [method, url, headers, id, updateNodeData]);

  const handles: HandleConfig[] = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-in-params`,
      style: { top: '33%' }
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-in-body`,
      style: { top: '66%' }
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-out`
    }
  ];

  return (
    <BaseNode id={id} data={data} title={<><i className="fas fa-globe mr-2"></i>API Call</>} handles={handles}>
      <div className="flex flex-col gap-3">
        <label className="flex flex-col text-xs">
          <span className="mb-1.5 font-semibold text-slate-600">Method:</span>
          <select 
            value={method} 
            onChange={(e) => setMethod(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/30 focus:border-[#4A6FA5] transition-all bg-white hover:border-slate-300"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </label>
        <label className="flex flex-col text-xs">
          <span className="mb-1.5 font-semibold text-slate-600">URL:</span>
          <input 
            type="text" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/endpoint"
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/30 focus:border-[#4A6FA5] transition-all bg-white hover:border-slate-300 font-mono"
          />
        </label>
        <label className="flex flex-col text-xs">
          <span className="mb-1.5 font-semibold text-slate-600">Headers (JSON):</span>
          <textarea 
            value={headers} 
            onChange={(e) => setHeaders(e.target.value)}
            placeholder='{"Authorization": "Bearer token"}'
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm min-h-[60px] focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/30 focus:border-[#4A6FA5] transition-all bg-white hover:border-slate-300 font-mono"
          />
        </label>
        <div className="text-xs mt-1 p-3 bg-gradient-to-br from-blue-50/50 to-slate-50 border border-slate-200 rounded-lg">
          <div className="font-bold text-slate-700 mb-2 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[#4A6FA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Outputs:
          </div>
          <div className="text-slate-600 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#4A6FA5] rounded-full"></div>
              <span className="font-medium">response</span>
              <span className="text-slate-500">(object)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#5B8DBE] rounded-full"></div>
              <span className="font-medium">status</span>
              <span className="text-slate-500">(number)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#64748B] rounded-full"></div>
              <span className="font-medium">headers</span>
              <span className="text-slate-500">(object)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#94A3B8] rounded-full"></div>
              <span className="font-medium">error</span>
              <span className="text-slate-500">(string)</span>
            </div>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};
