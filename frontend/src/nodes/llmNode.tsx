// llmNode.tsx

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

export const LLMNode = ({ id, data }: { id: string, data: any }) => {
  const [model, setModel] = useState<string>(data?.model || 'gpt-4');
  const [systemPrompt, setSystemPrompt] = useState<string>(data?.systemPrompt || '');
  const [temperature, setTemperature] = useState<number>(data?.temperature || 0.7);
  const [maxTokens, setMaxTokens] = useState<number>(data?.maxTokens || 1000);
  const [variables, setVariables] = useState<VariablePill[]>([]);
  const [showVariableSelector, setShowVariableSelector] = useState(false);
  const [selectorPosition, setSelectorPosition] = useState({ x: 0, y: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const updateNodeData = useStore((state) => state.updateNodeData);
  const setHighlightedNode = useStore((state) => state.setHighlightedNode);
  const createVariableConnection = useStore((state) => state.createVariableConnection);

  useEffect(() => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = [...systemPrompt.matchAll(regex)];
    const varPills: VariablePill[] = matches.map(match => ({
      name: match[1].trim(),
      nodeId: ''
    }));
    setVariables(varPills);
    updateNodeData(id, { 
      model, 
      systemPrompt, 
      temperature, 
      maxTokens,
      variables: varPills.map(v => v.name),
      outputs: ['response', 'usage', 'model_name']
    });
  }, [model, systemPrompt, temperature, maxTokens, id, updateNodeData]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSystemPrompt(value);
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
    const newText = systemPrompt.replace(/\{\{$/, `{{${variableName}}}`);
    setSystemPrompt(newText);
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
    const newText = systemPrompt.replace(new RegExp(`\\{\\{${varName}\\}\\}`, 'g'), '');
    setSystemPrompt(newText);
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
      id: `${id}-output`
    }
  ];

  return (
    <>
      <BaseNode id={id} data={data} title="🤖 LLM" handles={handles}>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col text-xs">
            <span className="mb-1.5 font-semibold text-gray-700">Model:</span>
            <select 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
              className="px-3 py-2 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white hover:border-gray-400"
            >
              <option value="gpt-4">🧠 GPT-4</option>
              <option value="gpt-3.5-turbo">⚡ GPT-3.5 Turbo</option>
              <option value="claude-3">🎭 Claude 3</option>
            </select>
          </label>
          <label className="flex flex-col text-xs">
            <span className="mb-1.5 font-semibold text-gray-700">System Prompt (use {'{{'} variables {'}}'}):</span>
            <textarea 
              ref={textareaRef}
              value={systemPrompt} 
              onChange={handlePromptChange}
              placeholder="You are a helpful assistant. Use {{variable}} to insert values..."
              className="px-3 py-2 border-2 border-gray-300 rounded-md text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white hover:border-gray-400 font-mono"
            />
          </label>
          {variables.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-purple-50 border border-purple-200 rounded-md">
              <span className="text-xs font-semibold text-purple-700">Variables:</span>
              {variables.map((varPill, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500 text-white rounded-full text-xs font-medium"
                >
                  <span>{varPill.name}</span>
                  <button
                    onClick={() => removeVariable(varPill.name)}
                    className="ml-1 hover:bg-purple-600 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                    title="Remove variable"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col text-xs">
            <span className="mb-1.5 font-semibold text-gray-700">Temperature:</span>
            <input 
              type="number" 
              min="0" 
              max="2" 
              step="0.1"
              value={temperature} 
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="px-3 py-2 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white hover:border-gray-400"
            />
          </label>
          <label className="flex flex-col text-xs">
            <span className="mb-1.5 font-semibold text-gray-700">Max Tokens:</span>
            <input 
              type="number" 
              value={maxTokens} 
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="px-3 py-2 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white hover:border-gray-400"
            />
          </label>
        </div>
        <div className="text-xs mt-1 p-3 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-md">
          <div className="font-bold text-purple-800 mb-2">Outputs:</div>
          <div className="text-purple-700 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="font-medium">response</span>
              <span className="text-purple-600">(string)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="font-medium">usage</span>
              <span className="text-purple-600">(object)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="font-medium">model_name</span>
              <span className="text-purple-600">(string)</span>
            </div>
          </div>
        </div>
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

