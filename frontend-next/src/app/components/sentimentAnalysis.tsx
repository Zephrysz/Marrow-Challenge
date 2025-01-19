import React from 'react';
import { SentimentAnalysisItem } from '../interfaces';

interface SentimentAnalysisProps {
  sentimentAnalysis: SentimentAnalysisItem[] | undefined;
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ sentimentAnalysis }) => (
    <div className="flex flex-col overflow-hidden box-border h-2/5 mt-4 bg-neutral-800 rounded">
        <h4 className="text-lg font-semibold p-4">Negative Sentiment Highlights</h4>
        <div className="flex-1 overflow-y-auto p-4">
        {sentimentAnalysis?.some(
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
        )}
        </div>
    </div>
);

export default SentimentAnalysis;
