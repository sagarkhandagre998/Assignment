// delayNode.js — 1 input, 1 output; a "Seconds" text field + a "Repeat" checkbox.

import { BaseNode } from './BaseNode';

export const DelayNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    config={{
      title: 'Delay',
      handles: [
        { id: 'input', type: 'target', side: 'left' },
        { id: 'output', type: 'source', side: 'right' },
      ],
      fields: [
        { name: 'seconds', label: 'Seconds', type: 'text', default: '1' },
        { name: 'repeat', label: 'Repeat', type: 'checkbox', default: false },
      ],
    }}
  />
);
