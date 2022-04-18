import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Announcement from "../components/Announcement";
import Navbar from "../components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "../axios";
import { clearProduct } from "../redux/cartRedux";
import { useDispatch } from "react-redux";
import PayPal from "../components/PayPal";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const Razorpay = process.env.Razorpay||'rzp_test_xGoZm3Y8xS6pzi';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    document.body.appendChild(script);
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};
const __DEV__ = document.domain === "localhost";

function CheckoutPage() {
  const total = localStorage.getItem("amount");
  const theme = useTheme();

  const [open, setOpen] = useState(false);

  const [userAddresses, setUserAddresses] = useState([]);
  const [showSave, setShowsave] = useState(true);
  const [saveAddress, setSaveAddress] = useState(false);
  const [method, setMethod] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");
  const [discount, setDiscount] = useState();
  const dispatch = useDispatch();
  const [couponOffer, setCouponoffer] = useState(false);
  const [amount, setAmount] = useState(total);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  // const [paid, setPaid] = React.useState(false);

  const [paypalShow, setPaypalShow] = useState(false);

  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const templateObj = {
    _id: "",
    fname: "",
    lname: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    state: "",
    country: "",
    pincode: "",
  };

  const [currentAddresses, setCurrentAddresses] = useState(templateObj);
  const userId = localStorage.getItem("u_id");
  const cartId = localStorage.getItem("cartId");
  const updateAddress = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setCurrentAddresses({ ...currentAddresses, [name]: value });
  };

  const selectAddress = (id) => {
    const address = userAddresses.find((i) => i._id == id);
    setCurrentAddresses({ ...address });
    setShowsave(false);
  };

  const clearSelect = () => {
    setCurrentAddresses({ ...templateObj });
    setShowsave(true);
  };

  const selectMethod = (meth) => {
    setMethod(meth);
  };

  const applyCoupon = () => {
    const payload = { userId, couponCode };
    axios
      .post("/order/apply-coupon", payload)
      .then((resp) => {
        if (total >= resp?.data?.checkCoupon?.minPurchase) {
          let discAmount = total * resp?.data?.checkCoupon?.discount * 0.01;
          let discountAmount = Math.round(discAmount);

          if (discountAmount >= resp?.data?.checkCoupon?.maxAmount) {
            const newPrice = total - resp?.data?.checkCoupon?.maxAmount;
            setDiscount(resp?.data?.checkCoupon?.maxAmount);
            setCouponoffer(true);
            setAmount(newPrice);
          } else {
            const newPrice = total - discountAmount;
            setDiscount(discountAmount);
            setCouponoffer(true);
            setAmount(newPrice);
          }
        } else {
          setError("This Coupon is not valid for this purchase");
        }

        setCouponCode("");
      })
      .catch((error) => {
        setError(error.response?.data.errorMessage);
        setCouponCode("");
      });
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    const payload = {
      userId,
      cartId,
      currentAddresses,
      showSave,
      method,
      amount,
    };
    dispatch(clearProduct());
    axios
      .post("/order/create", payload)
      .then((resp) => {
        if (resp.data.codSuccess) {
          localStorage.removeItem("amount");
          dispatch(clearProduct());

          navigate("/success");
        } else if (resp.data.paypalSuccess) {
          displayPaypal();
        } else {
          displayRazorpay(resp);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`/order/getaddress/${userId}`)
      .then((resp) => {
        setUserAddresses(resp?.data?.address);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [navigate]);

  const displayPaypal = () => {
    handleClickOpen();
    setPaypalShow(true);
  };

  async function displayRazorpay(order) {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      alert(
        "Razorpay SDK is failed to load.Please check your internet connection"
      );
      return;
    }

    const options = {
      key: Razorpay,
      amount: order.data?.amount,
      currency: "INR",
      order_id: order.data?.id,
      name: "ZAIN.",
      description: "Thank you for shopping...",

      handler: function (response) {
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);

        const data = { response, order };
        axios
          .post("/order/verifypayment", data)
          .then((resp) => {
            localStorage.removeItem("amount");
            navigate("/success");
          })
          .catch((err) => {
            console.log(err);
          });
      },
      prefill: {
        name: "",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <>
      <Navbar />
      <Announcement />

      <>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{"ZAIN."}</DialogTitle>
          <DialogContent>
            <PayPal fullScreen amount={amount} />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              x
            </Button>
            <Button onClick={handleClose} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </>

      <div className="maincontainer">
        <div className="container">
          <div className="py-5 text-center">
            <h2>Checkout form</h2>
          </div>
          <div className="row">
            <div className="col-md-4 order-md-2 mb-4 mt-5">
              <h4 className="d-flex justify-content-between align-items-center mb-3">
                Apply Coupon
              </h4>
              <div className="d-block my-3">
                <div className="card mt-2 mb-2">
                  <div className="card-body">
                    <div>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter Coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <button
                        type="button"
                        class="btn  rounded mt-2"
                        style={{ backgroundColor: " teal", color: "white" }}
                        onClick={() => applyCoupon}
                      >
                        Apply
                      </button>
                      {error && (
                        <p style={{ marginTop: "10px", color: "red" }}>
                          {error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="card mt-2 mb-2">
                  <div className="card-body">
                    <h5 className="d-flex justify-content-between align-items-center mb-3">
                      Your Order
                    </h5>
                    <p className="d-flex justify-content-between ">
                      Subtotal <span>₹{total}</span>
                    </p>
                    <p className="d-flex justify-content-between ">
                      Discount{" "}
                      <span>{couponOffer ? "₹" + discount : "₹0"}</span>
                    </p>
                    <p className="d-flex justify-content-between ">
                      TOTAL <span>₹{amount}</span>
                    </p>
                  </div>
                </div>

                <h4 className="mb-3">Payment</h4>
                <div className="custom-control custom-radio">
                  <input
                    id="credit"
                    name="paymentMethod"
                    type="radio"
                    className="custom-control-input"
                    required
                    onClick={() => {
                      selectMethod("COD");
                    }}
                  />
                  <label className="custom-control-label" htmlFor="credit">
                    Cash on Delivery
                  </label>
                </div>
                <div className="custom-control custom-radio">
                  <input
                    id="debit"
                    name="paymentMethod"
                    type="radio"
                    className="custom-control-input"
                    required
                    onClick={() => {
                      selectMethod("RazorPay");
                    }}
                  />
                  <label className="custom-control-label" htmlFor="debit">
                    RazorPay
                  </label>
                </div>
                <div className="custom-control custom-radio">
                  <input
                    id="paypal"
                    name="paymentMethod"
                    type="radio"
                    className="custom-control-input"
                    required
                    onClick={() => {
                      selectMethod("Paypal");
                    }}
                  />
                  <label className="custom-control-label" htmlFor="paypal">
                    Paypal
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-8 order-md-1">
              <h4 className="mb-3">Shipping address</h4>
              <div>
                {userAddresses.length > 0 &&
                  userAddresses.map((adr) => {
                    return (
                      <div className="card mt-2">
                        <div className="card-body">
                          <h5 className="card-subtitle mb-2 text-muted">
                            {adr.fname}
                          </h5>
                          <p>{adr.address}</p>
                          <p className="card-text"> {adr.phone}</p>
                          <input
                            type="radio"
                            name="address"
                            id=""
                            onClick={() => {
                              selectAddress(adr._id);
                            }}
                          />{" "}
                          Use this Address
                        </div>
                      </div>
                    );
                  })}
                {!showSave && (
                  <button
                    className="btn  btn-sm btn-block mt-1"
                    type="button"
                    style={{ backgroundColor: " teal", color: "white" }}
                    onClick={() => {
                      clearSelect();
                    }}
                  >
                    No select
                  </button>
                )}
              </div>

              <hr className="my-4" />
              <h5>OR</h5>
              <h4 className="mb-3">Add New Address</h4>
              <form className="needs-validation" onSubmit={handleCheckout}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName">First name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="fname"
                      placeholder=""
                      value={currentAddresses.fname}
                      required
                      onChange={(e) => {
                        updateAddress(e);
                      }}
                    />
                    <div className="invalid-feedback">
                      Valid first name is required.
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName">Last name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      placeholder=""
                      name="lname"
                      value={currentAddresses.lname}
                      required
                      onChange={(e) => {
                        updateAddress(e);
                      }}
                    />
                    <div className="invalid-feedback">
                      Valid last name is required.
                    </div>
                  </div>
                </div>{" "}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={currentAddresses.email}
                      required
                      onChange={(e) => {
                        updateAddress(e);
                      }}
                    />
                    <div className="invalid-feedback">
                      Please enter a valid email address htmlFor shipping
                      updates.
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="phone">phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      placeholder=""
                      name="phone"
                      value={currentAddresses.phone}
                      required
                      onChange={(e) => {
                        updateAddress(e);
                      }}
                    />
                    <div className="invalid-feedback">
                      Valid last name is required.
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={currentAddresses.address}
                    required
                    onChange={(e) => {
                      updateAddress(e);
                    }}
                  />
                  <div className="invalid-feedback">
                    Please enter your shipping address.
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="city">District</label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      placeholder=""
                      name="district"
                      value={currentAddresses.district}
                      required
                      onChange={(e) => {
                        updateAddress(e);
                      }}
                    />
                    <div className="invalid-feedback"></div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      name="state"
                      value={currentAddresses.state}
                      required
                      onChange={(e) => {
                        updateAddress(e);
                      }}
                    />
                    <div className="invalid-feedback"></div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      name="country"
                      value={currentAddresses.country}
                      required
                      onChange={(e) => {
                        updateAddress(e);
                      }}
                    />
                    <div className="invalid-feedback"></div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="Pincode">Pin Code</label>
                    <input
                      type="text"
                      className="form-control"
                      id="pincode"
                      placeholder=""
                      name="pincode"
                      value={currentAddresses.pincode}
                      required
                      onChange={(e) => {
                        updateAddress(e);
                      }}
                    />
                    <div className="invalid-feedback">
                      Valid first name is required.
                    </div>
                  </div>
                </div>
                <hr className="mb-4" />
                {showSave && (
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="save-info"
                      checked={saveAddress}
                      onClick={(e) => {
                        setSaveAddress(e.target.checked);
                      }}
                    />
                    <label className="custom-control-label" htmlFor="save-info">
                      Save this information for next time
                    </label>
                  </div>
                )}
                <div className="card p-2">
                  <button
                    className="btn btn-lg btn-block"
                    type="submit"
                    style={{ backgroundColor: " teal", color: "white" }}
                  >
                    Continue to checkout
                  </button>
                </div>
              </form>
            </div>
          </div>
          <footer className="my-5 pt-5 text-muted text-center text-small"></footer>
        </div>
      </div>
    </>
  );
}

export default CheckoutPage;
