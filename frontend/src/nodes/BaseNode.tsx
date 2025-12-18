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
  title: string | React.ReactNode;
  handles?: HandleConfig[];
  children?: ReactNode;
  style?: React.CSSProperties;
  className?: string;
  outputs?: Record<string, any>;
  outputLabels?: Record<string, string>;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  id,
  data,
  title,
  handles = [],
  children,
  style = {},
  className = '',
  outputs = {},
  outputLabels = {}
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteNode = useStore((state) => state.deleteNode);
  const updateNodeData = useStore((state) => state.updateNodeData);
  const highlightedNodeId = useStore((state) => state.highlightedNodeId);
  const showOutputs = useStore((state) => state.showOutputs);

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
      className={`min-w-[240px] min-h-[100px] p-4 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-md transition-all duration-300 ease-out hover:shadow-lg hover:border-blue-300 hover:-translate-y-0.5 ${
        isHighlighted 
          ? 'ring-2 ring-[#4A6FA5] ring-opacity-50 shadow-xl scale-105 border-2 border-[#5B8DBE]' 
          : ''
      } ${className}`}
      style={style}
    >
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className={`absolute top-2 right-2 w-7 h-7 rounded-lg border-none flex items-center justify-center text-lg font-bold transition-all duration-200 z-10 ${
          confirmDelete 
            ? 'bg-red-500 text-white hover:bg-red-600 scale-110 shadow-md' 
            : 'bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:shadow-sm'
        }`}
        title={confirmDelete ? 'Click again to confirm delete' : 'Delete node'}
      >
        ×
      </button>
      
      {/* Confirmation Tooltip */}
      {confirmDelete && (
        <div className="absolute -top-12 right-2 bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap z-20 shadow-xl animate-pulse">
          Click again to confirm
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
        </div>
      )}

      {/* Render all handles */}
      {handles.map((handle, index) => (
        <React.Fragment key={`${id}-${handle.id}-${index}`}>
          <Handle
            type={handle.type}
            position={handle.position}
            id={handle.id}
            className={`w-3 h-3 ${
              handle.type === 'source' 
                ? 'bg-[#4A6FA5] hover:bg-[#3B5A8C]' 
                : 'bg-[#5B8DBE] hover:bg-[#6B8EC7]'
            } border-2 border-white shadow-sm transition-all hover:scale-125`}
            style={handle.style}
          />
          {handle.label && (
            <div
              className={`absolute text-xs font-medium text-gray-600 ${
                handle.position === Position.Left
                  ? '-left-15'
                  : handle.position === Position.Right
                  ? '-right-15'
                  : ''
              }`}
            >
              {handle.label}
            </div>
          )}
        </React.Fragment>
      ))}
      
      {/* Title */}
      <div className="text-base font-bold text-slate-700 mb-3 border-b border-slate-200 pb-2 pr-8 bg-gradient-to-r from-slate-50 via-blue-50/30 to-transparent -mx-4 px-4 -mt-4 pt-4 rounded-t-xl flex items-center gap-2">
        {title}
      </div>
      
      {/* Name field */}
      <div className="mb-3">
        <label className="flex flex-col text-xs">
          <span className="mb-1.5 font-semibold text-slate-600">Node Name:</span>
          <input
            type="text"
            value={data?.name || id}
            onChange={handleNameChange}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/30 focus:border-[#4A6FA5] transition-all hover:border-slate-300"
            placeholder="Enter node name"
          />
        </label>
      </div>
      
      {/* Content */}
      <div>{children}</div>
      
      {/* Outputs */}
      {showOutputs && Object.keys(outputs).length > 0 && (
        <div className="text-xs mt-3 p-3 bg-gradient-to-br from-blue-50/50 to-slate-50 border border-slate-200 rounded-lg">
          <div className="font-bold text-slate-700 mb-2 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[#4A6FA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Outputs:
          </div>
          <div className="text-slate-600 space-y-1.5">
            {Object.entries(outputs).map(([key, value], index) => {
              const colors = ['#4A6FA5', '#5B8DBE', '#64748B', '#94A3B8'];
              const color = colors[index % colors.length];
              const label = outputLabels[key] || key;
              return (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: color }}></div>
                  <span className="font-medium">{label}</span>
                  <span className="text-slate-500">({typeof value})</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
