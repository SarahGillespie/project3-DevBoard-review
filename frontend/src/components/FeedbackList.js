import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import RatingSort from "./RatingSort";
import "./FeedbackList.css";

const BACKEND_URL = "http://localhost:5000";

function FeedbackList({ projectId, onEdit }) {
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchFeedback();
  }, [projectId, sortOrder]);

  function fetchFeedback() {
    setLoading(true);
    const url = projectId
      ? `${BACKEND_URL}/api/feedback/project/${projectId}?sort=${sortOrder}`
      : `${BACKEND_URL}/api/feedback?sort=${sortOrder}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setFeedbackItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  function handleDelete(id) {
    fetch(`${BACKEND_URL}/api/feedback/${id}`, { method: "DELETE" })
      .then(() => fetchFeedback())
      .catch((err) => console.error(err));
  }

  function handleSortChange(order) {
    setSortOrder(order);
  }

  if (loading) return <p>Loading feedback...</p>;

  return (
    <div className="feedback-list">
      <div className="feedback-list-header">
        <h3>Feedback ({feedbackItems.length})</h3>
        <RatingSort onSortChange={handleSortChange} />
      </div>
      {feedbackItems.length === 0 ? (
        <p className="feedback-empty">No feedback yet.</p>
      ) : (
        feedbackItems.map((item) => (
          <div key={item._id} className="feedback-item">
            <div className="feedback-item-header">
              <span className="feedback-user">{item.userName}</span>
              <span className="feedback-rating">
                {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
              </span>
            </div>
            <p className="feedback-comment">{item.comment}</p>
            <p className="feedback-date">
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
            <div className="feedback-item-actions">
              <button onClick={() => onEdit(item)}>Edit</button>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

FeedbackList.propTypes = {
  projectId: PropTypes.string,
  onEdit: PropTypes.func,
};

export default FeedbackList;