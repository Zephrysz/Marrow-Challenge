import React from "react";

export const handleAudioFileUpload = async (event: React.ChangeEvent<HTMLInputElement>)=> {
    const file = event.target.files?.[0];
    if (!file) {
      alert("No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData,
        });

    if (response.ok) {
        alert("File uploaded successfully!");
    } else {
        alert("Failed to upload file.");
    }
    } catch (error) {
        console.log("error", error);
        alert("An error occurred while uploading the file.");
    }
}
