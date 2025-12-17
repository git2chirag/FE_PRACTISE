// apiNode.tsx
// A node for making API calls

import { useState } from 'react';
import { Position } from 'reactflow';
import React from 'react';
import { BaseNode, HandleConfig } from './BaseNode';

export const APINode = ({ id, data }: any) => {
  const [method, setMethod] = useState<string>(data?.method || 'GET');
  const [url, setUrl] = useState<string>(data?.url || '');

  const handles: HandleConfig[] = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-params`,
      style: { top: '33%' }
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-body`,
      style: { top: '66%' }
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-response`
    }
  ];

  return (
    <BaseNode id={id} data={data} title="API Call" handles={handles}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px' }}>
          <span style={{ marginBottom: '4px', fontWeight: 500 }}>Method:</span>
          <select 
            value={method} 
            onChange={(e) => setMethod(e.target.value)}
            style={{
              padding: '4px 8px',
              border: '1px solid #CBD5E0',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px' }}>
          <span style={{ marginBottom: '4px', fontWeight: 500 }}>URL:</span>
          <input 
            type="text" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            style={{
              padding: '4px 8px',
              border: '1px solid #CBD5E0',
              borderRadius: '4px',
              fontSize: '12px'
            }}
            placeholder="https://api.example.com"
          />
        </label>
      </div>
    </BaseNode>
  );
};
