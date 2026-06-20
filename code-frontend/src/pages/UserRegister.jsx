import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { fetchUserLogin, fetchUserRegister, fetchZipCode } from '../fetch';
import { zoneToString, states } from '../functions';
import UserContext from '../context/UserContext'
import Container from '../components/Container';
import { NavLink } from "react-router-dom";

const formDefault = {
  email: "",
  password: "",
  password_confirm: "",
  plant_hardiness_zone: undefined,
  state: "",
  zip_code: "",
}

// export default class UserLogin extends Component {
export default function UserRegister() {
  const { user_id } = useContext(UserContext);
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

    if (form.password !== form.password_confirm) {
      console.error("Passwords do not match");
      return;
    }
    const result = await fetchUserRegister(form);
    if (result.id) {
      setResultUser(result);
      setForm({...formDefault});
    } else {
      console.error("Registration failed:", result);
      setResultUser(result);
    }
  }
  function handleZipCodeOnBlur(e) {
    const zip_code = form.zip_code;
    if (zip_code != "" && zip_code != null) {
      fetchZipCode(zip_code)
        .then((response) => {
          setForm({...form,
            ["state"]: (response.state !== null) ? response.state : form.state,
            ["plant_hardiness_zone"]: (response.zone != null) ? response.zone : form.plant_hardiness_zone});
          })
        .catch((error) => {
          console.error("Error fetching zip code data:", error);
        });
    }
  }

  return (
    <>
      <Container className="bg-blue-c2">
        <h2>New User Registration</h2>
      </Container>
      <Container className="bg-blue-c3" padding>
        <div className='w3-row'>
          <div className='w3-col m6'>
            <div className='w3-panel w3-yellow w3-leftbar w3-border-yellow'>
              <p>If you have any issues logging in, please contact support.</p>
            </div>

            <div>
              <p>Please register by filling out the form below.</p>

              <p>Have an account?
                <NavLink className="w3-padding bg-blue border-blue w3-margin-left" to='/login'>Log In</NavLink>
              </p>
            </div>

            {(resultUser && !resultUser.error) && (
              <div title='New User' className='w3-panel w3-pale-blue w3-leftbar w3-border w3-border-blue w3-margin-top w3-padding-small'>
                <span className="material-symbols-outlined w3-left w3-padding-small">
                    info
                </span>
                <span className='w3-padding-small'>New User Created</span>
              </div>
            )}

            {(resultUser && resultUser.error) && (
              <div title='Error' className='w3-panel w3-pale-red w3-leftbar w3-border w3-border-red w3-margin-top w3-padding-small'>
                <span className="material-symbols-outlined w3-left w3-padding-small">
                    error
                </span>
                <span className='w3-padding-small'>Unable to create User.</span>
              </div>
            )}
          </div>
          <div className='w3-col m6'>
            <form
                onSubmit={handleSubmit}
                className='w3-card bg-blue-c2 w3-padding border-blue'
                style={{maxWidth: "400px", margin: "0 auto"}}>
              <h2>Register</h2>

              <div>
                <label htmlFor="email">Email:</label>
                <small className='w3-right'>Required</small>
                <input
                    className='w3-input'
                    id="email"
                    name="email"
                    placeholder='Old.McDonald@farm.com'
                    title="Email Address"
                    type="email"
                    value={form.email}
                    required
                    onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <small className='w3-right'>Required</small>
                <input
                    className='w3-input'
                    id="password"
                    minLength="6"
                    name="password"
                    placeholder='e-i-e-i-o'
                    title="Password"
                    type="password"
                    value={form.password}
                    required
                    onChange={handleChange} />
                <label htmlFor="password_confirm">Confirm Password:</label>
                <small className='w3-right'>Required</small>
                <input
                    className='w3-input'
                    id="password_confirm"
                    minLength="6"
                    name="password_confirm"
                    title="Password Confirm"
                    type="password"
                    value={form.password_confirm}
                    required
                    onChange={handleChange} />
                {form.password != form.password_confirm && (
                  <p
                      className="w3-padding-small"
                      style={{backgroundColor: "red"}}
                      title="Password Mismatch">
                    <span className="material-symbols-outlined w3-left">
                      error
                    </span>
                    Passwords do not match
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="zip_code">Zip Code:</label>
                <input
                    className='w3-input'
                    id="zip_code"
                    maxLength="5"
                    minLength="5"
                    name="zip_code"
                    pattern="[0-9]{5}"
                    placeholder='12345'
                    title="Zip Code"
                    type="string"
                    value={form.zip_code}
                    onBlur={handleZipCodeOnBlur}
                    onChange={handleChange} />
              </div>
              <div className='w3-panel w3-blue w3-border-blue w3-card-4 w3-round w3-padding-small'>
                <span className="material-symbols-outlined w3-left w3-padding-small">
                  search_insights
                </span>
                Entering your zip code will automatically fill in your state and plant hardiness zone based on your location.
              </div>
              <div>
                <label htmlFor="plant_hardiness_zone">Hardiness Zone: {zoneToString(form.plant_hardiness_zone)}</label>
                <input
                    className='w3-input'
                    id="plant_hardiness_zone"
                    max="13.5"
                    min="1"
                    name="plant_hardiness_zone"
                    step="0.5"
                    title="Hardiness Zone"
                    type="range"
                    value={form.plant_hardiness_zone}
                    onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="state">State:</label>
                <select
                    className='w3-input'
                    id="state"
                    name="state"
                    title="State"
                    value={form.state}
                    onChange={handleChange} >
                  <option value="" disabled>Select a state</option>
                  {states.map((state) => (
                    <option key={state.value} value={state.value}>{state.name}</option>
                  ))}
                </select>
              </div>

              <div className='w3-center'>
                <button
                    className="bg-blue"
                    title="Register"
                    type="submit">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </>
  );
}
