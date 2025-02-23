import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Form,
  Modal,
  Alert,
  Card,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "./navigation";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 0,
    price: 0,
    image: null,
  });
  const [editItem, setEditItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const retailBusinessId = JSON.parse(
            atob(token.split(".")[1])
          ).retailBusinessId;
          const response = await fetch(
            `${API_URL}/retail-business/${retailBusinessId}/product`
          );
          const data = await response.json();
          console.log(data);
          setInventory(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e, type = "add") => {
    const { name, value } = e.target;
    if (type === "add") {
      if (name === "quantity" || name === "price") {
        setNewItem({ ...newItem, [name]: parseFloat(value) });
      } else {
        setNewItem({ ...newItem, [name]: value });
      }
    } else {
      if (name === "quantity" || name === "price") {
        setEditItem({
          ...editItem,
          id: editItem.id,
          [name]: parseFloat(value),
        });
      } else {
        setEditItem({
          ...editItem,
          id: editItem.id,
          [name]: value,
        });
      }
    }
  };

  const handleImageChange = (e) => {
    setNewItem({ ...newItem, image: e.target.files[0] });
  };

  const uploadImageToCloudinary = async (image) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "images");
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dk8ba5xkg/image/upload`,
      formData
    );
    return response.data.secure_url;
  };

  const handleAddItem = async () => {
    if (newItem.name && newItem.quantity > 0 && newItem.price > 0) {
      let imageUrl;
      if (newItem.image) {
        const uploadedImageUrl = await uploadImageToCloudinary(
          newItem.image
        );
        imageUrl = uploadedImageUrl;
      }
      const item = {
        name: newItem.name,
        price: newItem.price,
        quantity: newItem.quantity,
        imageUrl: imageUrl,
      };
      const token = localStorage.getItem("token");
      if (token) {
        const retailBusinessId = JSON.parse(
          atob(token.split(".")[1])
        ).retailBusinessId;
        fetch(`${API_URL}/retail-business/${retailBusinessId}/product`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        })
          .then((response) => response.json())
          .then((data) => {
            setInventory([...inventory, data]);
            setNewItem({
              name: "",
              quantity: 0,
              price: 0,
              image: null,
            });
            setError(null);
          })
          .catch((error) => console.error(error));
      }
    } else {
      setError("Please fill in all required fields with valid values.");
    }
  };

  const handleQuantityChange = (e, id) => {
    const updatedInventory = inventory.map((item) =>
      item.id === id
        ? { ...item, newQuantity: parseInt(e.target.value) }
        : item
    );
    setInventory(updatedInventory);
  };

  const handleUpdateQuantity = async (id) => {
    const token = localStorage.getItem("token");
    if (token) {
      const retailBusinessId = JSON.parse(
        atob(token.split(".")[1])
      ).retailBusinessId;
      const item = inventory.find((item) => item.id === id);
      const updatedQuantity = item.quantity + item.newQuantity;
      const response = await fetch(
        `${API_URL}/retail-business/${retailBusinessId}/product/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: updatedQuantity }),
        }
      );
      if (response.ok) {
        console.log("Quantity updated successfully");
        const updatedInventory = inventory.map((item) =>
          item.id === id
            ? { ...item, quantity: updatedQuantity, newQuantity: 0 }
            : item
        );
        setInventory(updatedInventory);
      } else {
        console.error("Error updating quantity");
      }
    }
  };

  // Edit item
  const handleEditItem = () => {
    console.log("handleEditItem called");
    console.log("editItem:", editItem);
    const updatedItem = {
      name: editItem.name,
      price: editItem.price,
      quantity: editItem.quantity,
    };
    const token = localStorage.getItem("token");
    if (token) {
      const retailBusinessId = JSON.parse(
        atob(token.split(".")[1])
      ).retailBusinessId;
      fetch(
        `${API_URL}/retail-business/${retailBusinessId}/product/${editItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedItem),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Item updated successfully:", data);
          const updatedInventory = inventory.map((item) =>
            item.id === editItem.id ? updatedItem : item
          );
          setInventory(updatedInventory);
          setShowEditModal(false);
          setEditItem(null);
        })
        .catch((error) => {
          console.error("Error updating item:", error);
        });
    }
  };

  // Handle delete item
  const handleDeleteItem = (id) => {
    setItemToDelete(id);
    setShowDeleteConfirmationModal(true);
  };

  const handleConfirmDelete = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const retailBusinessId = JSON.parse(
        atob(token.split(".")[1])
      ).retailBusinessId;
      fetch(
        `${API_URL}/retail-business/${retailBusinessId}/product/${itemToDelete}`,
        { method: "DELETE" }
      )
        .then(() => {
          const updatedInventory = inventory.filter(
            (item) => item.id !== itemToDelete
          );
          setInventory(updatedInventory);
          setShowDeleteConfirmationModal(false);
          setItemToDelete(null);
        })
        .catch((error) => console.error(error));
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmationModal(false);
    setItemToDelete(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <NavigationBar />
      <Container className="mt-5">
        <Row className="mb-4">
          <Col>
            <h1 className="text-center text-primary mb-4">
              Inventory Management
            </h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group controlId="formSearch">
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search for items"
            />
          </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={8}>
          <Table striped bordered hover responsive className="shadow-sm">
  <thead>
    <tr>
      <th>Item Name</th>
      <th>Quantity</th>
      <th>Price (#)</th>
      <th>Total Value (#)</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {filteredInventory.map((item) => (
      <tr key={item.id}>
        <td>{item.name}</td>
        <td className="d-flex align-items-center">
          <span className="me-3">{item.quantity}</span>
          <Form.Control
            type="number"
            value={item.newQuantity || 0}
            onChange={(e) => handleQuantityChange(e, item.id)}
            className="me-2"
            style={{ width: "80px" }}
          />
          <Button
            variant="success"
            onClick={() => handleUpdateQuantity(item.id)}
            size="sm"
          >
            Update
          </Button>
        </td>
        <td>{item.price}</td>
        <td>
          {(item.quantity * item.price).toFixed(2)}
        </td>
        <td>
          <Button
            variant="link"
            onClick={() => {
              setEditItem(item);
              setShowEditModal(true);
            }}
          >
            <i
              className="bi bi-pencil-square"
              style={{
                fontSize: "1.5rem",
                color: "#ffc107",
              }}
            ></i>
          </Button>{" "}
          <Button
            variant="link"
            onClick={() => handleDeleteItem(item.id)}
          >
            <i
              className="bi bi-trash"
              style={{
                fontSize: "1.5rem",
                color: "#dc3545",
              }}
            ></i>
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>

          </Col>
          <Col md={4}>
            <Card className="p-4 shadow-sm border-light rounded">
              <h3 className="mb-4 text-center text-secondary">
                Add New Item
              </h3>
              <Form>
                <Form.Group controlId="formItemName">
                  <Form.Label>Item Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newItem.name}
                    onChange={(e) => handleInputChange(e, "add")}
                    placeholder="Enter item name"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formQuantity">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={newItem.quantity}
                    onChange={(e) => handleInputChange(e, "add")}
                    placeholder="Enter quantity"
                    min="1"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPrice">
                  <Form.Label>Price (#)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={newItem.price}
                    onChange={(e) => handleInputChange(e, "add")}
                    placeholder="Enter price per item"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formItemImage">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => handleImageChange(e)}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  onClick={handleAddItem}
                  className="mt-3 w-100"
                  disabled={
                    !newItem.name || newItem.quantity <= 0 || newItem.price <= 0
                  }
                >
                  Add Item
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
        {/* Edit Item Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formEditItemName">
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editItem?.name || ""}
                  onChange={(e) => handleInputChange(e, "edit")}
                  placeholder="Enter item name"
                />
              </Form.Group>
              <Form.Group controlId="formEditQuantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={editItem?.quantity || 0}
                  onChange={(e) => handleInputChange(e, "edit")}
                  placeholder="Enter quantity"
                />
              </Form.Group>
              <Form.Group controlId="formEditPrice">
                <Form.Label>Price (#)</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={editItem?.price || 0}
                  onChange={(e) => handleInputChange(e, "edit")}
                  placeholder="Enter price per item"
                />
              </Form.Group>
              <Button
                variant="success"
                onClick={handleEditItem}
                className="mt-3 w-100"
              >
                Save Changes
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
        {/* Delete Confirmation Modal */}
        <Modal
          show={showDeleteConfirmationModal}
          onHide={handleCancelDelete}
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this item?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default InventoryPage;