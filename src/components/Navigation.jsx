import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../hooks/useAuth';

const { FiHome, FiUsers, FiDollarSign, FiFileText, FiTrendingUp, FiLogOut, FiShield, FiMenu, FiX, FiUser, FiSettings } = FiIcons;

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/clients', icon: FiUsers, label: 'Clients' },
    { path: '/costs', icon: FiDollarSign, label: 'Costs' },
    { path: '/financials', icon: FiFileText, label: 'Reports' },
    { path: '/advice', icon: FiTrendingUp, label: 'Advice' },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    closeMobileMenu();
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 z-50 px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg">
              <SafeIcon icon={FiShield} className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Agency Finance</h1>
              <p className="text-slate-400 text-xs">
                {user?.user_metadata?.company_name || 'Financial Management'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2 rounded-lg hover:bg-slate-700 transition-colors touch-target"
          >
            <SafeIcon icon={isMobileMenuOpen ? FiX : FiMenu} className="text-xl" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={closeMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Mobile Slide-out Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-slate-800/95 backdrop-blur-sm border-r border-slate-700 z-50 safe-area-top safe-area-bottom"
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-8 mt-16">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg">
                  <SafeIcon icon={FiShield} className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg">Agency Finance</h1>
                  <p className="text-slate-400 text-xs">
                    {user?.user_metadata?.company_name || 'Professional Financial Management'}
                  </p>
                </div>
              </div>

              {/* User Info */}
              <div className="mb-6 p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiUser} className="text-slate-400" />
                  <div>
                    <p className="text-white text-sm font-medium">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                    </p>
                    <p className="text-slate-400 text-xs">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path} onClick={closeMobileMenu}>
                      <motion.div
                        className={`flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-200 touch-target ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        <SafeIcon icon={item.icon} className="text-lg" />
                        <span className="font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}

                {/* Profile Settings */}
                <Link to="/profile" onClick={closeMobileMenu}>
                  <motion.div
                    className={`flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-200 touch-target ${
                      location.pathname === '/profile'
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <SafeIcon icon={FiSettings} className="text-lg" />
                    <span className="font-medium">Profile Settings</span>
                  </motion.div>
                </Link>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 safe-area-bottom">
              <motion.button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-4 w-full text-slate-300 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200 touch-target"
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={FiLogOut} className="text-lg" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed left-0 top-0 h-full w-64 xl:w-72 bg-slate-800/95 backdrop-blur-sm border-r border-slate-700 z-50">
        <div className="p-6 xl:p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
              <SafeIcon icon={FiShield} className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Agency Finance</h1>
              <p className="text-slate-400 text-sm">
                {user?.user_metadata?.company_name || 'Professional Financial Management'}
              </p>
            </div>
          </div>

          {/* User Info */}
          <div className="mb-6 p-4 bg-slate-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-600 rounded-full">
                <SafeIcon icon={FiUser} className="text-slate-300" />
              </div>
              <div>
                <p className="text-white font-medium">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                </p>
                <p className="text-slate-400 text-sm">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    className={`flex items-center space-x-3 px-4 py-3 xl:py-4 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                    whileHover={{ x: isActive ? 0 : 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <SafeIcon icon={item.icon} className="text-lg" />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}

            {/* Profile Settings */}
            <Link to="/profile">
              <motion.div
                className={`flex items-center space-x-3 px-4 py-3 xl:py-4 rounded-xl transition-all duration-200 ${
                  location.pathname === '/profile'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                whileHover={{ x: location.pathname === '/profile' ? 0 : 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={FiSettings} className="text-lg" />
                <span className="font-medium">Profile Settings</span>
              </motion.div>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 xl:p-8">
          <motion.button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 xl:py-4 w-full text-slate-300 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <SafeIcon icon={FiLogOut} className="text-lg" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700 z-40 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className="flex-1">
                <motion.div
                  className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-colors touch-target ${
                    isActive ? 'text-blue-400' : 'text-slate-400 hover:text-slate-300'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <SafeIcon icon={item.icon} className="text-lg" />
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
          <button onClick={() => setIsMobileMenuOpen(true)} className="flex-1">
            <motion.div
              className="flex flex-col items-center space-y-1 px-2 py-2 rounded-lg text-slate-400 hover:text-slate-300 transition-colors touch-target"
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiMenu} className="text-lg" />
              <span className="text-xs font-medium">More</span>
            </motion.div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;