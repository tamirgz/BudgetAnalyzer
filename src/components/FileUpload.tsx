import React, { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (file?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      try {
        setError(null);
        await onFileUpload(file);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process file');
      }
    } else {
      setError('Please upload a valid Excel (.xlsx) file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop your Excel file here, or
          <label className="mx-1 text-blue-500 hover:text-blue-600 cursor-pointer">
            browse
            <input
              type="file"
              className="hidden"
              accept=".xlsx"
              onChange={handleChange}
            />
          </label>
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Make sure your Excel file contains a sheet named "Detailed Transactions"
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};