// AssignWorkerForm.jsx (frontend)

import { useState, useEffect } from 'react';
import { api } from '../api';

export default function AssignWorkerForm({ fabricId }) {
  const [workers, setWorkers] = useState([]);
  const [workerId, setWorkerId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch available workers (You can filter by role: 'worker')
    const fetchWorkers = async () => {
      try {
        const response = await api.get('/users?role=worker');
        setWorkers(response.data);
      } catch (error) {
        console.error('Error fetching workers', error);
      }
    };
    fetchWorkers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/fabric/assign-worker', { fabricId, workerId });
      setMessage('Worker assigned successfully!');
    } catch (error) {
      setMessage('Error assigning worker');
    }
  };

  return (
    <div>
      <h3>Assign Worker</h3>
      <form onSubmit={handleSubmit}>
        <label>Select Worker:</label>
        <select
          value={workerId}
          onChange={(e) => setWorkerId(e.target.value)}
          required
        >
          <option value="">Select Worker</option>
          {workers.map((worker) => (
            <option key={worker._id} value={worker._id}>
              {worker.name}
            </option>
          ))}
        </select>
        <button type="submit">Assign Worker</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
