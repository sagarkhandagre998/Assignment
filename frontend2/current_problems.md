# Current Problems — Confirmed & Verified

This file is the result of **independently re-auditing** the codebase against the issues listed in `problem.md` (which was produced by another model). Each item below is marked:

- ✅ **CONFIRMED** — the problem is real and currently present in the code.
- ❌ **ALREADY FIXED** — `problem.md` lists it, but the current code does **not** have this problem (it was already resolved). Good to know so you don't "fix" something that isn't broken in the interview.
- 🆕 **NEW** — a real problem `problem.md` **missed**.

> Verified against the actual files on 2026-06-09, with `zustand@5.0.14` confirmed installed in `node_modules`.

---

## A. Issues from `problem.md` — verification results

### ❌ 1. `nodeIDs` not initialized — ALREADY FIXED
`problem.md` claims `nodeIDs` is missing from the store. **It is not.** [store.js:14](src/store.js#L14) already has `nodeIDs: {}`. No action needed.

### ✅ 2. Direct state mutation in `updateNodeField` — CONFIRMED
[store.js:48](src/store.js#L48):
```js
node.data = { ...node.data, [fieldName]: fieldValue };
```
This mutates the existing `node` object in place (only `data` is spread; the node reference is reused). React Flow / Zustand may miss the change because the node reference is unchanged. **Real bug.**

### ❌ 3. Invalid CSS unit `100wv` — ALREADY FIXED
`problem.md` claims `width: '100wv'`. The current code at [ui.js:93](src/ui.js#L93) already reads `width: '100vw'`. No action needed.

### ❌ 4. Missing Zustand dependency — ALREADY FIXED
`problem.md` says zustand is not in dependencies. It **is**: [package.json:14](package.json#L14) lists `"zustand": "^5.0.14"`, and it is installed. No action needed. **However** — see NEW issue #16, because this exact version introduces a real bug.

### ✅ 5. InputNode state not persisted — CONFIRMED
[inputNode.js](src/nodes/inputNode.js) keeps `currName` / `inputType` in local `useState` and **never calls `updateNodeField`**. It even imports `useStore` but doesn't use it. The global graph never sees the user's edits. **Real bug.**

### ✅ 6. OutputNode state not persisted — CONFIRMED
[outputNode.js](src/nodes/outputNode.js) — same problem, and it doesn't even import `useStore`. **Real bug.**

### ✅ 7. TextNode state not persisted — CONFIRMED
[textNode.js](src/nodes/textNode.js) — text lives only in local state; never written back to the store. **Real bug.**

### ✅ 8. Incorrect output type value — CONFIRMED
[outputNode.js:42](src/nodes/outputNode.js#L42):
```jsx
<option value="File">Image</option>
```
Label says "Image" but the stored value is `"File"`. **Real bug.**

### ✅ 9. Missing React Flow instance guard — CONFIRMED
[ui.js:67](src/ui.js#L67) calls `reactFlowInstance.project(...)` with no `if (!reactFlowInstance) return;`. If a drop fires before `onInit`, this throws. **Real (minor) bug.**

### ✅ 10. Node initialization data is minimal — CONFIRMED (enhancement)
[ui.js:48-51](src/ui.js#L48) `getInitNodeData` only stores `{ id, nodeType }`. No default field values, so graph state is empty until the user touches every field. **Valid enhancement.**

### ✅ 11. Submit button has no functionality — CONFIRMED
[submit.js](src/submit.js) renders a `<button>` with **no `onClick`**. **Real bug.**

### ✅ 12. No backend integration — CONFIRMED
Nodes/edges are never sent anywhere. **Real bug.**

### ✅ 13. LLM node is only a placeholder — CONFIRMED (enhancement)
[llmNode.js](src/nodes/llmNode.js) is static display only. **Valid enhancement** (not a crash).

### ✅ 14. No graph validation before submission — CONFIRMED (enhancement)
No client-side check for empty graph / orphan edges. **Valid enhancement.**

### ✅ 15. Missing error handling around API operations — CONFIRMED (enhancement)
No `try/catch` for network/backend failures (because there is no network call yet). **Valid enhancement**, tied to #11/#12.

---

## B. 🆕 NEW problems that `problem.md` MISSED

### 🆕 16. **Zustand v5 breaking change — `useStore(selector, shallow)` is broken** *(Critical)*
[ui.js:46](src/ui.js#L46):
```js
const { ... } = useStore(selector, shallow);
```
In **Zustand v4** the React hook accepted a second equality-function argument. **Zustand v5 removed it.** With v5 (which is what's installed, `5.0.14`), the second argument is ignored, and because `selector` returns a **new object every render**, the default `Object.is` comparison always sees a change → **`getSnapshot should be cached` warning and an infinite re-render loop / performance death spiral.**

**Fix:** use the v5-idiomatic shallow selector: `import { useShallow } from 'zustand/react/shallow'` and call `useStore(useShallow(selector))`. This is arguably the single most important real bug, and `problem.md` did not catch it because it only checked that zustand was *listed*, not that the *usage matched the installed major version*.

### 🆕 17. **Backend route uses `GET` + `Form(...)` — invalid combination**
[backend/main.py:9-11](../backend/main.py#L9):
```python
@app.get('/pipelines/parse')
def parse_pipeline(pipeline: str = Form(...)):
```
A `GET` request has no form body, so `Form(...)` on a GET endpoint is a contradiction — the frontend cannot post a JSON pipeline to it. It should be a **`POST`** that accepts the `{ nodes, edges }` JSON, and it should return real analytics (`num_nodes`, `num_edges`, `is_dag`).

### 🆕 18. **No CORS on the backend**
The FastAPI app has no `CORSMiddleware`. The frontend runs on `localhost:3000` and the API on `localhost:8000`; without CORS the browser will **block every request**. Must add `CORSMiddleware`.

### 🆕 19. **Unused import in `inputNode.js`**
[inputNode.js:5](src/nodes/inputNode.js#L5) imports `useStore` but never uses it (a symptom of issue #5 — the persistence was never wired up). Minor lint smell; resolved when #5 is fixed.

---

## C. Summary table

| # | Issue | Source | Status | Severity |
|---|-------|--------|--------|----------|
| 1 | `nodeIDs` not initialized | problem.md | ❌ already fixed | — |
| 2 | Direct state mutation | problem.md | ✅ confirmed | High |
| 3 | `100wv` CSS unit | problem.md | ❌ already fixed | — |
| 4 | Missing zustand dependency | problem.md | ❌ already fixed | — |
| 5 | InputNode not persisted | problem.md | ✅ confirmed | High |
| 6 | OutputNode not persisted | problem.md | ✅ confirmed | High |
| 7 | TextNode not persisted | problem.md | ✅ confirmed | High |
| 8 | Output option value `File`/Image | problem.md | ✅ confirmed | Medium |
| 9 | Missing instance guard | problem.md | ✅ confirmed | Low |
| 10 | Minimal node init data | problem.md | ✅ confirmed | Medium |
| 11 | Submit button no handler | problem.md | ✅ confirmed | High |
| 12 | No backend integration | problem.md | ✅ confirmed | High |
| 13 | LLM node placeholder | problem.md | ✅ confirmed | Low (enh.) |
| 14 | No graph validation | problem.md | ✅ confirmed | Low (enh.) |
| 15 | No API error handling | problem.md | ✅ confirmed | Medium |
| **16** | **Zustand v5 `shallow` arg removed** | **NEW** | 🆕 confirmed | **Critical** |
| **17** | **Backend GET+Form invalid** | **NEW** | 🆕 confirmed | High |
| **18** | **No CORS on backend** | **NEW** | 🆕 confirmed | High |
| **19** | **Unused `useStore` import** | **NEW** | 🆕 confirmed | Low |

**Bottom line:** of the 15 items in `problem.md`, **3 were already fixed** (1, 3, 4) and **12 are real**. The audit found **4 additional real problems** — most importantly the **Zustand v5 `shallow` breaking change (#16)**, which is the highest-impact bug in the project.
