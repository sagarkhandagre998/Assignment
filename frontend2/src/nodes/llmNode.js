// llmNode.js

import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    config={{
      title: 'LLM',
      description: 'This is a LLM.',
      handles: [
        { id: 'system', type: 'target', side: 'left' },
        { id: 'prompt', type: 'target', side: 'left' },
        { id: 'response', type: 'source', side: 'right' },
      ],
    }}
  />
);
