import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Mail, GraduationCap, Phone, Github, FileText } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CompetitiveProgramming from './pages/CompetitiveProgramming';
import Contact from './pages/Contact.tsx';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
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