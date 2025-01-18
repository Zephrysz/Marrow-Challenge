import React from 'react';

interface ProcessingButtonProps {
  isProcessing: boolean;
  selectedFile: File | null;
  onClick: () => void;
}

const ProcessButton: React.FC<ProcessingButtonProps> = ({
  isProcessing,
  selectedFile,
  onClick,
}) => (
    <button
        onClick={onClick}
        className={`w-auto py-2 bg-blue-500 text-white px-4 rounded-md ${
        selectedFile && !isProcessing ? 'hover:bg-blue-600' : 'opacity-50 cursor-not-allowed'
        }`}
        disabled={!selectedFile || isProcessing}
    >
        {isProcessing ? 'Processing...' : 'Process Audio'}
    </button>
);

export default ProcessButton;
