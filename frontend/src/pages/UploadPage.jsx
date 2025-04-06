import React from 'react';
import InvoiceUpload from "../components/InvoiceUploader";

const UploadPage = () => {
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("invoice", file);
    try {
      const response = await fetch("https://your-backend-url.com/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      alert("Upload successful! Invoice ID: " + result.id);
    } catch (error) {
      console.error(error);
      alert("Failed to upload invoice.");
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <InvoiceUpload onUpload={handleUpload} />
    </div>
  );
};

export default UploadPage;
