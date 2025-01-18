"use client";

import React, { useState } from 'react';
import FileUpload from './components/fileUpload';
import Dropdown from './components/dropdown';
import Transcription from './components/transcription';
import SentimentAnalysis from './components/sentimentAnalysis';
import ProcessButton from './components/processButton';
import { handleAudioFileUpload } from './utils/fileUpload';
import { ProcessingResult } from './interfaces';

const Home = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('small');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('portuguese');
  const [selectedSentimentModel, setSelectedSentimentModel] = useState<string>('llm');
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isFormattingEnabled, setIsFormattingEnabled] = useState<boolean>(false);


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
    <div className="flex-row sm:flex sm:h-screen p-4 font-sans bg-neutral-800 sm:p-10">
      <aside className="w-full sm:w-1/4 p-6 bg-neutral-900 rounded-l-lg shadow-lg">
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
      </aside>
      <main className="flex-1 p-6 sm:p-10 bg-neutral-950">
        <Transcription processingResult={processingResult} />
        <SentimentAnalysis sentimentAnalysis={processingResult?.sentiment_analysis} />
      </main>
    </div>
  );
};

export default Home;