import { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Button } from "react-bootstrap";
import { orderService } from "../../services/orderService";
import { toast } from 'react-toastify';

export function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getUserOrders();
      setOrders(response.data?.orders || []);
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchOrders();
    
    // Auto-refresh orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    
    return () => clearInterval(interval);
  }, []);



  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return "success";
      case "confirmed":
      case "preparing":
        return "info";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">📦 My Orders</h2>
        <div>
          <small className="text-muted me-3">Auto-refreshes every 30s</small>
          <Button variant="outline-primary" size="sm" onClick={fetchOrders}>
            🔄 Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <h5>Loading orders...</h5>
        </div>
      ) : orders.length === 0 ? (
        <h5 className="text-center text-muted">You have no orders yet.</h5>
      ) : (
        orders.map((order) => {
          return (
            <Card key={order.id} className="mb-4 shadow-sm border-0">
              <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                <div>
                  <strong>Order #{order.orderNumber}</strong> <br />
                  <small className="text-muted">
                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </small>
                </div>
                <Badge
                  bg={getStatusVariant(order.status)}
                  className="p-2 fs-6"
                >
                  {order.status || "pending"}
                </Badge>
              </Card.Header>

              <Card.Body>
                <Table responsive bordered>
                  <thead>
                    <tr className="text-center">
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.OrderItems?.map((item) => (
                      <tr key={item.id} className="text-center align-middle">
                        <td>{item.Menu?.name || 'Unknown Item'}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.unitPrice}</td>
                        <td>₹{item.totalPrice}</td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">
                          No items found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>

                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">
                      Order Type: {order.orderType || 'takeaway'}
                      {order.Table && ` | Table: ${order.Table.tableNumber}`}
                    </small>
                    {order.Payment && (
                      <div className="mt-2">
                        <Badge 
                          bg={order.Payment.paymentStatus === 'completed' || order.Payment.paymentStatus === 'done' ? 'success' : 
                              order.Payment.paymentStatus === 'unpaid' ? 'danger' : 'warning'}
                          className="me-2"
                        >
                          {order.Payment.paymentStatus === 'unpaid' ? 'Unpaid' : 
                           order.Payment.paymentStatus === 'completed' ? 'Paid' :
                           order.Payment.paymentStatus === 'done' ? 'Payment Done' :
                           order.Payment.paymentStatus}
                        </Badge>
                        <small className="text-muted">
                          Payment: {order.Payment.paymentMethod === 'pay_at_counter' ? 'Pay at Counter' : 
                                   order.Payment.paymentMethod === 'netbanking' ? 'Net Banking' :
                                   order.Payment.paymentMethod.toUpperCase()}
                          {order.Payment.transactionId && ` | TXN: ${order.Payment.transactionId.slice(-8)}`}
                        </small>
                      </div>
                    )}
                  </div>
                  <div className="text-end">
                    <h5 className="mb-2">Total: ₹{order.totalAmount}</h5>
                    {order.Payment?.paymentDate && (
                      <small className="text-success">
                        Paid on: {new Date(order.Payment.paymentDate).toLocaleDateString()}
                      </small>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          );
        })
      )}


    </Container>
  );
}
