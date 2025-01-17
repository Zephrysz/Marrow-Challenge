import { ProcessingResult } from "../interfaces";

export const handleAudioFileUpload = async (file: File, model: string, language: string, sentiment_model: string): Promise<ProcessingResult | null> => {

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", model);
    formData.append("language", language);
    formData.append("sentiment_model", sentiment_model);

    try {
        const response = await fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData,
        });

    if (response.ok) {
        const data: ProcessingResult = await response.json();
        alert("File uploaded successfully!");
        return data;
    } else {
        alert("Failed to upload file.");
    }
    } catch (error) {
        console.log("error", error);
        alert(error);
    }
    return null;
}
