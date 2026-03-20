import React, { useState } from "react";
import PropTypes from "prop-types";
import "./FeedbackForm.css";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function FeedbackForm({ feedback, projectId, onSave, onCancel }) {
  const [userName, setUserName] = useState(feedback ? feedback.userName : "");
  const [rating, setRating] = useState(feedback ? feedback.rating : "");
  const [comment, setComment] = useState(feedback ? feedback.comment : "");

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      projectId,
      userName,
      rating: Number(rating),
      comment,
    };

    const url = feedback
      ? `${BACKEND_URL}/api/feedback/${feedback._id}`
      : `${BACKEND_URL}/api/feedback`;
    const method = feedback ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => onSave())
      .catch((err) => console.error(err));
  }

  return (
    <div className="feedback-form">
      <h2>{feedback ? "Edit Feedback" : "Add Feedback"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        >
          <option value="">Select Rating</option>
          <option value="1">1 - Poor</option>
          <option value="2">2 - Fair</option>
          <option value="3">3 - Good</option>
          <option value="4">4 - Very Good</option>
          <option value="5">5 - Excellent</option>
        </select>
        <textarea
          placeholder="Your feedback comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <div className="feedback-form-buttons">
          <button type="submit">{feedback ? "Update" : "Submit"}</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

FeedbackForm.propTypes = {
  feedback: PropTypes.shape({
    _id: PropTypes.string,
    userName: PropTypes.string,
    rating: PropTypes.number,
    comment: PropTypes.string,
  }),
  projectId: PropTypes.string,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};

export default FeedbackForm;
