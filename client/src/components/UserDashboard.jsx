import { useEffect, useState, useContext } from 'react';
import { fetchUserData } from '../api/apis';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';

function UserDashboard() {
  const { user: authUser } = useContext(AuthContext);
  console.log('authUser in UserDashboard:', authUser); 
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      // norint išvengti klaidų, kai vartotojas nėra prisijungęs, reikia patikrinti ar authUser yra
      // jeigu nėra, tai nukreipiame vartotoją į pagrindinį puslapį '/'
      // todėl gauname user null arba undefined, nes vartotojas atsijungė arba neprisijungė
      if (!authUser) {
        navigate('/');
        return;
      }
      try {
        const data = await fetchUserData(authUser.id);
        // gauname data
        if (data) {
          console.log(data);
          // ir nustatome userData state objekte
          setUserData(data);
        } else {
          console.error('No data in response');
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
  
    fetchUser();
  }, [authUser, navigate]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {userData.username}!</h1>
      <p>Email: {userData.email}</p>
      <p>Role: {userData.role}</p>
    </div>
  );
}

export default UserDashboard;
