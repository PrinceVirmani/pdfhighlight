"use client";

import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";

function RightSide() {
  const {
    pdfFile,
    highlights,
    removeHighlight,
    saveHighlights,
    selectedText,
    setSelectedText,
    addHighlight,
    selectedPosition,
    selectedPageNumber,
    setSelectedPosition,
    setSelectedPageNumber,
  } = useAppContext();
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>(
    null
  );

  const handleSaveHighlights = () => {
    // If there's selected text, create a new highlight
    if (selectedText && selectedPosition && selectedPageNumber > 0) {
      // Create a highlight with the selected text and position information
      const highlight = {
        id: `highlight-${Date.now()}`,
        text: selectedText,
        pageNumber: selectedPageNumber,
        position: selectedPosition,
        color: "#ffeb3b",
        createdAt: Date.now(),
      };

      // Add the highlight to the context
      addHighlight(highlight);

      // Clear the selected text and position information
      setSelectedText("");
      setSelectedPosition(null);
      setSelectedPageNumber(0);
    }

    // Save all highlights to localStorage
    saveHighlights();
  };

  const handleDeleteHighlight = (id: string) => {
    removeHighlight(id);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="w-1/4 border bg-gray-500 text-black h-full rounded-lg overflow-hidden">
      <div className="flex flex-col h-full m-5 p-5 bg-amber-400 rounded-lg">
        <h2 className="text-lg font-bold mb-4">Highlights & Actions</h2>

        <div className="flex flex-col gap-2 mb-6">
          <div className="flex flex-col">
            <button
              className="p-2 rounded-md bg-white border flex h-10 hover:cursor-pointer w-full items-center justify-center"
              onClick={handleSaveHighlights}
              disabled={!pdfFile || (!selectedText && highlights.length === 0)}
            >
              Save Highlights
            </button>

            {/* Display selected text that will be highlighted */}
            {selectedText && (
              <div className="mt-2 p-2 bg-white rounded-md">
                <p className="text-xs font-semibold">Selected text:</p>
                <p className="text-sm italic">{selectedText}</p>
              </div>
            )}
          </div>

          <button
            className="p-2 rounded-md bg-white border flex h-10 hover:cursor-pointer w-full items-center justify-center"
            disabled={!pdfFile}
          >
            Download PDF
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <h3 className="font-semibold mb-2">Saved Highlights</h3>

          {highlights.length === 0 ? (
            <div className="bg-white p-3 rounded-md text-gray-600">
              No highlights yet. Select text in the PDF to highlight it.
            </div>
          ) : (
            <div className="space-y-2">
              {highlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className={`bg-white p-3 rounded-md cursor-pointer ${
                    selectedHighlight === highlight.id
                      ? "border-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedHighlight(
                      selectedHighlight === highlight.id ? null : highlight.id
                    )
                  }
                >
                  <div className="flex justify-between items-start">
                    <div
                      className="w-4 h-4 rounded-full mt-1 mr-2 flex-shrink-0"
                      style={{ backgroundColor: highlight.color }}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 line-clamp-2">
                        {highlight.text}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Page {highlight.pageNumber} •{" "}
                        {formatDate(highlight.createdAt)}
                      </p>
                    </div>
                    <button
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteHighlight(highlight.id);
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  {selectedHighlight === highlight.id && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-sm">{highlight.text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RightSide;
