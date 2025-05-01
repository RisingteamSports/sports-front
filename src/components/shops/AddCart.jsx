import React, { useState } from 'react';
import { 
  Container, 
  Card, 
  Button, 
  Badge, 
  Table,
  Breadcrumb 
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const AddCart = () => {
  const navigate = useNavigate();
  
  // Gradient style for buttons
  const gradientStyle = {
    background: 'linear-gradient(135deg, #3498db, #2980b9)',
    color: 'white',
    border: 'none',
    fontWeight: '600'
  };

  // Sample cart data
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

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDiscount = cartItems.reduce((sum, item) => sum + item.discount, 0);
  const grandTotal = subtotal - totalDiscount;

  return (
    <Container className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item as={Link} to="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>SHOPPING CART</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">SHOPPING CART <Badge bg="" className=" text-dark">{cartItems.length} Item(s)</Badge></h3>
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
              <th className="text-center">Quantity</th>
              <th className="text-center">Price</th>
              <th className="text-center">Discount</th>
              <th className="text-center">Total</th>
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
                      type="number"
                      min="1"
                      value={item.quantity}
                      className="form-control text-center mx-1"
                      style={{ 
                        width: '50px',
                        fontWeight: '600',
                        color: '#2c3e50',
                        backgroundColor: '#f8f9fa'
                      }}
                      readOnly
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
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Summary Table with 50% width */}
      <Card 
  className="border-0 shadow-sm mb-4 mx-auto float-end" 
  style={{ width: '50%', minWidth: '300px' }}
>
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
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-between ">
        <button 
          className="btn"
          style={{
            ...gradientStyle,
            padding: '0.5rem 1.5rem',
            fontSize: '1.1rem',
          }}
        >
          Proceed to Checkout <i className="bi bi-cart-check ms-2"></i>
        </button>
      </div>
    </Container>
  );
};

export default AddCart;