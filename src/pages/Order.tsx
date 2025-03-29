import React, { useState } from 'react';

// Mock data for orders
const MOCK_ORDERS = [
  {
    id: 'UDD001',
    username: 'darren',
    orderDate: '18/6/2022',
    status: 'Preparing',
    paymentStatus: 'Half Deposit',
    orderTotal: 'RM 1966.80',
    productDetails: {
      product: 'T01',
      color: 'Grey 100, Dark Blue 150',
      customization: 'Heat Transfer Printing',
      note: 'Custom team jersey',
      name: 'Team Uniform',
    }
  },
  {
    id: 'UDD002',
    username: 'sarah',
    orderDate: '22/6/2022',
    status: 'Completed',
    paymentStatus: 'Fully Paid',
    orderTotal: 'RM 1200.50',
    productDetails: {
      product: 'T02',
      color: 'Black, White',
      customization: 'Screen Printing',
      note: 'Corporate event shirts',
      name: 'Company Event Shirt',
    }
  },
  {
    id: 'UDD003',
    username: 'michael',
    orderDate: '30/6/2022',
    status: 'Processing',
    paymentStatus: 'Pending',
    orderTotal: 'RM 750.20',
    productDetails: {
      product: 'H01',
      color: 'Navy Blue',
      customization: 'Embroidery',
      note: 'Personal hoodie design',
      name: 'Custom Hoodie',
    }
  }
];

const Order = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchParams, setSearchParams] = useState({
    searchBy: 'OrderId',
    status: '',
    dateFrom: '',
    dateTo: ''
  });

  return (
    <div className="flex space-x-4">
      {/* Left Side - Order List */}
      <div className="w-2/3 bg-white rounded-lg shadow-md p-4">
        <div className="flex mb-4 space-x-2">
          <select 
            className="px-2 py-1 border rounded text-sm"
            value={searchParams.searchBy}
            onChange={(e) => setSearchParams({...searchParams, searchBy: e.target.value})}
          >
            <option value="OrderId">OrderId, Username</option>
            <option value="Username">Username</option>
          </select>
          
          <select 
            className="px-2 py-1 border rounded text-sm"
            value={searchParams.status}
            onChange={(e) => setSearchParams({...searchParams, status: e.target.value})}
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
            onChange={(e) => setSearchParams({...searchParams, dateFrom: e.target.value})}
          />
          
          <input 
            type="date" 
            className="px-2 py-1 border rounded text-sm"
            value={searchParams.dateTo}
            onChange={(e) => setSearchParams({...searchParams, dateTo: e.target.value})}
          />
          
          <button className="bg-orange-600 text-white px-4 py-1 rounded text-sm hover:bg-orange-700 transition-colors">
            SEARCH
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2 text-left">Username</th>
              <th className="p-2 text-left">Order Date</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Payment Status</th>
              <th className="p-2 text-left">Order Total</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ORDERS.map((order) => (
              <tr 
                key={order.id} 
                className={`
                  border-b cursor-pointer 
                  ${selectedOrder?.id === order.id 
                    ? 'bg-orange-50' 
                    : 'hover:bg-gray-50'}
                `}
                onClick={() => setSelectedOrder(order)}
              >
                <td className="p-2">{order.id}</td>
                <td className="p-2">{order.username}</td>
                <td className="p-2">{order.orderDate}</td>
                <td className="p-2">{order.status}</td>
                <td className="p-2">{order.paymentStatus}</td>
                <td className="p-2">{order.orderTotal}</td>
              </tr>
            ))}
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
              <div><strong>Order ID:</strong> {selectedOrder.id}</div>
              <div><strong>Username:</strong> {selectedOrder.username}</div>
              <div><strong>Order Date:</strong> {selectedOrder.orderDate}</div>
              <div><strong>Order Status:</strong> {selectedOrder.status}</div>
              <div><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</div>
              <div><strong>Order Total:</strong> {selectedOrder.orderTotal}</div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold mb-2 text-gray-800">Product Details</h3>
              <div className="text-sm space-y-1">
                <div><strong>Product:</strong> {selectedOrder.productDetails.product}</div>
                <div><strong>Color:</strong> {selectedOrder.productDetails.color}</div>
                <div><strong>Customization:</strong> {selectedOrder.productDetails.customization}</div>
                <div><strong>Note:</strong> {selectedOrder.productDetails.note}</div>
                <div><strong>Name:</strong> {selectedOrder.productDetails.name}</div>
                <div className="mt-2">
                  <strong>Product Preview:</strong>
                  <div className="w-full h-40 bg-gray-100 rounded mt-2 flex items-center justify-center text-gray-500">
                    No Preview Available
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;