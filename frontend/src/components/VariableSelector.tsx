// VariableSelector.tsx
// Component for selecting variables from available nodes

import React, { useState, useEffect, useRef } from 'react';
import { StoreState, useStore } from '../store';

interface VariableSelectorProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onSelect: (variableName: string, nodeId: string) => void;
  onClose: () => void;
  selfNodeId: string;
}

interface OutputOption {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  outputName: string;
  outputType?: string;
}

export const VariableSelector: React.FC<VariableSelectorProps> = ({
  isOpen,
  position,
  onSelect,
  onClose,
  selfNodeId
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const nodes = useStore((state: StoreState) => state.nodes);
  const setHighlightedNode = useStore((state: any) => state.setHighlightedNode);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get all upstream nodes for the current no
  // Filter to show only upstream nodes (nodes that come before this one)
  const outputOptions: OutputOption[] = [];
  nodes.forEach((node: any) => {
    // Skip self node
    if (node.id === selfNodeId) {
      return;
    }
     
    const outputs = node.data?.outputs || [];
    if (outputs.length > 0) {
      outputs.forEach((output: string) => {
        outputOptions.push({
          nodeId: node.id,
          nodeName: node.data?.name || node.id,
          nodeType: node.type,
          outputName: output,
          outputType: typeof output === 'string' ? 'any' : 'unknown'
        });
      });
    } else {
      // Show nodes without outputs too, with default output
      outputOptions.push({
        nodeId: node.id,
        nodeName: node.data?.name || node.id,
        nodeType: node.type,
        outputName: 'output',
        outputType: 'any'
      });
    }
  });

  // Don't auto-focus dropdown to keep editor focus
  // useEffect(() => {
  //   if (isOpen && dropdownRef.current) {
  //     dropdownRef.current.focus();
  //   }
  // }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          setSelectedIndex(prev => Math.min(prev + 1, outputOptions.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          if (outputOptions[selectedIndex]) {
            const option = outputOptions[selectedIndex];
            onSelect(`${option.nodeName}.${option.outputName}`, option.nodeId);
          }
          break;
        case 'Escape':
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, selectedIndex, outputOptions, onSelect, onClose]);

  // Update highlighting when selection changes
  useEffect(() => {
    if (isOpen && outputOptions[selectedIndex]) {
      setHighlightedNode(outputOptions[selectedIndex].nodeId);
    } else {
      setHighlightedNode(null);
    }
  }, [selectedIndex, isOpen, outputOptions, setHighlightedNode]);

  if (!isOpen) return null;

  const getNodeTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      customInput: 'Input',
      llm: 'LLM',
      transform: 'Transform',
      combine: 'Combine',
      api: 'API',
      conditional: 'Conditional',
      filter: 'Filter'
    };
    return labels[type] || type;
  };

  const getNodeTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      customInput: '#48BB78',
      llm: '#9F7AEA',
      transform: '#ED8936',
      combine: '#D69E2E',
      api: '#805AD5',
      conditional: '#E53E3E',
      filter: '#38B2AC'
    };
    return colors[type] || '#A0AEC0';
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 z-[999]"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
      />
      {/* Selector */}
      <div
        ref={dropdownRef}
        className="fixed bg-white border-2 border-blue-400 rounded-xl shadow-2xl z-[1000] min-w-[320px] max-w-[400px] max-h-[450px] overflow-hidden"
        style={{
          left: '0',
          top: `100%`,
        }}
        tabIndex={-1}
      >
        <div className="px-4 py-3 border-b-2 border-blue-200 text-sm font-bold text-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-10">
          <i className="fas fa-link mr-2"></i>Select Output Variable
        </div>
        <div className="max-h-[350px] overflow-y-auto">
          {outputOptions.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">No variables available.<br/>Add an Input, LLM, or other node with outputs.</div>
          ) : (
            outputOptions.map((option, index) => (
              <div
                key={`${option.nodeId}-${option.outputName}`}
                className={`px-4 py-3 cursor-pointer border-b border-gray-100 transition-all duration-150 ${
                  index === selectedIndex 
                    ? 'bg-blue-100 border-l-4 border-l-blue-500' 
                    : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('[VariableSelector] Option selected:', { option, nodeId: option.nodeId });
                  onSelect(`${option.nodeName}.${option.outputName}`, option.nodeId);
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: getNodeTypeColor(option.nodeType) }}
                      />
                      <span className="text-sm font-semibold text-gray-800 truncate">
                        {option.nodeName}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full font-medium">
                        {getNodeTypeLabel(option.nodeType)}
                      </span>
                    </div>
                    <div className="text-sm text-blue-600 pl-5 font-mono font-medium">
                      → {option.outputName}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="px-4 py-2.5 border-t-2 border-gray-200 text-xs text-gray-600 text-center bg-gray-50 sticky bottom-0 font-medium">
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">↑↓</kbd>
            navigate
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs ml-2">Enter</kbd>
            select
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs ml-2">Esc</kbd>
            close
          </span>
        </div>
      </div>
    </>
  );
};