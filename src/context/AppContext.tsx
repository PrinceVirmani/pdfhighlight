"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

interface PDFFile {
  file: File;
  name: string;
  size: number;
  lastModified: number;
}

interface Highlight {
  id: string;
  text: string;
  pageNumber: number;
  position: {
    boundingRect: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
      height: number;
    };
    rects: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
      height: number;
    }>;
  };
  comment?: string;
  color: string;
  createdAt: number;
}

interface AppContextType {
  pdfFile: PDFFile | null;
  setPdfFile: (file: PDFFile | null) => void;
  highlights: Highlight[];
  addHighlight: (highlight: Highlight) => void;
  removeHighlight: (id: string) => void;
  updateHighlight: (id: string, highlight: Partial<Highlight>) => void;
  saveHighlights: () => void;
  selectedText: string;
  setSelectedText: (text: string) => void;
  selectedPosition: any | null;
  setSelectedPosition: (position: any | null) => void;
  selectedPageNumber: number;
  setSelectedPageNumber: (pageNumber: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pdfFile, setPdfFile] = useState<PDFFile | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectedText, setSelectedText] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<any | null>(null);
  const [selectedPageNumber, setSelectedPageNumber] = useState<number>(0);

  // Load highlights from localStorage on component mount
  React.useEffect(() => {
    const savedHighlights = localStorage.getItem("pdfHighlights");
    if (savedHighlights) {
      try {
        setHighlights(JSON.parse(savedHighlights));
      } catch (error) {
        console.error("Failed to parse saved highlights:", error);
      }
    }
  }, []);

  const addHighlight = (highlight: Highlight) => {
    setHighlights((prevHighlights) => [...prevHighlights, highlight]);
  };

  const removeHighlight = (id: string) => {
    setHighlights((prevHighlights) =>
      prevHighlights.filter((highlight) => highlight.id !== id)
    );
  };

  const updateHighlight = (
    id: string,
    updatedHighlight: Partial<Highlight>
  ) => {
    setHighlights((prevHighlights) =>
      prevHighlights.map((highlight) =>
        highlight.id === id ? { ...highlight, ...updatedHighlight } : highlight
      )
    );
  };

  const saveHighlights = () => {
    localStorage.setItem("pdfHighlights", JSON.stringify(highlights));
  };

  return (
    <AppContext.Provider
      value={{
        pdfFile,
        setPdfFile,
        highlights,
        addHighlight,
        removeHighlight,
        updateHighlight,
        saveHighlights,
        selectedText,
        setSelectedText,
        selectedPosition,
        setSelectedPosition,
        selectedPageNumber,
        setSelectedPageNumber,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
