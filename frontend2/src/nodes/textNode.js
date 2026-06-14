// textNode.js
//
// Part 2 — Text Node Logic:
//   1. The node WIDTH grows with the longest line of text; the HEIGHT grows
//      with the number of lines (the textarea auto-resizes itself).
//   2. Any valid JS variable name inside double curly braces, e.g. {{ input }},
//      becomes a target Handle on the left side of the node.

import { useEffect, useMemo } from 'react';
import { useUpdateNodeInternals } from 'reactflow';
import { BaseNode } from './BaseNode';

// Find every {{ name }} whose inner text is a valid JS identifier, de-duplicated.
// A valid identifier: starts with a letter/_/$, then letters/digits/_/$.
const VARIABLE_RE = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;

const extractVariables = (text) => {
  const found = new Set();
  let match;
  while ((match = VARIABLE_RE.exec(text)) !== null) {
    found.add(match[1]);
  }
  return [...found];
};

// Approximate a comfortable node width (px) from the longest line of text.
const widthForText = (text) => {
  const longestLine = text.split('\n').reduce((max, line) => Math.max(max, line.length), 0);
  return Math.min(Math.max(longestLine * 8 + 48, 200), 480);
};

export const TextNode = ({ id, data }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const text = data?.text ?? '{{input}}';

  const variables = useMemo(() => extractVariables(text), [text]);

  // React Flow caches each node's handle layout. When we add/remove handles we
  // must tell it to recompute, or edges and handle positions go stale.
  useEffect(() => {
    updateNodeInternals(id);
  }, [id, variables, updateNodeInternals]);

  const handles = [
    ...variables.map((name) => ({ id: name, type: 'target', side: 'left' })),
    { id: 'output', type: 'source', side: 'right' },
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      config={{
        title: 'Text',
        containerStyle: { width: widthForText(text) },
        handles,
        fields: [
          { name: 'text', label: 'Text', type: 'autoTextarea', default: '{{input}}' },
        ],
      }}
    />
  );
};
