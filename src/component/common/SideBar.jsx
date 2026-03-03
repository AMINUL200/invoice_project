import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  X,
  ChevronRight,
  Home,
  Briefcase,
  Package,
  DollarSign,
  BookOpen,
  Mail,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

const SideBar = ({ toggleMenu, isOpen }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar navigation links with icons - EASILY CUSTOMIZABLE
  const sidebarLinks = [
    {
      id: "home",
      label: "Home",
      path: "/",
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: "services",
      label: "Services",
      icon: <Briefcase className="w-5 h-5" />,
      dropdown: [
        { id: "web-design", label: "Web Design", path: "/services/web-design" },
        { id: "development", label: "Development", path: "/services/development" },
        { id: "seo", label: "SEO Optimization", path: "/services/seo" },
        { id: "marketing", label: "Digital Marketing", path: "/services/digital-marketing" },
      ],
    },
    {
      id: "products",
      label: "Products",
      icon: <Package className="w-5 h-5" />,
      dropdown: [
        { id: "software", label: "Software", path: "/products/software" },
        { id: "templates", label: "Templates", path: "/products/templates" },
        { id: "plugins", label: "Plugins", path: "/products/plugins" },
        {
          id: "custom",
          label: "Custom Solutions",
          dropdown: [
            { id: "enterprise", label: "Enterprise", path: "/products/custom/enterprise" },
            { id: "startup", label: "Startup", path: "/products/custom/startup" },
            { id: "ecommerce", label: "E-commerce", path: "/products/custom/ecommerce" },
          ],
        },
      ],
    },
    {
      id: "pricing",
      label: "Pricing",
      path: "/pricing",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      id: "blog",
      label: "Blog",
      path: "/blog",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: "contact",
      label: "Contact",
      path: "/contact",
      icon: <Mail className="w-5 h-5" />,
    },
  ];

  // Auth state (dummy data - replace with your actual auth logic)
  const isAuthenticated = false;
  const userData = { user_type: 2 };

  // Close sidebar when route changes
  useEffect(() => {
    if (isOpen) {
      toggleMenu();
    }
  }, [location.pathname]);

  // Toggle dropdown
  const toggleDropdown = (dropdownId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdownId]: !prev[dropdownId],
    }));
  };

  // Handle navigation
  const handleNavClick = (path) => {
    if (path) {
      navigate(path);
      setOpenDropdowns({});
    }
  };

  // Handle logout
  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/");
    toggleMenu();
  };

  // Check if current path matches
  const isActivePath = (path) => {
    return location.pathname === path;
  };

  // Render dropdown items recursively
  const renderDropdownItem = (item, level = 1) => {
    const hasSubDropdown = item.dropdown && item.dropdown.length > 0;
    const dropdownKey = `${item.id}-sub-${level}`;
    const isOpen = openDropdowns[dropdownKey];
    const isActive = item.path && isActivePath(item.path);

    return (
      <div key={item.id} className="relative">
        {hasSubDropdown ? (
          <div
            className={`flex items-center justify-between px-4 py-3 text-sm cursor-pointer transition-all duration-200 ${
              level > 1 ? "pl-10" : "pl-6"
            } ${
              isOpen
                ? "bg-[#ffba00]/10 text-[#ffba00]"
                : "text-gray-700 hover:bg-gray-50 hover:text-[#ffba00]"
            }`}
            onClick={() => toggleDropdown(dropdownKey)}
          >
            <span className="font-medium">{item.label}</span>
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-300 ${
                isOpen ? "rotate-90" : ""
              }`}
            />
          </div>
        ) : (
          <div
            className={`flex items-center px-4 py-3 text-sm cursor-pointer transition-all duration-200 ${
              level > 1 ? "pl-10" : "pl-6"
            } ${
              isActive
                ? "bg-[#ffba00] text-white font-semibold"
                : "text-gray-700 hover:bg-gray-50 hover:text-[#ffba00]"
            }`}
            onClick={() => handleNavClick(item.path)}
          >
            <span className="font-medium">{item.label}</span>
          </div>
        )}

        {/* Nested dropdown */}
        {hasSubDropdown && (
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-gray-50/50 border-l-2 border-[#ffba00]/30 ml-4">
              {item.dropdown.map((subItem) =>
                renderDropdownItem(subItem, level + 1)
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render navigation item
  const renderNavItem = (item) => {
    const hasDropdown = item.dropdown && item.dropdown.length > 0;
    const isOpen = openDropdowns[item.id];
    const isActive = item.path && isActivePath(item.path);

    return (
      <div key={item.id} className="mb-1">
        {hasDropdown ? (
          <div
            className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200 rounded-lg mx-2 ${
              isOpen
                ? "bg-[#ffba00]/10 text-[#ffba00]"
                : "text-gray-700 hover:bg-gray-100 hover:text-[#ffba00]"
            }`}
            onClick={() => toggleDropdown(item.id)}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <span className="font-semibold">{item.label}</span>
            </div>
            <ChevronRight
              className={`w-5 h-5 transition-transform duration-300 ${
                isOpen ? "rotate-90" : ""
              }`}
            />
          </div>
        ) : (
          <div
            className={`flex items-center space-x-3 px-4 py-3 cursor-pointer transition-all duration-200 rounded-lg mx-2 ${
              isActive
                ? "bg-[#ffba00] text-white font-semibold shadow-md"
                : "text-gray-700 hover:bg-gray-100 hover:text-[#ffba00]"
            }`}
            onClick={() => handleNavClick(item.path)}
          >
            {item.icon}
            <span className="font-semibold">{item.label}</span>
          </div>
        )}

        {/* Dropdown menu */}
        {hasDropdown && (
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="mt-1">
              {item.dropdown.map((dropdownItem) => renderDropdownItem(dropdownItem))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <svg
              width="36"
              height="36"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="24" cy="24" r="20" stroke="#4F46E5" strokeWidth="4" />
              <path d="M16 24L24 14L32 24L24 34L16 24Z" fill="#4F46E5" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800">MySite</h2>
          </div>
          <button
            onClick={toggleMenu}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 h-[calc(100vh-180px)]">
          {sidebarLinks.map((item) => renderNavItem(item))}
        </nav>

        {/* Auth Section */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          {!isAuthenticated && (
            <button
              onClick={() => {
                navigate("/signin");
                toggleMenu();
              }}
              className="w-full bg-[#ffba00] text-white px-6 py-3 rounded-lg hover:bg-black transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-md"
            >
              <User className="w-5 h-5" />
              <span>Login</span>
            </button>
          )}

          {isAuthenticated && userData?.user_type === 4 && (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-md"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          )}

          {isAuthenticated && userData?.user_type !== 4 && (
            <button
              onClick={() => {
                navigate("/dashboard");
                toggleMenu();
              }}
              className="w-full bg-[#ffba00] text-white px-6 py-3 rounded-lg hover:bg-black transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-md"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default SideBar;