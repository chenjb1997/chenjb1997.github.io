import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Publications from './Publications';
import CompetitiveProgramming from './CompetitiveProgramming';
import Contact from './Contact';

function App() {
  return (
    <Router>
      <div className="App">
        {/* <Sidebar /> */}
        <div>
          <Navbar />
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="/competitive-programming" element={<CompetitiveProgramming />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
