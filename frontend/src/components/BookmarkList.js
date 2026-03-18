import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import BookmarkCard from "./BookmarkCard";
import "./BookmarkList.css";

const BACKEND_URL = "http://localhost:5000";

function BookmarkList({ userName }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, [userName]);

  function fetchBookmarks() {
    setLoading(true);
    const url = userName
      ? `${BACKEND_URL}/api/bookmarks/user/${userName}`
      : `${BACKEND_URL}/api/bookmarks`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setBookmarks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  function handleDelete(id) {
    fetch(`${BACKEND_URL}/api/bookmarks/${id}`, { method: "DELETE" })
      .then(() => fetchBookmarks())
      .catch((err) => console.error(err));
  }

  function handleEdit(id, newNote) {
    fetch(`${BACKEND_URL}/api/bookmarks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: newNote }),
    })
      .then(() => fetchBookmarks())
      .catch((err) => console.error(err));
  }

  if (loading) return <p>Loading bookmarks...</p>;

  return (
    <div className="bookmark-list">
      <h2>My Bookmarks ({bookmarks.length})</h2>
      {bookmarks.length === 0 ? (
        <p className="bookmark-empty">No bookmarks saved yet.</p>
      ) : (
        bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark._id}
            bookmark={bookmark}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}

BookmarkList.propTypes = {
  userName: PropTypes.string,
};

export default BookmarkList;