// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider } from './context/ThemeContext'; // Import the ThemeProvider

import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Dashboard from './pages/dashboard/Dashboard';
import About from './pages/about/About';
import './styles/globals.scss';

function App() {
  return (
    <ThemeProvider>
      <DndProvider backend={HTML5Backend}>
        <Router>
          <div className="app-container">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </DndProvider>
    </ThemeProvider>
  );
}

export default App;