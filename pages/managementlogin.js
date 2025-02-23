import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/router';


const API_URL = process.env.NEXT_PUBLIC_API_URL;

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorMessage;
        } catch (jsonError) {
          console.error('Error parsing backend error JSON:', jsonError);
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        setError(errorMessage); // Display error message to user
        setLoading(false);
        return;
      }
  
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        router.push('/products'); // Redirect to products page
      } else {
        setError('Invalid email or password'); // Display error message to user
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unknown error occurred'); // Display error message to user
      setLoading(false);
    }
  };
  

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100">
        {/* Left column with logo */}
        <Col md={6} className="d-flex flex-column justify-content-center align-items-center left-column" style={{ backgroundColor: '#f0f0f0', padding: '20px' }} >
          <img src="/logo2.png" alt="Company Logo" className="img-fluid" style={{ width: '300px', height: 'auto' }} />
          <span className="logo-text" style={{ fontSize: '72px', fontWeight: 'bolder', fontFamily: 'Roboto, sans-serif', color: '#0056b3', letterSpacing: '1px', marginTop: '20px' }} >
            LandyLead
          </span>
        </Col>
        {/* Right column with sign-in form */}
        <Col md={6} className="d-flex justify-content-center align-items-center right-column">
          <div className="form-container">
            <h3 className="text-center mb-4 title">Sign In as Management</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail" className="mb-4">
                <Form.Label className="label">Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" className="input-field" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mb-4">
                <Form.Label className="label">Password</Form.Label>
                <Form.Control type="password" placeholder="Password" className="input-field" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 btn-login d-flex justify-content-center align-items-center" disabled={loading} >
                {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <i className="bi bi-box-arrow-in-right me-2"></i>}
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LandingPage;