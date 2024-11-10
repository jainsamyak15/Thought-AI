import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Image as ImageIcon,
  Twitter,
  MessageSquare,
  Sparkles,
  User as UserIcon,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { User } from "@supabase/supabase-js";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const menuItems = [
    { icon: <Home size={24} />, label: "Home", href: "/" },
    {
      icon: <Sparkles size={24} />,
      label: "Brand Name Generator",
      href: "/brand-name",
    },
    { icon: <ImageIcon size={24} />, label: "Logo Generator", href: "/logo" },
    { icon: <Twitter size={24} />, label: "Banner Generator", href: "/banner" },
    {
      icon: <MessageSquare size={24} />,
      label: "Tagline Generator",
      href: "/tagline",
    },
    { icon: null, label: "Visualise Your Brand", href: "/visualise" },
    { icon: <UserIcon size={24} />, label: "Profile", href: "/profile" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-[#FF6500]/70 rounded-[17px] md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ x: -264 }}
            animate={{ x: 0 }}
            exit={{ x: -264 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="ml-2 mt-8 -mb-7 rounded-[17px] fixed inset-y-0 left-0 w-64 bg-[#151515] border-r border-white/10 z-40"
          >
            <div className="flex flex-col h-full pt-16 md:pt-5 pb-4">
              <div className="flex-1 flex flex-col px-6">
                <div className="mb-8">
                  <h1 className="ml-4 text-2xl font-bold text-[#F2613F]">
                    thought ai
                  </h1>
                </div>

                <nav className="flex-1">
                  <ul className="space-y-2">
                    {menuItems.map((item) => {
                      const isActive = router.pathname === item.href;
                      return (
                        <li key={item.href}>
                          <Link href={item.href} legacyBehavior>
                            <a
                              onClick={() =>
                                window.innerWidth < 768 && setIsOpen(false)
                              }
                              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                isActive
                                  ? "bg-white/15 text-white"
                                  : "text-white/70 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              {item.icon}
                              <span className="font-medium">{item.label}</span>
                              {isActive && (
                                <motion.div
                                  layoutId="activeIndicator"
                                  className="absolute left-0 w-1 h-8 bg-gradient-to-b from-purple-400 to-pink-600 rounded-r-full"
                                />
                              )}
                            </a>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {user && (
                  <button
                    onClick={handleSignOut}
                    className="mb-[50px] flex items-center space-x-3 px-4 py-3 mt-4 rounded-xl bg-red-700 text-white transition-colors"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
