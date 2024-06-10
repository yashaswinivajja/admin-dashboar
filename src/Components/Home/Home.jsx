import React, { useState, useEffect } from "react";
import "./Home.css";
import axios from "axios";
import setAuthHeaders from "../../Utils/SetAuthHeaders";

const Home = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        setAuthHeaders(token);
        const response = await axios.get(
          `${apiUrl}/admin/users`,
          { token },
          { withCredentials: true }
        );
        setUsers(response.data.allUsers);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching Users:", error);
      }
    };

    fetchUsers();
  }, [apiUrl]);

  const handleEdit = async (user) => {
    setEditingUser(user);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      setAuthHeaders(token);
      await axios.delete(`${apiUrl}/admin/users/${id}`, {
        withCredentials: true,
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting User:", error);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      setAuthHeaders(token);
      const response = await axios.put(
        `${apiUrl}/admin/users/${editingUser.id}`,
        editingUser,
        { withCredentials: true }
      );
      setUsers(
        users.map((user) => (user.id === editingUser.id ? response.data : user))
      );
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating User:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  return (
    <div className="home">
      <h1>User Management</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Phone Number</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.age}</td>
              <td>{user.gender}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div className="edit-form">
          <h2>Edit User</h2>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={editingUser.username}
              onChange={handleChange}
            />
          </label>
          <label>
            Age:
            <input
              type="number"
              name="age"
              value={editingUser.age}
              onChange={handleChange}
            />
          </label>
          <label>
            Gender:
            <select
              name="gender"
              value={editingUser.gender}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label>
            Phone Number:
            <input
              type="text"
              name="phone"
              value={editingUser.phone}
              onChange={handleChange}
            />
          </label>

          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditingUser(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};
export default Home;
