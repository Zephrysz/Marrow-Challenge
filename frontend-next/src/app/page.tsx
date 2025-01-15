"use client";

import {handleAudioFileUpload} from "./utils/fileUpload";

const Home = () => {

  return (
    <div className="flex min-h-screen p-8 sm:p-20 font-sans">
      {/* File upload  */}
      <aside className="w-1/4 border-r border-gray-200 p-4">
        <h2 className="text-xl font-semibold mb-4">Upload Audio</h2>
        <input
          type="file"
          name="file"
          accept="audio/*"
          onChange={handleAudioFileUpload}
          className="file-input file-input-bordered w-full cursor-pointer"
        />
      </aside>

      {/* Description */}
      <main className="flex-1 p-4">
        <p className="text-lg mt-4">
          Upload your audio files on the left to send them to the backend.
        </p>
      </main>
    </div>
  );
};

export default Home;
