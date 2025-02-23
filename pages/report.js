import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Dropdown, DropdownButton, ButtonGroup, Spinner } from 'react-bootstrap';
import NavigationBar from './navigation';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SalesReportPage = () => {
  const [data, setData] = useState([]);
  const [products, setProducts] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const retailBusinessId = JSON.parse(atob(token.split('.')[1])).retailBusinessId;
          const response = await fetch(`${API_URL}/retail-business/${retailBusinessId}/orders`);
          const data = await response.json();
          setData(data);
          setFilteredData(data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
          setLoading(false);
          const responseProducts = await fetch(`${API_URL}/retail-business/${retailBusinessId}/product`);
          const productsData = await responseProducts.json();
          const productsMap = {};
          productsData.forEach(product => {
            productsMap[product.id] = product;
          });
          setProducts(productsMap);
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilter = (filterOption) => {
    setFilter(filterOption);
    if (filterOption === 'all') {
      setFilteredData(data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
    } else if (filterOption === 'today') {
      const today = new Date();
      setFilteredData(data.filter((item) => new Date(item.createdAt).toDateString() === today.toDateString()));
    } else if (filterOption === 'thisWeek') {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      setFilteredData(data.filter((item) => new Date(item.createdAt) >= startOfWeek));
    } else if (filterOption === 'thisMonth') {
      const today = new Date();
      setFilteredData(data.filter((item) => new Date(item.createdAt).getMonth() === today.getMonth() && new Date(item.createdAt).getFullYear() === today.getFullYear()));
    }
  };

  const handleExportToPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Date', 'Time', 'Product', 'Price', 'Order Quantity', 'Total', 'Customer Name', 'Email', 'Phone', 'Address', 'Status']],
      body: filteredData.map((item) => [
        new Date(item.createdAt).toLocaleDateString(),
        new Date(item.createdAt).toLocaleTimeString(),
        products[item.productId] ? products[item.productId].name : 'N/A',
        `#${products[item.productId] ? parseFloat(products[item.productId].price).toFixed(2) : 'N/A'}`,
        item.orderQuantity,
        `#${parseFloat(item.total).toFixed(2)}`,
        item.fullName || 'N/A',
        item.email || 'N/A',
        item.phoneNumber || 'N/A',
        item.houseAddress || 'N/A',
        item.status || 'N/A',
      ]),
    });
    const totalSales = filteredData.reduce((acc, item) => acc + parseFloat(item.total), 0).toFixed(2);
    const totalOrders = filteredData.length;
    doc.text(`Total Sales: #${totalSales}`, 10, doc.autoTable.previous.finalY + 10);
    doc.text(`Total Orders: ${totalOrders}`, 10, doc.autoTable.previous.finalY + 20);
    doc.save('sales-report.pdf');
  };
 
  const handleStatusUpdate = async (orderId, newStatus) => {
    console.log(`Updating order ${orderId} to ${newStatus}`);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const retailBusinessId = decodedToken?.retailBusinessId;
      if (!retailBusinessId) {
        console.error("Retail business ID not found in token");
        return;
      }
      const url = `${API_URL}/retail-business/${retailBusinessId}/orders/${orderId}`;
      console.log(`URL: ${url}`);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      console.log(`Response: ${response.status} ${response.statusText}`);
      if (!response.ok) {
        console.error(`Error updating order: ${response.statusText}`);
        return;
      }
      const data = await response.json();
      console.log(`Updated data: ${JSON.stringify(data)}`);
      // Update local state
      setData((prevData) => prevData.map((item) => item.id === orderId ? { ...item, status: newStatus } : item));
      setFilteredData((prevData) => prevData.map((item) => item.id === orderId ? { ...item, status: newStatus } : item));
      // Refetch data from API to ensure local state is up-to-date
      const responseOrders = await fetch(`${API_URL}/retail-business/${retailBusinessId}/orders`);
      const ordersData = await responseOrders.json();
      setData(ordersData);
      setFilteredData(ordersData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
    } catch (error) {
      console.error(`Error updating order: ${error.message}`);
    }
  };
  return (
    <div>
  {loading ? (
    <div className="text-center my-3">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  ) : error ? (
    <p className="text-danger">Error: {error}</p>
  ) : (
    <div>
          <NavigationBar />
          <Container className="mt-5">
            <Row>
              <Col md={12}>
                <Card className="shadow-lg border-0 rounded-3">
                  <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white p-3">
                    <h5 className="m-0">Sales Report</h5>
                    <ButtonGroup>
                      <DropdownButton id="filter-dropdown" variant="light" title={`Filter: ${filter}`} onSelect={handleFilter}>
                        <Dropdown.Item eventKey="all">All</Dropdown.Item>
                        <Dropdown.Item eventKey="today">Today</Dropdown.Item>
                        <Dropdown.Item eventKey="thisWeek">This Week</Dropdown.Item>
                        <Dropdown.Item eventKey="thisMonth">This Month</Dropdown.Item>
                      </DropdownButton>
                      <Button variant="light" onClick={handleExportToPdf} className="ms-2">
                        Export to PDF
                      </Button>
                    </ButtonGroup>
                  </Card.Header>
                  <Card.Body>
                    <Table striped bordered hover responsive className="table-sm">
                      <thead className="table-dark">
                        <tr>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Order Quantity</th>
                          <th>Total</th>
                          <th>Customer Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Address</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
  {filteredData.map((item, index) => (
    <tr key={index}>
      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
      <td>{new Date(item.createdAt).toLocaleTimeString()}</td>
      <td>{products[item.productId] ? products[item.productId].name : 'N/A'}</td>
      <td>#{products[item.productId] ? parseFloat(products[item.productId].price).toFixed(2) : 'N/A'}</td>
      <td>{item.orderQuantity}</td>
      <td>#{parseFloat(item.total).toFixed(2)}</td>
      <td>{item.fullName || 'N/A'}</td>
      <td>{item.email || 'N/A'}</td>
      <td>{item.phoneNumber || 'N/A'}</td>
      <td>{item.houseAddress || 'N/A'}</td>
      <td>
        {item.status}
        <Dropdown className="ms-2">
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Update Status
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleStatusUpdate(item.id, 'pending')}>Pending</Dropdown.Item>
            <Dropdown.Item onClick={() => handleStatusUpdate(item.id, 'success')}>Success</Dropdown.Item>
            <Dropdown.Item onClick={() => handleStatusUpdate(item.id, 'cancelled')}>Cancelled</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  ))}
</tbody>
                      <tfoot className="table-dark">
                        <tr>
                          <th colSpan={5}>Total:</th>
                          <th>#{filteredData.reduce((acc, item) => acc + parseFloat(item.total), 0).toFixed(2)}</th>
                          <th colSpan={6}>Total Orders: {filteredData.length}</th>
                        </tr>
                      </tfoot>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </div>
  );
};

export default SalesReportPage;
