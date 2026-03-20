import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import BookmarkCard from "./BookmarkCard";
import Pagination from "./Pagination";
import "./BookmarkList.css";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const LIMIT = 10;

function BookmarkList({ userName }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, page]);

  function fetchBookmarks() {
    setLoading(true);
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", LIMIT);

    const url = userName
      ? `${BACKEND_URL}/api/bookmarks/user/${userName}?${params.toString()}`
      : `${BACKEND_URL}/api/bookmarks?${params.toString()}`;

    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        setBookmarks(result.data);
        setTotal(result.total);
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
      <h2>My Bookmarks ({total})</h2>
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
      <Pagination
        page={page}
        total={total}
        limit={LIMIT}
        onPageChange={setPage}
      />
    </div>
  );
}

BookmarkList.propTypes = {
  userName: PropTypes.string,
};

export default BookmarkList;
