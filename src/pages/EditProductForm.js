import React, { useState, useEffect } from 'react';
import axios from "axios";

const COLOR_OPTIONS = [
  { name: 'Grey', code: '#A9A9A9' },
  { name: 'Black', code: '#000000' },
  { name: 'White', code: '#FFFFFF' },
  { name: 'Navy Blue', code: '#000080' },
  { name: 'Dark Blue', code: '#00008B' },
  { name: 'Red', code: '#FF0000' }
];

const CUSTOMIZATION_OPTIONS = [
  'Screen Printing',
  'Heat Transfer Printing',
  'Sublimation Printing',
  'Embroidery',
  'Vinyl Printing'
];

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
    imageUrl: '',
  });

  // Populate form with existing product data if available
  useEffect(() => {
    console.log("Loaded product:", product); // Add this
    console.log("Product image URL:", product.imageUrl); // ✅

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
        imageUrl: product.imageUrl || '/assets/placeholder.png', // Set a fallback image URL
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
      const previewUrl = URL.createObjectURL(file); // generate preview URL
      setEditFormData((prevData) => ({
        ...prevData,
        image: file, // the actual file for upload
        imageUrl: previewUrl, // this shows the image immediately
      }));
    }
  };

  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     // You can show the preview using URL.createObjectURL
  //     setEditFormData((prevData) => ({
  //       ...prevData,
  //       imageFile: file,
  //       imageUrl: URL.createObjectURL(file),
  //     }));

  //     // After successful upload, update the image URL
  //     uploadImage(file);
  //   }
  // };
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
      !editFormData.id ||

      !editFormData.name ||
      !editFormData.type ||
      !editFormData.fabric ||
      !editFormData.price ||
      isNaN(editFormData.price) ||
      !editFormData.description ||
      editFormData.colors.length === 0 ||
      !editFormData.colors.every((color) => color.name && color.quantity > 0) ||
      editFormData.customizationOptions.length === 0
    ) {
      alert("Please fill in all required fields and ensure all values are valid.");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    try {
      let imageUrl = editFormData.imageUrl;

      // If an image file has been selected, upload it
      if (editFormData.imageFile) {
        const formData = new FormData();
        formData.append("file", editFormData.imageFile);
        formData.append("productId", editFormData.id);

        const uploadResponse = await fetch(`http://localhost:8080/products/upload-image`, {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadData.message || "Image upload failed");
        }

        imageUrl = uploadData.imageUrl; // Update with uploaded image URL
      }

      const productToUpdate = {
        ...editFormData,
        imageUrl, // Ensure image URL is sent with update
        colors: editFormData.colors.map(c => ({
          name: c.name,
          quantity: c.quantity,
        })),
        customizationOptions: editFormData.customizationOptions,
      };

      const updateResponse = await fetch(
        `http://localhost:8080/products/update/${editFormData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productToUpdate),
        }
      );

      if (!updateResponse.ok) {
        const errorData = await updateResponse.text();
        throw new Error(errorData || "Failed to update product");
      }

      alert("Product updated successfully!");
      window.location.reload(); // Refresh page

    } catch (error) {
      console.error("Update error:", error);
      alert(`Error updating product: ${error.message}`);
    }
  };
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

    try {
      const response = await fetch(`http://localhost:8080/products/delete/${editFormData.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete product");
      }

      alert("Product deleted successfully.");
      onClose(); // Close the modal
      window.location.reload(); // Refresh the page or refetch product list

    } catch (error) {
      console.error("Delete error:", error);
      alert(`Error deleting product: ${error.message}`);
    }
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

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex space-x-6">
            {/* Left column - image */}
            <div className="w-1/3">
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                {editFormData && editFormData.imageUrl ? (
                  <img
                    src={editFormData.imageUrl} // This will use the `imageUrl` directly
                    alt={editFormData.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/placeholder.png'; // fallback image
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
              <label
                htmlFor="imageUpload"
                className="mt-2 w-full py-2 border rounded bg-gray-50 hover:bg-gray-100 text-sm text-center cursor-pointer"
              >
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
                      {COLOR_OPTIONS.map((option, i) => (
                        <option key={i} value={option.name}>
                          {option.name}
                        </option>
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
                  {CUSTOMIZATION_OPTIONS.map((option, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={option}
                        checked={editFormData.customizationOptions.includes(option)}
                        onChange={() => handleCustomizationChange(option)}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor={option} className="ml-2 text-sm text-gray-700">
                        {option}
                      </label>
                    </div>
                  ))}
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

              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={handleDelete}
                >
                  Delete Product
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;
