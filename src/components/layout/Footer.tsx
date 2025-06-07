import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center">
              <Heart className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold">SkinHealth</span>
            </Link>
            <p className="mt-4 text-slate-300">
              Advanced skin disease classification and healthcare solutions to help you take control of your health.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-primary-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/#about" className="text-slate-300 hover:text-primary-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/#services" className="text-slate-300 hover:text-primary-400 transition">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-slate-300 hover:text-primary-400 transition">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-slate-300 hover:text-primary-400 transition">
                  Skin Disease Detection
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-300 hover:text-primary-400 transition">
                  Find Hospitals
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-300 hover:text-primary-400 transition">
                  Medical Assistant
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary-400" />
                <a href="mailto:info@skinhealth.com" className="text-slate-300 hover:text-primary-400 transition">
                  info@skinhealth.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary-400" />
                <a href="tel:+1234567890" className="text-slate-300 hover:text-primary-400 transition">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-primary-400 mt-1" />
                <span className="text-slate-300">
                  123 Healthcare Avenue, Medical District, CA 90210
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
          <p>&copy; {currentYear} SkinHealth. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/privacy" className="text-slate-400 hover:text-primary-400 transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-slate-400 hover:text-primary-400 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;