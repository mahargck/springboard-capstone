import { useParams } from "react-router-dom";
import { use, useState } from 'react'

import { fetchDivisionId, proper } from '../functions';
import { useEffect } from "react";
import Container from '../components/Container';
import TopicHeader from '../components/TopicHeader';

import NotFound from './NotFound'

export default function TopicDivision() {
  const { division } = useParams();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [json, setJson] = useState({ missing: false})
  const [params, setParams] = useState(division);

  if (division != params) {
    setParams(division);
  }

  useEffect(() => {
    const fetchAPI = async () => {
      setIsLoading(true);

      try {
        fetchDivisionId(division)
        .then((response) => {
          if (response.length > 0) {
            setJson(response)
          } else {
            setJson({missing: true})
          }
        });
      } catch (e) {
        if (e.name === "AbortError") {
          console.error("Aborted", e);
          setJson({ missing: true});
          return;
        }
        
        console.error("Error", e);
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAPI();
  }, [params]);

  if (error) return (
    <div>Something went wrong! Please try again.</div>
  )
  if (isLoading) return (
    <p>Loading</p>
  )
  if (json.missing) return <NotFound />

  function getSection() {
    const result = [];
    if (Array.isArray(json)){
      for (let sc of json) {
        if (!result.includes(sc.section)) result.push(sc.section)
      }
    }
    return result;
  }
  return (
    <>
      <Container className="bg-green-2" padding>
        <h2>{proper(division)}</h2>
      </Container>
      {getSection().map((section) => (
        <div key={section}>
          <Container className="bg-green-4" padding>
            <h3>{section}</h3>
          </Container>
          <Container className="bg-green-5">
            <div className="w3-row">
              {json.filter((item) => item.section==section).map((topic) => (
                <div key={topic.name} className="w3-col m6 l4">
                  <TopicHeader topic={topic} link />
                </div>
              ))}
            </div>
          </Container>
        </div>
      ))}
    </>
  );
}