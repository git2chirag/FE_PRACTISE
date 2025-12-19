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
      className: `top-[${(index + 1) * (100 / (variables.length + 1))}%]`
    })),
    // Always show 1 handle on the left if no variables
    ...(variables.length === 0 ? [
      {
        type: 'target' as const,
        position: Position.Left,
        id: `${id}-input`,
      }
    ] : []),
    // Always show 1 handle on the right
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-output`,
    }
  ];

  return (
    <>
      <BaseNode id={id} data={data} title={<><i className="fas fa-robot mr-2"></i>LLM</>} handles={handles} outputs={{ response: '[LLM Response]', usage: '[Token Usage]', model_name: model || 'gpt-4' }} outputLabels={{ response: 'response', usage: 'usage', model_name: 'model_name' }}>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col text-xs">
            <span className="mb-1.5 font-semibold text-slate-600">Model:</span>
            <select 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/30 focus:border-[#4A6FA5] transition-all bg-white hover:border-slate-300"
            >
              <option value="gpt-4"><i className="fas fa-brain mr-2"></i>GPT-4</option>
              <option value="gpt-3.5-turbo"><i className="fas fa-bolt mr-2"></i>GPT-3.5 Turbo</option>
              <option value="claude-3"><i className="fas fa-theater-masks mr-2"></i>Claude 3</option>
            </select>
          </label>
          <label className="flex flex-col text-xs">
            <span className="mb-1.5 font-semibold text-slate-600">System Prompt (use {'{{'} variables {'}}'}):</span>
            <RichTextEditor
              nodeId={id}
              value={systemPrompt}
              onChange={handlePromptChange}
              placeholder="You are a helpful assistant. Use {{variable}} to insert values..."
              className="text-sm min-h-[80px] font-mono"
              pillColor="#4A6FA5"
            />
          </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col text-xs">
            <span className="mb-1.5 font-semibold text-slate-600">Temperature:</span>
            <input 
              type="number" 
              min="0" 
              max="2" 
              step="0.1"
              value={temperature} 
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/30 focus:border-[#4A6FA5] transition-all bg-white hover:border-slate-300"
            />
          </label>
          <label className="flex flex-col text-xs">
            <span className="mb-1.5 font-semibold text-slate-600">Max Tokens:</span>
            <input 
              type="number" 
              value={maxTokens} 
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/30 focus:border-[#4A6FA5] transition-all bg-white hover:border-slate-300"
            />
          </label>
        </div>
      </div>
      </BaseNode>
    </>
  );
}

