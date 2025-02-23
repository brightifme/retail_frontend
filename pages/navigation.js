import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const NavigationBar = () => {
  const [token, setToken] = useState(null);
  const [staffId, setStaffId] = useState(null);
  const [retailBusinessId, setRetailBusinessId] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
      setToken(storedToken);
      setStaffId(decodedToken.staffId);
      setRetailBusinessId(decodedToken.retailBusinessId);
    }
  }, []);

  return (
    <Navbar expand="lg" style={{ backgroundColor: "#0056b3" }} variant="dark" className="shadow-sm py-3">
      <Container>
        <Navbar.Brand href="/" className="fw-bold text-uppercase d-flex align-items-center">
          <img src="/logo.png" alt="RetailSoft Logo" height="40" className="me-2" />
          LandyLead
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {staffId && retailBusinessId ? (
              <>
                <Nav.Link href="/products" className="fw-semibold">
                  <i className="bi bi-tags me-2"></i>Products
                </Nav.Link>
              

                <Nav.Link href="/customer" className="fw-semibold">
                  <i className="bi bi-people me-2"></i>Customers
                </Nav.Link>
                <Nav.Link href="#settings" className="fw-semibold">
                  <i className="bi bi-gear me-2"></i>Settings
                </Nav.Link>
              </>
            ) : (
              retailBusinessId && (
                <>
                  <Nav.Link href="/report" className="fw-semibold">
                    <i className="bi bi-file-text me-2"></i>Sales Report
                  </Nav.Link>
                  <Nav.Link href="/inventory" className="fw-semibold">
                    <i className="bi bi-box-seam me-2"></i>Inventory
                  </Nav.Link>
                  <Nav.Link href="/products" className="fw-semibold">
                    <i className="bi bi-tags me-2"></i>Products
                  </Nav.Link>
               
                  <Nav.Link href="/customer" className="fw-semibold">
                    <i className="bi bi-people me-2"></i>Customers
                  </Nav.Link>
                  <Nav.Link href="/staff" className="fw-semibold">
                    <i className="bi-people-fill me-2"></i>Staffs
                  </Nav.Link>
                  <Nav.Link href="#settings" className="fw-semibold">
                    <i className="bi bi-gear me-2"></i>Settings
                  </Nav.Link>
                </>
              )
            )}
            <Button style={{ backgroundColor: "#004494", borderColor: "#004494" }} className="ms-3">
              <i className="bi bi-box-arrow-right me-2"></i>Log Out
            </Button>
          </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  };

  export default NavigationBar;