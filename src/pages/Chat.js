import React, { useState, useEffect, useRef } from "react";
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

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  // Sample questions to suggest
  const sampleQuestions = [
    "How many orders today?",
    "What's today's revenue?",
    "Show me top products",
    "Compare sales this month and last month"
  ];

  // Load initial message and saved history
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    const initialMessages = savedMessages
      ? JSON.parse(savedMessages)
      : [{
        sender: "bot",
        text: "Hello! I'm your sales assistant. Ask me about:\n- Today's orders\n- Revenue data\n- Top products\n- Order status",
        isChart: false
      }];

    setMessages(initialMessages);
  }, []);

  // Save messages to localStorage and scroll to bottom
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    // Add user message
    const userMessage = {
      sender: "user",
      text: inputMessage,
      isChart: false,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://uddco.onrender.com/api/chat", {
        query: inputMessage
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const botResponse = {
        sender: "bot",
        text: response.data.response || response.data.text || "No response text",
        isChart: !!response.data.chartData,
        chartData: response.data.chartData || null,
        userList: response.data.userList || null,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botResponse]);

    } catch (err) {
      console.error("API Error:", err);
      const errorMessage = err.response?.data?.error ||
        err.message ||
        "Failed to get response from server";

      setError(errorMessage);
      setMessages(prev => [...prev, {
        sender: "bot",
        text: "Sorry, I encountered an error processing your request. Please try again.",
        isChart: false,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSendMessage();
    }
  };

  const handleSampleQuestion = (question) => {
    setInputMessage(question);
    // Auto-send after a brief delay to allow state update
    setTimeout(() => handleSendMessage(), 100);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md border rounded p-2">
          <p className="font-semibold">{label}</p>
          <p>Revenue: <span className="text-green-600 font-medium">RM{payload[0].value.toFixed(2)}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="bg-blue-600 text-white p-4">
          <h2 className="text-lg font-semibold">Sales Assistant</h2>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={`${message.timestamp}-${index}`}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-3/4 rounded-lg p-3 ${message.sender === "user"
                  ? "bg-blue-100 text-blue-900"
                  : "bg-gray-100 text-gray-900"
                  }`}
              >
                <>
                  <p className="whitespace-pre-line mb-2">{message.text}</p>

                  {message.isChart && message.chartData && (
                    <div className="bg-white p-3 rounded-lg">
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
                    <div className="mt-2 overflow-x-auto">
                      <table className="table-auto border text-sm w-full">
                        <thead>
                          <tr className="bg-gray-200 text-left">
                            <th className="px-2 py-1">Username</th>
                            <th className="px-2 py-1">Email</th>
                            <th className="px-2 py-1">Phone</th>
                            <th className="px-2 py-1">Address</th>
                            <th className="px-2 py-1">Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          {message.userList.map((user, index) => (
                            <tr key={index} className="border-t">
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
                </>

              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 rounded-lg p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t">
          <div className="flex flex-wrap gap-2 mb-3">
            {sampleQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSampleQuestion(question)}
                disabled={loading}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about sales data..."
              className="flex-grow border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="font-semibold">Error:</span> {error}
          <button
            onClick={() => setError("")}
            className="absolute top-1 right-1 text-red-700"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;