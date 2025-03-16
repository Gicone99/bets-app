// pages/Projects.js
import React, { useState, useContext } from "react";
import { ProjectsContext } from "../context/ProjectsContext"; // Importă contextul

const Projects = () => {
  const { projects, setProjects } = useContext(ProjectsContext); // Folosește contextul
  const [newProject, setNewProject] = useState("");

  const addProject = () => {
    if (newProject.trim()) {
      setProjects([
        ...projects,
        { id: Date.now().toString(), name: newProject },
      ]);
      setNewProject("");
    }
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
            className="p-6 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 text-white rounded-lg shadow-xl mb-4"
          >
            <span className="text-xl font-bold">{project.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
