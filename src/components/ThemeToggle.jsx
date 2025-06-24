import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const classList = document.documentElement.classList;
        if (darkMode) {
            classList.add("dark");
        } else {
            classList.remove("dark");
        }
    }, [darkMode]);

    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className={`
        relative w-10 h-10 rounded-full
        cursor-pointer
        transition-all duration-300 ease-out
        transform hover:scale-105 active:scale-95
        ${darkMode
                    ? 'bg-indigo-800 shadow-md shadow-indigo-900/30'
                    : 'bg-white shadow-md shadow-gray-300/40'
                }
        border border-gray-200 dark:border-indigo-700
        backdrop-blur-sm group
      `}
        >
            {/* Optional glossy effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-black/5 dark:to-white/5 pointer-events-none"></div>

            {darkMode ? (
                <Moon
                    size={20}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     text-indigo-200 group-hover:text-white transition-all duration-300"
                />
            ) : (
                <Sun
                    size={20}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     text-amber-500 group-hover:text-amber-400 transition-all duration-300"
                />
            )}
        </button>
    );
}

export default ThemeToggle;
