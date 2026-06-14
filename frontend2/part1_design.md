# Part 1 — Node Abstraction: Design

## 1. The problem, precisely

Today every node file (`inputNode.js`, `outputNode.js`, `textNode.js`, `llmNode.js`) re-implements the same four things by hand:

| Concern | How it's duplicated today |
|---|---|
| **Container** | Every node hard-codes `<div style={{width: 200, height: 80, border: '1px solid black'}}>`. Change the look → edit N files. |
| **Title row** | Every node writes its own `<div><span>…</span></div>`. |
| **Handles** | Every node imports `Handle`/`Position` and hand-writes `<Handle type=… position=… id={\`${id}-…\`} style={…}/>`, including the fiddly `top: ${100/3}%` math for multi-handle spacing. |
| **Fields + state** | Input/Output/Text each repeat the same `useState` + `onChange` + `updateNodeField` controlled-input pattern, differing only in label, control type, and data key. |

Adding a 5th node means copy-pasting one of these files and tweaking ~20 lines, most of which is identical to what already exists. Restyling all nodes means editing every file. This is a **DRY violation** and an **Open/Closed violation** (the system isn't open to extension without modifying/duplicating existing code).

## 2. The core idea

Separate **what stays the same** (structure, styling, handle layout, state plumbing) from **what changes per node** (title, handles list, fields list).

- The *stable* part becomes **one reusable `BaseNode` component**.
- The *varying* part becomes **plain data** — a small config object each node provides.

So a new node is no longer new *code*; it's a new *configuration*. This is **data-driven / configuration-driven design**, built on **composition over inheritance**.

## 3. Design principles applied (the "why")

1. **DRY (Don't Repeat Yourself)** — the container, title, handle rendering, and the controlled-field state logic exist in exactly one place.
2. **Open/Closed Principle** — `BaseNode` is closed for modification but open for extension: new nodes extend the system by adding config, not by editing `BaseNode`.
3. **Single Responsibility** — `BaseNode` renders structure; each field-control renders one input; each node file only declares its identity. Styling lives in one style module.
4. **Composition over inheritance** — React's idiomatic reuse mechanism. We compose a node from a `BaseNode` + a list of field components, rather than subclassing.
5. **Separation of concerns** — layout/structure (BaseNode) is decoupled from data/behavior (config) and from presentation (a shared style object).

## 4. Proposed structure

```
src/nodes/
  BaseNode.js          ← the one reusable shell: container + title + handles + fields
  nodeStyles.js        ← shared style tokens (container, title, handle, label…)
  fields/
    index.js           ← a registry mapping field "type" → control component
    TextField.js       ← controlled text <input>  (state + updateNodeField built in)
    SelectField.js     ← controlled <select>
    TextAreaField.js   ← controlled multi-line <textarea>
    CheckboxField.js   ← controlled checkbox
  inputNode.js         ← refactored to use BaseNode (behaviour unchanged)
  outputNode.js        ← refactored
  textNode.js          ← refactored
  llmNode.js           ← refactored
  (5 new nodes)        ← each just a config object, see §7
```

### 4.1 `BaseNode` — the reusable shell

`BaseNode` accepts the node's `id`, `data`, and a **config**, and renders:
- the styled container,
- the title,
- every handle in `config.handles` (auto-spacing multiple handles on the same side, so no manual `${100/3}%` math),
- every field in `config.fields`, by looking the field's `type` up in the **field registry** and rendering the matching control.

Sketch (illustrative, final code may differ slightly):

```jsx
// BaseNode.js
import { Handle, Position } from 'reactflow';
import { styles } from './nodeStyles';
import { FIELD_COMPONENTS } from './fields';

const SIDE = { left: Position.Left, right: Position.Right };

// Evenly distribute N handles along a node's side: 1→[50%], 2→[33%,66%], …
const handleTop = (index, total) => `${(100 * (index + 1)) / (total + 1)}%`;

export const BaseNode = ({ id, data, config }) => {
  const { title, handles = [], fields = [] } = config;

  const bySide = (side) => handles.filter((h) => h.side === side);
  const renderSide = (side) => {
    const group = bySide(side);
    return group.map((h, i) => (
      <Handle
        key={h.id}
        type={h.type}
        position={SIDE[side]}
        id={`${id}-${h.id}`}
        style={{ top: handleTop(i, group.length) }}
      />
    ));
  };

  return (
    <div style={styles.container}>
      {renderSide('left')}
      <div style={styles.title}>{title}</div>
      <div style={styles.body}>
        {fields.map((field) => {
          const Control = FIELD_COMPONENTS[field.type];
          return <Control key={field.name} id={id} data={data} field={field} />;
        })}
      </div>
      {renderSide('right')}
    </div>
  );
};
```

### 4.2 Field registry — pluggable controls

Each control encapsulates the **controlled-input + persist-to-store** pattern exactly once:

```jsx
// fields/TextField.js
import { useState } from 'react';
import { useStore } from '../../store';
import { styles } from '../nodeStyles';

export const TextField = ({ id, data, field }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const initial = data?.[field.name] ?? field.default ?? '';
  const [value, setValue] = useState(initial);

  const onChange = (e) => {
    setValue(e.target.value);
    updateNodeField(id, field.name, e.target.value);
  };

  return (
    <label style={styles.label}>
      {field.label}
      <input type="text" value={value} onChange={onChange} />
    </label>
  );
};
```

```js
// fields/index.js — the registry
import { TextField } from './TextField';
import { SelectField } from './SelectField';
import { TextAreaField } from './TextAreaField';
import { CheckboxField } from './CheckboxField';

export const FIELD_COMPONENTS = {
  text: TextField,
  select: SelectField,
  textarea: TextAreaField,
  checkbox: CheckboxField,
};
```

Adding a brand-new *kind* of control later (a slider, a color picker) = add one file + one registry line. Nothing else changes.

### 4.3 A node becomes a config

A node file shrinks to a declaration:

```jsx
// inputNode.js (refactored — same behaviour as today)
import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    config={{
      title: 'Input',
      handles: [{ id: 'value', type: 'source', side: 'right' }],
      fields: [
        { name: 'inputName', label: 'Name', type: 'text',
          default: id.replace('customInput-', 'input_') },
        { name: 'inputType', label: 'Type', type: 'select', default: 'Text',
          options: ['Text', 'File'] },
      ],
    }}
  />
);
```

## 5. Why this beats the alternatives

| Alternative | Why not |
|---|---|
| **Copy-paste each node (status quo)** | The exact problem we're solving — duplication, N-file restyles. |
| **Inheritance / a base class nodes extend** | Un-idiomatic in React; rigid; hard to compose two behaviours. Composition is the React way. |
| **A higher-order component (`withNode(...)`)** | Works, but HOCs obscure props and stack awkwardly; a config-driven component is more transparent and easier for a new dev to read. |
| **Config-driven `BaseNode` (chosen)** | Maximum reuse, declarative new nodes, single styling source, trivially testable, and the "registry" makes new field types pluggable. |

## 6. What this delivers against the task

- **"Speeds up creating new nodes"** → a node is ~10 lines of config; no structural/handle/state code to rewrite.
- **"Apply styles across nodes in the future"** → edit `nodeStyles.js` once; every node updates.
- **Backwards compatible** → the four existing nodes are refactored onto `BaseNode` with identical on-screen behaviour and the same persistence wiring we added earlier (`updateNodeField`). `ui.js`/`store.js`/`toolbar.js` are untouched except registering the new node types.

## 7. The five new demo nodes (to showcase flexibility)

Each is *only* a config object — proving the abstraction. Planned set:

1. **Filter** — one input handle, one output handle; a `text` field "Condition". (Shows pass-through transform.)
2. **Math** — two input handles (`a`, `b`), one output; a `select` field for operation (+, −, ×, ÷). (Shows multi-input auto-spacing + select.)
3. **Note** — *zero* handles; a `textarea` field. (Shows a node with no connections — pure config flexibility.)
4. **API** — one input, one output; a `text` URL field + a `select` method field (GET/POST/PUT/DELETE). (Shows multiple mixed fields.)
5. **Delay** — one input, one output; a `text` "Seconds" field + a `checkbox` "Repeat" field. (Shows the new checkbox control type.)

These deliberately span: 0 / 1 / 2+ handles, and text / select / textarea / checkbox controls — demonstrating the abstraction handles all current and several new shapes without touching `BaseNode`.

## 8. Implementation plan (after approval)

1. Add `nodeStyles.js` (extract the current look into shared tokens).
2. Add `fields/` (TextField, SelectField, TextAreaField, CheckboxField, registry).
3. Add `BaseNode.js`.
4. Refactor the 4 existing nodes to configs (no behaviour change).
5. Add the 5 new node configs.
6. Register the 5 new types in `ui.js` `nodeTypes` and add `DraggableNode` chips in `toolbar.js`.
7. `CI=true react-scripts build` to confirm a clean compile.

No `git add` / `commit` — changes left in the working tree for your review.
```
```
