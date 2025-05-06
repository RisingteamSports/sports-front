import React, { useState } from 'react';
import styled from 'styled-components';

const CheckoutPage = () => {
  const [activeStep, setActiveStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    paymentMethod: 'credit-card',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    } else {
      alert('Order placed successfully!');
      // Submit to backend here
    }
  };

  return (
    <CheckoutContainer>
      <CheckoutSteps>
        <Step active={activeStep >= 1}>1. Shipping</Step>
        <Step active={activeStep >= 2}>2. Payment</Step>
        <Step active={activeStep >= 3}>3. Review</Step>
      </CheckoutSteps>

      <CheckoutForm onSubmit={handleSubmit}>
        {activeStep === 1 && (
          <ShippingSection>
            <h2>Shipping Information</h2>
            <FormGroup>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <label>ZIP Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
              </select>
            </FormGroup>
          </ShippingSection>
        )}

        {activeStep === 2 && (
          <PaymentSection>
            <h2>Payment Method</h2>
            <PaymentOptions>
              <PaymentOption
                active={formData.paymentMethod === 'credit-card'}
                onClick={() => setFormData({ ...formData, paymentMethod: 'credit-card' })}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={formData.paymentMethod === 'credit-card'}
                  onChange={() => {}}
                />
                <span>Credit Card</span>
              </PaymentOption>
              <PaymentOption
                active={formData.paymentMethod === 'paypal'}
                onClick={() => setFormData({ ...formData, paymentMethod: 'paypal' })}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={formData.paymentMethod === 'paypal'}
                  onChange={() => {}}
                />
                <span>PayPal</span>
              </PaymentOption>
            </PaymentOptions>

            {formData.paymentMethod === 'credit-card' && (
              <CardDetails>
                <FormGroup>
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <FormRow>
                  <FormGroup>
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                </FormRow>
              </CardDetails>
            )}
          </PaymentSection>
        )}

        {activeStep === 3 && (
          <ReviewSection>
            <h2>Review Your Order</h2>
            <OrderSummary>
              <ProductItem>
                <img src="https://via.placeholder.com/80" alt="Product" />
                <div>
                  <h4>Premium Wireless Headphones</h4>
                  <p>$199.99</p>
                </div>
              </ProductItem>
              <OrderTotal>
                <div>
                  <span>Subtotal:</span>
                  <span>$199.99</span>
                </div>
                <div>
                  <span>Shipping:</span>
                  <span>$5.99</span>
                </div>
                <div>
                  <span>Tax:</span>
                  <span>$14.00</span>
                </div>
                <div className="total">
                  <span>Total:</span>
                  <span>$219.98</span>
                </div>
              </OrderTotal>
            </OrderSummary>
          </ReviewSection>
        )}

        <NavigationButtons>
          {activeStep > 1 && (
            <BackButton type="button" onClick={() => setActiveStep(activeStep - 1)}>
              Back
            </BackButton>
          )}
          <NextButton type="submit">
            {activeStep === 3 ? 'Place Order' : 'Continue'}
          </NextButton>
        </NavigationButtons>
      </CheckoutForm>
    </CheckoutContainer>
  );
};

// Styled Components
const CheckoutContainer = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: 'Arial', sans-serif;
`;

const CheckoutSteps = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const Step = styled.div`
  flex: 1;
  text-align: center;
  padding: 0.5rem;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  color: ${(props) => (props.active ? '#4CAF50' : '#777')};
  border-bottom: ${(props) => (props.active ? '2px solid #4CAF50' : 'none')};
`;

const CheckoutForm = styled.form`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ShippingSection = styled.div`
  h2 {
    margin-bottom: 1.5rem;
    color: #333;
  }
`;

const PaymentSection = styled.div`
  h2 {
    margin-bottom: 1.5rem;
    color: #333;
  }
`;

const ReviewSection = styled.div`
  h2 {
    margin-bottom: 1.5rem;
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  input, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  ${FormGroup} {
    flex: 1;
  }
`;

const PaymentOptions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const PaymentOption = styled.div`
  flex: 1;
  padding: 1rem;
  border: 1px solid ${(props) => (props.active ? '#4CAF50' : '#ddd')};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${(props) => (props.active ? '#f0fff0' : '#fff')};
  input {
    margin-right: 0.5rem;
  }
`;

const CardDetails = styled.div`
  margin-top: 1rem;
`;

const OrderSummary = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
`;

const ProductItem = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
  }
  h4 {
    margin: 0;
    font-size: 1rem;
  }
  p {
    margin: 0.5rem 0 0;
    font-weight: bold;
    color: #4CAF50;
  }
`;

const OrderTotal = styled.div`
  margin-top: 1rem;
  div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  .total {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
    font-weight: bold;
    font-size: 1.1rem;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    background: #e0e0e0;
  }
`;

const NextButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    background: #45a049;
  }
`;

export default CheckoutPage;