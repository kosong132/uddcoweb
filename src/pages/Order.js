import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [usernames, setUsernames] = useState({});
  const [searchParams, setSearchParams] = useState({
    searchBy: 'OrderId',
    status: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchParams]);
  
const handleUpdateOrder = async () => {
  if (!selectedOrder) return;

  try {
    const response = await axios.put(
      `https://uddco.onrender.com/orders/update-status/${selectedOrder.orderId}`,
      { orderStatus: selectedOrder.orderStatus }
    );

    console.log("Order updated:", response.data);
    alert("Order status updated successfully.");

    // Refresh orders
    fetchOrders();
    setSelectedOrder(null);
  } catch (error) {
    console.error("Failed to update order:", error.response?.data || error.message);
    alert("Failed to update order: " + (error.response?.data || error.message));
  }
};


  const fetchOrders = async () => {
    try {
      const res = await axios.get('https://uddco.onrender.com/orders/all');
      const ordersWithUsernames = res.data;

      // Extract all unique userIds from the orders
      const userIds = [...new Set(ordersWithUsernames.map(order => order.userId))];

      // Fetch usernames for each unique userId
      const usernameMap = {};
      await Promise.all(userIds.map(async userId => {
        try {
          const userRes = await axios.get(`https://uddco.onrender.com/auth/users/${userId}`);
          usernameMap[userId] = userRes.data.username;
        } catch (error) {
          usernameMap[userId] = 'Unknown User';
        }
      }));

      setUsernames(usernameMap);
      setOrders(ordersWithUsernames);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    const { status, dateFrom, dateTo } = searchParams;

    if (status) {
      filtered = filtered.filter(order => order.orderStatus === status);
    }

    if (dateFrom) {
      filtered = filtered.filter(order => new Date(order.createdAt) >= new Date(dateFrom));
    }

    if (dateTo) {
      filtered = filtered.filter(order => new Date(order.createdAt) <= new Date(dateTo));
    }

    setFilteredOrders(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex space-x-4">
      {/* Left Side - Order List */}
      <div className="w-2/3 bg-white rounded-lg shadow-md p-4">
        <div className="flex mb-4 space-x-2">
          <select
            className="px-2 py-1 border rounded text-sm"
            value={searchParams.searchBy}
            onChange={(e) => setSearchParams({ ...searchParams, searchBy: e.target.value })}
          >
            <option value="OrderId">Order ID</option>
            <option value="UserId">User ID</option>
          </select>

          <select
            className="px-2 py-1 border rounded text-sm"
            value={searchParams.status}
            onChange={(e) => setSearchParams({ ...searchParams, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="Preparing">Preparing</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
          </select>

          <input
            type="date"
            className="px-2 py-1 border rounded text-sm"
            value={searchParams.dateFrom}
            onChange={(e) => setSearchParams({ ...searchParams, dateFrom: e.target.value })}
          />

          <input
            type="date"
            className="px-2 py-1 border rounded text-sm"
            value={searchParams.dateTo}
            onChange={(e) => setSearchParams({ ...searchParams, dateTo: e.target.value })}
          />
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Order Date</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Order Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">No orders found.</td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr
                  key={order.orderId}
                  className={`border-b cursor-pointer ${selectedOrder?.orderId === order.orderId ? 'bg-orange-50' : 'hover:bg-gray-50'
                    }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="p-2">{order.orderId}</td>
                  <td className="p-2">{usernames[order.userId] || 'Loading...'}</td>
                  <td className="p-2">{formatDate(order.createdAt)}</td>
                  <td className="p-2">{order.orderStatus}</td>


                  <td className="p-2">RM {order.totalPrice?.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Right Side - Order Details */}
      <div className="w-1/3 bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => setSelectedOrder(null)}
          >
            ✖
          </button>
        </div>

        {!selectedOrder ? (
          <div className="text-center text-gray-500 py-10">
            <p>Please select an order to view details</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
              <div><strong>Order ID:</strong> {selectedOrder.orderId}</div>
              <div><strong>User:</strong> {usernames[selectedOrder.userId] || 'Loading...'}</div>
              <div><strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}</div>
              <div>
                <strong>Status:</strong>
                <select
                  className="ml-2 border rounded px-2 py-1 text-sm"
                  value={selectedOrder.orderStatus}
                  onChange={(e) => setSelectedOrder({ ...selectedOrder, orderStatus: e.target.value })}
                >
                  <option value="Preparing">Preparing</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div><strong>Total:</strong> RM {selectedOrder.totalPrice?.toFixed(2)}</div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold mb-2 text-gray-800">Product Details</h3>
              <div className="text-sm space-y-1">
                <div><strong>Product:</strong> {selectedOrder.productName}</div>
                <div><strong>Color:</strong> {selectedOrder.selectedColor}</div>
                <div><strong>Customization:</strong> {selectedOrder.selectedCustomization}</div>
                <div><strong>Quantity:</strong> {selectedOrder.quantity}</div>

                <div className="mt-2">
                  <strong>Product Preview:</strong>
                  <div className="w-full h-40 bg-gray-100 rounded mt-2 flex items-center justify-center">
                    {selectedOrder.imageUrl ? (
                      <img
                        src={selectedOrder.imageUrl}
                        alt="Preview"
                        className="object-contain h-full"
                      />
                    ) : (
                      <span className="text-gray-500">No Preview Available</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleUpdateOrder}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Update Order Status
            </button>

          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
