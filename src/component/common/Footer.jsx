import React from 'react';

const Footer = () => {
  // Footer links organized in objects for easy modification
  const footerLinks = {
    company: {
      title: "Company",
      links: [
        { name: "About Us", url: "/about" },
        { name: "Careers", url: "/careers" },
        { name: "Contact", url: "/contact" },
        { name: "Blog", url: "/blog" }
      ]
    },
    products: {
      title: "Products",
      links: [
        { name: "Features", url: "/features" },
        { name: "Pricing", url: "/pricing" },
        { name: "Documentation", url: "/docs" },
        { name: "API", url: "/api" }
      ]
    },
    support: {
      title: "Support",
      links: [
        { name: "Help Center", url: "/help" },
        { name: "Community", url: "/community" },
        { name: "Status", url: "/status" },
        { name: "Privacy Policy", url: "/privacy" }
      ]
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Map through footer sections */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key} className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;