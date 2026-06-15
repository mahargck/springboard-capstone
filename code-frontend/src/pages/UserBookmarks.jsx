import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import Container from '../components/Container';
import FormMsgInput from '../components/FormMsgInput';
import FormMsgYesNo from '../components/FormMsgYesNo';
import UserContext from '../context/UserContext';
import { proper,
  fetchUserBookmarks, fetchUserItems_Comment, fetchUserItems_Delete } from '../functions';
import "../components/Table.css"


export default function UserBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const {user_id} = useContext(UserContext);

  const [isComment, setIsComment] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [bookmarkItem, setBookmarkItem] = useState(null);
    
  useEffect(() => {
    // setJson(null)
    getBookmarks();
  }, []);

  const getBookmarks = async () => {
    if (user_id == null) return
    try {
      fetchUserBookmarks(user_id)
      .then((response) => {
        setBookmarks(response);
      });
    } catch (e) {
      if (e.name === "AbortError") {
        console.lerrorog("Aborted", e);
        return;
      }
      
      console.error("Error", e);
      setError(e);
    } finally {
    }
  }
  const bookmarkTree = () => {
    const result = []
    let objDivision = null
    let objTopic = null

    for( let b of bookmarks) {
      if (objDivision == null || b.division != objDivision.name) {
        objDivision = {
          name: b.division,
          topics: []
        }
        objTopic = null
        result.push(objDivision);
      }
      if (objTopic == null || b.topic != objTopic.name) {
        objTopic = {
          name: b.topic,
          data: []
        }
        objDivision.topics.push(objTopic);
      }
      objTopic.data.push(b);
    }
    return result
  }
  function onBookmarkRemove(obj) {
    setIsDelete(true)
    setBookmarkItem(obj)
  }
  function onBookmarkEdit(obj) {
    setIsComment(true)
    setBookmarkItem(obj)
  }
  function onBookmarkClose() {
    setIsComment(false)
    setIsDelete(false)
  }
  function onBookmarkRemoveYesNo(result) {
    setIsComment(false)
    setIsDelete(false)
    if (result.action == true) {
      fetchUserItems_Delete(bookmarkItem.user_id, bookmarkItem.id)
        .then((response) => {
            getBookmarks(response);
        });
    }
  }
  function onBookmarkSubmit(e) {
    setIsComment(false)
    fetchUserItems_Comment(bookmarkItem.user_id, bookmarkItem.id, e.text)
      .then((response) => {
          getBookmarks(response);
      });
  }
  return (
    <>
      <Container className="bg-blue-2" padding>
        <h2>Bookmarks</h2>
      </Container>
      <Container className="bg-blue-3" padding>
        <p>Items listed here are the bookmarks you have selected and the comments with each</p>
      </Container>
      <Container className="bg-blue-4" padding>
        {(bookmarks.length == 0) && (
          <div>No bookmarks found.</div>
        )}
        {(isComment) && 
            <FormMsgInput
                className="bg-blue-2"
                title="Set Comment"
                value={bookmarkItem.comments}
                onClose={onBookmarkClose}
                onSubmit={onBookmarkSubmit}
            />
        }
        {(isDelete) && 
            <FormMsgYesNo
                className="bg-blue-2"
                title="Bookmark"
                message="Do you want to remove this bookmark?"
                onClose={onBookmarkClose}
                onSubmit={onBookmarkRemoveYesNo}
            />
        }
        {bookmarkTree().map((div, divIdx) => (
          <div key={`bookmark-div-${div.name}`}>
            <h2>{proper(div.name)}</h2>
            {div.topics.map((topic, topicIdx) => (
              <div key={`bookmark-topic-${topic.name}`}>
                <h3>{proper(topic.name)}</h3>
                <table className="table__content bg-blue c5"
                  style={{width: "100%"}}>
                    <colgroup>
                    <col style={{width: "128px"}} />
                    <col style={{width: "auto"}} />
                    <col style={{width: "64px"}} />
                    </colgroup>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Comment</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                  {topic.data.map((b, bIdx) => (
                    <tr key={`bookmark-data-${b.name}`}>
                      <td>{b.name}</td>
                      <td>
                        <span className="material-symbols-outlined pointer"
                          onClick={() => onBookmarkEdit(b)}>
                          edit
                        </span>
                        {b.comments}
                      </td>
                      <td>
                        <Link className="bg-transparent" to={`../${div.name}/${topic.name}`}>
                            <span className="material-symbols-outlined fg-blue-2">
                              link
                            </span>
                        </Link>
                        <span className="material-symbols-outlined pointer"
                          onClick={() => onBookmarkRemove(b)}>
                          delete
                        </span>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ))}
      </Container>
    </>
  );
}

