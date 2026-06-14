// noteNode.js — zero handles; a textarea. Shows a node with no connections.

import { BaseNode } from './BaseNode';

export const NoteNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    config={{
      title: 'Note',
      handles: [],
      fields: [
        { name: 'note', label: 'Note', type: 'textarea', rows: 3, default: '' },
      ],
    }}
  />
);
