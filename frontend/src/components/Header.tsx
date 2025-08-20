import React, { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaSearch,
  FaEnvelope,
  FaBell,
  FaUser,
  FaEllipsisV,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Navbar({ setToken }: NavbarProps) {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const navigate = useNavigate();

  // Refs for detecting outside clicks
  const sideMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

const menuItems = [
  { name: "Dashboard", path: "/" },
  { name: "Create Ticket", path: "/raise-ticket" }
];


  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sideMenuRef.current &&
        !sideMenuRef.current.contains(event.target as Node) &&
        isSideMenuOpen
      ) {
        setSideMenuOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        isNotificationOpen
      ) {
        setNotificationOpen(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        isProfileMenuOpen
      ) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSideMenuOpen, isNotificationOpen, isProfileMenuOpen]);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-red-500 text-white shadow-md relative">
      <div className="flex items-center justify-between px-4 py-2 relative">
        <div className="flex items-center gap-4 relative">
          {/* Menu Button */}
          <button
            className="text-xl cursor-pointer"
            onClick={() => {
              setSideMenuOpen(!isSideMenuOpen);
              setNotificationOpen(false);
              setProfileMenuOpen(false);
            }}
          >
            <FaBars />
          </button>

          {/* Side Menu (Sliding) */}
          <div
            ref={sideMenuRef}
            className={`fixed top-0 left-0 h-full w-64 bg-white text-black shadow-lg transform transition-transform duration-300 z-50 ${
              isSideMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Side Menu Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold">Menu</h2>
              <button
                className="text-xl"
                onClick={() => setSideMenuOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

           {/* Menu Items */}
            <div className="flex flex-col items-center">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setSideMenuOpen(false); // close sidebar after clicking
                  }}
                  className="block px-4 py-2 hover:bg-blue-100 w-full text-left"
                >
                  {item.name}
                </button>
              ))}
            </div>

          </div>

          <img
            src="https://companieslogo.com/img/orig/JSWENERGY.NS-b8b0c8f8.png?t=1731039532"
            alt="JSW Energy Logo"
            className="h-10 object-contain"
          />
        </div>

        {/* Search
        <div className="hidden sm:flex items-center bg-white text-black rounded-full px-3 py-1 w-72">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search…"
            className="flex-1 outline-none"
          />
        </div> */}

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-4 relative">
          <button className="relative cursor-pointer">
            <FaEnvelope className="text-2xl" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-xs px-1 rounded-full"></span>
          </button>

          {/* Notification Bell */}
          <div ref={notificationRef} className="relative">
            <button
              className="relative cursor-pointer"
              onClick={() => {
                setNotificationOpen(!isNotificationOpen);
                setProfileMenuOpen(false);
                setSideMenuOpen(false);
              }}
            >
              <FaBell className="text-2xl mt-1"  />
              <span className="absolute -top-1 -right-2 bg-red-500 text-xs px-1 rounded-full"></span>
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 top-14 bg-white text-black rounded shadow-lg w-64 z-50">
                <h3 className="font-semibold px-4 py-2 border-b border-gray-200">
                  Notifications
                </h3>
                <div className="flex flex-col">
                  <button className="px-4 py-2 hover:bg-blue-100 text-left">
                    New ticket assigned to you
                  </button>
                  <button className="px-4 py-2 hover:bg-blue-100 text-left">
                    Server downtime alert
                  </button>
                  <button className="px-4 py-2 hover:bg-blue-100 text-left">
                    System maintenance scheduled
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div ref={profileMenuRef} className="relative">
            <button
              className="text-2xl cursor-pointer"
              onClick={() => {
                setProfileMenuOpen(!isProfileMenuOpen);
                setNotificationOpen(false);
                setSideMenuOpen(false);
              }}
            >
              <FaUser />
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-14 bg-white text-black rounded shadow-lg w-40 z-50">
                <button className="block px-4 py-2 hover:bg-blue-100 w-full text-left">
                  My Account
                </button>
                <button
                  onClick={handleLogout}
                  className="flex px-4 py-2 hover:bg-blue-100 w-full text-left items-center gap-2"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
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

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white text-black shadow-lg">
          {/* <button className="flex items-center px-4 py-2 hover:bg-gray-100 w-full">
            <FaEnvelope className="mr-2" /> Messages
            <span className="ml-auto bg-red-500 text-white text-xs px-2 rounded-full"></span>
          </button> */}
          <button className="flex items-center px-4 py-2 hover:bg-gray-100 w-full">
            <FaBell className="mr-2" /> Notifications
            <span className="ml-auto bg-red-500 text-white text-xs px-2 rounded-full"></span>
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
