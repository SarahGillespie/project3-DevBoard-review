import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ProjectCard from "./ProjectCard";
import ProjectFilter from "./ProjectFilter";
import "./ProjectList.css";

const BACKEND_URL = "http://localhost:5000";

function ProjectList({ onView, onEdit }) {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  function fetchProjects() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.techStack) params.append("techStack", filters.techStack);
    if (filters.category) params.append("category", filters.category);
    fetch(`${BACKEND_URL}/api/projects?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  function handleFilterChange(name, value) {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function handleDelete(id) {
    fetch(`${BACKEND_URL}/api/projects/${id}`, { method: "DELETE" })
      .then(() => fetchProjects())
      .catch((err) => console.error(err));
  }

  return (
    <div className="project-list">
      <ProjectFilter onFilterChange={handleFilterChange} />
      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onView={onView}
            onEdit={onEdit}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}

ProjectList.propTypes = {
  onView: PropTypes.func,
  onEdit: PropTypes.func,
};

export default ProjectList;
