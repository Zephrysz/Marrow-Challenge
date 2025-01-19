export const handleFetchSummary = async (
    transcript : string | undefined,
    language : string,
  ): Promise<{summary :string} | null> => {

    if (!transcript) {
      throw new Error('Transcript is required.');
    }
  
    const response = await fetch('http://localhost:5000/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({ transcript, language }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch summary');
    }
  
    return response.json();
  };