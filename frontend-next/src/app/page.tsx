"use client";

import React, {useState} from "react";
import {handleAudioFileUpload} from "./utils/fileUpload";
import {ProcessingResult, SentimentAnalysisItem} from "./interfaces";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState<File | null > (null);
  const [selectedModel, setSelectedModel] = useState<string> ("small");
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null >(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  const handleProcessFile = async () => {
    if (!selectedFile) {
      alert("No file selected!");
      return;
    }

    setIsProcessing(true);
    setProcessingResult(null);

    try {
      const result = await handleAudioFileUpload(selectedFile, selectedModel);
      setProcessingResult(result);
    } catch (error) {
      console.error("Error processing file:", error);
      alert("An error occurred while processing the file. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen p-4 sm:p-10 font-sans bg-neutral-800">
      {/* File upload  */}
      <aside className="w-1/4 p-6 bg-neutral-900 rounded-lg shadow-lg">
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
            {/* Add more languages as required */}
          </select>
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


      <main className="flex-1 px-4  bg-neutral-950">
        {/* Transcription */}
        {processingResult && (
          <div className="mt-6 rounded ">
            <div className="">
              <h3 className="text-lg font-semibold">Transcription Result:</h3>
              <p className="mt-2 text-white">{processingResult.text}</p>
            </div>

            {/* Sentiment Analysis */}
            <div className = "mt-6 p-4 rounded bg-neutral-800">
            <h4 className="text-lg font-semibold">Negative Sentiment Highlights:</h4>
            {processingResult?.sentiment_analysis?.some(
              (item: SentimentAnalysisItem) => item.sentiment.trim().toLowerCase() === "negative" || item.sentiment.trim().toLowerCase() === "very negative"
            ) ? (
              processingResult.sentiment_analysis
                .filter((item: SentimentAnalysisItem) => item.sentiment.trim().toLowerCase() === "negative" || item.sentiment.trim().toLowerCase() === "very negative")
                .map((item: SentimentAnalysisItem, index: number) => (
                  <p key={index} className="m-2 p-2 bg-red-600 rounded">
                    {item.phrase} — Negative ({item.score.toFixed(2)})
                  </p>
                ))
            ) : (
              <p className="mt-2 text-gray-400">No negative sentiment detected.</p>
            )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
