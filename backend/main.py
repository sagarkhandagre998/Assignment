from typing import List, Dict, Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow the React dev server (and others) to call this API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


class Pipeline(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


def is_dag(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> bool:
    """Return True if the graph has no cycles (i.e. it is a valid DAG).

    Uses Kahn's algorithm: repeatedly remove nodes with no remaining
    incoming edges. If every node can be removed, the graph is acyclic.
    """
    node_ids = {node.get('id') for node in nodes}

    # Build adjacency list + in-degree count, ignoring edges to/from
    # unknown nodes (orphan edges).
    adjacency: Dict[Any, List[Any]] = {nid: [] for nid in node_ids}
    in_degree: Dict[Any, int] = {nid: 0 for nid in node_ids}

    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        if source in node_ids and target in node_ids:
            adjacency[source].append(target)
            in_degree[target] += 1

    # Start with all nodes that have no incoming edges.
    queue = [nid for nid in node_ids if in_degree[nid] == 0]
    visited = 0

    while queue:
        current = queue.pop()
        visited += 1
        for neighbor in adjacency[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If we visited every node, there was no cycle.
    return visited == len(node_ids)


@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    return {
        'num_nodes': len(pipeline.nodes),
        'num_edges': len(pipeline.edges),
        'is_dag': is_dag(pipeline.nodes, pipeline.edges),
    }
