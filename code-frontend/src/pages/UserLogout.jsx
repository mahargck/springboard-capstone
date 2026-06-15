import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { fetchUserLogout } from '../functions';

export default function UserLogout() {
  const { onLogout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    onStartup();
  }, [navigate]);

  async function onStartup() {
    try {
      await fetchUserLogout();
      onLogout(); // Clear user context
      navigate('/login');
    } catch (e) {
      console.error("Error during logout:", e);
    }
  };
  return (
    <>
      <h2>User Logout</h2>
      <p>Redirect to Login Page</p>
    </>
  );
}