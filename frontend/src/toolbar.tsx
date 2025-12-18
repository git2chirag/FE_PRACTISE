// toolbar.tsx

import React from 'react';
import { DraggableNode } from './draggableNode';
import { useStore } from './store';

export const PipelineToolbar = () => {
    const { showOutputs, toggleOutputs } = useStore();

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
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleOutputs}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                showOutputs 
                                    ? 'bg-[#4A6FA5] text-white hover:bg-[#3D5A8A] shadow-md' 
                                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showOutputs ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"} />
                            </svg>
                            {showOutputs ? 'Hide Outputs' : 'Show Outputs'}
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <DraggableNode type='customInput' label='Input' icon={<i className="fa-solid fa-keyboard"></i>}/>
                    <DraggableNode type='llm' label='LLM' icon={<i className="fa-solid fa-robot"></i>} />
                    <DraggableNode type='customOutput' label='Output' icon={<i className="fa-solid fa-upload"></i>} />
                    <DraggableNode type='text' label='Text' icon={<i className="fa-solid fa-file-alt"></i>} />
                    <DraggableNode type='transform' label='Transform' icon={<i className="fa-solid fa-exchange-alt"></i>} />
                    <DraggableNode type='filter' label='Filter' icon={<i className="fa-solid fa-filter"></i>} />
                    <DraggableNode type='combine' label='Combine' icon={<i className="fa-solid fa-layer-group"></i>} />
                    <DraggableNode type='api' label='API' icon={<i className="fa-solid fa-cloud"></i>} />
                    <DraggableNode type='conditional' label='Conditional' icon={<i className="fa-solid fa-code-branch"></i>} />
                </div>
            </div>
        </div>
    );
};
