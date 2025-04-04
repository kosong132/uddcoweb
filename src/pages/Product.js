import React, { useState } from 'react';

// Mock data for products
const MOCK_PRODUCTS = [
  {
    id: 'T01',
    name: 'Urban Artistry Tee',
    price: 'RM 24.99',
    type: 'T-Shirt',
    fabric: '100% Premium Cotton',
    description: 'Embrace your creativity with our Urban Artistry Tee. Featuring a soft, breathable fit and vibrant custom prints, this t-shirt is perfect for casual outings or showcasing your unique style.',
    available: true,
    image: '/assets/tshirt.png'
  },
  {
    id: 'P01',
    name: 'Classic Comfort Polo',
    price: 'RM 29.99',
    type: 'Collar T',
    fabric: 'Cotton-Polyester Blend',
    description: 'The Classic Comfort Polo offers a polished look with the comfort of a t-shirt. Customizable prints and a relaxed fit make it ideal for both work and leisure.',
    available: true,
    image: '/assets/polo.png'
  },
  {
    id: 'H01',
    name: 'Premium Hoodie',
    price: 'RM 49.99',
    type: 'Hoodie',
    fabric: 'Fleece Cotton Blend',
    description: 'Stay warm and stylish with our Premium Hoodie. Features a soft inner lining and durable outer fabric with customizable prints and embroidery options.',
    available: false,
    image: '/assets/hoodie.png'
  }
];

// Available color options
const COLOR_OPTIONS = [
  { name: 'Grey', code: '#A9A9A9' },
  { name: 'Black', code: '#000000' },
  { name: 'White', code: '#FFFFFF' },
  { name: 'Navy Blue', code: '#000080' },
  { name: 'Dark Blue', code: '#00008B' },
  { name: 'Red', code: '#FF0000' }
];

// Available customization options
const CUSTOMIZATION_OPTIONS = [
  'Screen Printing',
  'Heat Transfer Printing',
  'Sublimation Printing',
  'Embroidery',
  'Vinyl Printing'
];

const Product = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: '',
    name: '',
    price: '',
    type: '',
    fabric: '',
    description: '',
    available: true,
    colors: [],
    customizationOptions: []
  });

  // Handle opening the edit product form
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setEditFormData({
      id: product.id,
      name: product.name,
      price: product.price.replace('RM ', ''),
      type: product.type,
      fabric: product.fabric,
      description: product.description,
      available: product.available,
      // Set default values for colors and customization options
      colors: [{ name: 'Grey', quantity: 100 }],
      customizationOptions: ['Sublimation Printing']
    });
    setIsEditing(true);
    setIsAdding(false);
  };

  // Handle adding a new product
  const handleAddNewProduct = () => {
    setEditFormData({
      id: '',
      name: '',
      price: '',
      type: '',
      fabric: '',
      description: '',
      available: true,
      colors: [{ name: 'Grey', quantity: 100 }],
      customizationOptions: ['Sublimation Printing']
    });
    setIsEditing(false);
    setIsAdding(true);
  };

  // Handle closing the form
  const handleCloseForm = () => {
    setIsEditing(false);
    setIsAdding(false);
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle color quantity change
  const handleColorQuantityChange = (index, quantity) => {
    const updatedColors = [...editFormData.colors];
    updatedColors[index].quantity = quantity;
    setEditFormData({
      ...editFormData,
      colors: updatedColors
    });
  };

  // Handle adding a new color
  const handleAddColor = () => {
    if (editFormData.colors.length < COLOR_OPTIONS.length) {
      setEditFormData({
        ...editFormData,
        colors: [...editFormData.colors, { name: 'Black', quantity: 100 }]
      });
    }
  };

  // Handle removing a color
  const handleRemoveColor = (index) => {
    const updatedColors = [...editFormData.colors];
    updatedColors.splice(index, 1);
    setEditFormData({
      ...editFormData,
      colors: updatedColors
    });
  };

  // Handle color selection change
  const handleColorChange = (index, colorName) => {
    const updatedColors = [...editFormData.colors];
    updatedColors[index].name = colorName;
    setEditFormData({
      ...editFormData,
      colors: updatedColors
    });
  };

  // Handle customization option selection change
  const handleCustomizationChange = (option) => {
    if (editFormData.customizationOptions.includes(option)) {
      setEditFormData({
        ...editFormData,
        customizationOptions: editFormData.customizationOptions.filter(item => item !== option)
      });
    } else {
      setEditFormData({
        ...editFormData,
        customizationOptions: [...editFormData.customizationOptions, option]
      });
    }
  };

  // Handle save product 
  const handleSaveProduct = () => {
    const updatedProduct = {
      id: editFormData.id || `P${Math.floor(Math.random() * 1000)}`,
      name: editFormData.name,
      price: `RM ${editFormData.price}`,
      type: editFormData.type,
      fabric: editFormData.fabric,
      description: editFormData.description,
      available: editFormData.available,
      image: selectedProduct?.image || '/assets/placeholder.png',
      colors: editFormData.colors,
      customizationOptions: editFormData.customizationOptions
    };

    if (isEditing) {
      // Update existing product
      setProducts(products.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      ));
    } else if (isAdding) {
      // Add new product
      setProducts([...products, updatedProduct]);
    }

    // Close the form
    handleCloseForm();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
    {/* Header Section with right-aligned button */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-gray-800">Products</h2>
      <div className="flex items-center space-x-4">
        <button 
          className="bg-orange-600 text-white px-2 py-1 text-xs rounded-md flex items-center hover:bg-orange-700 transition-colors"
          onClick={handleAddNewProduct}
        >
          <span className="mr-1">+</span> Add Product
        </button>
      </div>
    </div>
    
    {/* Product List */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="bg-gray-50 border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex">
            <div className="w-1/3 p-4 flex items-center justify-center bg-white">
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-h-32 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/placeholder.png';
                }}
              />
            </div>
            <div className="w-2/3 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{product.id} {product.name}</h3>
                  <p className="text-gray-700 font-bold">{product.price}</p>
                </div>
                <div className={`h-3 w-3 rounded-full ${product.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              
              <div className="mt-2 text-sm">
                <p><span className="font-semibold">Type:</span> {product.type}</p>
                <p><span className="font-semibold">Fabric:</span> {product.fabric}</p>
                <p className="line-clamp-2 text-gray-600 mt-1">{product.description}</p>
              </div>
              
              <div className="mt-3 text-right">
                <button 
                  className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                  onClick={() => handleEditProduct(product)}
                >
                  Edit Product →
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  

      {/* Right Side - Edit Product Form (Conditionally Rendered) */}
      {(isEditing || isAdding) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-4 bg-orange-100 rounded-t-lg">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditing ? 'Edit Product Details' : 'Add New Product'}
              </h2>
              <button 
                className="text-gray-700 hover:text-gray-900"
                onClick={handleCloseForm}
              >
                ✖
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex space-x-6">
                {/* Left column - image */}
                <div className="w-1/3">
                  <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                    {selectedProduct?.image ? (
                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name} 
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/placeholder.png';
                        }}
                      />
                    ) : (
                      <div className="text-gray-400">No Image Available</div>
                    )}
                  </div>
                  <button className="mt-2 w-full py-2 border rounded bg-gray-50 hover:bg-gray-100 text-sm">
                    Edit Product Image
                  </button>
                </div>

                {/* Right column - form fields */}
                <div className="w-2/3 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
                      <input 
                        type="text" 
                        name="id" 
                        className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                        value={editFormData.id}
                        onChange={handleFormChange}
                        disabled={isEditing}
                        placeholder="Product ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                        value={editFormData.name}
                        onChange={handleFormChange}
                        placeholder="Product Name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                      <input 
                        type="text" 
                        name="type" 
                        className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                        value={editFormData.type}
                        onChange={handleFormChange}
                        placeholder="T-Shirt, Polo, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fabric</label>
                      <input 
                        type="text" 
                        name="fabric" 
                        className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                        value={editFormData.fabric}
                        onChange={handleFormChange}
                        placeholder="Cotton, Polyester, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (RM)</label>
                    <input 
                      type="text" 
                      name="price" 
                      className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                      value={editFormData.price}
                      onChange={handleFormChange}
                      placeholder="24.99"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700">Color Availability (Select Color and Assign Quantity)</label>
                      <button 
                        type="button"
                        onClick={handleAddColor}
                        className="text-xs text-orange-600 hover:text-orange-800"
                      >
                        + Add Color
                      </button>
                    </div>
                    
                    {editFormData.colors.map((color, index) => (
                      <div key={index} className="flex items-center space-x-2 mt-2">
                        <select
                          className="flex-grow px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                          value={color.name}
                          onChange={(e) => handleColorChange(index, e.target.value)}
                        >
                          {COLOR_OPTIONS.map((option) => (
                            <option key={option.name} value={option.name}>{option.name}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          className="w-24 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                          value={color.quantity}
                          onChange={(e) => handleColorQuantityChange(index, parseInt(e.target.value))}
                          min="0"
                        />
                        {editFormData.colors.length > 1 && (
                          <button 
                            type="button"
                            onClick={() => handleRemoveColor(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✖
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customized Option (Select Printing Method Provided)</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {CUSTOMIZATION_OPTIONS.map((option) => (
                        <div key={option} className="flex items-center">
                          <input
                            type="checkbox"
                            id={option.replace(/\s+/g, '')}
                            checked={editFormData.customizationOptions.includes(option)}
                            onChange={() => handleCustomizationChange(option)}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                          />
                          <label htmlFor={option.replace(/\s+/g, '')} className="ml-2 text-sm text-gray-700">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                    <textarea
                      name="description"
                      rows="4"
                      className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                      value={editFormData.description}
                      onChange={handleFormChange}
                      placeholder="Describe the product..."
                    ></textarea>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="available"
                      name="available"
                      checked={editFormData.available}
                      onChange={handleFormChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="available" className="ml-2 text-sm text-gray-700">
                      Product Available for Order
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button 
                      type="button"
                      onClick={handleCloseForm}
                      className="px-4 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      onClick={handleSaveProduct}
                      className="px-4 py-2 bg-orange-600 border border-transparent rounded shadow-sm text-sm font-medium text-white hover:bg-orange-700 focus:outline-none"
                    >
                      Save Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;