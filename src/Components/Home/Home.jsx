import React, { useState, useEffect, useCallback } from "react";
import "./Home.css";
import axios from "axios";
import setAuthHeaders from "../../Utils/SetAuthHeaders";

const Home = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [viewVerified, setViewVerified] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      setAuthHeaders(token);
      const response = await axios.get(`${apiUrl}/api/v1/admin/users`, {
        params: {
          page,
          limit,
          search: searchQuery,
          ...filters,
          verified: viewVerified,
        },
        withCredentials: true,
      });
      setUsers(response.data.content);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching Users:", error);
    }
  }, [page, limit, searchQuery, filters, apiUrl, viewVerified]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      setAuthHeaders(token);
      await axios.delete(`${apiUrl}/api/v1/admin/users/${id}`, {
        withCredentials: true,
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting User:", error);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      setAuthHeaders(token);
      await axios.put(
        `${apiUrl}/api/v1/admin/users/${editingUser.id}`,
        editingUser,
        {
          withCredentials: true,
        }
      );

      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating User:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (e) => {
    setLimit(e.target.value);
  };

  const handleVerify = async (id) => {
    try {
      const token = localStorage.getItem("token");
      setAuthHeaders(token);
      await axios.put(
        `${apiUrl}/api/v1/admin/users/${id}/verify`,
        {},
        {
          withCredentials: true,
        }
      );
      fetchUsers();
    } catch (error) {
      console.error("Error verifying User:", error);
    }
  };

  return (
    <div className="home">
      <h1>User Management</h1>
      <div>
        <input
          type="text"
          placeholder="Search by username"
          value={searchQuery}
          onChange={handleSearch}
        />
        <button onClick={fetchUsers}>Search</button>
        <select name="role" onChange={handleFilterChange}>
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="tab-container">
        <button
          className={`tab ${viewVerified ? "active" : ""}`}
          onClick={() => setViewVerified(true)}
        >
          Verified
        </button>
        <button
          className={`tab ${!viewVerified ? "active" : ""}`}
          onClick={() => setViewVerified(false)}
        >
          Unverified
        </button>
      </div>
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
                {!user.verified && (
                  <button onClick={() => handleVerify(user.id)}>Verify</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          Previous
        </button>
        <button onClick={() => handlePageChange(page + 1)}>Next</button>
        <select onChange={handleLimitChange} value={limit}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
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
