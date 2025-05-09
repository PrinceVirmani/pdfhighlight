"use client";

import React, { useRef } from "react";
import { useAppContext } from "@/context/AppContext";

function LeftSide() {
  // Reference to access the hidden file input element
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { pdfFile, setPdfFile } = useAppContext();

  const handleClick = () => {
    // Programmatically click the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to handle when a file is selected
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile({
        file,
        name: file.name,
        size: file.size,
        lastModified: file.lastModified,
      });
      console.log("PDF selected:", file.name);
    } else {
      alert("Please select a valid PDF file");
      // Reset the input
      event.target.value = "";
    }
  };

  return (
    <div className="w-1/4 border bg-gray-500 text-black h-full rounded-lg">
      <div className="flex flex-col justify-between m-5 items-center bg-amber-400 p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-4">PDF Upload</h2>
        <button
          className="m-2 p-2 rounded-md bg-white border flex h-10 hover:cursor-pointer"
          onClick={handleClick}
        >
          Upload Pdf
        </button>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          style={{ display: "none" }} // Hide this input
        />

        {/* Display the name of the selected file */}
        {pdfFile && (
          <div className="mt-4 p-3 bg-white rounded-md w-full">
            <p className="font-semibold">Selected file:</p>
            <p className="truncate">{pdfFile.name}</p>
            <p className="text-sm text-gray-600">
              {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftSide;
