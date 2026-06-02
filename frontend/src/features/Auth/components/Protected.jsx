import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import LoadingPage from '../pages/LoadingPage';
const Protected = ({children}) => {
    const {user} = useSelector((state) => state.auth);
    const isLoading = useSelector((state) => state.auth.isLoading);
    if(isLoading) {
        return <LoadingPage />;
    }
    if(!user) {
        return <Navigate to="/auth" />;
    }
  return children;
}

export default Protected