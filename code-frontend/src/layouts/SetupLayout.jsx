import { Outlet, NavLink } from "react-router-dom";

export default function SetupLayout() {
  return (
    <div className="root-layout">
      <header>
        <nav>
          <div className="w3-bar secondary">
            <span>Setup</span>

            <NavLink className="hs-button" to="json">JSON</NavLink>
          </div>

        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}