// mathNode.js — 2 inputs (auto-spaced), 1 output; a select for the operation.

import { BaseNode } from './BaseNode';

export const MathNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    config={{
      title: 'Math',
      handles: [
        { id: 'a', type: 'target', side: 'left' },
        { id: 'b', type: 'target', side: 'left' },
        { id: 'result', type: 'source', side: 'right' },
      ],
      fields: [
        {
          name: 'operation',
          label: 'Operation',
          type: 'select',
          default: 'add',
          options: [
            { value: 'add', label: '+ Add' },
            { value: 'subtract', label: '- Subtract' },
            { value: 'multiply', label: '× Multiply' },
            { value: 'divide', label: '÷ Divide' },
          ],
        },
      ],
    }}
  />
);
