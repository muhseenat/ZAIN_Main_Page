import React, { useState, useEffect } from "react";
import axios from "../axios";
import Announcement from "../components/Announcement";
import Navbar from "../components/Navbar";

function AddressPage() {

  const templateObj = {
    _id:"",
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


  const [userAddresses, setUserAddresses] = useState([]);
  const userId = localStorage.getItem("u_id");
  const [showform, setShowform] = useState(false);
  const [showupdate, setShowupdate] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);

  const [currentAddresses, setCurrentAddresses] = useState(templateObj);

 
  useEffect(() => {
    axios
      .get(`/order/getaddress/${userId}`)
      .then((resp) => {
        setUserAddresses(resp?.data?.address);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const editAddress =(id)=>{
    setShowform(true)
    setShowupdate(true)
    setShowAddButton(false);
    const address= userAddresses.find((i)=>i._id==id);
    setCurrentAddresses({...address});
  }

  const updateAddress = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setCurrentAddresses({ ...currentAddresses, [name]: value });
  };

  const showForm=()=>{
      setShowform(true);
      setShowAddButton(true);
      setShowupdate(false);
  }


  const EditAddress=(e)=>{
    e.preventDefault()
    const payload = {userId,currentAddresses}
    axios.put('/users/update-address',payload).then((resp)=>{
      setUserAddresses(resp.data?.address)
      setCurrentAddresses(templateObj)
      setShowform(false);
    }).catch((err)=>{
      console.log(err);
    })
  }

  
  const newAddress=(e)=>{
    e.preventDefault()
  
    const payload = {userId,currentAddresses}
    axios.put('/users/add-address',payload).then((resp)=>{
      setUserAddresses(resp.data?.address)
      setCurrentAddresses(templateObj)
      showForm(false)
    }).catch((err)=>{
      console.log(err);
    })
  }
  return (
    <>
      <Navbar />
      <Announcement />
      <div className="maincontainer">
        <div className="container">
          <div className="py-5 text-center">
            <h2>Address</h2>
          </div>
          
          <div >
           <div className="d-flex row justify-content-center">
           {userAddresses.length>0 && userAddresses.map((adr) => {
              return (
              
                <div className="card m-3 col-md-3">
                  <div className="card-body">
                    <h5 className="card-subtitle mb-2 text-muted">
                      {adr.fname}
                    </h5>
                    <p>{adr.address}</p>
                    <p className="card-text"> {adr.phone}</p>
                  </div>
                  <button className="btn btn-sm " type="button"style={{backgroundColor:" teal", color:"white"}} onClick={()=>editAddress(adr._id)}>Edit</button>

                </div>
              
               
              );
            })}
           </div>
           
            <br/>
            <button className="btn btn btn-block mb-3" type="button"style={{backgroundColor:" teal", color:"white"}} onClick={showForm}>Add New Address</button>
           
           {showform &&
            <form className="needs-validation" onSubmit={showAddButton?newAddress:EditAddress} >
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
                      Please enter a valid email address htmlFor shipping updates.
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
                
               
            {showupdate &&
              <button className="btn btn btn-block mb-3" type="submit" style={{backgroundColor:" teal", color:"white"}} >Update</button>
            }
            {showAddButton &&
              <button className="btn btn btn-block mb-3" type="submit" style={{backgroundColor:" teal", color:"white"}} >Add</button>
            }

              </form>
           
           }
           
           



          </div>








        </div>
      </div>
    </>
  );
}

export default AddressPage;
