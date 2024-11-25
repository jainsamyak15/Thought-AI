import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, X } from "lucide-react";
import { supabase } from "../lib/supabase";

const Navbar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="mt-[10px] mx-[50px] sm:mx-[250px] rounded-full fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-black/50">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-8"
          >
            <Link
              href="/"
              className="text-xl md:text-xl font-bold bg-gradient-to-r text-[#FF6500]/80"
            >
              thought ai
            </Link>

            <div className="hidden sm:flex space-x-4 md:space-x-6">
              {!isAuthenticated ? (
                <>
                  <NavLink href="#features">Features</NavLink>
                  <NavLink href="#showcase">Showcase</NavLink>
                  <NavLink href="#faq">FAQ</NavLink>
                </>
              ) : (
                <>
                  <Link href="/logo" className="nav-link">
                    Logo
                  </Link>
                  <Link href="/banner" className="nav-link">
                    Banner
                  </Link>
                  <Link href="/tagline" className="nav-link">
                    Tagline
                  </Link>
                  <Link href="/profile" className="nav-link">
                    Profile
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center space-x-4"
            >
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => router.push("/auth/login")}
                    className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => router.push("/auth/login")}
                    className="px-4 py-2 text-sm font-medium bg-[#FF6500]/80  rounded-full hover:opacity-90 transition-opacity"
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium bg-[#FF6500]/80 hover:bg-red-600 rounded-full transition-colors"
                >
                  Sign Out
                </button>
              )}
            </motion.div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden mr-4 text-white/80 hover:text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-black/80 absolute top-full left-0 right-0 rounded-b-xl shadow-lg"
            >
              <div className="flex flex-col space-y-2 py-4 px-4">
                {!isAuthenticated ? (
                  <>
                    <MobileNavLink
                      href="#features"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Features
                    </MobileNavLink>
                    <MobileNavLink
                      href="#pricing"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Pricing
                    </MobileNavLink>
                    <MobileNavLink
                      href="#showcase"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Showcase
                    </MobileNavLink>
                    <MobileNavLink
                      href="#faq"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      FAQ
                    </MobileNavLink>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/auth/login");
                      }}
                      className="w-full px-4 py-2 text-sm font-medium bg-[#FF6500]/80 rounded-full hover:opacity-90 transition-opacity"
                    >
                      Get Started
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/logo"
                      className="mobile-nav-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Logo
                    </Link>
                    <Link
                      href="/banner"
                      className="mobile-nav-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Banner
                    </Link>
                    <Link
                      href="/tagline"
                      className="mobile-nav-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Tagline
                    </Link>
                    <Link
                      href="/profile"
                      className="mobile-nav-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="w-full px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="text-sm font-medium text-white/70 hover:text-white transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-600 transition-all group-hover:w-full" />
    </a>
  );
};

const MobileNavLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick();
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2"
    >
      {children}
    </a>
  );
};

export default Navbar;
