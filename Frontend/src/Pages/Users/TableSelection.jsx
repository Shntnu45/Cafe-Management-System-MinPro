import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { tableService } from '../../services/tableService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export function TableSelection() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await tableService.getAllTables();
      setTables(response.data?.tables || []);
    } catch (error) {
      toast.error('Failed to fetch tables');
    } finally {
      setLoading(false);
    }
  };

  const handleTableSelect = (table) => {
    if (table.status === 'occupied') {
      toast.error('This table is already occupied');
      return;
    }
    setSelectedTable(table);
    setShowModal(true);
  };

  const confirmTableSelection = async () => {
    if (!customerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      console.log('Reserving table:', selectedTable.id, { status: 'occupied', occupiedBy: customerName });
      
      const response = await tableService.updateTable(selectedTable.id, {
        status: 'occupied',
        occupiedBy: customerName
      });
      
      console.log('Table reservation response:', response);

      localStorage.setItem('selectedTable', JSON.stringify({
        ...selectedTable,
        customerName,
        status: 'occupied'
      }));

      toast.success(`Table ${selectedTable.tableNumber} reserved successfully!`);
      navigate('/user/menu');
    } catch (error) {
      console.error('Table reservation error:', error);
      toast.error(error.response?.data?.message || 'Failed to reserve table');
    }
  };

  const getTableStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'occupied': return 'danger';
      case 'reserved': return 'warning';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <h2>Loading tables...</h2>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="text-center fw-bold mb-4">🪑 Select Your Table</h2>
      <p className="text-center text-muted mb-4">
        Please select an available table to start your dining experience
      </p>

      <Row className="g-4">
        {tables.map((table) => (
          <Col key={table.id} lg={3} md={4} sm={6}>
            <Card 
              className={`h-100 shadow-sm border-2 ${
                table.status === 'available' ? 'border-success' : 'border-danger'
              }`}
              style={{ cursor: table.status === 'available' ? 'pointer' : 'not-allowed' }}
              onClick={() => handleTableSelect(table)}
            >
              <Card.Body className="text-center">
                <h4 className="mb-3">{table.tableNumber}</h4>
                <p className="mb-2">
                  <strong>Capacity:</strong> {table.capacity} people
                </p>
                <p className="mb-3">
                  <strong>Location:</strong> {table.location}
                </p>
                <Button
                  variant={getTableStatusColor(table.status)}
                  size="sm"
                  disabled={table.status !== 'available'}
                  className="text-capitalize"
                >
                  {table.status}
                </Button>
                {table.status === 'occupied' && (
                  <p className="mt-2 small text-muted">
                    {table.notes || 'Occupied'}
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center mt-5">
        <div className="border-top pt-4">
          <h5 className="mb-3">Don't need a table?</h5>
          <Button 
            variant="outline-primary" 
            onClick={() => {
              localStorage.setItem('selectedTable', JSON.stringify({ 
                tableNumber: 'TAKEAWAY', 
                customerName: 'Takeaway Customer',
                orderType: 'takeaway'
              }));
              navigate('/user/menu');
            }}
          >
            Order Takeaway Instead
          </Button>
        </div>
      </div>

      {tables.filter(t => t.status === 'available').length === 0 && (
        <div className="text-center mt-3">
          <div className="alert alert-warning">
            <h5>No tables currently available</h5>
            <p className="mb-0">All tables are occupied. You can still order takeaway above.</p>
          </div>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reserve Table {selectedTable?.tableNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Your Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </Form.Group>
            <div className="mb-3">
              <strong>Table Details:</strong>
              <ul className="mt-2">
                <li>Table: {selectedTable?.tableNumber}</li>
                <li>Capacity: {selectedTable?.capacity} people</li>
                <li>Location: {selectedTable?.location}</li>
              </ul>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={confirmTableSelection}>
            Reserve Table
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}