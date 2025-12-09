import React, { useState, useEffect } from 'react';
import { calculatePolynomialRegression, generateCurvePoints } from './utils/regression';
import Controls from './components/Controls';
import Graph from './components/Graph';
import './App.css';

const App = () => {
  const [points, setPoints] = useState([
    { x: 10, y: 20 },
    { x: 20, y: 45 },
    { x: 30, y: 35 },
    { x: 40, y: 65 },
    { x: 50, y: 55 },
    { x: 60, y: 80 },
    { x: 70, y: 70 },
  ]);
  const [degree, setDegree] = useState(2);
  const [model, setModel] = useState({ coefficients: [], predict: () => 0, equation: '', r2: 0 });
  const [curvePoints, setCurvePoints] = useState([]);

  // Recalculate regression when points or degree change
  useEffect(() => {
    const result = calculatePolynomialRegression(points, degree);
    setModel(result);

    const curve = generateCurvePoints(result.predict, 0, 100, 200);
    setCurvePoints(curve);
  }, [points, degree]);

  const handleAddPoint = (point) => {
    setPoints([...points, point]);
  };

  const handleReset = () => {
    setPoints([
      { x: 10, y: 20 },
      { x: 20, y: 45 },
      { x: 30, y: 35 },
      { x: 40, y: 65 },
      { x: 50, y: 55 },
      { x: 60, y: 80 },
      { x: 70, y: 70 },
    ]);
    setDegree(2);
  };

  const handleClear = () => {
    setPoints([]);
  };

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 className="title">
            Polynomial Regression
          </h1>
          <p className="subtitle">
            Visualize the trade-off between model flexibility (degree) and generalization (overfitting).
          </p>
        </div>
      </header>

      <main className="main-content">
        <Graph
          points={points}
          curvePoints={curvePoints}
          onAddPoint={handleAddPoint}
          equation={model.equation}
        />

        <div className="sidebar">
          <Controls
            degree={degree}
            setDegree={setDegree}
            onReset={handleReset}
            onClear={handleClear}
            pointsCount={points.length}
            r2={model.r2}
          />

          <div className="info-box">
            <span className="info-title">What is happening?</span>
            <p className="mb-2">
              <span className="text-blue">Low Degree (1-2):</span> The model may be too simple to capture the pattern (Underfitting).
            </p>
            <p>
              <span className="text-pink">High Degree (10+):</span> The model wiggles excessively to hit every point, failing to generalize (Overfitting).
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
