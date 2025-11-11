import { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, Badge, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa"; 

export function NavbarMenu({ user, onLogout }) {
  const [cartCount, setCartCount] = useState(0);
  const [hasSelectedTable, setHasSelectedTable] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = storedCart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    };

    const checkTableSelection = () => {
      const selectedTable = localStorage.getItem('selectedTable');
      setHasSelectedTable(!!selectedTable);
    };

    updateCartCount();
    checkTableSelection();

    // Check table selection periodically
    const interval = setInterval(checkTableSelection, 1000);

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("storage", checkTableSelection);
    window.addEventListener("focus", updateCartCount);
    window.addEventListener("focus", checkTableSelection);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("storage", checkTableSelection);
      window.removeEventListener("focus", updateCartCount);
      window.removeEventListener("focus", checkTableSelection);
    };
  }, []);

  return (
    <Navbar expand="lg" bg="light" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-danger d-flex align-items-center">
          <span className="me-2" style={{ fontSize: '1.5rem' }}>☕</span>
          Café DS
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">

            {!user && (
              <>
                <Nav.Link as={Link} to="/" className="fw-semibold text-dark">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/about" className="fw-semibold text-dark">
                  About
                </Nav.Link>
                <Nav.Link as={Link} to="/contact" className="fw-semibold text-dark">
                  Contact
                </Nav.Link>

                <div className="d-flex ms-3">
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline-primary"
                    className="rounded-pill px-3 me-2 fw-semibold"
                  >
                    Login
                  </Button>
                  <Button
                    as={Link}
                    to="/signup"
                    variant="danger"
                    className="rounded-pill px-3 fw-semibold text-light"
                  >
                    Register
                  </Button>
                </div>
              </>
            )}

            {user?.role === "user" && (
              <>
                <Nav.Link as={Link} to={hasSelectedTable ? "/user/menu" : "/user/table-selection"} className="fw-semibold text-dark">
                  {hasSelectedTable ? "Menu" : "Select Table"}
                </Nav.Link>
                <Nav.Link as={Link} to="/user/orders" className="fw-semibold text-dark">
                  My Orders
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/user/cart"
                  className="fw-semibold text-dark position-relative"
                >
                  <FaShoppingCart size={20} className="me-1 text-danger" />
                  Cart
                  {cartCount > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      className="ms-1 position-absolute top-0 start-100 translate-middle"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Nav.Link>

                <NavDropdown
                  title={
                    <span className="text-dark">
                      <FaUser className="me-2" />
                      {user.name || user.email}
                    </span>
                  }
                  id="user-dropdown"
                  className="ms-3"
                >
                  <NavDropdown.Item disabled>
                    <strong>Email:</strong> {user.email}
                  </NavDropdown.Item>
                  <NavDropdown.Item disabled>
                    <strong>Role:</strong> {user.role}
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/account">
                    My Account
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={onLogout} className="text-danger">
                    Logout Account
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}

            {user?.role === "admin" && (
              <>
                <Nav.Link as={Link} to="/admin/dashboard" className="fw-semibold text-dark">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/orders" className="fw-semibold text-dark">
                  Orders
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/menu" className="fw-semibold text-dark">
                  Menu
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/tables" className="fw-semibold text-dark">
                  Tables
                </Nav.Link>
                <NavDropdown
                  title={
                    <span className="text-dark">
                      <FaUser className="me-2" />
                      {user.name || user.email}
                    </span>
                  }
                  id="admin-dropdown"
                  className="ms-3"
                >
                  <NavDropdown.Item disabled>
                    <strong>Email:</strong> {user.email}
                  </NavDropdown.Item>
                  <NavDropdown.Item disabled>
                    <strong>Role:</strong> {user.role}
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={onLogout} className="text-danger">
                    Logout Account
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
