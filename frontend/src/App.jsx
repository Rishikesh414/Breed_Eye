import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cattle from './pages/Cattle';
import Buffalo from './pages/Buffalo';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cattle" element={<Cattle />} />
        <Route path="/buffalo" element={<Buffalo />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
