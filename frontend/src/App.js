import React, { useState } from "react";
import { useUser } from "./context/UserContext";
import ProjectList from "./components/ProjectList";
import ProjectForm from "./components/ProjectForm";
import ProjectDetail from "./components/ProjectDetail";
import StatsPanel from "./components/StatsPanel";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";
import BookmarkList from "./components/BookmarkList";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function App() {
  const { user, loading, logout } = useUser();
  const [view, setView] = useState("list");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [authView, setAuthView] = useState("login");
  const [showDropdown, setShowDropdown] = useState(false);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>DevBoard</h1>
        </header>
        {authView === "login" ? (
          <Login onSwitchToRegister={() => setAuthView("register")} />
        ) : (
          <Register onSwitchToLogin={() => setAuthView("login")} />
        )}
      </div>
    );
  }

  function handleView(project) {
    setSelectedProject(project);
    setView("detail");
  }

  function handleEdit(project) {
    setSelectedProject(project);
    setView("form");
  }

  function handleSave() {
    setSelectedProject(null);
    setView("list");
  }

  function handleCancel() {
    setSelectedProject(null);
    setSelectedFeedback(null);
    setView("list");
  }

  function handleAddFeedback() {
    setSelectedFeedback(null);
    setView("feedbackForm");
  }

  function handleEditFeedback(feedback) {
    setSelectedFeedback(feedback);
    setView("feedbackForm");
  }

  function handleFeedbackSave() {
    setSelectedFeedback(null);
    setView("feedback");
  }

  function handleBookmark(projectId) {
    const note = prompt("Add a note (optional):") || "";
    fetch(`${BACKEND_URL}/api/bookmarks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ projectId, userName: user.username, note }),
    })
      .then((res) => res.json())
      .then(() => alert("Bookmark added!"))
      .catch((err) => console.error(err));
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>DevBoard</h1>
        <nav>
          <button onClick={() => setView("list")}>Projects</button>
          <button
            onClick={() => {
              setSelectedProject(null);
              setView("form");
            }}
          >
            Add Project
          </button>
          <button onClick={() => setView("stats")}>Stats</button>
          <button onClick={() => setView("feedback")}>Feedback</button>
          <button onClick={() => setView("bookmarks")}>Bookmarks</button>
          <div className="app-user-menu">
            <button
              className="app-user-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {user.displayName} ▾
            </button>
            {showDropdown && (
              <div className="app-user-dropdown">
                <button
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      <div className="app-instructions">
        <p>
          <strong>How to use:</strong> Browse projects using filters, click View
          to see details, Add Project to create a new one, and Stats to explore
          community trends. Use Feedback to view and leave ratings on projects,
          and Bookmarks to save projects for later.
        </p>
      </div>

      <main className="app-main">
        {view === "list" && (
          <ProjectList onView={handleView} onEdit={handleEdit} />
        )}
        {view === "form" && (
          <ProjectForm
            project={selectedProject}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
        {view === "detail" && selectedProject && (
          <div>
            <ProjectDetail
              project={selectedProject}
              onBack={() => setView("list")}
            />
            <div className="detail-actions">
              <button
                onClick={() => handleBookmark(selectedProject._id)}
                className="detail-bookmark-btn"
              >
                Bookmark This Project
              </button>
              <button
                onClick={handleAddFeedback}
                className="detail-feedback-btn"
              >
                Add Feedback
              </button>
            </div>
            <FeedbackList
              projectId={selectedProject._id}
              onEdit={handleEditFeedback}
            />
          </div>
        )}
        {view === "stats" && <StatsPanel />}
        {view === "feedback" && (
          <div>
            <div className="feedback-view-header">
              <h2>All Feedback</h2>
              <button onClick={handleAddFeedback}>Add Feedback</button>
            </div>
            <FeedbackList onEdit={handleEditFeedback} />
          </div>
        )}
        {view === "feedbackForm" && (
          <FeedbackForm
            feedback={selectedFeedback}
            projectId={
              selectedFeedback
                ? selectedFeedback.projectId
                : selectedProject
                  ? selectedProject._id
                  : ""
            }
            onSave={handleFeedbackSave}
            onCancel={() => setView(selectedProject ? "detail" : "feedback")}
          />
        )}
        {view === "bookmarks" && <BookmarkList userName={user.username} />}
      </main>
    </div>
  );
}

export default App;
