import React, { useRef, useEffect, useState } from 'react';

const Graph = ({ points, curvePoints, onAddPoint, equation }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const padding = 60; // Space for axes

    // Transform coordinates
    const toCanvasX = (x) => padding + (x / 100) * (dimensions.width - 2 * padding);
    const toCanvasY = (y) => (dimensions.height - padding) - (y / 100) * (dimensions.height - 2 * padding);

    const fromCanvasX = (cx) => ((cx - padding) / (dimensions.width - 2 * padding)) * 100;
    const fromCanvasY = (cy) => ((dimensions.height - padding - cy) / (dimensions.height - 2 * padding)) * 100;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { width, height } = dimensions;

        if (width === 0 || height === 0) return;

        // Set resolution
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        // Reset style width/height
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Grid
        ctx.strokeStyle = '#334155'; // slate-700
        ctx.lineWidth = 1;
        ctx.beginPath();

        // Vertical grid
        for (let i = 0; i <= 10; i++) {
            const x = toCanvasX(i * 10);
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            // Axis Labels X
            ctx.fillStyle = '#94a3b8';
            ctx.font = '12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(i * 10, x, height - padding + 20);
        }

        // Horizontal grid
        for (let i = 0; i <= 10; i++) {
            const y = toCanvasY(i * 10);
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            // Axis Labels Y
            ctx.fillStyle = '#94a3b8';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(i * 10, padding - 10, y);
        }
        ctx.stroke();

        // Axes
        ctx.strokeStyle = '#cbd5e1'; // slate-300
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Y Axis
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        // X Axis
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Axis Titles (X: Input (x), Y: Output (y))
        ctx.fillStyle = '#cbd5e1';
        ctx.textAlign = 'center';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillText("Input Feature (x)", width / 2, height - 10);

        ctx.save();
        ctx.translate(20, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("Target Variable (y)", 0, 0);
        ctx.restore();

        // Draw Curve
        if (curvePoints.length > 0) {
            ctx.beginPath();
            ctx.strokeStyle = '#3b82f6'; // blue-500
            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';

            let first = true;
            for (const p of curvePoints) {
                // limit to plot area to avoid drawing over axes
                const cx = toCanvasX(p.x);
                const cy = toCanvasY(p.y);

                // Simple clipping check
                const inBounds = p.x >= 0 && p.x <= 100; // y can go out
                // Actually canvas clipping is better
                if (first) {
                    ctx.moveTo(cx, cy);
                    first = false;
                } else {
                    ctx.lineTo(cx, cy);
                }
            }
            // Clip region
            ctx.save();
            ctx.beginPath();
            ctx.rect(padding, padding, width - 2 * padding, height - 2 * padding);
            ctx.clip();

            // Re-draw path inside clip
            ctx.beginPath();
            first = true;
            for (const p of curvePoints) {
                ctx.lineTo(toCanvasX(p.x), toCanvasY(p.y)); // Simplification: just connect all
            }
            ctx.stroke();
            ctx.restore();
        }

        // Draw Points
        points.forEach(p => {
            const cx = toCanvasX(p.x);
            const cy = toCanvasY(p.y);

            ctx.beginPath();
            ctx.arc(cx, cy, 6, 0, Math.PI * 2); // Outer glow/border
            ctx.fillStyle = '#0f172a';
            ctx.fill();
            ctx.strokeStyle = '#f472b6'; // pink-400
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(cx, cy, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#ec4899'; // pink-500
            ctx.fill();
        });

    }, [dimensions, points, curvePoints]);

    const handleClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Bounds check
        if (clickX < padding || clickX > dimensions.width - padding ||
            clickY < padding || clickY > dimensions.height - padding) {
            return;
        }

        const x = fromCanvasX(clickX);
        const y = fromCanvasY(clickY);
        onAddPoint({ x, y });
    };

    return (
        <div className="graph-container" ref={containerRef} style={{ width: '100%', height: '100%' }}>
            <canvas
                ref={canvasRef}
                onClick={handleClick}
                style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
            />
            {equation && (
                <div className="equation-overlay">
                    f(x) = {equation}
                </div>
            )}
        </div>
    );
};

export default Graph;
