import React, { useState } from "react";
import PropTypes from "prop-types";
import "./BookmarkCard.css";

function BookmarkCard({ bookmark, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(bookmark.note || "");

  function handleSave() {
    onEdit(bookmark._id, note);
    setIsEditing(false);
  }

  return (
    <div className="bookmark-card">
      <div className="bookmark-card-header">
        <span className="bookmark-project">Project: {bookmark.projectId}</span>
        <span className="bookmark-user">by {bookmark.userName}</span>
      </div>
      {isEditing ? (
        <div className="bookmark-edit">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Edit your note"
          />
          <div className="bookmark-edit-actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <p className="bookmark-note">{bookmark.note || "No note added"}</p>
      )}
      <p className="bookmark-date">
        {new Date(bookmark.createdAt).toLocaleDateString()}
      </p>
      <div className="bookmark-card-actions">
        <button onClick={() => setIsEditing(true)}>Edit Note</button>
        <button onClick={() => onDelete(bookmark._id)}>Delete</button>
      </div>
    </div>
  );
}

BookmarkCard.propTypes = {
  bookmark: PropTypes.shape({
    _id: PropTypes.string,
    projectId: PropTypes.string,
    userName: PropTypes.string,
    note: PropTypes.string,
    createdAt: PropTypes.string,
  }),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default BookmarkCard;