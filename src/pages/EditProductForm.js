import React, { useState, useEffect } from 'react';

const EditProductForm = ({ product, onClose, onSaveSuccess }) => {
  const [editFormData, setEditFormData] = useState({
    id: '',
    name: '',
    type: '',
    fabric: '',
    price: '',
    colors: [],
    customizationOptions: [],
    description: '',
    available: false,
    image: '',
  });

  // Populate form with existing product data if available
  useEffect(() => {
    if (product) {
      setEditFormData({
        id: product.id,
        name: product.name,
        type: product.type,
        fabric: product.fabric,
        price: product.price,
        colors: product.colors || [],
        customizationOptions: product.customizationOptions || [],
        description: product.description,
        available: product.available,
        image: product.image || '',
      });
    }
  }, [product]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData((prevData) => ({
        ...prevData,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const handleSaveProduct = () => {
    // Handle product save (e.g., API call to update the product)
    onSaveSuccess(editFormData);
    onClose();  // Close the form after save
  };

  const handleAddColor = () => {
    setEditFormData((prevData) => ({
      ...prevData,
      colors: [...prevData.colors, { name: '', quantity: 0 }],
    }));
  };

  const handleColorChange = (index, value) => {
    const updatedColors = [...editFormData.colors];
    updatedColors[index].name = value;
    setEditFormData((prevData) => ({
      ...prevData,
      colors: updatedColors,
    }));
  };

  const handleColorQuantityChange = (index, value) => {
    const updatedColors = [...editFormData.colors];
    updatedColors[index].quantity = value;
    setEditFormData((prevData) => ({
      ...prevData,
      colors: updatedColors,
    }));
  };

  const handleRemoveColor = (index) => {
    const updatedColors = [...editFormData.colors];
    updatedColors.splice(index, 1);
    setEditFormData((prevData) => ({
      ...prevData,
      colors: updatedColors,
    }));
  };

  const handleCustomizationChange = (option) => {
    setEditFormData((prevData) => {
      const updatedCustomizationOptions = prevData.customizationOptions.includes(option)
        ? prevData.customizationOptions.filter((opt) => opt !== option)
        : [...prevData.customizationOptions, option];
      return {
        ...prevData,
        customizationOptions: updatedCustomizationOptions,
      };
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-4 bg-orange-100 rounded-t-lg">
          <h2 className="text-xl font-bold text-gray-800">Edit Product Details</h2>
          <button className="text-gray-700 hover:text-gray-900" onClick={onClose}>
            ✖
          </button>
        </div>

        <div className="p-6">
          <div className="flex space-x-6">
            {/* Left column - image */}
            <div className="w-1/3">
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                {editFormData.image ? (
                  <img
                    src={editFormData.image}
                    alt={editFormData.name}
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
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="imageUpload"
                onChange={handleImageUpload}
              />
              <label htmlFor="imageUpload" className="mt-2 w-full py-2 border rounded bg-gray-50 hover:bg-gray-100 text-sm text-center cursor-pointer">
                Edit Product Image
              </label>
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
                    disabled
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
                  <div key={`${color.name}-${index}`} className="flex items-center space-x-2 mt-2">
                    <select
                      className="flex-grow px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                      value={color.name}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                    >
                      <option value="Red">Red</option>
                      <option value="Blue">Blue</option>
                      <option value="Green">Green</option>
                      {/* Add more color options here */}
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
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="Printing"
                      checked={editFormData.customizationOptions.includes('Printing')}
                      onChange={() => handleCustomizationChange('Printing')}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="Printing" className="ml-2 text-sm text-gray-700">Printing</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="Embroidery"
                      checked={editFormData.customizationOptions.includes('Embroidery')}
                      onChange={() => handleCustomizationChange('Embroidery')}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="Embroidery" className="ml-2 text-sm text-gray-700">Embroidery</label>
                  </div>
                  {/* Add more customization options here */}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                  value={editFormData.description}
                  onChange={handleFormChange}
                  placeholder="Describe the product..."
                  rows="4"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                  onClick={handleSaveProduct}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductForm;
