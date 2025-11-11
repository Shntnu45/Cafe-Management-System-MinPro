import { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Modal, Form, Row, Col, Spinner } from 'react-bootstrap';
import { paymentService } from '../../services/paymentService';
import { initializeMockData } from '../../utils/mockDataHelper';
import { toast } from 'react-toastify';

export function PaymentManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchOrdersWithPayments = async () => {
    try {
      if (loading) setLoading(true);
      // Initialize mock data for demo purposes
      initializeMockData();
      const response = await paymentService.getOrdersWithPayments();
      const ordersData = response.data?.orders || [];
      
      // Sort by creation date to show latest first
      const sortedOrders = ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error('Failed to fetch orders');
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersWithPayments();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrdersWithPayments, 30000);
    
    // Listen for payment updates from other sections
    const handlePaymentUpdate = () => fetchOrdersWithPayments();
    window.addEventListener('paymentStatusUpdated', handlePaymentUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('paymentStatusUpdated', handlePaymentUpdate);
    };
  }, []);

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

  const handleUpdatePayment = (payment) => {
    setSelectedPayment(payment);
    setNewStatus(payment.paymentStatus);
    setNotes(payment.notes || '');
    setShowUpdateModal(true);
  };

  const submitPaymentUpdate = async () => {
    if (!selectedPayment || !newStatus) return;

    setUpdating(true);
    try {
      await paymentService.updatePaymentStatus(selectedPayment.id, {
        paymentStatus: newStatus,
        notes: notes
      });
      
      toast.success('Payment status updated successfully');
      setShowUpdateModal(false);
      fetchOrdersWithPayments();
      
      // Trigger refresh of other admin sections
      window.dispatchEvent(new CustomEvent('paymentStatusUpdated'));
    } catch (error) {
      toast.error('Failed to update payment status');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.Payment?.paymentStatus === filter;
  });

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

      {filteredOrders.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h5 className="text-muted">No orders found</h5>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body className="p-0">
            <Table responsive striped hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Payment Status</th>
                  <th>Order Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.orderNumber}</strong>
                      <br />
                      <small className="text-muted">
                        {order.orderType} {order.Table && `| Table ${order.Table.tableNumber}`}
                      </small>
                    </td>
                    <td>
                      {order.User?.name || 'Guest'}
                      <br />
                      <small className="text-muted">{order.User?.email}</small>
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
                      {new Date(order.createdAt).toLocaleDateString()}
                      <br />
                      <small className="text-muted">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </small>
                    </td>
                    <td>
                      {order.Payment?.paymentStatus === 'unpaid' && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleUpdatePayment(order.Payment)}
                        >
                          Mark Paid
                        </Button>
                      )}
                      {order.Payment?.paymentStatus === 'pending' && (
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => handleUpdatePayment(order.Payment)}
                        >
                          Update Status
                        </Button>
                      )}
                      {order.Payment?.paymentStatus === 'requested' && (
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => handleUpdatePayment(order.Payment)}
                        >
                          Complete
                        </Button>
                      )}
                      {(order.Payment?.paymentStatus === 'completed' || order.Payment?.paymentStatus === 'done') && (
                        <Badge bg="success">Paid</Badge>
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
              
              <Form.Group className="mb-3">
                <Form.Label>Notes (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this payment update..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={submitPaymentUpdate}
            disabled={updating || !newStatus}
          >
            {updating ? (
              <>
                <Spinner size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              'Update Status'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}