import { Outlet, NavLink } from "react-router-dom";
import Container from '../components/Container';

import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function SetupLayout() {
  const {is_admin} = useContext(UserContext);
  const navigate = useNavigate();
  // If the user is not an admin, navigate to login screen
  useEffect(() => {
    if (!is_admin) {
      navigate('/login');
    }
  }, []);
  if (!is_admin) return

  return (
    <div className="root-layout">
      <header>
        <Container className="bg-blue">
          <nav>
            <div className="w3-bar bg-blue">
              <span style={{marginLeft: 32}}><i>Setup:</i></span>

              <NavLink to="topic">Topics</NavLink>
              <NavLink to="topic_item">Topic Items</NavLink>
              <NavLink to="column">Columns</NavLink>
            </div>
          </nav>
        </Container>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}