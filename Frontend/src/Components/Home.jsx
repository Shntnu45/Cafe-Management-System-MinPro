import { Carousel, Container, Row, Col } from "react-bootstrap";
import slide1 from "../assets/firstimg.png";
import slide2 from "../assets/slide2.png";
import slide3 from "../assets/slide3.jpg";
import slide4 from "../assets/slide4.jpg";
import aboutImg from "../assets/aboutImg.jpg";
import Whyimg from "../assets/banner5.png";
import { Footer } from "./Footer";

export function HomePage() {
  return (
    <div>
      <Container fluid className="d-flex justify-content-center align-items-center mt-4">
        <div style={{ width: "95%", overflow: "hidden" }}>
          <Carousel fade interval={2500} controls={true} indicators={true}>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={slide1}
                alt="First slide"
                style={{ height: "550px", objectFit: "cover" }}
              />
              <Carousel.Caption style={{ backgroundColor: "rgba(0,0,0,0.4)", borderRadius: "10px", padding: "10px" }}>
                <h2 className="fw-bold text-light">Welcome to Café DS</h2>
                <p className="text-light">Enjoy our best food and warm atmosphere.</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="d-block w-100"
                src={slide2}
                alt="Second slide"
                style={{ height: "550px", objectFit: "cover" }}
              />
              <Carousel.Caption style={{ backgroundColor: "rgba(0,0,0,0.4)", borderRadius: "10px", padding: "10px" }}>
                <h2 className="fw-bold text-light">Fresh Burgers</h2>
                <p className="text-light">Made with love and perfection.</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="d-block w-100"
                src={slide3}
                alt="Third slide"
                style={{ height: "550px", objectFit: "cover" }}
              />
              <Carousel.Caption style={{ backgroundColor: "rgba(0,0,0,0.4)", borderRadius: "10px", padding: "10px" }}>
                <h2 className="fw-bold text-light">Delicious Desserts</h2>
                <p className="text-light">Sweet treats for your special moments.</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="d-block w-100"
                src={slide4}
                alt="Fourth slide"
                style={{ height: "550px", objectFit: "cover" }}
              />
              <Carousel.Caption style={{ backgroundColor: "rgba(0,0,0,0.4)", borderRadius: "10px", padding: "10px" }}>
                <h2 className="fw-bold text-light">Relax & Enjoy</h2>
                <p className="text-light">Take a break with your favorite meal.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
      </Container>

      <Container className="py-5">
        <Row className="align-items-center">
          <Col md={6}>
            <h2 className="fw-bold fs-4 text-danger mb-3">Café DS</h2>
            <p className="lead">
              Café DS is your perfect spot to relax, refresh, and recharge.
              Whether it’s your morning coffee, a friendly hangout, or a
              late-night craving — we serve happiness in every sip and bite.
            </p>
            <p>
              Our chefs and baristas bring you the best of taste and quality.
              Visit us to experience great flavors, cozy ambience, and
              outstanding service — all under one roof.
            </p>
          </Col>
          <Col md={6} className="text-center">
            <img
              src={aboutImg}
              alt="About Café"
              className="img-fluid rounded shadow"
              style={{ maxHeight: "350px", objectFit: "cover" }}
            />
          </Col>
        </Row>
      </Container>

      <Container className="py-5 text-center">
        <h2 className="mb-4 fw-bold">Why Choose Our Café?</h2>
        <Row className="justify-content-center mb-5">
          <Col md={4} sm={12} className="mb-4">
            <div className="p-4 border rounded shadow-sm h-100 bg-light">
              <h4 className="text-black">☕ Premium Quality Coffee</h4>
              <p>
                We serve freshly brewed coffee made from the finest beans, ensuring rich flavors and perfect aroma in every cup.
              </p>
            </div>
          </Col>
          <Col md={4} sm={12} className="mb-4">
            <div className="p-4 border rounded shadow-sm h-100 bg-light">
              <h4 className="text-black">🍽️ Fresh & Delicious Food</h4>
              <p>
                Our menu features freshly prepared snacks, breakfast items, and desserts made with quality ingredients daily.
              </p>
            </div>
          </Col>
          <Col md={4} sm={12} className="mb-4">
            <div className="p-4 border rounded shadow-sm h-100 bg-light">
              <h4 className="text-black">🚀 Fast & Convenient Service</h4>
              <p>
                Easy online ordering, quick table selection, secure payments, and real-time order tracking for your convenience.
              </p>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={8} sm={12}>
            <img
              src={Whyimg}
              alt="Why Choose Us"
              className="img-fluid rounded shadow"
              style={{ width: "100%", height: "350px", objectFit: "cover" }}
            />
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
}
