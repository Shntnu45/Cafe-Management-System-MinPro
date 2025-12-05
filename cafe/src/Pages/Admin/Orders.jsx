import { useState, useEffect } from "react";
import { Container, Table, Button, Badge, Card, Form } from "react-bootstrap";
import { orderService } from "../../services/orderService";
import { toast } from 'react-toastify';

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getAllOrders();
      console.log('Orders response:', response);
      setOrders(response.data?.orders || []);
    } catch (error) {
      console.error('Fetch orders error:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated successfully!");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  // ✅ Delete an order
  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      const updatedOrders = orders.filter((o) => o.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
    }
  };

  // ✅ Badge color helper
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
      <h2 className="text-center fw-bold mb-4">🧾 All Orders (Admin View)</h2>

      {loading ? (
        <div className="text-center">
          <h5>Loading orders...</h5>
        </div>
      ) : orders.length === 0 ? (
        <h5 className="text-center text-muted">No orders have been placed yet.</h5>
      ) : (
        orders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((order) => {
          return (
            <Card key={order.id} className="mb-4 shadow-sm border-0">
              <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                <div>
                  <strong>Order #{order.orderNumber}</strong> <br />
                  <small className="text-muted">
                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </small> <br />
                  <small>
                    <strong>Customer:</strong> {order.User?.name || "Unknown"} ({order.User?.email})
                  </small>
                </div>

                <div className="d-flex flex-column align-items-end">
                  <Badge
                    bg={getStatusVariant(order.status)}
                    className="p-2 fs-6 mb-2"
                  >
                    {order.status || 'pending'}
                  </Badge>

                  <Form.Select
                    size="sm"
                    value={order.status || 'pending'}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    style={{ width: "150px" }}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </div>
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

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    <small className="text-muted">
                      Order Type: {order.orderType || 'takeaway'}
                      {order.Table && ` | Table: ${order.Table.tableNumber}`}
                      {order.estimatedPreparationTime && ` | Est. Time: ${order.estimatedPreparationTime} min`}
                    </small>
                  </div>
                  <h5>Total: ₹{order.totalAmount}</h5>
                </div>
              </Card.Body>
            </Card>
          );
        })
      )}
    </Container>
  );
}
