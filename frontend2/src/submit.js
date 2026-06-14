// submit.js

import { useState } from 'react';
import { useStore } from './store';
import { theme } from './theme';

// Where the FastAPI backend is served. Override with REACT_APP_API_URL if needed.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const SubmitButton = () => {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hover, setHover] = useState(false);

    const handleSubmit = async () => {
        // Client-side validation before hitting the network.
        if (nodes.length === 0) {
            alert('Your pipeline is empty. Add at least one node before submitting.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/pipelines/parse`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes, edges }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const result = await response.json();
            alert(
                `Pipeline submitted successfully!\n\n` +
                `Number of nodes: ${result.num_nodes}\n` +
                `Number of edges: ${result.num_edges}\n` +
                `Is a valid DAG: ${result.is_dag ? 'Yes' : 'No'}`
            );
        } catch (error) {
            alert(
                `Could not submit the pipeline.\n\n` +
                `${error.message}\n\n` +
                `Make sure the backend is running at ${API_URL}.`
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                padding: '12px 24px',
                background: theme.color.surface,
                borderTop: `1px solid ${theme.color.border}`,
                boxShadow: '0 -2px 12px rgba(15, 23, 42, 0.05)',
            }}
        >
            <div style={{ fontSize: 13, color: theme.color.textMuted }}>
                <span style={{ fontWeight: 600, color: theme.color.text }}>{nodes.length}</span>{' '}
                {nodes.length === 1 ? 'node' : 'nodes'}
                <span style={{ margin: '0 8px', color: theme.color.border }}>•</span>
                <span style={{ fontWeight: 600, color: theme.color.text }}>{edges.length}</span>{' '}
                {edges.length === 1 ? 'edge' : 'edges'}
            </div>

            <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 24px',
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    color: '#fff',
                    background: theme.color.brandGradient,
                    border: 'none',
                    borderRadius: theme.radius.md,
                    cursor: isSubmitting ? 'wait' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                    boxShadow: hover && !isSubmitting
                        ? '0 8px 20px rgba(99, 102, 241, 0.45)'
                        : '0 4px 12px rgba(99, 102, 241, 0.35)',
                    transform: hover && !isSubmitting ? 'translateY(-1px)' : 'none',
                    transition: 'all 0.16s ease',
                }}
            >
                {isSubmitting ? 'Submitting…' : 'Submit Pipeline'}
            </button>
        </footer>
    );
}
