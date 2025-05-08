import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/users", {
          headers: { "x-auth-token": localStorage.getItem("token") }
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/update-role/${userId}`, { role: newRole }, {
        headers: { "x-auth-token": localStorage.getItem("token") }
      });
      // Refresh users
      setUsers(users.map(user => (user._id === userId ? { ...user, role: newRole } : user)));
    } catch (error) {
      console.error("Error updating role", error);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select 
                  value={user.role} 
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="buyer">Buyer</option>
                  <option value="worker">Worker</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
