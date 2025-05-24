// components/fabrics/FabricForm.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../helper/apiHelper';
import ImageUploader from '../ui/ImageUploader';

const FabricForm = ({ 
  initialData = {}, 
  isEditing = false, 
  onSuccessRedirect = '/buyer/fabrics',
  onCancelRedirect = '/buyer/fabrics',
  fabricId = null,
  workers = [],
  onClose,
  onSuccess
}) => {
  const navigate = useNavigate();
  const imageUploaderRef = useRef();
  const [formData, setFormData] = useState({
    buyerId: '',
    name: '',
    description: '',
    unit: 'meters',
    quantity: 0,
    unitPrice: 0,
    imageUrl: '',
    workerId: '',
    ...initialData
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [oldImageUrl, setOldImageUrl] = useState(initialData.imageUrl || '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (imageUrl) => {
    setTempImageUrl(imageUrl);
  };

  const handleImageDelete = async () => {
    try {
      if (oldImageUrl) {
        const filename = oldImageUrl.split('/').pop();
        await api.delete(`/upload/${filename}`);
      }
      setOldImageUrl('');
      setTempImageUrl('');
      setFormData(prev => ({
        ...prev,
        imageUrl: ''
      }));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let finalImageUrl = formData.imageUrl;

      // If there's a new image to upload
      if (imageUploaderRef.current) {
        try {
          const uploadedImageUrl = await imageUploaderRef.current.handleUpload();
          if (uploadedImageUrl) {
            finalImageUrl = uploadedImageUrl;
          }
        } catch (err) {
          throw new Error('Failed to upload image');
        }
      }

      // If we're editing and have a new image, delete the old one
      if (isEditing && oldImageUrl && finalImageUrl !== oldImageUrl) {
        try {
          const filename = oldImageUrl.split('/').pop();
          await api.delete(`/upload/${filename}`);
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }

      // Update form data with final image URL
      const updatedFormData = {
        ...formData,
        imageUrl: finalImageUrl
      };

      let response;
      if (isEditing) {
        response = await api.put(`/fabrics/${fabricId}`, updatedFormData);
        if (response.data.success) {
  
          if (onSuccess) {
            onSuccess(response.data.data);
          }
          if (onClose) {
            onClose();
          }
          if (!onClose) {
            navigate(onSuccessRedirect);
          }
          return; // Add return to prevent error from being set
        }
      } else {
        response = await api.post('/fabrics', updatedFormData);
        if (response.data.success) {
          // Call onSuccess callback with the new fabric data
          if (onSuccess) {
            onSuccess(response.data.data.fabric);
          }
          if (onClose) {
            onClose();
          }
          navigate(onSuccessRedirect);
          return; // Add return to prevent error from being set
        }
      }

      // If we get here, the response was not successful
      throw new Error(response.data.error || (isEditing ? 'Failed to update fabric' : 'Failed to add fabric'));
    } catch (err) {
      setError(err.response?.data?.error || err.message || 
        (isEditing ? 'Failed to update fabric' : 'Failed to add fabric'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        {isEditing ? 'Edit Fabric' : 'Add New Fabric'}
      </h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-sm">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 mb-4 border border-gray-200 dark:border-gray-700">
        {/* Worker Assignment Field */}
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-3" htmlFor="workerId">
            Assign to Worker (Optional)
          </label>
          <select
            id="workerId"
            name="workerId"
            value={formData.workerId}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select a worker</option>
            {workers.map(worker => (
              <option key={worker._id} value={worker._id}>
                {worker.name} 
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Select a worker to assign to this fabric
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-3" htmlFor="name">
            Fabric Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-3" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            rows="3"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-3" htmlFor="unit">
              Unit
            </label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="meters">Meters</option>
              <option value="yards">Yards</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-3" htmlFor="quantity">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="0"
              step="0.01"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-3" htmlFor="unitPrice">
              Unit Price ($)
            </label>
            <input
              type="number"
              id="unitPrice"
              name="unitPrice"
              min="0"
              step="0.01"
              value={formData.unitPrice}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-3">
            Fabric Image
          </label>
          <ImageUploader
            ref={imageUploaderRef}
            onImageUpload={handleImageUpload}
            initialImageUrl={formData.imageUrl}
            onDelete={handleImageDelete}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditing ? 'Updating...' : 'Saving...'}
              </span>
            ) : (
              isEditing ? 'Update Fabric' : 'Save Fabric'
            )}
          </button>
          <button
            type="button"
            onClick={() => onClose ? onClose() : navigate(onCancelRedirect)}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FabricForm;