import { useEffect, useState } from "react";
import { Card, Row, Col, Table, Badge, Button } from "react-bootstrap";
import { orderService } from "../../services/orderService";
import { paymentService } from "../../services/paymentService";
import { menuService } from "../../services/menuService";
import { userService } from "../../services/userService";
import { tableService } from "../../services/tableService";
import { initializeMockData } from "../../utils/mockDataHelper";
import { toast } from 'react-toastify';

export function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Initialize mock data for demo purposes
      initializeMockData();
      
      const [ordersResponse, paymentsResponse, menuResponse, usersResponse, tablesResponse] = await Promise.all([
        orderService.getAllOrders(),
        paymentService.getAllPayments(),
        menuService.getAllMenus(),
        userService.getAllUsers(),
        tableService.getAllTables()
      ]);
      
      setOrders(ordersResponse.data?.orders || []);
      setPayments(paymentsResponse.data?.payments || []);
      setMenuItems(menuResponse.data?.menus || []);
      setUsers(usersResponse.data?.users || []);
      setTables(tablesResponse.data?.tables || []);
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate Stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const confirmedOrders = orders.filter((o) => o.status === "confirmed").length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const totalMenuItems = menuItems.length;
  const totalUsers = users.filter(u => u.role === 'customer').length;
  const totalTables = tables.length;
  const availableTables = tables.filter(t => t.status === 'available').length;
  const totalPayments = payments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);

  if (loading) {
    return (
      <div className="container py-4 text-center">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="text-center fw-bold mb-4">📊 Admin Dashboard Overview</h2>

      {/* Summary Cards */}
      <Row className="mb-4 g-3">
        <Col lg={3} md={6}>
          <Card className="text-center shadow-sm border-0 bg-primary text-white">
            <Card.Body>
              <h4>{totalOrders}</h4>
              <p>Total Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="text-center shadow-sm border-0 bg-success text-white">
            <Card.Body>
              <h4>₹{totalRevenue.toFixed(2)}</h4>
              <p>Total Revenue</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="text-center shadow-sm border-0 bg-info text-white">
            <Card.Body>
              <h4>{totalUsers}</h4>
              <p>Total Customers</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="text-center shadow-sm border-0 bg-dark text-white">
            <Card.Body>
              <h4>{totalMenuItems}</h4>
              <p>Menu Items</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Order Status Cards */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-warning text-dark">
            <Card.Body>
              <h4>{pendingOrders}</h4>
              <p>Pending Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-info text-white">
            <Card.Body>
              <h4>{confirmedOrders}</h4>
              <p>Confirmed Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-success text-white">
            <Card.Body>
              <h4>{completedOrders}</h4>
              <p>Completed Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-secondary text-white">
            <Card.Body>
              <h4>{availableTables}/{totalTables}</h4>
              <p>Available Tables</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders and Payments */}
      <Row className="g-4">
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-light fw-bold d-flex justify-content-between align-items-center">
              <span>Recent Orders</span>
              <Button variant="outline-primary" size="sm" onClick={fetchDashboardData}>
                🔄 Refresh
              </Button>
            </Card.Header>
            <Card.Body>
              {orders.length === 0 ? (
                <p className="text-muted text-center">No orders found.</p>
              ) : (
                <Table striped hover responsive className="align-middle">
                  <thead>
                    <tr className="text-center">
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .slice(0, 10)
                      .map((order) => (
                        <tr key={order.id} className="text-center">
                          <td>{order.orderNumber}</td>
                          <td>{order.User?.name || 'Unknown'}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>₹{order.totalAmount}</td>
                          <td>
                            <Badge
                              bg={
                                order.status === "completed"
                                  ? "success"
                                  : order.status === "confirmed"
                                  ? "info"
                                  : order.status === "preparing"
                                  ? "warning"
                                  : "secondary"
                              }
                            >
                              {order.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-light fw-bold">Payment Summary</Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Payments:</span>
                <strong>₹{totalPayments.toFixed(2)}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Orders:</span>
                <strong>{totalOrders}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Average Order:</span>
                <strong>₹{totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'}</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <span>Revenue:</span>
                <strong className="text-success">₹{totalRevenue.toFixed(2)}</strong>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-light fw-bold">Quick Stats</Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Active Tables:</span>
                <Badge bg="success">{totalTables - availableTables}</Badge>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Available Tables:</span>
                <Badge bg="secondary">{availableTables}</Badge>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Menu Categories:</span>
                <Badge bg="info">Active</Badge>
              </div>
              <div className="d-flex justify-content-between">
                <span>Total Customers:</span>
                <Badge bg="primary">{totalUsers}</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
