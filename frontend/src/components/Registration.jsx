// Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/auth/register', form);
    navigate('/login');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="buyer">Buyer</option>
        <option value="worker">Worker</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
}
