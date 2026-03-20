import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import ProjectFilter from "./ProjectFilter";
import Pagination from "./Pagination";
import "./ProjectList.css";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const LIMIT = 10;

function ProjectList({ onView, onEdit }) {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  function fetchProjects() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.techStack) params.append("techStack", filters.techStack);
    if (filters.category) params.append("category", filters.category);
    if (filters.search) params.append("search", filters.search);
    params.append("page", page);
    params.append("limit", LIMIT);
    fetch(`${BACKEND_URL}/api/projects?${params.toString()}`)
      .then((res) => res.json())
      .then((result) => {
        setProjects(result.data);
        setTotal(result.total);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  function handleFilterChange(name, value) {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
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
      <Pagination
        page={page}
        total={total}
        limit={LIMIT}
        onPageChange={setPage}
      />
    </div>
  );
}

export default ProjectList;
