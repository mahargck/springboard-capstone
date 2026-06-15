import { useEffect, useState } from 'react'
import { NavLink, Outlet, useParams } from "react-router-dom";
import { fetchDivisionId, proper } from '../functions'
import Container from '../components/Container';

export default function DivisionLayout() {
  const { division } = useParams();
  const [params, setParams] = useState(division);
  if (division != params) {
    setParams(division);
  }
  const [topics, setTopics] = useState([])

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        fetchDivisionId(division)
        .then((response) => {
          if (response.length > 0) {
            setTopics(response);
          } else {
            setJson({missing: true})
          }
        });
      } catch (e) {
        if (e.name === "AbortError") {
          console.error("Aborted", e);
          return;
        }
        console.error("Error", e);
      }
    };

    fetchAPI();
  }, [params]);

  return (
    <div className="root-layout">
      <header>
        <Container className="bg-green">
          <nav>
            <div className="w3-bar bg-green">
              <span style={{marginLeft: 32}}><i>{proper(division)}:</i></span>

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