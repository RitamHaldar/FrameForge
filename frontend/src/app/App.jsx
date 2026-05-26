import { BrowserRouter, Routes, Route } from 'react-router';
import DashboardPage from '../features/Home/pages/DashboardPage';
import LandingPage from '../features/Home/pages/LandingPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
