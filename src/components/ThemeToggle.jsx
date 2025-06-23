import React, { useEffect, useState } from "react";
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { Sun, Moon } from 'lucide-react';


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
            relative w-12 h-12 rounded-full
            transition-all duration-300 ease-out
            transform hover:scale-105 active:scale-95
            ${darkMode
                    ? 'bg-slate-800 shadow-lg shadow-slate-900/20'
                    : 'bg-white shadow-lg shadow-gray-900/10'
                }
            border border-gray-200/50 dark:border-slate-700/50
            backdrop-blur-sm
            group
          `}
        >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-black/5 dark:to-white/5"></div>

            {darkMode ? (
                <Moon
                    size={20}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-300 transition-all duration-300 group-hover:text-white"
                />
            ) : (
                <Sun
                    size={20}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-amber-500 transition-all duration-300 group-hover:text-amber-400"
                />
            )}
        </button>
    );
}

export default ThemeToggle;
