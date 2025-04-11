import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingProjectName, setEditingProjectName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");

  // Get token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Fetch projects when token changes
  useEffect(() => {
    const fetchProjects = async () => {
      if (!token) return;

      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3008/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects. Please try again.");
        // If token is invalid, remove it
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          setToken("");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  // Add a new project
  const addProject = async () => {
    if (!newProject.trim()) {
      setError("Project name cannot be empty");
      return;
    }

    if (!token) {
      setError("You need to be logged in to add projects");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3008/projects",
        { name: newProject },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProjects([...projects, response.data.project]);
      setNewProject("");
    } catch (error) {
      console.error("Error adding project:", error);
      setError("Failed to add project. Please try again.");
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        setToken("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing a project
  const startEditing = (project) => {
    setEditingProjectId(project.id);
    setEditingProjectName(project.name);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingProjectId(null);
    setEditingProjectName("");
  };

  // Save edited project
  const saveEditing = async () => {
    if (!editingProjectName.trim()) {
      setError("Project name cannot be empty");
      return;
    }

    if (!token) {
      setError("You need to be logged in to edit projects");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await axios.put(
        `http://localhost:3008/projects/${editingProjectId}`,
        { name: editingProjectName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProjects(
        projects.map((project) =>
          project.id === editingProjectId
            ? { ...project, name: editingProjectName }
            : project
        )
      );
      setEditingProjectId(null);
    } catch (error) {
      console.error("Error updating project:", error);
      setError("Failed to update project. Please try again.");
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        setToken("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a project
  const deleteProject = async (projectId) => {
    if (!token) {
      setError("You need to be logged in to delete projects");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await axios.delete(`http://localhost:3008/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects(projects.filter((project) => project.id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
      setError("Failed to delete project. Please try again.");
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        setToken("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If not logged in, show message
  if (!token) {
    return (
      <div className="max-w-4xl mx-auto bg-gradient-to-b from-black via-gray-900 to-gray-900 shadow-xl rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-semibold mb-6 text-green-400">Projects</h1>
        <p className="text-white mb-4">
          You need to be logged in to view projects
        </p>
        <a
          href="/login"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-b from-black via-gray-900 to-gray-900 shadow-xl rounded-2xl p-8">
      <h1 className="text-3xl font-semibold text-center mb-6 text-green-400">
        Projects
      </h1>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-2 bg-red-500 text-white rounded text-center">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="mb-4 text-center text-green-400">Loading...</div>
      )}

      {/* Add Project Form */}
      <div className="flex justify-between gap-8 mb-8">
        <input
          type="text"
          placeholder="Enter project name"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addProject()}
          className="w-full p-3 border-2 border-green-400 rounded-lg bg-gray-800 text-white text-center"
          disabled={isLoading}
        />
        <button
          onClick={addProject}
          disabled={isLoading}
          className={`bg-green-600 hover:bg-green-700 text-white px-6 rounded-lg focus:outline-none mb-4 whitespace-nowrap ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {projects.length === 0 && !isLoading ? (
          <div className="col-span-3 text-center text-gray-400 py-8">
            No projects yet. Add your first project!
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className={`p-4 rounded-lg border-2 ${
                editingProjectId === project.id
                  ? "border-green-500 bg-green-500/10"
                  : "border-gray-600 bg-gray-700/50"
              } transition-all hover:shadow-lg`}
            >
              {editingProjectId === project.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editingProjectName}
                    onChange={(e) => setEditingProjectName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && saveEditing()}
                    className="w-full p-2 border-2 border-green-400 rounded-lg bg-gray-800 text-white"
                    disabled={isLoading}
                    autoFocus
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={saveEditing}
                      disabled={isLoading}
                      className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      disabled={isLoading}
                      className="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white capitalize">
                    {project.name}
                  </h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => startEditing(project)}
                      disabled={isLoading}
                      className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      disabled={isLoading}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;
