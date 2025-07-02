import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hello! I can assist you with your UDD.Co dashboard. Try asking things like:\n• What is today's revenue?\n• Show all users\n• Top 5 products\n• Compare sales this month vs last month",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("https://uddco.onrender.com/api/chat", {
        query: userMessage.text,
      });

      const botResponse = {
        sender: "bot",
        text: response.data.response || response.data.text || "No response text",
        isChart: !!response.data.chartData,
        chartData: response.data.chartData || null,
        userList: response.data.userList || null,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❌ Sorry, something went wrong while contacting the server.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md border rounded p-2 text-sm">
          <p className="font-semibold">{label}</p>
          <p>Revenue: <span className="text-green-600">RM {payload[0].value.toFixed(2)}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-md p-4 h-[70vh] overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-xl ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="whitespace-pre-line mb-2">{message.text}</p>

              {message.isChart && message.chartData && (
                <div className="bg-white p-3 rounded-lg mt-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={message.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill="#4f46e5" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {message.userList && Array.isArray(message.userList) && (
                <div className="mt-2 overflow-x-auto max-h-64 overflow-y-auto">
                  <table className="table-auto text-sm w-full border">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="px-2 py-1 text-left">Username</th>
                        <th className="px-2 py-1 text-left">Email</th>
                        <th className="px-2 py-1 text-left">Phone</th>
                        <th className="px-2 py-1 text-left">Address</th>
                        <th className="px-2 py-1 text-left">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {message.userList.map((user, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-2 py-1">{user.username}</td>
                          <td className="px-2 py-1">{user.email}</td>
                          <td className="px-2 py-1">{user.phoneNumber}</td>
                          <td className="px-2 py-1">{user.address}</td>
                          <td className="px-2 py-1">{user.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none"
          placeholder="Type your question here..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;
