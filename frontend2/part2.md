# Part 2 — Text Node Logic

## Goal

Improve the Text node's text input in two ways:

1. **Auto-resize** — the node's **width and height grow as the user types**, so longer text stays visible.
2. **Variables → Handles** — when the user types a valid JS variable name in double curly braces, e.g. `{{ input }}`, a new **target Handle** appears on the **left** of the node for that variable.

Everything was built **on top of the Part 1 abstraction** — no copy-paste, no special-casing inside other nodes.

---

## 1. Auto-resizing the node

Width and height are handled by two cooperating pieces, because they grow for different reasons:

### Height — grows with the number of lines
A new field control, **`AutoResizeTextArea`** ([fields/AutoResizeTextArea.js](src/nodes/fields/AutoResizeTextArea.js)), wraps a `<textarea>` and, after every change, resets and re-measures its height:

```js
useLayoutEffect(() => {
  const el = ref.current;
  el.style.height = 'auto';          // collapse first so scrollHeight is accurate
  el.style.height = `${el.scrollHeight}px`;  // grow to fit the content
}, [value]);
```

- `scrollHeight` is the full content height including overflow. Setting `height` to it makes the box exactly fit the text.
- We set `height = 'auto'` *first* so the box can shrink back when text is deleted (otherwise it would only ever grow).
- `useLayoutEffect` runs **before paint**, so the user never sees a wrong-sized flash.
- `overflow: 'hidden'` + `resize: 'none'` hide the scrollbar and the manual drag handle, so the box looks like it's growing naturally.

### Width — grows with the longest line
The node itself computes a width from the text and passes it down as a container style. In [textNode.js](src/nodes/textNode.js):

```js
const widthForText = (text) => {
  const longestLine = text.split('\n').reduce((m, line) => Math.max(m, line.length), 0);
  return Math.min(Math.max(longestLine * 8 + 48, 200), 480); // clamp 200–480px
};
```

This is passed via the abstraction's new **`containerStyle`** hook:

```jsx
<BaseNode config={{ ..., containerStyle: { width: widthForText(text) } }} />
```

And [BaseNode.js](src/nodes/BaseNode.js) merges it over the shared style:

```jsx
<div style={{ ...styles.container, ...config.containerStyle }}>
```

So **width is driven by the node** (longest line, clamped to a sensible 200–480px range) and **height is driven by the textarea** (line count). Together they make the node grow in both dimensions as you type.

> Why split it this way? The textarea owns its own height cheaply via `scrollHeight`. Width can't be measured the same way (a textarea doesn't auto-fit width), so the node derives it from the text and the textarea simply fills `width: 100%` of the container.

---

## 2. Variables → Handles

### Detecting variables
A regex finds every `{{ ... }}` whose inner text is a **valid JavaScript identifier**:

```js
const VARIABLE_RE = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;
```

- `\{\{ ... \}\}` matches the literal double braces.
- `\s*` allows optional spaces inside, so `{{input}}` and `{{ input }}` both work.
- `[A-Za-z_$][A-Za-z0-9_$]*` is the JS identifier rule: must **start** with a letter, `_`, or `$`, then letters/digits/`_`/`$`. This correctly **rejects** invalid names like `{{ 1abc }}` or `{{ a-b }}`.

Matches are collected into a `Set` so duplicates (`{{x}} ... {{x}}`) produce **one** handle:

```js
const extractVariables = (text) => {
  const found = new Set();
  let m;
  while ((m = VARIABLE_RE.exec(text)) !== null) found.add(m[1]);
  return [...found];
};
```

### Turning variables into handles
The detected variables become left-side target handles, plus the node keeps its existing output handle on the right:

```js
const handles = [
  ...variables.map((name) => ({ id: name, type: 'target', side: 'left' })),
  { id: 'output', type: 'source', side: 'right' },
];
```

These are handed to `BaseNode`, which already knows how to render and **auto-space** any number of handles on a side (from Part 1). So 1 variable sits at 50%, 2 variables at 33%/66%, etc. — no extra code.

### The critical React Flow detail: `updateNodeInternals`
React Flow **caches** each node's handle layout for performance. If you add or remove handles without telling it, the new handles won't be connectable and edge positions go stale. So whenever the variable set changes we notify it:

```js
const updateNodeInternals = useUpdateNodeInternals();
useEffect(() => {
  updateNodeInternals(id);
}, [id, variables, updateNodeInternals]);
```

This is the single most important "gotcha" of dynamic handles — worth calling out in the interview.

---

## 3. How the data flows (why it re-renders correctly)

```
user types in textarea
   → AutoResizeTextArea.onChange
       → setValue(local)                 (controlled input updates)
       → updateNodeField(id,'text',val)  (writes to the Zustand store, immutably)
   → store's `nodes` array gets a new node object  (the immutable update we added in the fixes)
   → React Flow re-renders <TextNode> with the new `data.text` prop
       → extractVariables(text)  recomputes the handle list
       → widthForText(text)      recomputes the width
       → useEffect calls updateNodeInternals(id)
   → BaseNode renders the new handles + new width; textarea auto-grows its height
```

The key enabler is the **immutable `updateNodeField`** from the earlier bug-fix work: because it returns a *new* node object, React Flow detects the change and re-renders the node with fresh `data`, which is what lets the parent recompute variables and size from the live text.

---

## 4. Why this design is clean

- **Reused the Part 1 abstraction.** The Text node is still a `BaseNode` + config. The only new primitives are one field type (`autoTextarea`) and one optional `containerStyle` hook — both reusable by *any* future node.
- **Single responsibility.** The textarea owns its height; the node owns its width and its handle list; `BaseNode` owns rendering and handle spacing.
- **No special-casing elsewhere.** `store.js`, `ui.js`, and the other nodes were untouched. `BaseNode` gained one generic line (`...config.containerStyle`) that helps every node, not just Text.
- **Correctness with React Flow.** Dynamic handles are paired with `updateNodeInternals`, the officially required call for runtime handle changes.

## 5. Files changed / added

| File | Change |
|---|---|
| [src/nodes/fields/AutoResizeTextArea.js](src/nodes/fields/AutoResizeTextArea.js) | **New** — height-auto-resizing textarea control |
| [src/nodes/fields/index.js](src/nodes/fields/index.js) | Registered `autoTextarea` |
| [src/nodes/BaseNode.js](src/nodes/BaseNode.js) | Merge optional `config.containerStyle` into the container |
| [src/nodes/textNode.js](src/nodes/textNode.js) | Variable parsing, dynamic handles, content-driven width, `updateNodeInternals` |

## 6. How to demo it

1. `cd frontend2 && npm start`
2. Drag a **Text** node onto the canvas. It starts with `{{input}}` → one `input` handle on the left.
3. Type more text / press Enter → the node **grows wider and taller**.
4. Type `{{ name }}` and `{{ city }}` → **two more left handles** appear, evenly spaced.
5. Delete a variable → its handle disappears. Repeat a variable twice → still one handle.
6. Type an invalid name like `{{ 1abc }}` → **no** handle is created.
