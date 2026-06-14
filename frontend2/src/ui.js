// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { useShallow } from 'zustand/react/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { FilterNode } from './nodes/filterNode';
import { MathNode } from './nodes/mathNode';
import { NoteNode } from './nodes/noteNode';
import { ApiNode } from './nodes/apiNode';
import { DelayNode } from './nodes/delayNode';
import { NODE_META, DEFAULT_META } from './theme';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  filter: FilterNode,
  math: MathNode,
  note: NoteNode,
  api: ApiNode,
  delay: DelayNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(useShallow(selector));

    // Provide sensible default field values at creation time so the global
    // graph state is complete even before the user touches a node's inputs.
    const getInitNodeData = (nodeID, type) => {
      const nodeData = { id: nodeID, nodeType: `${type}` };
      switch (type) {
        case 'customInput':
          nodeData.inputName = nodeID.replace('customInput-', 'input_');
          nodeData.inputType = 'Text';
          break;
        case 'customOutput':
          nodeData.outputName = nodeID.replace('customOutput-', 'output_');
          nodeData.outputType = 'Text';
          break;
        case 'text':
          nodeData.text = '{{input}}';
          break;
        default:
          break;
      }
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();

          // Guard: the drop can fire before React Flow has initialized.
          if (!reactFlowInstance) return;

          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

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
        [reactFlowInstance, getNodeID, addNode]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <div ref={reactFlowWrapper} style={{ flex: 1, minHeight: 0, width: '100%' }}>
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
                connectionLineType='smoothstep'
                defaultEdgeOptions={{ type: 'smoothstep' }}
                fitView
            >
                <Background variant="dots" color="#c3cad8" gap={gridSize} size={1.5} />
                <Controls />
                <MiniMap
                    nodeColor={(n) => (NODE_META[n.type] || DEFAULT_META).accent}
                    nodeStrokeWidth={3}
                    maskColor="rgba(238, 241, 247, 0.7)"
                    style={{ background: '#fff' }}
                />
            </ReactFlow>
        </div>
    )
}
