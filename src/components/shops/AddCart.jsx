import React, { useState } from 'react';
import { 
  Container, 
  Card, 
  Button, 
  Badge, 
  Table,
  Breadcrumb,
  Modal,
  Form
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const AddCart = () => {
  const navigate = useNavigate();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    paymentMethod: 'credit-card'
  });
  
  // Gradient style for buttons
  const gradientStyle = {
    background: 'linear-gradient(135deg, #3498db, #2980b9)',
    color: 'white',
    border: 'none',
    fontWeight: '600'
  };

  // Sample cart data with quantity set to 1
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'MASSA AST',
      description: 'Color: black, Material: metal',
      price: 120.00,
      discount: 25.00,
      image: '/themes/images/products/4.jpg',
      quantity: 1
    },
    {
      id: 2,
      name: 'Premium Headphones',
      description: 'Wireless, Noise-cancelling',
      price: 199.99,
      discount: 30.00,
      image: '/themes/images/products/5.jpg',
      quantity: 1
    }
  ]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Quantity handlers
  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? {...item, quantity: item.quantity + 1} : item
    ));
  };

  const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? {...item, quantity: Math.max(1, item.quantity - 1)} : item
    ));
  };

  // Handle direct input change
  const handleQuantityChange = (id, value) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      const newQuantity = Math.max(1, numValue);
      setCartItems(cartItems.map(item => 
        item.id === id ? {...item, quantity: newQuantity} : item
      ));
    }
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // View product details
  const viewProduct = (id) => {
    navigate(`/shop-detail/${id}`);
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDiscount = cartItems.reduce((sum, item) => sum + item.discount, 0);
  const grandTotal = subtotal - totalDiscount;

  const handleCheckout = () => {
    setShowCheckoutModal(true);
  };

  const handleConfirmCheckout = (e) => {
    e.preventDefault();
    // Add your checkout logic here
    console.log('Form submitted:', formData);
    console.log('Order details:', {
      items: cartItems,
      total: grandTotal
    });
    // You can add navigation or other actions after checkout confirmation
    setShowCheckoutModal(false);
  };

  return (
    <Container className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item as={Link} to="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>SHOPPING CART</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">SHOPPING CART <Badge bg="" className="text-dark">{cartItems.length} Item(s)</Badge></h3>
        <button 
          className="btn d-flex align-items-center"
          onClick={() => navigate(-1)}
          style={gradientStyle}
        >
          <i className="bi bi-arrow-left me-2"></i> Continue Shopping
        </button>
      </div>

      <Card className="border-0 shadow-sm mb-4">
        <Table responsive className="text-center">
          <thead className="table-light">
            <tr>
              <th className="text-center">Product</th>
              <th className="text-center">Description</th>
              <th className="text-center" style={{ width: '120px' }}>Quantity</th>
              <th className="text-center">Price</th>
              <th className="text-center">Discount</th>
              <th className="text-center">Total</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => (
              <tr key={item.id}>
                <td className="align-middle">
                  <img 
                    src={item.image} 
                    width="60" 
                    alt={item.name}
                    className="img-thumbnail border-0"
                  />
                </td>
                <td className="align-middle">
                  <h6 className="mb-1">{item.name}</h6>
                  <small className="text-muted">{item.description}</small>
                </td>
                <td className="align-middle">
                  <div className="d-flex justify-content-center">
                    <button 
                      className="btn rounded-start border-0"
                      style={gradientStyle}
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <input
                      type=""
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="form-control text-center mx-1"
                      style={{ 
                        width: '40px',
                        fontWeight: '600',
                        color: '#2c3e50',
                        backgroundColor: '#f8f9fa'
                      }}
                    />
                    <button 
                      className="btn rounded-end border-0"
                      style={gradientStyle}
                      onClick={() => increaseQuantity(item.id)}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </td>
                <td className="align-middle">${item.price.toFixed(2)}</td>
                <td className="align-middle text-success">-${item.discount.toFixed(2)}</td>
                <td className="align-middle fw-bold">
                  ${((item.price - item.discount) * item.quantity).toFixed(2)}
                </td>
                <td className="align-middle">
                  <div className="d-flex justify-content-center gap-2">
                    <button 
                      className="btn-sm p-0 border-0 bg-transparent text-primary"
                      onClick={() => viewProduct(item.id)}
                      title="View Product"
                    >
                      <i className="bi bi-eye fs-5"></i>
                    </button>
                    <button 
                      className="btn-sm p-0 border-0 bg-transparent text-danger"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove"
                    >
                      <i className="bi bi-trash fs-5"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Summary Table with Checkout Button */}
      <div className="d-flex justify-content-end">
        <Card className="border-0 shadow-sm mb-4" style={{ width: '50%', minWidth: '300px' }}>
          <Card.Body>
            <Table borderless className="mb-0 w-100">
              <tbody>
                <tr>
                  <td className="text-end fw-bold">Subtotal:</td>
                  <td className="text-end">${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="text-end fw-bold">Discount:</td>
                  <td className="text-end text-success">-${totalDiscount.toFixed(2)}</td>
                </tr>
                <tr className="border-top">
                  <td className="text-end fw-bold">TOTAL:</td>
                  <td className="text-end fw-bold">${grandTotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="2" className="pt-3">
                    <button 
                      className="btn w-100"
                      style={{
                        ...gradientStyle,
                        padding: '0.5rem 1.5rem',
                        fontSize: '1.1rem',
                      }}
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout <i className="bi bi-cart-check ms-2"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>

      {/* Checkout Confirmation Modal with Form */}
      <Modal 
        show={showCheckoutModal} 
        onHide={() => setShowCheckoutModal(false)} 
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Complete Your Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {/* Checkout Form - Left Side */}
            <div className="col-md-6">
              <Form onSubmit={handleConfirmCheckout}>
                <h5 className="mb-3">Shipping Information</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Shipping Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <h5 className="mb-3 mt-4">Payment Method</h5>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="radio"
                    id="credit-card"
                    label="Credit Card"
                    name="paymentMethod"
                    value="credit-card"
                    checked={formData.paymentMethod === 'credit-card'}
                    onChange={handleInputChange}
                  />
                  <Form.Check
                    type="radio"
                    id="paypal"
                    label="PayPal"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleInputChange}
                  />
                  <Form.Check
                    type="radio"
                    id="cash-on-delivery"
                    label="Cash on Delivery"
                    name="paymentMethod"
                    value="cash-on-delivery"
                    checked={formData.paymentMethod === 'cash-on-delivery'}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Form>
            </div>

            {/* Order Summary - Right Side */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="mb-3">Order Summary</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Items ({cartItems.length}):</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Discount:</span>
                    <span className="text-success">-${totalDiscount.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Shipping:</span>
                    <span>FREE</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>

                  <div className="mt-4">
                    <h6 className="mb-2">Your Items</h6>
                    {cartItems.map(item => (
                      <div key={item.id} className="d-flex align-items-center mb-2">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          width="50"
                          className="me-2 rounded"
                        />
                        <div className="flex-grow-1">
                          <div className="fw-bold">{item.name}</div>
                          <div className="small text-muted">
                            Qty: {item.quantity} × ${(item.price - item.discount).toFixed(2)}
                          </div>
                        </div>
                        <div className="fw-bold">
                          ${((item.price - item.discount) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCheckoutModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleConfirmCheckout}
            style={gradientStyle}
          >
            Place Order
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AddCart;