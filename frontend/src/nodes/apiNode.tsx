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
    <BaseNode id={id} data={data} title="🌐 API Call" handles={handles}>
      <div className="flex flex-col gap-3">
        <label className="flex flex-col text-xs">
          <span className="mb-1.5 font-semibold text-gray-700">Method:</span>
          <select 
            value={method} 
            onChange={(e) => setMethod(e.target.value)}
            className="px-3 py-2 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white hover:border-gray-400"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </label>
        <label className="flex flex-col text-xs">
          <span className="mb-1.5 font-semibold text-gray-700">URL:</span>
          <input 
            type="text" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/endpoint"
            className="px-3 py-2 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white hover:border-gray-400 font-mono"
          />
        </label>
        <label className="flex flex-col text-xs">
          <span className="mb-1.5 font-semibold text-gray-700">Headers (JSON):</span>
          <textarea 
            value={headers} 
            onChange={(e) => setHeaders(e.target.value)}
            placeholder='{"Authorization": "Bearer token"}'
            className="px-3 py-2 border-2 border-gray-300 rounded-md text-sm min-h-[60px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white hover:border-gray-400 font-mono"
          />
        </label>
        <div className="text-xs mt-1 p-3 bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-md">
          <div className="font-bold text-indigo-800 mb-2">Outputs:</div>
          <div className="text-indigo-700 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="font-medium">response</span>
              <span className="text-indigo-600">(object)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="font-medium">status</span>
              <span className="text-indigo-600">(number)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="font-medium">headers</span>
              <span className="text-indigo-600">(object)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="font-medium">error</span>
              <span className="text-indigo-600">(string)</span>
            </div>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};
