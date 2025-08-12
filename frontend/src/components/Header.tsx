import React, { useState } from "react";
import { FaBars, FaSearch, FaEnvelope, FaBell, FaUser, FaEllipsisV } from "react-icons/fa";

export default function Navbar() {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-500 text-white shadow-md">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left: Menu Icon + Logo */}
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

        {/* Middle: Search Bar */}
        <div className="hidden sm:flex items-center bg-white text-black rounded-full px-3 py-1 w-72">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search…"
            className="flex-1 outline-none"
          />
        </div>

        {/* Right: Icons (Desktop) */}
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

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-4 top-14 bg-white text-black rounded shadow-lg w-40">
              <button className="block px-4 py-2 hover:bg-gray-100 w-full text-left">
                Profile
              </button>
              <button className="block px-4 py-2 hover:bg-gray-100 w-full text-left">
                My Account
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            className="text-xl"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaEllipsisV />
          </button>
        </div>
      </div>

      {/* Mobile Search */}
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

      {/* Mobile Menu */}
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
        </div>
      )}
    </nav>
  );
}
