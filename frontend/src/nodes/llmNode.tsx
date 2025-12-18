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
      <BaseNode id={id} data={data} title={<><i className="fas fa-robot mr-2"></i>LLM</>} handles={handles}>
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
              pillColor="purple"
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
        <div className="text-xs mt-1 p-3 bg-gradient-to-br from-blue-50/50 to-slate-50 border border-slate-200 rounded-lg">
          <div className="font-bold text-slate-700 mb-2 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[#4A6FA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Outputs:
          </div>
          <div className="text-slate-600 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#4A6FA5] rounded-full"></div>
              <span className="font-medium">response</span>
              <span className="text-slate-500">(string)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#5B8DBE] rounded-full"></div>
              <span className="font-medium">usage</span>
              <span className="text-slate-500">(object)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#64748B] rounded-full"></div>
              <span className="font-medium">model_name</span>
              <span className="text-slate-500">(string)</span>
            </div>
          </div>
        </div>
      </div>
      </BaseNode>
    </>
  );
}

