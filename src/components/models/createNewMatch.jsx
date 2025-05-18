import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateMatchModal = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [checkingTeamName, setCheckingTeamName] = useState(false);
  const [selectedCard, setSelectedCard] = useState("silver");

  const [formData, setFormData] = useState({
    teamName: '',
    teamLogo: null,
    membership_tier: selectedCard,
    captainName: '',
    players: [{ name: '', role: 'Batsman', image: null }],
    category: '',
    security: 'no',
    securityAmount: '',
    matchBid: 'no',
    customBid: '',
    matchDatetime: '',
    ballType: 'tape',
    venue: '',
    matchStatus: 'available',
    overs: '',
    province: '',
    city: '',
    joinCode: '',
    rules: [],
    facilities: {},
    equipment: [],
    dressCode: '',
    paymentMethod: 'cash'
  });

  const [provinces] = useState([
    'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 
    'Islamabad', 'Gilgit-Baltistan', 'Azad Jammu & Kashmir'
  ]);

  const [cities, setCities] = useState([]);
  const [categories] = useState([
    { name: 'Cricket', icon: 'fa-cricket' },
    { name: 'Football', icon: 'fa-futbol' },
    { name: 'Tennis', icon: 'fa-tennis-ball' }
  ]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const API_URL = "https://matc.matchdada.com/public/api";

  const getCitiesByProvince = (province) => {
    const citiesMap = {
      Punjab: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan'],
      Sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana'],
      'Khyber Pakhtunkhwa': ['Peshawar', 'Abbottabad', 'Mardan'],
      Balochistan: ['Quetta', 'Gwadar', 'Turbat'],
      Islamabad: ['Islamabad'],
      'Gilgit-Baltistan': ['Gilgit', 'Skardu'],
      'Azad Jammu & Kashmir': ['Muzaffarabad', 'Mirpur']
    };
    return citiesMap[province] || [];
  };

  useEffect(() => {
    if (formData.province) {
      setCities(getCitiesByProvince(formData.province));
    }
  }, [formData.province]);

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.teamName.trim()) newErrors.teamName = 'Team name is required';
      if (!formData.captainName.trim()) newErrors.captainName = 'Captain name is required';
      formData.players.forEach((player, index) => {
        if (!player.name.trim()) newErrors[`player${index}Name`] = 'Player name is required';
      });
    }
    if (step === 2) {
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.matchDatetime) newErrors.matchDatetime = 'Match date/time is required';
      if (formData.security === 'yes' && !formData.securityAmount) 
        newErrors.securityAmount = 'Security amount is required';
      if (!formData.venue) newErrors.venue = 'Venue is required';
      if (!formData.overs) newErrors.overs = 'Overs are required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handlePlayerChange = (index, field, value) => {
    const updatedPlayers = [...formData.players];
    updatedPlayers[index][field] = value;
    setFormData(prev => ({ ...prev, players: updatedPlayers }));
  };

  const handleImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      handlePlayerChange(index, 'image', base64);
    }
  };

  const handleTeamLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setFormData(prev => ({ ...prev, teamLogo: base64 }));
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setFormData(prev => ({ ...prev, category: category.name }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error('Authentication required');
      if (!user?.id) throw new Error('User information missing');
  
      const payload = {
        user_id: user.id,
        team_name: formData.teamName,
        team_logo: formData.teamLogo,
        membership_tier: selectedCard,
        captain_name: formData.captainName,
        players: formData.players.map(player => ({
          name: player.name,
          role: player.role.toLowerCase().replace(' ', '_'),
          image: player.image
        })),
        category: formData.category,
        security: formData.security,
        security_amount: formData.security === 'yes' ? formData.securityAmount : null,
        match_bid: formData.matchBid, 
        custom_bid: formData.matchBid === 'yes' ? formData.customBid : null,
        match_datetime: new Date(formData.matchDatetime).toISOString(),
        ball_type: formData.ballType,
        venue: formData.venue,
        match_status: formData.matchStatus,
        overs: formData.overs,
        province: formData.province,
        city: formData.city,
        join_code: formData.joinCode || generateJoinCode(),
        rules: formData.rules,
        facilities: formData.facilities,
        equipment: formData.equipment,
        dress_code: formData.dressCode,
        payment_method: formData.paymentMethod
      };

      const response = await axios.post(`${API_URL}/matches`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.data.success) {
        showToast('Match created successfully!', 'success');
        setTimeout(() => window.location.reload(), 2000);
      } else {
        const errorMsg = response.data.message || 'Failed to create match';
        if (response.data.errors) {
          const errorString = Object.entries(response.data.errors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('; ');
          throw new Error(errorString);
        }
        throw new Error(errorMsg);
      }
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.errors ? 
                     JSON.stringify(error.response.data.errors) : 
                     error.message;
      showToast(message, 'error');
      if (error.response?.status === 409) {
        setFormData(prev => ({ ...prev, joinCode: generateJoinCode() }));
      }
    } finally {
      setSubmitting(false);
    }
  };
useEffect(() => {
  setFormData(prev => ({
    ...prev,
    membership_tier: selectedCard
  }));
}, [selectedCard]);
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  const generateJoinCode = () => {
    const code = Math.random().toString(36).substr(2, 8).toUpperCase();
    return code;
  };

  const addRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, '']
    }));
  };

  const updateRule = (index, value) => {
    const updatedRules = [...formData.rules];
    updatedRules[index] = value;
    setFormData(prev => ({ ...prev, rules: updatedRules }));
  };

  const removeRule = (index) => {
    const updatedRules = formData.rules.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, rules: updatedRules }));
  };

  const checkTeamNameExists = async (teamName) => {
    try {
      const token = localStorage.getItem("authToken");
      const user = JSON.parse(localStorage.getItem("user"));
  
      if (!token) throw new Error('Authentication required');
      if (!user?.id) throw new Error('User information missing');
  
      const response = await axios.get(`${API_URL}/check-team`, {
        params: { name: teamName },
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
  
      return response.data.exists;
    } catch (err) {
      console.error('Error checking team name:', err);
      return false;
    }
  };
  
  return (
    <div className="modal fade" id="createMatchModal" tabIndex="-1">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Create New Match</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body">
           <div className="row mb-4">
  <div className="col-md-4 mb-3 mb-md-0">
    <div
      className={`card border-0 p-3 h-100 transition-all ${selectedCard === "silver" ? "border-primary border-2 shadow-sm" : "border-light"}`}
      style={{ cursor: 'pointer' }}
      onClick={() => setSelectedCard("silver")}
    >
      <div className="text-center">
        <i className="fas fa-award text-secondary fa-3x mb-3"></i>
        <h5 className="mb-2">Silver</h5>
        <p className="text-muted small mb-0">
          Basic features for casual players Age (15-20)
        </p>
      </div>
      
    </div>
  </div>

  <div className="col-md-4 mb-3 mb-md-0">
    <div
      className={`card border-0 p-3 h-100 transition-all ${selectedCard === "gold" ? "border-warning border-2 shadow-sm" : "border-light"}`}
      style={{ cursor: 'pointer' }}
      onClick={() => setSelectedCard("gold")}
    >
      <div className="text-center">
        <i className="fas fa-medal text-warning fa-3x mb-3"></i>
        <h5 className="mb-2">Gold</h5>
        <p className="text-muted small mb-0">
          Enhanced features for regular players Age (20-30)
        </p>
      </div>
      
    </div>
  </div>

  <div className="col-md-4">
    <div
      className={`card border-0 p-3 h-100 transition-all ${selectedCard === "diamond" ? "border-info border-2 shadow-sm" : "border-light"}`}
      style={{ cursor: 'pointer' }}
      onClick={() => setSelectedCard("diamond")}
    >
      <div className="text-center">
        <i className="fas fa-gem text-info fa-3x mb-3"></i>
        <h5 className="mb-2">Diamond</h5>
        <p className="text-muted small mb-0">
          Premium features for serious competitors  Age (30 above)
        </p>
      </div>
      
    </div>
  </div>
</div>

            <div className="stepper-wrapper mb-5">
              {[1, 2, 3].map((step) => (
                <div key={step} className={`stepper-item ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
                  <div className="step-counter">
                    {currentStep > step ? <i className="fas fa-check"></i> : step}
                  </div>
                  <div className="step-name">Step {step}</div>
                </div>
              ))}
            </div>

            {currentStep === 1 && (
              <div className="team-info-step">
                <div className="row g-4">
                  <div className="col-12 text-center mb-3">
                    <div className="team-logo-upload">
                      <input
                        type="file"
                        className="d-none"
                        id="teamLogoUpload"
                        onChange={handleTeamLogoUpload}
                        accept="image/*"
                      />
                      <label 
                        htmlFor="teamLogoUpload" 
                        className="d-inline-block"
                        style={{ cursor: 'pointer' }}
                      >
                        {formData.teamLogo ? (
                          <img 
                            src={formData.teamLogo} 
                            alt="Team Logo"
                            className="rounded-circle border"
                            style={{
                              width: '120px',
                              height: '120px',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <div 
                            className="rounded-circle border d-flex flex-column align-items-center justify-content-center"
                            style={{
                              width: '120px',
                              height: '120px',
                              backgroundColor: '#f8f9fa'
                            }}
                          >
                            <i className="fas fa-camera fa-2x text-secondary mb-2"></i>
                            <small className="text-muted">Upload Team Logo</small>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Team Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.teamName ? 'is-invalid' : ''}`}
                        value={formData.teamName}
                        onChange={async (e) => {
                          const value = e.target.value;
                          setFormData(prev => ({ ...prev, teamName: value }));

                          if (value.trim() === '') {
                            setErrors(prev => ({ ...prev, teamName: 'Team name is required' }));
                            return;
                          }

                          setCheckingTeamName(true);
                          const exists = await checkTeamNameExists(value);
                          setCheckingTeamName(false);

                          setErrors(prev => ({
                            ...prev,
                            teamName: exists ? 'Team name already exists' : ''
                          }));
                        }}
                      />
                      {checkingTeamName && (
                        <div className="form-text text-primary small mt-1">
                          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                          Checking team name...
                        </div>
                      )}
                      {errors.teamName && <div className="invalid-feedback">{errors.teamName}</div>}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Captain Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.captainName ? 'is-invalid' : ''}`}
                        value={formData.captainName}
                        onChange={e => setFormData(prev => ({ ...prev, captainName: e.target.value }))}
                      />
                      {errors.captainName && <div className="invalid-feedback">{errors.captainName}</div>}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Age <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className={`form-control form-control-lg ${errors.captainName ? 'is-invalid' : ''}`}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Contact Number <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className={`form-control form-control-lg ${errors.captainName ? 'is-invalid' : ''}`}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <h5 className="mt-4 mb-3 text-primary">Team Members <small className="text-muted">(1-11 Players)</small></h5>
                    {formData.players.map((player, index) => (
                      <div key={index} className="card mb-3 shadow-sm">
                        <div className="card-body py-2">
                          <div className="row align-items-center g-3">
                            <div className="col-md-2">
                              <div className="avatar-upload">
                                <input
                                  type="file"
                                  className="d-none"
                                  id={`playerImage${index}`}
                                  onChange={e => handleImageUpload(index, e)}
                                  accept="image/*"
                                />
                                <label 
                                  htmlFor={`playerImage${index}`} 
                                  className="avatar-preview rounded-circle overflow-hidden d-block"
                                  style={{
                                    width: '80px',
                                    height: '80px',
                                    border: '2px solid #dee2e6',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {player.image ? (
                                    <img 
                                      src={player.image} 
                                      alt={`Player ${index + 1}`}
                                      className="w-100 h-100 object-fit-cover" 
                                    />
                                  ) : (
                                    <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                                      <i className="fas fa-camera fa-2x text-secondary"></i>
                                    </div>
                                  )}
                                </label>
                              </div>
                            </div>

                            <div className="col-md-8">
                              <div className="row g-2">
                                <div className="col-md-8">
                                  <input
                                    type="text"
                                    className={`form-control ${errors[`player${index}Name`] ? 'is-invalid' : ''}`}
                                    placeholder="Player name"
                                    value={player.name}
                                    onChange={e => handlePlayerChange(index, 'name', e.target.value)}
                                  />
                                  {errors[`player${index}Name`] && (
                                    <div className="invalid-feedback">{errors[`player${index}Name`]}</div>
                                  )}
                                </div>
                                <div className="col-md-4">
                                  <select
                                    className="form-select"
                                    value={player.role}
                                    onChange={e => handlePlayerChange(index, 'role', e.target.value)}
                                  >
                                    {['Batsman', 'Bowler', 'All-Rounder', 'Wicket Keeper'].map(role => (
                                      <option key={role} value={role}>{role}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>

                            <div className="col-md-2 text-end">
                              {formData.players.length > 1 && (
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm rounded-circle"
                                  style={{ width: '32px', height: '32px' }}
                                  onClick={() => setFormData(prev => ({
                                    ...prev,
                                    players: prev.players.filter((_, i) => i !== index)
                                  }))}
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {formData.players.length < 11 && (
                      <div className="text-center mt-3">
                        <button
                          type="button"
                          className="btn btn-outline-primary px-4"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            players: [...prev.players, { name: '', role: 'Batsman', image: null }]
                          }))}
                        >
                          <i className="fas fa-plus me-2"></i>Add Player
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="match-details-step">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Sport Category <span className="text-danger">*</span></label>
                      <div className="dropdown">
                        <button 
                          className={`form-select form-select-lg text-start ${errors.category ? 'is-invalid' : ''}`}
                          type="button" 
                          data-bs-toggle="dropdown"
                        >
                          {selectedCategory ? (
                            <>
                              <i className={`fas ${selectedCategory.icon} me-2`}></i>
                              {selectedCategory.name}
                            </>
                          ) : 'Select Category'}
                        </button>
                        <ul className="dropdown-menu shadow w-100">
                          {categories.map((category) => (
                            <li key={category.name}>
                              <button 
                                className="dropdown-item" 
                                type="button"
                                onClick={() => handleCategorySelect(category)}
                              >
                                <i className={`fas ${category.icon} me-2`}></i> {category.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                        {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Match Date & Time <span className="text-danger">*</span></label>
                      <input
                        type="datetime-local"
                        className={`form-control form-control-lg ${errors.matchDatetime ? 'is-invalid' : ''}`}
                        value={formData.matchDatetime}
                        onChange={e => setFormData(prev => ({ ...prev, matchDatetime: e.target.value }))}
                      />
                      {errors.matchDatetime && <div className="invalid-feedback">{errors.matchDatetime}</div>}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">Security Deposit</label>
                      <div className="">
                        <select
                          className="form-select"
                          value={formData.security}
                          onChange={e => setFormData(prev => ({ ...prev, security: e.target.value }))}
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                        {formData.security === 'yes' && (
                          <div className="form-group mt-2">
                            <label className="form-label">Amount</label>
                            <input
                              type="number"
                              className={`form-control ${errors.securityAmount ? 'is-invalid' : ''}`}
                              placeholder="Amount"
                              value={formData.securityAmount}
                              onChange={e => setFormData(prev => ({ ...prev, securityAmount: e.target.value }))}
                            />
                            {errors.securityAmount && <div className="invalid-feedback">{errors.securityAmount}</div>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">Match Bid</label>
                      <select
                        className="form-select"
                        value={formData.matchBid}
                        onChange={e => setFormData(prev => ({ ...prev, matchBid: e.target.value }))}
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                      {formData.matchBid === "yes" && (
                        <div className="form-group mt-2">
                          <label className="form-label">Amount</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter custom amount"
                            value={formData.customBid || ""}
                            onChange={e => setFormData(prev => ({ ...prev, customBid: e.target.value }))}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">Ball Type</label>
                      <select
                        className="form-select"
                        value={formData.ballType}
                        onChange={e => setFormData(prev => ({ ...prev, ballType: e.target.value }))}
                      >
                        <option value="tape">Tape Ball</option>
                        <option value="hard">Hard Ball</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="form-group">
                      <label className="form-label">Venue <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.venue ? 'is-invalid' : ''}`}
                        value={formData.venue}
                        onChange={e => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                      />
                      {errors.venue && <div className="invalid-feedback">{errors.venue}</div>}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">Overs <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className={`form-control form-control-lg ${errors.overs ? 'is-invalid' : ''}`}
                        value={formData.overs}
                        onChange={e => setFormData(prev => ({ ...prev, overs: e.target.value }))}
                      />
                      {errors.overs && <div className="invalid-feedback">{errors.overs}</div>}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">Province</label>
                      <select
                        className="form-select form-select-lg"
                        value={formData.province}
                        onChange={e => setFormData(prev => ({ ...prev, province: e.target.value, city: '' }))}
                      >
                        <option value="">Select Province</option>
                        {provinces.map(province => (
                          <option key={province} value={province}>{province}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <select
                        className="form-select form-select-lg"
                        value={formData.city}
                        onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        disabled={!formData.province}
                      >
                        <option value="">Select City</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">Join Code</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={formData.joinCode}
                          onChange={e => setFormData(prev => ({ ...prev, joinCode: e.target.value }))}
                          placeholder="Auto-generated"
                          readOnly
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setFormData(prev => ({ ...prev, joinCode: generateJoinCode() }))}
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label">Match Rules</label>
                      {formData.rules.map((rule, index) => (
                        <div key={index} className="input-group mb-2">
                          <input
                            type="text"
                            className="form-control"
                            value={rule}
                            onChange={e => updateRule(index, e.target.value)}
                            placeholder="Enter match rule"
                          />
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => removeRule(index)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm mt-2"
                        onClick={addRule}
                      >
                        <i className="fas fa-plus me-1"></i> Add Rule
                      </button>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Dress Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.dressCode}
                        onChange={e => setFormData(prev => ({ ...prev, dressCode: e.target.value }))}
                        placeholder="e.g., White jersey with dark pants"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Payment Method</label>
                      <select
                        className="form-select"
                        value={formData.paymentMethod}
                        onChange={e => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      >
                        <option value="cash">Cash</option>
                        <option value="online">Online Payment</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="review-step">
                <div className="card mb-4 shadow">
                  <div className="card-header bg-primary text-white py-3">
                    <h6 className="mb-0">Team Information</h6>
                  </div>
                  <div className="card-body">
                    <div className="text-center mb-3">
                      {formData.teamLogo && (
                        <img 
                          src={formData.teamLogo} 
                          alt="Team Logo"
                          className="rounded-circle border"
                          style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover'
                          }}
                        />
                      )}
                    </div>
                    <dl className="row mb-0">
                      <dt className="col-sm-3 text-muted">Team Name</dt>
                      <dd className="col-sm-9">{formData.teamName}</dd>

                      <dt className="col-sm-3 text-muted">Captain</dt>
                      <dd className="col-sm-9">{formData.captainName}</dd>

                      <dt className="col-sm-3 text-muted">Players</dt>
                      <dd className="col-sm-9">
                        <div className="d-flex flex-wrap gap-2">
                          {formData.players.map((player, index) => (
                            <span key={index} className="badge bg-light text-dark border">
                              {player.name} ({player.role})
                            </span>
                          ))}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>

                <div className="card shadow">
                  <div className="card-header bg-primary text-white py-3">
                    <h6 className="mb-0">Match Details</h6>
                  </div>
                  <div className="card-body">
                    <dl className="row mb-0">
                      <dt className="col-sm-3 text-muted">Category</dt>
                      <dd className="col-sm-9">
                        {selectedCategory && (
                          <>
                            <i className={`fas ${selectedCategory.icon} me-2`}></i>
                            {formData.category}
                          </>
                        )}
                      </dd>

                      <dt className="col-sm-3 text-muted">Date & Time</dt>
                      <dd className="col-sm-9">
                        {new Date(formData.matchDatetime).toLocaleString()}
                      </dd>

                      <dt className="col-sm-3 text-muted">Venue</dt>
                      <dd className="col-sm-9">{formData.venue}</dd>

                      <dt className="col-sm-3 text-muted">Overs</dt>
                      <dd className="col-sm-9">{formData.overs}</dd>

                      <dt className="col-sm-3 text-muted">Location</dt>
                      <dd className="col-sm-9">
                        {formData.city}, {formData.province}
                      </dd>

                      <dt className="col-sm-3 text-muted">Ball Type</dt>
                      <dd className="col-sm-9">{formData.ballType}</dd>

                      <dt className="col-sm-3 text-muted">Match Bid</dt>
                      <dd className="col-sm-9">{formData.matchBid}</dd>

                      <dt className="col-sm-3 text-muted">Security</dt>
                      <dd className="col-sm-9">
                        {formData.security === 'yes' ? `Yes (${formData.securityAmount})` : 'No'}
                      </dd>

                      <dt className="col-sm-3 text-muted">Join Code</dt>
                      <dd className="col-sm-9">{formData.joinCode}</dd>

                      <dt className="col-sm-3 text-muted">Dress Code</dt>
                      <dd className="col-sm-9">{formData.dressCode || 'Not specified'}</dd>

                      <dt className="col-sm-3 text-muted">Payment Method</dt>
                      <dd className="col-sm-9">{formData.paymentMethod}</dd>

                      {formData.rules.length > 0 && (
                        <>
                          <dt className="col-sm-3 text-muted">Rules</dt>
                          <dd className="col-sm-9">
                            <ul className="mb-0">
                              {formData.rules.map((rule, index) => (
                                <li key={index}>{rule}</li>
                              ))}
                            </ul>
                          </dd>
                        </>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <div className="w-100 d-flex justify-content-between">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                  >
                    Previous
                  </button>
                )}
              </div>

              <div>
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    className="btn btn-primary px-4"
                    onClick={handleNext}
                    disabled={submitting}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-success px-4"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating...
                      </>
                    ) : 'Create Match'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast.show && (
        <div className={`toast position-fixed bottom-0 end-0 m-3 ${toast.type === 'success' ? 'bg-success' : 'bg-danger'}`}>
          <div className="toast-body text-white d-flex align-items-center">
            <span>{toast.message}</span>
            <button 
              type="button" 
              className="btn-close btn-close-white ms-auto" 
              onClick={() => setToast(prev => ({ ...prev, show: false }))}
            ></button>
          </div>
        </div>
      )}
      <style>{`
  .stepper-wrapper {
    display: flex;
    justify-content: space-between;
    margin: 2rem 0 4rem;
    position: relative;
  }

  .stepper-wrapper::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #dee2e6; /* light gray line */
    z-index: 1;
  }

  .stepper-item {
    position: relative;
    z-index: 2;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .stepper-item .step-counter {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #dee2e6;
    color: #495057;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  .stepper-item.active .step-counter {
    background-color: #0d6efd; /* primary color for active step */
    color: #fff;
  }

  .stepper-item.completed .step-counter {
    background-color: #198754; /* green for completed step */
    color: #fff;
  }

  .stepper-item .step-name {
    font-size: 0.9rem;
    color: #6c757d;
    text-align: center;
  }
`}</style>

    </div> 
  );
};

export default CreateMatchModal;
