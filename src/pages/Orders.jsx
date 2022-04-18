import React, { useState, useEffect } from "react";
import Announcement from "../components/Announcement";
import Navbar from "../components/Navbar";
import { Card, Container, Row, ProgressBar } from "react-bootstrap";
import axios from "../axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useNavigate } from "react-router-dom";
import Product from "../components/Product";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Orders() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [product, setProduct] = useState([]);
  const [showdetails, setShowdetails] = useState(false);
  const id = localStorage.getItem("u_id");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/order/order-history/${id}`)
      .then((resp) => {
        setProduct(resp?.data?.order);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const cancelProduct = (proId, orderId) => {
    const payload = { id, orderId, proId };
    axios
      .put("/order/cancel-product", payload)
      .then((resp) => {
        setProduct(resp?.data?.order);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Navbar />
      <Announcement />
      <Container style={{ margin: "1rem" }}>
        <Row xs={4}>
          {product.map((product, index) => (
            <Card style={{ width: "18rem", margin: "1rem" }} key={index}>
              <Card.Img variant="top" src={product.products.image} />
              <Card.Body>
                <Card.Title>{product.products.product}</Card.Title>
                <Card.Subtitle tag="h6" className="mb-2 ">
                  PRICE : {product.products.price}
                </Card.Subtitle>
                <Card.Subtitle tag="h6" className="mb-2 text-muted">
                  TOTAL ITEM: {product.products.quantity}
                </Card.Subtitle>
                <Card.Subtitle tag="h6" className="mb-2 text-muted">
                  PAYMENT: {product.method}
                </Card.Subtitle>
                {product.products.status == "placed" && (
                  <ProgressBar style={{ marginBottom: "1rem" }}>
                    <ProgressBar
                      now={34}
                      animated
                      striped
                      variant="success"
                      label={`placed`}
                      key={1}
                    />
                  </ProgressBar>
                )}
                {product.products.status == "shipped" && (
                  <ProgressBar style={{ marginBottom: "1rem" }}>
                    <ProgressBar
                      now={34}
                      variant="success"
                      label={`placed`}
                      key={1}
                    />

                    <ProgressBar
                      now={33}
                      animated
                      striped
                      variant="info"
                      label={`shipped`}
                      key={2}
                    />
                  </ProgressBar>
                )}
                {product.products.status == "delivered" && (
                  <ProgressBar style={{ marginBottom: "1rem" }}>
                    <ProgressBar
                      now={34}
                      variant="success"
                      label={`placed`}
                      key={1}
                    />

                    <ProgressBar
                      now={33}
                      variant="info"
                      label={`shipped`}
                      key={2}
                    />
                    <ProgressBar
                      now={33}
                      animated
                      striped
                      variant="warning"
                      label={`delievered`}
                      key={3}
                    />
                  </ProgressBar>
                )}
                {product.products.status == "Cancelled" && (
                  <ProgressBar style={{ marginBottom: "1rem" }}>
                    <ProgressBar
                      now={100}
                      variant="danger"
                      label={`Cancelled`}
                      key={4}
                    />
                  </ProgressBar>
                )}

                {product.products.status !== "Cancelled" &&
                  product.products.status !== "delivered" && (
                    <Button
                      variant="contained"
                      color="error"
                      style={{ marginRight: "1px" }}
                      onClick={(e) =>
                        cancelProduct(product.products.id, product._id)
                      }
                    >
                      Cancel
                    </Button>
                  )}

                <Button variant="contained" onClick={handleClickOpen}>
                  Order History
                </Button>
                {open && (
                  <>
                    <Button
                      variant="outlined"
                      onClick={handleClickOpen}
                    ></Button>
                    <Dialog
                      open={open}
                      TransitionComponent={Transition}
                      keepMounted
                      onClose={handleClose}
                      aria-describedby="alert-dialog-slide-description"
                    >
                      <DialogTitle>Shipping Address</DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                          {product.address.fname} {product.address.lname}
                          {"    "}
                          {product.address.email},{product.address.phone},{" "}
                          {product.address.address},{product.address.district}
                          {product.address.state},{product.address.country},
                          {product.address.pincode}
                          {product.address.pincode}
                          {product.address.pincode}
                        </DialogContentText>
                        <br />
                        <h5>
                          Ordered :{new Date(product.createdAt).toDateString()}
                        </h5>
                        {product.products.status == "shipped" && (
                          <h5>
                            Shipped :
                            {new Date(product.products.shipped).toDateString()}
                          </h5>
                        )}
                        {product.products.status == "delivered" && (
                          <div>
                            <h5>
                              Shipped:
                              {new Date(
                                product.products.shipped
                              ).toDateString()}
                            </h5>

                            <h5>
                              Delivered:
                              {new Date(
                                product.products.delivered
                              ).toDateString()}
                            </h5>
                          </div>
                        )}
                        {product.products.status == "Cancelled" && (
                          <h5>Order is Cancelled</h5>
                        )}
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>x</Button>
                      </DialogActions>
                    </Dialog>
                  </>
                )}
              </Card.Body>
            </Card>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Orders;
