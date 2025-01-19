"use client";
// StaffRegistration.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const StaffRegistration = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fingerprintTemplate, setFingerprintTemplate] = useState(null);

  const handleFingerprintCapture = async () => {
    try {
      if (window.SG) {
        const template = await window.SG.SGIFPCapture();
        console.log(template);
        setFingerprintTemplate(template);
      } else {
        console.error("Fingerprint reader not detected");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send request to backend API to register staff member
    const response = await axios.post('/api/register-staff', {
      name,
      email,
      password,
      fingerprintTemplate,
    });

    // Handle response
    console.log(response.data);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Staff Registration</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </Form.Group>
                <Button variant="secondary" className="me-2" onClick={handleFingerprintCapture}>
                  Capture Fingerprint
                </Button>
                <Button variant="primary" type="submit">
                  Register Staff Member
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StaffRegistration;
