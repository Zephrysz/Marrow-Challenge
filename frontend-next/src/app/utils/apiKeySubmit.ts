export const handleApiKeySubmit = async (apiKey: string, setIsKeyUpdated: React.Dispatch<React.SetStateAction<boolean>>, ) => {
  try {
    const response = await fetch('http://localhost:5000/set_api_key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ api_key: apiKey }),
    });
  
      if (response.ok) {
        setIsKeyUpdated(true);
        setTimeout(() => setIsKeyUpdated(false), 3000); // Reset status after 3 seconds
      } else {
        console.error('Failed to update API key:', await response.json());
      }
    } catch (error) {
      console.error('Error updating API key:', error);
    }
    return null;
  };