import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Publications from './Publications';
import CompetitiveProgramming from './CompetitiveProgramming';
import Contact from './Contact';


function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {/* <Sidebar /> */}
        <div style={{ marginLeft: '220px', flex: '1', padding: '20px' }}> {/* Content area */}
          <Navbar />
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="/competitive-programming" element={<CompetitiveProgramming />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
