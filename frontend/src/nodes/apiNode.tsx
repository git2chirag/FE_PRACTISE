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
    <BaseNode id={id} data={data} title={<><i className="fas fa-globe mr-2"></i>API Call</>} handles={handles} outputs={{ response: { data: 'API response' }, status: 200, headers: { 'content-type': 'application/json' }, error: null }} outputLabels={{ response: 'response', status: 'status', headers: 'headers', error: 'error' }}>
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
      </div>
    </BaseNode>
  );
};
