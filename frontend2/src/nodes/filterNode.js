// filterNode.js — 1 input, 1 output; a text "Condition" field.

import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    config={{
      title: 'Filter',
      handles: [
        { id: 'input', type: 'target', side: 'left' },
        { id: 'output', type: 'source', side: 'right' },
      ],
      fields: [
        { name: 'condition', label: 'Condition', type: 'text', default: 'value > 0' },
      ],
    }}
  />
);
