"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface LocationContextType {
  selectedSchool: string;
  setSelectedSchool: (school: string) => void;
  selectedCampus: string;
  setSelectedCampus: (campus: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSchool, setSelectedSchool] = useState("HUTECH");
  const [selectedCampus, setSelectedCampus] = useState("");

  const handleSetSelectedSchool = (school: string) => {
    setSelectedSchool(school);
  };

  const handleSetSelectedCampus = (campus: string) => {
    setSelectedCampus(campus);
  };

  return (
    <LocationContext.Provider
      value={{
        selectedSchool,
        setSelectedSchool: handleSetSelectedSchool,
        selectedCampus,
        setSelectedCampus: handleSetSelectedCampus,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
