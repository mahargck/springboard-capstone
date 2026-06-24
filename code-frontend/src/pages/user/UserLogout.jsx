import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import UserContext from '../../context/UserContext';
import Container from '../../components/Container';

import { fetchUserLogout } from '../../fetch';

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
      <Container className="bg-blue-c2">
        <h2>User Logout</h2>
      </Container>
      <Container className="bg-blue-c3">
        <p>Redirect to Login Page</p>
      </Container>
    </>
  );
}