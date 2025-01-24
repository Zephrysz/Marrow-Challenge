import { ProcessingResult } from "../interfaces";

export const handleToggleSTTStream = (
  model: string,
  language: string,
  sentiment_model: string,
  onData: (data: ProcessingResult) => void,
  onError: (error: Event) => void
): EventSource => {
  const eventSource = new EventSource(
    `http://localhost:5000/realtime_stt?model=${model}&language=${language}&sentiment_model=${sentiment_model}&active_listening=true`
  );

  eventSource.onmessage = (event: MessageEvent) => {
    try {
      const data: ProcessingResult = JSON.parse(event.data);
      onData(data);
    } catch (err) {
      console.error("Failed to parse streaming data:", err);
    }
  };

  eventSource.onerror = (error: Event) => {
    console.error("Error in EventSource:", error);
    eventSource.close();
    onError(error);
  };

  return eventSource;
};