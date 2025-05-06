import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';

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
      } catch (err) {
        setError('Failed to fetch dashboard data');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, null ,{
        withCredentials: true,
      });
      //window.location.reload();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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

  if (loading) return <div className="text-center mt-20 text-lg">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-5 space-y-6">
        <h2 className="text-2xl font-bold text-indigo-600">MyApp</h2>
        <nav className="flex flex-col space-y-4 text-gray-700">
          <button onClick={() => navigate('/dashboard')} className="hover:text-indigo-600">📊 Dashboard</button>
          <button onClick={() => navigate('/upload')} className="hover:text-indigo-600">⬆️ Upload</button>
          <button onClick={() => navigate('/profile')} className="hover:text-indigo-600">👤 Profile</button>
          <button onClick={handleLogout} className="hover:text-red-600">🚪 Logout</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={exportToExcel}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Export to Excel
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded shadow flex justify-between items-center">
            <div>
              <h2 className="text-gray-600 text-lg">Total Invoices</h2>
              <p className="text-2xl font-bold text-blue-600">{dashboardData.totalInvoices}</p>
            </div>
            <div className="text-blue-600 text-3xl">📄</div>
          </div>
          <div className="bg-white p-6 rounded shadow flex justify-between items-center">
            <div>
              <h2 className="text-gray-600 text-lg">Total Revenue</h2>
              <p className="text-2xl font-bold text-green-600">₹ {dashboardData.totalRevenue}</p>
            </div>
            <div className="text-green-600 text-3xl">💰</div>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Invoices</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead>
                <tr className="text-gray-600 text-left border-b">
                  <th className="px-4 py-2">Invoice #</th>
                  <th className="px-4 py-2">Vendor</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentInvoices.map((invoice) => (
                  <tr key={invoice._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{invoice.invoiceNumber}</td>
                    <td className="px-4 py-2">{invoice.vendorName}</td>
                    <td className="px-4 py-2">₹{invoice.amount}</td>
                    <td className="px-4 py-2">{invoice.status}</td>
                    <td className="px-4 py-2">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
