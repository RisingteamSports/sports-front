import React, { useState } from 'react';
import axios from 'axios';

const CreateMatchModal = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  // Step 1 states - Team Information
  const [teamName, setTeamName] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [players, setPlayers] = useState([
    { name: '', role: 'batsman', image: null }
  ]);

  // Step 2 states - Match Information
  const [selectedCategory, setSelectedCategory] = useState({});
  const [security, setSecurity] = useState('no');
  const [securityAmount, setSecurityAmount] = useState('');
  const [matchBid, setMatchBid] = useState('no');
  const [matchDatetime, setMatchDatetime] = useState('');
  const [ballType, setBallType] = useState('tape');
  const [venue, setVenue] = useState('');
  const [match_status, setMatch_status] = useState('available');
  const [overs, setOvers] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const API_URL = "https://matc.matchdada.com/public/api";

  // Retrieve user ID from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;

  const categories = [
    { name: 'Football', icon: 'fa-futbol' },
    { name: 'Cricket', icon: 'fa-basketball-ball' },
    { name: 'Tennis', icon: 'fa-volleyball-ball' },
  ];

  const provinces = [
    'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 
    'Islamabad', 'Gilgit-Baltistan', 'Azad Jammu & Kashmir'
  ];

  const citiesByProvince = {
    Punjab: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala'],
    Sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana'],
    'Khyber Pakhtunkhwa': ['Peshawar', 'Abbottabad', 'Mardan', 'Swat'],
    Balochistan: ['Quetta', 'Gwadar', 'Khuzdar', 'Turbat'],
    Islamabad: ['Islamabad'],
    'Gilgit-Baltistan': ['Gilgit', 'Skardu'],
    'Azad Jammu & Kashmir': ['Muzaffarabad', 'Mirpur', 'Rawalakot'],
  };

  const playerRoles = [
    'batsman', 'bowler', 'all-rounder', 'wicket-keeper', 'captain'
  ];

  // Handle player input change
  const handlePlayerChange = (index, field, value) => {
    const updatedPlayers = [...players];
    updatedPlayers[index][field] = value;
    setPlayers(updatedPlayers);
  };

  // Handle player image upload
  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handlePlayerChange(index, 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a new player
  const addPlayer = () => {
    if (players.length < 11) {
      setPlayers([...players, { name: '', role: 'batsman', image: null }]);
    }
  };

  // Remove a player
  const removePlayer = (index) => {
    if (players.length > 1) {
      const updatedPlayers = [...players];
      updatedPlayers.splice(index, 1);
      setPlayers(updatedPlayers);
    }
  };

  // Generate a random join code
  const generateJoinCode = () => {
    const code = Math.random().toString(36).substr(2, 8).toUpperCase();
    setJoinCode(code);
  };

  // Check if step 1 is complete (minimum 1 player required)
  const isStep1Complete = () => {
    return (
      teamName.trim() !== '' &&
      captainName.trim() !== '' &&
      players[0].name.trim() !== '' // At least first player must be filled
    );
  };

  // Handle category selection
  const handleCategorySelect = (category) => setSelectedCategory(category);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User not found. Please log in.");
      return;
    }

    const matchData = {
      user_id: userId,
      team_name: teamName,
      captain_name: captainName,
      players: players,
      category: selectedCategory.name || '',
      security,
      security_amount: security === 'yes' ? securityAmount : null,
      match_bid: matchBid,
      match_datetime: matchDatetime,
      ball_type: ballType,
      venue,
      match_status,
      overs,
      join_code: joinCode,
      city,
      province,
    };

    console.log(matchData);

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found.");
      setToast({ show: true, message: "No authentication token found. Please log in.", type: "error" });
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/matches`,
        matchData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Match created:", response.data);
      setToast({ show: true, message: "Match created successfully!", type: "success" });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setToast({ show: true, message: "Join code already exists. Please generate a new code.", type: "error" });
        generateJoinCode();
      } else {
        console.error("Error creating match:", error);
        setToast({ show: true, message: "An error occurred. Please try again.", type: "error" });
      }
    }
  };

  return (
    <>
      {/* Toast Notification */}
      <div
        className={`toast position-fixed top-0 end-0 m-3 ${toast.show ? "show" : "hide"}`}
        style={{ zIndex: 1050 }}
      >
        <div className={`toast-header bg-${toast.type} text-white`}>
          <strong className="me-auto">
            {toast.type === "success" ? "Success" : "Error"}
          </strong>
          <button
            type="button"
            className="btn-close"
            onClick={() => setToast({ show: false, message: "", type: "" })}
          ></button>
        </div>
        <div className="toast-body">{toast.message}</div>
      </div>

      {/* Create Match Modal */}
      <div id="createMatchModal" className="modal fade" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New Match (Step {currentStep} of {totalSteps})</h5>
              <button type="button" className="btn-close text-danger" data-bs-dismiss="modal" aria-label="Close">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              {/* Progress Bar */}
              <div className="progress mb-4">
                <div 
                  className="progress-bar bg-success" 
                  role="progressbar" 
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  aria-valuenow={currentStep}
                  aria-valuemin="1"
                  aria-valuemax={totalSteps}
                ></div>
              </div>

              {/* Step 1: Team Information */}
              {currentStep === 1 && (
                <div className="team-info-step">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Team Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Enter your team name"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Captain Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={captainName}
                        onChange={(e) => setCaptainName(e.target.value)}
                        placeholder="Enter captain name"
                        required
                      />
                    </div>
                  </div>

                  <h5 className="mt-4 mb-3">Team Members (1-11 Players)</h5>
                  <div className="players-container">
                    {players.map((player, index) => (
                      <div key={index} className="player-card mb-3">
                        <div className="card">
                          <div className="card-body p-2">
                            <div className="row align-items-center">
                              {/* Player Image */}
                              <div className="col-md-2 text-center">
                                {player.image ? (
                                  <img 
                                    src={player.image} 
                                    alt={`Player ${index + 1}`} 
                                    className="img-thumbnail rounded-circle mb-1"
                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-1 mx-auto"
                                    style={{ width: '60px', height: '60px' }}>
                                    <i className="fas fa-user text-secondary"></i>
                                  </div>
                                )}
                                <input
                                  type="file"
                                  className="form-control form-control-sm"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(index, e)}
                                  style={{ fontSize: '0.75rem' }}
                                />
                              </div>
                              
                              {/* Player Details */}
                              <div className="col-md-8">
                                <div className="row g-2">
                                  <div className="col-md-8">
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={player.name}
                                      onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                                      placeholder="Player name"
                                    />
                                  </div>
                                  <div className="col-md-4">
                                    <select
                                      className="form-select form-select-sm"
                                      value={player.role}
                                      onChange={(e) => handlePlayerChange(index, 'role', e.target.value)}
                                    >
                                      {playerRoles.map(role => (
                                        <option key={role} value={role}>
                                          {role.charAt(0).toUpperCase() + role.slice(1).replace('-', ' ')}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Remove Button */}
                              <div className="col-md-2 text-end">
                                {players.length > 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => removePlayer(index)}
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add Player Button */}
                    {players.length < 11 && (
                      <div className="text-center mt-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={addPlayer}
                        >
                          <i className="fas fa-plus me-1"></i> Add Player
                        </button>
                      </div>
                    )}
                    
                    <div className="text-muted small mt-2">
                      Note: Minimum 1 player required. You can add up to 11 players.
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Match Information */}
              {currentStep === 2 && (
                <div className="match-info-step">
                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <label className="form-label">Category</label>
                      <div className="dropdown">
                        <button className="btn btn-light" type="button" data-bs-toggle="dropdown" style={{ width: "180px" }}>
                          {selectedCategory.name ? (
                            <><i className={`fas ${selectedCategory.icon} me-3`}></i>{selectedCategory.name}</>
                          ) : "Select Category"}
                        </button>
                        <ul className="dropdown-menu shadow">
                          {categories.map((category) => (
                            <li key={category.name}>
                              <a className="dropdown-item" href="#" onClick={() => handleCategorySelect(category)}>
                                <i className={`fas ${category.icon} me-2`}></i> {category.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Security</label>
                      <select className="form-select me-4" onChange={(e) => setSecurity(e.target.value)} style={{ width: "100px" }}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Match Bid</label>
                      <select className="form-select" onChange={(e) => setMatchBid(e.target.value)} style={{ width: "100px" }}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                        <option value="100">100</option>
                        <option value="200">200</option>
                      </select>
                    </div>
                  </div>

                  {security === "yes" && (
                    <div className="mb-3">
                      <label className="form-label">Security Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        value={securityAmount}
                        onChange={(e) => setSecurityAmount(e.target.value)}
                        placeholder="Enter security amount"
                        min="0"
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Match Date & Time</label>
                    <input type="datetime-local" className="form-control" onChange={(e) => setMatchDatetime(e.target.value)} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Ball Type</label>
                    <select className="form-select" onChange={(e) => setBallType(e.target.value)}>
                      <option value="tape">Tape Ball</option>
                      <option value="hard">Hard Ball</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Venue</label>
                    <input type="text" className="form-control" onChange={(e) => setVenue(e.target.value)} placeholder="Enter venue" />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Overs</label>
                    <input type="number" className="form-control" min={1} onChange={(e) => setOvers(e.target.value)} placeholder="Enter number of overs" />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Province (Pakistan)</label>
                    <select className="form-select" value={province} onChange={(e) => {
                      setProvince(e.target.value);
                      setCity('');
                    }}>
                      <option value="">Select Province</option>
                      {provinces.map((prov) => <option key={prov} value={prov}>{prov}</option>)}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">City</label>
                    <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)} disabled={!province}>
                      <option value="">Select City</option>
                      {province && citiesByProvince[province]?.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Join Code</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="Enter or generate a join code"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={generateJoinCode}
                      >
                        Generate Code
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {currentStep > 1 && (
                <button 
                  type="button" 
                  className="btn btn-secondary me-auto"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Previous
                </button>
              )}
              
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              
              {currentStep < totalSteps ? (
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!isStep1Complete()}
                >
                  Next
                </button>
              ) : (
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={handleSubmit}
                >
                  Create Match
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateMatchModal;