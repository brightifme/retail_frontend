import React from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { useRouter } from 'next/router';

const LandingPage = () => {
  const router = useRouter();

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-white">
      <Row className="w-100 text-center">
        <Col md={6} className="d-flex flex-column justify-content-center align-items-center bg-primary text-white p-5 rounded">
          <Image src="/logo.png" alt="LandyLead Logo" className="mb-4" style={{ width: '200px', height: 'auto' }} />
          <h1 className="mb-4 display-3 fw-bold">Welcome to LandyLead</h1>
          <p className="lead fs-4">Choose your portal</p>
        </Col>
        <Col md={6} className="d-flex flex-column justify-content-center align-items-center">
          <Button 
            variant="outline-primary" 
            size="lg" 
            className="mb-4 w-75 py-3 fw-bold shadow-lg"
            onClick={() => router.push('/managementlogin')}
          >
            <i className="bi bi-briefcase-fill me-2"></i> Management
          </Button>
          <Button 
            variant="outline-secondary" 
            size="lg" 
            className="w-75 py-3 fw-bold shadow-lg"
            onClick={() => router.push('/stafflogin')}
          >
            <i className="bi bi-people-fill me-2"></i> Staff
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default LandingPage;
