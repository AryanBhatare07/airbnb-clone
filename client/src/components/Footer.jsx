import { Link } from "react-router-dom";
import { House, Heart, Mail, ArrowUpRight } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Branding */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
                <House size={21} />
              </div>

              <span className="text-xl font-bold text-rose-500">
                Airbnb Clone
              </span>
            </Link>

            <p className="text-sm text-gray-500 leading-relaxed mt-4 max-w-xs">
              Find your perfect stay, explore beautiful destinations and make
              your next trip memorable.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Explore</h3>

            <div className="flex flex-col gap-3 text-sm text-gray-500">
              <Link
                to="/"
                className="hover:text-rose-500 transition-colors w-fit"
              >
                Home
              </Link>

              <Link
                to="/"
                className="hover:text-rose-500 transition-colors w-fit"
              >
                Explore Listings
              </Link>

              <Link
                to="/login"
                className="hover:text-rose-500 transition-colors w-fit"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="hover:text-rose-500 transition-colors w-fit"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Get in Touch</h3>

            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Have a question or need help? Feel free to reach out.
            </p>

            <a
              href="mailto:support@example.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors"
            >
              <Mail size={17} />
              Contact Us
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Airbnb Clone. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-sm text-gray-500">
            Made with
            <Heart size={15} className="text-rose-500 fill-rose-500" />
            for travelers
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
