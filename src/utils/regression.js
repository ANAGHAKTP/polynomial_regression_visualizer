import { matrix, multiply, transpose, inv, pinv } from 'mathjs';

/**
 * Performs polynomial regression on the given data points.
 * @param {Array<{x: number, y: number}>} points - The data points.
 * @param {number} degree - The degree of the polynomial.
 * @returns {Object} - An object containing the coefficients and a predict function.
 */
export const calculatePolynomialRegression = (points, degree) => {
  if (points.length === 0) {
    return {
      coefficients: [],
      predict: () => 0,
      equation: 'y = 0',
      r2: 0
    };
  }

  // Extract x and y
  const xValues = points.map(p => p.x);
  const yValues = points.map(p => p.y);

  // Normalize X to avoid numerical instability with high degrees
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const xRange = xMax - xMin || 1; // Avoid division by zero
  
  // Normalize function: mapped to [-1, 1] roughly or just shift to 0..1? 
  // Let's shift to centroid or just scale. 
  // Simple scaling: (x - mean) / std might be best, but (x-min)/(max-min) is okay.
  // Actually, for visualization, raw values are often fine if range is small (0-100).
  // But degree 10 on 100^10 is huge.
  // Let's just use raw values first but use mathjs bignumber if needed? no, standard numbers are faster.
  // I will use `pinv` which uses SVD, so it is robust to ill-conditioning.
  
  // Construct Vandermonde matrix X
  const X_data = [];
  for (let i = 0; i < points.length; i++) {
    const row = [];
    for (let j = 0; j <= degree; j++) {
      row.push(Math.pow(xValues[i], j));
    }
    X_data.push(row);
  }

  const Y_data = yValues.map(y => [y]); // Column vector

  let beta;
  try {
    const X = matrix(X_data);
    const Y = matrix(Y_data);
    const XT = transpose(X);
    
    // beta = pinv(X) * Y is equivalent to (XT * X)^-1 * XT * Y but more robust
    // Actually, strictly (XT*X)^-1 * XT * Y is OLS. pinv(X) gives minimum norm solution for singular.
    beta = multiply(pinv(X), Y);
  } catch (error) {
    console.error("Regression calculation failed:", error);
    return { coefficients: [], predict: () => 0, equation: 'Error', r2: 0 };
  }

  const coeffs = beta.valueOf().flat(); // Flatten column vector to array

  const predict = (x) => {
    let y = 0;
    for (let j = 0; j < coeffs.length; j++) {
      y += coeffs[j] * Math.pow(x, j);
    }
    return y;
  };

  // Calculate R2
  const yMean = yValues.reduce((a, b) => a + b, 0) / yValues.length;
  const ssTot = yValues.reduce((acc, y) => acc + Math.pow(y - yMean, 2), 0);
  const ssRes = points.reduce((acc, p) => acc + Math.pow(p.y - predict(p.x), 2), 0);
  const r2 = 1 - (ssRes / (ssTot || 1));

  // Format equation string
  const equation = coeffs.map((c, i) => {
    if (Math.abs(c) < 0.001) return null;
    const sign = c >= 0 ? (i === 0 ? '' : '+ ') : '- ';
    const val = Math.abs(c).toFixed(2);
    if (i === 0) return `${sign}${val}`;
    if (i === 1) return `${sign}${val}x`;
    return `${sign}${val}x^${i}`;
  }).filter(Boolean).join(' ') || 'y = 0';

  return { coefficients: coeffs, predict, equation, r2 };
};

/**
 * Generates points for the regression curve.
 * @param {Function} predict - The prediction function.
 * @param {number} xMin - Min x value.
 * @param {number} xMax - Max x value.
 * @param {number} steps - Number of steps.
 * @returns {Array<{x: number, y: number}>}
 */
export const generateCurvePoints = (predict, xMin, xMax, steps = 100) => {
  const curve = [];
  const stepSize = (xMax - xMin) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * stepSize;
    curve.push({ x, y: predict(x) });
  }
  return curve;
};
