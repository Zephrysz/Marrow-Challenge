import React from 'react';

interface ProcessingButtonProps {
  transcriptExists: boolean;
  isSummarizing: boolean;
  onClick: () => void;
}

const FetchSummaryButton: React.FC<ProcessingButtonProps> = ({
  transcriptExists,
  onClick,
  isSummarizing
}) => {
  if (!transcriptExists) return null;

  return (
    <button
      onClick={onClick}
      className={`w-auto py-2 bg-blue-700 text-white px-4 rounded-md flex items-center justify-center ${
        !isSummarizing ? 'hover:bg-blue-800' : 'opacity-50 cursor-not-allowed'
      }`}
      disabled={!transcriptExists}
    >
      {isSummarizing && (
        <div className="mr-4 animate-spin w-5 h-5 border-4 border-t-transparent border-white rounded-full" />
      )}
      {isSummarizing ? 'Creating...' : 'Create Summary'}
    </button>
  );
};

export default FetchSummaryButton;