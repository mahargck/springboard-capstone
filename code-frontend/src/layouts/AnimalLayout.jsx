import { Outlet, NavLink } from "react-router-dom";

export default function AnimalLayout() {
  return (
    <div className="root-layout">
      <header>
        <nav>
          <div className="w3-bar secondary">
            <span>Animals</span>

            <NavLink className="hs-button secondary" to="chicken">Chicken</NavLink>
            <NavLink className="hs-button secondary" to="duck">Duck</NavLink>
            <NavLink className="hs-button secondary" to="geese">Geese</NavLink>
            {/* <NavLink className="hs-button secondary" to="goat">Goat</NavLink> */}
            <NavLink className="hs-button secondary" to="sheep">Sheep</NavLink>
            <NavLink className="hs-button secondary" to="pig">Pig</NavLink>
            {/* <NavLink className="hs-button secondary" to="cow">Cow</NavLink> */}
          </div>

        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}