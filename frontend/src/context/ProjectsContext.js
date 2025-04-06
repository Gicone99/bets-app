// ProjectsContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token || !user) return;

      const response = await axios.get("http://localhost:3008/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(response.data.projects || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects");
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch projects when user changes
  useEffect(() => {
    fetchProjects();
  }, [user]);

  // Salvare proiecte în localStorage la fiecare modificare
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem("projects", JSON.stringify(projects));
    }
  }, [projects]);

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        setProjects,
        fetchProjects,
        isLoading,
        error,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};
