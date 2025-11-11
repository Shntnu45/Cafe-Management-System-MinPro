import { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { paymentService } from "../../services/paymentService";
import { orderService } from "../../services/orderService";
import { toast } from 'react-toastify';

export function UserPayments() {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [newPayment, setNewPayment] = useState({
    orderId: "",
    amount: "",
    method: "card"
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
    loadPaymentRequests();
    
    // Listen for payment updates
    const handleStorageChange = () => {
      fetchPayments();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  const loadPaymentRequests = () => {
    const requests = JSON.parse(localStorage.getItem('paymentRequests') || '[]');
    setPaymentRequests(requests);
  };

  const dismissRequest = (index) => {
    const updatedRequests = paymentRequests.filter((_, i) => i !== index);
    setPaymentRequests(updatedRequests);
    localStorage.setItem('paymentRequests', JSON.stringify(updatedRequests));
  };

  const fetchPayments = async () => {
    try {
      // Try to fetch orders first (more likely to exist)
      const ordersResponse = await orderService.getUserOrders();
      setOrders(ordersResponse.data?.orders || []);
      
      // Try to fetch payments (might not exist yet)
      try {
        const paymentsResponse = await paymentService.getUserPayments();
        setPayments(paymentsResponse.data?.payments || []);
      } catch (paymentError) {
        console.log('No payments found for user:', paymentError);
        // Load mock payments from localStorage
        const mockPayments = JSON.parse(localStorage.getItem('mockPayments') || '[]');
        setPayments(mockPayments);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error("Failed to fetch data");
      setOrders([]);
      // Load mock payments even if orders fail
      const mockPayments = JSON.parse(localStorage.getItem('mockPayments') || '[]');
      setPayments(mockPayments);
    } finally {
      setLoading(false);
    }
  };

  const getOrderDetails = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  const totalPaid = payments.filter(p => p.paymentStatus === 'completed').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const pendingPayments = payments.filter(p => p.paymentStatus === 'pending').length;
  const totalOrders = orders.length;
  const unpaidOrders = orders.filter(order => 
    !payments.some(payment => 
      String(payment.orderId) === String(order.id) && payment.paymentStatus === 'completed'
    )
  ).length;

  const handleAddPayment = async () => {
    if (!newPayment.orderId || !newPayment.amount) {
      toast.error("Please fill all fields!");
      return;
    }

    try {
      await paymentService.createPayment(newPayment);
      setNewPayment({ orderId: "", amount: "", method: "card" });
      setShowModal(false);
      toast.success("Payment added successfully!");
      
      // Force immediate refresh
      setTimeout(() => {
        fetchPayments();
        loadPaymentRequests();
        // Trigger storage event to update other components
        window.dispatchEvent(new Event('storage'));
      }, 100);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add payment");
    }
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <h2>Loading payments...</h2>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="text-center fw-bold mb-4">💳 My Payments & Orders</h2>
      
      {/* Payment Summary Cards */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-success text-white">
            <Card.Body>
              <h4>₹{totalPaid.toFixed(2)}</h4>
              <p className="mb-0">Total Paid</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-primary text-white">
            <Card.Body>
              <h4>{totalOrders}</h4>
              <p className="mb-0">Total Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-warning text-dark">
            <Card.Body>
              <h4>{pendingPayments}</h4>
              <p className="mb-0">Pending Payments</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-danger text-white">
            <Card.Body>
              <h4>{unpaidOrders}</h4>
              <p className="mb-0">Unpaid Orders</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Payment Request Notifications */}
      {paymentRequests.length > 0 && (
        <div className="mb-4">
          <h5 className="mb-3">💳 Payment Requests</h5>
          {paymentRequests.map((request, index) => (
            <div key={index} className="alert alert-warning alert-dismissible d-flex justify-content-between align-items-center">
              <div>
                <strong>Payment Required!</strong>
                <p className="mb-0">{request.message}</p>
                <small className="text-muted">
                  Requested on {new Date(request.requestedAt).toLocaleDateString()}
                </small>
              </div>
              <div>
                <Button 
                  variant="success" 
                  size="sm" 
                  className="me-2"
                  onClick={() => {
                    // Create payment for counter payment
                    const paymentData = {
                      id: Date.now(),
                      orderId: request.orderId,
                      amount: request.amount,
                      paymentMethod: 'counter',
                      paymentStatus: 'completed',
                      createdAt: new Date().toISOString()
                    };
                    
                    const existingPayments = JSON.parse(localStorage.getItem('mockPayments') || '[]');
                    existingPayments.push(paymentData);
                    localStorage.setItem('mockPayments', JSON.stringify(existingPayments));
                    
                    dismissRequest(index);
                    fetchPayments();
                    window.dispatchEvent(new Event('storage'));
                    toast.success('Payment completed at counter!');
                  }}
                >
                  Pay Now
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => dismissRequest(index)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {payments.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <h5 className="text-muted">No payments found.</h5>
            <p className="text-muted">Your payment history will appear here.</p>
          </Card.Body>
        </Card>
      ) : (
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-light fw-bold">Payment History</Card.Header>
          <Card.Body>
            <Table striped hover responsive className="align-middle">
              <thead>
                <tr className="text-center">
                  <th>Order #</th>
                  <th>Order Date</th>
                  <th>Order Amount</th>
                  <th>Payment Status</th>
                  <th>Payment Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const payment = payments.find(p => 
                    String(p.orderId) === String(order.id) && p.paymentStatus === 'completed'
                  );
                  return (
                    <tr key={order.id} className="text-center">
                      <td>{order.orderNumber}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>₹{order.totalAmount}</td>
                      <td>
                        <Badge bg={payment ? "success" : "danger"}>
                          {payment ? 'Paid' : 'Unpaid'}
                        </Badge>
                      </td>
                      <td>{payment ? new Date(payment.createdAt).toLocaleDateString() : '-'}</td>
                      <td>
                        <span className="text-muted">
                          {payment ? 'Paid' : 'Pay at Counter'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Order ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter order ID"
                value={newPayment.orderId}
                onChange={(e) => setNewPayment({ ...newPayment, orderId: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select
                value={newPayment.method}
                onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
              >
                <option value="card">Credit/Debit Card</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="wallet">Digital Wallet</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddPayment}>
            Add Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}