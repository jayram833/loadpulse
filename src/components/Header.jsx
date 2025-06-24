import { useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { FaTruckFast } from "react-icons/fa6";

function Header({ onSearchMessage }) {
    const [inputText, setInputText] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (!inputText.length) return;
        onSearchMessage(inputText);
        setInputText("");
    }
    return (
        <header className="h-16 px-6 flex items-center justify-between 
                       bg-indigo-900 
                       text-white shadow-sm">
            <h1 className="text-xl font-semibold tracking-wide">
                <div className="flex items-center gap-2">
                    <span>LoadPulse</span>
                    <FaTruckFast className="text-white" />
                </div>
            </h1>
            <form onSubmit={handleSubmit}>
                <input value={inputText} onChange={e => setInputText(e.target.value)} type="text" placeholder="Search Load" className="bg-gray-100 px-2 py-1 rounded-md text-gray-700 focus:outline-none w-100" />
            </form>
            <ThemeToggle />
        </header>
    );
}

export default Header;
