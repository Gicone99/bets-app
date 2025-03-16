import React, { useState, useContext } from "react";
import { ProjectsContext } from "../context/ProjectsContext"; // Importă contextul

const Projects = () => {
  const { projects, setProjects } = useContext(ProjectsContext);
  const [newProject, setNewProject] = useState("");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingProjectName, setEditingProjectName] = useState("");

  // Adaugă un proiect nou
  const addProject = () => {
    if (newProject.trim()) {
      setProjects([
        ...projects,
        { id: Date.now().toString(), name: newProject },
      ]);
      setNewProject("");
    }
  };

  // Începe editarea unui proiect
  const startEditing = (project) => {
    setEditingProjectId(project.id);
    setEditingProjectName(project.name);
  };

  // Salvează modificările la un proiect
  const saveEditing = () => {
    if (editingProjectName.trim()) {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === editingProjectId
            ? { ...project, name: editingProjectName }
            : project
        )
      );
      setEditingProjectId(null); // Încheie editarea
      setEditingProjectName("");
    }
  };

  // Șterge un proiect
  const deleteProject = (projectId) => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== projectId)
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-b from-black via-gray-900 to-gray-900 shadow-xl rounded-2xl p-8">
      <h1 className="text-3xl font-semibold text-center mb-6 text-green-400">
        Projects
      </h1>
      <div className="flex justify-between gap-8">
        <input
          type="text"
          placeholder="Enter project name"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          className="w-full p-3 mb-4 border-2 border-green-400 rounded-lg bg-gray-800 text-white text-center"
        />
        <button
          onClick={addProject}
          className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-lg focus:outline-none mb-4 whitespace-nowrap"
        >
          Add Project
        </button>
      </div>
      <div className="mt-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-6 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 text-white rounded-lg shadow-xl mb-4 flex justify-between items-center"
          >
            {editingProjectId === project.id ? (
              // Modul de editare
              <input
                type="text"
                value={editingProjectName}
                onChange={(e) => setEditingProjectName(e.target.value)}
                className="w-full p-3 border-2 border-green-400 rounded-lg bg-gray-800 text-white text-center"
              />
            ) : (
              // Modul de afișare
              <span className="text-xl font-bold">{project.name}</span>
            )}
            <div className="flex space-x-4">
              {editingProjectId === project.id ? (
                // Butonul de salvare în timpul editării
                <button
                  onClick={saveEditing}
                  className="text-green-600 hover:text-green-800"
                >
                  Save
                </button>
              ) : (
                // Butonul de editare
                <button
                  onClick={() => startEditing(project)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              )}
              {/* Butonul de ștergere */}
              <button
                onClick={() => deleteProject(project.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
