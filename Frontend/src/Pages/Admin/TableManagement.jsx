import { useState, useEffect } from "react";
import { Table, Button, Form, Container, Modal } from "react-bootstrap";
import { tableService } from "../../services/tableService";
import { toast } from 'react-toastify';

export function TableManagement() {
  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTable, setNewTable] = useState({
    tableNumber: "",
    capacity: "",
    status: "available"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await tableService.getAllTables();
      setTables(response.data?.tables || []);
    } catch (error) {
      toast.error("Failed to fetch tables");
    }
  };

  const handleAddTable = async () => {
    if (!newTable.tableNumber || !newTable.capacity) {
      toast.error("Please fill all fields!");
      return;
    }
    
    setLoading(true);
    try {
      await tableService.createTable(newTable);
      setNewTable({ tableNumber: "", capacity: "", status: "available" });
      setShowModal(false);
      toast.success("Table added successfully!");
      fetchTables();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add table");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTable = async (id) => {
    try {
      await tableService.deleteTable(id);
      toast.success("Table deleted successfully!");
      fetchTables();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete table");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await tableService.adminUpdateTable(id, { status });
      toast.success("Table status updated!");
      fetchTables();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error.response?.data?.message || "Failed to update table status");
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">🪑 Table Management</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add New Table
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark text-center">
          <tr>
            <th>Table Number</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="align-middle text-center">
          {tables.length === 0 ? (
            <tr>
              <td colSpan="4">No tables found.</td>
            </tr>
          ) : (
            tables.map((table) => (
              <tr key={table.id}>
                <td>{table.tableNumber}</td>
                <td>{table.capacity} people</td>
                <td>
                  <Form.Select
                    value={table.status}
                    onChange={(e) => handleStatusChange(table.id, e.target.value)}
                    style={{ width: "120px", margin: "0 auto" }}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                  </Form.Select>
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteTable(table.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Table</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Table Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter table number"
                value={newTable.tableNumber}
                onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter capacity"
                value={newTable.capacity}
                onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newTable.status}
                onChange={(e) => setNewTable({ ...newTable, status: e.target.value })}
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddTable} disabled={loading}>
            {loading ? "Adding..." : "Add Table"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}