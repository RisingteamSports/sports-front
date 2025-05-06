import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../Header/header';
import { useParams } from "react-router-dom";
import axios from 'axios';

const MyTeamMembers = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topUsers, setTopUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [players, setPlayers] = useState([]);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const showPopup = (message, type) => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 3000);
  };
  const API_URL = "https://matc.matchdada.com/public/api";
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/teams/${id}/players`, { headers: { Authorization: `Bearer ${token}` } });
        setPlayers(response.data);
      } catch (err) {
        console.error("Failed to fetch players:", err);
        showPopup(`Error: Failed to fetch players`, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, [id]);

  useEffect(() => {
    if (isModalOpen) {
      const fetchTopUsers = async () => {
        setModalLoading(true);
        try {
          const token = localStorage.getItem("authToken");
          const response = await axios.get(`${API_URL}/all-users`, { headers: { Authorization: `Bearer ${token}` }, params: { search: searchQuery } });
          setTopUsers(response.data);
        } catch (err) {
          console.error("Failed to fetch All players:", err);
          showPopup(`Error: Failed to fetch users`, "error");
        } finally {
          setModalLoading(false);
        }
      };
      fetchTopUsers();
    }
  }, [isModalOpen, searchQuery]);

  const filteredUsers = searchQuery ? topUsers.filter(user => 
    user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user?.player_code?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : topUsers;

  const handleAddUser = async (user) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${API_URL}/add-user-to-team`,
        { userId: user.id, teamId: id }, // Ensure the payload matches the API expectation
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showPopup(response.data.message, "success");
      setIsModalOpen(false);
      
      // Refresh the players list
      const updatedPlayers = await axios.get(`${API_URL}/teams/${id}/players`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlayers(updatedPlayers.data);
    } catch (err) {
      if (err.response && err.response.data.error) {
        showPopup(err.response.data.error, "error");
      } else {
        showPopup("Failed to add user to team. Please try again.", "error");
      }
    }
  };
  const handleDeletePlayer = async (playerId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.delete(`${API_URL}/teams/${id}/players/${playerId}`, { headers: { Authorization: `Bearer ${token}` } });
      showPopup(response.data.message, "success");
      setPlayers(players.filter(player => player.id !== playerId)); // Remove player from the list
    } catch (err) {
      showPopup("Failed to delete player. Please try again.", "error");
    }
  };

  if (loading) return <LoaderContainer><div className="spinner-border text-warning" role="status"><span className="visually-hidden">Loading...</span></div></LoaderContainer>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
    <Navbar />
    <StyledWrapper>
      <div className="container m-auto p-3">
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-warning me-2" onClick={() => setIsModalOpen(true)}>Add New Member</button>
        </div>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Role</th>
                <th>Player Code</th>
                <th>Total Matches</th>
                <th>Won</th>
                <th>Loss</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={index}>
                  <td><ProfileImage src={player.profile_picture ? `https://matc.matchdada.com/storage/app/public/${player.profile_picture}` : "https://via.placeholder.com/150"} alt={player.username} /></td>
                  <td>{player.username}</td>
                  <td>{player.role}</td>
                  <td>{player.player_code}</td>
                  <td>{player.total_matches}</td>
                  <td>{player.matches_won}</td>
                  <td>{player.matches_loss}</td>
                  <td>
                    <button className="btn btn-primary btn-sm me-2">profile</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeletePlayer(player.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </div>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <h3>Add New Member</h3>
              <button onClick={() => setIsModalOpen(false)}>&times;</button>
            </ModalHeader>
            <SearchBar type="text" placeholder="Search users by name, player code, or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            {modalLoading ? <LoaderContainer><div className="spinner-border text-warning" role="status"><span className="visually-hidden">Loading...</span></div></LoaderContainer> : (
              <UserList>
                {filteredUsers.map((user) => (
                  <UserItem key={user.id} onClick={() => handleAddUser(user)}>
                    <img src={`https://matc.matchdada.com/storage/app/public/${user.profile_picture}`} alt={user.username} />
                    <div>
                      <h4>{user.username}</h4>
                      <p><strong>Player Code:</strong> {user.player_code}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Role:</strong> {user.role}</p>
                    </div>
                  </UserItem>
                ))}
              </UserList>
            )}
          </ModalContent>
        </ModalOverlay>
      )}

      {popup.show && (
        <Popup type={popup.type}>
          {popup.message}
        </Popup>
      )}
    </StyledWrapper>
    </>
  );
};

// Styled Components
const StyledWrapper = styled.div`
  .btn-warning {
    background-color: #ffc107;
    border-color: #ffc107;
    color: #000;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  th {
    background-color: #f8f9fa;
    font-weight: bold;
  }
  tr:hover {
    background-color: #f1f1f1;
  }
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  h3 {
    margin: 0;
  }
  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }
  h4 {
    margin: 0;
    font-size: 1rem;
  }
  p {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Popup = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 5px;
  background-color: ${({ type }) => (type === "success" ? "#4CAF50" : "#F44336")};
  color: white;
  font-size: 1rem;
  z-index: 1000;
  animation: slideIn 0.5s ease-out;

  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
`;

export default MyTeamMembers;