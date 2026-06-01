import { BrowserRouter, Routes, Route } from 'react-router';
import DashboardPage from '../features/Home/pages/DashboardPage';
import LandingPage from '../features/Home/pages/LandingPage';
import AuthPage from '../features/Auth/pages/AuthPage';
import VerifyOtpPage from '../features/Auth/pages/VerifyOtpPage';
import './App.css';
import { useAuth } from '../features/Auth/hooks/useAuth';
import { useEffect } from 'react';

function App() {
  const { getMeUser } = useAuth();
  useEffect(() => {
    getMeUser();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
