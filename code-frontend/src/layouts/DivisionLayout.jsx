import { useEffect, useState } from 'react'
import { NavLink, Outlet, useParams } from "react-router-dom";
import { fetchDivisionId } from '../fetch'
import { proper } from '../functions'
import Container from '../components/Container';

export default function DivisionLayout() {
  const { division } = useParams();
  const [params, setParams] = useState(division);
  if (division != params) {
    setParams(division);
  }
  const [topics, setTopics] = useState([])

  useEffect(() => {
    fetchAPI();
  }, [params]);

  const fetchAPI = async () => {
    if (!division) return
    try {
      const response = await fetchDivisionId(division)
      setTopics(response);
    } catch (e) {
      if (e.name === "AbortError") {
        console.error("Aborted", e);
        return;
      }
      console.error("Error", e);
    }
  };

  if (!division) return
  return (
    <div className="root-layout">
      <header>
        <Container className="bg-green">
          <nav>
            <div className="w3-bar bg-green">
              <span style={{marginLeft: 32}} title="Section"><i>{proper(division)}:</i></span>

              {topics.map((topic) => (
                <NavLink 
                  key={topic.id}
                  to={topic.name}
                >
                  {topic.name}
                </NavLink>
              ))}
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