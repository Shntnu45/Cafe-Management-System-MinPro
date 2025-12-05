import { useState } from 'react';
import { Container, Card, Button, Form, Row, Col, Modal, Spinner } from 'react-bootstrap';
import { paymentService } from '../services/paymentService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export function PaymentPage({ order, onPaymentComplete }) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: '📱', description: 'Pay using UPI apps' },
    { id: 'card', name: 'Card', icon: '💳', description: 'Credit/Debit Card' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦', description: 'Online Banking' }
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setProcessing(true);
    try {
      const paymentData = {
        orderId: order.id,
        amount: order.totalAmount,
        paymentMethod: selectedMethod,
        notes: selectedMethod === 'pay_at_counter' ? 'Customer will pay at counter' : `Payment via ${selectedMethod}`
      };

      await paymentService.createPayment(paymentData);
      
      setProcessing(false);
      setShowSuccess(true);
      
      if (selectedMethod === 'pay_at_counter') {
        toast.success('Order confirmed! Please pay at counter.');
      } else {
        toast.success('Payment processed successfully!');
      }
      
      setTimeout(() => {
        setShowSuccess(false);
        if (onPaymentComplete) {
          onPaymentComplete();
        } else {
          navigate('/user/orders');
        }
      }, 2000);
      
    } catch (error) {
      setProcessing(false);
      toast.error(error.response?.data?.message || 'Payment failed');
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">💳 Payment</h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <h5 className="mb-3">Select Payment Method</h5>
              <Row>
                {paymentMethods.map((method) => (
                  <Col md={6} key={method.id} className="mb-3">
                    <Card 
                      className={`payment-method-card ${selectedMethod === method.id ? 'border-primary bg-light' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <Card.Body className="text-center">
                        <div style={{ fontSize: '2rem' }}>{method.icon}</div>
                        <h6 className="mt-2">{method.name}</h6>
                        <small className="text-muted">{method.description}</small>
                        <Form.Check
                          type="radio"
                          name="paymentMethod"
                          checked={selectedMethod === method.id}
                          onChange={() => setSelectedMethod(method.id)}
                          className="mt-2"
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
            
            <Col md={4}>
              <Card className="bg-light">
                <Card.Header>
                  <h6 className="mb-0">Order Summary</h6>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Order #{order.orderNumber}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Items:</span>
                    <span>{order.OrderItems?.length || 0}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Order Type:</span>
                    <span className="text-capitalize">{order.orderType}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total Amount:</strong>
                    <strong>₹{order.totalAmount}</strong>
                  </div>
                </Card.Body>
              </Card>
              
              <Button 
                variant="success" 
                size="lg" 
                className="w-100 mt-3"
                onClick={handlePayment}
                disabled={!selectedMethod || processing}
              >
                {processing ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${order.totalAmount}`
                )}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Modal show={processing} backdrop="static" centered>
        <Modal.Body className="text-center py-4">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h5>Processing Payment...</h5>
          <p className="text-muted">Please wait while we process your payment</p>
        </Modal.Body>
      </Modal>

      <Modal show={showSuccess} backdrop="static" centered>
        <Modal.Body className="text-center py-4">
          <div style={{ fontSize: '4rem', color: 'green' }}>✅</div>
          <h4 className="text-success mb-3">
            {selectedMethod === 'pay_at_counter' ? 'Order Confirmed!' : 'Payment Successful!'}
          </h4>
          <p>
            {selectedMethod === 'pay_at_counter' 
              ? 'Your order is confirmed. Please pay at the counter when collecting your order.'
              : 'Your payment has been processed successfully.'
            }
          </p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}