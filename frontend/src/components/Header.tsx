import React, { useState } from "react";
import {
  FaBars,
  FaSearch,
  FaEnvelope,
  FaBell,
  FaUser,
  FaTimes,
} from "react-icons/fa";

export default function Navbar() {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);

  return (
    <nav className="bg-blue-500 text-white shadow-md relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left: Menu Icon + Logo */}
        <div className="flex items-center gap-4">
          <button
            className="text-xl"
            onClick={() => {
              setSideMenuOpen(true);
              setNotificationOpen(false);
            }}
          >
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

        {/* Right: Icons */}
        <div className="hidden md:flex items-center gap-4 relative">
          {/* Messages Icon */}
          <button className="relative">
            <FaEnvelope className="text-xl" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-xs px-1 rounded-full">
              4
            </span>
          </button>

          {/* Notification Bell */}
          <button
            className="relative"
            onClick={() => {
              setNotificationOpen(!isNotificationOpen);
              setProfileMenuOpen(false);
            }}
          >
            <FaBell className="text-xl" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-xs px-1 rounded-full">
              17
            </span>
          </button>

          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-16 top-14 bg-white text-black rounded shadow-lg w-64">
              <h3 className="font-semibold px-4 py-2 border-b border-gray-200">
                Notifications
              </h3>
              <div className="flex flex-col">
                <button className="px-4 py-2 hover:bg-gray-100 text-left">
                  New ticket assigned to you
                </button>
                <button className="px-4 py-2 hover:bg-gray-100 text-left">
                  Server downtime alert
                </button>
                <button className="px-4 py-2 hover:bg-gray-100 text-left">
                  System maintenance scheduled
                </button>
              </div>
            </div>
          )}

          {/* Profile Icon */}
          <button
            className="text-xl"
            onClick={() => {
              setProfileMenuOpen(!isProfileMenuOpen);
              setNotificationOpen(false);
            }}
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
      </div>

      {/* Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-black shadow-lg transform transition-transform duration-300 z-50 ${
          isSideMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold">Menu</h2>
          <button className="text-xl" onClick={() => setSideMenuOpen(false)}>
            <FaTimes />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col">
          <button className="px-4 py-2 hover:bg-gray-100 text-left">
            Messages <span className="ml-2 text-sm text-gray-600">(4)</span>
          </button>
          <button className="px-4 py-2 hover:bg-gray-100 text-left">
            Notifications <span className="ml-2 text-sm text-gray-600">(17)</span>
          </button>
          <button className="px-4 py-2 hover:bg-gray-100 text-left">
            Profile
          </button>
          <button className="px-4 py-2 hover:bg-gray-100 text-left">
            Settings
          </button>
        </div>
      </div>
    </nav>
  );
}
