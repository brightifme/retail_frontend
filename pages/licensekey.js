import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const EnterLicenseKeyForm = () => {
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setLicenseKey(e.target.value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (licenseKey.trim().length !== 25) {
      setError('Invalid License Key. Please enter a valid 25-character key.');
      return;
    }
    console.log('License Key Submitted:', licenseKey);
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-dark text-white text-center">
              <h4>Enter License Key</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="licenseKey">
                  <Form.Label>License Key</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      name="licenseKey"
                      placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                      value={licenseKey}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                  {error && <div className="text-danger mt-2">{error}</div>}
                </Form.Group>
                <div className="d-grid">
                  <Button variant="primary" type="submit">
                    <i className="bi bi-key-fill me-2"></i> Activate License
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EnterLicenseKeyForm;
