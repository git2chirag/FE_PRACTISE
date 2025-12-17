// submit.tsx
import React from 'react';
import { useStore } from './store';
import type { Node, Edge } from 'reactflow';

// Function to resolve variable references to actual values
const resolveVariables = (nodes: Node[], edges: Edge[]): Node[] => {
    // Create a map of node outputs
    const nodeOutputs: Record<string, any> = {};
    
    // First pass: collect all node outputs
    nodes.forEach(node => {
        const nodeData = node.data;
        
        // For input nodes, use the inputName as the output value
        if (node.type === 'customInput') {
            const outputName = nodeData.inputName || nodeData.outputs?.[0] || 'value';
            nodeOutputs[`${node.id}.${outputName}`] = nodeData.inputName || 'input_value';
        }
        // For LLM nodes, outputs are response, usage, model_name
        else if (node.type === 'llm') {
            nodeOutputs[`${node.id}.response`] = `[LLM Response from ${nodeData.model || 'GPT-4'}]`;
            nodeOutputs[`${node.id}.usage`] = '[Token Usage]';
            nodeOutputs[`${node.id}.model_name`] = nodeData.model || 'gpt-4';
        }
        // For other nodes with outputs
        else if (nodeData.outputs) {
            nodeData.outputs.forEach((output: string) => {
                nodeOutputs[`${node.id}.${output}`] = `[${output} from ${node.id}]`;
            });
        }
    });
    
    console.log('[Submit] Node outputs map:', nodeOutputs);
    
    // Second pass: resolve variables in text fields
    return nodes.map(node => {
        const nodeData = { ...node.data };
        
        // Resolve variables in text nodes
        if (node.type === 'text' && nodeData.text && nodeData.variables) {
            let resolvedText = nodeData.text;
            
            // Replace each variable with its actual value
            nodeData.variables.forEach((variable: string) => {
                const value = nodeOutputs[variable] || `{{${variable}}}`;
                // Replace the variable name with its value
                resolvedText = resolvedText.replace(variable, value);
            });
            
            console.log('[Submit] Resolved text node:', { 
                original: nodeData.text, 
                resolved: resolvedText,
                variables: nodeData.variables 
            });
            
            nodeData.resolvedText = resolvedText;
        }
        
        // Resolve variables in LLM system prompts
        if (node.type === 'llm' && nodeData.systemPrompt && nodeData.variables) {
            let resolvedPrompt = nodeData.systemPrompt;
            
            nodeData.variables.forEach((variable: string) => {
                const value = nodeOutputs[variable] || `{{${variable}}}`;
                resolvedPrompt = resolvedPrompt.replace(variable, value);
            });
            
            console.log('[Submit] Resolved LLM prompt:', { 
                original: nodeData.systemPrompt, 
                resolved: resolvedPrompt,
                variables: nodeData.variables 
            });
            
            nodeData.resolvedSystemPrompt = resolvedPrompt;
        }
        
        return { ...node, data: nodeData };
    });
};

export const SubmitButton = () => {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);

    const handleSubmit = async () => {
        try {
            // Resolve variables before submitting
            const resolvedNodes = resolveVariables(nodes, edges);
            
            console.log('[Submit] Original nodes:', nodes);
            console.log('[Submit] Resolved nodes:', resolvedNodes);
            
            const response = await fetch('http://127.0.0.1:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nodes: resolvedNodes, edges }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Display a user-friendly alert
            alert(
                `Pipeline Analysis:\n\n` +
                `Number of Nodes: ${data.num_nodes}\n` +
                `Number of Edges: ${data.num_edges}\n` +
                `Is DAG (Directed Acyclic Graph): ${data.is_dag ? 'Yes ✓' : 'No ✗'}\n\n` +
                (data.is_dag 
                    ? 'Your pipeline is valid!' 
                    : 'Warning: Your pipeline contains cycles!')
            );
        } catch (error) {
            console.error('Error submitting pipeline:', error);
            alert('Error: Could not connect to backend. Make sure the backend server is running on port 8000.');
        }
    };

    return (
        <div style={{
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '16px',
            backgroundColor: '#F7FAFC',
            borderTop: '2px solid #E2E8F0'
        }}>
            <button 
                type="button"
                onClick={handleSubmit}
                style={{
                    padding: '12px 32px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    backgroundColor: '#4299E1',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#3182CE';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#4299E1';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
            >
                Submit Pipeline
            </button>
        </div>
    );
}
