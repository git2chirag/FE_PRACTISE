// toolbar.tsx

import React from 'react';
import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
    return (
        <div style={{ 
            padding: '16px', 
            backgroundColor: '#F7FAFC',
            borderBottom: '2px solid #E2E8F0'
        }}>
            <h3 style={{ 
                margin: '0 0 12px 0', 
                fontSize: '16px', 
                fontWeight: 600,
                color: '#2D3748'
            }}>
                Node Toolbox
            </h3>
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '10px' 
            }}>
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
