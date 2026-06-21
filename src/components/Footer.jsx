import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Mail } from 'lucide-react';

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const Footer = () => {
  return (
    <footer className="bg-[#0B0F19] text-gray-400 border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Column */}
          <div className="space-y-6 xl:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#E63946] to-[#C1121F] text-white">
                <ShoppingBag className="h-4.5 w-4.5" />
              </div>
              <span className="font-poppins text-lg font-bold tracking-wider text-white">
                NEXA<span className="text-[#E63946]">COMMERCE</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs font-inter leading-relaxed">
              Curating luxury experiences with elite-tier designs and unmatched product performance. Experience high-end retail redefined.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-500 hover:text-white transition-colors">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="text-gray-500 hover:text-white transition-colors">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-gray-500 hover:text-white transition-colors">
                <TwitterIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 sm:grid-cols-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300 font-poppins">Company</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/about" className="text-sm hover:text-white transition-colors font-inter">About Us</Link>
                </li>
                <li>
                  <Link to="/blog" className="text-sm hover:text-white transition-colors font-inter">Blog & News</Link>
                </li>
                <li>
                  <Link to="/shop" className="text-sm hover:text-white transition-colors font-inter">Collection Catalog</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300 font-poppins">Support</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/contact" className="text-sm hover:text-white transition-colors font-inter">Contact Us</Link>
                </li>
                <li>
                  <Link to="/faq" className="text-sm hover:text-white transition-colors font-inter">Frequently Asked FAQs</Link>
                </li>
                <li>
                  <Link to="/track-order" className="text-sm hover:text-white transition-colors font-inter">Track Your Order</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300 font-poppins">Legal Policies</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/privacy" className="text-sm hover:text-white transition-colors font-inter">Privacy Policy</Link>
                </li>
                <li>
                  <a href="#" className="text-sm hover:text-white transition-colors font-inter">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:text-white transition-colors font-inter">Returns & Refunds</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-gray-500 font-inter">
            &copy; {new Date().getFullYear()} NexaCommerce, Inc. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 text-xs text-gray-500">
            <Mail className="h-4 w-4" />
            <span>concierge@nexacommerce.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
