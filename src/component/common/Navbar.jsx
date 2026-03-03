// components/layout/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, 
  ChevronDown, 
  User, 
  LogOut, 
  LayoutDashboard,
  FileText,
  Building2,
  Users,
  ShoppingCart,
  CreditCard,
  Settings,
  HelpCircle,
  Bell
} from "lucide-react";

const Navbar = ({ toggleMenu }) => {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const dropdownRefs = useRef({});
  const navigate = useNavigate();
  const location = useLocation();

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

  // Navigation links with your color schema
  const navLinks = [
    { id: "home", label: "Home", path: "/" },
    {
      id: "features",
      label: "Features",
      dropdown: [
        { id: "invoicing", label: "Smart Invoicing", path: "/features/invoicing" },
        { id: "payments", label: "Payment Integration", path: "/features/payments" },
        { id: "analytics", label: "Analytics Dashboard", path: "/features/analytics" },
        { id: "reports", label: "Financial Reports", path: "/features/reports" },
      ],
    },
    {
      id: "solutions",
      label: "Solutions",
      dropdown: [
        { id: "small-business", label: "Small Business", path: "/solutions/small-business" },
        { id: "enterprise", label: "Enterprise", path: "/solutions/enterprise" },
        { id: "freelancer", label: "Freelancers", path: "/solutions/freelancer" },
        { id: "accounting", label: "Accounting Firms", path: "/solutions/accounting" },
      ],
    },
    { id: "pricing", label: "Pricing", path: "/pricing" },
    { id: "about", label: "About Us", path: "/about" },
    { id: "contact", label: "Contact", path: "/contact" },
  ];

  // Auth state - replace with your actual auth logic
  const isAuthenticated = false;
  const userData = { user_type: 2 }; // 1: Super Admin, 2: Company Admin, 3: Staff

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
            className={`flex items-center justify-between px-4 py-2 text-sm text-[#334155] hover:bg-[#F1F5F9] hover:text-[#2563EB] cursor-pointer transition-colors ${
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
            className={`block px-4 py-2 text-sm text-[#334155] hover:bg-[#F1F5F9] hover:text-[#2563EB] transition-colors ${
              level > 1 ? "pl-8" : ""
            }`}
            onClick={() => setOpenDropdowns({})}
          >
            {item.label}
          </RouterLink>
        )}

        {hasSubDropdown && isOpen && (
          <div className="bg-[#F8FAFC] border-l-2 border-[#2563EB] ml-2">
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
            className={`text-[#334155] font-medium hover:text-[#2563EB] cursor-pointer transition-colors px-3 py-2 flex items-center space-x-1 ${
              isOpen ? "text-[#2563EB]" : ""
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
            className={`text-[#334155] font-medium hover:text-[#2563EB] cursor-pointer transition-colors px-3 py-2 ${
              location.pathname === item.path ? "text-[#2563EB]" : ""
            }`}
            onClick={() => handleNavClick(item.path)}
          >
            {item.label}
          </div>
        )}

        {hasDropdown && isOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-50">
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
      <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-[#0F172A]">BillSmart</h1>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navLinks.map((item) => renderNavItem(item))}

          {/* Auth Buttons */}
          {!isAuthenticated && (
            <div className="flex items-center space-x-3 ml-4">
              <RouterLink
                to="/login"
                className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-[#334155] hover:bg-[#F8FAFC] transition-colors font-medium"
              >
                Login
              </RouterLink>
              <RouterLink
                to="/register"
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
              >
                Start Free Trial
              </RouterLink>
            </div>
          )}

          {isAuthenticated && (
            <div className="flex items-center space-x-3 ml-4">
              {/* Notifications */}
              <button className="relative p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("user-menu")}
                  className="flex items-center space-x-2 p-1.5 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-[#0F172A]">John Doe</p>
                    <p className="text-xs text-[#64748B]">
                      {userData?.user_type === 1 ? 'Super Admin' : 
                       userData?.user_type === 2 ? 'Company Admin' : 'Staff'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#64748B]" />
                </button>

                {openDropdowns["user-menu"] && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-1 z-50">
                    <RouterLink
                      to="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-[#334155] hover:bg-[#F8FAFC] transition-colors"
                      onClick={() => setOpenDropdowns({})}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </RouterLink>
                    <RouterLink
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-[#334155] hover:bg-[#F8FAFC] transition-colors"
                      onClick={() => setOpenDropdowns({})}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </RouterLink>
                    <RouterLink
                      to="/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-[#334155] hover:bg-[#F8FAFC] transition-colors"
                      onClick={() => setOpenDropdowns({})}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </RouterLink>
                    <div className="border-t border-[#E2E8F0] my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-[#EF4444] hover:bg-[#FEE2E2] transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          {isAuthenticated && (
            <button className="relative p-2 text-[#64748B]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full"></span>
            </button>
          )}
          <button
            onClick={toggleMenu}
            className="text-[#334155] hover:text-[#2563EB] focus:outline-none cursor-pointer p-2"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu - This will be controlled by parent component */}
      {/* The actual mobile menu content should be in a separate component */}
    </header>
  );
};

export default Navbar;