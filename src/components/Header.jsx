import ThemeToggle from "./ThemeToggle"
import { FaTruckFast } from "react-icons/fa6";

function Header() {
    return (
        <header className="h-16 px-6 flex items-center justify-between bg-white dark:bg-[#2b2b2b] border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white tracking-wide">
                <div className="flex items-center gap-1">
                    <span>
                        LoadPulse
                    </span>
                    <FaTruckFast />
                </div>
            </h1>

            <ThemeToggle />
        </header>
    )
}

export default Header
