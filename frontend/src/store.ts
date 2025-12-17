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
        const newEdge: Edge = {
            id: `${sourceNodeId}-${targetNodeId}-${variableName}`,
            source: sourceNodeId,
            target: targetNodeId,
            sourceHandle: `${sourceNodeId}-output`,
            targetHandle: `${targetNodeId}-${variableName}`,
            type: 'smoothstep',
            animated: true,
            markerEnd: { type: MarkerType.Arrow, height: 20, width: 20 },
        };
        set({
            edges: addEdge(newEdge, get().edges),
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
