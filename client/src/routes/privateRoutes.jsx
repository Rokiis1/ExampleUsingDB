import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function PrivateRoute({ children, roles }) {
  const { isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || !roles.includes(user.role))) {
      navigate('/');
    }
  }, [isLoading, user, roles, navigate]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return children;
}

export default PrivateRoute;
