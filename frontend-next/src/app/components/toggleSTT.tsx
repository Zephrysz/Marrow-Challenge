import { useState } from 'react';

interface ToggleSTTProps {
  isEnabled: boolean;
  onStartStreaming: () => void;
  onStopStreaming: () => void;
}

const ToggleSwitch: React.FC<ToggleSTTProps> = ({ isEnabled, onStartStreaming, onStopStreaming }) => {
  const [isActive, setIsActive] = useState(isEnabled);

  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState);

    if (newState) {
      onStartStreaming();
    } else {
      onStopStreaming();
    }
  };

  return (
    <div className="flex items-center py-4">
      <div
        className={`relative w-12 h-6 rounded-full cursor-pointer ${
          isActive ? 'bg-green-500' : 'bg-neutral-700'
        }`}
        onClick={handleToggle}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            isActive ? 'transform translate-x-6' : ''
          }`}
        ></div>
      </div>
      <label
        htmlFor="formattingToggle"
        className="text-gray-400 font-medium ml-3 select-none"
      >
        Enable Real-time STT
      </label>
    </div>
  );
};

export default ToggleSwitch;