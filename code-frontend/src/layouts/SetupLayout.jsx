import { Outlet, NavLink } from "react-router-dom";
import Container from '../components/Container';

export default function SetupLayout() {
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