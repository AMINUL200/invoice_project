import React, { useState, useEffect, useRef } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";

const Navbar = ({ toggleMenu }) => {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const dropdownRefs = useRef({});
  const navigate = useNavigate();
  const location = useLocation();

  // Dummy logo - replace with your actual logo
  const logo =
    "https://via.placeholder.com/150x50/3B82F6/FFFFFF?text=Your+Logo";

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Different dummy navigation links
  const navLinks = [
    { id: "home", label: "Home", path: "/" },
    {
      id: "services",
      label: "Services",
      dropdown: [
        { id: "web-design", label: "Web Design", path: "/services/web-design" },
        {
          id: "development",
          label: "Development",
          path: "/services/development",
        },
        { id: "seo", label: "SEO Optimization", path: "/services/seo" },
        {
          id: "marketing",
          label: "Digital Marketing",
          path: "/services/digital-marketing",
        },
      ],
    },
    {
      id: "products",
      label: "Products",
      dropdown: [
        { id: "software", label: "Software", path: "/products/software" },
        { id: "templates", label: "Templates", path: "/products/templates" },
        { id: "plugins", label: "Plugins", path: "/products/plugins" },
        {
          id: "custom",
          label: "Custom Solutions",
          dropdown: [
            {
              id: "enterprise",
              label: "Enterprise",
              path: "/products/custom/enterprise",
            },
            {
              id: "startup",
              label: "Startup",
              path: "/products/custom/startup",
            },
            {
              id: "ecommerce",
              label: "E-commerce",
              path: "/products/custom/ecommerce",
            },
          ],
        },
      ],
    },
    { id: "pricing", label: "Pricing", path: "/pricing" },
    { id: "blog", label: "Blog", path: "/blog" },
    { id: "contact", label: "Contact", path: "/contact" },
  ];

  // Dummy auth state
  const isAuthenticated = false;
  const userData = { user_type: 2 };

  // Helper functions for dropdown management
  const getParentDropdownId = (dropdownId) => {
    if (dropdownId.includes("-sub-")) {
      const parts = dropdownId.split("-sub-");
      return parts[0];
    }
    return null;
  };

  const isChildDropdown = (childId, parentId) => {
    return childId.startsWith(parentId + "-sub-");
  };

  const toggleDropdown = (dropdownId) => {
    setOpenDropdowns((prev) => {
      const newState = { ...prev };

      if (!dropdownId.includes("-sub-")) {
        Object.keys(newState).forEach((key) => {
          if (key !== dropdownId && !key.includes("-sub-")) {
            newState[key] = false;
            Object.keys(newState).forEach((subKey) => {
              if (isChildDropdown(subKey, key)) {
                newState[subKey] = false;
              }
            });
          }
        });
      } else {
        const parentId = getParentDropdownId(dropdownId);
        Object.keys(newState).forEach((key) => {
          if (key !== dropdownId && getParentDropdownId(key) === parentId) {
            newState[key] = false;
            Object.keys(newState).forEach((nestedKey) => {
              if (isChildDropdown(nestedKey, key)) {
                newState[nestedKey] = false;
              }
            });
          }
        });
      }

      newState[dropdownId] = !prev[dropdownId];
      return newState;
    });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      let clickedOutside = true;
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && ref.contains(event.target)) {
          clickedOutside = false;
        }
      });
      if (clickedOutside) {
        setOpenDropdowns({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (path) => {
    navigate(path);
    setOpenDropdowns({});
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // Add your logout logic here
    navigate("/");
  };

  // Render dropdown items recursively
  const renderDropdownItem = (item, level = 1) => {
    const hasSubDropdown = item.dropdown && item.dropdown.length > 0;
    const dropdownKey = `${item.id}-sub-${level}`;
    const isOpen = openDropdowns[dropdownKey];

    return (
      <div key={item.id} className="relative group">
        {hasSubDropdown ? (
          <div
            className={`flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#ffba00] cursor-pointer transition-colors ${
              level > 1 ? "pl-8" : ""
            }`}
            onClick={() => toggleDropdown(dropdownKey)}
          >
            <span>{item.label}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        ) : (
          <RouterLink
            to={item.path}
            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#ffba00] transition-colors ${
              level > 1 ? "pl-8" : ""
            }`}
            onClick={() => setOpenDropdowns({})}
          >
            {item.label}
          </RouterLink>
        )}

        {hasSubDropdown && isOpen && (
          <div className="bg-gray-50 border-l-2 border-[#ffba00] ml-2">
            {item.dropdown.map((subItem) =>
              renderDropdownItem(subItem, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  // Render navigation item
  const renderNavItem = (item) => {
    const hasDropdown = item.dropdown && item.dropdown.length > 0;
    const isOpen = openDropdowns[item.id];

    return (
      <div
        key={item.id}
        className="relative"
        ref={(el) => (dropdownRefs.current[item.id] = el)}
      >
        {hasDropdown ? (
          <div
            className={`text-gray-700 font-semibold hover:text-[#ffba00] cursor-pointer transition-colors px-2 py-1 flex items-center space-x-1 ${
              isOpen ? "text-[#ffba00]" : ""
            }`}
            onClick={() => toggleDropdown(item.id)}
          >
            <span>{item.label}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        ) : (
          <div
            className="text-gray-700 font-semibold hover:text-[#ffba00] cursor-pointer transition-colors px-2 py-1 flex items-center space-x-1"
            onClick={() => handleNavClick(item.path)}
          >
            {item.label}
          </div>
        )}

        {hasDropdown && isOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="py-2">
              {item.dropdown.map((dropdownItem) =>
                renderDropdownItem(dropdownItem)
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md py-2"
          : "bg-white/90 backdrop-blur-sm py-4"
      }`}
    >
      <div
        className="px-8 flex justify-between items-center"
        style={{ margin: "0 auto" }}
      >
        {/* Logo */}
        <div className="flex items-center">
          <div
            className="text-2xl font-bold text-indigo-600 flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            {/* <img
              src={logo}
              alt="logo"
              className="h-8 md:h-10"
            /> */}
            {/* Paste SVG below */}
            <svg
              width="40"
              height="40"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="24" cy="24" r="20" stroke="#4F46E5" strokeWidth="4" />
              <path d="M16 24L24 14L32 24L24 34L16 24Z" fill="#4F46E5" />
            </svg>
            <h1 className="ml-2 text-xl font-semibold text-gray-800">MySite</h1>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((item) => renderNavItem(item))}

          {/* Auth Buttons */}
          {!isAuthenticated && (
            <RouterLink
              to="/login"
              className="ml-4 bg-[#ffba00] text-white px-6 py-2 rounded-md hover:bg-black transition-all duration-300 flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </RouterLink>
          )}

          {isAuthenticated && userData?.user_type === 4 && (
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-500 text-white px-6 py-2 rounded-md hover:bg-black transition-all duration-300 cursor-pointer flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}

          {isAuthenticated && userData?.user_type !== 4 && (
            <RouterLink
              to="/dashboard"
              className="ml-4 bg-[#ffba00] text-white px-6 py-2 rounded-md hover:bg-black transition-all duration-300 flex items-center space-x-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </RouterLink>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
