import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const goToUploadPage = () => {
    navigate("/upload");
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="w-full h-screen">
      <header className="flex justify-around items-center mt-7 py-6 px-6 md:px-12 mt-">
        <h1 className="text-2xl font-bold text-black">AutoBill</h1>
        <nav className="hidden md:flex space-x-8 text-gray-700 text-lg">
          <Link to="/upload" className="hover:text-black">Upload</Link>
          <a href="#" className="hover:text-black">Transactions</a>
          <a href="#" className="hover:text-black">Faq</a>
        </nav>
        <button
          onClick={goToUploadPage}
          className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700"
        >
          Start Now
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-grow text-center px-6 mt-20">
        <h2 className="text-4xl md:text-7xl font-bold text-black leading-tight">
          Automate Invoice<br />
          Processing with<br />
          AI-Powered Bill<br />
          Entry
        </h2>
        <p className="mt-6 text-gray-600 text-2xl max-w-xl mx-auto ">
          Simplify your accounting. AutoBill Entry automates invoice processing,
          saving time and reducing errors. Start your free trial today!
        </p>
        
      </main>
      </div>
      {/* Full Screen Footer Section */}
      <footer className="w-full h-screen bg-blue-600 text-white px-6 md:px-20 py-20 flex flex-col justify-between">
  {/* Top Section */}
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between flex-1">
    {/* Left Heading */}
    <h2 className="text-4xl md:text-6xl font-bold leading-tight md:max-w-[300px] mb-6 md:mb-0">
      Automate<br />
      Bills, Save<br />
      Time Now!
    </h2>

    {/* Paragraph and Button */}
    <div className="md:max-w-xl">
      <p className="text-lg leading-relaxed mb-6">
        AI-powered invoice automation, simplifying your accounting and saving you time. Process invoices 10x faster with zero error rate.
      </p>
      <button
        onClick={goToUploadPage}
        className="bg-white text-black px-8 py-3 rounded-full text-base font-semibold hover:bg-blue-100">
        Start Free
      </button>
    </div>
  </div>

  {/* Divider */}
  <div className="my-12 border-t border-gray-300 w-full"></div>

  {/* Bottom Section */}
  <div className="flex flex-col md:flex-row justify-between gap-10">
    {/* Quick Links */}
    <div>
      <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
      <ul className="space-y-3 text-white text-lg">
      <li><Link to="/upload" className="hover:underline">Upload</Link></li>
        <li><a href="#" className="hover:underline">Settings</a></li>
        <li><a href="#" className="hover:underline">Pricing</a></li>
      </ul>
    </div>

    {/* Socials */}
    <div>
      <h3 className="text-xl font-semibold mb-4">Socials</h3>
      <ul className="space-y-3 text-white text-lg">
        <li><a href="#" className="hover:underline">Twitter</a></li>
        <li><a href="goToUploadPage" className="hover:underline">Facebook</a></li>
        <li><a href="#" className="hover:underline">Instagram</a></li>
      </ul>
    </div>
    
  </div>
  <div className="flex flex-col md:flex-row justify-between gap-10"></div>
  <div>
    <h3 className="flex justify-center text-lg">©2069 AutoBill. All rights reserved</h3>
  </div>
</footer>


    </div>
  );
}

export default HomePage;
