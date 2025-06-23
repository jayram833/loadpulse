// components/EmptyState.jsx
import React from "react";

function EmptyState() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="text-xl font-medium mb-1">No Message Selected</h2>
            <p className="text-sm max-w-xs">
                Select a message from the left panel to view its full details here.
            </p>
        </div>
    );
}

export default EmptyState;
