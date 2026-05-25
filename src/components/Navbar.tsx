import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Languages, Menu, Moon, Sun, X } from "lucide-react";
import { useTranslation } from "react-i18next";
// 定义 Navbar 组件的 props 类型
interface NavbarProps {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  isInverted: boolean;
  toggleColorMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  changeLanguage,
  isInverted,
  toggleColorMode,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const nextLanguage = currentLanguage === "zh" ? "en" : "zh";
  const nextLanguageLabel = currentLanguage === "zh" ? "EN" : "中";

  const navigation = [
    { name: t("Home"), href: "/" },
    { name: t("Competitive-Programming"), href: "/competitive-programming" },
    // { name: t("Contact"), href: "/contact" },
  ];

  const languageToggle = (
    <button
      type="button"
      onClick={() => changeLanguage(nextLanguage)}
      aria-label={`Switch to ${nextLanguage === "zh" ? "Chinese" : "English"}`}
      title={nextLanguage === "zh" ? "中文" : "English"}
      className="language-toggle inline-flex h-8 min-w-12 items-center justify-center gap-1 rounded-sm px-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
    >
      <Languages size={17} strokeWidth={2.1} />
      <span className="text-[13px] font-semibold leading-none">{nextLanguageLabel}</span>
    </button>
  );

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
                {languageToggle}
                <button
                  type="button"
                  onClick={toggleColorMode}
                  aria-label={isInverted ? "Use normal colors" : "Use inverted colors"}
                  title={isInverted ? "Normal colors" : "Inverted colors"}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
                >
                  {isInverted ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>

              {/* Mobile Navigation Button */}
              <div className="md:hidden flex items-center space-x-2">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                {languageToggle}
                <button
                  type="button"
                  onClick={toggleColorMode}
                  aria-label={isInverted ? "Use normal colors" : "Use inverted colors"}
                  title={isInverted ? "Normal colors" : "Inverted colors"}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
                >
                  {isInverted ? <Sun size={18} /> : <Moon size={18} />}
                </button>
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
