import { useState, useEffect } from "react";
import { Card, Button, Row, Col, Container, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { menuService } from "../../services/menuService";
import { toast } from 'react-toastify';

export function MenuItems() {
  const navigate = useNavigate();
  const [categoriesWithMenus, setCategoriesWithMenus] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoriesWithMenus();
  }, []);

  const getItemImage = (item) => {
    // First try to use the image from the database
    if (item.image) {
      return item.image;
    }
    
    // Fallback to default images based on item name
    const imageMap = {
      'Cappuccino': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
      'Americano': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop',
      'Espresso': 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
      'Latte': 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&h=300&fit=crop',
      'Iced Coffee': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
      'Fresh Orange Juice': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
      'Pancakes': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      'Omelette': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
      'Club Sandwich': 'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=400&h=300&fit=crop',
      'Caesar Salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      'Chocolate Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
      'Cheesecake': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop'
    };
    return imageMap[item.name] || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop';
  };

  const getItemPrice = (itemName) => {
    const priceMap = {
      'Cappuccino': 99,
      'Americano': 129,
      'Espresso': 149,
      'Iced Coffee': 199,
      'Latte': 119,
      'Mocha': 139,
      'Classic Burger': 199,
      'Veggie Burger': 149,
      'Deluxe Burger': 229,
      'Chicken Sandwich': 179,
      'Club Sandwich': 189,
      'Caesar Salad': 159,
      'Pancakes': 129,
      'French Toast': 139,
      'Omelette': 119,
      'Chocolate Cake': 99,
      'Cheesecake': 149,
      'Ice Cream': 79,
      'Fresh Orange Juice': 89,
      'Smoothie': 119
    };
    return priceMap[itemName] || 99;
  };

  const fetchCategoriesWithMenus = async () => {
    try {
      const response = await menuService.getCategoriesWithMenus();
      setCategoriesWithMenus(response.data?.categories || []);
    } catch (error) {
      toast.error("Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrease = (id) => {
    setQuantities((prev) => {
      const newQty = (prev[id] || 0) - 1;
      if (newQty <= 0) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const handleAddToBag = (item) => {
    const quantity = quantities[item.id] || 0;

    if (quantity === 0) {
      toast.warning("Please select at least 1 quantity before adding to bag!");
      return;
    }

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = storedCart.findIndex((i) => i.id === item.id);
    const itemWithUpdatedPrice = { ...item, price: item.price || getItemPrice(item.name) };
    
    if (existingIndex !== -1) {
      storedCart[existingIndex].quantity += quantity;
    } else {
      storedCart.push({ ...itemWithUpdatedPrice, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(storedCart));

    navigate("/user/cart");
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <h2>Loading menu items...</h2>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4 fw-bold"> Our Menu</h2>
      
      {categoriesWithMenus.map((category) => (
        category.Menus && category.Menus.length > 0 && (
          <div key={category.id} className="mb-5">
            <div className="d-flex align-items-center mb-3">
              <h3 className="fw-bold text-primary me-3">{category.name}</h3>
              <Badge bg="secondary">{category.Menus.length} items</Badge>
            </div>
            {category.description && (
              <p className="text-muted mb-4">{category.description}</p>
            )}
            
            <Row xs={1} sm={2} md={3} lg={4} className="g-4 mb-4">
              {category.Menus.map((item) => (
                <Col key={item.id}>
                  <Card className="h-100 shadow-sm border-0 hover-card">
                    <Card.Img
                      variant="top"
                      src={getItemImage(item)}
                      alt={item.name}
                      style={{ height: "200px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop';
                      }}
                    />
                    <Card.Body className="text-center">
                      <Card.Title className="h6">{item.name}</Card.Title>
                      {item.description && (
                        <Card.Text className="text-muted small">
                          {item.description.length > 60 
                            ? `${item.description.substring(0, 60)}...` 
                            : item.description
                          }
                        </Card.Text>
                      )}
                      <h5 className="text-success">₹{item.price || getItemPrice(item.name)}</h5>

                      {/* Quantity Controls */}
                      <div className="mt-3 d-flex justify-content-center align-items-center gap-2">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDecrease(item.id)}
                        >
                          −
                        </Button>
                        <span className="fw-semibold mx-2">{quantities[item.id] || 0}</span>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleIncrease(item.id)}
                        >
                          +
                        </Button>
                      </div>

                      {/* Add to Bag Button */}
                      <Button
                        variant="primary"
                        className="mt-3 px-3"
                        onClick={() => handleAddToBag(item)}
                        disabled={!item.isAvailable}
                      >
                        {item.isAvailable ? 'Add to Bag' : 'Not Available'}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <hr className="my-4" />
          </div>
        )
      ))}
      
      {categoriesWithMenus.length === 0 && (
        <div className="text-center py-5">
          <h4 className="text-muted">No menu items available at the moment</h4>
          <p className="text-muted">Please check back later!</p>
        </div>
      )}
    </Container>
  );
}
