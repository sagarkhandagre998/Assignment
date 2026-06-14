// inputNode.js

import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    config={{
      title: 'Input',
      handles: [{ id: 'value', type: 'source', side: 'right' }],
      fields: [
        {
          name: 'inputName',
          label: 'Name',
          type: 'text',
          default: id.replace('customInput-', 'input_'),
        },
        {
          name: 'inputType',
          label: 'Type',
          type: 'select',
          default: 'Text',
          options: ['Text', 'File'],
        },
      ],
    }}
  />
);
