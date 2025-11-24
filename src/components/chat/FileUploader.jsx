import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon, XIcon } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { toast } from 'sonner';
const FileUploader = ({
  onClose
}) => {
  const {
    addUploadedFile
  } = useChat();
  const onDrop = useCallback(acceptedFiles => {
    // Process each file
    acceptedFiles.forEach(file => {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds the 10MB limit`);
        return;
      }
      // Read file content
      const reader = new FileReader();
      reader.onload = () => {
        const fileInfo = {
          name: file.name,
          type: file.type,
          size: file.size,
          content: reader.result
        };
        addUploadedFile(fileInfo);
        toast.success(`${file.name} uploaded successfully`);
      };
      reader.onerror = () => {
        toast.error(`Failed to read file: ${file.name}`);
      };
      if (file.type.startsWith('image/') || file.type === 'application/pdf' || file.type === 'text/plain') {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
    // Close uploader after files are processed
    onClose();
  }, [addUploadedFile, onClose]);
  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 3
  });
  return <div className="relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white z-10">
        <XIcon size={16} />
      </button>
      <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center mb-2">
            <UploadIcon size={20} className="text-blue-400" />
          </div>
          <p className="text-sm text-gray-300 mb-1">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here, or click to select'}
          </p>
          <p className="text-xs text-gray-500">
            Supports PDF, TXT, MD, CSV, JSON, and images (max 10MB)
          </p>
        </div>
      </div>
    </div>;
};
export default FileUploader;