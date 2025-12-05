import { useState, useEffect } from "react";
import { Table, Button, Form, Container, Row, Col, Card, Modal } from "react-bootstrap";
import { menuService } from "../../services/menuService";
import { toast } from 'react-toastify';

export default function ManageMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    image: "",
    isAvailable: true
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await menuService.getAllMenus();
      console.log('Menu items response:', response);
      setMenuItems(response.data?.menus || []);
    } catch (error) {
      console.error('Fetch menu items error:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch menu items";
      toast.error(errorMessage);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await menuService.getCategories();
      console.log('Categories response:', response);
      setCategories(response.data?.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error("Failed to fetch categories");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const maxSize = 400;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
      setNewItem((prev) => ({ ...prev, image: compressedDataUrl }));
    };
    
    img.src = URL.createObjectURL(file);
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      toast.error("Please enter category name!");
      return;
    }
    
    try {
      await menuService.createCategory(newCategory);
      setNewCategory({ name: "", description: "" });
      setShowCategoryModal(false);
      toast.success("Category added successfully!");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add category");
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.categoryId || !newItem.image) {
      toast.error("Please fill all required fields and upload an image!");
      return;
    }
    
    const price = parseFloat(newItem.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price!");
      return;
    }
    
    setLoading(true);
    try {
      const itemData = {
        name: newItem.name.trim(),
        description: newItem.description?.trim() || "",
        price: price,
        categoryId: parseInt(newItem.categoryId),
        image: newItem.image,
        isAvailable: newItem.isAvailable
      };
      
      await menuService.createMenu(itemData);
      setNewItem({ name: "", description: "", price: "", categoryId: "", image: "", isAvailable: true });
      toast.success("Item added successfully!");
      fetchMenuItems();
    } catch (error) {
      console.error('Create error:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to add item";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    console.log('Editing item:', item);
    setEditingItem(item);
    setNewItem({
      name: item.name || "",
      description: item.description || "",
      price: item.price ? item.price.toString() : "",
      categoryId: item.categoryId ? item.categoryId.toString() : "",
      image: item.image || "",
      isAvailable: item.isAvailable !== undefined ? item.isAvailable : true
    });
  };

  const handleUpdate = async () => {
    if (!newItem.name || !newItem.price || !newItem.categoryId) {
      toast.error("Please fill all required fields!");
      return;
    }
    
    const price = parseFloat(newItem.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price!");
      return;
    }
    
    setLoading(true);
    try {
      const updateData = {
        name: newItem.name.trim(),
        description: newItem.description?.trim() || "",
        price: price,
        categoryId: parseInt(newItem.categoryId),
        isAvailable: newItem.isAvailable
      };
      
      if (newItem.image && newItem.image !== editingItem.image) {
        updateData.image = newItem.image;
      }
      
      await menuService.updateMenu(editingItem.id, updateData);
      setNewItem({ name: "", description: "", price: "", categoryId: "", image: "", isAvailable: true });
      setEditingItem(null);
      toast.success("Item updated successfully!");
      fetchMenuItems();
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update item";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setNewItem({ name: "", description: "", price: "", categoryId: "", image: "", isAvailable: true });
  };

  const handleDelete = async (id) => {
    toast.warn(
      <div>
        <p>Are you sure you want to delete this menu item?</p>
        <div>
          <button 
            className="btn btn-danger btn-sm me-2" 
            onClick={() => confirmDelete(id)}
          >
            Yes, Delete
          </button>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false
      }
    );
  };

  const confirmDelete = async (id) => {
    toast.dismiss();
    try {
      await menuService.deleteMenu(id);
      toast.success("Item deleted successfully!");
      fetchMenuItems();
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete item";
      toast.error(errorMessage);
    }
  };

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4 fw-bold">📋 Manage Menu</h2>

      {/* Category Management */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Categories</h5>
              <Button variant="primary" size="sm" onClick={() => setShowCategoryModal(true)}>
                Add Category
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <span key={cat.id} className="badge bg-secondary fs-6 p-2">
                    {cat.name}
                  </span>
                ))}
                {categories.length === 0 && <span className="text-muted">No categories added yet</span>}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Menu Item Form */}
      <div className="border p-4 rounded shadow-sm mb-4 bg-light">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h5>
          {editingItem && (
            <Button variant="outline-secondary" size="sm" onClick={handleCancelEdit}>
              Cancel Edit
            </Button>
          )}
        </div>
        <Form className="row g-3">
          <Form.Group className="col-md-4">
            <Form.Label>Item Name *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="col-md-4">
            <Form.Label>Category *</Form.Label>
            <Form.Select
              value={newItem.categoryId}
              onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="col-md-4">
            <Form.Label>Price *</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="col-md-8">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Enter item description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="col-md-4">
            <Form.Label>Image *</Form.Label>
            <Form.Control type="file" onChange={handleImageUpload} />
          </Form.Group>
          {newItem.image && (
            <div className="col-12">
              <img src={newItem.image} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }} />
            </div>
          )}
          <div className="col-12">
            {editingItem ? (
              <Button variant="primary" onClick={handleUpdate} disabled={loading}>
                {loading ? "Updating..." : "Update Item"}
              </Button>
            ) : (
              <Button variant="success" onClick={handleAddItem} disabled={loading}>
                {loading ? "Adding..." : "Add Menu Item"}
              </Button>
            )}
          </div>
        </Form>
      </div>

      {/* Menu Items Table */}
      <Table striped bordered hover responsive>
        <thead className="table-dark text-center">
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Price (₹)</th>
            <th>Available</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="align-middle text-center">
          {menuItems.length === 0 ? (
            <tr>
              <td colSpan="7">No menu items added yet.</td>
            </tr>
          ) : (
            menuItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={item.image}
                    alt={item.name}
                    width="60"
                    height="60"
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.Category?.name || 'N/A'}</td>
                <td>{item.description || 'N/A'}</td>
                <td>₹{item.price}</td>
                <td>
                  <span className={`badge ${item.isAvailable ? 'bg-success' : 'bg-danger'}`}>
                    {item.isAvailable ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Category Modal */}
      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter category description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddCategory}>
            Add Category
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
