import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Image, Modal, InputGroup, FormControl, Alert, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// Make sure to import the bootstrap-icons CSS
import NavigationBar from './navigation';
import Footer from './footer';
import jsPDF from 'jspdf';


const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Sample product data
function ProductPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [houseAddress, setHouseAddress] = useState("");
const [phoneNumber, setPhoneNumber] = useState("");
const [status, setStatus] = useState("pending");
const [orderCart, setOrderCart] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const retailBusinessId = JSON.parse(atob(token.split('.')[1])).retailBusinessId;
      fetch(`${API_URL}/retail-business/${retailBusinessId}/product`)
        .then(response => response.json())
        .then(data => {
          setProducts(data); // Update products first
          checkLowQuantityAlert(data); // Pass the newly fetched data
        })
        .catch(error => console.error(error));
    }
  }, []); // Run only once when the component mounts
  

  const handleAddToCart = (product, quantity) => {
    // Check if product quantity is available
    if (product.quantity < quantity) {
      setAlertMessage(`Insufficient quantity for ${product.name}. Available quantity: ${product.quantity}`);
      setShowAlert(true);
      return;
    }
    // Subtract quantity from inventory
    const updatedProduct = {
      ...product,
      quantity: product.quantity - quantity
    };
    const token = localStorage.getItem('token');
    if (token) {
      const retailBusinessId = JSON.parse(atob(token.split('.')[1])).retailBusinessId;
      fetch(`${API_URL}/retail-business/${retailBusinessId}/product/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
      })
        .then(response => response.json())
        .then(data => {
          // Update inventory state
          const updatedInventory = products.map(p => p.id === product.id ? updatedProduct : p);
          setProducts(updatedInventory);
        })
        .catch(error => console.error(error));
    }
    // Add item to cart
    setCart((prevCart) => {
      const newQuantity = (prevCart[product.id]?.quantity || 0) + quantity;
      return { ...prevCart, [product.id]: { ...product, quantity: newQuantity } };
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[productId];
      return newCart;
    });
  };

  const handleQuantityChange = (productId, change) => {
    setCart((prevCart) => {
      if (!prevCart[productId]) return prevCart;
      const newQuantity = prevCart[productId].quantity + change;
      if (newQuantity <= 0) {
        const newCart = { ...prevCart };
        delete newCart[productId];
        return newCart;
      }
      return { ...prevCart, [productId]: { ...prevCart[productId], quantity: newQuantity } };
    });
  };

  const totalPrice = Object.values(cart)
    .reduce((total, product) => total + product.price * product.quantity, 0)
    .toFixed(2);

  // Filter products based on search query
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleBuyNow = () => {
    const cartItems = Object.values(cart).map((product) => ({ productId: product.id, orderQuantity: product.quantity, }));
    const orderData = {
      cartItems,
      customerInfo: {
        fullName,
        email,
        houseAddress,
        phoneNumber,
        status,
      },
    };
    const token = localStorage.getItem('token');
    if (token) {
      const retailBusinessId = JSON.parse(atob(token.split('.')[1])).retailBusinessId;
      fetch(`${API_URL}/retail-business/${retailBusinessId}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setOrderCart({ ...cart }); // Store cart in orderCart state
          setShowModal(true);
          setCart({}); // Clear cart
        })
        .catch((error) => console.error(error));
    }
  };
  
  

  const handlePrintReceipt = () => {
    window.print();
  };

  const checkLowQuantityAlert = (productData) => {
    const lowQuantityProducts = productData.filter((product) => product.quantity === 5);
    if (lowQuantityProducts.length > 0) {
      const alertMessage = lowQuantityProducts
        .map((product) => `${product.name} is remaining 5`)
        .join(', ');
      
      setAlertMessage(alertMessage);
      setShowAlert(true);
    }
  };
  
  const handleGenerateInvoice = async () => {
    const doc = new jsPDF();
  
    // Invoice Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("INVOICE", 105, 20, { align: "center" });
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 30);
    doc.text(`Invoice No: INV-${Math.floor(Math.random() * 100000)}`, 150, 30);
  
    // Customer Details
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Billing Details:", 10, 40);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${fullName}`, 10, 50);
    doc.text(`Email: ${email}`, 10, 60);
    doc.text(`Address: ${houseAddress}`, 10, 70);
    doc.text(`Phone: ${phoneNumber}`, 10, 80);
  
    // Table Headers
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Product", 10, 100);
    doc.text("Qty", 120, 100);
    doc.text("Price", 150, 100);
    doc.text("Total", 180, 100);
  
    let y = 110;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    Object.values(orderCart).forEach((product) => {
      doc.text(product.name, 10, y);
      doc.text(`${product.quantity}`, 120, y);
      doc.text(`#${parseFloat(product.price).toFixed(2)}`, 150, y);
      doc.text(`#${parseFloat(product.price * product.quantity).toFixed(2)}`, 180, y);
      y += 10;
    });
  
    // Total Amount
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount:", 120, y + 10);
    doc.text(`#${Object.values(orderCart).reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2)}`, 180, y + 10);
  
    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for your purchase!", 105, y + 30, { align: "center" });
  
    doc.save("invoice.pdf");
  };
  
  
  
  
  


  return (
    <div>
      <NavigationBar />
      {showAlert && (
  <Container fluid className="mt-3">
    <Alert 
      variant="warning" 
      dismissible 
      onClose={() => setShowAlert(false)} // Hides the alert when closed
    >
      <strong>Warning!</strong> {alertMessage}
    </Alert>
  </Container>
)}


    
  <Container fluid className="p-4 bg-light">
    <Row className="mb-4">
      {/* Search Bar */}
      <Col xs={12} className="d-flex justify-content-center">
        <InputGroup className="w-50">
          <InputGroup.Text>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <FormControl placeholder="Search products by name..." aria-label="Search products" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="shadow-sm rounded" />
        </InputGroup>
      </Col>
    </Row>
    <Row>
      <Col xs={12} md={2} style={{ backgroundColor: "#0056b3" }} className="text-white p-4 sidebar d-none d-md-block">
      <ul className="nav flex-column">
  {[{ name: "Home", icon: "bi-house-door", link: "/" }, 
  { name: "Staffs", icon: "bi-people-fill", link: "#/staff" }, 
  { name: "Customers", icon: "bi-people", link: "/customer" }, 
  { name: "Inventory", icon: "bi-box-seam", link: "#/inventory" }, 
  { name: "Sales Report", icon: "bi bi-file-text", link: "#/sales-report" }, 
  { name: "Settings", icon: "bi-gear", link: "/settings" }].map((item, index) => (
    <li key={index} className="nav-item mb-4">
      <a className="nav-link d-flex align-items-center sidebar-link" 
         href={item.link} 
         style={{ color: "rgba(255, 255, 255, 0.7)", 
                  transition: "transform 0.2s ease-in-out, color 0.2s" }} 
         onMouseEnter={(e) => { 
           e.target.style.transform = "scale(1.1)"; 
           e.target.style.color = "white"; 
         }} 
         onMouseLeave={(e) => { 
           e.target.style.transform = "scale(1)"; 
           e.target.style.color = "rgba(255, 255, 255, 0.7)"; 
         }} 
      >
        <i className={`bi ${item.icon} me-2`} 
           style={{ fontSize: "24px", opacity: 0.7, transition: "opacity 0.2s" }}></i>
        {item.name}
      </a>
    </li>
  ))}
</ul>

      </Col>
      {/* Main Content */}
      <Col xs={12} md={10}>
        <Row>
          {/* Products Grid */}
          <Col xs={12} md={8}>
            <Row className="g-4">
              {filteredProducts.map((product) => (
                <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <Card className="shadow-lg border-0 rounded product-card hover-effect">
                    <Card.Img variant="top" src={product.imageUrl} className="product-img" />
                    <Card.Body>
                      <Card.Title className="fw-bold text-uppercase">{product.name}</Card.Title>
                      <Card.Text className="text-muted">
                        Price: <strong>#{(+product.price).toFixed(2)}</strong>
                      </Card.Text>
                      <Card.Text className="text-muted">
                        Quantity: {product.quantity}
                      </Card.Text>
                      {/* Quantity Selector */}
                      <InputGroup className="mb-3">
                        <Button variant="outline-secondary" onClick={() => handleAddToCart(product, -1)} disabled={!cart[product.id] || cart[product.id].quantity <= 0}>
                          ➖
                        </Button>
                        <FormControl type="text" value={cart[product.id]?.quantity || 0} readOnly className="text-center" />
                        <Button variant="outline-secondary" onClick={() => handleAddToCart(product, 1)} disabled={product.quantity <= 0}>
                          ➕
                        </Button>
                      </InputGroup>
                      <Button variant="primary" className="w-100" onClick={() => handleAddToCart(product, 1)} disabled={product.quantity <= 0}>
                        <i className="bi bi-cart-plus"></i> Add to Cart
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
          {/* Cart Section */}
          <Col xs={12} md={4}>
            <Card className="shadow-lg p-4 cart-section rounded" style={{ backgroundColor: '#f9f9f9' }}>
              <h4 className="fw-bold mb-3">🛒 Your Cart</h4>
              {Object.keys(cart).length === 0 ? (
            <p className="text-muted">Your cart is empty.</p>
          ) : (
            Object.values(cart).map((product) => (
              <Row key={product.id} className="align-items-center cart-item mb-3 p-3 rounded" style={{ backgroundColor: '#fff', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <Col xs={4}>
                  <Image src={product.imageUrl} rounded fluid className="cart-img" />
                </Col>
                <Col xs={6}>
                  <h6 className="mb-0">{product.name}</h6>
                  <p className="text-muted small">#{parseFloat(product.price).toFixed(2)} x {product.quantity}</p>
                </Col>
                <Col xs={2} className="text-end">
                  {/* Replace the button with an X icon */}
                  <i className="bi bi-x-circle text-danger fs-3 cursor-pointer" onClick={() => handleRemoveFromCart(product.id)} style={{ transition: 'color 0.2s ease-in-out' }}
                    onMouseEnter={(e) => (e.target.style.color = 'darkred')}
                    onMouseLeave={(e) => (e.target.style.color = 'red')}
                  ></i>
                </Col>
              </Row>
            ))
          )}
          {/* Total Price Section */}
          {Object.keys(cart).length > 0 && (
        <div className="total-price-container mb-4 p-3 rounded" style={{ backgroundColor: '#f0f8ff', border: '1px solid #ddd' }}>
        <h5 className="fw-bold total-price text-center">Total: <span className="price-amount">#{totalPrice}</span></h5>
        <Form>
        <Form.Group className="mb-3" controlId="formFullName">
        <Form.Label>Full Name</Form.Label>
        <Form.Control type="text" placeholder="Enter full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formHouseAddress">
        <Form.Label>House Address</Form.Label>
        <Form.Control type="text" placeholder="Enter house address" value={houseAddress} onChange={(e) => setHouseAddress(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPhoneNumber">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control type="text" placeholder="Enter phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formStatus">
        <Form.Label>Status</Form.Label>
        <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="pending">Pending</option>
        <option value="success">Success</option>
        <option value="cancelled">Cancelled</option>
        </Form.Select>
        </Form.Group>
        </Form>
        <Button variant="success" className="w-100 mt-3 hover-effect" onClick={handleBuyNow}>
        <i className="bi bi-credit-card"></i> Buy Now
        </Button>
        </div>
          )}
        </Card>
      </Col>
    </Row>
  </Col>
</Row>

</Container>
{/* Order Confirmation Modal */}
<Modal show={showModal} onHide={() => setShowModal(false)} centered>
<Modal.Header closeButton>
<Modal.Title>Order Successful <i className="bi bi-check-circle" style={{ color: 'green' }}></i></Modal.Title>
</Modal.Header>
<Modal.Body>
<p>Your order has been successfully placed. A confirmation email will be sent shortly.</p>
</Modal.Body>
<Modal.Footer>
<Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
<Button variant="primary" onClick={handlePrintReceipt}>
<i className="bi bi-printer"></i> Print Receipt
</Button>
<Button variant="info" onClick={() => alert('Shipping details coming soon!')}>
<i className="bi bi-truck"></i> Track Order
</Button>
<Button variant="success" onClick={handleGenerateInvoice}> 
    <i className="bi bi-file-earmark-pdf"></i> Generate Invoice 
  </Button>
</Modal.Footer>
</Modal>
<Footer/>
</div>
);
};

export default ProductPage;
