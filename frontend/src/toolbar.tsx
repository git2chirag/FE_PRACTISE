// toolbar.tsx

import React from 'react';
import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
    return (
        <div className="p-5 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="m-0 text-lg font-bold text-slate-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#4A6FA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            Node Toolbox
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 ml-7">Drag and drop nodes to build your pipeline</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <DraggableNode type='customInput' label='Input' />
                    <DraggableNode type='llm' label='LLM' />
                    <DraggableNode type='customOutput' label='Output' />
                    <DraggableNode type='text' label='Text' />
                    <DraggableNode type='transform' label='Transform' />
                    <DraggableNode type='filter' label='Filter' />
                    <DraggableNode type='combine' label='Combine' />
                    <DraggableNode type='api' label='API' />
                    <DraggableNode type='conditional' label='Conditional' />
                </div>
            </div>
        </div>
    );
};
