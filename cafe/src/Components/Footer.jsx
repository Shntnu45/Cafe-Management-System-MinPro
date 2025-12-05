import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-dark text-light text-center py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5 className="fw-bold fs-4 text-danger">
              <span className="me-2" style={{ fontSize: '1.5rem' }}>☕</span>
              Café DS
            </h5>
            <p>Serving love and taste since 2024.</p>
            <div className="d-flex justify-content-center gap-3 mt-2">
              <Link to="/" className="text-light text-decoration-none">Home</Link>
              <Link to="/about" className="text-light text-decoration-none">About</Link>
              <Link to="/contact" className="text-light text-decoration-none">Contact</Link>
            </div>
          </Col>

          <Col md={4} className="mb-3 mb-md-0">
            <h5>Contact</h5>
            <p>Email: CafeDS@cafe.com</p>
            <p>Phone: +91 932247 4744</p>
              <p>Location: Opposite of CDAC Kharghar, Mumbai</p>

          </Col>

          <Col md={4}>
            <h5>Follow Us</h5>
            <p>Instagram | Facebook | Twitter</p>
          </Col>
        </Row>

        <hr className="border-light" />
        <p className="mb-0">&copy; 2025 Café DS. All rights reserved.</p>
      </Container>
    </footer>
  );
}
