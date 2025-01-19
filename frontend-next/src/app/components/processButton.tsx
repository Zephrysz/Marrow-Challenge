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
        className={`w-auto py-2 bg-blue-700 text-white px-4 rounded-md flex items-center justify-center ${
        selectedFile && !isProcessing ? 'hover:bg-blue-800' : 'opacity-50 cursor-not-allowed'
        }`}
        disabled={!selectedFile || isProcessing}
    >
      {isProcessing && (
        <div className="mr-4 animate-spin w-5 h-5 border-4 border-t-transparent border-white rounded-full" />
      )}
      {isProcessing ? 'Processing...' : 'Process Audio'}
    </button>
    
);

export default ProcessButton;
