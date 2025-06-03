import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [todaysOrder, setTodaysOrder] = useState(0);
  const [todaysRevenue, setTodaysRevenue] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [orderRes, revenueRes, salesRes, usersRes] = await Promise.all([
        axios.get("http://localhost:8080/api/dashboard/today-orders"),
        axios.get("http://localhost:8080/api/dashboard/today-revenue"),
        axios.get(`http://localhost:8080/api/dashboard/sales?year=${selectedYear}&month=${selectedMonth}`),
        axios.get("http://localhost:8080/api/dashboard/total-users"),
      ]);

      setTodaysOrder(orderRes.data);
      setTodaysRevenue(revenueRes.data);
      setSalesData(fillMissingSalesData(salesRes.data, selectedYear, selectedMonth));

      setTotalUsers(usersRes.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedYear, selectedMonth]);
  const fillMissingSalesData = (data, year, month) => {
    if (month === 0) {
      // Whole year: 12 months
      const monthNames = Array.from({ length: 12 }, (_, i) =>
        new Date(0, i).toLocaleString('default', { month: 'short' }).toUpperCase()
      );
      const months = monthNames.map((name) => ({
        name,
        revenue: 0,
      }));

      data.forEach((item) => {
        const index = months.findIndex((m) => m.name === item.name.toUpperCase());
        if (index !== -1) {
          months[index].revenue = item.revenue;
        }
      });

      return months;
    } else {
      // Specific month: Weekly data with duration
      const weekRanges = getWeekRanges(year, month);

      const weeks = weekRanges.map((range, index) => ({
        name: `Week ${index + 1}`,
        revenue: 0,
        duration: `${range.start.getDate()} - ${range.end.getDate()} ${range.end.toLocaleString('default', {
          month: 'short',
        })} ${year}`,
      }));

      data.forEach((item) => {
        const index = weeks.findIndex((w) => w.name === item.name);
        if (index !== -1) {
          weeks[index].revenue = item.revenue;
        }
      });

      return weeks;
    }
  };

  const getWeekRanges = (year, month) => {
    const ranges = [];

    const date = new Date(year, month - 1, 1);
    let weekStart = new Date(date);
    while (weekStart.getMonth() === month - 1) {
      let weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      // Keep weekEnd within the same month
      if (weekEnd.getMonth() !== weekStart.getMonth()) {
        weekEnd = new Date(year, month, 0); // Last day of the month
      }

      ranges.push({
        start: new Date(weekStart),
        end: new Date(weekEnd),
      });

      weekStart.setDate(weekStart.getDate() + 7);
    }

    return ranges;
  };
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white shadow-md border rounded p-2">
          <p className="font-semibold">{label}</p>
          <p>Revenue: <span className="text-green-600 font-medium">RM {data.revenue.toFixed(2)}</span></p>
          {data.duration && <p className="text-sm text-gray-500">Duration: {data.duration}</p>}
        </div>
      );
    }

    return null;
  };

  const isMonthSelected = selectedMonth !== 0;
  const salesTitle = isMonthSelected
    ? `Weekly Sales - ${new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} ${selectedYear}`
    : `Monthly Sales for ${selectedYear}`;

  return (
    <div className="p-6 space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold text-gray-700">Today's Orders</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {loading ? "..." : todaysOrder}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold text-gray-700">Today's Revenue</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {loading ? "..." : `RM${todaysRevenue.toFixed(2)}`}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border rounded-lg px-4 py-2"
        >
          {[2023, 2024, 2025].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border rounded-lg px-4 py-2"
        >
          <option value={0}>Whole Year</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-lg font-semibold mb-4">{salesTitle}</h2>
        {loading ? (
          <p>Loading chart...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />

              <Bar dataKey="revenue" fill="#4f46e5" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow p-5 text-center">
        <h2 className="text-lg font-semibold text-gray-700">Total Registered Users</h2>
        <p className="text-4xl font-bold text-purple-600 mt-2">
          {loading ? "..." : totalUsers}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
