// apiNode.js — 1 input, 1 output; a URL text field + an HTTP method select.

import { BaseNode } from './BaseNode';

export const ApiNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    config={{
      title: 'API',
      handles: [
        { id: 'request', type: 'target', side: 'left' },
        { id: 'response', type: 'source', side: 'right' },
      ],
      fields: [
        { name: 'url', label: 'URL', type: 'text', default: 'https://' },
        {
          name: 'method',
          label: 'Method',
          type: 'select',
          default: 'GET',
          options: ['GET', 'POST', 'PUT', 'DELETE'],
        },
      ],
    }}
  />
);
