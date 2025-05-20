import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../helper/apiHelper';

const AddFabricForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    buyerId: '',
    name: '',
    description: '',
    unit: 'meters',
    quantity: 0,
    unitPrice: 0,
    imageUrl: '',
    workerId: '' // Added workerId field
  });
  const [workers, setWorkers] = useState([]); // Added workers state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch buyers and workers on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch workers
        const workersResponse = await api.get('/workers/all');
        setWorkers(workersResponse.data.data);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/fabrics', formData);
      if (response.data.success) {
        navigate('/buyer/fabrics');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add fabric');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add New Fabric</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
       {/* Add Worker Assignment Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="workerId">
            Assign to Worker (Optional)
          </label>
          <select
            id="workerId"
            name="workerId"
            value={formData.workerId}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Worker (Optional)</option>
            {workers.map(worker => (
              <option key={worker._id} value={worker._id}>
                {worker.name} ({worker.skills?.join(', ') || 'No skills specified'})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Fabric Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="unit">
              Unit
            </label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="meters">Meters</option>
              <option value="yards">Yards</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="unitPrice">
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUrl">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          {formData.imageUrl && (
            <div className="mt-2">
              <img 
                src={formData.imageUrl} 
                alt="Preview" 
                className="h-32 object-contain border rounded"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Fabric'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/fabrics')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFabricForm;