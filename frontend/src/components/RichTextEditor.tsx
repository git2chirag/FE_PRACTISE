// RichTextEditor.tsx
// Reusable rich text editor component with variable pills using draft.js

import React, { useState, useRef, useCallback } from 'react';
import {
  Editor,
  EditorState,
  ContentState,
  CompositeDecorator,
  Modifier,
  SelectionState,
  ContentBlock,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { VariableSelector } from './VariableSelector';
import { useStore } from '../store';

interface RichTextEditorProps {
  nodeId: string;
  value: string;
  onChange: (text: string, variables: string[]) => void;
  placeholder?: string;
  className?: string;
  pillColor?: string;
}

// Component to render variable pills inline - defined outside to prevent recreation
const VariablePillComponent = (props: any) => {
  const { variableName, pillColor } = props.contentState
    .getEntity(props.entityKey)
    .getData();

  const colorClasses: Record<string, string> = {
    purple: 'bg-purple-500 hover:bg-purple-600',
    blue: 'bg-blue-500 hover:bg-blue-600',
  };

  const bgColor = colorClasses[pillColor] || colorClasses.blue;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 ${bgColor} text-white rounded-full text-xs font-medium mx-0.5 align-middle relative group`}
      contentEditable={false}
      data-entity-type="variable"
      data-variable-name={variableName}
      style={{ userSelect: 'none', cursor: 'default' }}
    >
      <span>{variableName}</span>
      <span
        className="ml-0.5 opacity-70 group-hover:opacity-100 hover:bg-opacity-20 rounded-full w-4 h-4 flex items-center justify-center text-xs leading-none font-bold cursor-pointer transition-opacity"
        data-pill-remove="true"
        style={{ userSelect: 'none' }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          // Dispatch custom event that the editor can listen to
          const event = new CustomEvent('pillRemove', {
            detail: { variableName },
            bubbles: true
          });
          e.currentTarget.dispatchEvent(event);
        }}
      >
        ×
      </span>
    </span>
  );
};

// Strategy function to find variable entities - defined outside component
const findVariableEntities = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'VARIABLE'
    );
  }, callback);
};

// Create decorator once, outside component
const createDecorator = () =>
  new CompositeDecorator([
    {
      strategy: findVariableEntities,
      component: VariablePillComponent,
    },
  ]);

// Shared decorator instance
const sharedDecorator = createDecorator();

// Helper function to create editor state from text - defined outside component
const createEditorStateFromText = (text: string, pillColor: string): EditorState => {
  if (!text) {
    return EditorState.createEmpty(sharedDecorator);
  }

  let contentState = ContentState.createFromText(text);
  
  // Find {{variable}} patterns
  const regex = /\{\{([^}]+)\}\}/g;
  let match;
  const matches: Array<{ start: number; end: number; name: string }> = [];

  while ((match = regex.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      name: match[1].trim(),
    });
  }

  // If no variables, just return simple content
  if (matches.length === 0) {
    return EditorState.createWithContent(contentState, sharedDecorator);
  }

  let editorState = EditorState.createWithContent(contentState, sharedDecorator);

  // Apply entities in reverse order to maintain positions
  matches.reverse().forEach((m) => {
    const currentContentState = editorState.getCurrentContent();
    const blockKey = currentContentState.getFirstBlock().getKey();
    
    const targetSelection = SelectionState.createEmpty(blockKey).merge({
      anchorOffset: m.start,
      focusOffset: m.end,
    }) as SelectionState;

    const contentWithEntity = currentContentState.createEntity(
      'VARIABLE',
      'IMMUTABLE',
      { variableName: m.name, pillColor }
    );

    const entityKey = contentWithEntity.getLastCreatedEntityKey();

    const newContentState = Modifier.replaceText(
      contentWithEntity,
      targetSelection,
      m.name,
      undefined,
      entityKey
    );

    editorState = EditorState.push(editorState, newContentState, 'insert-characters');
  });

  return editorState;
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  nodeId,
  value,
  onChange,
  placeholder = 'Enter text with {{variables}}',
  className = '',
  pillColor = 'blue',
}) => {
  const editorRef = useRef<Editor>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const [showVariableSelector, setShowVariableSelector] = useState(false);
  const [selectorPosition, setSelectorPosition] = useState({ x: 0, y: 0 });
  const [triggerPosition, setTriggerPosition] = useState<number>(0);
  
  const setHighlightedNode = useStore((state) => state.setHighlightedNode);
  const createVariableConnection = useStore((state) => state.createVariableConnection);
  const removeVariableConnection = useStore((state) => state.removeVariableConnection);

  // Initialize editor state only once using lazy initializer
  const [editorState, setEditorState] = useState<EditorState>(() => {
    isInitializedRef.current = true;
    return createEditorStateFromText(value, pillColor);
  });

  // Extract variables from editor state
  const extractVariables = useCallback((contentState: ContentState): string[] => {
    const variables: string[] = [];
    contentState.getBlockMap().forEach((block) => {
      if (block) {
        block.findEntityRanges(
          (character) => {
            const entityKey = character.getEntity();
            return (
              entityKey !== null &&
              contentState.getEntity(entityKey).getType() === 'VARIABLE'
            );
          },
          (start) => {
            const entityKey = block.getEntityAt(start);
            if (entityKey) {
              const entity = contentState.getEntity(entityKey);
              const { variableName } = entity.getData();
              if (!variables.includes(variableName)) {
                variables.push(variableName);
              }
            }
          }
        );
      }
    });
    return variables;
  }, []);

  // Insert a variable pill entity
  const insertVariablePill = useCallback((
    state: EditorState,
    variableName: string
  ): EditorState => {
    const contentState = state.getCurrentContent();
    const selection = state.getSelection();

    const contentWithEntity = contentState.createEntity(
      'VARIABLE',
      'IMMUTABLE',
      { variableName, pillColor }
    );

    const entityKey = contentWithEntity.getLastCreatedEntityKey();

    const newContentState = Modifier.replaceText(
      contentWithEntity,
      selection,
      variableName,
      undefined,
      entityKey
    );

    const newEditorState = EditorState.push(
      state,
      newContentState,
      'insert-characters'
    );

    return EditorState.forceSelection(
      newEditorState,
      newContentState.getSelectionAfter()
    );
  }, [pillColor]);

  // Handle text changes in the editor
  const handleEditorChange = useCallback((newEditorState: EditorState) => {
    setEditorState(newEditorState);

    const contentState = newEditorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    const currentSelection = newEditorState.getSelection();
    const cursorPosition = currentSelection.getAnchorOffset();
    const currentBlockKey = currentSelection.getAnchorKey();
    const currentBlock = contentState.getBlockForKey(currentBlockKey);
    const blockText = currentBlock.getText();

    // Extract variables and notify parent
    const variables = extractVariables(contentState);
    onChange(plainText, variables);

    // Check if user typed {{ - use block text for multi-line support
    const textBeforeCursor = blockText.substring(0, cursorPosition);
    const lastTwoChars = textBeforeCursor.slice(-2);

    if (lastTwoChars === '{{') {
      setTriggerPosition(cursorPosition);
      const editorElement = editorRef.current?.editor;
      if (editorElement) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const scrollY = window.scrollY || window.pageYOffset;
          const scrollX = window.scrollX || window.pageXOffset;
          setSelectorPosition({ 
            x: rect.left + scrollX, 
            y: rect.bottom + scrollY + 5 
          });
        } else {
          const rect = editorElement.getBoundingClientRect();
          const scrollY = window.scrollY || window.pageYOffset;
          const scrollX = window.scrollX || window.pageXOffset;
          setSelectorPosition({ 
            x: rect.left + scrollX + 10, 
            y: rect.top + scrollY + 30 
          });
        }
        setShowVariableSelector(true);
      }
    } else if (showVariableSelector && !textBeforeCursor.includes('{{')) {
      setShowVariableSelector(false);
      setHighlightedNode(null);
    }
  }, [extractVariables, onChange, showVariableSelector, setHighlightedNode]);

  // Handle variable selection from dropdown
  const handleVariableSelect = useCallback((variableName: string, sourceNodeId: string) => {
    console.log('[RichTextEditor] Variable selected:', { variableName, sourceNodeId, nodeId });
    
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    // Remove the {{ trigger
    const cursorPos = triggerPosition;
    const startPos = cursorPos - 2;
    
    const removalSelection = selection.merge({
      anchorOffset: startPos,
      focusOffset: cursorPos,
    }) as SelectionState;

    let newContentState = Modifier.removeRange(
      contentState,
      removalSelection,
      'backward'
    );

    let newEditorState = EditorState.push(
      editorState,
      newContentState,
      'remove-range'
    );

    // Move cursor to where {{ was
    const newSelection = SelectionState.createEmpty(selection.getAnchorKey()).merge({
      anchorOffset: startPos,
      focusOffset: startPos,
    }) as SelectionState;

    newEditorState = EditorState.forceSelection(newEditorState, newSelection);

    // Insert the variable pill
    newEditorState = insertVariablePill(newEditorState, variableName);

    // Add a space after the pill and position cursor after it
    const contentAfterPill = newEditorState.getCurrentContent();
    const selectionAfterPill = newEditorState.getSelection();
    
    const contentWithSpace = Modifier.insertText(
      contentAfterPill,
      selectionAfterPill,
      ' '
    );
    
    newEditorState = EditorState.push(
      newEditorState,
      contentWithSpace,
      'insert-characters'
    );
    
    // Move cursor after the space
    newEditorState = EditorState.forceSelection(
      newEditorState,
      contentWithSpace.getSelectionAfter()
    );

    setEditorState(newEditorState);
    setShowVariableSelector(false);
    setHighlightedNode(null);

    // Create connection
    if (sourceNodeId) {
      console.log('[RichTextEditor] Creating connection:', { from: sourceNodeId, to: nodeId, variable: variableName });
      createVariableConnection(sourceNodeId, nodeId, variableName);
    }

    // Focus back on editor
    setTimeout(() => {
      editorRef.current?.focus();
    }, 50);
  }, [editorState, triggerPosition, nodeId, insertVariablePill, setHighlightedNode, createVariableConnection]);

  // Handle keyboard commands - Pills are now immutable, can't be deleted by backspace
  const handleKeyCommand = useCallback((command: string, state: EditorState) => {
    if (command === 'backspace' || command === 'delete') {
      const selection = state.getSelection();
      const contentState = state.getCurrentContent();
      const startKey = selection.getStartKey();
      const startOffset = selection.getStartOffset();
      const block = contentState.getBlockForKey(startKey);
      
      if (command === 'backspace' && startOffset > 0) {
        const entityKey = block.getEntityAt(startOffset - 1);
        if (entityKey) {
          const entity = contentState.getEntity(entityKey);
          if (entity.getType() === 'VARIABLE') {
            // Pills are immutable - prevent deletion via backspace
            return 'handled' as const;
          }
        }
      }
    }
    return 'not-handled' as const;
  }, []);

  const handleSelectorClose = useCallback(() => {
    setShowVariableSelector(false);
    setHighlightedNode(null);
  }, [setHighlightedNode]);

  // Handle click to focus
  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Always focus editor
    setTimeout(() => {
      editorRef.current?.focus();
    }, 0);
  }, []);

  // Handle removing a variable via clicking X button
  const handlePillRemove = useCallback((e: CustomEvent) => {
    const { variableName } = e.detail;
    console.log('[RichTextEditor] Removing variable via custom event:', variableName);

    // Remove this variable from editor
    const contentState = editorState.getCurrentContent();
    let newContentState = contentState;

    contentState.getBlockMap().forEach((block) => {
      if (block) {
        const entitiesToRemove: Array<{ start: number; end: number }> = [];

        block.findEntityRanges(
          (character) => {
            const entityKey = character.getEntity();
            if (entityKey) {
              const entity = contentState.getEntity(entityKey);
              return (
                entity.getType() === 'VARIABLE' &&
                entity.getData().variableName === variableName
              );
            }
            return false;
          },
          (start, end) => {
            entitiesToRemove.push({ start, end });
          }
        );

        entitiesToRemove.reverse().forEach(({ start, end }) => {
          const blockKey = block.getKey();
          const sel = SelectionState.createEmpty(blockKey).merge({
            anchorOffset: start,
            focusOffset: end,
          }) as SelectionState;

          newContentState = Modifier.removeRange(
            newContentState,
            sel,
            'backward'
          );
        });
      }
    });

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'remove-range'
    );

    setEditorState(newEditorState);

    // Notify parent
    const plainText = newContentState.getPlainText();
    const variables = extractVariables(newContentState);
    onChange(plainText, variables);

    // Remove connection
    console.log('[RichTextEditor] Removing variable connection:', { nodeId, variableName });
    removeVariableConnection(nodeId, variableName);
  }, [editorState, extractVariables, onChange, nodeId, removeVariableConnection]);

  // Set up event listener for pill removal
  React.useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('pillRemove', handlePillRemove as EventListener);
      return () => {
        container.removeEventListener('pillRemove', handlePillRemove as EventListener);
      };
    }
  }, [handlePillRemove]);

  return (
    <>
      <div
        ref={containerRef}
        className={`rich-text-editor border-2 border-gray-300 rounded-md px-3 py-2 min-h-[80px] focus-within:ring-2 focus-within:ring-${pillColor}-500 focus-within:border-${pillColor}-500 transition-all bg-white hover:border-gray-400 ${className}`}
        onClick={handleContainerClick}
      >
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={handleKeyCommand}
          placeholder={placeholder}
        />
      </div>
      {showVariableSelector && (
        <VariableSelector
          isOpen={showVariableSelector}
          position={selectorPosition}
          onSelect={handleVariableSelect}
          onClose={handleSelectorClose}
          selfNodeId={nodeId}
        />
      )}
    </>
  );
};
