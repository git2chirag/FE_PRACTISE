// ui.tsx
// Displays the drag-and-drop UI
// --------------------------------------------------

import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import type { ReactFlowInstance, ConnectionLineType } from 'reactflow';
import { useStore, type StoreState } from '../store';
import { InputNode } from '../nodes/inputNode';
import { LLMNode } from '../nodes/llmNode';
import { OutputNode } from '../nodes/outputNode';
import { TextNode } from '../nodes/textNode';
import { TransformNode } from '../nodes/transformNode';
import { FilterNode } from '../nodes/filterNode';
import { CombineNode } from '../nodes/combineNode';
import { APINode } from '../nodes/apiNode';
import { ConditionalNode } from '../nodes/conditionalNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  transform: TransformNode,
  filter: FilterNode,
  combine: CombineNode,
  api: APINode,
  conditional: ConditionalNode,
};

export const PipelineUI: React.FC = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const getNodeID = useStore((state) => state.getNodeID);
    const addNode = useStore((state) => state.addNode);
    const onNodesChange = useStore((state) => state.onNodesChange);
    const onEdgesChange = useStore((state) => state.onEdgesChange);
    const onConnect = useStore((state) => state.onConnect);

    const getInitNodeData = (nodeID: string, type: string) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current!.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance?.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            if (!position) return; // ensure position is defined

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance]
    );

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const handleNodeDrag = useCallback(() => {
        if (!reactFlowInstance) return;
        const position = reactFlowInstance.project({ x: 0, y: 0 });
        console.log(position);
    }, [reactFlowInstance]);

    return (
        <div ref={reactFlowWrapper} className="w-full h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType={"smoothstep" as ConnectionLineType}
            >
                <Controls />
                <Background gap={gridSize} color="#CBD5E0" />
                <MiniMap 
                    nodeColor={(node) => {
                        switch (node.type) {
                            case 'customInput': return '#48BB78';
                            case 'llm': return '#9F7AEA';
                            case 'customOutput': return '#F56565';
                            case 'text': return '#4299E1';
                            case 'transform': return '#ED8936';
                            case 'filter': return '#38B2AC';
                            case 'combine': return '#D69E2E';
                            case 'api': return '#805AD5';
                            case 'conditional': return '#E53E3E';
                            default: return '#A0AEC0';
                        }
                    }}
                />
            </ReactFlow>
        </div>
    );
};
