import { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Row, Col } from "react-bootstrap";
import { orderService } from "../../services/orderService";
import { toast } from "react-toastify";

export function UserPayments() {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ordersResponse = await orderService.getUserOrders();
      setOrders(ordersResponse.data?.orders || []);
      
      const paymentsData = JSON.parse(localStorage.getItem("payments") || "[]");
      setPayments(paymentsData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const getPaymentForOrder = (orderId) => {
    return payments.find(payment => String(payment.orderId) === String(orderId));
  };

  const totalPaid = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const totalUnpaid = payments.filter(p => p.status === "unpaid").reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <h2>Loading payments...</h2>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="text-center fw-bold mb-4">💳 My Payments</h2>
      
      {/* Payment Summary Cards */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card className="text-center shadow-sm border-0 bg-success text-white">
            <Card.Body>
              <h4>₹{totalPaid.toFixed(2)}</h4>
              <p className="mb-0">Total Paid</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm border-0 bg-warning text-dark">
            <Card.Body>
              <h4>₹{totalUnpaid.toFixed(2)}</h4>
              <p className="mb-0">Pending Payment</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm border-0 bg-primary text-white">
            <Card.Body>
              <h4>{orders.length}</h4>
              <p className="mb-0">Total Orders</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Header className="bg-light fw-bold">Payment History</Card.Header>
        <Card.Body>
          {orders.length === 0 ? (
            <p className="text-muted text-center">No orders found.</p>
          ) : (
            <Table striped hover responsive className="align-middle">
              <thead>
                <tr className="text-center">
                  <th>Order #</th>
                  <th>Order Date</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Payment Status</th>
                  <th>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const payment = getPaymentForOrder(order.id);
                  return (
                    <tr key={order.id} className="text-center">
                      <td>{order.orderNumber}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>₹{order.totalAmount}</td>
                      <td className="text-capitalize">
                        {payment?.method || 'Not Set'}
                      </td>
                      <td>
                        <Badge
                          bg={
                            payment?.status === "paid"
                              ? "success"
                              : payment?.status === "unpaid"
                              ? "warning"
                              : "danger"
                          }
                        >
                          {payment?.status === "paid" ? "Paid" : 
                           payment?.status === "unpaid" ? "Pay at Counter" : "Not Paid"}
                        </Badge>
                      </td>
                      <td>
                        {payment ? new Date(payment.timestamp).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}