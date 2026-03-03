// components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  ChevronRight,
  Shield,
  Award,
  Clock
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Footer links organized by section
  const footerLinks = {
    product: {
      title: "Product",
      links: [
        { name: "Features", url: "/features" },
        { name: "Pricing", url: "/pricing" },
        { name: "Integrations", url: "/integrations" },
        { name: "API Documentation", url: "/docs" },
        { name: "Roadmap", url: "/roadmap" }
      ]
    },
    solutions: {
      title: "Solutions",
      links: [
        { name: "Small Business", url: "/solutions/small-business" },
        { name: "Enterprise", url: "/solutions/enterprise" },
        { name: "Freelancers", url: "/solutions/freelancer" },
        { name: "Accounting Firms", url: "/solutions/accounting" },
        { name: "E-commerce", url: "/solutions/ecommerce" }
      ]
    },
    resources: {
      title: "Resources",
      links: [
        { name: "Blog", url: "/blog" },
        { name: "Help Center", url: "/help" },
        { name: "Community", url: "/community" },
        { name: "Tutorials", url: "/tutorials" },
        { name: "Webinars", url: "/webinars" }
      ]
    },
    company: {
      title: "Company",
      links: [
        { name: "About Us", url: "/about" },
        { name: "Careers", url: "/careers" },
        { name: "Press", url: "/press" },
        { name: "Contact", url: "/contact" },
        { name: "Partners", url: "/partners" }
      ]
    }
  };

  const legalLinks = [
    { name: "Privacy Policy", url: "/privacy" },
    { name: "Terms of Service", url: "/terms" },
    { name: "Cookie Policy", url: "/cookies" },
    { name: "GDPR", url: "/gdpr" },
    { name: "Security", url: "/security" }
  ];

  const socialLinks = [
    { icon: Facebook, url: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, url: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, url: "https://linkedin.com", label: "LinkedIn" },
    { icon: Instagram, url: "https://instagram.com", label: "Instagram" }
  ];

  const contactInfo = [
    { icon: Mail, text: "support@billsmart.com", href: "mailto:support@billsmart.com" },
    { icon: Phone, text: "+1 (555) 123-4567", href: "tel:+15551234567" },
    { icon: MapPin, text: "123 Business Ave, San Francisco, CA 94105", href: "#" }
  ];

  return (
    <footer className="bg-[#0F172A] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Logo and Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-3">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">BillSmart</span>
            </div>
            <p className="text-[#94A3B8] mb-4">
              The complete invoicing and billing solution for modern businesses. 
              Create, manage, and track invoices effortlessly.
            </p>
            {/* Trust Badges */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-[#1E293B] px-3 py-1.5 rounded-lg">
                <Shield className="w-4 h-4 text-[#22C55E]" />
                <span className="text-xs text-[#CBD5F5]">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-1 bg-[#1E293B] px-3 py-1.5 rounded-lg">
                <Award className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-xs text-[#CBD5F5]">ISO 27001</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key}>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.url}
                        className="text-[#94A3B8] hover:text-[#2563EB] transition-colors duration-200 text-sm flex items-center group"
                      >
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity mr-1" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact & Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Stay Updated
            </h3>
            <p className="text-[#94A3B8] text-sm mb-4">
              Get the latest updates and offers directly in your inbox.
            </p>
            <div className="flex mb-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-l-lg text-white placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              />
              <button className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-r-lg transition-colors font-medium">
                Subscribe
              </button>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center space-x-2 text-[#94A3B8] hover:text-[#2563EB] transition-colors text-sm"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.text}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-[#1E293B] mb-8">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-[#2563EB]" />
            <div>
              <p className="text-sm font-medium text-white">24/7 Support</p>
              <p className="text-xs text-[#64748B]">Round the clock assistance</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-[#22C55E]" />
            <div>
              <p className="text-sm font-medium text-white">Bank Level Security</p>
              <p className="text-xs text-[#64748B]">256-bit encryption</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-[#F59E0B]" />
            <div>
              <p className="text-sm font-medium text-white">99.9% Uptime</p>
              <p className="text-xs text-[#64748B]">Reliable infrastructure</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#8B5CF6]" />
            <div>
              <p className="text-sm font-medium text-white">GST Compliant</p>
              <p className="text-xs text-[#64748B]">Tax ready invoices</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1E293B] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-[#64748B]">
              &copy; {currentYear} BillSmart. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {legalLinks.map((link, index) => (
                <React.Fragment key={index}>
                  <Link
                    to={link.url}
                    className="text-[#94A3B8] hover:text-[#2563EB] transition-colors"
                  >
                    {link.name}
                  </Link>
                  {index < legalLinks.length - 1 && (
                    <span className="text-[#334155]">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#64748B] hover:text-[#2563EB] transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mt-6 flex justify-center items-center space-x-4">
            <span className="text-xs text-[#64748B]">Accepted Payment Methods:</span>
            <div className="flex items-center space-x-2">
              <img src="https://via.placeholder.com/40x25/1E293B/94A3B8?text=Visa" alt="Visa" className="h-6 rounded" />
              <img src="https://via.placeholder.com/40x25/1E293B/94A3B8?text=MC" alt="Mastercard" className="h-6 rounded" />
              <img src="https://via.placeholder.com/40x25/1E293B/94A3B8?text=Amex" alt="American Express" className="h-6 rounded" />
              <img src="https://via.placeholder.com/40x25/1E293B/94A3B8?text=UPI" alt="UPI" className="h-6 rounded" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;