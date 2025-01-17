"use client";

import React, {useState} from "react";
import {handleAudioFileUpload} from "./utils/fileUpload";
import {ProcessingResult, SentimentAnalysisItem} from "./interfaces";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState<File | null > (null);
  const [selectedModel, setSelectedModel] = useState<string> ("small");
  const [selectedLanguage, setSelectedLanguage] = useState<string> ("portuguese");
  const [selectedSentimentModel, setSelectedSentimentModel] = useState<string> ("llm");
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null >(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
  };

  const handleSentimentModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSentimentModel(event.target.value);
  };

  const handleProcessFile = async () => {
    if (!selectedFile) {
      alert("No file selected!");
      return;
    }

    setIsProcessing(true);
    setProcessingResult(null);

    try {
      const result = await handleAudioFileUpload(selectedFile, selectedModel, selectedLanguage, selectedSentimentModel);
      setProcessingResult(result);
    } catch (error) {
      console.error("Error processing file:", error);
      alert("An error occurred while processing the file. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen p-4 sm:p-10 font-sans bg-neutral-800">

      {/* File upload  */}
      <aside className="w-1/4 p-6 bg-neutral-900 rounded-l-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Upload Audio</h2>
        <input
          type="file"
          name="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="file-input file-input-bordered w-full mb-4 p-2 border border-gray-700 rounded-md bg-neutral-900 cursor-pointer"
        />

        <div className="flex-col mb-6 ">
          {/* Model Dropdown */}
          <label htmlFor="model" className="block text-sm font-medium mb-2" >
            Select Model
          </label>
          <select
            id="model"
            value={selectedModel}
            onChange={handleModelChange}
            className="mt-1 p-2 border rounded-md w-full bg-neutral-800"
          >
            <option value="tiny.en">Tiny-English</option>
            <option value="tiny">Tiny-Multilingual</option>
            <option value="base.en">Base-English</option>
            <option value="base">Base-Multilingual</option>
            <option value="small.en">Small-English</option>
            <option value="small">Small-Multilingual</option>
            <option value="medium.en">Medium-English</option>
            <option value="medium">Medium-Multilingual</option>
            <option value="large">Large-Multilingual</option>
            <option value="turbo">Turbo-Multilingual</option>
            {/* Add more models as required */}
          </select>
        </div>

        <div className="flex mb-6 ">
          {/* Language Dropdown */}
          <div className="flex-row w-1/2 pr-2">

            <label htmlFor="language" className="block text-sm font-medium mb-2" >
              Select Language
            </label>
            <select
              id="language"
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="mt-1 p-2 border rounded-md w-full bg-neutral-800"
              >
              <option value="portuguese">Português</option>
              <option value="english">English</option>
              {/* Add more languages as required */}
            </select>
          </div>

          <div className="flex-row w-1/2 pl-2">
            <label htmlFor="sentimentAnalysis" className="block text-sm font-medium mb-2" >
              Sentiment Model
            </label>
            <select
              id="sentimentAnalysis"
              value={selectedSentimentModel}
              onChange={handleSentimentModelChange}
              className="mt-1 p-2 border rounded-md w-full bg-neutral-800"
            >
              <option value="transformers">Transformers</option>
              <option value="llm">LLM</option>
            </select>
          </div>
        </div>

        {/* Button to send it and make transcript */}
        <button
          onClick={handleProcessFile}
          className={`w-full py-2 mt-4 bg-blue-500 text-white px-4 rounded-md ${
            selectedFile && !isProcessing ? "hover:bg-blue-600" : "opacity-50 cursor-not-allowed"
          }`}
          disabled={!selectedFile || isProcessing }>
          {isProcessing ? "Processing..." : "Process Audio"}
        </button>
      </aside>


      <main className="flex-1 rounded-r-lg p-4 bg-neutral-950 flex flex-col h-full">
        {/* Transcription */}
        <div className="relative flex flex-col overflow-hidden bg-neutral-800 h-3/5 rounded">
          {/* Overall Sentiment */}
          <div className="absolute top-4 right-4 bg-neutral-700 px-4 py-2 rounded shadow">
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

          {/* Transcription Content */}
          <div className="flex flex-col flex-1 overflow-hidden rounded">
            <h3 className="text-lg font-semibold p-4">Transcription Result:</h3>
            <div className="flex-1 overflow-y-auto p-4">
              {processingResult ? (
                <p className="text-white">{processingResult.text}</p>
              ) : (
                <p className="text-gray-400">No transcription available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="flex flex-col overflow-hidden h-2/5 mt-4 bg-neutral-800 rounded">
          <h4 className="text-lg font-semibold p-4">Negative Sentiment Highlights:</h4>
          <div className="flex-1 overflow-y-auto p-4">
            {processingResult?.sentiment_analysis?.some(
              (item: SentimentAnalysisItem) =>
                item.sentiment.trim().toLowerCase() !== "positive" &&
                item.sentiment.trim().toLowerCase() !== "very positive" &&
                item.sentiment.trim().toLowerCase() !== "neutral"
            ) ? (
              processingResult.sentiment_analysis
                .filter(
                  (item: SentimentAnalysisItem) =>
                    item.sentiment.trim().toLowerCase() !== "positive" &&
                    item.sentiment.trim().toLowerCase() !== "very positive" &&
                    item.sentiment.trim().toLowerCase() !== "neutral"
                )
                .map((item: SentimentAnalysisItem, index: number) => (
                  <p key={index} className="m-2 p-2 bg-red-600 rounded">
                    {item.phrase} — {item.sentiment} ({item.score.toFixed(2)})
                  </p>
                ))
            ) : (
              <p className="text-gray-400">No negative sentiment detected.</p>
            )}
          </div>
        </div>
      </main>

    </div>
  );
};

export default Home;
