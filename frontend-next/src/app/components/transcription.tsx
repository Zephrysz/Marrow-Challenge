import React, {useState, useEffect} from 'react';
import { ProcessingResult } from '../interfaces';

interface TranscriptionProps {
  processingResult: ProcessingResult | null;
}

const Transcription: React.FC<TranscriptionProps> = ({ processingResult }) => {
    const [selectedVersion, setSelectedVersion] = useState<'original' | 'formatted'>('original');
    useEffect(() => {
        if (!processingResult?.formatted_text) {
          setSelectedVersion('original');
        }
      }, [processingResult]);
    const currentTranscription =
      selectedVersion === 'original' ? processingResult?.text : processingResult?.formatted_text;
    const currentDownloadPath =
      selectedVersion === 'original'
        ? processingResult?.transcription_path
        : processingResult?.formatted_transcription_path;

    return (
    <div className="relative flex flex-col flex-3 bg-neutral-800 box-border h-3/5 rounded">
        <div className="flex lg:absolute top-4 right-4 rounded shadow">
            {currentDownloadPath && (
                <a
                    href={`http://localhost:5000/download/${encodeURIComponent(currentDownloadPath.split('/').pop() || "")}`}
                    download
                    className="pl-2 text-gray-400 hover:text-gray-500 flex items-center mr-4"
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
            <h4 className="text-sm font-semibold bg-neutral-700 px-4 py-2 text-gray-400 w-full rounded-lg">
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
            {/* toggle versions */}
            <div className="flex items-center justify-center ">
                <button
                    onClick={() => setSelectedVersion('original')}
                    className={`text-lg font-semibold ${
                        selectedVersion === 'original' ? 'text-white' : 'text-gray-500'
                    } transition-colors duration-300 pr-2`}
                    >
                Transcription
                </button>
                {(  processingResult?.formatted_transcription_path ) ? (
                <button
                    onClick={() => setSelectedVersion('formatted')}
                    className={`text-lg font-semibold ${
                        selectedVersion === 'formatted' ? 'text-white' : 'text-gray-500'
                    } transition-colors duration-300 pl-2`}
                    >
                Formatted
                </button>) : (null)}
                </div> 
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                {currentTranscription ? (
                    <p className="text-white">
                        {currentTranscription.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </p>
                ) : (
                    <p className="text-gray-400">No transcription available.</p>
                )}
            </div>
        </div>
    </div>
    );
}
export default Transcription;
