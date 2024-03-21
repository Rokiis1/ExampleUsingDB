import { useEffect, useState, useContext } from 'react';
import { fetchUserData } from '../api/apis'; // import fetchUserData
import { AuthContext } from '../utils/AuthContext'; // import AuthContext

function UserDashboard() {
  const { user: authUser } = useContext(AuthContext); // get the token from your AuthContext

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (authUser) {
        try {
          const data = await fetchUserData(authUser.id);
          if (data) {
            console.log(data); // log the user data to the console
            setUserData(data);
          } else {
            console.error('No data in response');
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      } else {
        console.error('authUser is null or undefined');
      }
    };

    fetchUser();
  }, [authUser]);

  if (!userData) {
    return <div>Loading...</div>; // display a loading message while the data is being fetched
  }

  return (
    <div>
      <h1>Welcome, {userData.username}!</h1>
      <p>Email: {userData.email}</p>
      <p>Role: {userData.role}</p>
      {/* display other user data as needed */}
    </div>
  );
}

export default UserDashboard;
