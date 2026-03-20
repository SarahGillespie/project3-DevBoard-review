import React, { useState } from "react";
import PropTypes from "prop-types";
import "./ProjectForm.css";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function ProjectForm({ project, onSave, onCancel }) {
  const [title, setTitle] = useState(project ? project.title : "");
  const [description, setDescription] = useState(
    project ? project.description : "",
  );
  const [techStack, setTechStack] = useState(
    project ? project.techStack.join(", ") : "",
  );
  const [category, setCategory] = useState(project ? project.category : "");
  const [githubLink, setGithubLink] = useState(
    project ? project.githubLink : "",
  );
  const [demoURL, setDemoURL] = useState(project ? project.demoURL : "");
  const [authorName, setAuthorName] = useState(
    project ? project.authorName : "",
  );

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      title,
      description,
      techStack: techStack.split(",").map((t) => t.trim()),
      category,
      githubLink,
      demoURL,
      authorName,
    };

    const url = project
      ? `${BACKEND_URL}/api/projects/${project._id}`
      : `${BACKEND_URL}/api/projects`;
    const method = project ? "PUT" : "POST";

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
    <div className="project-form">
      <h2>{project ? "Edit Project" : "Add Project"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Tech Stack (comma separated e.g. React, Node, MongoDB)"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="Web">Web</option>
          <option value="Mobile">Mobile</option>
          <option value="AI">AI</option>
          <option value="DevTools">DevTools</option>
          <option value="Game">Game</option>
          <option value="Data">Data</option>
        </select>
        <input
          type="text"
          placeholder="GitHub Link"
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
        />
        <input
          type="text"
          placeholder="Demo URL"
          value={demoURL}
          onChange={(e) => setDemoURL(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author Name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
        />
        <div className="form-buttons">
          <button type="submit">{project ? "Update" : "Create"}</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

ProjectForm.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    techStack: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string,
    githubLink: PropTypes.string,
    demoURL: PropTypes.string,
    authorName: PropTypes.string,
  }),
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};

export default ProjectForm;
