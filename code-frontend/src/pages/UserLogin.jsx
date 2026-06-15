import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react'
import { fetchUserLogin, fetchUserRegister, fetchZipCode, states } from '../functions';
import UserContext from '../context/UserContext'

const formDefault = {
  email: "",
  password: "",
  password_confirm: "",
  plant_hardiness_zone: null,
  state: "",
  zip_code: null,
}

// export default class UserLogin extends Component {
export default function UserLogin() {
  const { onLogin } = useContext(UserContext);

  const [form, setForm] = useState({...formDefault});
  // This is just a placeholder. You would typically check this against your user database.
  const [isNewUser, setIsNewUser] = useState(false);
  const [resultUser, setResultUser] = useState(null);
  const navigate = useNavigate();

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
    
    if (isNewUser) {
      if (form.password !== form.password_confirm) {
        console.error("Passwords do not match");
        return;
      }
      const result = await fetchUserRegister(form);
      if (result.id) {
        setResultUser(result);
        setForm({...formDefault, password: "", password_confirm: ""});
        setIsNewUser(false);
      } else {
        console.error("Registration failed:", result);
        setResultUser(result);
      }
    } else {
      fetchUserLogin(form)
        .then((response) => {
          setResultUser(response);
          onLogin(response);

          navigate('/bookmark');
          return response;
        })
        .catch((error) => {
          console.error("Error during login:", error);
          return { error: "Login failed. Please check your credentials and try again." };
        });
    }
  }
  function handleZipCodeOnBlur(e) {
    const zip_code = form.zip_code;
    if (zip_code != null) {
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

  function registerSwitch() {
    setIsNewUser(!isNewUser);
  }
  function hardinessZoneToText(zone) {
    if (zone == null) {
      return "Not specified";
    }
    if (zone == Math.floor(zone)) {
      return zone.toString() + "a";
    }
    return Math.floor(zone).toString() + "b";
  }

  if (isNewUser == true) {
    return (
      <>
        <h2>New User Registration</h2>

        <div className='w3-panel w3-yellow w3-leftbar w3-border-yellow'>
          <p>If you have any issues logging in, please contact support.</p>
        </div>

        <div>
          <p>Please register by filling out the form below.</p>

          <p>Have an account? 
            <button 
                type="button"
                className='bg-blue'
                onClick={registerSwitch}>
                Log In
            </button>
          </p>
        </div>

        <form 
            onSubmit={handleSubmit}
            className='w3-border w3-card bg-blue-2 w3-padding'
            style={{maxWidth: "400px", margin: "0 auto"}}>
          <h2>Register</h2>

          <div>
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                name="email"
                className='w3-input'
                placeholder='OldMcDonald@farm.com'
                value={form.email}
                required
                onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input  
                type="password"
                id="password"
                name="password"
                className='w3-input'
                placeholder='e-i-e-i-o'
                value={form.password}
                minLength="6"
                required
                onChange={handleChange} />
            <label htmlFor="password_confirm">Confirm Password:</label>
            <input  
                type="password"
                id="password_confirm"
                name="password_confirm"
                className='w3-input'
                value={form.password_confirm}
                minLength="6"
                required
                onChange={handleChange} />
            {form.password != form.password_confirm && (
              <p style={{color: "red"}}>
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
                type="string"
                id="zip_code"
                name="zip_code"
                className='w3-input'
                placeholder='12345'
                pattern="[0-9]{5}"
                minLength="5"
                maxLength="5"
                value={form.zip_code}
                onChange={handleChange}
                onBlur={handleZipCodeOnBlur}
                title='Must be 5 numbers long' />
          </div>
          <div className='w3-panel w3-blue w3-border-blue w3-card-4 w3-round w3-padding-small'>
            <span className="material-symbols-outlined w3-left w3-padding-small">
              search_insights
            </span>
            Entering your zip code will automatically fill in your state and plant hardiness zone based on your location.
          </div>
          <div>
            <label htmlFor="plant_hardiness_zone">Hardiness Zone: {hardinessZoneToText(form.plant_hardiness_zone)}</label>
            <input 
                type="range" 
                id="plant_hardiness_zone"
                name="plant_hardiness_zone"
                className='w3-input'
                min="1"
                max="13.5"
                step="0.5"
                value={form.plant_hardiness_zone}
                onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="state">State:</label>
            <select
                id="state"
                name="state"
                className='w3-input'
                value={form.state}
                onChange={handleChange} >
              <option value="" disabled>Select a state</option>
              {states.map((state) => (
                <option key={state.value} value={state.value}>
                    {state.name}
                </option>
              ))}
            </select>
          </div>

          <div className='w3-center'>
            <button className="bg-blue" type="submit">Register</button>
          </div>
        </form>

        {resultUser && resultUser.error && (
          <div className='w3-panel w3-red w3-leftbar w3-border-red w3-margin-top'>
            <p>Unable to create User.</p>
          </div>
        )}
      </>
    );
  } else {
    return (
      <>
        <h2>User Login</h2>

        <div>
          <p>Welcome back! Please enter your email and password to log in.</p>
        </div>

        <div>
          <p>If you have any issues logging in, please contact support.</p>

          <p>Don't have an account? 
            <button 
                type="button"
                className='bg-blue'
                onClick={registerSwitch}>
                    Register here
            </button>
          </p>
        </div>

        <form 
            onSubmit={handleSubmit}
            className='w3-border w3-card bg-blue-2 w3-padding'
            style={{maxWidth: "400px", margin: "0 auto"}}>
          <h2>Log In</h2>

          <div>
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                name="email"
                className='w3-input'
                value={form.email}
                minLength="6"
                onChange={handleChange}
                required />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input
                type="password"
                id="password"
                name="password"
                className='w3-input'
                value={form.password}
                minLength="6"
                onChange={handleChange}
                required />
          </div>

          <div className='w3-center w3-padding-small'>
            <button className="bg-blue" type="submit">Login</button>
          </div>
        </form>

        {resultUser && resultUser.id && (
          <div className='w3-panel w3-green w3-leftbar w3-border-green w3-margin-top'>
            <p>Login successful! Your user ID is {resultUser.id}.</p>
          </div>
        )}
        {resultUser && resultUser.error && (
          <div className='w3-panel w3-red w3-leftbar w3-border-red w3-margin-top'>
            <p>Login failed: {resultUser.error}</p>
          </div>
        )}
      </>
    );
  }
}
