import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import zhPng from "../assets/zh.png";
import enPng from "../assets/en.png";
// 定义 Navbar 组件的 props 类型
interface NavbarProps {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentLanguage, changeLanguage }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: t("Home"), href: "/" },
    { name: t("Competitive-Programming"), href: "/competitive-programming" },
    // { name: t("Contact"), href: "/contact" },
  ];

  return (
    <div className="relative h-16">
      <nav className="bg-white shadow-sm w-full fixed left-0 top-0 z-[100]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-semibold text-gray-800">
                {/* Jingbang Chen */}
                {t("site-title")}
              </Link>
            </div>
            <div className="flex items-center">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      location.pathname === item.href
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    } px-3 py-2 text-sm font-medium transition-colors duration-200`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="relative">
                  <img
                    onClick={() =>
                      changeLanguage(currentLanguage === "zh" ? "en" : "zh")
                    }
                    src={currentLanguage === "zh" ? zhPng : enPng}
                    alt="zh"
                    className="w-7 h-7 cursor-pointer"
                  />
                </div>
              </div>

              {/* Mobile Navigation Button */}
              <div className="md:hidden flex items-center space-x-2">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <div className="relative">
                  <img
                    onClick={() =>
                      changeLanguage(currentLanguage === "zh" ? "en" : "zh")
                    }
                    src={currentLanguage === "zh" ? zhPng : enPng}
                    alt="zh"
                    className="w-7 h-7 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isOpen && (
            <div className="md:hidden">
              <div className="pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      location.pathname === item.href
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } block px-3 py-2 rounded-md text-base font-medium`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
