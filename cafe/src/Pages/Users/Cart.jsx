import { useState, useEffect } from "react";
import { Button, Table, Container, Modal, Spinner, Form, Row, Col, Card } from "react-bootstrap";
import { orderService } from "../../services/orderService";
import { tableService } from "../../services/tableService";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { PaymentPage } from '../../Components/PaymentPage';

export function CartPage() {
  const [cart, setCart] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tables, setTables] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState('takeaway');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const selectedTable = JSON.parse(localStorage.getItem("selectedTable"));
    
    setCart(storedCart);
    
    if (selectedTable) {
      setOrderType('dine-in');
      setTableNumber(selectedTable.tableNumber);
      setCustomerName(selectedTable.customerName);
    }
    
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await tableService.getAllTables();
      setTables(response.data?.tables || []);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleIncrease = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setCart((prev) => prev.filter((item) => item.id !== itemToDelete));
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    toast.success("Cart cleared");
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    setShowConfirm(true);
  };

  const confirmOrder = async () => {
    setShowConfirm(false);
    setProcessing(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity
        })),
        totalAmount: total,
        orderType: orderType,
        tableNumber: orderType === 'dine-in' ? tableNumber : null,
        customerName: customerName || undefined
      };

      console.log('Placing order with data:', orderData);
      const response = await orderService.createOrder(orderData);
      console.log('Order response:', response);
      
      // Store current user info for admin visibility
      const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
      if (currentUser) {
        const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const userExists = existingUsers.find(u => u.id === currentUser.id);
        if (!userExists) {
          existingUsers.push(currentUser);
          localStorage.setItem('mockUsers', JSON.stringify(existingUsers));
        }
      }
      
      setProcessing(false);
      setCreatedOrder(response.data.order);
      setShowPayment(true);
      // Don't clear cart and don't show success message yet
      // Cart will be cleared after successful payment
    } catch (error) {
      console.error('Order creation error:', error);
      setProcessing(false);
      toast.error(error.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <Container className="py-4">
      <h2 className="text-center fw-bold mb-4">🛍️ My Cart</h2>

      {cart.length === 0 ? (
        <h5 className="text-center text-muted">Your cart is empty.</h5>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr className="text-center">
                <th>Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="text-center align-middle">
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDecrease(item.id)}
                    >
                      −
                    </Button>{" "}
                    <span className="mx-2">{item.quantity}</span>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleIncrease(item.id)}
                    >
                      +
                    </Button>
                  </td>
                  <td>₹{item.price * item.quantity}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Order Details Section */}
          <Card className="mt-4 mb-4">
            <Card.Header>
              <h5 className="mb-0">Order Details</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Order Type</Form.Label>
                    <Form.Select 
                      value={orderType} 
                      onChange={(e) => setOrderType(e.target.value)}
                    >
                      <option value="takeaway">Takeaway</option>
                      <option value="dine-in">Dine In</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Customer Name (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              {orderType === 'dine-in' && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Table Number *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter table number (e.g., T01, Table 5)"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4>Total: ₹{total}</h4>
            <div>
              <Button variant="danger" className="me-3" onClick={handleClearCart}>
                Clear Cart
              </Button>
              <Button 
                variant="success" 
                onClick={handlePlaceOrder}
                disabled={orderType === 'dine-in' && !tableNumber.trim()}
              >
                Place Order
              </Button>
            </div>
          </div>
        </>
      )}

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Your Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center fs-5">
            Do you want to confirm your order?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            No
          </Button>
          <Button variant="success" onClick={confirmOrder}>
            Yes, Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={processing} backdrop="static" centered>
        <Modal.Body className="text-center py-4">
          <Spinner animation="border" variant="success" className="mb-3" />
          <h5>Processing your order...</h5>
        </Modal.Body>
      </Modal>

      <Modal show={showPayment} backdrop="static" keyboard={false} size="lg" centered>
        <Modal.Body className="p-0">
          {createdOrder && (
            <PaymentPage 
              order={createdOrder} 
              onPaymentComplete={() => {
                setShowPayment(false);
                setCart([]);
                localStorage.removeItem("cart");
                setShowSuccess(true);
                toast.success("Payment completed! Order placed successfully.");
              }}
            />
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
        <Modal.Body className="text-center py-4">
          <h4 className="text-success mb-3">✅ Payment Successful!</h4>
          <p>Your order has been placed and payment completed successfully.</p>
          <Button variant="success" onClick={() => {
            setShowSuccess(false);
            navigate('/user/orders');
          }}>
            View My Orders
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Remove Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to remove this item from your cart?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>


    </Container>
  );
}
