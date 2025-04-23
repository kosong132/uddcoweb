import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddProductForm from './AddProductForm';
import EditProductForm from './EditProductForm';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);  // To manage the form mode (Add or Edit)
  const [selectedProduct, setSelectedProduct] = useState(null);  // Store product for editing

  // Fetch all products from the API
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/products/all');
      if (response.status === 200) {
        setProducts(response.data); // Assuming the API returns the products list as 'data'
      } else {
        console.error('Failed to fetch products:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // UseEffect to fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle the Add Product form opening
  const handleAddProduct = () => {
    setIsEditing(false);  // We are adding, so not editing
    setSelectedProduct(null);  // Reset selected product
    setIsFormVisible(true);  // Show the form
  };

  // Handle the Edit Product form opening
  const handleEditProduct = (product) => {
    setIsEditing(true);  // We are editing, so set to true
    setSelectedProduct(product);  // Set selected product to be edited
    setIsFormVisible(true);  // Show the form
  };

  // Handle closing of the form
  const handleCloseForm = () => {
    setIsFormVisible(false);  // Hide the form
  };

  // Handle product save success
  const handleSaveSuccess = (updatedProduct) => {
    // After saving the product, update the products list and close the form
    if (isEditing) {
      setProducts(products.map(product => product.id === updatedProduct.id ? updatedProduct : product));
    } else {
      setProducts([...products, updatedProduct]);
    }
    setSuccessMessage(isEditing ? 'Product updated successfully' : 'Product added successfully');
    setTimeout(() => setSuccessMessage(''), 3000);  // Clear success message after 3 seconds
    handleCloseForm();  // Close the form
  };


  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Header Section with right-aligned button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Products</h2>
        <div className="flex items-center space-x-4">
          <button
            className="bg-orange-600 text-white px-2 py-1 text-xs rounded-md flex items-center hover:bg-orange-700 transition-colors"
            onClick={handleAddProduct}
          >
            <span className="mr-1">+</span> Add Product
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm mb-4">
          {successMessage}
        </div>
      )}

      {/* Product List */}
      {products.length === 0 ? (
        <div className="text-gray-600 text-sm">Currently no product in this page.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-50 border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex">
                <div className="w-1/3 p-4 flex items-center justify-center bg-white">
                  <img
                    src={product.imageUrl || '/assets/placeholder.png'} // Fallback if imageUrl is not available
                    alt={product.name}
                    className="max-h-32 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/placeholder.png'; // Fallback image
                    }}
                  />
                </div>
                <div className="w-2/3 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{product.id} {product.name}</h3>
                      <p className="text-gray-700 font-bold">{product.price}</p>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${product.available ? 'bg-green-500' : 'bg-red-500'}`} />
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
      )}

      {/* Modal for Add/Edit form */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          {isEditing ? (
            <EditProductForm
              product={selectedProduct}
              onClose={handleCloseForm}
              onSaveSuccess={handleSaveSuccess}
            />
          ) : (
            <AddProductForm
              onClose={handleCloseForm}
              onSaveSuccess={handleSaveSuccess}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Product;
