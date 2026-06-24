import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import { fetchDivisionTopicId, fetchTopicFullId } from '../../fetch';
import { fetchUserItems, fetchUserItems_Add, fetchUserItems_Comment, fetchUserItems_Delete } from '../../fetch';
import { proper } from '../../functions';

import TopicHeader from '../../components/TopicHeader';
import Container from '../../components/Container';
import Table from '../../components/Table.jsx'
import FormMsgInput from '../../components/FormMsgInput';
import FormMsgYesNo from '../../components/FormMsgYesNo';
import UserContext from '../../context/UserContext';

import NotFound from '../NotFound'

export default function Topic({divisionName, topicName}) {
  const { division, topic } = (divisionName && topicName) ? { division: divisionName, topic: topicName } : useParams();
  const [params, setParams] = useState(topic);
  const [json, setJson] = useState(null)
  const [jsonHeading, setJsonHeading] = useState({ missing: false})
  const [bookmarks, setBookmarks] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isComment, setIsComment] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const [bookmarkItem, setBookmarkItem] = useState(null);
  const {user_id} = useContext(UserContext);

  const [error, setError] = useState();

  if (topic != params) {
    setParams(topic);
  }

  // Load basic info about topic
  useEffect(() => {
    setJson(null)
    getHeader();
  }, [params]);

  const getHeader = async () => {
    setIsLoading(true);

    try {
      const response = await fetchDivisionTopicId(division, topic)
      setJsonHeading(response)
      getData(response.id);
    } catch (e) {
      setError(e);
      if (e.name === "AbortError") {
        console.error("Aborted", e);
        setJsonHeading({ missing: true});
        return;
      }

      console.error("Error", e);
    } finally {
      setIsLoading(false);
    }
  };
  const getData = async (topic_id) => {
    if (topic_id == undefined) return
    setIsLoading(true);
    try {
      const response = await fetchTopicFullId(topic_id)
      setJson(response)
      getBookmarks()
    } catch (e) {
      setError(e);
      if (e.name === "AbortError") {
        console.error("Aborted", e);
        setJsonHeading({ missing: true});
        return;
      }
      console.error("Error", e);
    } finally {
      setIsLoading(false);
    }
  };
  const getBookmarks = async () => {
    if (user_id == null) return
    try {
      fetchUserItems(user_id)
        .then((response) => {
          setBookmarks(response);
        });
    } catch (e) {
      setError(e);
      if (e.name === "AbortError") {
        console.error("Aborted", e);
        return;
      }

      console.error("Error", e);
    } finally {}
  }

  function onTableClick(e) {
    try {
      if (e.action == "bookmark") {
        fetchUserItems_Add(user_id, e.id)
          .then((response) => {
            getBookmarks(response);
          });
      } else if (e.action == "comment") {
        setIsComment(true)
        setBookmarkItem(e)
      } else if (e.action == "comment-save") {
        fetchUserItems_Comment(e.user_id, e.id, e.comments)
          .then((response) => {
            getBookmarks(response);
          });
      } else if (e.action == "delete") {
        setIsDelete(true)
        setBookmarkItem(e)
      } else if (e.action == "delete-yes") {
        fetchUserItems_Delete(e.user_id, e.id)
          .then((response) => {
            getBookmarks(response);
          });
      }
    } catch (e) {
      setError(e);
      if (e.name === "AbortError") {
        console.error("Aborted", e);
        return;
      }

      console.error("Error", e);
    } finally {}
  }
  function onBookmarkClose() {
    setIsComment(false)
    setIsDelete(false)
  }
  function onBookmarkSubmit(e) {
    onTableClick({...bookmarkItem, comments: e.text, action: "comment-save"})
    setIsComment(false)
  }
  function onBookmarkRemoveYesNo(result) {
    setIsDelete(false)
    if (result.action) {
      onTableClick({...bookmarkItem, action: "delete-yes"})
    }
  }

  if (error) return (
    // <div>Something went wrong! Please try again.</div>
    <div>{error.message}</div>
  )
  if (isLoading) return (
    <p>Loading</p>
  )
  if (jsonHeading.missing) return <NotFound />
  return (
    <>
      <Container className="bg-green-c2" padding>
        <h2>{proper(topic)}</h2>
      </Container>
      <Container className="bg-green-c4" padding>
        <TopicHeader topic={jsonHeading} className="bg-green-c3" noHeight/>
      </Container>
      <Container className="bg-green-c5" padding noMargin>
        {(json !== null) && (
          <>
            {(isComment) &&
              <FormMsgInput
                className="bg-green-c2"
                title="Set Comment"
                value={bookmarkItem.comments}
                onClose={onBookmarkClose}
                onSubmit={onBookmarkSubmit}
              />
            }
            {(isDelete) &&
              <FormMsgYesNo
                className="bg-blue-c2"
                title="Bookmark"
                message="Do you want to remove this bookmark?"
                onClose={onBookmarkClose}
                onSubmit={onBookmarkRemoveYesNo} />
            }
            <Table
              key={`Table-${topicName}`}
              className="bg-green-c4"
              json={json}
              onClick={onTableClick}
              bookmarks={bookmarks}
              user_id={user_id} />
          </>
        )}
      </Container>
    </>
  );
}