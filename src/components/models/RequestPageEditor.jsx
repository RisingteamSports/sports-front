import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const RequestPageEditor = ({ onClose, onBack }) => {
  const [selectedOptions, setSelectedOptions] = useState({
    matchdate: false,
    matchbid: false,
    overs: false,
    venue: false,
    rules: false,
    paymentmethod: false,
  });

  const [inputValue, setInputValue] = useState("");
  const [formData, setFormData] = useState({
    rules: [""]  // Initially, one rule input field is available
  });

  const handleSave = () => {
    alert(`Saved: ${inputValue}`);
    onClose();
  };

  const handleFieldToggle = (option) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [option]: !prevState[option], // Toggle the option's state
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        );
      case "rules":
        return (
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
        );
      case "paymentmethod":
        return (
          <div className="mb-3">
            <label className="form-label">Payment Method</label>
            <input
              type="text"
              className="form-control"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const addRule = () => {
    setFormData((prevState) => ({
      ...prevState,
      rules: [...prevState.rules, ""],  // Add a new empty rule field
    }));
  };

  const removeRule = (index) => {
    const updatedRules = formData.rules.filter((_, i) => i !== index);
    setFormData({ ...formData, rules: updatedRules });
  };

  const updateRule = (index, value) => {
    const updatedRules = [...formData.rules];
    updatedRules[index] = value;
    setFormData({ ...formData, rules: updatedRules });
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Edit Something?</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <select
              className="form-select mb-3"
              value=""
              onChange={(e) => handleFieldToggle(e.target.value)}
            >
              <option value="">Select Option</option>
              <option value="matchdate">Match Date</option>
              <option value="matchbid">Match Bid</option>
              <option value="overs">Overs</option>
              <option value="venue">Venue</option>
              <option value="rules">Rules</option>
              <option value="paymentmethod">Payment Method</option>
            </select>

            {/* Loop through all options and show each input field if toggled */}
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
              disabled={!inputValue}
            >
              Save
            </button>
            <button className="btn btn-secondary" onClick={onBack}>
              Back
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPageEditor;
