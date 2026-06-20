
// Router
import { RouterProvider } from 'react-router-dom'
import router from './Router'

// Context
import UserContext from './context/UserContext'
import { useState, useEffect } from 'react'
import {getUserFromLocalStorage} from './functions'

// Styling
import './App.css'

const defaultUser = {
  user_id: null,
  email: null,
  plant_hardiness_zone: null,
  is_admin: false
};

export default function App() {
  const [user, setUser] = useState(getUserFromLocalStorage());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (user.user_id) {
        localStorage.setItem("user", JSON.stringify(user));
    } else {
        localStorage.removeItem("user");
    }
    setIsLoaded(true)
  }, [user])

  function onLogin(data) {
    if (data == null) {
      onLogout();
    } else {
      setUser(data);
    }
  }
  function onLogout() {
    localStorage.removeItem("user");
    setUser(defaultUser);
  }
  function onUpdate(data) {
    if(user.user_id == data.user_id) {
      setUser({...user,
        plant_hardiness_zone:data.plant_hardiness_zone,
        zip_code: data.zip_code,
        state: data.state})
    } else {
      console.error("User Update Failed", "user_id mismatch")
    }
  }
  if (!isLoaded) return
  return (
    <UserContext.Provider value={{
      user_id: user.user_id,
      email: user.email,
      plant_hardiness_zone: user.plant_hardiness_zone,
      zip_code: user.zip_code,
      state: user.state,
      is_admin: user.is_admin,
      onLogin: onLogin,
      onLogout: onLogout,
      onUpdate: onUpdate
    }}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
}