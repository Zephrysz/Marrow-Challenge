import React, {useState} from 'react';
import { ProcessingResult } from '../interfaces';

interface TranscriptionProps {
  processingResult: ProcessingResult | null;
}

const Transcription: React.FC<TranscriptionProps> = ({ processingResult }) => (
    <div className="relative flex flex-col bg-neutral-800 h-3/5 rounded">
        <div className="sm:absolute top-4 right-4 bg-neutral-700 px-4 py-2 rounded shadow">
            <h4 className="text-sm font-semibold text-gray-400">
                Overall Sentiment:{" "}
                <span
                className={`font-bold ${
                    processingResult?.overall_sentiment === "positive" 
                    ? "text-green-500"
                    : processingResult?.overall_sentiment === "negative"
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
                >
                {processingResult?.overall_sentiment || "N/A"}
                </span>
            </h4>
        </div>

    <div className="flex flex-col flex-1 overflow-hidden rounded">
        <div className="flex p-4">
            <h3 className="text-lg font-semibold">Transcription Result</h3>
            {processingResult?.transcription_path && (
            <a
                href={`http://localhost:5000/download/${encodeURIComponent(processingResult.transcription_path.split('/').pop() || "")}`}
                download
                className="pl-2 text-gray-400 hover:text-gray-500 flex items-center"
            >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-1"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5v-13m0 13l-3.75-3.75m3.75 3.75l3.75-3.75M19.5 19.5H4.5"
                />
                </svg>
                Download
            </a>
            )}
        </div>
        <div className="flex-1 overflow-y-auto p-4">
            {processingResult ? (
            <p className="text-white">{processingResult.text}</p>
            ) : (
            <p className="text-gray-400">No transcription available.</p>
            )}
        </div>
        </div>

  </div>
);

export default Transcription;
