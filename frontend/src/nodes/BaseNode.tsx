// BaseNode.tsx
// A flexible abstraction for creating different types of nodes

import React, { ReactNode } from 'react';
import { Handle, Position } from 'reactflow';

export interface HandleConfig {
  type: 'source' | 'target';
  position: Position;
  id: string;
  style?: React.CSSProperties;
  label?: string;
}

export interface BaseNodeProps {
  id: string;
  data: any;
  title: string;
  handles?: HandleConfig[];
  children?: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  id,
  data,
  title,
  handles = [],
  children,
  style = {},
  className = ''
}) => {
  const defaultStyle: React.CSSProperties = {
    minWidth: 200,
    minHeight: 80,
    padding: '12px 16px',
    border: '2px solid #4A5568',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    ...style
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#2D3748',
    marginBottom: '8px',
    borderBottom: '1px solid #E2E8F0',
    paddingBottom: '4px'
  };

  return (
    <div className={className} style={defaultStyle}>
      {/* Render all handles */}
      {handles.map((handle, index) => (
        <React.Fragment key={`${id}-${handle.id}-${index}`}>
          <Handle
            type={handle.type}
            position={handle.position}
            id={handle.id}
            style={handle.style}
          />
          {handle.label && (
            <div
              style={{
                position: 'absolute',
                fontSize: '10px',
                color: '#718096',
                ...(handle.position === Position.Left
                  ? { left: '-60px' }
                  : handle.position === Position.Right
                  ? { right: '-60px' }
                  : {}),
                ...handle.style
              }}
            >
              {handle.label}
            </div>
          )}
        </React.Fragment>
      ))}
      
      {/* Title */}
      <div style={titleStyle}>{title}</div>
      
      {/* Content */}
      <div>{children}</div>
    </div>
  );
};
