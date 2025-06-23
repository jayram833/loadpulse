// components/LoadingSpinner.jsx
import React from "react";

function LoadingSpinner({ size = 6 }) {
    return (
        <div
            className={`w-${size} h-${size} border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin`}
        ></div>
    );
}

export default LoadingSpinner;
