import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { fetchUserLogin, fetchUserRegister, fetchZipCode } from '../fetch';
import { states } from '../functions';
import UserContext from '../context/UserContext'
import Container from '../components/Container';
import { NavLink } from "react-router-dom";


const formDefault = {
  email: "",
  password: "",
  password_confirm: "",
  plant_hardiness_zone: null,
  state: "",
  zip_code: null,
}

export default function UserLogin() {
  const { user_id, onLogin } = useContext(UserContext);
  const [form, setForm] = useState({...formDefault});
  const [resultUser, setResultUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user_id) {
      navigate('/profile');
    }
  }, [])
  if (user_id) return

  function handleChange (e) {
    const {name, value} = e.target;
    if (value == "") {
      setForm({...form, [name]: null})
    } else if (name === "email") {
      setForm({...form, [name]: value.toLowerCase()})
    } else {
      setForm({...form, [name]: value})
    }
  }
  async function handleSubmit (e) {
    e.preventDefault();
    const result = await fetchUserLogin(form)
      .then((response) => {
        setResultUser(response);
        if (!response.error) {
          onLogin(response);
          navigate('/bookmark');
        }
        return response;
      })
      .catch((error) => {
        console.error("Error during login:", error);
        return { error: "Login failed. Please check your credentials and try again." };
      })
    setResultUser(result);
  }

  if (resultUser && resultUser.user_id) return
  return (
    <>
      <Container className="bg-blue-c2">
        <h2>User Login</h2>
      </Container>
      <Container className="bg-blue-c3" padding>
        <div className='w3-row'>
          <div className='w3-col m6'>
            <div>
              <p>Welcome back! Please enter your email and password to log in.</p>
            </div>

            <div>
              <p>If you have any issues logging in, please contact support.</p>

              <p>Don't have an account?
                <NavLink className="w3-padding bg-blue border-blue w3-margin-left" to='/register'>Register</NavLink>
              </p>
            </div>
          </div>
          <div className='w3-col m6'>
            <form
                onSubmit={handleSubmit}
                className='w3-card bg-blue-c2 w3-padding border-blue'
                style={{maxWidth: "400px", margin: "0 auto"}}>
              <h2>Log In</h2>

              <div>
                <label htmlFor="email">Email:</label>
                <input
                    autoComplete="email"
                    className='w3-input'
                    id="email"
                    minLength="6"
                    name="email"
                    title="Email Address"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required />
              </div>

              <div>
                <label htmlFor="password">Password:</label>
                <input
                    autoComplete="password"
                    className='w3-input'
                    id="password"
                    minLength="6"
                    name="password"
                    title="Password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required />
              </div>

              <div className='w3-center w3-padding-small'>
                <button
                    className="bg-blue"
                    title="Login"
                    type="submit">
                  Login
                </button>
              </div>
            </form>

            {resultUser && resultUser.user_id && (
              <div className='w3-panel w3-green w3-leftbar w3-border-green w3-margin-top'
                title="Login Success">
                <p>Login successful! Your user ID is {resultUser.id}.</p>
              </div>
            )}
            {resultUser && resultUser.error && (
              <div className='w3-panel w3-red w3-leftbar w3-border-red w3-margin-top'
                title="Login Failed">
                <p>Login failed: {resultUser.error}</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
