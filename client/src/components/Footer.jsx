import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-16">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Branding */}
          <div>
            <h2 className="text-xl font-bold text-rose-500">Airbnb Clone</h2>
            <p className="text-sm text-gray-600 mt-3">
              Find your perfect stay and explore amazing places.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold mb-3">Explore</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-rose-500">
                Home
              </Link>
              <Link to="/" className="hover:text-rose-500">
                Explore Listings
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <a
                href="mailto:support@example.com"
                className="hover:text-rose-500"
              >
                Contact Us
              </a>
              <p>Help & Support</p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-5 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Airbnb Clone. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
