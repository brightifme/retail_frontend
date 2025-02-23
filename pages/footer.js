import React from 'react';
import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap'; // Importing Bootstrap components
import 'bootstrap-icons/font/bootstrap-icons.css'; // Importing Bootstrap Icons CSS

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0056b3', color: 'white', padding: '40px 0' }}>
      <Container>
        <Row>
          {/* Footer Column 1: About Us */}
          <Col md={3}>
            <h5>About Us</h5>
            <p>
              We are a leading retail software provider, helping businesses optimize
              their operations and customer experience with innovative solutions.
            </p>
          </Col>

          {/* Footer Column 2: Quick Links */}
          <Col md={3}>
            <h5>Quick Links</h5>
            <ListGroup variant="flush">
              <ListGroup.Item style={{ backgroundColor: 'transparent', border: 'none' }}>
                <a href="/about-us" style={{ color: 'white', textDecoration: 'none' }}>About</a>
              </ListGroup.Item>
              <ListGroup.Item style={{ backgroundColor: 'transparent', border: 'none' }}>
                <a href="/contact-us" style={{ color: 'white', textDecoration: 'none' }}>Contact</a>
              </ListGroup.Item>
              <ListGroup.Item style={{ backgroundColor: 'transparent', border: 'none' }}>
                <a href="/terms" style={{ color: 'white', textDecoration: 'none' }}>Terms & Conditions</a>
              </ListGroup.Item>
              <ListGroup.Item style={{ backgroundColor: 'transparent', border: 'none' }}>
                <a href="/privacy-policy" style={{ color: 'white', textDecoration: 'none' }}>Privacy Policy</a>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          {/* Footer Column 3: Contact */}
          <Col md={3}>
            <h5>Contact</h5>
            <p>Email: support@landylead.com</p>
            <p>Phone: (123) 456-7890</p>
            <Button variant="outline-light" href="/contact-us" className="mt-3">
              Get in Touch
            </Button>
          </Col>

          {/* Footer Column 4: Social Media */}
          <Col md={3}>
            <h5>Follow Us</h5>
            <div className="d-flex">
              <Button variant="link" className="text-white me-3" href="https://facebook.com" target="_blank">
                <i className="bi bi-facebook" style={{ fontSize: '30px' }}></i>
              </Button>
              <Button variant="link" className="text-white me-3" href="https://twitter.com" target="_blank">
                <i className="bi bi-twitter" style={{ fontSize: '30px' }}></i>
              </Button>
              <Button variant="link" className="text-white me-3" href="https://instagram.com" target="_blank">
                <i className="bi bi-instagram" style={{ fontSize: '30px' }}></i>
              </Button>
              <Button variant="link" className="text-white" href="https://linkedin.com" target="_blank">
                <i className="bi bi-linkedin" style={{ fontSize: '30px' }}></i>
              </Button>
            </div>
          </Col>
        </Row>

        {/* Footer Bottom: Copyright */}
        <Row className="mt-4">
          <Col className="text-center">
            <p style={{ fontSize: '14px' }}>
              &copy; {new Date().getFullYear()} LandyLead. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
