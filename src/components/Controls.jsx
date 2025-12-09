import React from 'react';
import { Plus, RefreshCcw, Info, Trash2 } from 'lucide-react';

const Controls = ({
    degree,
    setDegree,
    onReset,
    onClear,
    pointsCount,
    r2
}) => {
    return (
        <div className="controls-card">
            <div className="controls-header">
                <h2 className="controls-title">
                    <Info className="icon-blue" size={20} />
                    Controls
                </h2>
                <div className="button-group">
                    <button
                        onClick={onClear}
                        className="icon-btn"
                        title="Clear all points"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        onClick={onReset}
                        className="icon-btn"
                        title="Reset to default example"
                    >
                        <RefreshCcw size={16} />
                    </button>
                </div>
            </div>

            <div className="slider-group">
                <div className="slider-label">
                    <label>Polynomial Degree</label>
                    <span className="highlight">{degree}</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="15"
                    value={degree}
                    onChange={(e) => setDegree(parseInt(e.target.value))}
                    className="slider"
                />
                <div className="axis-labels">
                    <span>Underfitting</span>
                    <span>Overfitting</span>
                </div>
            </div>

            <div className="stats-box">
                <div className="stat-row">
                    <span className="stat-label">Points</span>
                    <span className="stat-value">{pointsCount}</span>
                </div>
                <div className="stat-row">
                    <span className="stat-label">R² Score</span>
                    <span className={`stat-value ${r2 > 0.9 ? 'good' : 'bad'}`}>{r2.toFixed(4)}</span>
                </div>
            </div>

            <div className="instructions">
                <p>
                    <strong>Instructions:</strong>
                </p>
                <ul>
                    <li>Click on the graph to add data points.</li>
                    <li>Adjust the degree to see how the model fits.</li>
                    <li>Observe how high degrees oscillate to fit noise (overfitting).</li>
                </ul>
            </div>
        </div>
    );
};

export default Controls;
