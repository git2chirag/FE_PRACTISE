// textNode.tsx

import { useState, useEffect, useRef } from 'react';
import { Position } from 'reactflow';
import React from 'react';
import { BaseNode, HandleConfig } from './BaseNode';

export const TextNode = ({ id, data }: any) => {
  const [currText, setCurrText] = useState<string>(data?.text || '{{input}}');
  const [variables, setVariables] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Extract variables from text (e.g., {{variableName}})
  useEffect(() => {
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const matches = [...currText.matchAll(regex)];
    const varNames = matches.map(match => match[1]);
    const uniqueVars = Array.from(new Set(varNames));
    setVariables(uniqueVars);
  }, [currText]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrText(e.target.value);
  };

  // Calculate dynamic height based on content
  const calculateHeight = () => {
    const lineCount = currText.split('\n').length;
    const minHeight = 60;
    const lineHeight = 20;
    return Math.max(minHeight, lineCount * lineHeight + 20);
  };

  // Dynamic handles for each variable
  const handles: HandleConfig[] = [
    ...variables.map((varName, index) => ({
      type: 'target' as const,
      position: Position.Left,
      id: `${id}-${varName}`,
      style: { top: `${(index + 1) * (100 / (variables.length + 1))}%` }
    })),
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-output`
    }
  ];

  const textareaHeight = calculateHeight();

  return (
    <BaseNode 
      id={id} 
      data={data} 
      title="Text" 
      handles={handles}
      style={{
        minWidth: Math.max(200, currText.length * 3),
        minHeight: textareaHeight + 60
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <textarea 
          ref={textareaRef}
          value={currText} 
          onChange={handleTextChange}
          placeholder="Enter text with {{variables}}"
          style={{
            width: '100%',
            minHeight: `${textareaHeight}px`,
            padding: '6px 8px',
            border: '1px solid #CBD5E0',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            resize: 'vertical'
          }}
        />
        {variables.length > 0 && (
          <div style={{ fontSize: '10px', color: '#718096' }}>
            Variables: {variables.join(', ')}
          </div>
        )}
      </div>
    </BaseNode>
  );
}
