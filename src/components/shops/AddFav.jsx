import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Table,
  Breadcrumb 
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const AddFav = () => {
  const navigate = useNavigate();
  
  // Gradient style for buttons
  const gradientStyle = {
    background: 'linear-gradient(135deg, #3498db, #2980b9)',
    color: 'white',
    border: 'none',
    fontWeight: '600'
  };

  // Sample favorites data
  const [favoriteItems, setFavoriteItems] = useState([
    {
      id: 1,
      name: 'MASSA AST Chair',
      description: 'Color: black, Material: metal',
      price: 120.00,
      image: '/themes/images/products/4.jpg',
      inStock: true
    },
    {
      id: 2,
      name: 'Premium Headphones',
      description: 'Wireless, Noise-cancelling',
      price: 199.99,
      image: '/themes/images/products/5.jpg',
      inStock: false
    },
    // Add more items as needed
  ]);

  // Remove item from favorites
  const removeFromFavorites = (id) => {
    setFavoriteItems(favoriteItems.filter(item => item.id !== id));
  };

  // Move item to cart
  const moveToCart = (id) => {
    console.log(`Item ${id} moved to cart`);
  };

  // View product details
  const viewProduct = (id) => {
    navigate(`/shop-detail/${id}`);
  };

  return (
    <Container className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item as={Link} to="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>MY FAVORITES</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">MY FAVORITES <Badge bg="" className=" text-dark">{favoriteItems.length} Item(s)</Badge></h3>
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
              <th className="text-center">Price</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {favoriteItems.map(item => (
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
                <td className="align-middle fw-bold">${item.price.toFixed(2)}</td>
                <td className="align-middle">
                  <div className="d-flex justify-content-center gap-2">
                    <button 
                      className=" btn-sm p-0 border-0 bg-transparent text-primary"
                      onClick={() => viewProduct(item.id)}
                      title="View Product"
                    >
                      <i className="bi bi-eye fs-5"></i>
                    </button>
                    <button 
                      className=" btn-sm p-0 border-0 bg-transparent text-primary"
                      onClick={() => moveToCart(item.id)}
                      disabled={!item.inStock}
                      title="Add to Cart"
                    >
                      <i className="bi bi-cart-plus fs-5"></i>
                    </button>
                    <button 
                      className=" btn-sm p-0 border-0 bg-transparent text-danger"
                      onClick={() => removeFromFavorites(item.id)}
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

      <div className="d-flex justify-content-between">
      </div>
    </Container>
  );
};

export default AddFav;