// components/layout/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link as RouterLink, useNavigate, useLocation, Link } from "react-router-dom";
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
  Bell,
} from "lucide-react";

const Navbar = ({ toggleMenu }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-shadow duration-300 font-body ${scrolled ? "shadow-lg shadow-slate-900/5" : ""}`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 no-underline">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <span className="font-display font-bold text-xl text-slate-900">
          InvoiceFlow
        </span>
      </Link>

      {/* Nav links */}
      <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
        {["Features", "Templates", "Pricing", "Testimonials"].map((l) => (
          <li key={l}>
            <a
              href={`#${l.toLowerCase()}`}
              className="text-sm font-medium text-slate-500 hover:text-blue-600 no-underline transition-colors duration-200"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <a
          href="/login"
          className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 no-underline transition-all duration-200"
        >
          Sign In
        </a>
        <a
          href="/register"
          className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 no-underline transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-blue-600/30"
        >
          Start Free
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
