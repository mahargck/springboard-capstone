import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import Container from '../../components/Container';
import UserContext from '../../context/UserContext'

import { fetchUserReset, fetchUserUpdate, fetchZipCode } from '../../fetch';
import { states } from '../../functions';

const formDefault = {
  email: "",
  old_password: "",
  password: "",
  password_confirm: "",
  plant_hardiness_zone: "",
  state: "",
  zip_code: "",
}
const errorDefault = {
  Update: null,
  Password: null,
  message: null
}

// export default class UserLogin extends Component {
export default function UserProfile() {
  const userProfile = useContext(UserContext);

  const [form, setForm] = useState({...formDefault, ...userProfile});
  const [resultUser, setResultUser] = useState(null);
  const [formMode, setFormMode] = useState(null);
  const [error, setError] = useState({...errorDefault});
  const navigate = useNavigate();

  useEffect(() => {
    if (!userProfile.user_id) {
      navigate('/login');
    }
  }, [])
  useEffect(() => {
    const newForm = {...formDefault};
    newForm.user_id = userProfile.user_id
    newForm.email = userProfile.email;
    if (userProfile.plant_hardiness_zone) newForm.plant_hardiness_zone = userProfile.plant_hardiness_zone;
    if (userProfile.state) newForm.state = userProfile.state;
    if (userProfile.zip_code) newForm.zip_code = userProfile.zip_code;
    setForm(newForm);
    setError({...errorDefault, "message": error.message});
  }, [formMode]);

  if (!userProfile.user_id) return

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
  async function handleSubmitUpdate (e) {
    e.preventDefault();
    fetchUserUpdate(form)
      .then((response) => {
        userProfile.onUpdate(response.data);
        setError({...errorDefault, "message": "Successfully updated location."});
        setFormMode(null)
      })
      .catch((error) => {
        console.error("Error during login:", error);
        return { error: "Login failed. Please check your credentials and try again." };
      });
  }
  async function handleSubmitPassword (e) {
    e.preventDefault();
    if (form.password !== form.password_confirm) {
      console.error("Passwords do not match");
      return;
    }
    const result = await fetchUserReset(form);
    if (result.id) {
      setError({...errorDefault, "message": "Successfully changed password."});
      setFormMode(null);
    } else {
      console.error("Password change failed:", result);
      setError({...errorDefault, "Password": result.error})
    }
  }


  function registerSwitch() {
    setIsNewUser(!isNewUser);
  }
  function zoneToString(zone) {
    if (zone == null || zone == "") {
      return "Not specified";
    }
    if (zone == Math.floor(zone)) {
      return Math.floor(zone).toString() + "a";
    }
    return Math.floor(zone).toString() + "b";
  }
  function stateToText(stateAbbr) {
    try {
      const item = states.filter((state) => (stateAbbr ==state.value))[0]
      return item.name;
    } catch (e) {
      return "Unknown"
    }
  }

  return (
    <>
      <Container className="bg-blue-c2">
        <h2>User Profile</h2>
      </Container>
      <Container className="bg-blue-c3">
        <div className='w3-row'>
          <div className='w3-col m6 w3-padding-small'>
            <div>
              <label>Email:</label>
              <div className='w3-input bg-blue-c4'>
                {userProfile.email}
              </div>
            </div>

            <div>
              <label>Password:</label>
              <div style={{textAlign: "center"}}>
                <button
                    className='bg-blue'
                    onClick={() => setFormMode("Password")}>
                  Change Password
                </button>
              </div>
            </div>

            <div>
              <label>Zip Code:</label>
              <div
                  className='w3-input bg-blue-c4'
                  onDoubleClick={() => setFormMode("Update")} >
                    {(userProfile.zip_code) ? userProfile.zip_code : <span style={{color: "#8888"}}>Unknown</span>}
              </div>
            </div>

            <div>
              <label>Hardiness Zone:</label>
              <div
                  className='w3-input bg-blue-c4'
                  onDoubleClick={() => setFormMode("Update")} >
                {(userProfile.plant_hardiness_zone) ? zoneToString(userProfile.plant_hardiness_zone) : <span style={{color: "#8888"}}>Unknown</span>}
              </div>
            </div>

            <div>
              <label>State:</label>
              <div
                  className='w3-input bg-blue-c4'
                  onDoubleClick={() => setFormMode("Update")} >
                {(userProfile.state) ? stateToText(userProfile.state) : <span style={{color: "#8888"}}>Unknown</span>}
              </div>
            </div>

            <div style={{textAlign: "center"}}>
              <button
                  className='bg-blue'
                  onClick={() => setFormMode("Update")}>
                Change Location
              </button>
            </div>
          </div>
          {(error.message) && (
            <div className='w3-col m6 w3-padding-small'
                title="Update Message">
              <p className='w3-padding-small w3-pale-blue w3-border w3-border-blue'>
                <span className="material-symbols-outlined w3-left">
                  info
                </span>
                <span>{error.message}</span>
              </p>
            </div>
          )}
          {(formMode=="Update") && (
            <div className='w3-col m6 w3-padding-small'>
              <form
                  className='border-blue w3-card w3-padding bg-blue-c5'
                  style={{maxWidth: "400px", margin: "0 auto"}}
                  onSubmit={handleSubmitUpdate} >

                <a
                    className="material-symbols-outlined w3-right bg-blue w3-round"
                    style={{cursor: "pointer"}}
                    onClick={() => setFormMode(null)} >
                  close
                </a>
                <h3>Location</h3>

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
                      title='Zip Code'
                      type="string"
                      value={form.zip_code}
                      onChange={handleChange}
                      onBlur={handleZipCodeOnBlur} />
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
                    className='w3-input bg-blue'
                    id="plant_hardiness_zone"
                    max="13.5"
                    min="1"
                    name="plant_hardiness_zone"
                    step="0.5"
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
                {(error.Update) && (
                  <p style={{color: "red"}}>
                    <span className="material-symbols-outlined w3-left">
                      error
                    </span>
                    {error.Update}
                  </p>
                )}

                <div className='w3-center'>
                  <button className="bg-blue" title="Update Location" type="submit">Update Location</button>
                </div>
              </form>
            </div>
          )}
          {(formMode=="Password") && (
            <div className='w3-col m6 w3-padding-small'>
              <form
                  onSubmit={handleSubmitPassword}
                  className='w3-card w3-padding bg-blue-c5 border-blue'
                  style={{maxWidth: "400px", margin: "0 auto"}}>

                <a
                    className="material-symbols-outlined w3-right bg-blue w3-round"
                    style={{cursor: "pointer"}}
                    onClick={() => setFormMode(null)} >
                  close
                </a>
                <h3>Change Password</h3>

                <div>
                  <label htmlFor="old_password">Old Password:</label>
                  <input
                      className='w3-input'
                      id="old_password"
                      minLength="6"
                      name="old_password"
                      placeholder='e-i-e-i-o'
                      title="Old Password"
                      type="password"
                      value={form.old_password}
                      onChange={handleChange}
                      required />
                </div>
                <hr />
                <div>
                  <label htmlFor="password">New Password:</label>
                  <input
                      className='w3-input'
                      id="password"
                      minLength="6"
                      name="password"
                      title="New Password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      required />

                  <label htmlFor="password_confirm">Confirm New Password:</label>
                  <input
                      className='w3-input'
                      id="password_confirm"
                      minLength="6"
                      name="password_confirm"
                      title="Confirm New Password"
                      type="password"
                      value={form.password_confirm}
                      onChange={handleChange}
                      required />
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
                {(error.Password) && (
                  <p style={{color: "red"}}
                    title="Password Invalid">
                    <span className="material-symbols-outlined w3-left">
                      error
                    </span>
                    {error.Password}
                  </p>
                )}

                <div className='w3-center'>
                  <button className="bg-blue" type="submit">Update Password</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
