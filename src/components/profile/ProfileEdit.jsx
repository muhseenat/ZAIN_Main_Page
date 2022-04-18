import React, { useState, useEffect } from "react";
import "./profile.css";
import {Link,useNavigate } from 'react-router-dom'
import { logout } from "../../redux/userRedux";
import { useDispatch } from "react-redux";
import axios from '../../axios'
function ProfileEdit() {

  const [user,setUser]=useState("")
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const id=localStorage.getItem('u_id')


  useEffect(()=>{
     axios.get(`/users/getuser/${id}`).then((resp)=>{
       setUser(resp.data?.resp)
     }).catch((err)=>{
       console.log(err);
     })
    
  },[])

 


  const handleLogout = () => {
    localStorage.removeItem("user-token");
    localStorage.removeItem("u_id");
    localStorage.removeItem("user");
    localStorage.removeItem("phone");
    localStorage.removeItem("cartId");
    dispatch(logout());
    navigate('/')
  };

  return (
    <div className="container">
      <div className="row profile">
        <div className="col-md-3">
          <div className="profile-sidebar">
         
            <div className="profile-usertitle">
              <div className="profile-usertitle-name">
                <span className="hidden-xs">{user.name}</span>
              </div>
            </div>
          
            <div className="profile-usermenu">
              <ul className="nav" style={{display:"flex",flexDirection:"column",marginLeft:"10px"}}>
                <li className="active">
                  <a>
                    <i className="glyphicon glyphicon-home"></i>
                    <span className="hidden-xs ">Personal</span>{" "}
                    </a>
                </li>
                <li style={{cursor:"pointer"}}><div>
                   <i className="glyphicon glyphicon-user"></i>
                    <span onClick={(e)=>navigate('/')} className="hidden-xs">Home</span>{" "}
                </div>
                    
                
                </li>
                <Link  to="/address" style={{textDecoration:"none",color:"inherit"}}><li>
                 
                 <i className="glyphicon glyphicon-ok"></i>
                 <span className="hidden-xs">Address</span>
              
             </li></Link>
                <Link  to="/orders" style={{textDecoration:"none",color:"inherit"}}><li>
                 
                 <i className="glyphicon glyphicon-ok"></i>
                 <span className="hidden-xs">Orders </span>
              
             </li></Link> 
             <Link  to="/cart" style={{textDecoration:"none",color:"inherit"}}><li>
                 
                 <i className="glyphicon glyphicon-shopping-cart"></i>
                 <span className="hidden-xs">Shopping Bag</span>
              
             </li></Link>
             <li style={{cursor:"pointer"}}>
                 
                 <i className="glyphicon glyphicon-shopping-cart"></i>
                 <span className="hidden-xs"  onClick={handleLogout}>Logout</span>
              
             </li>
               
              </ul>
            </div>
            
          </div>
        </div>
        <div className="col-md-9 order-content">
          <div className="form_main col-md-4 col-sm-5 col-xs-7">
            <h4 className="heading">
              <strong>User </strong> information<span></span>
            </h4>
            <div className="form">

            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>{user.phone}</p>
          
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileEdit;
