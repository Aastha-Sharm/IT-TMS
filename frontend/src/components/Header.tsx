import React, { useState } from "react";
import {
  FaBars,
  FaSearch,
  FaEnvelope,
  FaBell,
  FaUser,
  FaEllipsisV,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Navbar({ setToken }: NavbarProps) {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null); // NEW: Update token state in App
    navigate("/login");
  };

  // ... rest is exactly your original code unchanged
  return (
    <nav className="bg-blue-500 text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <button className="text-xl">
            <FaBars />
          </button>
          <img
            src="https://companieslogo.com/img/orig/JSWENERGY.NS-b8b0c8f8.png?t=1731039532"
            alt="JSW Energy Logo"
            className="h-10 object-contain"
          />
        </div>
        <div className="hidden sm:flex items-center bg-white text-black rounded-full px-3 py-1 w-72">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search…"
            className="flex-1 outline-none"
          />
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button className="relative">
            <FaEnvelope className="text-xl" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-xs px-1 rounded-full">
              4
            </span>
          </button>
          <button className="relative">
            <FaBell className="text-xl" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-xs px-1 rounded-full">
              17
            </span>
          </button>
          <button
            className="text-xl"
            onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
          >
            <FaUser />
          </button>
          {isProfileMenuOpen && (
            <div className="absolute right-4 top-14 bg-white text-black rounded shadow-lg w-40">
              <button className="block px-4 py-2 hover:bg-gray-100 w-full text-left">
                Profile
              </button>
              <button className="block px-4 py-2 hover:bg-gray-100 w-full text-left">
                My Account
              </button>
              <button
                onClick={handleLogout}
                className="flex px-4 py-2 hover:bg-gray-100 w-full text-left items-center gap-2"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
        <div className="md:hidden">
          <button
            className="text-xl"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaEllipsisV />
          </button>
        </div>
      </div>
      <div className="sm:hidden px-4 py-2">
        <div className="flex items-center bg-white text-black rounded-full px-3 py-1">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search…"
            className="flex-1 outline-none"
          />
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white text-black shadow-lg">
          <button className="flex items-center px-4 py-2 hover:bg-gray-100 w-full">
            <FaEnvelope className="mr-2" /> Messages
            <span className="ml-auto bg-red-500 text-white text-xs px-2 rounded-full">
              4
            </span>
          </button>
          <button className="flex items-center px-4 py-2 hover:bg-gray-100 w-full">
            <FaBell className="mr-2" /> Notifications
            <span className="ml-auto bg-red-500 text-white text-xs px-2 rounded-full">
              17
            </span>
          </button>
          <button
            className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
            onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
          >
            <FaUser className="mr-2" /> Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
