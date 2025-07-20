import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Heart, Menu, X, Shield, Phone } from 'lucide-react';

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const navigation = [
    { name: 'Assessment', href: '/quiz', current: router.pathname === '/quiz' },
    { name: 'Emergency', href: '/emergency', current: router.pathname === '/emergency' },
    { name: 'Warnings', href: '/location', current: router.pathname === '/location' },
    { name: 'Checklist', href: '/checklist', current: router.pathname === '/checklist' },
    { name: 'AI Chat', href: '/chat', current: router.pathname === '/chat' },
    { name: 'Incident Map', href: '/map', current: router.pathname === '/map' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Hazard Protection
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.current
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href="tel:911"
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                Emergency
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-50"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    item.current
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href="tel:911"
                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md text-base font-medium hover:bg-red-700 transition-colors mx-3 mt-4"
              >
                <Phone className="w-4 h-4 mr-2" />
                Emergency Call
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="p-2 bg-red-600 rounded-lg mr-3">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Hazard Protection</span>
              </div>
              <p className="text-gray-400">
                Providing comprehensive safety tools and resources for personal protection.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Emergency Resources</h3>
              <div className="space-y-2">
                <p className="text-gray-400">National Domestic Violence Hotline:</p>
                <a href="tel:1-800-799-7233" className="text-white hover:text-red-400 transition-colors">
                  1-800-799-SAFE (7233)
                </a>
                <p className="text-gray-400 mt-4">Crisis Text Line:</p>
                <p className="text-white">Text HOME to 741741</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Access</h3>
              <div className="space-y-2">
                <Link href="/emergency" className="block text-gray-400 hover:text-white transition-colors">
                  Safety Resources
                </Link>
                <Link href="/quiz" className="block text-gray-400 hover:text-white transition-colors">
                  Risk Assessment
                </Link>
                <Link href="/location" className="block text-gray-400 hover:text-white transition-colors">
                  Location Warnings
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Honeymoon Hazard Protection System. Built for safety and protection.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}