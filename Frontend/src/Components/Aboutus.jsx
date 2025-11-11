import { Container, Row, Col, Card, Navbar } from "react-bootstrap";

import about from "../assets/aboutusimg.png";
import cafeHero from "../assets/cafeCofee.jpg";
import sitting1 from "../assets/ambians1.jpg";
import sitting2 from "../assets/ambians2.jpg";
import sitting3 from "../assets/ambians4.jpg";

import welcome from "../assets/welcome.png";
import { Footer } from "./Footer";

import Rutik from "../assets/Ruttik_Hiwase.png";
import shantanu from "../assets/Passsimg.jpg";
import Rohit from "../assets/Rohit.jpg";

export function AboutUs() {
  return (
    <>
      <Navbar />

      <section
        className="hero-section text-white d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: `url(${cafeHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "70vh",
        }}
      >
        <div className="text-center bg-dark bg-opacity-50 p-4 rounded">
          <img
            src={welcome}
            alt="Cafe interior"
            className="img-fluid rounded shadow"
          />
        </div>
      </section>

      <Container className="my-5">
        <Row className="align-items-center">
          <Col md={6}>
            <h2>About Our Café</h2>
            <p>
              MyCafe is more than just a coffee shop — it’s a space where people
              come together to relax, work, and connect. Established in 2023, we
              take pride in serving freshly brewed coffee, delicious snacks, and
              a cozy ambiance that feels like home.
            </p>
            <p>
              Our coffee beans are handpicked from the finest farms, roasted to
              perfection, and brewed by skilled baristas who truly love what
              they do. Whether you’re looking for a peaceful spot to read or a
              lively environment to chat with friends, MyCafe is your ideal
              destination.
            </p>
            <p>
              Visit us today and experience the aroma, taste, and warmth that
              make MyCafe special.
            </p>
          </Col>
          <Col md={6}>
            <img
              src={about}
              alt="Cafe interior"
              className="img-fluid w-10 rounded shadow"
            />
          </Col>
        </Row>
      </Container>

      <Container className="text-center mb-5">
        <h3 className="mb-4">Our Sitting & Ambience</h3>
        <Row>
          <Col md={4} className="mb-3">
            <img
              src={sitting1}
              alt="Seating 1"
              className="img-fluid rounded shadow-sm"
            />
          </Col>
          <Col md={4} className="mb-3">
            <img
              src={sitting2}
              alt="Seating 2"
              className="img-fluid rounded shadow-sm"
            />
          </Col>
          <Col md={4} className="mb-3">
            <img
              src={sitting3}
              alt="Seating 3"
              className="img-fluid rounded shadow-sm"
            />
          </Col>
        </Row>
      </Container>

      <div className="text-center py-5 bg-light">
        <Container>
          <h2 className="fw-bold mb-3">Experience the Heart of MyCafe</h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: "800px" }}>
            At MyCafe, every cup tells a story. We believe in crafting moments —
            whether it’s your morning espresso, a lazy afternoon cappuccino, or
            an evening spent with friends. Our goal is to create a place where
            community, comfort, and coffee come together seamlessly.
          </p>
        </Container>
      </div>

      <Container className="text-center my-5">
        <h3 className="mb-4">Meet Our Developers</h3>
        <Row className="justify-content-center">
          <Col md={4} sm={6} className="mb-4">
            <Card className="shadow-sm h-100 border-0">
              <div className="text-center p-3">
                <img
                  src={shantanu}
                  alt="Developer 1"
                  className="rounded-circle"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              </div>
              <Card.Body>
                <Card.Title> <b className="text-danger">Shantanu Chaudhari</b></Card.Title>
                <Card.Text>
                  <h6 >Team Member 1</h6>
                </Card.Text>
              </Card.Body>

            </Card>
          </Col>

          <Col md={4} sm={6} className="mb-4">
            <Card className="shadow-sm h-100 border-0">
              <div className="text-center p-3">
                <img
                  src={Rutik}
                  alt="Developer 2"
                  className="rounded-circle"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              </div>
              <Card.Body>
                <Card.Title> <b className="text-danger">Rutik Hiwase</b></Card.Title>
                <Card.Text>
                  <h6>Team Member 2</h6>

                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} sm={6} className="mb-4">
            <Card className="shadow-sm h-100 border-0">
              <div className="text-center p-3">
                <img
                  src={Rohit}
                  alt="Developer 3"
                  className="rounded-circle"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              </div>
              <Card.Body>
                <Card.Title><b className="text-danger">Rohit Balse</b></Card.Title>
                <Card.Text>
                  <h6>Team Member 3</h6>

                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
}
