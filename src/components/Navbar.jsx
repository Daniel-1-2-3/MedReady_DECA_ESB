import { useState } from "react"
import { FaCamera } from "react-icons/fa"; // Importing a camera icon from react-icons
import { useNavigate } from "react-router-dom"

const Navbar = () => {
    const [active, setIsActive] = useState('ey')
    const navigate = useNavigate();

    const handleNavigation = (path, section) => {
        setIsActive(section)
        navigate(`/${path}`)
    };

    return (
        <nav className="w-full bg-gradient-to-r from-blue-900 to-blue-900 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center px-6 py-4">
            {/* Logo and Company Name */}
            <div className="flex flex-col mr-5">
                <FaCamera className="text-white text-3xl" />
                <h1 className="text-lg font-semibold text-white">MedReady</h1>
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-3">
            <button
                onClick={() => handleNavigation("eye_detect", "eye")}
                className={`px-4 py-2 rounded-lg text-sm sm:text-base transition focus:outline-none bg-blue-950 ${
                active === "eye"
                    ? "shadow-lg shadow-slate-800 text-gray-300"
                    : "text-gray-400 hover:text-gray-300"
                }`}
            >
                Eye Disease
            </button>
            <button
                onClick={() => handleNavigation("skin_detect", "skin")}
                className={`px-4 py-2 rounded-lg text-sm sm:text-base transition focus:outline-none bg-blue-950 ${
                active === "skin"
                    ? "shadow-lg shadow-slate-800 text-gray-300"
                    : "text-gray-400 hover:text-gray-300"
                }`}
            >
                Skin Disease
            </button>
            </div>
        </div>
        </nav>
    );
    };

    export default Navbar;
