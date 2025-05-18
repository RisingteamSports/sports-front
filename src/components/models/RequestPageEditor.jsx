import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = process.env.REACT_APP_API_URL || "https://matc.matchdada.com/public/api";

const RequestPageEditor = ({ onClose, onBack, match_id, opponentId }) => {
  const [selectedOptions, setSelectedOptions] = useState({
    matchdate: false,
    matchbid: false,
    overs: false,
    venue: false,
    rules: false,
    paymentmethod: false,
  });

  const [formData, setFormData] = useState({
    rules: [""],
    matchdate: "",
    matchbid: "",
    overs: "",
    venue: "",
    paymentmethod: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add this missing function
  const handleInputChange = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication required");

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) throw new Error("User information missing");
      if (!opponentId) throw new Error("Opponent information missing");

      const payload = {
        match_id: match_id,
        matchdate: selectedOptions.matchdate ? formData.matchdate : null,
        matchbid: selectedOptions.matchbid ? parseFloat(formData.matchbid) : null,
        overs: selectedOptions.overs ? parseInt(formData.overs) : null,
        venue: selectedOptions.venue ? formData.venue : null,
        rules: selectedOptions.rules ? formData.rules.filter(rule => rule.trim() !== "") : [],
        paymentmethod: selectedOptions.paymentmethod ? formData.paymentmethod : null,
        requested_to: opponentId,
        message: formData.message || `Match request from ${user.name || 'User ID: ' + user.id}`,
      };

      const response = await axios.post(`${API_URL}/notifications/store`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        alert("Notification sent successfully!");
        onClose();
      } else {
        throw new Error(response.data.error || "Failed to send notification");
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message);
      console.error("Notification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldToggle = (option) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [option]: !prevState[option],
    }));
  };

  const addRule = () => {
    setFormData(prevState => ({
      ...prevState,
      rules: [...prevState.rules, ""],
    }));
  };

  const removeRule = (index) => {
    const updatedRules = formData.rules.filter((_, i) => i !== index);
    setFormData(prevState => ({
      ...prevState,
      rules: updatedRules,
    }));
  };

  const updateRule = (index, value) => {
    const updatedRules = [...formData.rules];
    updatedRules[index] = value;
    setFormData(prevState => ({
      ...prevState,
      rules: updatedRules,
    }));
  };

  const renderInputField = (option) => {
    switch (option) {
      case "matchdate":
        return (
          <div className="mb-3">
            <label className="form-label">Match Date</label>
            <input
              type="date"
              className="form-control"
              value={formData.matchdate}
              onChange={(e) => handleInputChange("matchdate", e.target.value)}
            />
          </div>
        );
      case "matchbid":
        return (
          <div className="mb-3">
            <label className="form-label">Match Bid</label>
            <input
              type="number"
              className="form-control"
              value={formData.matchbid}
              onChange={(e) => handleInputChange("matchbid", e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
        );
      case "overs":
        return (
          <div className="mb-3">
            <label className="form-label">Overs</label>
            <input
              type="number"
              className="form-control"
              value={formData.overs}
              onChange={(e) => handleInputChange("overs", e.target.value)}
              min="1"
              max="50"
            />
          </div>
        );
      case "venue":
        return (
          <div className="mb-3">
            <label className="form-label">Venue</label>
            <input
              type="text"
              className="form-control"
              value={formData.venue}
              onChange={(e) => handleInputChange("venue", e.target.value)}
              maxLength="255"
            />
          </div>
        );
      case "rules":
        return (
          <div className="col-12">
            <label className="form-label">Match Rules</label>
            {formData.rules.map((rule, index) => (
              <div key={index} className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={rule}
                  onChange={(e) => updateRule(index, e.target.value)}
                  placeholder="Enter match rule"
                  maxLength="255"
                />
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => removeRule(index)}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-primary btn-sm mt-2"
              onClick={addRule}
            >
              Add Rule
            </button>
          </div>
        );
      case "paymentmethod":
        return (
          <div className="mb-3">
            <label className="form-label">Payment Method</label>
            <input
              type="text"
              className="form-control"
              value={formData.paymentmethod}
              onChange={(e) => handleInputChange("paymentmethod", e.target.value)}
              maxLength="255"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Send Match Request</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                className="form-control"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Enter your request message"
                rows="3"
                maxLength="500"
              />
            </div>

            <select 
              className="form-select mb-3" 
              onChange={(e) => handleFieldToggle(e.target.value)}
              value=""
            >
              <option value="">Add additional details...</option>
              <option value="matchdate">Match Date</option>
              <option value="matchbid">Match Bid</option>
              <option value="overs">Overs</option>
              <option value="venue">Venue</option>
              <option value="rules">Rules</option>
              <option value="paymentmethod">Payment Method</option>
            </select>

            {["matchdate", "matchbid", "overs", "venue", "rules", "paymentmethod"].map(
              (option) =>
                selectedOptions[option] && (
                  <div key={option} className="mb-3">
                    {renderInputField(option)}
                  </div>
                )
            )}
          </div>
          <div className="modal-footer">
            <button 
              className="btn btn-success" 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Request'}
            </button>
            <button className="btn btn-secondary" onClick={onBack}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPageEditor;