import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './routes/privateRoutes';
import { AuthContext } from './utils/AuthContext';

function App() {
  const { user: authUser, logoutUser } = useContext(AuthContext); 

  return (
    <Router>
      <nav>
        <ul>
          {!authUser ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/">Register</Link>
              </li>
            </>
          ) : (
            <li>
              <button onClick={logoutUser}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<RegisterForm />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute roles={['user']}>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
