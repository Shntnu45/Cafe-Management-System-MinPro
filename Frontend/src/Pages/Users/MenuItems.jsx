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

  const getItemImage = (itemName) => {
    const imageMap = {
      'Cappuccino': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
      'Americano': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop',
      'Espresso': 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
      'Latte': 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&h=300&fit=crop',
      'Mocha': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      'Cold Brew': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
      'Macchiato': 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=400&h=300&fit=crop',
      'Flat White': 'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?w=400&h=300&fit=crop',
      'Samosa': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
      'Pakora': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
      'Dhokla': 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=300&fit=crop',
      'Vada Pav': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
      'Pani Puri': 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=300&fit=crop',
      'Bhel Puri': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
      'Aloo Tikki': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
      'Dahi Puri': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
      'Masala Dosa': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
      'Idli Sambar': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop',
      'Upma': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
      'Poha': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
      'Paratha': 'https://images.unsplash.com/photo-1574653853027-5d3ba0c95f5d?w=400&h=300&fit=crop',
      'Uttapam': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
      'Medu Vada': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop',
      'Rava Dosa': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
      'Gulab Jamun': 'https://images.unsplash.com/photo-1571167530149-c72f2dbf7e98?w=400&h=300&fit=crop',
      'Rasgulla': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
      'Kheer': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
      'Jalebi': 'https://images.unsplash.com/photo-1571167530149-c72f2dbf7e98?w=400&h=300&fit=crop',
      'Kulfi': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
      'Laddu': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
      'Ras Malai': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
      'Gajar Halwa': 'https://images.unsplash.com/photo-1571167530149-c72f2dbf7e98?w=400&h=300&fit=crop',
      'Masala Chai': 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop',
      'Lassi': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop',
      'Fresh Lime Water': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
      'Coconut Water': 'https://images.unsplash.com/photo-1447875569765-2b3db822bec9?w=400&h=300&fit=crop',
      'Buttermilk': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop',
      'Aam Panna': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
      'Thandai': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop',
      'Jaljeera': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop'
    };
    return imageMap[itemName] || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop';
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
                      src={item.image || getItemImage(item.name)}
                      alt={item.name}
                      style={{ height: "200px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = getItemImage(item.name);
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
