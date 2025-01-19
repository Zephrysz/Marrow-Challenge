import React, { useState } from 'react';
import { SentimentAnalysisItem } from '../interfaces';

interface AnalysisProps {
  sentimentAnalysis: SentimentAnalysisItem[] | undefined;
  summary: string | null;
}

const Analysis: React.FC<AnalysisProps> = ({ sentimentAnalysis, summary }) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<'sentiment' | 'summary'>('sentiment');

  return (
    <div className="relative flex flex-col bg-neutral-800 rounded overflow-hidden h-2/5 mt-4">
      <div className="flex p-4">
        {/* Toggle buttons for sentiment or summary */}
        <div className="flex items-center">
          <button
            onClick={() => setSelectedAnalysis('sentiment')}
            className={`text-lg font-semibold ${selectedAnalysis === 'sentiment' ? 'text-white' : 'text-gray-500'} transition-colors duration-300 pr-2`}
          >
            Sentiment
          </button>
          {summary && (
            <button
              onClick={() => setSelectedAnalysis('summary')}
              className={`text-lg font-semibold ${selectedAnalysis === 'summary' ? 'text-white' : 'text-gray-500'} transition-colors duration-300 pl-2`}
            >
              Summary
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {selectedAnalysis === 'sentiment' ? (
          sentimentAnalysis?.some(
            (item) =>
              !["positive", "very positive", "neutral"].includes(item.sentiment.trim().toLowerCase())
          ) ? (
            sentimentAnalysis
              .filter(
                (item) =>
                  !["positive", "very positive", "neutral"].includes(item.sentiment.trim().toLowerCase())
              )
              .map((item, index) => (
                <p key={index} className="m-2 p-2 bg-red-600 rounded">
                  {item.phrase} — {item.sentiment} ({item.score.toFixed(2)})
                </p>
              ))
          ) : (
            <p className="text-gray-400">No negative sentiment detected.</p>
          )
        ) : (
          summary ? (
            <p className="text-white">{summary}</p>
          ) : (
            <p className="text-gray-400">No summary available.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Analysis;