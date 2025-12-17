import { useState, useEffect, useRef } from 'react';
import { Position } from 'reactflow';
import React from 'react';
import { BaseNode, HandleConfig } from './BaseNode';
import { useStore } from '../store';
import { VariableSelector } from '../VariableSelector';

interface VariablePill {
  name: string;
  nodeId: string;
}

export const TextNode = ({ id, data }: any) => {
  const [currText, setCurrText] = useState<string>(data?.text || '');
  const [variables, setVariables] = useState<VariablePill[]>([]);
  const [showVariableSelector, setShowVariableSelector] = useState(false);
  const [selectorPosition, setSelectorPosition] = useState({ x: 0, y: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const updateNodeData = useStore((state) => state.updateNodeData);
  const setHighlightedNode = useStore((state) => state.setHighlightedNode);
  const createVariableConnection = useStore((state) => state.createVariableConnection);

  useEffect(() => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = [...currText.matchAll(regex)];
    const varPills: VariablePill[] = matches.map(match => ({
      name: match[1].trim(),
      nodeId: ''
    }));
    setVariables(varPills);
    updateNodeData(id, { text: currText, variables: varPills.map(v => v.name) });
  }, [currText, id, updateNodeData]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCurrText(value);
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastTwoChars = textBeforeCursor.slice(-2);
    if (lastTwoChars === '{{') {
      const rect = e.target.getBoundingClientRect();
      setSelectorPosition({ x: rect.left + 50, y: rect.top + 30 });
      setShowVariableSelector(true);
    } else if (!value.endsWith('{{')) {
      setShowVariableSelector(false);
      setHighlightedNode(null);
    }
  };

  const handleVariableSelect = (variableName: string, nodeId: string) => {
    const newText = currText.replace(/\{\{$/, `{{${variableName}}}`);
    setCurrText(newText);
    setShowVariableSelector(false);
    setHighlightedNode(null);
    if (nodeId) {
      createVariableConnection(nodeId, id, variableName);
    }
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  const handleSelectorClose = () => {
    setShowVariableSelector(false);
    setHighlightedNode(null);
  };

  const removeVariable = (varName: string) => {
    const newText = currText.replace(new RegExp(`\\{\\{${varName}\\}\\}`, 'g'), '');
    setCurrText(newText);
  };

  const calculateHeight = () => {
    const lineCount = currText.split('\n').length;
    const minHeight = 80;
    const lineHeight = 20;
    return Math.max(minHeight, lineCount * lineHeight + 20);
  };

  const handles: HandleConfig[] = [
    ...variables.map((varPill, index) => ({
      type: 'target' as const,
      position: Position.Left,
      id: `${id}-var-${varPill.name}-${index}`,
      style: { top: `${(index + 1) * (100 / (variables.length + 1))}%` }
    })),
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-out`
    }
  ];

  const textareaHeight = calculateHeight();

  return (
    <>
      <BaseNode
        id={id}
        data={data}
        title="Text"
        handles={handles}
        style={{ minWidth: Math.max(250, currText.length * 2), minHeight: textareaHeight + 100 }}
      >
        <div className="flex flex-col gap-3">
          <textarea
            ref={textareaRef}
            value={currText}
            onChange={handleTextChange}
            placeholder="Enter text with {{variables}}"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ minHeight: `${textareaHeight}px` }}
          />
          {variables.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
              <span className="text-xs font-semibold text-blue-700">Variables:</span>
              {variables.map((varPill, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded-full text-xs font-medium"
                >
                  <span>{varPill.name}</span>
                  <button
                    onClick={() => removeVariable(varPill.name)}
                    className="ml-1 hover:bg-blue-600 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                    title="Remove variable"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </BaseNode>
      <VariableSelector
        isOpen={showVariableSelector}
        position={selectorPosition}
        onSelect={handleVariableSelect}
        onClose={handleSelectorClose}
        selfNodeId={id}
      />
    </>
  );
}
