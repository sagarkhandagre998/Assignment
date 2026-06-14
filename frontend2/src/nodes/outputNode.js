// outputNode.js

import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    config={{
      title: 'Output',
      handles: [{ id: 'value', type: 'target', side: 'left' }],
      fields: [
        {
          name: 'outputName',
          label: 'Name',
          type: 'text',
          default: id.replace('customOutput-', 'output_'),
        },
        {
          name: 'outputType',
          label: 'Type',
          type: 'select',
          default: 'Text',
          options: ['Text', 'Image'],
        },
      ],
    }}
  />
);
