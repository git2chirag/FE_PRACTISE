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
    getNodeID: (type: string) => string;
    addNode: (node: Node) => void;
    updateNodeData: (nodeId: string, data: any) => void;
    deleteNode: (nodeId: string) => void;
    setHighlightedNode: (nodeId: string | null) => void;
    createVariableConnection: (sourceNodeId: string, targetNodeId: string, variableName: string) => void;
    removeVariableConnection: (targetNodeId: string, variableName: string) => void;
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;
}

export const useStore = create<StoreState>((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    highlightedNodeId: null,
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
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
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
    },
}));
