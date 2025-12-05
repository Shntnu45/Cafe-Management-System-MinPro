import { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button, Modal, Form, Row, Col, Spinner } from "react-bootstrap";
import { paymentService } from "../../services/paymentService";
import { initializeMockData } from "../../utils/mockDataHelper";
import { toast } from "react-toastify";

export function AdminPayments() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrdersWithPayments();
  }, []);

  const fetchOrdersWithPayments = async () => {
    try {
      setLoading(true);
      // Initialize mock data for demo purposes
      initializeMockData();
      const response = await paymentService.getOrdersWithPayments();
      setOrders(response.data?.orders || []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch payment data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentStatus = (payment) => {
    setSelectedPayment(payment);
    setNewStatus(payment.paymentStatus);
    setShowUpdateModal(true);
  };

  const confirmStatusUpdate = async () => {
    if (!selectedPayment || !newStatus) return;

    try {
      await paymentService.updatePaymentStatus(selectedPayment.id, {
        paymentStatus: newStatus
      });
      
      toast.success('Payment status updated successfully');
      setShowUpdateModal(false);
      setSelectedPayment(null);
      fetchOrdersWithPayments();
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      'completed': { bg: 'success', text: 'Paid' },
      'done': { bg: 'success', text: 'Payment Done' },
      'unpaid': { bg: 'danger', text: 'Unpaid' },
      'pending': { bg: 'warning', text: 'Pending' },
      'requested': { bg: 'info', text: 'Requested' },
      'failed': { bg: 'danger', text: 'Failed' }
    };
    
    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getPaymentMethodDisplay = (method) => {
    const methods = {
      'pay_at_counter': 'Pay at Counter',
      'netbanking': 'Net Banking',
      'upi': 'UPI',
      'card': 'Card',
      'cash': 'Cash'
    };
    return methods[method] || method;
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.Payment?.paymentStatus === filter;
  });

  const totalRevenue = orders
    .filter(order => order.Payment?.paymentStatus === 'completed' || order.Payment?.paymentStatus === 'done')
    .reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0);
  const pendingPayments = orders.filter(order => order.Payment?.paymentStatus === 'unpaid').length;
  const paidOrders = orders.filter(order => order.Payment?.paymentStatus === 'completed' || order.Payment?.paymentStatus === 'done').length;

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" />
        <h5 className="mt-3">Loading payment data...</h5>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">💳 Payment Management</h2>
        <Button variant="outline-primary" onClick={fetchOrdersWithPayments}>
          🔄 Refresh
        </Button>
      </div>

      {/* Payment Summary Cards */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-success text-white">
            <Card.Body>
              <h4>₹{totalRevenue.toFixed(2)}</h4>
              <p className="mb-0">Total Revenue</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-primary text-white">
            <Card.Body>
              <h4>{orders.length}</h4>
              <p className="mb-0">Total Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-info text-white">
            <Card.Body>
              <h4>{paidOrders}</h4>
              <p className="mb-0">Paid Orders</p>
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
      </Row>

      {/* Filter Section */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={6}>
              <h6>Filter by Payment Status:</h6>
              <Form.Select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="all">All Orders</option>
                <option value="unpaid">Unpaid</option>
                <option value="pending">Pending</option>
                <option value="requested">Requested</option>
                <option value="completed">Completed</option>
                <option value="done">Done</option>
              </Form.Select>
            </Col>
            <Col md={6} className="text-end">
              <div className="text-muted">
                <small>Total Orders: {filteredOrders.length}</small>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Payment Details Table */}
      {filteredOrders.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h5 className="text-muted">No orders found</h5>
          </Card.Body>
        </Card>
      ) : (
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-light fw-bold">
            <span>Order Payment Details</span>
          </Card.Header>
          <Card.Body className="p-0">
            <Table striped hover responsive className="align-middle mb-0">
              <thead>
                <tr className="text-center">
                  <th>Order #</th>
                  <th>Customer Details</th>
                  <th>Order Date</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Payment Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((order) => (
                  <tr key={order.id} className="text-center">
                    <td>
                      <strong>{order.orderNumber}</strong>
                      <br />
                      <small className="text-muted">
                        {order.orderType} {order.Table && `| Table ${order.Table.tableNumber}`}
                      </small>
                    </td>
                    <td>
                      <div className="text-start">
                        <strong>{order.User?.name || 'Guest'}</strong>
                        <br />
                        <small className="text-muted">{order.User?.email}</small>
                        {order.User?.phone && (
                          <>
                            <br />
                            <small className="text-muted">{order.User.phone}</small>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString()}
                      <br />
                      <small className="text-muted">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </small>
                    </td>
                    <td>
                      <strong>₹{order.totalAmount}</strong>
                    </td>
                    <td>
                      {getPaymentMethodDisplay(order.Payment?.paymentMethod)}
                      {order.Payment?.transactionId && (
                        <>
                          <br />
                          <small className="text-muted">
                            TXN: {order.Payment.transactionId.slice(-8)}
                          </small>
                        </>
                      )}
                    </td>
                    <td>
                      {getPaymentStatusBadge(order.Payment?.paymentStatus)}
                      {order.Payment?.paymentDate && (
                        <>
                          <br />
                          <small className="text-success">
                            Paid: {new Date(order.Payment.paymentDate).toLocaleDateString()}
                          </small>
                        </>
                      )}
                    </td>
                    <td>
                      {(order.Payment?.paymentMethod === 'pay_at_counter' && 
                        order.Payment?.paymentStatus === 'unpaid') || 
                       order.Payment?.paymentStatus === 'pending' || 
                       order.Payment?.paymentStatus === 'requested' ? (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleUpdatePaymentStatus(order.Payment)}
                        >
                          Update Status
                        </Button>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Update Payment Status Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Payment Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPayment && (
            <>
              <div className="mb-3">
                <strong>Order:</strong> {selectedPayment.Order?.orderNumber}
                <br />
                <strong>Customer:</strong> {selectedPayment.Order?.User?.name}
                <br />
                <strong>Amount:</strong> ₹{selectedPayment.amount}
                <br />
                <strong>Current Status:</strong> {getPaymentStatusBadge(selectedPayment.paymentStatus)}
              </div>
              
              <Form.Group className="mb-3">
                <Form.Label>New Payment Status</Form.Label>
                <Form.Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="requested">Requested</option>
                  <option value="done">Done</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmStatusUpdate}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}