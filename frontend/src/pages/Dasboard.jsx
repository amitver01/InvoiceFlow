import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    totalInvoices: 0,
    totalRevenue: 0,
    recentInvoices: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard`, {
          withCredentials: true,
        });
        setDashboardData(response.data);
        console.log(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const exportToExcel = () => {
    const { recentInvoices, monthlyRevenue, invoiceStatusSummary } = dashboardData;
    const wb = XLSX.utils.book_new();

    if (recentInvoices && recentInvoices.length > 0) {
      const invoiceSheet = XLSX.utils.json_to_sheet(recentInvoices);
      XLSX.utils.book_append_sheet(wb, invoiceSheet, 'Recent Invoices');
    }

    if (monthlyRevenue && monthlyRevenue.length > 0) {
      const revenueSheet = XLSX.utils.json_to_sheet(monthlyRevenue);
      XLSX.utils.book_append_sheet(wb, revenueSheet, 'Monthly Revenue');
    }

    if (invoiceStatusSummary && invoiceStatusSummary.length > 0) {
      const statusSheet = XLSX.utils.json_to_sheet(invoiceStatusSummary);
      XLSX.utils.book_append_sheet(wb, statusSheet, 'Invoice Status');
    }

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'dashboard-data.xlsx');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-blue-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Navbar /> {/* Adding the Navbar component here */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header with Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={() => navigate("/upload")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Go to Upload Page
          </button>
        </div>

        {/* Total Invoices */}
        <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Total Invoices</h2>
            <p className="text-3xl font-bold text-blue-600">{dashboardData.totalInvoices}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-blue-600"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Total Revenue</h2>
            <p className="text-3xl font-bold text-green-600">₹ {dashboardData.totalRevenue}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-600"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L11 7.414V14a1 1 0 11-2 0V7.414L5.707 10.707a1 1 0 01-1.414-1.414l4-4A1 1 0 0110 5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Recent Invoices Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Invoices</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-600">
                <th className="px-4 py-2 border-b">Invoice #</th>
                <th className="px-4 py-2 border-b">Vendor</th>
                <th className="px-4 py-2 border-b">Amount</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentInvoices?.map((invoice) => (
                <tr key={invoice._id} className="text-sm text-gray-700">
                  <td className="px-4 py-2 border-b">{invoice.invoiceNumber}</td>
                  <td className="px-4 py-2 border-b">{invoice.vendorName}</td>
                  <td className="px-4 py-2 border-b">₹{invoice.amount}</td>
                  <td className="px-4 py-2 border-b">{invoice.status}</td>
                  <td className="px-4 py-2 border-b">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-5 flex justify-end">
            <button
              onClick={exportToExcel}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Export to Excel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
