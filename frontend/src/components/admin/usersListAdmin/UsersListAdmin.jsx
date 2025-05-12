import { useEffect, useState } from "react";
import AdminPageTitle from "../../comman/AdminPageTitle";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../../services/apiServices";
import { Select } from "flowbite-react";
import { api } from "../../../api";
import { PageMeta } from "../../comman/PageMeta";

function UsersListAdmin() {

  function getImage(value) {
    return "/images/profile.png";
  }

// Handle user delete
async function handleDeleteUser(userId) {
  try {
    const res = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete user");

    console.log("User deleted:", userId);
  } catch (error) {
    console.error("Delete error:", error);
  }
}
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    getAllUsers()
      .then((data) => {
        const processed = data.map((users) => ({
          ...users,
          fullName: `${users.fname} ${users.lname}`, // 👈 computed field
        }));
        setUsers(processed);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

    const handleRoleChange = async (userId, newRole) => {
      console.log("User ID:", userId);
      console.log("New Role:", newRole);
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
  
    async function handleDelete(id) {
      const input = window.confirm("Are you sure you want to delete this?");
      // if (input) {
      //   // await deleteItem(id);
      //   alert("Deleted successfully.");
      //   const data = await getAllUsers();
      //   const processed = data.data.map((user) => ({
      //     ...user,
      //     fullName: `${user.fname} ${user.lname}`,
      //   }));
      //   setItems(processed);
      // }
    }
console.log('items',users)
  return (
    <div>
      <PageMeta
              title="All Users | Tex Bill"
              description="User profile dashboard for Tex Bill application"
            />
      <AdminPageTitle title="Users" />
      <div className="mt-8">
        {users.map((value) => (
          <div key={value._id}>
            <div className="flex items-center gap-2 py-2 border-b border-b-slate-300 dark:border-b-gray-700">
              <div className="w-16 h-16 shrink-0 rounded-full border border-slate-300 dark:border-gray-600 overflow-hidden">
                <img
                  src={getImage()}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grow-[1]">
                <h3 className="font-bold text-gray-800 dark:text-white">{value.fullName}</h3>
              </div>

              <div className="flex items-center gap-2">
                {value.role === "admin" ? (
                  <span className="text-sm text-green-600 dark:text-green-400 font-bold">
                    Admin
                  </span>
                ) : (
                  <Select
                    className="w-24 dark:bg-gray-800 dark:text-white"
                    value={value.role}
                    onChange={(e) => handleRoleChange(value._id, e.target.value)}
                  >
                    <option value="buyer">Buyer</option>
                    <option value="worker">Worker</option>
                  </Select>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      </div>
    );
}

export default UsersListAdmin;
