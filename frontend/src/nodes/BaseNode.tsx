// BaseNode.tsx
// A flexible abstraction for creating different types of nodes

import React, { ReactNode, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteNode = useStore((state) => state.deleteNode);
  const updateNodeData = useStore((state) => state.updateNodeData);
  const highlightedNodeId = useStore((state) => state.highlightedNodeId);

  const handleDelete = () => {
    if (confirmDelete) {
      deleteNode(id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { name: e.target.value });
  };

  const isHighlighted = highlightedNodeId === id;

  return (
    <div 
      className={`min-w-[240px] min-h-[100px] p-4 rounded-xl bg-white shadow-lg relative transition-all duration-200 ${
        isHighlighted 
          ? 'ring-4 ring-blue-400 ring-opacity-60 shadow-xl scale-105 border-2 border-blue-300' 
          : 'border-2 border-gray-200 hover:shadow-xl hover:border-gray-300'
      } ${className}`}
      style={style}
    >
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className={`absolute top-3 right-3 w-6 h-6 rounded-full border-none flex items-center justify-center text-base font-bold transition-all z-10 ${
          confirmDelete 
            ? 'bg-red-500 text-white hover:bg-red-600 scale-110' 
            : 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600'
        }`}
        title={confirmDelete ? 'Click again to confirm delete' : 'Delete node'}
      >
        ×
      </button>
      
      {/* Confirmation Tooltip */}
      {confirmDelete && (
        <div className="absolute -top-10 right-3 bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap z-20 shadow-lg">
          Click again to confirm
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-600"></div>
        </div>
      )}

      {/* Render all handles */}
      {handles.map((handle, index) => (
        <React.Fragment key={`${id}-${handle.id}-${index}`}>
          <Handle
            type={handle.type}
            position={handle.position}
            id={handle.id}
            style={handle.style}
            className={`w-3 h-3 ${
              handle.type === 'source' 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-green-500 hover:bg-green-600'
            } border-2 border-white transition-all`}
          />
          {handle.label && (
            <div
              className="absolute text-xs font-medium text-gray-600"
              style={{
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
      <div className="text-base font-bold text-gray-800 mb-3 border-b-2 border-gray-200 pb-2 pr-8 bg-gradient-to-r from-gray-50 to-transparent -mx-4 px-4 -mt-4 pt-4 rounded-t-xl">
        {title}
      </div>
      
      {/* Name field */}
      <div className="mb-3">
        <label className="flex flex-col text-xs">
          <span className="mb-1.5 font-semibold text-gray-700">Node Name:</span>
          <input
            type="text"
            value={data?.name || id}
            onChange={handleNameChange}
            className="px-3 py-2 border-2 border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
            placeholder="Enter node name"
          />
        </label>
      </div>
      
      {/* Content */}
      <div>{children}</div>
    </div>
  );
};
