import React from 'react';
interface FileUploadProps {
  selectedFile: File | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ selectedFile, onFileChange }) => (
    <label className="flex items-center cursor-pointer border border-gray-700 rounded-md bg-neutral-900 hover:bg-neutral-800">
        <img
        className="w-8 h-8 m-2"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABCUlEQVR4nO2VMWrDQBBFp8gRQhoFV5a0pM0Zci/fRAK7CcJd0gXcRfKALxFIZ4OdA+gbxZ1A3nU1A/4Pfv/f7OyuCCGEEDICS3lGJQ1q+UMtSEolC3FTvpZDcnFvErhM/vbyXiRwy9p4lMBQYPUAfGVAVwAabNMVPTazX3w+vaUJDOXb3L64jtLmPT4eX+MCw+Sty+pENrOfuICHtdGpUyj6uIB1Sb0eCoAnELhCV7FeEfASq/2UwWdU7ScNfmTqMxLDuiAooPZTBldI7ScNXmL1GbmHZ/RkXRJT2YZjXGBbrh0LNAkCoYCWe/OyOk55wO5lHhX4l/jOM2h4d7JOp2HyyeUJIYTcFWcLXG7i+rfwxwAAAABJRU5ErkJggg=="
        alt="File Upload Icon"
        />
        <span className="text-white text-sm font-medium truncate">
        {`${selectedFile ? selectedFile.name : "Select File"}`}
        </span>
        <input type="file" name="file" accept="audio/*" onChange={onFileChange} className="hidden" />
    </label>
);

export default FileUpload;
