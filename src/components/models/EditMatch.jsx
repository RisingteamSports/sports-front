import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditMatchModal = ({ match, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    teamName: match.team_name || '',
    captainName: match.captain_name || '',
    players: match.players || [],
    category: match.category || '',
    security: match.security || 'no',
    securityAmount: match.security_amount || '',
    matchBid: match.match_bid || 'no',
    customBid: match.custom_bid || '',
    matchDatetime: match.match_datetime || '',
    ballType: match.ball_type || 'tape',
    venue: match.venue || '',
    matchStatus: match.match_status || 'available',
    overs: match.overs || '',
    province: match.province || '',
    city: match.city || '',
    joinCode: match.join_code || '',
    rules: match.rules || [],
    facilities: match.facilities || {},
    equipment: match.equipment || [],
    dressCode: match.dress_code || '',
    paymentMethod: match.payment_method || 'cash'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
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
  const [selectedCategory, setSelectedCategory] = useState(
    categories.find(cat => cat.name === match.category) || null
  );

  const API_URL = "https://matc.matchdada.com/public/api";
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (formData.province) {
      setCities(getCitiesByProvince(formData.province));
    }
  }, [formData.province]);

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.teamName.trim()) newErrors.teamName = 'Team name is required';
    if (!formData.captainName.trim()) newErrors.captainName = 'Captain name is required';
    formData.players.forEach((player, index) => {
      if (!player.name.trim()) newErrors[`player${index}Name`] = 'Player name is required';
    });
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.matchDatetime) newErrors.matchDatetime = 'Match date/time is required';
    if (formData.security === 'yes' && !formData.securityAmount) 
      newErrors.securityAmount = 'Security amount is required';
    if (!formData.venue) newErrors.venue = 'Venue is required';
    if (!formData.overs) newErrors.overs = 'Overs are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        team_name: formData.teamName,
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
        join_code: formData.joinCode,
        rules: formData.rules,
        facilities: formData.facilities,
        equipment: formData.equipment,
        dress_code: formData.dressCode,
        payment_method: formData.paymentMethod
      };

      const response = await axios.put(`${API_URL}/matches/${match.id}`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        showToast('Match updated successfully!', 'success');
        onUpdate(response.data.match);
        setTimeout(onClose, 1500);
      } else {
        throw new Error(response.data.message || 'Failed to update match');
      }
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.errors ? 
                     JSON.stringify(error.response.data.errors) : 
                     error.message;
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false }), 5000));
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

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Edit Match Details</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {/* Team Information */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Team Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className={`form-control form-control-lg ${errors.teamName ? 'is-invalid' : ''}`}
                      value={formData.teamName}
                      onChange={e => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
                    />
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

                {/* Match Details */}
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
                    {formData.matchBid === 'yes' && (
                      <div className="form-group mt-2">
                        <label className="form-label">Amount</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter custom amount"
                          value={formData.customBid}
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
                    <input
                      type="text"
                      className="form-control"
                      value={formData.joinCode}
                      onChange={e => setFormData(prev => ({ ...prev, joinCode: e.target.value }))}
                      readOnly
                    />
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

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Updating...
                    </>
                  ) : 'Update Match'}
                </button>
              </div>
            </form>
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
    </div>
  );
};

export default EditMatchModal;