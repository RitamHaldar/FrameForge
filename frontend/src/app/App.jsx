import { RouterProvider } from 'react-router';
import './App.css';
import { useAuth } from '../features/Auth/hooks/useAuth';
import { useEffect } from 'react';
import { router } from './app.routes';

function App() {
  const { getMeUser } = useAuth();

  useEffect(() => {
    getMeUser();
  }, []);


  return (
    <RouterProvider router={router} />
  );
}

export default App;
