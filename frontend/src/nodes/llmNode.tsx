// llmNode.tsx

import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import React from 'react';
import { BaseNode, HandleConfig } from './BaseNode';
import { useStore } from '../store';
import { RichTextEditor } from '../components/RichTextEditor';

export const LLMNode = ({ id, data }: { id: string, data: any }) => {
  const [model, setModel] = useState<string>(data?.model || 'gpt-4');
  const [systemPrompt, setSystemPrompt] = useState<string>(data?.systemPrompt || '');
  const [temperature, setTemperature] = useState<number>(data?.temperature || 0.7);
  const [maxTokens, setMaxTokens] = useState<number>(data?.maxTokens || 1000);
  const [variables, setVariables] = useState<string[]>([]);
  const updateNodeData = useStore((state) => state.updateNodeData);

  useEffect(() => {
    updateNodeData(id, { 
      model, 
      systemPrompt, 
      temperature, 
      maxTokens,
      variables: variables,
      outputs: ['response', 'usage', 'model_name']
    });
  }, [model, systemPrompt, temperature, maxTokens, variables, id, updateNodeData]);

  const handlePromptChange = (text: string, vars: string[]) => {
    setSystemPrompt(text);
    setVariables(vars);
  };

  const handles: HandleConfig[] = [
    ...variables.map((varName, index) => ({
      type: 'target' as const,
      position: Position.Left,
      id: `${id}-var-${varName}-${index}`,
      style: { top: `${(index + 1) * (100 / (variables.length + 1))}%` }
    })),
    // Always show 1 handle on the left if no variables
    ...(variables.length === 0 ? [
      {
        type: 'target' as const,
        position: Position.Left,
        id: `${id}-input`,
        style: { top: '50%' }
      }
    ] : []),
    // Always show 1 handle on the right
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-output`,
      style: { top: '50%' }
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
            <RichTextEditor
              nodeId={id}
              value={systemPrompt}
              onChange={handlePromptChange}
              placeholder="You are a helpful assistant. Use {{variable}} to insert values..."
              className="text-sm min-h-[80px] font-mono"
              pillColor="purple"
            />
          </label>
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
    </>
  );
}

