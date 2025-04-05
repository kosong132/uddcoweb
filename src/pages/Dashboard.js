import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Dashboard component for UDD.Co admin panel
const Dashboard = () => {
  // State to hold filter selections
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Placeholder state for dashboard data
  const [todaysOrder, setTodaysOrder] = useState(0);
  const [todaysRevenue, setTodaysRevenue] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch dashboard data (connect to backend later)
  useEffect(() => {
    // Simulate API call here
    // Replace this with real API calls to your backend
    setTodaysOrder(25); // Example number
    setTodaysRevenue(1520.75); // Example revenue
    setSalesData([
      { name: "Week 1", revenue: 400 },
      { name: "Week 2", revenue: 700 },
      { name: "Week 3", revenue: 300 },
      { name: "Week 4", revenue: 600 },
    ]);
    setTotalUsers(328); // Example user count
  }, [selectedYear, selectedMonth]);

  return (
    <div className="p-6 space-y-6">
      {/* Top Bar: Today's Order and Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold text-gray-700">Today's Orders</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{todaysOrder}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold text-gray-700">Today's Revenue</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">RM{todaysRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Year Filter */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border rounded-lg px-4 py-2"
        >
          {/* Replace with dynamic year range if needed */}
          {[2023, 2024, 2025].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        {/* Month Filter */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border rounded-lg px-4 py-2"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>{new Date(0, month - 1).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#4f46e5" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Total Registered Users */}
      <div className="bg-white rounded-2xl shadow p-5 text-center">
        <h2 className="text-lg font-semibold text-gray-700">Total Registered Users</h2>
        <p className="text-4xl font-bold text-purple-600 mt-2">{totalUsers}</p>
      </div>
    </div>
  );
};

export default Dashboard;
```javascript
// Dashboard component for UDD.Co admin panel
const Dashboard = () => {
  // State to hold filter selections
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Placeholder state for dashboard data
  const [todaysOrder, setTodaysOrder] = useState(0);
  const [todaysRevenue, setTodaysRevenue] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch dashboard data (connect to backend later)
  useEffect(() => {
    // Simulate API call here
    // Replace this with real API calls to your backend
    const fetchDashboardData = async () => {
      try {
        // Example API call
        const response = await fetch('https://example.com/api/dashboard');
        const data = await response.json();
        setTodaysOrder(data.todaysOrder);
        setTodaysRevenue(data.todaysRevenue);
        setSalesData(data.salesData);
        setTotalUsers(data.totalUsers);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDashboardData();
  }, [selectedYear, selectedMonth]);

  return (
    <div className="p-6 space-y-6">
      {/* Top Bar: Today's Order and Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold text-gray-700">Today's Orders</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{todaysOrder}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold text-gray-700">Today's Revenue</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">RM{todaysRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Year Filter */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border rounded-lg px-4 py-2"
        >
          {/* Replace with dynamic year range if needed */}
          {[2023, 2024, 2025].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        {/* Month Filter */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border rounded-lg px-4 py-2"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>{new Date(0, month - 1).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#4f46e5" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Total Registered Users */}
      <div className="bg-white rounded-2xl shadow p-5 text-center">
        <h2 className="text-lg font-semibold text-gray-700">Total Registered Users</h2>
        <p className="text-4xl font-bold text-purple-600 mt-2">{totalUsers}</p>
      </div>
    </div>
  );
};

export default Dashboard;
```