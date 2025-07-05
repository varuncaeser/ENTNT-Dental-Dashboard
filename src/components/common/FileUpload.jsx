// src/components/common/FileUpload.jsx
import React, { useState, useRef } from 'react';

const FileUpload = ({ onFilesChange, existingFiles = [] }) => {
  const [selectedFiles, setSelectedFiles] = useState(existingFiles);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newFilesData = [];
    let filesProcessed = 0;

    if (files.length === 0) {
      // If no new files selected, and there are existing files, don't clear them
      // If no new files selected and no existing files, then clear if any were there previously
      if (selectedFiles.length > 0 && !existingFiles.length) {
         setSelectedFiles([]);
         onFilesChange([]);
      }
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newFilesData.push({
          name: file.name,
          url: e.target.result, // Base64 string or data URL
          type: file.type,
        });
        filesProcessed++;
        if (filesProcessed === files.length) {
          const updatedFiles = [...selectedFiles, ...newFilesData];
          setSelectedFiles(updatedFiles);
          onFilesChange(updatedFiles);
        }
      };
      reader.readAsDataURL(file); // Convert file to Base64
    });
  };

  const handleRemoveFile = (fileNameToRemove) => {
    const updatedFiles = selectedFiles.filter(file => file.name !== fileNameToRemove);
    setSelectedFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  return (
    <div className="border border-gray-300 p-4 rounded-md bg-gray-50">
      <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
        Attach Files (Invoices, X-Rays, etc.)
      </label>
      <input
        id="file-upload"
        type="file"
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        ref={fileInputRef}
      />
      <p className="mt-2 text-sm text-gray-500">Max 5 files. Each file up to 2MB.</p>

      {selectedFiles.length > 0 && (
        <div className="mt-4 border-t pt-4 border-gray-200">
          <h4 className="text-md font-semibold text-gray-700 mb-2">Attached Files:</h4>
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => (
              <li key={file.name + index} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm border border-gray-200">
                <span className="text-blue-700 flex-grow truncate mr-4">
                  {/* Provide a clickable link for download/preview if it's a data URL */}
                  {file.url ? (
                    <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {file.name}
                    </a>
                  ) : (
                    file.name
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(file.name)}
                  className="text-red-600 hover:text-red-800 focus:outline-none"
                  title="Remove file"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;