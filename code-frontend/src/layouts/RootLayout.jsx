import { Outlet, NavLink } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="root-layout">
      <header>
        <nav>
          <h1>Homesteader's Notebook</h1>
          <div className="w3-bar primary">
            <NavLink className="hs-button" to="/">Home</NavLink>
            <NavLink className="hs-button" to="about">About</NavLink>
            <NavLink className="hs-button" to="animals">Animals</NavLink>
            <NavLink className="hs-button" to="firewood">Firewood</NavLink>
            <NavLink className="hs-button w3-right" to="setup">Setup</NavLink>
          </div>

        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}