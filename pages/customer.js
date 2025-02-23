import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState({});
  const [newCustomer, setNewCustomer] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const retailBusinessId = decodedToken.retailBusinessId;
      axios.get(`${API_URL}/retail-business/${retailBusinessId}/customer`)
        .then(response => setCustomers(response.data))
        .catch(error => console.error(error));
    }
  }, []);

  const handleEdit = (customer) => {
    setCustomerToEdit(customer);
    setShowModal(true);
  };

  const handleDelete = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const retailBusinessId = decodedToken.retailBusinessId;
      axios.delete(`${API_URL}/retail-business/${retailBusinessId}/customer/${customerToDelete.id}`)
        .then(() => {
          setCustomers(customers.filter(customer => customer.id !== customerToDelete.id));
          setShowDeleteModal(false);
        })
        .catch(error => console.error(error));
    }
  };

  const handleUpdate = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const retailBusinessId = decodedToken.retailBusinessId;
      axios.put(`${API_URL}/retail-business/${retailBusinessId}/customer/${customerToEdit.id}`, customerToEdit)
        .then(() => {
          setCustomers(customers.map(customer => customer.id === customerToEdit.id ? customerToEdit : customer));
          setShowModal(false);
        })
        .catch(error => console.error(error));
    }
  };

  const handleCreate = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const retailBusinessId = decodedToken.retailBusinessId;
      axios.post(`${API_URL}/retail-business/${retailBusinessId}/customer`, newCustomer)
        .then(response => {
          setCustomers([...customers, response.data]);
          setShowCreateModal(false);
        })
        .catch(error => console.error(error));
    }
  };

  return (
    <div>
        <NavigationBar/>
    <Container fluid style={{ backgroundColor: '#007bff', minHeight: '100vh', padding: '20px' }}>
      <Row>
        <Col md={2} className="bg-light min-vh-100 p-3 border-end">
          <Sidebar />
        </Col>
        <Col md={10} className="p-4 bg-white rounded">
          <h2 className="mb-4 text-primary">Customers</h2>
          <Button variant="success" className="mb-3" onClick={() => setShowCreateModal(true)}>
            <i className="bi bi-person-plus-fill"></i> Add Customer
          </Button>
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id}>
                  <td>{customer.firstName}</td>
                  <td>{customer.lastName}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.address}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(customer)}>
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(customer)}>
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* Edit Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Edit Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                {['firstName', 'lastName', 'email', 'phone', 'address'].map(field => (
                  <Form.Group className="mb-3" key={field}>
                     <Form.Label className="text-capitalize">{field.replace(/([A-Z])/g, ' $1')}</Form.Label>
              <Form.Control type="text" value={customerToEdit[field] || ''} onChange={(e) => setCustomerToEdit({ ...customerToEdit, [field]: e.target.value })} />
            </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Create Customer Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {['firstName', 'lastName', 'email', 'phone', 'address'].map(field => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label className="text-capitalize">{field.replace(/([A-Z])/g, ' $1')}</Form.Label>
                <Form.Control type="text" value={newCustomer[field]} onChange={(e) => setNewCustomer({ ...newCustomer, [field]: e.target.value })} />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Close</Button>
          <Button variant="success" onClick={handleCreate}>Create Customer</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {customerToDelete.firstName} {customerToDelete.lastName}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Col>
  </Row>
</Container>
</div>

);
}

function Sidebar() {
return (
<nav className="sidebar">
<h4 className="text-center text-primary">Menu</h4>
<ul className="list-group">
<li className="list-group-item"><i className="bi bi-speedometer2 me-2"></i><a href="#">Dashboard</a></li>
<li className="list-group-item active"><i className="bi bi-people me-2"></i><a href="#">Customers</a></li>
<li className="list-group-item"><i className="bi bi-cart me-2"></i><a href="#">Orders</a></li>
<li className="list-group-item"><i className="bi bi-box-seam me-2"></i><a href="#">Products</a></li>
</ul>
</nav>
);
}

export default Customers;