import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, User, Shield, LogOut, Menu, X, UserCircle, ShieldUser } from 'lucide-react';
import Button from './ui/Button';

const Navbar = ({ currentUser, onLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Debug: log role in dev so we can confirm what value arrives here
    if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.debug('Navbar currentUser:', currentUser);
    }
    const role = String(currentUser?.role || '').trim().toLowerCase();
    const canAccessAdmin = role === 'admin' || role === 'moderator';

    return (

        <nav className="bg-gradient-to-r from-indigo-50 to-white/60 backdrop-blur-lg shadow sticky top-0 z-50 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                                <ShieldUser className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-lg md:text-xl font-semibold text-gray-900">Group14</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg transition-colors font-medium flex items-center gap-2">
                            <Home className="w-4 h-4" />
                            Trang chủ
                        </Link>
                        <Link to="/profile" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg transition-colors font-medium flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Hồ sơ
                        </Link>
                    {canAccessAdmin && (
                            <Link to="/admin" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg transition-colors font-medium flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Quản trị
                            </Link>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {currentUser && (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-3 px-3 py-2 bg-white/60 rounded-full border border-white/10 shadow-sm">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center">
                                        <UserCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-sm text-gray-800">{currentUser.name}</div>
                                </div>
                                <Button variant="ghost" onClick={onLogout} className="px-3 py-2">Đăng xuất</Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link
                                to="/"
                                className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 font-medium"
                                onClick={closeMobileMenu}
                            >
                                <Home className="w-5 h-5" />
                                Trang chủ
                            </Link>
                            <Link
                                to="/profile"
                                className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 font-medium"
                                onClick={closeMobileMenu}
                            >
                                <User className="w-5 h-5" />
                                Hồ sơ
                            </Link>
                        {canAccessAdmin && (
                                <Link
                                    to="/admin"
                                    className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 font-medium"
                                    onClick={closeMobileMenu}
                                >
                                    <Shield className="w-5 h-5" />
                                    Quản trị
                                </Link>
                            )}
                            {currentUser && (
                                <div className="border-t border-gray-200 pt-3 mt-3">
                                    <div className="flex items-center gap-3 px-3 py-2 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center">
                                            <UserCircle className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-sm font-medium text-gray-700">{currentUser.name}</div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            onLogout();
                                            closeMobileMenu();
                                        }}
                                        className="flex items-center gap-3 w-full px-3 py-3 text-left text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
