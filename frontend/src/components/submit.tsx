// submit.tsx
import React from 'react';
import { useStore } from '../store';
import type { Node, Edge } from 'reactflow';

// Helper function to get input values for a node
const getNodeInputs = (nodeId: string, edges: Edge[], nodeOutputs: Record<string, any>): any[] => {
    const inputs: any[] = [];
    edges.forEach(edge => {
        if (edge.target === nodeId) {
            const sourceNode = edge.source;
            // Get all outputs from source node
            Object.keys(nodeOutputs).forEach(key => {
                if (key.startsWith(`${sourceNode}.`)) {
                    inputs.push(nodeOutputs[key]);
                }
            });
        }
    });
    return inputs;
};

// Function to resolve variable references to actual values
const resolveVariables = (nodes: Node[], edges: Edge[]): Node[] => {
    // Create a map of node outputs
    const nodeOutputs: Record<string, any> = {};
    
    // First pass: collect all node outputs and process them
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
        // For transform nodes - apply the operation dynamically
        else if (node.type === 'transform') {
            const inputs = getNodeInputs(node.id, edges, nodeOutputs);
            const inputValue = inputs[0] || 'sample_input';
            const operation = nodeData.operation || 'uppercase';
            
            let result = inputValue;
            switch (operation) {
                case 'uppercase':
                    result = String(inputValue).toUpperCase();
                    break;
                case 'lowercase':
                    result = String(inputValue).toLowerCase();
                    break;
                case 'reverse':
                    result = String(inputValue).split('').reverse().join('');
                    break;
                case 'trim':
                    result = String(inputValue).trim();
                    break;
                case 'split':
                    result = String(inputValue).split(' ');
                    break;
                case 'replace':
                    result = String(inputValue).replace(/[0-9]/g, 'X');
                    break;
            }
            
            nodeOutputs[`${node.id}.result`] = result;
            nodeOutputs[`${node.id}.original`] = inputValue;
            nodeOutputs[`${node.id}.metadata`] = { operation, timestamp: new Date().toISOString() };
        }
        // For filter nodes - apply the condition dynamically
        else if (node.type === 'filter') {
            const inputs = getNodeInputs(node.id, edges, nodeOutputs);
            const inputValue = inputs[0] || 'sample_input';
            const condition = nodeData.condition || 'contains';
            const filterValue = nodeData.value || '';
            
            let matches = false;
            const strInput = String(inputValue);
            
            switch (condition) {
                case 'contains':
                    matches = strInput.includes(filterValue);
                    break;
                case 'equals':
                    matches = strInput === filterValue;
                    break;
                case 'startsWith':
                    matches = strInput.startsWith(filterValue);
                    break;
                case 'endsWith':
                    matches = strInput.endsWith(filterValue);
                    break;
                case 'greaterThan':
                    matches = parseFloat(strInput) > parseFloat(filterValue);
                    break;
                case 'lessThan':
                    matches = parseFloat(strInput) < parseFloat(filterValue);
                    break;
            }
            
            nodeOutputs[`${node.id}.match`] = matches ? inputValue : null;
            nodeOutputs[`${node.id}.no_match`] = !matches ? inputValue : null;
            nodeOutputs[`${node.id}.metadata`] = { condition, filterValue, matches };
        }
        // For combine nodes - combine inputs dynamically
        else if (node.type === 'combine') {
            const inputs = getNodeInputs(node.id, edges, nodeOutputs);
            const operation = nodeData.operation || 'concat';
            
            let combined;
            switch (operation) {
                case 'concat':
                    combined = inputs.join('');
                    break;
                case 'merge':
                    combined = Object.assign({}, ...inputs.filter(i => typeof i === 'object'));
                    break;
                case 'array':
                    combined = inputs;
                    break;
                case 'join':
                    combined = inputs.join(', ');
                    break;
            }
            
            nodeOutputs[`${node.id}.combined`] = combined;
            nodeOutputs[`${node.id}.count`] = inputs.length;
            nodeOutputs[`${node.id}.metadata`] = { operation, inputCount: inputs.length };
        }
        // For API nodes - simulate API call
        else if (node.type === 'api') {
            const method = nodeData.method || 'GET';
            const url = nodeData.url || 'https://api.example.com';
            
            nodeOutputs[`${node.id}.response`] = { data: 'API response data', url, method };
            nodeOutputs[`${node.id}.status`] = 200;
            nodeOutputs[`${node.id}.headers`] = { 'content-type': 'application/json' };
            nodeOutputs[`${node.id}.error`] = null;
        }
        // For conditional nodes - evaluate condition dynamically
        else if (node.type === 'conditional') {
            const inputs = getNodeInputs(node.id, edges, nodeOutputs);
            const conditionValue = inputs[0] || null;
            const compareValue = inputs[1] || null;
            const operator = nodeData.operator || '==';
            
            let result = false;
            switch (operator) {
                case '==':
                    result = conditionValue == compareValue;
                    break;
                case '!=':
                    result = conditionValue != compareValue;
                    break;
                case '>':
                    result = conditionValue > compareValue;
                    break;
                case '<':
                    result = conditionValue < compareValue;
                    break;
                case '>=':
                    result = conditionValue >= compareValue;
                    break;
                case '<=':
                    result = conditionValue <= compareValue;
                    break;
            }
            
            nodeOutputs[`${node.id}.true_branch`] = result ? conditionValue : null;
            nodeOutputs[`${node.id}.false_branch`] = !result ? conditionValue : null;
            nodeOutputs[`${node.id}.metadata`] = { operator, result, conditionValue, compareValue };
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

// Function to build adjacency list from nodes and edges
const buildAdjacencyList = (nodes: Node[], edges: Edge[]): Record<string, string[]> => {
    const adjacencyList: Record<string, string[]> = {};
    // Initialize all nodes with empty arrays
    nodes.forEach(node => {
        adjacencyList[node.id] = [];
    });
    // Add targets for each source
    edges.forEach(edge => {
        adjacencyList[edge.source].push(edge.target);
    });
    return adjacencyList;
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
            
            if (data.num_nodes === 0) {
                alert('Pipeline is invalid. Add Nodes and Edges to the canvas.');
                return;
            }
            
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

    const handleSubmitAdjacency = async () => {
        try {
            // Build adjacency list from nodes and edges
            const adjacencyList = buildAdjacencyList(nodes, edges);
            
            console.log('[Submit] Adjacency list:', adjacencyList);
            
            const response = await fetch('http://127.0.0.1:8000/pipelines/parse-adjacency', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ adjacency_list: adjacencyList }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            if (data.num_nodes === 0) {
                alert('Pipeline is invalid. Add Nodes and Edges to the canvas.');
                return;
            }
            
            // Display a user-friendly alert
            alert(
                `Pipeline Analysis (Adjacency List):\n\n` +
                `Number of Nodes: ${data.num_nodes}\n` +
                `Number of Edges: ${data.num_edges}\n` +
                `Is DAG (Directed Acyclic Graph): ${data.is_dag ? 'Yes ✓' : 'No ✗'}\n\n` +
                (data.is_dag 
                    ? 'Your pipeline is valid!' 
                    : 'Warning: Your pipeline contains cycles!')
            );
        } catch (error) {
            console.error('Error submitting pipeline with adjacency list:', error);
            alert('Error: Could not connect to backend. Make sure the backend server is running on port 8000.');
        }
    };

    return (
        <div className="flex items-center justify-center p-5 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-t border-slate-200 shadow-sm space-x-4">
            <button 
                type="button"
                onClick={handleSubmit}
                className="px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#4A6FA5] to-[#5B8DBE] hover:from-[#3B5A8C] hover:to-[#4A6FA5] rounded-lg cursor-pointer shadow-md hover:shadow-lg  hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit Pipeline
            </button>
            <button 
                type="button"
                onClick={handleSubmitAdjacency}
                className="px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#64748B] to-[#94A3B8] hover:from-[#475569] hover:to-[#64748B] rounded-lg cursor-pointer shadow-md hover:shadow-lg  hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Submit with Adjacency List
            </button>
        </div>
    );
}
