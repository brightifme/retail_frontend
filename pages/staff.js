import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Container, Row, Col, Modal} from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import NavigationBar from './navigation';
import Footer from './footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [editing, setEditing] = useState(false);
  const [staffId, setStaffId] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const retailBusinessId = decodedToken.retailBusinessId;
      fetch(`${API_URL}/retail-business/${retailBusinessId}/staff`)
        .then(response => response.json())
        .then(data => setStaff(data));
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const retailBusinessId = decodedToken.retailBusinessId;
      if (editing) {
        await fetch(`${API_URL}/retail-business/${retailBusinessId}/staff/${staffId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password, gender }),
        });
        setEditing(false);
      } else {
        await fetch(`${API_URL}/retail-business/${retailBusinessId}/staff`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password, gender }),
        });
      }
      fetch(`${API_URL}/retail-business/${retailBusinessId}/staff`)
        .then(response => response.json())
        .then(data => setStaff(data));
      setName('');
      setEmail('');
      setPassword('');
      setGender('');
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const retailBusinessId = decodedToken.retailBusinessId;
      await fetch(`${API_URL}/retail-business/${retailBusinessId}/staff/${staffToDelete.id}`, {
        method: 'DELETE',
      });
      fetch(`${API_URL}/retail-business/${retailBusinessId}/staff`)
        .then(response => response.json())
        .then(data => setStaff(data));
      setShowDeleteModal(false);
    }
  };

  const handleEdit = async (id) => {
    const staffMember = staff.find((staff) => staff.id === id);
    setName(staffMember.name);
    setEmail(staffMember.email);
    setPassword(staffMember.password);
    setGender(staffMember.gender);
    setStaffId(id);
    setEditing(true);
    setShowEditModal(true);
  };

  const handleDeleteModal = (staffMember) => {
    setStaffToDelete(staffMember);
    setShowDeleteModal(true);
  };


  return (
    <div>
      <NavigationBar />
      <Container>
        <Row>
          <Col>
            <h1>Staff Members</h1>
            <Table striped bordered hover>
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Gender</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((staffMember) => (
                  <tr key={staffMember.id}>
                    <td>{staffMember.name}</td>
                    <td>{staffMember.email}</td>
                    <td>{staffMember.password}</td>
                    <td>{staffMember.gender}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        className="me-2" 
                        onClick={() => handleEdit(staffMember.id)}
                      >
                        <i className="bi bi-pencil-square"></i> 
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        onClick={() => handleDeleteModal(staffMember)}
                      >
                        <i className="bi bi-trash"></i> 
                        </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
      <Col>
        <h1>Create Staff</h1>
        <Form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm">
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={name} onChange={(event) => setName(event.target.value)} />
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </Form.Group>
          <Form.Group controlId="gender">
            <Form.Label>Gender</Form.Label>
            <Form.Control type="text" value={gender} onChange={(event) => setGender(event.target.value)} />
          </Form.Group>
          <Button variant="success" type="submit" className="mt-2">
            <i className="bi bi-person-plus"></i> Create Staff
          </Button>
        </Form>
      </Col>
    </Row>
  </Container>

  <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
    <Modal.Header closeButton>
      <Modal.Title>Edit Staff</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={name} onChange={(event) => setName(event.target.value)} />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </Form.Group>
        <Form.Group controlId="gender">
          <Form.Label>Gender</Form.Label>
          <Form.Control type="text" value={gender} onChange={(event) => setGender(event.target.value)} />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
      <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
    </Modal.Footer>
  </Modal>

  <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
    <Modal.Header closeButton>
      <Modal.Title>Delete Staff</Modal.Title>
    </Modal.Header>
    <Modal.Body>Are you sure you want to delete {staffToDelete.name}?</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Close</Button>
      <Button variant="danger" onClick={handleDelete}>Delete</Button>
    </Modal.Footer>
  </Modal>
  <Footer/>
</div>

);
};

export default StaffPage;

