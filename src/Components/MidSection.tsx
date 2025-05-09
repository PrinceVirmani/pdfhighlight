"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { highlightPlugin, Trigger } from "@/plugins/highlightPlugin";
import "@react-pdf-viewer/core/lib/styles/index.css";

function MidSection() {
  const {
    pdfFile,
    highlights,
    addHighlight,
    setSelectedText,
    setSelectedPosition,
    setSelectedPageNumber,
  } = useAppContext();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (pdfFile) {
      // Create a URL for the PDF file
      const url = URL.createObjectURL(pdfFile.file);
      setPdfUrl(url);

      // Clean up the URL when the component unmounts or when the PDF file changes
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [pdfFile]);

  // Set up the highlight plugin
  const highlightPluginInstance = highlightPlugin({
    highlights,
    trigger: Trigger.Click,
    setSelectedText,
    setSelectedPosition,
    setSelectedPageNumber,
    // We're removing the onAddHighlight function to prevent automatic highlight creation
    // Highlights will only be created when the user clicks the "Save Highlights" button
  });

  return (
    <div className="h-full bg-gray-300 w-2/4 border text-black flex flex-col rounded-2xl overflow-hidden">
      {pdfUrl ? (
        <div className="flex-1 overflow-auto">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={pdfUrl} plugins={[highlightPluginInstance]} />
          </Worker>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-600">
            Please upload a PDF file to view it here
          </p>
        </div>
      )}
    </div>
  );
}

export default MidSection;
