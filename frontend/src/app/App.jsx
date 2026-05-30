import { BrowserRouter, Routes, Route } from 'react-router';
import DashboardPage from '../features/Home/pages/DashboardPage';
import LandingPage from '../features/Home/pages/LandingPage';
import AuthPage from '../features/Auth/pages/AuthPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
