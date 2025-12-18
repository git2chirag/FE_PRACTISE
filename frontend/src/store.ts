// store.ts

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';
import type { Node, Edge, NodeChange, EdgeChange, Connection } from 'reactflow';

export interface StoreState {
    nodes: Node[];
    edges: Edge[];
    nodeIDs: Record<string, number>;
    highlightedNodeId: string | null;
    showOutputs: boolean;
    getNodeID: (type: string) => string;
    addNode: (node: Node) => void;
    updateNodeData: (nodeId: string, data: any) => void;
    deleteNode: (nodeId: string) => void;
    setHighlightedNode: (nodeId: string | null) => void;
    toggleOutputs: () => void;
    createVariableConnection: (sourceNodeId: string, targetNodeId: string, variableName: string) => void;
    removeVariableConnection: (targetNodeId: string, variableName: string) => void;
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;
    calculateNodeOutput: (nodeId: string) => void;
    propagateCalculations: () => void;
    getNodeInputs: (nodeId: string) => Record<string, any>;
}

export const useStore = create<StoreState>((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    highlightedNodeId: null,
    showOutputs: true,
    getNodeID: (type: string) => {
        const newIDs = { ...get().nodeIDs };
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({ nodeIDs: newIDs });
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node: Node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    updateNodeData: (nodeId: string, data: any) => {
        set({
            nodes: get().nodes.map((node) =>
                node.id === nodeId
                    ? { ...node, data: { ...node.data, ...data } }
                    : node
            ),
        });
        // Recalculate this node and downstream nodes
        setTimeout(() => {
            get().calculateNodeOutput(nodeId);
            get().propagateCalculations();
        }, 0);
    },
    deleteNode: (nodeId: string) => {
        set({
            nodes: get().nodes.filter((node) => node.id !== nodeId),
            edges: get().edges.filter(
                (edge) => edge.source !== nodeId && edge.target !== nodeId
            ),
        });
    },
    setHighlightedNode: (nodeId: string | null) => {
        set({ highlightedNodeId: nodeId });
    },
    toggleOutputs: () => {
        set({ showOutputs: !get().showOutputs });
    },
    createVariableConnection: (sourceNodeId: string, targetNodeId: string, variableName: string) => {
        console.log('[Store] createVariableConnection called:', { sourceNodeId, targetNodeId, variableName });
        
        const currentNodes = get().nodes;
        const currentEdges = get().edges;
        
        console.log('[Store] Current nodes:', currentNodes.map(n => ({ id: n.id, type: n.type })));
        console.log('[Store] Current edges:', currentEdges);
        
        // Find the source and target nodes
        const sourceNode = currentNodes.find(n => n.id === sourceNodeId);
        const targetNode = currentNodes.find(n => n.id === targetNodeId);
        
        if (!sourceNode) {
            console.error('[Store] Source node not found:', sourceNodeId);
            return;
        }
        if (!targetNode) {
            console.error('[Store] Target node not found:', targetNodeId);
            return;
        }
        
        console.log('[Store] Found nodes:', { sourceNode, targetNode });
        
        // Use the standard output handle
        const sourceHandle = `${sourceNodeId}-output`;
        
        // Extract the variable name from the format "NodeName.output"
        const varParts = variableName.split('.');
        const actualVarName = varParts.length > 1 ? varParts.join('.') : variableName;
        
        // Try to find the exact variable handle or use a generic input handle
        const targetHandle = `${targetNodeId}-var-${actualVarName}-0`;
        
        console.log('[Store] Using handles:', { sourceHandle, targetHandle, variableName, actualVarName });
        
        const newEdge: Edge = {
            id: `${sourceNodeId}-${targetNodeId}-${variableName}-${Date.now()}`,
            source: sourceNodeId,
            target: targetNodeId,
            sourceHandle: sourceHandle,
            targetHandle: targetHandle,
            type: 'smoothstep',
            animated: true,
            markerEnd: { type: MarkerType.Arrow, height: 20, width: 20 },
        };
        
        console.log('[Store] Creating edge:', newEdge);
        
        try {
            const updatedEdges = addEdge(newEdge, currentEdges);
            console.log('[Store] Updated edges:', updatedEdges);
            set({
                edges: updatedEdges,
            });
            console.log('[Store] Edge added successfully');
            // Recalculate downstream nodes
            setTimeout(() => get().propagateCalculations(), 0);
        } catch (error) {
            console.error('[Store] Error adding edge:', error);
        }
    },
    removeVariableConnection: (targetNodeId: string, variableName: string) => {
        console.log('[Store] removeVariableConnection called:', { targetNodeId, variableName });
        
        const currentEdges = get().edges;
        console.log('[Store] Current edges before removal:', currentEdges);
        
        // Extract the variable name from the format "NodeName.output"
        const varParts = variableName.split('.');
        const actualVarName = varParts.length > 1 ? varParts.join('.') : variableName;
        
        // Find edges that match the target node and variable name
        const edgesToRemove = currentEdges.filter(edge => {
            const matchesTarget = edge.target === targetNodeId;
            const matchesVariable = edge.targetHandle?.includes(actualVarName);
            const match = matchesTarget && matchesVariable;
            
            if (match) {
                console.log('[Store] Found edge to remove:', edge);
            }
            
            return match;
        });
        
        if (edgesToRemove.length === 0) {
            console.warn('[Store] No edges found to remove for:', { targetNodeId, variableName, actualVarName });
        } else {
            console.log('[Store] Removing edges:', edgesToRemove);
        }
        
        // Remove the matching edges
        const updatedEdges = currentEdges.filter(edge => {
            const matchesTarget = edge.target === targetNodeId;
            const matchesVariable = edge.targetHandle?.includes(actualVarName);
            return !(matchesTarget && matchesVariable);
        });
        
        console.log('[Store] Updated edges after removal:', updatedEdges);
        
        set({
            edges: updatedEdges,
        });
    },
    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
        setTimeout(() => get().propagateCalculations(), 0);
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
        setTimeout(() => get().propagateCalculations(), 0);
    },
    onConnect: (connection: Connection) => {
        set({
            edges: addEdge({
                ...connection,
                type: 'smoothstep',
                animated: true,
                markerEnd: { type: MarkerType.Arrow, height: 20, width: 20 },
            }, get().edges),
        });
        setTimeout(() => get().propagateCalculations(), 0);
    },
    
    // Get all inputs for a node from connected edges
    getNodeInputs: (nodeId: string) => {
        const nodes = get().nodes;
        const edges = get().edges;
        const inputs: Record<string, any> = {};
        
        edges.forEach(edge => {
            if (edge.target === nodeId) {
                const sourceNode = nodes.find(n => n.id === edge.source);
                if (sourceNode && sourceNode.data.outputValues) {
                    // Copy all output values from source node
                    Object.assign(inputs, sourceNode.data.outputValues);
                }
            }
        });
        
        return inputs;
    },
    
    // Calculate output for a single node based on its inputs
    calculateNodeOutput: (nodeId: string) => {
        const nodes = get().nodes;
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return;
        
        const nodeData = node.data;
        const inputs = get().getNodeInputs(nodeId);
        const outputValues: Record<string, any> = {};
        
        if (node.type === 'customInput') {
            const outputName = nodeData.inputName || nodeData.outputs?.[0] || 'value';
            outputValues[outputName] = nodeData.inputName || 'input_value';
        } 
        else if (node.type === 'llm') {
            // Resolve variables in system prompt - store only resolved values
            let resolvedPrompt = nodeData.systemPrompt || '';
            if (nodeData.variables) {
                nodeData.variables.forEach((varName: string) => {
                    const varKey = varName.split('.').pop() || varName;
                    if (inputs[varKey] !== undefined) {
                        // Replace the full variable name (including node prefix) with actual value
                        const varPattern = new RegExp(varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                        resolvedPrompt = resolvedPrompt.replace(varPattern, String(inputs[varKey]));
                    }
                });
            }
            outputValues.response = `[LLM Response from ${nodeData.model || 'GPT-4'}]`;
            outputValues.usage = '[Token Usage]';
            outputValues.model_name = nodeData.model || 'gpt-4';
            outputValues.prompt = resolvedPrompt;
        }
        else if (node.type === 'text') {
            // Resolve variables in text - store only resolved values
            let resolvedText = nodeData.text || '';
            if (nodeData.variables) {
                nodeData.variables.forEach((varName: string) => {
                    const varKey = varName.split('.').pop() || varName;
                    if (inputs[varKey] !== undefined) {
                        // Replace the full variable name (including node prefix) with actual value
                        const varPattern = new RegExp(varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                        resolvedText = resolvedText.replace(varPattern, String(inputs[varKey]));
                    }
                });
            }
            outputValues.output = resolvedText;
        }
        else if (node.type === 'transform') {
            const inputValue = Object.values(inputs)[0] || 'sample_input';
            const operation = nodeData.operation || 'uppercase';
            let result = inputValue;
            
            switch (operation) {
                case 'uppercase': result = String(inputValue).toUpperCase(); break;
                case 'lowercase': result = String(inputValue).toLowerCase(); break;
                case 'reverse': result = String(inputValue).split('').reverse().join(''); break;
                case 'trim': result = String(inputValue).trim(); break;
                case 'split': result = String(inputValue).split(' '); break;
                case 'replace': result = String(inputValue).replace(/[0-9]/g, 'X'); break;
            }
            
            outputValues.result = result;
            outputValues.original = inputValue;
            outputValues.metadata = { operation, timestamp: new Date().toISOString() };
        }
        else if (node.type === 'filter') {
            const inputValue = Object.values(inputs)[0] || 'sample_input';
            const condition = nodeData.condition || 'contains';
            const filterValue = nodeData.value || '';
            let matches = false;
            const strInput = String(inputValue);
            
            switch (condition) {
                case 'contains': matches = strInput.includes(filterValue); break;
                case 'equals': matches = strInput === filterValue; break;
                case 'startsWith': matches = strInput.startsWith(filterValue); break;
                case 'endsWith': matches = strInput.endsWith(filterValue); break;
                case 'greaterThan': matches = parseFloat(strInput) > parseFloat(filterValue); break;
                case 'lessThan': matches = parseFloat(strInput) < parseFloat(filterValue); break;
            }
            
            outputValues.match = matches ? inputValue : null;
            outputValues.no_match = !matches ? inputValue : null;
            outputValues.metadata = { condition, filterValue, matches };
        }
        else if (node.type === 'combine') {
            const inputArray = Object.values(inputs);
            const operation = nodeData.operation || 'concat';
            let combined;
            
            switch (operation) {
                case 'concat': combined = inputArray.join(''); break;
                case 'merge': combined = Object.assign({}, ...inputArray.filter(i => typeof i === 'object')); break;
                case 'array': combined = inputArray; break;
                case 'join': combined = inputArray.join(', '); break;
            }
            
            outputValues.combined = combined;
            outputValues.count = inputArray.length;
            outputValues.metadata = { operation, inputCount: inputArray.length };
        }
        else if (node.type === 'api') {
            const method = nodeData.method || 'GET';
            const url = nodeData.url || 'https://api.example.com';
            
            outputValues.response = { data: 'API response data', url, method };
            outputValues.status = 200;
            outputValues.headers = { 'content-type': 'application/json' };
            outputValues.error = null;
        }
        else if (node.type === 'conditional') {
            const inputArray = Object.values(inputs);
            const conditionValue = inputArray[0] || null;
            const compareValue = inputArray[1] || null;
            const operator = nodeData.operator || '==';
            let result = false;
            
            switch (operator) {
                case '==': result = conditionValue == compareValue; break;
                case '!=': result = conditionValue != compareValue; break;
                case '>': result = conditionValue > compareValue; break;
                case '<': result = conditionValue < compareValue; break;
                case '>=': result = conditionValue >= compareValue; break;
                case '<=': result = conditionValue <= compareValue; break;
            }
            
            outputValues.true_branch = result ? conditionValue : null;
            outputValues.false_branch = !result ? conditionValue : null;
            outputValues.metadata = { operator, result, conditionValue, compareValue };
        }
        else if (node.type === 'customOutput') {
            // Output node passes through all inputs as outputs
            Object.assign(outputValues, inputs);
        }
        
        // Update node with calculated outputs
        set({
            nodes: nodes.map(n => 
                n.id === nodeId 
                    ? { ...n, data: { ...n.data, outputValues } }
                    : n
            )
        });
    },
    
    // Propagate calculations through the graph in topological order
    propagateCalculations: () => {
        const nodes = get().nodes;
        const edges = get().edges;
        
        // Build adjacency list
        const graph: Record<string, string[]> = {};
        const inDegree: Record<string, number> = {};
        
        nodes.forEach(node => {
            graph[node.id] = [];
            inDegree[node.id] = 0;
        });
        
        edges.forEach(edge => {
            if (graph[edge.source]) {
                graph[edge.source].push(edge.target);
            }
            if (inDegree[edge.target] !== undefined) {
                inDegree[edge.target]++;
            }
        });
        
        // Topological sort using Kahn's algorithm
        const queue: string[] = [];
        nodes.forEach(node => {
            if (inDegree[node.id] === 0) {
                queue.push(node.id);
            }
        });
        
        const sortedNodes: string[] = [];
        while (queue.length > 0) {
            const nodeId = queue.shift()!;
            sortedNodes.push(nodeId);
            
            graph[nodeId]?.forEach(neighbor => {
                inDegree[neighbor]--;
                if (inDegree[neighbor] === 0) {
                    queue.push(neighbor);
                }
            });
        }
        
        // Calculate outputs in topological order
        sortedNodes.forEach(nodeId => {
            get().calculateNodeOutput(nodeId);
        });
    },
}));
