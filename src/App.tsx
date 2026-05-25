import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CompetitiveProgramming from './pages/CompetitiveProgramming';
import Contact from './pages/Contact.tsx';
import { useTranslation } from 'react-i18next';

function App() {
   const { i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [hasStoredColorMode, setHasStoredColorMode] = useState(
    () => localStorage.getItem('color-mode') !== null
  );
  const [isInverted, setIsInverted] = useState(
    () => {
      const storedMode = localStorage.getItem('color-mode');
      if (storedMode) {
        return storedMode === 'inverted';
      }
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    }
  );
  const changeLanguage = (lng: string) => {
    console.log(lng);
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
    localStorage.setItem('language', lng);
  };
  const toggleColorMode = () => {
    setHasStoredColorMode(true);
    setIsInverted((value) => !value);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('inverted-theme', isInverted);
    if (hasStoredColorMode) {
      localStorage.setItem('color-mode', isInverted ? 'inverted' : 'normal');
    }
  }, [hasStoredColorMode, isInverted]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar
          currentLanguage={currentLanguage}
          changeLanguage={changeLanguage}
          isInverted={isInverted}
          toggleColorMode={toggleColorMode}
        />
        <div className="container mx-auto px-2 py-8 md:px-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/competitive-programming" element={<CompetitiveProgramming />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
