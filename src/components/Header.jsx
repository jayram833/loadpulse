import ThemeToggle from "./ThemeToggle";
import { FaTruckFast } from "react-icons/fa6";

function Header() {
    return (
        <header className="h-16 px-6 flex items-center justify-between 
                       bg-[#6264A7] dark:bg-[#43468B] 
                       text-white shadow-sm">
            <h1 className="text-xl font-semibold tracking-wide">
                <div className="flex items-center gap-2">
                    <span>LoadPulse</span>
                    <FaTruckFast className="text-white" />
                </div>
            </h1>

            <ThemeToggle />
        </header>
    );
}

export default Header;
