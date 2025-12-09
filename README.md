# Polynomial Regression Visualizer

Interactive visualization tool to demonstrate Polynomial Regression, Model Complexity, and the Bias-Variance Tradeoff (Underfitting vs. Overfitting). Built with React, Vite, and HTML5 Canvas.

![Polynomial Regression](https://img.shields.io/badge/Polynomial-Regression-blue)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0-646cff?logo=vite)
![Math.js](https://img.shields.io/badge/Math.js-Linear%20Algebra-orange)

## 🌟 Features

-   **Interactive Data Points**: Click anywhere on the graph to add data points dynamically.
-   **Real-time Regression**: Instantly calculates and fits a polynomial curve of degree $N$ to the data.
-   **Adjustable Complexity**: Slider to change the polynomial degree from 1 (Linear) to 15 (Highly Complex).
-   **Performance Metrics**: Real-time display of the $R^2$ (Coefficient of Determination) score.
-   **Premium UI**: Dark mode aesthetic with glassmorphism effects and smooth animations.

## 🧠 Educational Concepts

### 1. Simple Linear Regression (Underfitting)
*   **Degree 1**: A straight line tries to fit curved data.
*   **Concept**: High Bias. The model is too simple to capture the underlying structure of the data.

### 2. Good Fit
*   **Degree 2-4**: The curve follows the general trend of the data without reacting to every minor fluctuation.
*   **Concept**: Balance between Bias and Variance.

### 3. Polynomial Regression (Overfitting)
*   **Degree 10+**: The curve oscillates correctly to pass through or near every single data point, but creates wild predictions between points.
*   **Concept**: High Variance. The model "memorizes" the noise in the training data rather than learning the general pattern.

## 🚀 Getting Started

### Prerequisites
-   Node.js (v14 or higher)
-   npm (v6 or higher)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/SudoAnirudh/polynomial_regression_visualizer.git
    cd polynomial_regression_visualizer
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠️ Tech Stack

-   **Frontend Framework**: React 18
-   **Build Tool**: Vite
-   **Math Engine**: `mathjs` (for Matrix operations and Pseudoinverse calculation)
-   **Rendering**: HTML5 Canvas (via React Ref) for high-performance plotting
-   **Styling**: Vanilla CSS (CSS Variables & Flexbox/Grid)

## 🧮 How It Works

The application solves the **Normal Equation** for Linear Regression dealing with polynomial features:

$$ \beta = (X^T X)^{-1} X^T y $$

Where $X$ is the Vandermonde matrix:
$$
X = \begin{bmatrix}
1 & x_1 & x_1^2 & \dots & x_1^d \\
1 & x_2 & x_2^2 & \dots & x_2^d \\
\vdots & \vdots & \vdots & \ddots & \vdots \\
1 & x_n & x_n^2 & \dots & x_n^d
\end{bmatrix}
$$

We use the Moore-Penrose Pseudoinverse (`pinv`) in `mathjs` to handle Singular Independent Matrices and ensure numerical stability.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License.
