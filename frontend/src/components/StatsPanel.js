import React, { useState, useEffect } from "react";
import "./StatsPanel.css";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function StatsPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/projects/stats`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading stats...</p>;
  if (!stats) return <p>No stats available.</p>;

  return (
    <div className="stats-panel">
      <h2>Community Stats</h2>
      <div className="stats-section">
        <h3>Top Tech Stacks</h3>
        <ul>
          {Object.entries(stats.techStackCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([tech, count]) => (
              <li key={tech}>
                {tech}: {count} projects
              </li>
            ))}
        </ul>
      </div>
      <div className="stats-section">
        <h3>Top Categories</h3>
        <ul>
          {Object.entries(stats.categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([category, count]) => (
              <li key={category}>
                {category}: {count} projects
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default StatsPanel;
