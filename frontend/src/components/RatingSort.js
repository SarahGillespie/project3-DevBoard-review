import React from "react";
import PropTypes from "prop-types";
import "./RatingSort.css";

function RatingSort({ onSortChange }) {
  function handleChange(e) {
    onSortChange(e.target.value);
  }

  return (
    <div className="rating-sort">
      <select onChange={handleChange} defaultValue="desc">
        <option value="desc">Highest Rating</option>
        <option value="asc">Lowest Rating</option>
      </select>
    </div>
  );
}

RatingSort.propTypes = {
  onSortChange: PropTypes.func,
};

export default RatingSort;
