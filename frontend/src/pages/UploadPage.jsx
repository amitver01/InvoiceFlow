import React, { useEffect } from 'react';
import axios from 'axios';
import InvoiceUpload from "../components/InvoiceUploader";
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar';
const UploadPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    axios.get(`${import.meta.env.VITE_API_URL}/api/check-auth`, { withCredentials: true })
      .then(response => {
         console.log('User is authenticated:', response.data);
      })
      .catch(error => {
        console.log('User is not authenticated');
        navigate('/login');
      });
  }, [navigate]);

  // This will receive the result from InvoiceUploader
  const handleUpload = () => {
    //console.log("Upload successful! Invoice data:", data);
    alert("Upload successful! Invoice ID: "); 
  };

  return (
  <>
    <NavBar/>
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <InvoiceUpload onUpload={handleUpload} />
    </div>
    </>
  );
};

export default UploadPage;
