import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import React from 'react';
import { BaseNode, HandleConfig } from './BaseNode';
import { useStore } from '../store';
import { RichTextEditor } from '../components/RichTextEditor';

export const TextNode = ({ id, data }: any) => {
  const [currText, setCurrText] = useState<string>(data?.text || '');
  const [variables, setVariables] = useState<string[]>([]);
  const updateNodeData = useStore((state) => state.updateNodeData);

  useEffect(() => {
    updateNodeData(id, { text: currText, variables: variables });
  }, [currText, variables, id, updateNodeData]);

  const handleTextChange = (text: string, vars: string[]) => {
    setCurrText(text);
    setVariables(vars);
  };

  const handles: HandleConfig[] = [
    ...variables.map((varName, index) => ({
      type: 'target' as const,
      position: Position.Left,
      id: `${id}-var-${varName}-${index}`,
      className: `top-[${(index + 1) * (100 / (variables.length + 1))}%]`
    })),
    // Always show 1 handle on the left if no variables
    ...(variables.length === 0 ? [
      {
        type: 'target' as const,
        position: Position.Left,
        id: `${id}-input`,
      }
    ] : []),
    // Always show 1 handle on the right
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-output`,
    }
  ];

  return (
    <>
      <BaseNode
        id={id}
        data={data}
        title={<><i className="fas fa-font mr-2"></i>Text</>}
        handles={handles}
        className="min-w-64 min-h-48"
      >
        <div className="flex flex-col gap-3">
          <RichTextEditor
            nodeId={id}
            value={currText}
            onChange={handleTextChange}
            placeholder="Enter text with {{variables}}"
            className="text-sm font-mono min-h-[100px]"
            pillColor="blue"
          />
        </div>
      </BaseNode>
    </>
  );
}
