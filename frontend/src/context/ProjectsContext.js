// ProjectsContext.js
import React, { createContext, useState } from "react";

// Creează un context pentru proiecte
export const ProjectsContext = createContext();

// Creează un provider pentru context
export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]); // Starea inițială pentru proiecte

  return (
    <ProjectsContext.Provider value={{ projects, setProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
};
