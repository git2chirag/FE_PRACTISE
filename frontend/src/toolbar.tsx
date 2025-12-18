// toolbar.tsx

import React from 'react';
import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
    return (
        <div className="p-4 bg-gray-50 border-b-2 border-gray-200">
            <h3 className="m-0 mb-3 text-base font-semibold text-gray-800">
                Node Toolbox
            </h3>
            <div className="flex flex-wrap gap-2.5">
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
    );
};
