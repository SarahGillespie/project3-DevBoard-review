import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import RatingSort from "./RatingSort";
import Pagination from "./Pagination";
import "./FeedbackList.css";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const LIMIT = 10;

function FeedbackList({ projectId, onEdit }) {
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [projectTitles, setProjectTitles] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("recent");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, sortOrder, page]);

  function fetchFeedback() {
    setLoading(true);
    const params = new URLSearchParams();
    if (sortOrder !== "recent") params.append("sort", sortOrder);
    params.append("page", page);
    params.append("limit", LIMIT);

    const base = projectId
      ? `${BACKEND_URL}/api/feedback/project/${projectId}`
      : `${BACKEND_URL}/api/feedback`;

    fetch(`${base}?${params.toString()}`)
      .then((res) => res.json())
      .then((result) => {
        setFeedbackItems(result.data);
        setTotal(result.total);
        fetchProjectTitles(result.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  function fetchProjectTitles(items) {
    const uniqueProjectIds = [...new Set(items.map((item) => item.projectId))];
    uniqueProjectIds.forEach((pid) => {
      if (pid && !projectTitles[pid]) {
        fetch(`${BACKEND_URL}/api/projects/${pid}`)
          .then((res) => res.json())
          .then((project) => {
            setProjectTitles((prev) => ({
              ...prev,
              [pid]: project.title || "Unknown Project",
            }));
          })
          .catch(() => {
            setProjectTitles((prev) => ({
              ...prev,
              [pid]: "Unknown Project",
            }));
          });
      }
    });
  }

  function handleDelete(id) {
    fetch(`${BACKEND_URL}/api/feedback/${id}`, { method: "DELETE" })
      .then(() => fetchFeedback())
      .catch((err) => console.error(err));
  }

  function handleSortChange(order) {
    setSortOrder(order);
    setPage(1);
  }

  if (loading) return <p>Loading feedback...</p>;

  return (
    <div className="feedback-list">
      <div className="feedback-list-header">
        <h3>Feedback ({total})</h3>
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
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </span>
            </div>
            {!projectId && (
              <p className="feedback-project">
                Project: {projectTitles[item.projectId] || "Loading..."}
              </p>
            )}
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
      <Pagination
        page={page}
        total={total}
        limit={LIMIT}
        onPageChange={setPage}
      />
    </div>
  );
}

FeedbackList.propTypes = {
  projectId: PropTypes.string,
  onEdit: PropTypes.func,
};

export default FeedbackList;
