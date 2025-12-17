// submit.tsx
import React from 'react';
import { useStore } from './store';

export const SubmitButton = () => {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nodes, edges }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Display a user-friendly alert
            alert(
                `Pipeline Analysis:\n\n` +
                `Number of Nodes: ${data.num_nodes}\n` +
                `Number of Edges: ${data.num_edges}\n` +
                `Is DAG (Directed Acyclic Graph): ${data.is_dag ? 'Yes ✓' : 'No ✗'}\n\n` +
                (data.is_dag 
                    ? 'Your pipeline is valid!' 
                    : 'Warning: Your pipeline contains cycles!')
            );
        } catch (error) {
            console.error('Error submitting pipeline:', error);
            alert('Error: Could not connect to backend. Make sure the backend server is running on port 8000.');
        }
    };

    return (
        <div style={{
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '16px',
            backgroundColor: '#F7FAFC',
            borderTop: '2px solid #E2E8F0'
        }}>
            <button 
                type="button"
                onClick={handleSubmit}
                style={{
                    padding: '12px 32px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    backgroundColor: '#4299E1',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#3182CE';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#4299E1';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
            >
                Submit Pipeline
            </button>
        </div>
    );
}
