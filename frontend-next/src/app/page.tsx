"use client";

import React, { useState } from 'react';
import FileUpload from './components/fileUpload';
import Dropdown from './components/dropdown';
import Transcription from './components/transcription';
import SentimentAnalysis from './components/sentimentAnalysis';
import ProcessButton from './components/processButton';
import { handleAudioFileUpload } from './utils/fileUpload';
import { handleApiKeySubmit } from './utils/apiKeySubmit';
import { ProcessingResult } from './interfaces';

const Home = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('small');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('portuguese');
  const [selectedSentimentModel, setSelectedSentimentModel] = useState<string>('llm');
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isFormattingEnabled, setIsFormattingEnabled] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>(''); // API key state
  const [isKeyUpdated, setIsKeyUpdated] = useState<boolean>(false); // Track key update status



  const handleProcessFile = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    // setProcessingResult(null);

    try {
      const result = await handleAudioFileUpload(
        selectedFile,
        selectedModel,
        selectedLanguage,
        selectedSentimentModel,
        isFormattingEnabled,
      );
      setProcessingResult(result);
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <div className="flex-row min-h-screen lg:flex lg:h-screen p-4 font-sans bg-neutral-800 lg:p-10">
      <aside className="w-full lg:w-1/4 p-6 bg-neutral-900 rounded-t-lg lg:rounded-t-none lg:rounded-l-lg shadow-lg flex flex-col">
        <FileUpload selectedFile={selectedFile} onFileChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
        <div className='pb-2'></div>
        <Dropdown
          label="Select Model"
          options={[
            { value: 'tiny.en', label: 'Tiny-English' },
            { value: 'tiny', label: 'Tiny-Multilingual' },
            { value: 'base.en', label: 'Base-English' },
            { value: 'base', label: 'Base-Multilingual' },
            { value: 'small.en', label: 'Small-English' },
            { value: 'small', label: 'Small-Multilingual'},
            { value: 'medium.en', label: 'Medium-English' },
            { value: 'medium', label: 'Medium-Multilingual'},
            { value: 'large', label: 'Large-Multilingual' },
            { value: 'turbo', label: 'Large-Multilingual'},
            { value: 'whisper_api', label: 'Whisper API'},
          ]}
          selectedValue={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        />
        <div className='pb-2'></div>
        <Dropdown
          label="Select Language"
          options={[
            { value: 'portuguese', label: 'Portuguese' },
            { value: 'english', label: 'English' },
          ]}
          selectedValue={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        />
        <div className='pb-2'></div>
        <Dropdown
          label="Select Sentiment Model"
          options={[
            { value: 'llm', label: 'Large Language Model' },
            { value: 'transformers', label: 'Transformers' },
          ]}
          selectedValue={selectedSentimentModel}
          onChange={(e) => setSelectedSentimentModel(e.target.value)}
        />
        <div className="flex items-center py-4">
          <div
            className={`relative w-12 h-6 rounded-full cursor-pointer ${
              isFormattingEnabled ? 'bg-green-500' : 'bg-neutral-700'
            }`}
            onClick={() => setIsFormattingEnabled(!isFormattingEnabled)}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                isFormattingEnabled ? 'transform translate-x-6' : ''
              }`}
            ></div>
          </div>
          <label htmlFor="formattingToggle" className="text-gray-400 font-medium ml-3 select-none">
            Enable Formatting
          </label>
        </div>
        <div className="flex items-center py-2 justify-start">
          <ProcessButton
            isProcessing={isProcessing}
            selectedFile={selectedFile}
            onClick={handleProcessFile}
          />
        </div>
        <div className="border-t border-neutral-300 mt-auto">
          <label htmlFor="apiKeyInput" className="text-gray-400 font-medium">
            Your OpenAI API Key
          </label>
          <input
            type="text"
            id="apiKeyInput" 
            className="w-full mt-2 p-2 bg-neutral-800 text-white rounded border border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
          />
          <button
            onClick={() => handleApiKeySubmit(apiKey, setIsKeyUpdated)}
            className="mt-4 w-full bg-blue-700 text-white font-medium py-2 rounded hover:bg-blue-800 transition-colors"
          >
            Use this key
          </button>
          {isKeyUpdated && (
            <p className="mt-2 text-green-400">API key updated successfully!</p>
          )}
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-10 bg-neutral-950 rounded-b-lg lg:rounded-b-none lg:rounded-r-lg">
        <Transcription processingResult={processingResult} />
        <SentimentAnalysis sentimentAnalysis={processingResult?.sentiment_analysis} />
      </main>
    </div>
  );
};

export default Home;