// components/layout/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

const Footer = () => {
  return (
    <footer
      className="px-8 pt-12 pb-8"
      style={{
        background: "#080E1A",
        borderTop: "1px solid rgba(255,255,255,.06)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <Link to="/" className="flex items-center gap-2 no-underline mb-3">
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
                </svg>
              </div>
              <span className="font-display font-bold text-xl text-slate-100">
                InvoiceFlow
              </span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
              Modern billing software for freelancers, agencies, and growing
              businesses.
            </p>
          </div>
          {[
            {
              title: "Product",
              links: [
                { name: "Features", path: "/features" },
                { name: "Templates", path: "/templates" },
                { name: "Pricing", path: "/pricing" },
                { name: "Changelog", path: "/changelog" },
              ],
            },
            {
              title: "Company",
              links: [
                { name: "About", path: "/about" },
                { name: "Blog", path: "/blog" },
                { name: "Careers", path: "/careers" },
                { name: "Contact", path: "/contact" },
              ],
            },
            {
              title: "Legal",
              links: [
                { name: "Privacy Policy", path: "/privacy-policy" },
                { name: "Terms of Service", path: "/terms-of-service" },
                { name: "Cookie Policy", path: "/cookie-policy" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <div className="text-xs font-display font-bold uppercase tracking-widest text-slate-400 mb-4">
                {col.title}
              </div>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-slate-600 hover:text-slate-300 no-underline transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}
        >
          <span className="text-xs text-slate-600">
            © 2026 InvoiceFlow. All rights reserved.
          </span>
          <span className="text-xs text-slate-600">
            Made with ❤️ for businesses everywhere
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;