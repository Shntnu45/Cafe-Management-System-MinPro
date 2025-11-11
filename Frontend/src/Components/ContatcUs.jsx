import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

export function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us! We’ll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/src/assets/cafeCofee.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
      }}
    >
      <Container
        className="p-4 rounded shadow-lg"
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          maxWidth: "500px",
          color: "#333",
        }}
      >
        <h2
          className="text-center mb-4 fw-bold"
          style={{ color: "#6f4e37" }}
        >
          Contact Us
        </h2>
        <p
          className="text-center mb-4"
          style={{ color: "#6f4e37", fontWeight: "500" }}
        >
          Have a question or feedback? We’d love to hear from you!
        </p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="contactName">
            <Form.Label className="fw-semibold">Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your full name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="contactEmail">
            <Form.Label className="fw-semibold">Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="contactMessage">
            <Form.Label className="fw-semibold">Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Write your message here..."
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100 text-white"
            style={{
              backgroundColor: "#6f4e37",
              border: "none",
              fontWeight: "600",
            }}
          >
            Send Message
          </Button>
        </Form>
      </Container>
    </div>
  );
}
