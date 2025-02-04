import React, { useState } from 'react';
import { Container, Row, Col, Card, Image, Button } from 'react-bootstrap';
import axios from 'axios';

const fingers = ['thumb', 'index', 'middle', 'ring', 'little'];

function FingerprintEnrolmentPage() {
  const [capturedFingers, setCapturedFingers] = useState({});
  const [staffDetails] = useState({
    name: 'Steve Tobias',
    email: 'stevetobias@gmail.com',
    department: 'Front End Developer',
    company: 'Carrotsuite',
  });

  const captureFingerprint = async (finger) => {
    try {
      const response = await axios.post('https://localhost:8443/SGIFPCapture');
      
      // Check if the response contains valid Base64 data
      if (response.data.BMPBase64) {
        setCapturedFingers((prev) => ({ ...prev, [finger]: response.data.BMPBase64 }));
        alert(`${finger} fingerprint captured successfully!`);
      } else {
        alert(`Error: No fingerprint data received for ${finger}.`);
      }
    } catch (error) {
      console.error(`Error capturing ${finger} fingerprint`, error);
    }
  };

  const submitFingerprints = async () => {
    if (Object.keys(capturedFingers).length < 5) {
      alert('Please capture all five fingerprints first.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/v1/staff', {
        ...staffDetails,
        thumbTemplateBase64: capturedFingers.thumb,
        indexTemplateBase64: capturedFingers.index,
        middleTemplateBase64: capturedFingers.middle,
        ringTemplateBase64: capturedFingers.ring,
        littleTemplateBase64: capturedFingers.little,
      });
      alert('Fingerprints submitted successfully!');
    } catch (error) {
      console.error('Error submitting fingerprints', error);
      alert('There was an error submitting the fingerprints. Please try again.');
    }
  };

  return (
    <Container fluid className='mt-5 p-5'>
      <Row className='justify-content-center'>
        <Col md={6} className='mb-5'>
          <Card style={{ width: '100%', height: '250px', marginBottom: '20px', border: '5px solid #007bff', borderRadius: '10px' }}>
            <Card.Body>
              <Image src='big-fingerprint-image.jpg' fluid style={{ height: '200px' }} />
            </Card.Body>
          </Card>
          <Row className='justify-content-center'>
            {fingers.map((finger) => (
              <Col md={3} className='mb-3' key={finger}>
                <Card
                  style={{
                    width: '100%',
                    height: '120px',
                    border: capturedFingers[finger] ? '5px solid #00ff00' : '5px solid #ff0000',
                    borderRadius: '10px',
                  }}
                >
                  <Card.Body>
                    <Image src={`${finger}-fingerprint-image.jpg`} fluid style={{ height: '80px' }} />
                    <Button onClick={() => captureFingerprint(finger)} size='sm' className='mt-2' disabled={capturedFingers[finger]}>
                      {capturedFingers[finger] ? '✔ Captured' : 'Capture'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col md={6}>
          <Card style={{ width: '100%', height: '250px', borderRadius: '10px', backgroundColor: '#f0f0f0' }}>
            <Card.Body>
              <Card.Title style={{ fontSize: '20px' }}>Staff Details</Card.Title>
              <Card.Text><strong>Name:</strong> {staffDetails.name}</Card.Text>
              <Card.Text><strong>Email:</strong> {staffDetails.email}</Card.Text>
              <Card.Text><strong>Department:</strong> {staffDetails.department}</Card.Text>
              <Card.Text><strong>Company:</strong> {staffDetails.company}</Card.Text>
              <Button onClick={submitFingerprints} className='mt-3' variant='primary'>Submit Fingerprints</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default FingerprintEnrolmentPage;
