# Frontend Code Review – Issues Found

## 1. `nodeIDs` State Not Initialized

### File

`store.js`

### Problem

The `getNodeID()` function accesses:

```js
get().nodeIDs
```

However, `nodeIDs` is never initialized in the Zustand store.

Current store:

```js
export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
}));
```

When the first node is dropped, this can cause:

```text
Cannot convert undefined or null to object
```

### Fix

```js
nodeIDs: {}
```

should be added to the initial state.

---

## 2. Direct State Mutation in `updateNodeField`

### File

`store.js`

### Problem

Current implementation mutates node objects directly:

```js
node.data = {
  ...node.data,
  [fieldName]: fieldValue
};
```

Direct mutation can cause ReactFlow and Zustand state synchronization issues and makes state updates harder to track.

### Recommended Fix

Use immutable updates with `map()` and return a new node object.

---

## 3. Invalid CSS Unit

### File

`ui.js`

### Problem

Current code:

```js
width: '100wv'
```

`wv` is not a valid CSS unit.

### Fix

```js
width: '100vw'
```

---

## 4. Missing Zustand Dependency

### File

`package.json`

### Problem

The application imports Zustand:

```js
import { create } from "zustand";
```

but Zustand is not listed in dependencies.

### Impact

Project installation/build may fail on a clean environment.

### Fix

Add:

```json
"zustand": "^4.x"
```

or run:

```bash
npm install zustand
```

---

## 5. InputNode State Is Not Persisted

### File

`nodes/inputNode.js`

### Problem

The component stores values only in local React state:

```js
const [currName, setCurrName]
const [inputType, setInputType]
```

Changes are not written back to the global graph state.

### Impact

The graph does not contain the latest node configuration.

### Recommended Fix

Call:

```js
updateNodeField(...)
```

whenever name or type changes.

---

## 6. OutputNode State Is Not Persisted

### File

`nodes/outputNode.js`

### Problem

Output node values are stored only in component state and never synchronized with Zustand.

### Impact

Graph data becomes inconsistent with what users see in the UI.

### Recommended Fix

Persist all field changes using:

```js
updateNodeField(...)
```

---

## 7. TextNode State Is Not Persisted

### File

`nodes/textNode.js`

### Problem

The text content is managed only through:

```js
useState(...)
```

No updates are pushed to the global graph state.

### Impact

Submitted graph may not contain the latest text entered by the user.

### Recommended Fix

Synchronize text changes through:

```js
updateNodeField(id, "text", value)
```

---

## 8. Incorrect Output Type Value

### File

`nodes/outputNode.js`

### Problem

Current code:

```jsx
<option value="File">Image</option>
```

The displayed label is "Image" but the stored value is "File".

### Impact

Incorrect output type is saved.

### Fix

```jsx
<option value="Image">Image</option>
```

---

## 9. Missing ReactFlow Instance Guard

### File

`ui.js`

### Problem

`reactFlowInstance.project()` is called without checking whether the instance exists.

Example:

```js
reactFlowInstance.project(...)
```

### Risk

Can cause runtime errors if the drop event fires before initialization.

### Recommended Fix

Add:

```js
if (!reactFlowInstance) return;
```

before usage.

---

## 10. Node Initialization Data Is Minimal

### File

`ui.js`

### Problem

New nodes are initialized with:

```js
{
  id,
  nodeType
}
```

Only minimal information is stored.

### Impact

Nodes rely on local component state instead of graph state.

### Recommendation

Provide proper default values during node creation, such as:

* input name
* input type
* output name
* output type
* text content

---

## 11. Submit Button Has No Functionality

### File

`submit.js`

### Problem

The submit button only renders UI:

```jsx
<button type="submit">
```

No click handler exists.

### Impact

Users cannot send pipeline data to the backend.

### Recommended Fix

Implement:

* API request
* graph serialization
* response handling

---

## 12. No Backend Integration

### File

`submit.js`

### Problem

Nodes and edges are never sent to any API endpoint.

Expected behavior is likely:

```http
POST /pipelines/parse
```

with:

```json
{
  "nodes": [...],
  "edges": [...]
}
```

### Impact

Frontend cannot communicate with backend.

---

## 13. LLM Node Is Only a Placeholder

### File

`nodes/llmNode.js`

### Problem

The LLM node is currently a static display component.

It contains:

* no model selection
* no provider selection
* no temperature settings
* no prompt configuration

### Impact

The node has no configurable behavior.

---

## 14. No Graph Validation Before Submission

### Problem

The frontend submits graph data without validating:

* missing nodes
* orphan edges
* invalid connections
* cycles (if DAG required)

### Impact

Invalid graph structures may reach the backend.

### Recommendation

Perform client-side validation before submission.

---

## 15. Missing Error Handling Around API Operations

### Problem

No handling exists for:

* network failures
* backend errors
* malformed responses

### Impact

Poor user experience and debugging difficulty.

### Recommendation

Add:

```js
try {
  ...
} catch (error) {
  ...
}
```

around API requests.

---

# Summary

## Critical Issues

1. `nodeIDs` not initialized.
2. Missing Zustand dependency.
3. InputNode state not persisted.
4. OutputNode state not persisted.
5. TextNode state not persisted.
6. Submit button not implemented.
7. No backend integration.

## Important Issues

1. Direct state mutation.
2. Incorrect output type value.
3. Invalid CSS unit (`100wv`).
4. Missing ReactFlow instance guard.

## Enhancement Opportunities

1. Better node initialization.
2. LLM node configuration.
3. Graph validation.
4. API error handling.
5. Improved state architecture.
