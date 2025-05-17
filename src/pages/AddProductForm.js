import React, { useState } from "react";
import axios from "axios";

const COLOR_OPTIONS = [
  { name: 'Grey', code: '#A9A9A9' },
  { name: 'Black', code: '#000000' },
  { name: 'White', code: '#FFFFFF' },
  { name: 'Navy Blue', code: '#000080' },
  { name: 'Dark Blue', code: '#00008B' },
  { name: 'Red', code: '#FF0000' }
];
const CUSTOMIZATION_OPTIONS = ['Screen Printing', 'Heat Transfer Printing', 'Sublimation Printing', 'Embroidery', 'Vinyl Printing'];
const AVAILABLE_SIZE=["XS", "S","M","L","XL","2XL","3XL","4XL"];
const AddProductForm = ({ onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    fabric: "",
    price: "",
    colors: [{ name: "Red", quantity: 0 }],
    customizationOptions: [],
    availableSizes: [], 
    description: "",
    available: false,
    image: null,
  });

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const handleAddColor = () => {
    setFormData({
      ...formData,
      colors: [...formData.colors, { name: "Red", quantity: 0 }],
    });
  };

  const handleColorChange = (index, name) => {
    const colors = [...formData.colors];
    colors[index].name = name;
    setFormData({ ...formData, colors });
  };

  const handleColorQuantityChange = (index, quantity) => {
    const colors = [...formData.colors];
    colors[index].quantity = quantity;
    setFormData({ ...formData, colors });
  };

  const handleRemoveColor = (index) => {
    const colors = [...formData.colors];
    colors.splice(index, 1);
    setFormData({ ...formData, colors });
  };

  const handleCustomizationChange = (option) => {
    const options = formData.customizationOptions.includes(option)
      ? formData.customizationOptions.filter((opt) => opt !== option)
      : [...formData.customizationOptions, option];
    setFormData({ ...formData, customizationOptions: options });
  };

  const handleSizeChange = (size) => {
      const newSizes =formData.availableSizes.includes(size)
        ? formData.availableSizes.filter(s => s !== size) // remove if already exists
        : [...formData.availableSizes, size]; // add if not exists
      setFormData({...formData,availableSizes:newSizes});

    };
  


  const uploadImage = async (image) => {
    try {
      // Validate the input
      if (!image) {
        throw new Error("No image file provided");
      }

      // Create FormData and append the image
      const formData = new FormData();
      formData.append("image", image); // Ensure the field name matches backend's expectation

      // Send the image to the backend
      const response = await axios.post(
        "http://localhost:8080/products/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
          // Optional: Track upload progress
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload progress: ${percentCompleted}%`);
          },
        }
      );

      // Optional: Validate the response structure
      if (!response.data || !response.data.imageUrl) {
        throw new Error("No image URL received from the server");
      }

      return response.data.imageUrl; // Returning the image URL
    } catch (error) {
      console.error("Error uploading image:", error);
      // Enhanced error message
      if (error.response) {
        console.error("Server response data:", error.response.data);
        throw new Error(error.response.data.message || `Image upload failed with status ${error.response.status}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        throw new Error("No response received from server");
      } else {
        console.error("Request setup error:", error.message);
        throw new Error(error.message);
      }
    }
  };

  const validateForm = () => {
    if (
      !formData.id ||
      !formData.image ||
      !formData.name ||
      !formData.type ||
      !formData.fabric ||
      !formData.price ||
      isNaN(formData.price) ||
      !formData.description ||
      formData.colors.length === 0 ||
      !formData.colors.every((color) => color.name && color.quantity > 0) ||
      formData.customizationOptions.length === 0||
      formData.availableSizes.length === 0
    ) {
      alert("Please fill in all required fields and ensure all values are valid.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Selected sizes:", formData.availableSizes); // <- Add this
    // Validate form before proceeding
    if (!validateForm()) return;

    try {
      // Upload image first and get the image URL
      const imageUrl = await uploadImage(formData.image);

      // Prepare product data, including the uploaded image URL
      const productData = {
        ...formData,
        imageUrl,
        price: parseFloat(formData.price), // Ensure price is a valid number
      };

      // Submit product data to backend
      const response = await axios.post("http://localhost:8080/products/add", productData);

      // On successful save
      console.log("Product added successfully", response.data);
      onSaveSuccess(response.data);

      // Reset form after successful submission
      setFormData({
        id: "",
        name: "",
        type: "",
        fabric: "",
        price: "",
        colors: [{ name: "Red", quantity: 0 }],
        customizationOptions: [],
        availableSizes: [], 
        description: "",
        available: false,
        image: null,
      });

      // Close the form/modal
      window.location.reload();
    } catch (error) {
      // Display error message to the user
      console.error("Error saving product:", error.response ? error.response.data : error.message);
      alert(`Error saving product: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-4 bg-orange-100 rounded-t-lg">
          <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-700 hover:text-gray-900"
          >
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex space-x-6">
            <div className="w-1/3">
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                {formData.image ? (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt={formData.name}
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
                required
              />
              <label
                htmlFor="imageUpload"
                  className="mt-2 w-full py-2 border border-gray-400 rounded bg-gray-50 hover:bg-gray-100 text-sm text-center cursor-pointer block text-gray-700 font-medium"
              >
                Upload Product Image*
              </label>
            </div>

            <div className="w-2/3 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product ID*</label>
                  <input
                    type="text"
                    name="id"
                className="w-full px-3 py-2 border border-gray-500 rounded text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    value={formData.id}
                    onChange={handleFormChange}
                    placeholder="Product ID"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
                  <input
                    type="text"
                    name="name"
               className="w-full px-3 py-2 border border-gray-500 rounded text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"

                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Product Name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Type*</label>
                  <input
                    type="text"
                    name="type"
                    className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                    value={formData.type}
                    onChange={handleFormChange}
                    placeholder="T-Shirt, Polo, etc."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fabric*</label>
                  <input
                    type="text"
                    name="fabric"
                    className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                    value={formData.fabric}
                    onChange={handleFormChange}
                    placeholder="Cotton, Polyester, etc."
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (RM)*</label>
                <input
                  type="number"
                  name="price"
                  className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                  value={formData.price}
                  onChange={handleFormChange}
                  placeholder="24.99"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Color Availability*</label>
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="text-xs text-orange-600 hover:text-orange-800"
                  >
                    + Add Color
                  </button>
                </div>

                {formData.colors.map((color, index) => (
                  <div key={`${color.name}-${index}`} className="flex items-center space-x-2 mt-2">
                    <select
                      className="flex-grow px-3 py-2 border border-gray-400 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                      value={color.name}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      required
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
                      min="1"
                      required
                    />
                    {formData.colors.length > 1 && (
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Customization Options*</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {CUSTOMIZATION_OPTIONS.map((option) => (
                    <div key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        id={option.replace(/\s+/g, '')}
                        checked={formData.customizationOptions.includes(option)}
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
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Sizes*</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {AVAILABLE_SIZE.map((size) => (
                    <div key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        id={size.replace(/\s+/g,'')}
                        checked={formData.availableSizes.includes(size)}
                        onChange={() => handleSizeChange(size)}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor={size.replace(/\s+/g,'')} className="ml-2 text-sm text-gray-700">
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                <textarea
                  name="description"
                  className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                  rows={4}
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Enter product description"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="available"
                  name="available"
                  checked={formData.available}
                  onChange={handleFormChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="available" className="ml-2 text-sm text-gray-700">
                  Product Available for Order
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;