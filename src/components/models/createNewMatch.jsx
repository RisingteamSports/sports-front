import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateMatchModal = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [checkingTeamName, setCheckingTeamName] = useState(false);

  const [formData, setFormData] = useState({
    teamName: '',
    captainName: '',
    players: [{ name: '', role: 'Batsman', image: null }],
    category: '',
    security: 'no',
    securityAmount: '',
    matchBid: 'no',
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

  // Get cities based on selected province
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

  // Validation logic
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
  
      // Prepare the payload with correct field names expected by the API
      const payload = {
        user_id: user.id,  // Changed from userId to user_id
        team_name: formData.teamName,  // Changed from teamName to team_name
        captain_name: formData.captainName,
        players: formData.players.map(player => ({
          name: player.name,
          role: player.role.toLowerCase().replace(' ', '_'),
          image: player.image
        })),
        category: formData.category,
        security: formData.security,
        security_amount: formData.security === 'yes' ? formData.securityAmount : null,  // Changed from securityAmount
        match_bid: formData.matchBid,  // Changed from matchBid
        match_datetime: new Date(formData.matchDatetime).toISOString(),  // Changed from matchDatetime
        ball_type: formData.ballType,  // Changed from ballType
        venue: formData.venue,
        match_status: formData.matchStatus,  // Changed from matchStatus
        overs: formData.overs,
        province: formData.province,
        city: formData.city,
        join_code: formData.joinCode || generateJoinCode(),  // Changed from joinCode
        rules: formData.rules,
        facilities: formData.facilities,
        equipment: formData.equipment,
        dress_code: formData.dressCode,  // Changed from dressCode
        payment_method: formData.paymentMethod  // Changed from paymentMethod
      };
  console.log(payload);
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
        // Handle API-specific error messages
        const errorMsg = response.data.message || 'Failed to create match';
        if (response.data.errors) {
          // Convert errors object to readable string
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

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  const generateJoinCode = () => {
    const code = Math.random().toString(36).substr(2, 8).toUpperCase();
    return code;
  };

  // Add match rules
  const addRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, '']
    }));
  };

  // Update match rule
  const updateRule = (index, value) => {
    const updatedRules = [...formData.rules];
    updatedRules[index] = value;
    setFormData(prev => ({ ...prev, rules: updatedRules }));
  };

  // Remove match rule
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

          <div className="row mb-4 text-center">
  <div className="col-md-4">
    <div className="p-3 bg-light rounded shadow">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2583/2583448.png"
        alt="Silver Crown"
        style={{ height: '50px' }}
      />
      <h6 className="mt-2">Silver Crown</h6>
    </div>
  </div>
  <div className="col-md-4">
    <div className="p-3 bg-warning rounded shadow">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2583/2583448.png"
        alt="Gold Crown"
        style={{ height: '50px' }}
      />
      <h6 className="mt-2">Gold Crown</h6>
    </div>
  </div>
  <div className="col-md-4">
    <div className="p-3 bg-info rounded shadow">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2583/2583448.png"
        alt="Diamond Crown"
        style={{ height: '50px' }}
      />
      <h6 className="mt-2">Diamond Crown</h6>
    </div>
  </div>
</div>

            {/* Stepper */}
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

            {/* Step 1: Team Information */}
            {currentStep === 1 && (
              <div className="team-info-step">
                <div className="row g-4">
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

            {/* Step 2: Match Details */}
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
      <label className="form-label"> Amount</label>
                          <input
                            type="number"
                            className={`form-control ${errors.securityAmount ? 'is-invalid' : ''}`}
                            placeholder="Amount"
                            value={formData.securityAmount}
                            onChange={e => setFormData(prev => ({ ...prev, securityAmount: e.target.value }))}
                          />
                          </div>
                        )}
                      </div>
                      {errors.securityAmount && <div className="invalid-feedback">{errors.securityAmount}</div>}
                    </div>
                  </div>

                  <div className="col-md-4">
  <div className="form-group">
    <label className="form-label">Match Bid</label>
    <select
      className="form-select"
      value={formData.matchBid}
      onChange={e =>
        setFormData(prev => ({ ...prev, matchBid: e.target.value }))
      }
    >
      <option value="no">No</option>
      <option value="yes">Yes</option>
    </select>
  </div>

  {/* Show custom input only if 'yes' is selected */}
  {formData.matchBid === "yes" && (
    <div className="form-group mt-2">
      <label className="form-label"> Amount</label>
      <input
        type="number"
        className="form-control"
        placeholder="Enter custom amount"
        value={formData.customBid || ""}
        onChange={e =>
          setFormData(prev => ({ ...prev, customBid: e.target.value }))
        }
      />
    </div>
  )}
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

            {/* Step 3: Review & Submit */}
            {currentStep === 3 && (
              <div className="review-step">
                <div className="card mb-4 shadow">
                  <div className="card-header bg-primary text-white py-3">
                    <h6 className="mb-0">Team Information</h6>
                  </div>
                  <div className="card-body">
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

      {/* Toast Notification */}
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
          background-color: #dee2e6;
          z-index: -1;
        }
        
        .stepper-item {
          position: relative;
          flex: 1;
          text-align: center;
          z-index: 1;
        }
        
        .step-counter {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #e9ecef;
          color: #6c757d;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .stepper-item.active .step-counter {
          background-color: #0d6efd;
          color: white;
          transform: scale(1.1);
        }
        
        .stepper-item.completed .step-counter {
          background-color: #198754;
          color: white;
        }
        
        .step-name {
          color: #6c757d;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        
        .stepper-item.active .step-name {
          color: #0d6efd;
          font-weight: 600;
        }
        
        .avatar-preview:hover {
          border-color: #0d6efd !important;
          transform: scale(1.05);
        }
        
        .toast {
          min-width: 300px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default CreateMatchModal;