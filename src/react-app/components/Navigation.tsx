import { useNavigate, useLocation } from 'react-router';
import { Building2, BarChart3, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = '' }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Accueil',
      description: 'Vue d\'ensemble SMT'
    },
    {
      path: '/dashboard',
      icon: BarChart3,
      label: 'Tableau de bord',
      description: 'Statistiques et rapports'
    },
    {
      path: '/entreprises',
      icon: Building2,
      label: 'Entreprises',
      description: 'Gestion des entreprises'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 w-12 h-12 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-emerald-200 flex items-center justify-center"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Desktop Navigation */}
      <nav className={`hidden lg:flex items-center space-x-1 ${className}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-md shadow-2xl">
            <div className="p-6 pt-20">
              <div className="space-y-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-4 p-4 rounded-2xl font-medium transition-all duration-300 ${
                        isActive(item.path)
                          ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                          : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isActive(item.path)
                          ? 'bg-emerald-200'
                          : 'bg-gray-100'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{item.label}</div>
                        <div className="text-sm opacity-70">{item.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
