import { useContext, useEffect, useState } from 'react'
import { Outlet, NavLink } from "react-router-dom";
import Container from '../components/Container';
import UserContext from '../context/UserContext';
import {fetchDivisions} from '../fetch'
import {proper} from '../functions'

export default function RootLayout() {
  const {user_id, email, is_admin} = useContext(UserContext);
  const [divisions, setDivisions] = useState([])

  const fetchAPI = async () => {
    try {
      fetchDivisions()
      .then((response) => {
        if (response.length > 0) {
          setDivisions(response);
        }
      });
    } catch (e) {
      if (e.name === "AbortError") {
        console.error("Aborted", e);
        return;
      }
      console.error("Error", e);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);
  return (
    <div className="root-layout">
      <header>
        <Container>
          <div className="w3-row">
            <div className="w3-col s12 m8 l9 w3-padding-small">
              <h1>Homesteader's Notebook</h1>
            </div>
            <div className="w3-col s12 m4 l3" style={{textAlign: "right"}}>
              <div className="w3-col s6 m12 w3-padding-small">
                {email}
              </div>

              <div className="w3-col s6 m12 w3-padding-small">
                <span className="w3-bar bg-brown"
                  style={{width: "auto"}}>
                  {(user_id) ? (
                    <>
                      <NavLink to="bookmark"
                        style={{padding: "3px 8px 8px 8px"}}>
                          <span className="material-symbols-outlined"
                            style={{fontSize:"22.5px", padding:"0"}}>
                            bookmark
                          </span>
                      </NavLink>
                      <NavLink to="profile">Profile</NavLink>
                      <NavLink to="logout">Logout</NavLink>
                    </>
                  ) : (
                    <NavLink to="login">Login</NavLink>
                  )}
                </span>
              </div>
            </div>
          </div>
        </Container>

        <Container className="bg-brown">
          <nav>
            <div className="w3-bar bg-brown">
              <NavLink to="/">Home</NavLink>
              <NavLink to="about">About</NavLink>
              {is_admin &&
                <NavLink className="w3-right" to="setup">Setup</NavLink>
              }

              <NavLink className="w3-right" to="faq">FAQ</NavLink>
              {divisions.map((division) => (
                <NavLink key={division} to={`${division}`}>{division}</NavLink>
              ))}
            </div>
          </nav>
        </Container>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <Container>
          Copyright 2026. All Rights Reserved.
        </Container>
      </footer>
    </div>
  )
}