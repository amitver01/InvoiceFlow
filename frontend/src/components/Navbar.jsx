import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const goToUploadPage = () => {
    navigate("/upload");
  };

  return (
    <header className="flex justify-around items-center mt-7 py-6 px-6 md:px-12">
      {/* Logo and Title */}
      <div className="flex items-center space-x-4">
        <img
          src="/logo.png"
          alt="InvoiceFlow Logo"
          className="w-12 h-12"
        />
        <h1 className="text-2xl font-bold text-black">InvoiceFlow</h1>
      </div>

      <nav className="hidden md:flex space-x-8 text-gray-700 text-lg">
        <Link to="/upload" className="hover:text-black">Upload</Link>
        <Link to="/dashboard" className="hover:text-black">Dashboard</Link>
        <a href="/" className="hover:text-black">Home</a>
      </nav>

      <button
        onClick={goToUploadPage}
        className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700"
      >
        Start Now
      </button>
    </header>
  );
};

export default Navbar;
